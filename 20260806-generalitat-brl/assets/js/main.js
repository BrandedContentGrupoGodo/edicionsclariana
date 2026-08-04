document.querySelectorAll(".tip-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    card.classList.toggle("is-flipped");
  });
});

document.querySelectorAll(".video-reel").forEach((reel) => {
  const video = reel.querySelector("video");
  const button = reel.querySelector("button");
  if (!video || !button) return;

  button.addEventListener("click", () => {
    video.controls = true;
    video.play();
  });

  video.addEventListener("play", () => reel.classList.add("is-playing"));
  video.addEventListener("pause", () => reel.classList.remove("is-playing"));
  video.addEventListener("ended", () => {
    video.controls = false;
    reel.classList.remove("is-playing");
  });
});

const modal = document.querySelector(".modal");
const modalOpen = document.querySelector("[data-modal-open]");
const modalClose = modal?.querySelector(".modal__close");
let lastFocus = null;

function openModal() {
  if (!modal) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus?.();
}

modalOpen?.addEventListener("click", openModal);
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) closeModal();
});

const safetyColumns = document.querySelector(".safety-columns");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (safetyColumns) {
  if (reducedMotion) {
    safetyColumns.classList.add("is-visible");
  } else {
    const safetyObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        safetyColumns.classList.add("is-visible");
        safetyObserver.disconnect();
      },
      { threshold: 0.25 }
    );
    safetyObserver.observe(safetyColumns);
  }
}

