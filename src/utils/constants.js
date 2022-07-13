import path from "node:path";

export const STATUS_CODES = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  created: 201,
  ok: 200,
  serverError: 500
};

export const MONGOOSE_DUPLICATE_KEY_ERROR_CODE = 11000;
export const INVALID_CREDENTIALS_ERROR_MSG =
  "invalid email / password combination";

// view path
export const AUTH_VIEW_PATH = path.join("pages", "auth");
export const SIGNUP_VIEW_NAME = "signup";
export const LOGIN_VIEW_NAME = "login";
export const NEW_EDIT_NOTE_VIEW_PATH = path.join("pages", "newOrEditNote");
export const DELETE_NOTE_VIEW_PATH = path.join("pages", "deleteNote");
export const ERROR_VIEW_PATH = path.join("pages", "error");
