import cors from "cors";
import express, { Application } from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import logger from "../services/logger.service";
import { IUser } from "../types/user";
import PassportService from "./passport.middleware";

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

  //create session
  app.use(
    session({
      secret: String(process.env.PASSPORT_SECRET),
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
    })
  );

  app.use(passport.initialize());

  //authenticate using session
  app.use(passport.authenticate("session"));

  //load passport strategies

  new PassportService().passportGoogleLoginStrategy();

  //passport middleware to serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user as IUser);
  });

  passport.deserializeUser(async (user, done) => {
    done(null, user as IUser);
  });

  app.use(helmet());

  //set up logger for all requests
  app.use((req, res, next) => {
    logger.info(req?.user);

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
