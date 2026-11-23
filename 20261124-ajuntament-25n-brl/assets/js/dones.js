(() => {
    "use strict";

    const root = document.getElementById("suplement-dones");
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.remove("is-pending");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.06 }) : null;

    root.querySelectorAll(".reveal").forEach((element, index) => {
        if (motion.matches || !observer || element.matches("details")) return;
        if (element.parentElement.closest(".reveal")) return;
        element.classList.add("is-pending");
        observer.observe(element);
    });

    motion.addEventListener("change", () => {
        if (!motion.matches) return;
        observer?.disconnect();
        root.querySelectorAll(".is-pending").forEach((element) => {
            element.classList.remove("is-pending");
        });
    });

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
        dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (event) => {
            const rect = dialog.getBoundingClientRect();
            if (event.target === dialog && (event.clientX < rect.left ||
                event.clientX > rect.right || event.clientY < rect.top ||
                event.clientY > rect.bottom)) dialog.close();
        });
        dialog.addEventListener("close", () => {
            document.body.style.overflow = previousOverflow;
            opener?.focus();
        });
    });
})();
