import { NextFunction, Request, Response } from "express";
import {
  downloadDriveFile,
  getFileStatus,
  listAlFiles,
  transferFile,
} from "../functions/drive.function";
import { IUser } from "../types/user";

const DriveController = {
  /**
   * A function to transfer a file from source to destination folder.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves when the file transfer is completed
   */
  downloadFile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // get the source file id and destination folder id from the request body
      const { srcFileId } = req.params;

      // call the download function with the source file id  and user's google access token
      const stream = await downloadDriveFile(
        srcFileId,
        (req?.user as IUser)?.googleAccessToken
      );

      //pipe the stream to the response
      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  },
  /**
   * A function to transfer a file from source to destination folder.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves when the file transfer is completed
   */
  transferFile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // get the source file id and destination folder id from the request body
      const { srcFileId, destFolderId } = req.body;

      // call the transferFile function with the source file id, destination folder id, and user's google access token
      await transferFile(
        srcFileId,
        destFolderId,
        (req?.user as IUser)?.googleAccessToken
      );

      // return a success response
      res.json({
        success: true,
        message: "Transfer started",
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * Asynchronous function to get the status.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves with the status data
   */
  getStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // call the getFileStatus function and get the status
      const status = await getFileStatus();

      // return a success response with the status
      res.json({
        success: true,
        message: "Transfer started",
        data: status,
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * A function to get all files asynchronously.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise with no return value
   */
  getAllFiles: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // get the page size from the query parameters
      const { pageSize } = req?.query;

      // call the listAlFiles function with the page size and user's google access token
      const allFiles = await listAlFiles(
        typeof Number(pageSize) === "number" ? Number(pageSize) : 10,
        (req?.user as IUser)?.googleAccessToken
      );

      // return a success response with the list of files
      res.json({
        success: true,
        message: "Fetched all files successfully",
        data: allFiles,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default DriveController;
