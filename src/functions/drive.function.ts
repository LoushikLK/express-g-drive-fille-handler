import { google } from "googleapis";
import TransferService from "../services/upload.service";

/**
 * Transfers a file from a source file to a destination folder using the provided token.
 * @param {string} srcFileId - The ID of the source file.
 * @param {string} destFolderId - The ID of the destination folder.
 * @param {string} token - The authentication token.
 * @returns {boolean} - True if the transfer is successful.
 */
export const transferFile = async (
  srcFileId: string,
  destFolderId: string,
  token: string
): Promise<boolean> => {
  try {
    // Generate a unique path based on the current timestamp
    const srcPath = new Date().getTime().toString();

    // Download the file from the source and transfer it to the destination folder
    await TransferService.getInstance().downloadFile(
      srcFileId,
      srcPath,
      token,
      destFolderId
    );
    // await TransferService.getInstance().uploadFile(
    //   destFolderId,
    //   srcPath,
    //   token
    // );

    return true;
  } catch (error) {
    throw error;
  }
};
/**
 * Asynchronously fetches the file status using TransferService.
 * @returns {Promise} A promise that resolves with the file status data.
 */
export const getFileStatus = async (): Promise<any> => {
  try {
    // Fetch the file status using TransferService
    const data = TransferService.getInstance().getDownloadStat();
    return data;
  } catch (error) {
    throw error;
  }
};
/**
 * List all files from Google Drive
 * @param {number} pageSize - The maximum number of files to return per page
 * @param {string} token - The access token for Google Drive API
 * @returns {Promise<Object>} - A promise that resolves to the list of files
 */
export const listAlFiles = async (
  pageSize: number,
  token: string
): Promise<object> => {
  try {
    // Create a new instance of google OAuth2
    const googleAuth = new google.auth.OAuth2();

    // Set the access token for googleAuth
    googleAuth.setCredentials({
      access_token: token,
    });

    // Create a new instance of google drive
    let drive = google.drive({
      version: "v3",
      auth: googleAuth,
    });

    // Retrieve the list of files from Google Drive
    const allFiles = await drive.files.list({
      pageSize, // Specify the maximum number of files to return per page
      fields: "nextPageToken, files(id, name)", // Specify the fields to include in the response
    });

    return allFiles.data;
  } catch (error) {
    throw error;
  }
};
