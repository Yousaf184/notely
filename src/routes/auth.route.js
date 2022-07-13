import express from "express";

import {
  login,
  showLoginPage,
  showSignUpPage,
  signup
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/login", showLoginPage);
authRouter.get("/signup", showSignUpPage);

authRouter.post("/signup", signup);
authRouter.post("/login", login);

export default authRouter;
