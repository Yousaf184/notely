const newNoteBtn = document.getElementById("newNoteBtn");
const notesListContainer = document.getElementById("notesListContainer");

newNoteBtn.addEventListener("click", () => {
  window.location.href = "/notes/new";
});

notesListContainer.addEventListener("click", (event) => {
  const clickedElement = event.target;

  const classList = clickedElement.classList;
  const isEditBtn =
    classList.contains("editNoteBtn") || classList.contains("editIcon");
  const isDeleteBtn =
    classList.contains("deleteNoteBtn") || classList.contains("deleteIcon");

  const noteElement = clickedElement.closest(".note");

  if (noteElement) {
    const noteId = noteElement.dataset.id;

    if (!isEditBtn && !isDeleteBtn) {
      window.location.href = "/notes/" + noteId;
    } else if (isEditBtn) {
      window.location.href = "/notes/" + noteId + "/edit";
    } else if (isDeleteBtn) {
      window.location.href = "/notes/" + noteId + "/delete";
    }
  }
});
