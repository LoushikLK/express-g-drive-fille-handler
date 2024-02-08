import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";
import { verifyToken } from "../services/jwt.service";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers?.authorization)
      throw new Unauthorized("User is not authorized.");

    const token = req.headers?.authorization.split(" ")[1];

    if (!token) throw new Unauthorized("User is not authorized.");

    const user = verifyToken(token);

    req.user = user;

    next();
  } catch (error) {
    const err = error as Error;
    res.status(401).json({
      success: false,
      msg: err.message,
    });
  }
}
