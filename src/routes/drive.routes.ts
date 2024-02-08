import express from "express";
import DriveController from "../controllers/drive.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import validator from "../middlewares/validation.middleware";
import {
  getAllFilesValidation,
  transferFileValidation,
} from "../validations/drive.validation";

const router = express.Router();

//transfer file route
router.get(
  "/download",
  transferFileValidation,
  validator,
  isAuthenticated,
  DriveController.transferFile
);
//transfer file route
router.post(
  "/transfer-file",
  transferFileValidation,
  validator,
  isAuthenticated,
  DriveController.transferFile
);
//get transfer status
router.get("/status", isAuthenticated, DriveController.getStatus);
//get all files from google drive
router.get(
  "/all-files",
  getAllFilesValidation,
  validator,
  isAuthenticated,
  DriveController.getAllFiles
);

export default router;
