import express from "express";
import DriveController from "../controllers/drive.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

//transfer file route
router.post("/transfer-file", isAuthenticated, DriveController.transferFile);
//get transfer status
router.get("/status", isAuthenticated, DriveController.getStatus);
//get all files from google drive
router.get("/all-files", isAuthenticated, DriveController.getAllFiles);

export default router;
