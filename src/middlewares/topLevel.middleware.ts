import cors from "cors";
import express, { Application } from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import logger from "../services/logger.service";
import { IUser } from "../types/user";
import PassportService from "./passport.middleware";

/**
 * Set up middlewares for the application
 * @param {Application} app - The Express Application
 */
const topLevelMiddlewares = (app: Application) => {
  // Parse incoming request body as JSON
  app.use(express.json());

  // Parse incoming request body as URL encoded
  app.use(express.urlencoded({ extended: true }));

  // Set up CORS
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );

  // Create session
  app.use(
    session({
      secret: String(process.env.PASSPORT_SECRET),
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
    })
  );

  // Initialize passport
  app.use(passport.initialize());

  // Authenticate using session
  app.use(passport.authenticate("session"));

  // Load passport strategies
  new PassportService().passportGoogleLoginStrategy();

  // Passport middleware to serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user as IUser);
  });

  passport.deserializeUser(async (user, done) => {
    done(null, user as IUser);
  });

  // Use helmet for security headers
  app.use(helmet());

  // Set up logger for all requests
  app.use((req, res, next) => {
    logger.info(req?.user);

    logger.info([
      {
        method: req.method,
        url: req.url,
        ip: req.ip,
      },
    ]);

    // Call next middleware
    next();
  });
};

export default topLevelMiddlewares;
