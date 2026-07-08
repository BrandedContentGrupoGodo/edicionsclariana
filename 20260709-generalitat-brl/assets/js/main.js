const counters = Array.from(document.querySelectorAll("[data-count]")).filter((counter) => {
  return !counter.closest(".per-person");
});

const formatNumber = (value, decimals = 0) => {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

const runCounter = (el) => {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${formatNumber(target * eased, decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const resetCounter = (el) => {
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || "";
  el.textContent = `${formatNumber(0, decimals)}${suffix}`;
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = "true";
    runCounter(entry.target);
  });
}, { threshold: 0.35 });

counters.forEach((counter) => {
  resetCounter(counter);
  observer.observe(counter);
});

document.querySelectorAll(".people").forEach((section) => {
  const donut = section.querySelector(".donut");
  if (!donut) return;

  const donutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || donut.dataset.done) return;
      donut.dataset.done = "true";

      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        donut.style.setProperty("--reveal", `${eased * 100}%`);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.35 });

  donutObserver.observe(section);
});

document.querySelectorAll(".per-person").forEach((section) => {
  const leadNumber = section.querySelector(".per-person__lead [data-count]");
  const rightRows = section.querySelectorAll(".per-person__list p");

  const perPersonObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || section.dataset.done) return;
      section.dataset.done = "true";
      section.classList.add("is-animated");
      if (leadNumber) runCounter(leadNumber);

      window.setTimeout(() => {
        section.classList.add("is-arrow-visible");
      }, 420);

      rightRows.forEach((row, index) => {
        window.setTimeout(() => {
          row.classList.add("is-visible");
          const number = row.querySelector("[data-count]");
          if (number) runCounter(number);
        }, 760 + index * 160);
      });
    });
  }, { threshold: 0.3 });

  perPersonObserver.observe(section);
});

document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel__track");
  const previous = carousel.querySelector("[data-carousel='previous']");
  const next = carousel.querySelector("[data-carousel='next']");

  const move = (direction) => {
    const card = track.querySelector(".money-card");
    if (!card) return;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    const visibleCards = window.matchMedia("(max-width: 560px)").matches ? 1 : 3;
    const amount = (card.getBoundingClientRect().width + gap) * visibleCards * direction;
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
});
