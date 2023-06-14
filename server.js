import Express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import authorRouter from "./routes/authors.js";
import cors from "cors";
import blogRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
import verifyToken from "./middlewares/verifyToken.js";
import oath2Router from "./routes/oath2.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import GitHubStrategyPackage from "passport-github2";

dotenv.config();

const GitHubStrategy = GitHubStrategyPackage.Strategy;

mongoose
  .connect(process.env.DB_CONNECT_STRING)
  .then(() => console.log("db connected"))
  .catch((error) => console.log(error));

const app = Express();

app.use(Express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FE_BASE_URL, process.env.FE_BASE_URL2],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
      domain:"epiblog-backend.onrender.com",
      secure:true,
      sameSite:"none"
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.get("/", (req, res) => {
  res.status(500).json({ message: "Sei finito qui" });
});

app.use("/auth", authRouter);

app.use("/oath2", oath2Router);

app.use("/authors", verifyToken, authorRouter);

app.use("/posts", verifyToken, blogRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Page not found" });
});

app.use((error, req, res, next) => {
  return res.status(500).send({ message: "There was an internal error" });
});

app.listen(process.env.PORT, () =>
  console.log("Server is listening port:" + process.env.PORT)
);
