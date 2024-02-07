import cors from "cors";
import express, { Application } from "express";
import logger from "../services/logger.service";

//setup middlewares
const topLevelMiddlewares = (app: Application) => {
  //parse incoming request body as JSON
  app.use(express.json());

  //parse incoming request body as URL encoded
  app.use(express.urlencoded({ extended: true }));

  //set up cors
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );

  //set up logger for all requests
  app.use((req, res, next) => {
    logger.info([
      {
        method: req.method,
        url: req.url,
        ip: req.ip,
      },
    ]);

    //call next middleware
    next();
  });
};

export default topLevelMiddlewares;
