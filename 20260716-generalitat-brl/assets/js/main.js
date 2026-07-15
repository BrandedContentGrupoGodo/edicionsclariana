const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatNumber = (value, decimals = 0) => value.toLocaleString("ca-ES", {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals
});

const animateNumber = (element) => {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  if (reduceMotion) {
    element.textContent = formatNumber(target, decimals);
    return;
  }
  const duration = 1250;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatNumber(target * eased, decimals);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const observed = document.querySelectorAll("[data-count], .reveal-card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.animated) return;
    entry.target.dataset.animated = "true";
    if (entry.target.matches("[data-count]")) animateNumber(entry.target);
    if (entry.target.classList.contains("reveal-card")) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.3 });
observed.forEach((element) => observer.observe(element));

const equipmentButtons = document.querySelectorAll(".equipment-button");
const equipmentPanels = document.querySelectorAll(".equipment-panel");
const closeEquipmentPanels = () => {
  equipmentButtons.forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-expanded", "false");
  });
  equipmentPanels.forEach((panel) => panel.classList.remove("is-open"));
};
const openEquipmentPanel = (id) => {
  equipmentButtons.forEach((button) => {
    const active = button.dataset.panel === id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-expanded", String(active));
  });
  equipmentPanels.forEach((panel) => panel.classList.toggle("is-open", panel.id === id));
};
equipmentButtons.forEach((button) => button.addEventListener("click", () => {
  const panel = document.getElementById(button.dataset.panel);
  if (panel?.classList.contains("is-open")) {
    closeEquipmentPanels();
    return;
  }
  openEquipmentPanel(button.dataset.panel);
}));
equipmentPanels.forEach((panel) => {
  panel.querySelector("button")?.addEventListener("click", closeEquipmentPanels);
});

const mapMarkers = document.querySelectorAll(".map-marker");
const mapPopups = document.querySelectorAll(".map-popup");
const mapInstruction = document.querySelector(".map-instruction");
const mapUsesHover = window.matchMedia("(hover: hover) and (pointer: fine)");

const closeMapPopups = () => {
  mapMarkers.forEach((marker) => {
    marker.classList.remove("is-active");
    marker.setAttribute("aria-expanded", "false");
  });
  mapPopups.forEach((popup) => { popup.hidden = true; });
  if (mapInstruction) mapInstruction.hidden = false;
};

const openMapPopup = (marker) => {
  const popup = document.getElementById(`map-${marker.dataset.mapPlace}`);
  if (!popup) return;
  closeMapPopups();
  popup.hidden = false;
  marker.classList.add("is-active");
  marker.setAttribute("aria-expanded", "true");
  if (mapInstruction) mapInstruction.hidden = true;
};

mapMarkers.forEach((marker) => {
  marker.addEventListener("mouseenter", () => {
    if (mapUsesHover.matches) openMapPopup(marker);
  });

  marker.addEventListener("focus", () => {
    if (mapUsesHover.matches) openMapPopup(marker);
  });

  marker.addEventListener("click", () => {
    if (mapUsesHover.matches) return;
    const wasOpen = marker.getAttribute("aria-expanded") === "true";
    closeMapPopups();
    if (wasOpen) return;
    openMapPopup(marker);
  });
});

mapPopups.forEach((popup) => {
  popup.querySelector("button")?.addEventListener("click", closeMapPopups);
});

document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => {
    const flipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-expanded", String(flipped));
  });
});
