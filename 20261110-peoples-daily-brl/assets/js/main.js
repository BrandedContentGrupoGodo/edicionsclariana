(() => {
  "use strict";
  document.querySelectorAll(".pd-supplement").forEach((root) => {
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
      // Keep navigation available throughout the article, including its end.
      // Fixed positioning avoids overflow containers in the publisher's layout
      // preventing CSS sticky from following the viewport.
      const desktop = window.matchMedia("(min-width: 1101px)").matches;
      sidebar.inert = false;
      if (desktop) {
        const layout = root.querySelector(".pd-layout");
        const layoutRect = layout.getBoundingClientRect();
        const layoutStyle = getComputedStyle(layout);
        const width = parseFloat(layoutStyle.gridTemplateColumns.split(" ").pop());
        const right = parseFloat(layoutStyle.paddingRight) || 0;
        const offset = Math.max(110, barBottom + 20);
        sidebar.style.maxHeight = `${Math.max(120, window.innerHeight - offset - 20)}px`;
        sidebar.style.position = "fixed";
        sidebar.style.width = `${width}px`;
        sidebar.style.left = `${layoutRect.right - right - width}px`;
        sidebar.style.top = `${Math.min(
          Math.max(articleRect.top, offset),
          Math.min(articleRect.bottom, credits.getBoundingClientRect().top) - sidebar.offsetHeight - 20,
        )}px`;
      } else {
        ["position", "width", "left", "top", "max-height"].forEach((property) =>
          sidebar.style.removeProperty(property),
        );
      }
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
