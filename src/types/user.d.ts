import { Document } from "mongoose";

export interface IUser extends Document {
  displayName: string;
  email: string;
  token: string;
  photoUrl: string;
  googleId: string;
  googleAccessToken: string;
  googleSecretToken: string;
}
