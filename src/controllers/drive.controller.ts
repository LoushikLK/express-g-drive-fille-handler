import { NextFunction, Request, Response } from "express";
import { downloadFile } from "../functions/drive.function";

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
};

export default DriveController;
