import cors from "cors";
import express, { Application } from "express";

const topLevelMiddlewares = (app: Application) => {
  //setup middlewares
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    console.table([
      {
        method: req.method,
        url: req.url,
        ip: req.ip,
      },
    ]);

    next();
  });
};

export default topLevelMiddlewares;
