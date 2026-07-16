(() => {
const supplementRoot = document.getElementById("gencat-security-supplement");
if (!supplementRoot) return;

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

const observed = supplementRoot.querySelectorAll("[data-count], .gss-reveal-card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.animated) return;
    entry.target.dataset.animated = "true";
    if (entry.target.matches("[data-count]")) animateNumber(entry.target);
    if (entry.target.classList.contains("gss-reveal-card")) entry.target.classList.add("gss-is-visible");
  });
}, { threshold: 0.3 });
observed.forEach((element) => observer.observe(element));

const equipmentButtons = supplementRoot.querySelectorAll(".gss-equipment-button");
const equipmentPanels = supplementRoot.querySelectorAll(".gss-equipment-panel");
const closeEquipmentPanels = () => {
  equipmentButtons.forEach((button) => {
    button.classList.remove("gss-is-active");
    button.setAttribute("aria-expanded", "false");
  });
  equipmentPanels.forEach((panel) => panel.classList.remove("gss-is-open"));
};
const openEquipmentPanel = (id) => {
  equipmentButtons.forEach((button) => {
    const active = button.dataset.panel === id;
    button.classList.toggle("gss-is-active", active);
    button.setAttribute("aria-expanded", String(active));
  });
  equipmentPanels.forEach((panel) => panel.classList.toggle("gss-is-open", panel.id === id));
};
equipmentButtons.forEach((button) => button.addEventListener("click", () => {
  const panel = supplementRoot.querySelector(`#${button.dataset.panel}`);
  if (panel?.classList.contains("gss-is-open")) {
    closeEquipmentPanels();
    return;
  }
  openEquipmentPanel(button.dataset.panel);
}));
equipmentPanels.forEach((panel) => {
  panel.querySelector("button")?.addEventListener("click", closeEquipmentPanels);
});

const mapMarkers = supplementRoot.querySelectorAll(".gss-map-marker");
const mapPopups = supplementRoot.querySelectorAll(".gss-map-popup");
const mapInstruction = supplementRoot.querySelector(".gss-map-instruction");
const mapUsesHover = window.matchMedia("(hover: hover) and (pointer: fine)");

const closeMapPopups = () => {
  mapMarkers.forEach((marker) => {
    marker.classList.remove("gss-is-active");
    marker.setAttribute("aria-expanded", "false");
  });
  mapPopups.forEach((popup) => { popup.hidden = true; });
  if (mapInstruction) mapInstruction.hidden = false;
};

const openMapPopup = (marker) => {
  const popup = supplementRoot.querySelector(`#map-${marker.dataset.mapPlace}`);
  if (!popup) return;
  closeMapPopups();
  popup.hidden = false;
  marker.classList.add("gss-is-active");
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

supplementRoot.querySelectorAll(".gss-flip-card").forEach((card) => {
  card.addEventListener("click", () => {
    const flipped = card.classList.toggle("gss-is-flipped");
    card.setAttribute("aria-expanded", String(flipped));
  });
});
})();
