import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { createError } from "../utils/responseUtils.js";
import {
  validateUserSignUpData,
  createAuthTemplateData,
  createJwt
} from "../utils/authUtils.js";
import {
  STATUS_CODES,
  MONGOOSE_DUPLICATE_KEY_ERROR_CODE,
  AUTH_VIEW_PATH,
  SIGNUP_VIEW_NAME,
  LOGIN_VIEW_NAME
} from "../utils/constants.js";

function showLoginPage(req, res) {
  res.render(
    AUTH_VIEW_PATH,
    createAuthTemplateData({ viewName: LOGIN_VIEW_NAME })
  );
}

function showSignUpPage(req, res) {
  res.render(
    AUTH_VIEW_PATH,
    createAuthTemplateData({ viewName: SIGNUP_VIEW_NAME })
  );
}

async function signup(req, res, next) {
  try {
    // validation is done in the controller instead of in the
    // mongoose schema to simplify showing validation errors
    // on the frontend
    const userData = validateUserSignUpData(req.body);

    // hash password
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = new User(userData);
    await user.save();

    const data = createAuthTemplateData({
      viewName: SIGNUP_VIEW_NAME,
      message: "Registration successful"
    });
    res.status(STATUS_CODES.created).render(AUTH_VIEW_PATH, data);
  } catch (error) {
    // handle duplicate email error
    if (error.name === "MongoServerError") {
      if (error.code === MONGOOSE_DUPLICATE_KEY_ERROR_CODE) {
        error.data = createAuthTemplateData({
          viewName: SIGNUP_VIEW_NAME,
          view: AUTH_VIEW_PATH,
          errors: { email: "email already exists, use a different email" }
        });
        error.statusCode = STATUS_CODES.badRequest;
      }
    }

    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // find the user with the provided email in the database
    const user = await User.findOne({ email }).exec();
    let isPasswordCorrect = false;

    if (user) {
      // compare provided password with the one saved in the database
      isPasswordCorrect = await bcrypt.compare(password, user.password);
    }

    if (!user || !isPasswordCorrect) {
      const data = createAuthTemplateData({
        viewName: LOGIN_VIEW_NAME,
        view: AUTH_VIEW_PATH,
        errorMsg: "invalid email / password combination"
      });
      throw createError(STATUS_CODES.unauthorized, data);
    }

    // user credentials are correct, create JWT
    const jwt = await createJwt(user._id);
    const isInProduction = process.env.NODE_ENV === "production";
    // send the token to the client in a cookie
    const DAYS_IN_WEEK = 7;
    const HOURS_IN_DAY = 24;
    const MILLIS_IN_HOUR = 3600000;
    res.cookie("_token", jwt, {
      httpOnly: isInProduction,
      secure: isInProduction,
      maxAge: DAYS_IN_WEEK * HOURS_IN_DAY * MILLIS_IN_HOUR // expire after one week
    });

    res.redirect("/notes"); // redirect to home page
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("_token");
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
}

export { showLoginPage, showSignUpPage, signup, login, logout };
