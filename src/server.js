import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import config from "./config";
import cors from "cors";
import { signin, signup, protect } from "./utils/auth";
import userRouter from "./resources/user/user.router";
import recipeRouter from "./resources/recipe/recipe.router";
import { connect } from "./utils/db";

export const app = express();

app.disable("x-powered-by");

app.use(cors());

app.use(json());

app.use(urlencoded({ extended: true }));

app.use(morgan("dev"));

app.post("/api/recipe/signin", signin);
app.post("/api/recipe/signup", signup);

app.use("/api/recipe/auth", protect);
app.use("/api/recipe/auth/user", userRouter);
app.use("/api/recipe", recipeRouter);

export const start = async () => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`API server up on ${config.port}`);
    });
  } catch (e) {
    console.error(`an error occurred: ${e}`);
  }
};
