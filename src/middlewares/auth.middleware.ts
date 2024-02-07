import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.isAuthenticated())
      throw new Unauthorized("User is not authorized.");

    next();
  } catch (error) {
    const err = error as Error;
    res.status(401).json({
      success: false,
      msg: err.message,
    });
  }
}
