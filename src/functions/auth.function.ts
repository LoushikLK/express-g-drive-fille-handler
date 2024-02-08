import { NotFound } from "http-errors";
import { UserModel } from "../models/user.model";
import { generateToken } from "../services/jwt.service";
import { IUser } from "../types/user";

export const generateAccessToken = async (incomingUser: Partial<IUser>) => {
  //find user by email
  const user = await UserModel.findOne({
    email: incomingUser?.email,
  })
    .select("-__v -updatedAt -createdAt")
    .lean();

  if (!user) throw new NotFound("User not found.");

  const newToken = await generateToken(user);
  return newToken;
};
