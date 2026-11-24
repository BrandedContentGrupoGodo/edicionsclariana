(() => {
    "use strict";

    const root = document.getElementById("suplement-persones-grans");
    if (!root) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const formatter = new Intl.NumberFormat(
        document.documentElement.lang === "es" ? "es-ES" : "ca-ES",
    );

    const reveal = (block) => {
        block.classList.remove("is-pending");
        if (reducedMotion) return;

        block.querySelectorAll("[data-count]").forEach((counter) => {
            const target = Number(counter.dataset.count);
            const original = counter.textContent;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / 1100, 1);
                const value = Math.round(
                    target * (1 - Math.pow(1 - progress, 3)),
                );
                counter.textContent =
                    progress === 1
                        ? original
                        : (counter.dataset.prefix || "") +
                          formatter.format(value);
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        });
    };

    if (!reducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.08 },
        );

        root.querySelectorAll(".reveal").forEach((block) => {
            block.classList.add("is-pending");
            observer.observe(block);
        });
    }

    let opener = null;
    let previousOverflow = "";

    root.querySelectorAll("[data-dialog]").forEach((button) => {
        button.addEventListener("click", () => {
            const dialog = root.querySelector(`#${button.dataset.dialog}`);
            opener = button;
            previousOverflow = document.body.style.overflow;
            dialog.showModal();
            document.body.style.overflow = "hidden";
        });
    });

    root.querySelectorAll("dialog").forEach((dialog) => {
        dialog
            .querySelector(".popup__close")
            .addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (event) => {
            const rect = dialog.getBoundingClientRect();
            if (
                event.target === dialog &&
                (event.clientX < rect.left ||
                    event.clientX > rect.right ||
                    event.clientY < rect.top ||
                    event.clientY > rect.bottom)
            )
                dialog.close();
        });
        dialog.addEventListener("close", () => {
            document.body.style.overflow = previousOverflow;
            opener?.focus();
        });
    });
})();
