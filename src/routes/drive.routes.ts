import express from "express";
import DriveController from "../controllers/drive.controller";

const router = express.Router();

router.post("/download", DriveController.download);
router.post("/transfer-file", DriveController.transferFile);
router.get("/all-files", DriveController.getAllFiles);

export default router;
