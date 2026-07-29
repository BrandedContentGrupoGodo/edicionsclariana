const modal = document.querySelector(".modal");
const openModalButton = document.querySelector("[data-open-modal]");
const closeModalButton = document.querySelector("[data-close-modal]");
const sharePageButtons = document.querySelectorAll("[data-share-page]");
const whatsappShareLinks = document.querySelectorAll("[data-share-whatsapp]");
let lastFocusedElement = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const articleTitle =
  document.querySelector("[data-share-title]")?.dataset.shareTitle ||
  document.querySelector("h1")?.textContent.replace(/\s+/g, " ").trim() ||
  document.title;

function getShareUrl() {
  return window.location.href.split("#")[0];
}

function openModal() {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeModalButton?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

openModalButton?.addEventListener("click", openModal);
closeModalButton?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeModal();
  }
});

function setShareFeedback(message) {
  const shareButton = document.activeElement?.closest("[data-share-page]");
  if (!shareButton) return;
  const original = shareButton.dataset.originalLabel || shareButton.getAttribute("aria-label") || "";
  shareButton.dataset.originalLabel = original;
  shareButton.setAttribute("aria-label", message);
  shareButton.title = message;
  window.setTimeout(() => {
    shareButton.setAttribute("aria-label", original);
    shareButton.title = original;
  }, 1800);
}

sharePageButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: articleTitle, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(button.dataset.copiedLabel || "Enlace copiado");
    } catch {
      window.prompt(button.dataset.promptLabel || "Copia este enlace:", url);
    }
  });
});

if (whatsappShareLinks.length) {
  const text = encodeURIComponent(`${articleTitle} ${getShareUrl()}`);
  whatsappShareLinks.forEach((link) => {
    link.href = `https://wa.me/?text=${text}`;
  });
}

function formatSpanishNumber(value) {
  return Math.round(value).toLocaleString("es-ES");
}

function renderCount(element, value) {
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  element.textContent = `${prefix}${formatSpanishNumber(value)}${suffix}`;
}

function animateCount(element) {
  const end = Number(element.dataset.count);
  if (!Number.isFinite(end)) return;

  if (reducedMotion) {
    renderCount(element, end);
    return;
  }

  const duration = 3000;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    renderCount(element, end * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }

  renderCount(element, 0);
  requestAnimationFrame(frame);
}

function reserveFinalCountWidth(element) {
  const end = Number(element.dataset.count);
  if (!Number.isFinite(end)) return;
  const originalText = element.textContent;

  renderCount(element, end);
  element.style.setProperty("--count-width", `${element.offsetWidth}px`);
  element.textContent = originalText;
}

const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.seen = "true";
      entry.target
        .querySelectorAll("[data-count]")
        .forEach((element) => animateCount(element));
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll(".stats").forEach((section) => {
  section.querySelectorAll("[data-count]").forEach((element) => {
    reserveFinalCountWidth(element);
    renderCount(element, 0);
  });
  statsObserver.observe(section);
});

document.fonts?.ready.then(() => {
  document.querySelectorAll(".stats [data-count]").forEach((element) => {
    reserveFinalCountWidth(element);
    if (!element.closest(".stats")?.dataset.seen) renderCount(element, 0);
  });
});
