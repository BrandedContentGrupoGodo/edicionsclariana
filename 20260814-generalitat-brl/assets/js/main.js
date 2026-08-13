const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".accordion").forEach((accordion) => {
  const button = accordion.querySelector("button");
  button?.addEventListener("click", () => {
    const isOpen = accordion.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const triage = document.querySelector(".triage");
if (triage) {
  if (reduced) {
    triage.classList.add("is-visible");
  } else {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        triage.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.25 }
    );
    observer.observe(triage);
  }
}

const modal = document.querySelector(".modal");
const modalOpen = document.querySelector("[data-modal-open]");
const modalClose = modal?.querySelector(".modal__close");
let lastFocus = null;

function openModal() {
  if (!modal) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus?.();
}

modalOpen?.addEventListener("click", openModal);
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) closeModal();
});

document.querySelectorAll("[data-youtube-id]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.youtubeId;
    if (!id) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = button.getAttribute("aria-label") || "Vídeo de YouTube";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    button.replaceChildren(iframe);
    button.classList.add("is-playing");
    button.setAttribute("aria-label", iframe.title);
  });
});
