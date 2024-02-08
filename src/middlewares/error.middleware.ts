import { Application, NextFunction, Request, Response } from "express";
import logger from "../services/logger.service";

/**
 * Error handling middleware for the Express application
 * @param {Application} app - The Express application
 */
const errorHandler = (app: Application) => {
  // Handle 404 errors
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.error({
      success: false,
      message: "Not found",
    });
    res.status(404); // Set the status code to 404

    // Return a JSON response with the error message
    res.json({
      success: false,
      message: "Not found",
    });
  });

  // Handle other errors
  app.use(
    (error: any, request: Request, response: Response, next: NextFunction) => {
      logger.error(error);

      response.status = error?.status || 500; // Set the status code or default to 500

      // Return a JSON response with the error message
      response.json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  );
};

export default errorHandler;
