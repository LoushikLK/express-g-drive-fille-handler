import { NotFound } from "http-errors";
import passport from "passport";

import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { UserModel } from "../models/user.model";

export default class PassportService {
  /**
   * Configure and use Passport Google login strategy
   */
  public async passportGoogleLoginStrategy() {
    // Configure the Google strategy for Passport
    passport.use(
      new GoogleStrategy(
        {
          clientID: String(process.env.GOOGLE_CLIENT_ID),
          clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
          callbackURL: String(process.env.GOOGLE_CALLBACK_URL),
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: VerifyCallback
        ) => {
          try {
            // Verify user with Google profile data
            const user = await UserModel.findOneAndUpdate(
              {
                email: profile?.emails?.[0].value,
              },
              {
                displayName: profile.displayName,
                googleAccessToken: accessToken,
                photoUrl: profile.photos?.[0].value,
                googleSecretToken: refreshToken,
              },
              {
                runValidators: true,
                lean: true,
                upsert: true,
                new: true,
              }
            );

            if (!user) throw new NotFound("User not found.");

            // Return user
            done(null, user);
          } catch (error) {
            // Return error
            if (error instanceof Error) {
              return done(error);
            }
            done(new Error("Something went wrong"));
          }
        }
      )
    );
  }
}
