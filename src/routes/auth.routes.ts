import express from "express";
import passport from "passport";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

// Google login
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
    failureRedirect: "/",
  }),
  AuthController.createToken
);

export default router;
