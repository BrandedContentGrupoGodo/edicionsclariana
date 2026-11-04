(() => {
    "use strict";

    const root = document.getElementById("vac-supplement");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const blocks = root.querySelectorAll(".vac-recommendation");
        const reveal = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const items = Array.from(entry.target.querySelectorAll("li"));
                const ordered = items.map((item) => ({
                    item,
                    rect: item.getBoundingClientRect(),
                })).sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);

                ordered.forEach(({ item }, index) => {
                    item.style.setProperty("--vac-reveal-delay", `${index * 160}ms`);
                });
                entry.target.classList.add("is-revealed");
                reveal.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

        blocks.forEach((block) => {
            block.classList.add("vac-reveal-list");
            reveal.observe(block);
        });

        reducedMotion.addEventListener("change", (event) => {
            if (!event.matches) return;
            reveal.disconnect();
            blocks.forEach((block) => block.classList.remove("vac-reveal-list"));
        });
    }

    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const cards = root.querySelector(".vac-cards");
        if (cards) {
            const revealCards = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                cards.classList.add("is-revealed");
                revealCards.disconnect();
            }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

            cards.classList.add("vac-reveal-cards");
            revealCards.observe(cards);

            reducedMotion.addEventListener("change", (event) => {
                if (!event.matches) return;
                revealCards.disconnect();
                cards.classList.remove("vac-reveal-cards");
            });
        }
    }

    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const faq = root.querySelector(".vac-faq");
        if (faq) {
            const items = faq.querySelectorAll(".vac-faq__item");
            items.forEach((item, index) => {
                item.style.setProperty("--vac-faq-delay", `${index * 160}ms`);
            });

            const revealFaq = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                faq.classList.add("is-revealed");
                revealFaq.disconnect();
            }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

            faq.classList.add("vac-reveal-faq");
            revealFaq.observe(faq);

            reducedMotion.addEventListener("change", (event) => {
                if (!event.matches) return;
                revealFaq.disconnect();
                faq.classList.remove("vac-reveal-faq");
            });
        }
    }

    const videoLink = root.querySelector(".vac-video__play");
    videoLink?.addEventListener("click", (event) => {
        event.preventDefault();
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/hfKaIi1jeZI?autoplay=1";
        iframe.title = document.documentElement.lang === "es"
            ? "Información sobre la vacunación contra la gripe y la covid-19"
            : "Informació sobre la vacunació contra la grip i la covid-19";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        videoLink.replaceWith(iframe);
        iframe.focus();
    });

    // Notify the embedding page whenever content or an accordion changes height.
    if (window.parent !== window) {
        let frame;
        const sendHeight = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                window.parent.postMessage({
                    type: "vac-supplement:resize",
                    height: Math.ceil(root.getBoundingClientRect().height),
                }, "*");
            });
        };

        if ("ResizeObserver" in window) {
            new ResizeObserver(sendHeight).observe(root);
        }
        root.querySelectorAll("details").forEach((item) => {
            item.addEventListener("toggle", sendHeight);
        });
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);
        sendHeight();
    }
})();
