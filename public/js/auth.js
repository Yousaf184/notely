const authFormsContainer = document.getElementById("authFormsContainer");

authFormsContainer.addEventListener("click", (event) => {
  const clickedElm = event.target;

  if (clickedElm.tagName === "BUTTON") {
    const parentAuthForm = clickedElm.closest("form");

    console.log("btn clicked");

    if (parentAuthForm.reportValidity()) {
      console.log("invalid form");
      clickedElm.setAttribute("disabled", true);
      clickedElm.classList.add("spin");
    } else {
      console.log("valid form");
    }
  }
});
