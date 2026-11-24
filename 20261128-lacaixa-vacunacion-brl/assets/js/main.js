const sharePageButtons = document.querySelectorAll("[data-share-page]");
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

const careDialog = document.querySelector(".care-dialog");
const dialogOpener = document.querySelector("[data-open-dialog]");

dialogOpener?.addEventListener("click", () => careDialog.showModal());
document.querySelector("[data-close-dialog]")?.addEventListener("click", () => {
  careDialog.close();
});
careDialog?.addEventListener("click", (event) => {
  if (event.target !== careDialog) return;
  const bounds = careDialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    careDialog.close();
});


const photoFrame = document.querySelector(".photo-frame");
window.addEventListener("message", (event) => {
  const expectedOrigin = new URL(photoFrame.src).origin;
  if (event.source !== photoFrame.contentWindow || event.origin !== expectedOrigin) return;

  const { type, height } = event.data ?? {};
  if (type === "caixa-photo-height" && Number.isInteger(height) && height > 0 && height < 10000) {
    photoFrame.style.height = height + "px";
  }
});

const videoLink = document.querySelector("[data-video]");
videoLink.addEventListener("click", (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();

  const player = document.createElement("iframe");
  const url = new URL("https://www.youtube-nocookie.com/embed/" + videoLink.dataset.video);
  url.searchParams.set("start", "9");
  url.searchParams.set("autoplay", "1");
  player.src = url.href;
  player.title = "Vídeo sobre la vacunación infantil";
  player.allow = "autoplay; encrypted-media; picture-in-picture";
  player.allowFullscreen = true;
  player.referrerPolicy = "strict-origin-when-cross-origin";
  videoLink.replaceWith(player);
  document.querySelector(".video__fallback").hidden = false;
  player.focus();
});

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);

      if (entry.target === photoFrame) {
        photoFrame.classList.add("is-visible");
        continue;
      }

      const number = entry.target;
      const animatedValue = document.createElement("span");
      animatedValue.setAttribute("aria-hidden", "true");
      number.setAttribute("aria-label", number.textContent);
      number.replaceChildren(animatedValue);

      const { value, prefix = "", suffix = "" } = number.dataset;
      const start = performance.now();
      function animate(now) {
        const progress = Math.max(0, Math.min((now - start) / 1250, 1));
        animatedValue.textContent = prefix + Math.round(value * (1 - (1 - progress) ** 3)) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }, { threshold: 0.18 });

  observer.observe(photoFrame);
  document.querySelectorAll(".care-stats strong").forEach((number) => observer.observe(number));
}
