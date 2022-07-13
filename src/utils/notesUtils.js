import MarkdownIt from "markdown-it";
import shiki from "shiki";

import { NEW_EDIT_NOTE_VIEW_PATH, STATUS_CODES } from "./constants.js";
import { createError } from "./responseUtils.js";

export function convertMarkdownToHTML(markdownStr) {
  return shiki
    .getHighlighter({ theme: "material-palenight" })
    .then((highlighter) => {
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight(code, lang) {
          return highlighter.codeToHtml(code, { lang });
        }
      });

      const html = md.render(markdownStr);
      return html;
    });
}

// Any data used in the template MUST be passed to the template
// everytime - non-existent keys will produce errors.
export function createOrEditNoteTemplateData(data) {
  const defaults = {
    errors: undefined,
    message: undefined,
    inEditMode: false,
    title: "Create a Note",
    noteToEdit: undefined
  };
  return Object.assign(defaults, data);
}

// Any data used in the template MUST be passed to the template
// everytime - non-existent keys will produce errors.
export function createDeleteNoteTemplateData(data) {
  const defaults = { errorMsg: undefined, message: undefined };
  return Object.assign(defaults, data);
}

export function validateNoteData(noteData) {
  const { id, title, tags, noteContent } = noteData;
  const errors = {};

  if (title == undefined) {
    errors.title = "title is required";
  } else if (title.trim().length < 6) {
    errors.title = "title should be atleast 6 characters long";
  }

  if (noteContent == undefined || noteContent.trim().length === 0) {
    errors.noteContent = "note cannot be empty";
  }

  const hasErrors = errors.title || errors.noteContent;
  if (hasErrors) {
    const data = createOrEditNoteTemplateData({
      view: NEW_EDIT_NOTE_VIEW_PATH,
      errors,
      noteToEdit: {
        title,
        tags,
        content: noteContent
      }
    });

    // if "id" is not undefined, that means note is
    // being updated instead of creating new note.
    if (id) {
      data.noteToEdit._id = id;
      data.inEditMode = true;
    }

    throw createError(STATUS_CODES.badRequest, data);
  }

  return {
    title: title.trim(),
    tags: tags.split(/,\s*/g), // "js, react, node" ---> ["js", "react", "node"]
    content: noteContent.trim()
  };
}
