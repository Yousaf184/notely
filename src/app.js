import path from "node:path";

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import expressErrorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import notesRouter from "./routes/notes.route.js";
import { ERROR_VIEW_PATH, STATUS_CODES } from "./utils/constants.js";

const app = express();

// set up template engine
app.set("view engine", "ejs");
app.set("views", path.join("src", "views"));

// middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routers
app.use("/auth", authRouter);
app.use(["/notes", "/"], notesRouter);

// 404 - unknown route handler
app.use((req, res, next) => {
  res.status(STATUS_CODES.notFound).render(ERROR_VIEW_PATH, {
    errorMessage: "404 - Page not found"
  });
});

// middleware for handling errors
app.use(expressErrorHandler);

export default app;
