import { google } from "googleapis";
import TransferService from "../services/upload.service";

export const downloadFile = async () => {
  try {
    return true;
  } catch (error) {
    throw error;
  }
};
export const transferFile = async (
  srcFileId: string,
  destFolderId: string,
  token: string
) => {
  try {
    const srcPath = new Date().getTime().toString();

    TransferService.getInstance().downloadFile(srcFileId, srcPath, token);
    TransferService.getInstance().uploadFile(destFolderId, srcPath, token);

    return true;
  } catch (error) {
    throw error;
  }
};
export const listAlFiles = async (pageSize: number, token: string) => {
  try {
    const googleAuth = new google.auth.OAuth2();

    googleAuth.setCredentials({
      access_token: token,
    });

    let drive = google.drive({
      version: "v3",
      auth: googleAuth,
    });

    const allFiles = await drive.files.list({
      pageSize, // Specify the maximum number of files to return per page
      fields: "nextPageToken, files(id, name)", // Specify the fields to include in the response,
    });

    return allFiles.data;
  } catch (error) {
    throw error;
  }
};
