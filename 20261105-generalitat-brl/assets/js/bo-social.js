(() => {
    "use strict";

    const root = document.getElementById("bo-supplement");
    if (!root) return;

    const isSpanish = document.documentElement.lang === "es";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const video = root.querySelector(".bo-hero video");
    const motionButton = root.querySelector(".bo-motion");
    let manuallyPaused = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.controls = false;
    video.preload = "auto";
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("disableremoteplayback", "");
    const startVideo = () => {
        if (manuallyPaused || reducedMotion.matches || document.hidden) return;
        video.play().catch(updateMotionButton);
    };
    const updateMotionButton = () => {
        motionButton.textContent = video.paused ? "▶" : "Ⅱ";
        motionButton.setAttribute("aria-label", video.paused
            ? (isSpanish ? "Reproduce el vídeo de fondo" : "Reprodueix el vídeo de fons")
            : (isSpanish ? "Pausa el vídeo de fondo" : "Pausa el vídeo de fons"));
    };

    if (reducedMotion.matches) {
        video.autoplay = false;
        video.pause();
    }
    video.addEventListener("play", updateMotionButton);
    video.addEventListener("pause", updateMotionButton);
    motionButton.addEventListener("click", () => {
        manuallyPaused = !video.paused;
        if (video.paused) video.play().catch(updateMotionButton);
        else video.pause();
    });
    updateMotionButton();
    video.addEventListener("loadeddata", startVideo);
    video.addEventListener("canplay", startVideo);
    window.addEventListener("pageshow", startVideo);
    document.addEventListener("visibilitychange", startVideo);
    // Retry after a user gesture if the mobile browser blocked autoplay.
    root.addEventListener("touchstart", startVideo, { passive: true });
    startVideo();

    const videoLink = root.querySelector(".bo-video__play");
    videoLink.addEventListener("click", (event) => {
        event.preventDefault();
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/hnEU5dScqSU?autoplay=1";
        iframe.title = isSpanish ? "Cómo solicitar el bono social eléctrico" : "Com sol·licitar el bo social elèctric";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        videoLink.replaceWith(iframe);
        iframe.focus();
    });

    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const cases = root.querySelectorAll(".bo-case");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        cases.forEach((item, index) => {
            item.style.setProperty("--bo-delay", `${index * 220}ms`);
            item.classList.add("bo-will-reveal");
            observer.observe(item);
        });

        const numbers = root.querySelectorAll(".bo-number");
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const element = entry.target;
                const target = Number(element.dataset.number);
                const start = performance.now();
                const tick = (now) => {
                    const progress = Math.min((now - start) / 1200, 1);
                    const value = target * (1 - Math.pow(1 - progress, 3));
                    element.textContent = `${value.toFixed(1).replace(".", ",")}%`;
                    if (progress < 1 && !reducedMotion.matches) requestAnimationFrame(tick);
                    else element.textContent = `${target.toFixed(1).replace(".", ",")}%`;
                };
                requestAnimationFrame(tick);
                countObserver.unobserve(element);
            });
        }, { threshold: 0.5 });
        numbers.forEach((element) => countObserver.observe(element));

        reducedMotion.addEventListener("change", (event) => {
            if (!event.matches) return;
            observer.disconnect();
            countObserver.disconnect();
            cases.forEach((item) => item.classList.remove("bo-will-reveal"));
            video.pause();
        });
    }

    // Preserve the previous supplement's message contract for embedding pages.
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
        if ("ResizeObserver" in window) new ResizeObserver(sendHeight).observe(root);
        root.querySelectorAll("details").forEach((item) => item.addEventListener("toggle", sendHeight));
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);
        sendHeight();
    }
})();
