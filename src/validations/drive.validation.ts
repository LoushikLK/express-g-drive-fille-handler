import { body, param, query } from "express-validator";

export const transferFileValidation = [
  body("srcFileId").notEmpty().withMessage("Source file id is required"),
  body("destFolderId")
    .notEmpty()
    .withMessage("Destination folder id is required"),
];
export const downloadFileValidation = [
  param("srcFileId").notEmpty().withMessage("Source file id is required"),
];

export const getAllFilesValidation = [
  query("pageSize")
    .notEmpty()
    .withMessage("Page size is required")
    .isNumeric()
    .withMessage("Page size must be a number"),
];
