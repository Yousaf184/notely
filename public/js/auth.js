const authFormsContainer = document.getElementById("authFormsContainer");

authFormsContainer.addEventListener("click", (event) => {
  const clickedElm = event.target;

  if (clickedElm.tagName === "BUTTON") {
    const parentAuthForm = clickedElm.closest("form");

    if (parentAuthForm.reportValidity()) {
      clickedElm.setAttribute("disabled", true);
      clickedElm.classList.add("spin");
    }
  }
});
