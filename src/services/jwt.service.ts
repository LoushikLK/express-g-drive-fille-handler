import { InternalServerError } from "http-errors";
import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Generate a JWT token with the given payload and options
 * @param payload - The payload for the JWT token
 * @param options - The options for signing the JWT token
 * @returns The generated JWT token
 */
export const generateToken = async (
  payload: string | object,
  options?: SignOptions
) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new InternalServerError("JWT secret is not found.");

  //generate token with payload using jet.sign method
  return jwt.sign(payload, jwtSecret, {
    expiresIn: options?.expiresIn || "1d",
  });
};
/**
 * Verify the provided JWT token using the secret key from the environment variables.
 * @param {string} token - The JWT token to be verified
 * @returns {object} - The decoded payload of the JWT token
 * @throws {InternalServerError} - If the JWT secret is not found in the environment variables
 */
export const verifyToken = (token: string): any => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new InternalServerError("JWT secret is not found.");

  //verify and return the payload
  return jwt.verify(token, jwtSecret);
};
