(() => {
  const root = document.querySelector("#ev-supplement.bus-supplement");
  if (!root || !("IntersectionObserver" in window)) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return;

  const active = new Map();
  const numbers = new Map();
  root.querySelectorAll(".bus-figure-row .bus-value").forEach((element) => {
    const node = [...element.childNodes].find(
      (child) =>
        child.nodeType === Node.TEXT_NODE && /\d/.test(child.textContent),
    );
    if (!node) return;
    const original = node.textContent;
    const match = original.match(/\d[\d.]*(?:,\d+)?/);
    const value = match[0];
    const span = document.createElement("span");
    span.textContent = original;
    span.setAttribute("aria-hidden", "true");
    element.setAttribute("aria-label", element.textContent.trim());
    element
      .querySelectorAll("small")
      .forEach((unit) => unit.setAttribute("aria-hidden", "true"));
    node.replaceWith(span);
    numbers.set(element, {
      span,
      original,
      value,
      target: Number(value.replaceAll(".", "").replace(",", ".")),
      decimals: value.split(",")[1]?.length || 0,
    });
  });
  const finish = (element) => {
    cancelAnimationFrame(active.get(element));
    numbers.get(element).span.textContent = numbers.get(element).original;
    active.delete(element);
  };
  const count = (element) => {
    const data = numbers.get(element);
    const start = performance.now();
    const draw = (now) => {
      const progress = Math.min((now - start) / 1700, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const [integer, fraction] = (data.target * eased)
        .toFixed(data.decimals)
        .split(".");
      const grouped = data.value.includes(".")
        ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        : integer;
      data.span.textContent = data.original.replace(
        data.value,
        grouped + (fraction === undefined ? "" : `,${fraction}`),
      );
      if (progress < 1) active.set(element, requestAnimationFrame(draw));
      else finish(element);
    };
    draw(start);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("bus-entered");
        if (numbers.has(entry.target)) count(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
  );
  root
    .querySelectorAll(
      ".ev-copy, .ev-photo, .ev-intro, .bus-feature, .bus-figure-row > div",
    )
    .forEach((element, index) => {
      element.classList.add("bus-reveal");
      if (!element.matches(".bus-figure-row > div") && index % 3 === 1) {
        element.classList.add("bus-reveal-left");
      } else if (!element.matches(".bus-figure-row > div") && index % 3 === 2) {
        element.classList.add("bus-reveal-right");
      }
      observer.observe(element);
    });
  root.querySelectorAll(".bus-feature").forEach((element, index) => {
    element.style.setProperty("--bus-delay", `${(index % 2) * 110}ms`);
  });
  numbers.forEach((_, element) => observer.observe(element));
  preference.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    [...active.keys()].forEach(finish);
    root
      .querySelectorAll(".bus-reveal")
      .forEach((element) => element.classList.remove("bus-reveal"));
  });
})();
(() => {
  const root = document.getElementById("ev-supplement");
  if (!root || !("IntersectionObserver" in window)) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return;
  root.classList.add("ev-motion");
  const counters = new Map();
  root.querySelectorAll(".ev-stat").forEach((card) => {
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    const parts = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const original = node.textContent;
      if (!/\d/.test(original)) continue;
      parts.push({ node, original });
    }
    counters.set(card, parts);
  });
  const active = new Map();
  const finishCount = (card) => {
    const state = active.get(card);
    if (!state) return;
    cancelAnimationFrame(state.frame);
    counters.get(card).forEach(({ node, original }) => {
      node.textContent = original;
    });
    card.style.width = state.width;
    active.delete(card);
  };
  const startCount = (card) => {
    const parts = counters.get(card);
    if (!parts?.length) return;
    const state = { width: card.style.width, frame: 0 };
    card.style.width = `${card.getBoundingClientRect().width}px`;
    active.set(card, state);
    const start = performance.now();
    const draw = (now) => {
      const progress = Math.min((now - start) / 1600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      parts.forEach(({ node, original }) => {
        node.textContent = original.replace(/\d[\d.]*(?:,\d+)?/g, (value) => {
          const decimals = value.split(",")[1]?.length || 0;
          const target = Number(value.replaceAll(".", "").replace(",", "."));
          const [integer, fraction] = (target * eased)
            .toFixed(decimals)
            .split(".");
          const grouped = value.includes(".")
            ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            : integer;
          return grouped + (fraction === undefined ? "" : `,${fraction}`);
        });
      });
      if (progress < 1) state.frame = requestAnimationFrame(draw);
      else finishCount(card);
    };
    draw(start);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        startCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  root
    .querySelectorAll("[data-reveal]")
    .forEach((element) => observer.observe(element));
  preference.addEventListener("change", (event) => {
    if (event.matches) {
      root.classList.remove("ev-motion");
      observer.disconnect();
      [...active.keys()].forEach(finishCount);
    }
  });
})();
(() => {
  if (document.body.classList.contains("ev-embed")) {
    const report = () =>
      parent.postMessage(
        {
          type: "ev-embed-height",
          height: Math.ceil(
            document.getElementById("ev-supplement").getBoundingClientRect()
              .height,
          ),
        },
        "*",
      );
    new ResizeObserver(report).observe(document.body);
    window.addEventListener("load", report);
    report();
  } else {
    window.addEventListener("message", (event) => {
      if (!event.data || event.data.type !== "ev-embed-height") return;
      const frame = [
        ...document.querySelectorAll("#ev-supplement .ev-frame"),
      ].find((item) => item.contentWindow === event.source);
      const height = event.data.height;
      if (frame && Number.isFinite(height) && height > 0 && height < 5000)
        frame.style.height = `${height}px`;
    });
  }
})();
(() => {
  const root = document.getElementById("ev-supplement");
  const button = root?.querySelector(".ev-share-button");
  if (!button) return;
  const spanish = document.documentElement.lang === "es";
  const status = root.querySelector(".ev-share-status");
  const fallback = root.querySelector(".ev-share-fallback");
  const input = fallback.querySelector("input");
  const getShareData = () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const url = new URL(canonical || window.location.href);
    url.hash = "";
    return {
      title: root.querySelector("h1").textContent.replace(/\s+/g, " ").trim(),
      url: url.href,
    };
  };
  button.addEventListener("click", async () => {
    const data = getShareData();
    status.textContent = "";
    fallback.hidden = true;
    button.disabled = true;
    try {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share(data);
          return;
        } catch (error) {
          if (error.name === "AbortError") return;
        }
      }
      try {
        await navigator.clipboard.writeText(data.url);
        status.textContent = spanish ? "Enlace copiado" : "Enllaç copiat";
      } catch {
        fallback.hidden = false;
        input.value = data.url;
        input.focus();
        input.select();
        input.setSelectionRange(0, input.value.length);
        status.textContent = spanish
          ? "Mantén pulsado el enlace para copiarlo."
          : "Mantén premut l’enllaç per copiar-lo.";
      }
    } finally {
      button.disabled = false;
    }
  });
})();
