const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const reveals = document.querySelectorAll(".reveal");
function animateCounter(element) {
  if (element.dataset.done) return;
  element.dataset.done = "true";
  const target = Number(element.dataset.target);
  if (reducedMotion) {
    element.textContent = target.toLocaleString("es-ES");
    return;
  }
  const start = performance.now(),
    duration = 1300;
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1),
      eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString("es-ES");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".counter").forEach(animateCounter);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -5%" },
  );
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
  document.querySelectorAll(".counter").forEach(animateCounter);
}
document.querySelectorAll(".stat-pill").forEach((pill) => {
  const watcher = new IntersectionObserver(
    ([entry], obs) => {
      if (entry.isIntersecting) {
        pill.querySelectorAll(".counter").forEach(animateCounter);
        obs.disconnect();
      }
    },
    { threshold: 0.5 },
  );
  watcher.observe(pill);
});
