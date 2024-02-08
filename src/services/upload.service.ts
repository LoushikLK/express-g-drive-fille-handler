import { createReadStream, createWriteStream, rmSync, unlinkSync } from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import path from "path";
import internal from "stream";
import logger from "./logger.service";

/**
 * The Singleton class defines the `instance` method that lets clients access
 * the unique singleton instance.
 */
class TransferService {
  private static instance: TransferService;
  private uploadStatus: string = "pending";
  private downloadStatus: string = "pending";
  private totalDownload: number = 0;
  private totalUploaded: number = 0;
  private progress: number = 0;
  private uploadProgress: number = 0;
  public googleAuth: OAuth2Client = new google.auth.OAuth2();
  private fileDetails: {
    name?: string;
    mimeType?: string;
    size?: number;
  } = {};

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): TransferService {
    if (!TransferService.instance) {
      TransferService.instance = new TransferService();
    }

    return TransferService.instance;
  }

  /**
   * Downloads the drive file .
   *
   * @param {string} fileId - the ID of the file to be download
   * @param {string} token - google access token
   *
   **/
  public async downloadFileOnly(
    fileId: string,
    token: string
  ): Promise<internal.Readable> {
    return new Promise(async (resolve, reject) => {
      try {
        //set the credentials to be used
        this.googleAuth.setCredentials({
          access_token: token,
        });

        //initiate the drive
        let drive = google.drive({
          version: "v3",
          auth: this.googleAuth,
        });

        //get the file details
        const res = await drive.files.get({ fileId, fields: "*" });
        const fileDetails = res.data;

        //set the file details to be used
        this.fileDetails = {
          name: fileDetails?.name || undefined,
          mimeType: fileDetails?.mimeType || undefined,
          size: fileDetails?.size ? Number(fileDetails?.size) : undefined,
        };

        //download the file to the destination
        const download = await drive.files.get(
          {
            fileId: fileId,
            alt: "media",
          },
          {
            responseType: "stream",
          }
        );

        //handle the events
        download.data.on("error", (error) => {
          logger.error(error);
          this.downloadStatus = "error";
        });

        download.data.on("end", () => {
          logger.info("Downloaded completed");
          this.downloadStatus = "complete";
        });

        download.data.on("data", (chunk) => {
          this.totalDownload += chunk.length;
          this.progress = Math.ceil(
            (this.totalDownload / (this.fileDetails.size || 0)) * 100
          );
        });

        resolve(download.data);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  }
  /**
   * Downloads a file to the specified folder.
   *
   * @param {string} fileId - the ID of the file to be download
   * @param {string} destinationPath - destination of the file to be downloaded
   * @param {string} token - google access token
   * @param {string} uploadFolder - google access token
   *
   **/
  public async downloadFile(
    fileId: string,
    destinationPath: string,
    token: string,
    uploadFolder?: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        //set the credentials to be used
        this.googleAuth.setCredentials({
          access_token: token,
        });

        //initiate the drive
        let drive = google.drive({
          version: "v3",
          auth: this.googleAuth,
        });

        //get the file details
        const res = await drive.files.get({ fileId, fields: "*" });
        const fileDetails = res.data;

        //set the file details to be used
        this.fileDetails = {
          name: fileDetails?.name || undefined,
          mimeType: fileDetails?.mimeType || undefined,
          size: fileDetails?.size ? Number(fileDetails?.size) : undefined,
        };

        //download the file to the destination
        const download = await drive.files.get(
          {
            fileId: fileId,
            alt: "media",
          },
          {
            responseType: "stream",
          }
        );

        //handle the events
        download.data.on("error", (error) => {
          logger.error(error);
          this.downloadStatus = "error";
        });

        download.data.on("end", () => {
          logger.info("Downloaded completed");
          this.downloadStatus = "complete";
          uploadFolder &&
            this.startUpload(uploadFolder, destinationPath, token);
        });

        download.data.on("data", (chunk) => {
          this.totalDownload += chunk.length;
          this.progress = Math.ceil(
            (this.totalDownload / (this.fileDetails.size || 0)) * 100
          );
        });

        let workingFolder = path.join(
          __dirname,
          "../../",
          "upload/",
          destinationPath
        );

        //create write
        const writeStream = createWriteStream(workingFolder);

        download.data.pipe(writeStream);

        // download.data.once("data", () => {
        //   resolve(true);
        // });
        resolve(true);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  }

  /**
   * A method to start the upload process for a file.
   *
   * @param {string} fileId - the identifier of the file to upload
   * @param {string} srcPath - the source path of the file to upload
   * @param {string} token - the authentication token for the upload process
   * @return {Promise<void>} a promise representing the completion of the upload process
   */

  public async startUpload(
    fileId: string,
    srcPath: string,
    token: string
  ): Promise<void> {
    try {
      logger.info(`Uploading file: ${srcPath}`);
      //run the upload procedure
      await this.uploadFile(fileId, srcPath, token);
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Uploads a file to the specified folder.
   *
   * @param {string} folderId - the ID of the folder to upload the file to
   * @param {string} srcPath - source of the file
   * @param {string} token - google access token
   *
   **/
  public async uploadFile(folderId: string, srcPath: string, token: string) {
    return new Promise(async (resolve, reject) => {
      try {
        //working file to be used
        let workingFile = path.join(__dirname, "../../", "upload/", srcPath);

        //create read stream for the file
        const readStream = createReadStream(workingFile);

        //handle the events
        readStream.on("error", (error) => {
          logger.error(error);
          this.uploadStatus = "error";
        });

        readStream.on("end", () => {
          try {
            logger.info("Upload completed");
            this.uploadStatus = "completed";
            unlinkSync(workingFile);
            rmSync(workingFile, { force: true });
          } catch (error) {
            logger.error(error);
          }
        });

        readStream.on("data", (chunk) => {
          this.totalUploaded += chunk.length;
          this.uploadProgress = Math.ceil(
            (this.totalUploaded / (this.fileDetails.size || 0)) * 100
          );
        });

        //set the credentials
        this.googleAuth.setCredentials({
          access_token: token,
        });

        //initiate the drive
        let drive = google.drive({
          version: "v3",
          auth: this.googleAuth,
        });

        const requestBody = {
          name: this.fileDetails.name,
          parents: [folderId],
        };
        const media = {
          mimeType: this.fileDetails.mimeType,
          body: readStream,
        };

        //upload the file
        const response = await drive.files.create({
          requestBody: requestBody,
          media: media,
          fields: "parents",
        });

        resolve(response.data.id);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  }

  public getDownloadStat() {
    try {
      return {
        downloadStatus: this.downloadStatus,
        downloadProgress: this.progress,
        uploadStatus: this.uploadStatus,
        totalDownload: this.totalDownload,
        fileDetails: this.fileDetails,
        totalUploaded: this.totalUploaded,
        uploadProgress: this.uploadProgress,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default TransferService;
