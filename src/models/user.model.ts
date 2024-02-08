import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/user";

// Create user schema
const userSchema = new Schema<IUser, Model<IUser>>({
  displayName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  token: String,
  photoUrl: String,
  googleId: String,
  googleAccessToken: String,
  googleSecretToken: String,
});

// Create user model
export const UserModel = model<IUser, Model<IUser>>("User", userSchema);
