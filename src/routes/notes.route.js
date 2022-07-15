import express from "express";

import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import {
  createNote,
  deleteNote,
  showDeleteNotePage,
  showHomePage,
  showNewOrEditNotePage,
  showNoteDetailsPage
} from "../controllers/notes.controller.js";

const notesRouter = express.Router();

// Route-level middleware to protect all routes in this router.
// Routes in this router should only be accessible to an
// authenticated user.
notesRouter.use(isLoggedIn);

notesRouter.get("/", showHomePage);

notesRouter
  .route(["/new", "/:noteId/edit"])
  .get(showNewOrEditNotePage)
  .post(createNote);

// following route "/:noteId" should be after "/new" route to avoid matching
// :noteId path parameter with other paths, e.g. /new
notesRouter.get("/:noteId", showNoteDetailsPage);
notesRouter.route("/:noteId/delete").get(showDeleteNotePage).post(deleteNote);

// TODO: fix route ordering: http://localhost:3000/auth throws error

export default notesRouter;
