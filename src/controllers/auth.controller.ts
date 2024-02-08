import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../functions/auth.function";
import { IUser } from "../types/user";
const AuthController = {
  /**
   * Async function to create a token using the given request, response, and next function.
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function
   * @return {Promise<void>} A promise that resolves with no value
   */
  createToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = await generateAccessToken(req.user as IUser);
      res.redirect("/?token=" + token);
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
