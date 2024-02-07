import express from "express";
import DriveController from "../controllers/drive.controller";

const router = express.Router();

router.post("/download", DriveController.download);

export default router;
