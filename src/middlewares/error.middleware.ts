import { Application, NextFunction, Request, Response } from "express";

const errorHandler = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    res.json({
      success: false,
      message: "Not found",
    });
  });

  app.use(
    (error: any, request: Request, response: Response, next: NextFunction) => {
      response.status = error?.status || 500;
      response.json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  );
};

export default errorHandler;