function initEclipseScrollMap() {
  const wrapper = document.querySelector("#es-wrapper");
  if (!wrapper) return;

  const loading = document.querySelector("#es-loading");
  const error = document.querySelector("#es-error");

  if (!window.mapboxgl) {
    if (loading) loading.style.display = "none";
    if (error) error.style.display = "block";
    return;
  }

  const cfg = {
    token: "pk.eyJ1IjoibGF1cjA1IiwiYSI6ImNpbmtmM2FjazAwODF2eG0yNjhteTcxdHIifQ.l7uzjVe2b1L8dHh_Z9JjoQ",
    style: "mapbox://styles/laur05/cml8j0rad001v01r0e90u6m8t",
    geojson: "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-01/20260202_eclipse_01/shadows_merged_18.291-18.567-2026-simplified-0.0001.geojson",
    existingLayerId: "shadows-merged-18-bjnzz7",
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    borderColor: "rgba(255,255,255,0.2)",
    playMs: window.innerWidth <= 768 ? 140 : 120,
  };

  const state = {
    map: null,
    timeSteps: [],
    stepCache: [],
    totalSteps: 0,
    currentStep: -1,
    isPlaying: false,
    playTimer: null,
    hintHidden: false,
    isVisible: false,
  };

  const mobileMapQuery = window.matchMedia("(max-width: 768px)");
  const peninsulaBounds = [
    [-10.2, 35.4],
    [4.8, 44.2],
  ];

  function fitResponsiveMap() {
    if (!state.map) return;

    state.map.fitBounds(peninsulaBounds, {
      padding: mobileMapQuery.matches
        ? { top: 72, right: 18, bottom: 28, left: 18 }
        : { top: 52, right: 42, bottom: 42, left: 42 },
      duration: 0,
    });
  }

  function updateResponsiveMapCamera() {
    fitResponsiveMap();
  }

  const pad = (value) => (value < 10 ? `0${value}` : `${value}`);

  function decimalToHms(decimal) {
    const localDecimal = decimal + 2;
    const hours = Math.floor(localDecimal);
    const minutes = Math.floor((localDecimal - hours) * 60);
    const seconds = Math.round(((localDecimal - hours) * 60 - minutes) * 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function stepToDecimal(name) {
    return parseFloat(name.split("_").pop());
  }

  function preprocessGeojson(geojson) {
    const keys = Object.keys(geojson.features[0].properties);
    const allSteps = keys
      .filter((key) => key.startsWith("mancha_ut_"))
      .sort((a, b) => stepToDecimal(a) - stepToDecimal(b));

    state.timeSteps = allSteps.filter((step) => stepToDecimal(step) >= 18.425);
    state.totalSteps = state.timeSteps.length;
    state.stepCache = state.timeSteps.map((step) => ({
      type: "FeatureCollection",
      features: geojson.features.filter((feature) => feature.properties[step] != null),
    }));
  }

  function addLayers() {
    state.map.addSource("es-shadow", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    state.map.addLayer({
      id: "es-shadow-fill",
      type: "fill",
      source: "es-shadow",
      paint: {
        "fill-color": cfg.shadowColor,
        "fill-opacity": cfg.shadowOpacity,
      },
    });

    state.map.addLayer({
      id: "es-shadow-line",
      type: "line",
      source: "es-shadow",
      paint: {
        "line-color": cfg.borderColor,
        "line-width": 1,
      },
    });
  }

  function updateStep(index) {
    if (index < 0 || index >= state.totalSteps || index === state.currentStep) return;

    state.currentStep = index;
    state.map.getSource("es-shadow").setData(state.stepCache[index]);
    document.querySelector("#es-time-val").textContent = decimalToHms(stepToDecimal(state.timeSteps[index]));

    const percent = (index / (state.totalSteps - 1)) * 100;
    document.querySelector("#es-fill").style.width = `${percent}%`;
    document.querySelector("#es-dot").style.left = `${percent}%`;
  }

  function hideLoading() {
    if (loading) loading.style.display = "none";
  }

  async function fetchGeojson() {
    try {
      const response = await fetch(cfg.geojson);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      preprocessGeojson(data);
      hideLoading();
      updateStep(0);
    } catch (err) {
      console.error("[EclipseScroll]", err);
      hideLoading();
      if (error) error.style.display = "block";
    }
  }

  function updateHint() {
    const hint = document.querySelector("#es-hint");
    if (!state.hintHidden && hint) {
      hint.style.opacity = "0";
      state.hintHidden = true;
    }
  }

  function advanceStep() {
    if (state.totalSteps === 0) return;
    updateHint();
    const nextStep = state.currentStep >= state.totalSteps - 1 ? 0 : state.currentStep + 1;
    updateStep(nextStep);
  }

  function stopPlay() {
    state.isPlaying = false;
    const play = document.querySelector("#es-play");
    if (play) play.textContent = "▶";
    clearInterval(state.playTimer);
  }

  function startPlay() {
    if (state.isPlaying || state.totalSteps === 0) return;
    state.isPlaying = true;
    const play = document.querySelector("#es-play");
    if (play) play.textContent = "⏸";

    state.playTimer = setInterval(() => {
      advanceStep();
    }, cfg.playMs);
  }

  function setupControls() {
    const play = document.querySelector("#es-play");
    const reset = document.querySelector("#es-reset");

    play?.addEventListener("click", () => {
      if (state.isPlaying) stopPlay();
      else startPlay();
    });

    reset?.addEventListener("click", () => {
      stopPlay();
      state.currentStep = -1;
      updateStep(0);
      if (state.isVisible) startPlay();
    });

    document.addEventListener("keydown", (event) => {
      if (!state.isVisible || state.totalSteps === 0) return;

      if (event.key === " ") {
        event.preventDefault();
        if (state.isPlaying) stopPlay();
        else startPlay();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stopPlay();
        if (state.currentStep < state.totalSteps - 1) updateStep(state.currentStep + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stopPlay();
        if (state.currentStep > 0) updateStep(state.currentStep - 1);
      }
    });
  }

  function setupVisibilityGuard() {
    const driver = document.querySelector("#es-driver");
    if (!driver) return;

    const observer = new IntersectionObserver((entries) => {
      state.isVisible = entries[0].isIntersecting;
      if (state.isVisible) startPlay();
      else if (state.isPlaying) stopPlay();
    }, { threshold: 0.25 });

    observer.observe(driver);
  }

  window.mapboxgl.accessToken = cfg.token;
  state.map = new window.mapboxgl.Map({
    container: "es-map",
    style: cfg.style,
    center: [-4.5, 40.2],
    zoom: mobileMapQuery.matches ? 3.5 : 6,
    attributionControl: false,
    scrollZoom: false,
    dragPan: false,
    touchZoomRotate: false,
    doubleClickZoom: false,
    maxZoom: 15,
    minZoom: 3,
  });

  state.map.on("load", () => {
    fitResponsiveMap();

    if (state.map.getLayer(cfg.existingLayerId)) {
      state.map.removeLayer(cfg.existingLayerId);
    }

    addLayers();
    fetchGeojson();
  });

  state.map.on("resize", fitResponsiveMap);
  mobileMapQuery.addEventListener?.("change", updateResponsiveMapCamera);

  setupControls();
  setupVisibilityGuard();
}

initEclipseScrollMap();
