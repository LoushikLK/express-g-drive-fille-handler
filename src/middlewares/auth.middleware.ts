import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";
import { verifyToken } from "../services/jwt.service";

/**
 * Middleware to check if the user is authenticated
 * @param req - the request object
 * @param res - the response object
 * @param next - the next function
 */
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check if the request has an authorization header
    if (!req.headers?.authorization)
      throw new Unauthorized("User is not authorized.");

    // Extract the token from the authorization header
    const token = req.headers?.authorization.split(" ")[1];

    // If token is not found, throw an unauthorized error
    if (!token) throw new Unauthorized("User is not authorized.");

    // Verify the token and get user information
    const user = verifyToken(token);

    // Attach the user information to the request object
    req.user = user;

    // Call the next middleware
    next();
  } catch (error) {
    // Handle any errors and send a 401 unauthorized response
    const err = error as Error;
    res.status(401).json({
      success: false,
      msg: err.message,
    });
  }
}
