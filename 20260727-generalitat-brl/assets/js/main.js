const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatNumber(value, decimals = 0) {
  const fixed = value.toFixed(decimals);
  const [integer, decimal] = fixed.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimal ? `${grouped},${decimal}` : grouped;
}

function count(el) {
  const end = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals || 0);
  if (reduced) {
    el.textContent = formatNumber(end, decimals);
    return;
  }
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / 1200, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(end * eased, decimals);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.seen) return;
      entry.target.dataset.seen = "1";
      entry.target.classList.add("is-visible");
      if (entry.target.matches("[data-count]")) count(entry.target);
    });
  },
  { threshold: 0.25 }
);

document
  .querySelectorAll("[data-count], .bar-list")
  .forEach((el) => observer.observe(el));

document.querySelectorAll(".carousel").forEach((carousel) => {
  const cards = [...carousel.querySelectorAll(".cards article")];
  const pageSize = 3;
  const pageCount = Math.ceil(cards.length / pageSize);
  let page = 0;

  function renderPage() {
    cards.forEach((card, index) => {
      const isVisible =
        index >= page * pageSize && index < page * pageSize + pageSize;
      card.hidden = !isVisible;
    });
  }

  carousel.querySelector(".next")?.addEventListener("click", () => {
    page = (page + 1) % pageCount;
    renderPage();
  });
  carousel.querySelector(".prev")?.addEventListener("click", () => {
    page = (page - 1 + pageCount) % pageCount;
    renderPage();
  });

  renderPage();
});

const mapPanel = document.querySelector(".map-panel");
const provinceCopies = [...document.querySelectorAll("[data-province-copy]")];
const provinceButtons = [...document.querySelectorAll(".map-hotspot")];

function setProvince(province) {
  if (!province || !mapPanel) return;
  mapPanel.dataset.active = province;
  provinceCopies.forEach((copy) => {
    const isActive = copy.dataset.provinceCopy === province;
    copy.classList.toggle("is-active", isActive);
    copy.classList.toggle("is-muted", !isActive);
  });
}

function clearProvince() {
  if (!mapPanel) return;
  delete mapPanel.dataset.active;
  provinceCopies.forEach((copy) => {
    copy.classList.remove("is-active", "is-muted");
  });
}

provinceButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => setProvince(button.dataset.province));
  button.addEventListener("focus", () => setProvince(button.dataset.province));
  button.addEventListener("click", () => setProvince(button.dataset.province));
});

mapPanel?.addEventListener("mouseleave", clearProvince);
