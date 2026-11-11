(() => {
  "use strict";
  document.querySelectorAll(".pd-supplement").forEach((root) => {
    const article = root.querySelector(".pd-article");
    const sidebar = root.querySelector(".pd-sidebar");
    const credits = root.querySelector(".pd-credits");
    const top = root.querySelector(".pd-top");
    const progress = root.querySelector(".pd-progress");
    const sidebarInner = sidebar.querySelector(".pd-sidebar-inner");
    root.classList.add("pd-scroll-ready");
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
      // Move inside the article instead of relying on sticky positioning:
      // publisher containers can establish their own overflow/scroll contexts.
      const sidebarRect = sidebar.getBoundingClientRect();
      const desktop = window.innerWidth > 1100;
      const topOffset = Math.max(110, barBottom + 20);
      // Four related stories must remain reachable on short desktop screens.
      sidebarInner.style.maxHeight = desktop
        ? `${Math.max(120, window.innerHeight - topOffset - 20)}px` : "";
      sidebar.inert = false;
      const offset = Math.max(0, Math.min(
        topOffset - sidebarRect.top,
        Math.min(articleRect.bottom, credits.getBoundingClientRect().top) -
          sidebarRect.top - sidebarInner.offsetHeight - 35,
      ));
      sidebarInner.style.transform = desktop
        ? `translateY(${offset}px)` : "";
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
