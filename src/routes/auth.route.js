import express from "express";

import {
  login,
  logout,
  showLoginPage,
  showSignUpPage,
  signup
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";

const authRouter = express.Router();

authRouter.get("/login", isLoggedIn, showLoginPage);
authRouter.get("/logout", isLoggedIn, logout);
authRouter.get("/signup", isLoggedIn, showSignUpPage);

authRouter.post("/signup", signup);
authRouter.post("/login", login);

export default authRouter;
