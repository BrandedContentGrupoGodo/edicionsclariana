document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".amb-reveal");
  const counters = document.querySelectorAll("[data-count]");
  const shareButtons = document.querySelectorAll("[data-share]");

  const formatNumber = (value, element) => {
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";

    if (element.dataset.format === "compact") {
      return `${prefix}${Math.round(value).toLocaleString("ca-ES")}${suffix}`;
    }

    const decimals = Number(element.dataset.count) % 1 === 0 ? 0 : 1;
    return `${prefix}${value.toLocaleString("ca-ES", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}${suffix}`;
  };

  const animateCounter = (element) => {
    if (element.dataset.done === "true") return;
    element.dataset.done = "true";

    const target = Number(element.dataset.count || 0);
    const duration = prefersReducedMotion ? 1 : 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatNumber(target * eased, element);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = formatNumber(target, element);
      }
    };

    requestAnimationFrame(tick);
  };

  const animateInfographic = (section) => {
    section.querySelectorAll(".amb-info-item").forEach((item, index) => {
      window.setTimeout(() => {
        item.querySelectorAll("[data-count]").forEach(animateCounter);
      }, index * 320);
    });
  };

  shareButtons.forEach((button) => {
    const status = button.parentElement.querySelector("[data-share-status]");

    button.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }

        await navigator.clipboard.writeText(shareData.url);
        if (status) {
          status.textContent = document.documentElement.lang === "es" ? "Enlace copiado" : "Enllaç copiat";
          window.setTimeout(() => {
            status.textContent = "";
          }, 1800);
        }
      } catch (error) {
        if (error && error.name === "AbortError") return;
        if (status) {
          status.textContent = document.documentElement.lang === "es" ? "No se ha podido compartir" : "No s'ha pogut compartir";
        }
      }
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("amb-infographic")) {
        animateInfographic(entry.target);
      } else {
        entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
      }
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.18
  });

  revealItems.forEach((item) => observer.observe(item));
});
