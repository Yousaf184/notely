import path from "node:path";

import Note from "../models/note.model.js";

import { createError } from "../utils/responseUtils.js";
import {
  DELETE_NOTE_VIEW_PATH,
  NEW_EDIT_NOTE_VIEW_PATH,
  STATUS_CODES
} from "../utils/constants.js";
import {
  createOrEditNoteTemplateData,
  validateNoteData,
  convertMarkdownToHTML,
  createDeleteNoteTemplateData
} from "../utils/notesUtils.js";

async function showHomePage(req, res, next) {
  try {
    const userNotes = await Note.find({ createdBy: req.userId })
      .select({ content: 0, updatedAt: 0, createdBy: 0 })
      .exec();

    const HOME_VIEW_PATH = path.join("pages", "home");
    res.render(HOME_VIEW_PATH, { userNotes });
  } catch (error) {
    next(error);
  }
}

async function showNewOrEditNotePage(req, res) {
  try {
    const { noteId } = req.params;
    const data = createOrEditNoteTemplateData();

    if (noteId) {
      data.title = "Edit Note";
      data.inEditMode = true;

      const noteToEdit = await Note.findById(noteId).exec();

      if (!noteToEdit) {
        res.status(400).redirect("/notes");
        return;
      } else {
        data.noteToEdit = noteToEdit;
      }
    }

    res.render(NEW_EDIT_NOTE_VIEW_PATH, data);
  } catch (error) {
    next(error);
  }
}

async function createNote(req, res, next) {
  const isEditMode = req.body.id != undefined;

  try {
    const noteData = validateNoteData(req.body);
    noteData.createdBy = req.userId;

    const note = new Note(noteData);

    // "save" method will update an existing note if "isNew" property is false.
    // otherwise, a new note will be created by the "save" method.
    //
    // id will be available in case of note update request
    if (isEditMode) {
      note.isNew = false;
      note._id = req.body.id;
    }

    await note.save();

    const message = isEditMode
      ? "Note updated successfully"
      : "Note created successfully";

    const data = createOrEditNoteTemplateData({ message });
    res.status(STATUS_CODES.created).render(NEW_EDIT_NOTE_VIEW_PATH, data);
  } catch (error) {
    next(error);
  }
}

async function showDeleteNotePage(req, res) {
  const { noteId } = req.params;
  const data = createDeleteNoteTemplateData({ noteId });
  res.render(DELETE_NOTE_VIEW_PATH, data);
}

async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params;
    const result = await Note.deleteOne({ _id: noteId }).exec();

    if (result.deletedCount === 1) {
      res.render(DELETE_NOTE_VIEW_PATH, {
        message: "note deleted successfully"
      });
    } else {
      const data = createDeleteNoteTemplateData({
        view: DELETE_NOTE_VIEW_PATH,
        errorMsg: "note with the given id doesn't exists"
      });
      throw createError(STATUS_CODES.badRequest, data);
    }
  } catch (error) {
    next(error);
  }
}

async function showNoteDetailsPage(req, res, next) {
  try {
    const note = await Note.findById(req.params.noteId).exec();

    if (!note) {
      res.redirect("/notes");
    } else {
      // overwrite the "content" property with the HTML string
      // generated after parsing the markdown
      note.content = await convertMarkdownToHTML(note.content);

      const NOTE_DETAILS_VIEW_PATH = path.join("pages", "note");
      res.render(NOTE_DETAILS_VIEW_PATH, note);
    }
  } catch (error) {
    next(error);
  }
}

async function showNotePreview(req, res, next) {
  try {
    const { noteContent } = req.body;
    const htmlStr = await convertMarkdownToHTML(noteContent);
    res.status(STATUS_CODES.ok).json({ htmlStr });
  } catch (error) {
    next(error);
  }
}

export {
  showHomePage,
  showNewOrEditNotePage,
  createNote,
  showDeleteNotePage,
  deleteNote,
  showNoteDetailsPage,
  showNotePreview
};
