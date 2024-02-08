import express from "express";
import DriveController from "../controllers/drive.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/transfer-file", isAuthenticated, DriveController.transferFile);
router.get("/status", isAuthenticated, DriveController.getStatus);
router.get("/all-files", isAuthenticated, DriveController.getAllFiles);

export default router;
