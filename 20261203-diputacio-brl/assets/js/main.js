(() => {
    "use strict";

    const root = document.getElementById("diba-supplement");
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const videoLink = root.querySelector(".diba-video__play");
    videoLink?.addEventListener("click", (event) => {
        event.preventDefault();
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/u6QvzCicvfg?autoplay=1";
        iframe.title = document.documentElement.lang === "es"
            ? "La red de Centros de Servicios Locales para Empresas"
            : "La xarxa de Centres Locals de Serveis a les Empreses";
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        videoLink.replaceWith(iframe);
        iframe.focus();
    });
    if ("IntersectionObserver" in window && !motion.matches) {
        const elements = root.querySelectorAll(".diba-reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.remove("is-pending");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: "0px 0px -35px 0px" });

        elements.forEach((element) => {
            element.classList.add("is-pending");
            observer.observe(element);
        });

        motion.addEventListener("change", (event) => {
            if (!event.matches) return;
            observer.disconnect();
            elements.forEach((element) => element.classList.remove("is-pending"));
        });
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
