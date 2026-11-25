(() => {
    "use strict";

    const root = document.getElementById("diba-supplement");
    if (!root) return;

    const reportLink = root.querySelector(".report-video a");
    reportLink?.addEventListener("click", (event) => {
        if (window.location.protocol === "file:") return;

        event.preventDefault();
        const videoId = new URL(reportLink.href).pathname.slice(1);
        const player = document.createElement("iframe");
        player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`;
        player.title = reportLink.getAttribute("aria-label");
        player.allow = "autoplay; encrypted-media; picture-in-picture";
        player.referrerPolicy = "strict-origin-when-cross-origin";
        player.allowFullscreen = true;
        reportLink.replaceWith(player);
        player.focus();
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const picture = entry.target.querySelector("img");
                const offset = entry.target.classList.contains("feature--right") ? "-12%" : "12%";
                picture.animate([
                    { transform: `translateX(${offset})`, opacity: 0.72 },
                    { transform: "translateX(0)", opacity: 1 },
                ], { duration: 680, easing: "ease-out" });
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.15 });

        root.querySelectorAll(".feature").forEach((feature) => observer.observe(feature));
        reduceMotion.addEventListener("change", () => observer.disconnect(), { once: true });
    }

    const numbers = root.querySelector(".numbers-grid");
    if (numbers && "IntersectionObserver" in window && !reduceMotion.matches) {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            if (reduceMotion.matches) return;

            numbers.querySelectorAll("strong").forEach((number, index) => {
                number.animate([
                    { opacity: 0, transform: "translateX(-16px)" },
                    { opacity: 1, transform: "translateX(0)" },
                ], { duration: 850, delay: index * 350, easing: "ease-out", fill: "backwards" });
            });
        }, { threshold: 0.25 });
        observer.observe(numbers);
    }

    if (window.parent !== window) {
        let frame;
        const sendHeight = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                window.parent.postMessage({
                    type: "diba-supplement:resize",
                    height: Math.ceil(root.getBoundingClientRect().height),
                }, "*");
            });
        };

        if ("ResizeObserver" in window) {
            new ResizeObserver(sendHeight).observe(root);
        }
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);
        sendHeight();
    }
})();
