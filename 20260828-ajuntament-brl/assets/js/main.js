const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".metric").forEach((metric) => {
  const max = Number(metric.dataset.max);
  metric.querySelector(".bar.a i").style.setProperty("--bar-width", `${Number(metric.dataset.a) / max * 100}%`);
  metric.querySelector(".bar.b i").style.setProperty("--bar-width", `${Number(metric.dataset.b) / max * 100}%`);
});

const revealInfographic = (element) => {
  element.classList.add("is-visible");
  element.querySelectorAll(".bar i").forEach((bar) => {
    bar.style.setProperty("--animated-width", getComputedStyle(bar).getPropertyValue("--bar-width"));
  });
};

if (reducedMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".infographic-reveal").forEach(revealInfographic);
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealInfographic(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.22 });
  document.querySelectorAll(".infographic-reveal").forEach((item) => observer.observe(item));
}

document.querySelectorAll(".prometeus-video").forEach((poster) => {
  poster.addEventListener("click", () => {
    const container = poster.closest(".prometeus-panel__video");
    const iframe = container?.querySelector("[data-prometeus-frame]");
    if (!container || !iframe) return;
    iframe.src = poster.dataset.videoSrc;
    container.classList.add("is-playing");
  });
});
