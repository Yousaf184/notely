const newNoteBtn = document.getElementById("newNoteBtn");
const notesListContainer = document.getElementById("notesListContainer");

newNoteBtn.addEventListener("click", () => {
  window.location.href = "/notes/new";
});

notesListContainer.addEventListener("click", (event) => {
  const clickedElement = event.target;
  const noteElement = clickedElement.closest(".note");

  if (noteElement) {
    const noteId = noteElement.dataset.id;

    const editBtn = noteElement.querySelector(".editNoteBtn");
    const deleteBtn = noteElement.querySelector(".deleteNoteBtn");

    const isEditBtn =
      clickedElement === editBtn || editBtn.contains(clickedElement);
    const isDeleteBtn =
      clickedElement === deleteBtn || deleteBtn.contains(clickedElement);

    if (!isEditBtn && !isDeleteBtn) {
      window.location.href = "/notes/" + noteId;
    } else if (isEditBtn) {
      window.location.href = "/notes/" + noteId + "/edit";
    } else if (isDeleteBtn) {
      window.location.href = "/notes/" + noteId + "/delete";
    }
  }
});
