import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../functions/auth.function";
import { IUser } from "../types/user";
const AuthController = {
  createToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await generateAccessToken(req.user as IUser);
      res.redirect("/?token=" + token);
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
