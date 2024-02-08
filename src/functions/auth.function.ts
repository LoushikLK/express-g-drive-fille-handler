import { NotFound } from "http-errors";
import { UserModel } from "../models/user.model";
import { generateToken } from "../services/jwt.service";
import { IUser } from "../types/user";

/**
 * Asynchronous function to generate an access token for the given user.
 *
 * @param {Partial<IUser>} incomingUser - the partial user object used to find the user by email
 * @return {Promise<string>} a promise that resolves to the new access token
 */
export const generateAccessToken = async (
  incomingUser: Partial<IUser>
): Promise<string> => {
  // Find user by email
  const user = await UserModel.findOne({
    email: incomingUser?.email,
  })
    .select("-__v -updatedAt -createdAt")
    .lean();

  // If user not found, throw an error
  if (!user) throw new NotFound("User not found.");

  // Generate new access token
  const newToken = await generateToken(user);

  return newToken;
};
