(() => {
  const mobileIframeQuery = window.matchMedia("(max-width: 700px)");
  const responsiveFrames = document.querySelectorAll(
    "#salut-supplement .infographic iframe[data-src-desktop][data-src-mobile]",
  );

  const syncResponsiveFrames = () => {
    responsiveFrames.forEach((frame) => {
      const nextSrc = mobileIframeQuery.matches
        ? frame.dataset.srcMobile
        : frame.dataset.srcDesktop;
      if (frame.getAttribute("src") !== nextSrc) {
        frame.setAttribute("src", nextSrc);
      }
    });
  };

  syncResponsiveFrames();
  mobileIframeQuery.addEventListener("change", syncResponsiveFrames);

  const phases = document.querySelectorAll("#salut-supplement .phase");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const reveal = (phase) => phase.classList.add("is-visible");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const phase = entry.target.closest(".phase");
        reveal(phase);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 },
  );

  phases.forEach((phase, index) => {
    // Observe the heading: the first phase can be taller than the viewport.
    const heading = phase.querySelector(".phase__title");
    if (!heading) return;
    phase.classList.add("phase--reveal");
    if (index % 2 === 1) phase.classList.add("phase--from-right");
    // Keep content above a restored scroll position visible.
    if (heading.getBoundingClientRect().top < window.innerHeight * 0.9) {
      reveal(phase);
    } else {
      observer.observe(heading);
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    phases.forEach(reveal);
  });
})();
