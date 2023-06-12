import passport from "passport";
import GitHubStrategyPackage from "passport-github2";
import session from "express-session";
import dotenv from "dotenv";
import { Router } from "express";
import AuthorModel from "../models/AuthorModel.js";
dotenv.config();

const GitHubStrategy = GitHubStrategyPackage.Strategy;

const oath2Router = Router();


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ["public_profile", "user:email"],
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(async function () {
        const  email = profile.emails[0].value
        const user = await AuthorModel.findOne({ email: email });
        return done(null, user);
      });
    }
  )
);

oath2Router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

oath2Router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: process.env.FE_BASE_URL + "/signup?message=user not found" }),
  (req, res, next) => {
    res.redirect("/oath2/success");
  }
);

oath2Router.get("/success", (req, res, next) => {
  res.redirect(process.env.FE_BASE_URL + "/oath2");
});

export default oath2Router;
