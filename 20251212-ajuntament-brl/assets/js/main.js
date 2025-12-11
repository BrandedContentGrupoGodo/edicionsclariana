// =========================
// ACORDIÓ DESMENTINT RUMORS
// =========================

const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.closest(".accordion-item");

    // opcional: tancar la resta perquè només n’hi hagi un d’obert
    document
      .querySelectorAll(".accordion-item.is-open")
      .forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
        }
      });

    // alternar l’actual
    item.classList.toggle("is-open");
  });
});

// =========================
// POPUP REGISTRE DE SOL·LICITANTS
// =========================

const popupTrigger = document.getElementById("register-popup-trigger");
const popupModal = document.getElementById("register-modal");

if (popupTrigger && popupModal) {
  const closeButtons = popupModal.querySelectorAll("[data-close-modal]");

  const openModal = () => {
    popupModal.classList.add("is-visible");
    popupModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    popupModal.classList.remove("is-visible");
    popupModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  popupTrigger.addEventListener("click", openModal);

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  // tancar si es fa clic fora del diàleg
  popupModal.addEventListener("click", (e) => {
    if (e.target === popupModal || e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  });

  // tancar amb ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popupModal.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

