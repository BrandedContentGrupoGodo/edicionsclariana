(() => {
    "use strict";

    const root = document.getElementById("fashion-supplement");
    if (!root) return;
    const isSpanish = document.documentElement.lang.startsWith("es");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const band = root.querySelector(".fashion-models");
    const cells = Array.from(band.querySelectorAll(".fashion-model"));
    const collection = cells.map((cell) => ({
        src: cell.querySelector("img").getAttribute("src"),
        alt: cell.querySelector("img").alt,
        name: cell.querySelector("p").textContent,
    }));
    const labels = isSpanish
        ? { resume: "Reanudar los cambios de imágenes", pause: "Pausar los cambios de imágenes" }
        : { resume: "Reprendre els canvis d’imatges", pause: "Pausar els canvis d’imatges" };
    const pauseButton = band.querySelector(".fashion-models__pause");
    let paused = false;
    let inView = false;
    let timer;
    const changedCells = new Set();
    let busy = false;
    let nextModel = 0;
    let previousVisible = new Set();

    const visibleCells = () => cells.filter((cell) => cell.getBoundingClientRect().width > 0);
    const pick = (items) => items[Math.floor(Math.random() * items.length)];
    const pendingCells = (visible) => {
        for (const cell of changedCells) {
            if (!visible.includes(cell)) changedCells.delete(cell);
        }
        if (visible.every((cell) => changedCells.has(cell))) changedCells.clear();
        return visible.filter((cell) => !changedCells.has(cell));
    };
    const makeLook = (model) => {
        const look = document.createElement("div");
        look.className = "fashion-model__look";
        const image = document.createElement("img");
        image.src = model.src;
        image.alt = model.alt;
        image.width = 750;
        image.height = 1334;
        const caption = document.createElement("p");
        caption.textContent = model.name;
        look.append(image, caption);
        return look;
    };
    const canRun = () => inView && !paused && !reducedMotion.matches && !document.hidden;
    const schedule = () => {
        clearTimeout(timer);
        if (canRun()) timer = setTimeout(changeOne, 2000);
    };
    const changeOne = async () => {
        if (!canRun() || busy) return;
        busy = true;
        const visible = visibleCells();
        const cell = pick(pendingCells(visible));
        if (!cell) { busy = false; return; }
        const index = nextModel;
        const next = makeLook(collection[index]);
        const image = next.querySelector("img");
        try {
            await image.decode();
            if (!canRun() || !visibleCells().includes(cell) || index !== nextModel) return;
            next.classList.add("is-entering");
            const previous = cell.firstElementChild;
            cell.append(next);
            cell.dataset.model = String(index);
            nextModel = (index + 1) % collection.length;
            previous.setAttribute("aria-hidden", "true");
            changedCells.add(cell);
            requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove("is-entering")));
            setTimeout(() => previous.remove(), 1250);
        } catch {
            // Keep the current photograph if its replacement cannot load.
        } finally {
            busy = false;
            schedule();
        }
    };
    const reconcile = () => {
        const visible = visibleCells();
        visible.forEach((cell) => {
            if (previousVisible.has(cell)) return;
            const index = nextModel;
            cell.replaceChildren(makeLook(collection[index]));
            cell.dataset.model = String(index);
            nextModel = (index + 1) % collection.length;
            changedCells.delete(cell);
        });
        previousVisible = new Set(visible);
    };
    new ResizeObserver(reconcile).observe(band);
    pauseButton.addEventListener("click", () => {
        paused = !paused;
        pauseButton.textContent = paused ? "▶" : "Ⅱ";
        pauseButton.setAttribute("aria-label", paused ? labels.resume : labels.pause);
        schedule();
    });
    document.addEventListener("visibilitychange", schedule);
    reducedMotion.addEventListener("change", schedule);
    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            inView = entries[0].isIntersecting;
            schedule();
        }, { threshold: 0.15 }).observe(band);
    } else {
        inView = true;
        schedule();
    }

    if ("IntersectionObserver" in window) {
        const reveals = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.remove("is-waiting");
                reveals.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        const shoes = root.querySelector(".fashion-shoes");
        if (shoes && !reducedMotion.matches) {
            shoes.classList.add("is-assembling");
            const assembly = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    shoes.classList.remove("is-assembling");
                    shoes.classList.add("is-assembled");
                }));
                assembly.disconnect();
            }, { threshold: 0.2 });
            assembly.observe(shoes);
            reducedMotion.addEventListener("change", (event) => {
                if (!event.matches) return;
                assembly.disconnect();
                shoes.classList.remove("is-assembling");
                shoes.classList.add("is-assembled");
            });
        }
        if (!reducedMotion.matches) {
            root.querySelectorAll(".fashion-reveal").forEach((photo) => {
                photo.classList.add("is-waiting");
                reveals.observe(photo);
            });
        }

        const numbers = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                numbers.unobserve(entry.target);
                if (reducedMotion.matches) return;
                const items = entry.target.querySelectorAll("[data-count]");
                const began = performance.now();
                const tick = (now) => {
                    const progress = Math.min((now - began) / 1800, 1);
                    items.forEach((item) => {
                        const value = Math.round(Number(item.dataset.count) * (1 - (1 - progress) ** 3));
                        item.textContent = value.toLocaleString(isSpanish ? "es-ES" : "ca-ES");
                    });
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.4 });
        numbers.observe(root.querySelector(".fashion-stats"));
    }

    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) root.querySelectorAll(".is-waiting").forEach((photo) => photo.classList.remove("is-waiting"));
    });

    // The embedding page must validate both the origin and the sending window.
    if (window.parent !== window) {
        const sendHeight = () => {
            window.parent.postMessage({ type: "fashion-supplement:resize", height: Math.ceil(root.getBoundingClientRect().height) }, "*");
        };
        new ResizeObserver(sendHeight).observe(root);
        window.addEventListener("load", sendHeight);
    }
})();
