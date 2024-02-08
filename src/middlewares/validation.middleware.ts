import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware function to format and handle validation errors
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export default async function validator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check for validation errors
    const errors = validationResult(req).formatWith(({ msg }) => `${msg}`);
    if (!errors.isEmpty()) {
      // If there are validation errors, return a 422 status code and the error messages
      return res
        .status(422)
        .json({ msg: errors.array().join(" and "), success: false });
    }
    // If no validation errors, proceed to the next middleware
    next();
  } catch (error) {
    // If an error occurs, return a 500 status code and a general error message
    res
      .status(500)
      .json({ msg: "Validation Failed Server Error", success: false });
  }
}
