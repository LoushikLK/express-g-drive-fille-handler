import { NextFunction, Request, Response } from "express";
import {
  downloadFile,
  listAlFiles,
  transferFile,
} from "../functions/drive.function";
import { IUser } from "../types/user";

const DriveController = {
  download: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await downloadFile();

      res.json({
        success: true,
        message: "Downloaded successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  transferFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { srcFileId, destFolderId } = req.body;

      await transferFile(
        srcFileId,
        destFolderId,
        (req?.user as IUser)?.googleAccessToken
      );

      res.json({
        success: true,
        message: "Transferred successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  getAllFiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageSize } = req?.query;

      const allFiles = await listAlFiles(
        typeof Number(pageSize) === "number" ? Number(pageSize) : 10,
        (req?.user as IUser)?.googleAccessToken
      );

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
