document.addEventListener("DOMContentLoaded", () => {
  const toolItems = document.querySelectorAll(".tool-item");

  toolItems.forEach((item) => {
    const button = item.querySelector(".tool-item__header");
    if (!button) return;

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      toolItems.forEach((other) => {
        other.classList.remove("is-open");
        const otherButton = other.querySelector(".tool-item__header");
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".modal__close");
    if (closeButton) closeButton.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger.dataset.modal));
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.querySelectorAll("[data-close]").forEach((element) => {
      element.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document.querySelectorAll(".modal.is-open").forEach((modal) => {
      closeModal(modal);
    });
  });

  document.querySelectorAll(".placeholder-media img").forEach((image) => {
    image.addEventListener("error", () => image.remove());
  });
});
