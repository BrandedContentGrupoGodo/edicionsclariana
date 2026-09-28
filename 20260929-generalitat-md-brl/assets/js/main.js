(() => {
  const root = document.querySelector("#salut-supplement");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealItems = [...root.querySelectorAll(".reveal-left, .reveal-right")];

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const infographic = root.querySelector(".infographic-embed iframe");
  if (!infographic) return;

  const mobileQuery = window.matchMedia("(max-width: 620px)");
  const setInfographicSource = () => {
    const nextSrc = mobileQuery.matches
      ? infographic.dataset.srcMobile
      : infographic.dataset.srcDesktop;
    if (nextSrc && infographic.src !== nextSrc) {
      infographic.src = nextSrc;
    }
  };

  setInfographicSource();
  mobileQuery.addEventListener("change", setInfographicSource);
})();
