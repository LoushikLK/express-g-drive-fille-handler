import { createReadStream, createWriteStream } from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import logger from "./logger.service";

/**
 * The Singleton class defines the `instance` method that lets clients access
 * the unique singleton instance.
 */
class TransferService {
  private static instance: TransferService;
  private uploadStatus: string = "pending";
  private downloadStatus: string = "pending";
  private progress: number = 0;
  public googleAuth: OAuth2Client = new google.auth.OAuth2();

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
   * Downloads a file to the specified folder.
   *
   * @param {string} fileId - the ID of the file to be download
   * @param {string} destinationPath - destination of the file to be downloaded
   *
   **/
  public async downloadFile(
    fileId: string,
    destinationPath: string,
    token: string
  ) {
    try {
      this.googleAuth.setCredentials({
        access_token: token,
      });

      let drive = google.drive({
        version: "v3",
        auth: this.googleAuth,
      });

      const download = await drive.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        {
          responseType: "stream",
        }
      );

      download.data.on("error", (error) => {
        logger.error(error);
        this.downloadStatus = "error";
      });

      download.data.on("end", () => {
        logger.info("Downloaded completed");
        this.downloadStatus = "complete";
      });

      const writeStream = createWriteStream(destinationPath);

      download.data.pipe(writeStream);
      return true;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Uploads a file to the specified folder.
   *
   * @param {string} folderId - the ID of the folder to upload the file to
   * @param {string} srcPath - source of the file
   *
   **/
  public async uploadFile(folderId: string, srcPath: string, token: string) {
    try {
      const readStream = createReadStream(srcPath);

      this.googleAuth.setCredentials({
        access_token: token,
      });

      let drive = google.drive({
        version: "v3",
        auth: this.googleAuth,
      });

      readStream.on("error", (error) => {
        logger.error(error);
        this.uploadStatus = "error";
      });

      readStream.on("end", () => {
        logger.info("Upload completed");
        this.uploadStatus = "completed";
      });

      const requestBody = {
        name: srcPath,
        mimeType: srcPath,
      };
      const media = {
        mimeType: srcPath,
        body: readStream,
      };

      const response = await drive.files.create({
        requestBody: requestBody,
        media: media,
        fields: folderId,
      });

      return response.data.id;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public getDownloadStat() {
    try {
      return {
        downloadStatus: this.downloadStatus,
        progress: this.progress,
        uploadStatus: this.uploadStatus,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default TransferService;
