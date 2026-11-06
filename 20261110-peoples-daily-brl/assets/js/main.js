(() => {
  "use strict";
  document.querySelectorAll(".pd-supplement").forEach((root) => {
    const hero = root.querySelector(".pd-hero");
    const article = root.querySelector(".pd-article");
    const sidebar = root.querySelector(".pd-sidebar");
    const credits = root.querySelector(".pd-credits");
    const top = root.querySelector(".pd-top");
    const progress = root.querySelector(".pd-progress");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if ("IntersectionObserver" in window && !reduce.matches) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("pd-in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px 40px 0px" },
      );
      root.classList.add("pd-motion");
      root.querySelectorAll(".pd-reveal").forEach((el) => observer.observe(el));
    }
    let scheduled = false;
    function update() {
      scheduled = false;
      const barBottom = Math.max(0, top.getBoundingClientRect().bottom);
      const articleRect = article.getBoundingClientRect();
      const bottomLimit = Math.min(
        articleRect.bottom,
        credits.getBoundingClientRect().top,
      );
      const canShow =
        hero.getBoundingClientRect().bottom <= barBottom &&
        bottomLimit >
          Math.max(110, barBottom + 20) + sidebar.offsetHeight + 35 &&
        credits.getBoundingClientRect().top > window.innerHeight;
      sidebar.classList.toggle("pd-sidebar-visible", canShow);
      sidebar.inert = !canShow;
      const distance =
        articleRect.height - Math.max(1, window.innerHeight - barBottom);
      const fraction = Math.min(
        1,
        Math.max(0, (barBottom - articleRect.top) / Math.max(1, distance)),
      );
      progress.style.transform = `scaleX(${fraction})`;
    }
    function requestUpdate() {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    if ("ResizeObserver" in window)
      new ResizeObserver(requestUpdate).observe(root);
    update();
  });
})();
