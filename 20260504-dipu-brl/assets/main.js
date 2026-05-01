// OBRIR
document.querySelectorAll(".btn-popup").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.popup;
    document.getElementById(id).classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// TANCAR
document.querySelectorAll(".popup__close, .popup__overlay").forEach(el => {
  el.addEventListener("click", () => {
    el.closest(".popup").classList.remove("active");
    document.body.style.overflow = "";
  });
});