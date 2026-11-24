const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatCatalanNumber = (value, original) => {
  const prefix = original.trim().startsWith("+") ? "+" : "";
  return `${prefix}${new Intl.NumberFormat("ca-ES").format(value)}`;
};

const revealInfographic = (element) => {
  element.classList.add("is-visible");
  if (reducedMotion) return;

  element.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    const original = counter.textContent;
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = formatCatalanNumber(Math.round(target * eased), original);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
};

if (reducedMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".infographic-reveal").forEach(revealInfographic);
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealInfographic(entry.target);
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.26 }
  );

  document.querySelectorAll(".infographic-reveal").forEach((item) => observer.observe(item));
}

document.querySelectorAll(".school-card").forEach((card) => {
  const toggleCard = () => {
    const isFlipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(isFlipped));
  };

  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleCard();
  });
});
