const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".itinerary-grid").forEach((grid) => {
  if (reduced) {
    grid.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      grid.classList.add("is-visible");
      observer.disconnect();
    },
    { threshold: 0.2 }
  );

  observer.observe(grid);
});

document.querySelectorAll("[data-youtube-id]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.youtubeId;
    if (!id) return;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = button.getAttribute("aria-label") || "Video de YouTube";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    button.replaceChildren(iframe);
    button.classList.add("is-playing");
    button.setAttribute("aria-label", iframe.title);
  });
});
