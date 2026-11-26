const features = document.querySelectorAll(".feature-frame");

if (features.length) {
    window.addEventListener("message", (event) => {
        const height = event.data?.featureHeight;

        if (!Number.isInteger(height) || height < 1 || height > 20000) {
            return;
        }

        for (const feature of features) {
            if (event.source === feature.contentWindow && event.origin === new URL(feature.src).origin) {
                feature.style.height = height + "px";
                break;
            }
        }
    });
}

if (document.body.classList.contains("feature-document")) {
    const reportHeight = () => {
        const height = Math.ceil(document.body.getBoundingClientRect().height);
        const parentOrigin = document.referrer ? new URL(document.referrer).origin : "*";

        window.parent.postMessage({ featureHeight: height }, parentOrigin === "null" ? "*" : parentOrigin);
    };

    new ResizeObserver(reportHeight).observe(document.body);
    window.addEventListener("load", reportHeight);
}

const poster = document.querySelector("[data-player]");

if (poster) {
    poster.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || location.protocol === "file:") {
            return;
        }

        event.preventDefault();

        const player = document.createElement("iframe");
        player.src = poster.dataset.player;
        player.title = poster.getAttribute("aria-label");
        player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        player.allowFullscreen = true;

        const fallback = document.createElement("a");
        fallback.className = "media-fallback";
        fallback.href = poster.href;
        fallback.target = "_blank";
        fallback.rel = "noopener";
        const platform = poster.href.includes("youtube") ? "YouTube" : "3Cat";
        const label = document.documentElement.lang === "es" ? "Abre el vídeo en" : "Obre el vídeo a";
        fallback.textContent = label + " " + platform;

        const media = poster.parentElement;
        poster.replaceWith(player);
        media.after(fallback);
        player.focus();
    });
}

const pictograms = document.querySelectorAll(".checklist-grid img");

if (pictograms.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("pictogram-visible");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.3 });

    pictograms.forEach((pictogram, index) => {
        pictogram.style.setProperty("--pictogram-delay", index * 90 + "ms");
        observer.observe(pictogram);
    });
}

const featureItems = document.querySelectorAll(".discount-copy, .discount .media-group, .help > img, .help-copy");

if (featureItems.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("feature-visible");
                observer.unobserve(entry.target);
            }
        }
    });

    featureItems.forEach((item) => observer.observe(item));
}
