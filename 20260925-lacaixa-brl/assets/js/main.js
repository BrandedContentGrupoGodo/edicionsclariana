const sharePageButtons = document.querySelectorAll("[data-share-page]");
const whatsappShareLinks = document.querySelectorAll("[data-share-whatsapp]");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const articleTitle =
  document.querySelector("[data-share-title]")?.dataset.shareTitle ||
  document.querySelector("h1")?.textContent.replace(/\s+/g, " ").trim() ||
  document.title;

function getShareUrl() {
  return window.location.href.split("#")[0];
}

function setShareFeedback(shareButton, message) {
  const status = shareButton.parentElement.querySelector("[data-share-status]");
  if (status) status.textContent = message;
  const original =
    shareButton.dataset.originalLabel ||
    shareButton.getAttribute("aria-label") ||
    "";
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
    const manualLink = button.parentElement.querySelector("[data-share-url]");
    if (manualLink) manualLink.hidden = true;
    if (navigator.share) {
      try {
        await navigator.share({ title: articleTitle, url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(button, button.dataset.copiedLabel || "Enlace copiado");
    } catch {
      setShareFeedback(button, "Selecciona y copia este enlace:");
      if (manualLink) {
        manualLink.value = url;
        manualLink.hidden = false;
        manualLink.focus();
        manualLink.select();
      }
    }
  });
});

if (whatsappShareLinks.length) {
  const text = encodeURIComponent(`${articleTitle} ${getShareUrl()}`);
  whatsappShareLinks.forEach((link) => {
    link.href = `https://wa.me/?text=${text}`;
  });
}
