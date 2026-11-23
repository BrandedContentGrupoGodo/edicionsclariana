(() => {
    "use strict";

    const root = document.getElementById("suplement-arquitectura");
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isSpanish = document.documentElement.lang === "es";
    const pending = new Set();
    let observer;

    if (!motion.matches && "IntersectionObserver" in window) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.remove("is-pending");
                pending.delete(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.06 });

        root.querySelectorAll(".reveal").forEach((element, index) => {
            // Animate the card as one piece, preserving readable inner text.
            if (element.parentElement.closest(".reveal")) return;
            if (element.classList.contains("activity-card")) {
                element.classList.add(index % 2 ? "from-left" : "from-right");
            }
            element.classList.add("is-pending");
            pending.add(element);
            observer.observe(element);
        });
    }

    motion.addEventListener("change", () => {
        if (!motion.matches) return;
        pending.forEach((element) => element.classList.remove("is-pending"));
        pending.clear();
        observer?.disconnect();
    });

    const track = root.querySelector(".carousel-track");
    const previous = root.querySelector(".carousel-prev");
    const next = root.querySelector(".carousel-next");
    const status = root.querySelector(".carousel-status");
    if (!track) return;

    const step = () => track.firstElementChild.getBoundingClientRect().width +
        parseFloat(getComputedStyle(track).columnGap);
    const update = () => {
        previous.disabled = track.scrollLeft < 2;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        const index = Math.min(4, Math.round(track.scrollLeft / step()) + 1);
        status.textContent = `${isSpanish ? "Actividades de clausura" : "Activitats de cloenda"} · ${index} de 4`;
    };
    const move = (direction) => {
        track.scrollBy({ left: direction * step(), behavior: motion.matches ? "instant" : "smooth" });
    };
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
    });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
})();
