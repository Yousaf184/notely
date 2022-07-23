const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");

deleteConfirmBtn.addEventListener("click", () => {
  deleteConfirmBtn.classList.add("spin");
  deleteConfirmBtn.setAttribute("disabled", true);
});
