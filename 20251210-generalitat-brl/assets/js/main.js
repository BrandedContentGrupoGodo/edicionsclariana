document.addEventListener("DOMContentLoaded", () => {
  // ... la resta de codi que ja tinguis

  const trigger   = document.getElementById("case-caixes-trigger");
  const modal     = document.getElementById("case-caixes-modal");
  const closeBtn  = document.getElementById("case-caixes-close");
  const backdrop  = modal ? modal.querySelector(".case-modal__backdrop") : null;

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");   // 🔒 bloqueja scroll del body
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open"); // 🔓 torna el scroll
  };

  if (trigger)  trigger.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeModal();
  });
});
