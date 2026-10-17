(() => {
  const root = document.getElementById("salut-supplement");
  if (
    !root ||
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const format = new Intl.NumberFormat("es-ES", { useGrouping: true });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const start = performance.now();
        const final = Number(entry.target.dataset.value);
        const label = entry.target.textContent;
        entry.target.setAttribute("aria-label", label);
        const tick = (now) => {
          const progress = Math.min((now - start) / 1400, 1);
          entry.target.textContent =
            (entry.target.dataset.prefix || "") +
            (progress === 1
              ? label.replace(/^\+|%$/g, "")
              : format.format(
                  Math.round(final * (1 - Math.pow(1 - progress, 3))),
                )) +
            (entry.target.dataset.suffix || "");
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 },
  );
  root.querySelectorAll(".counter").forEach((node) => observer.observe(node));
})();
