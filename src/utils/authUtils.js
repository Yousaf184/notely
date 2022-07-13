import util from "node:util";
import jwt from "jsonwebtoken";

import { createError } from "./responseUtils.js";
import { AUTH_VIEW_PATH, SIGNUP_VIEW_NAME, STATUS_CODES } from "./constants.js";

export function createJwt(userID) {
  // jwt.sign function doesn't return a promise;
  // util.promisify() is used to make jwt.sign() return a promise
  const promisifiedJwtSign = util.promisify(jwt.sign);

  const payload = { id: userID };
  const jwtOptions = { expiresIn: "1h" };
  return promisifiedJwtSign(payload, process.env.JWT_SECRET_KEY, jwtOptions);
}

// Any data used in the template MUST be passed to the template
// everytime - non-existent keys will produce errors.
export function createAuthTemplateData(data) {
  const defaults = {
    errors: undefined,
    message: undefined,
    errorMsg: undefined
  };
  return Object.assign(defaults, data);
}

export function validateUserSignUpData(userData) {
  const { name, email, password, confirmPassword } = userData;
  const errors = {};

  if (name == undefined) {
    errors.name = "name is required";
  } else if (name.trim().length < 3) {
    errors.name = "name should be atleast 3 characters long";
  }

  if (email == undefined || email.trim().length === 0) {
    errors.email = "email is required";
  }

  // password length validation should be done in the controller
  // instead of in the mongoose schema because the hashed password
  // will exceed the minimum password length
  const minPasswordLength = 6;
  if (password == undefined) {
    errors.password = "password is required";
  } else if (userData.password?.trim().length < minPasswordLength) {
    const errorMsg = `password should be atleast ${minPasswordLength} characters long`;
    errors.password = errorMsg;
  }

  if (password !== confirmPassword) {
    const errorMsg = "password and confirmed password don't match";
    errors.confirmPassword = errorMsg;
  }

  const hasErrors =
    errors.name || errors.email || errors.password || errors.confirmPassword;
  if (hasErrors) {
    const data = createAuthTemplateData({
      view: AUTH_VIEW_PATH,
      errors,
      viewName: SIGNUP_VIEW_NAME
    });

    throw createError(STATUS_CODES.badRequest, data);
  }

  return {
    name: name.trim(),
    email: email.trim(),
    password: password.trim()
  };
}
