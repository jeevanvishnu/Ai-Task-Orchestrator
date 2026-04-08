import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/user.model.ts";
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://ai-task-orchestrator-u46k.onrender.com/api/auth/google/callback"
}, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            return done(null, user);
        }
        const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
        });
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user: any, done: any) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: any, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;