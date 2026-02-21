(() => {
  /* =========================
     FOOTER YEAR
  ========================= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================
     MODAL / POPUP
  ========================= */
  let lastTrigger = null;

  function openModal(modal, triggerEl) {
    if (!modal) return;
    lastTrigger = triggerEl || null;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn =
      modal.querySelector(".modal__close") ||
      modal.querySelector("[data-modal-close]");

    closeBtn?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-modal-open]");
    if (opener) {
      const modalId = opener.getAttribute("data-modal-open");
      openModal(document.getElementById(modalId), opener);
      return;
    }

    const closer = e.target.closest("[data-modal-close]");
    if (closer) {
      const modal = closer.closest(".modal");
      closeModal(modal);
      return;
    }

    if (e.target.classList?.contains("modal__overlay")) {
      const modal = e.target.closest(".modal");
      closeModal(modal);
    }
  });

  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const isOpener =
      active && active.matches?.("[data-modal-open]");

    if (isOpener && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const modalId = active.getAttribute("data-modal-open");
      openModal(document.getElementById(modalId), active);
      return;
    }

    if (e.key === "Escape") {
      const modal = document.querySelector(".modal.is-open");
      if (modal) closeModal(modal);
    }
  });

  /* =========================
     FAQ / ACORDIÓ
  ========================= */
  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    const items = Array.from(accordion.querySelectorAll(".faq-item"));

    function closeAll(exceptItem) {
      items.forEach((it) => {
        if (it === exceptItem) return;
        it.classList.remove("is-open");
        const btn = it.querySelector(".faq-q");
        btn?.setAttribute("aria-expanded", "false");
      });
    }

    accordion.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-q");
      if (!btn) return;

      const item = btn.closest(".faq-item");
      const willOpen = !item.classList.contains("is-open");

      closeAll(item);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  }

  /* =========================
     CALL CARDS / FLIP
  ========================= */
  const flippableCards = document.querySelectorAll(".call-card--flippable");

  flippableCards.forEach((card) => {
    // Accesibilidad
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    function toggleFlip() {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    }

    // Click
    card.addEventListener("click", () => {
      toggleFlip();
    });

    // Teclado
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  // (Opcional) Cerrar tarjetas al clicar fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".call-card--flippable")) {
      flippableCards.forEach((card) => {
        card.classList.remove("is-flipped");
        card.setAttribute("aria-pressed", "false");
      });
    }
  });
})();
