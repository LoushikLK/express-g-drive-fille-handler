import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
    failureRedirect: "/",
  })
);

export default router;
