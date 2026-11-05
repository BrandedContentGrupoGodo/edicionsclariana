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

document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    const url = new URL(
      `https://www.youtube-nocookie.com/embed/${button.dataset.video}`,
    );
    url.searchParams.set("autoplay", "1");
    if (button.dataset.video === "Vozz_Hiw1KE")
      url.searchParams.set("start", "11");
    iframe.src = url.href;
    iframe.title = button.getAttribute("aria-label");
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    button.replaceWith(iframe);
  });
});

// Keep the complete content visible when animation is unavailable or unwanted.
if (!reducedMotion && "IntersectionObserver" in window) {
  const supplement = document.querySelector("#caixa-supplement");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" },
  );

  supplement
    .querySelectorAll(
      ".media-block, .quotation, .feature-band, .longevity__title",
    )
    .forEach((element) => {
      element.classList.add("scroll-reveal");
      revealObserver.observe(element);
      element.addEventListener("focusin", () => {
        element.classList.add("is-visible");
        revealObserver.unobserve(element);
      });
    });

  const numberFormat = new Intl.NumberFormat("es-ES", {
    useGrouping: "always",
    maximumFractionDigits: 0,
  });
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        const number = entry.target;
        const finalText = number.dataset.finalText;
        const target = Number(finalText.replace(/\D/g, ""));
        const prefix = finalText.startsWith("+") ? "+ " : "";
        const suffix = finalText.endsWith("%") ? "%" : "";
        const start = performance.now();
        const duration = 1600;
        function frame(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          number.firstElementChild.textContent =
            progress === 1
              ? finalText
              : `${prefix}${numberFormat.format(Math.floor(target * eased))}${suffix}`;
          if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    },
    { threshold: 0.5 },
  );

  supplement.querySelectorAll(".care-stats__grid strong").forEach((number) => {
    const finalText = number.textContent.trim();
    number.dataset.finalText = finalText;
    number.setAttribute("aria-label", finalText);
    const animatedValue = document.createElement("span");
    animatedValue.setAttribute("aria-hidden", "true");
    animatedValue.textContent = `${finalText.startsWith("+") ? "+ " : ""}0${finalText.endsWith("%") ? "%" : ""}`;
    number.replaceChildren(animatedValue);
    counterObserver.observe(number);
  });
}
