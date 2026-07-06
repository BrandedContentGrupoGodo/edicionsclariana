const accordionItems = document.querySelectorAll('.accordion__item');

accordionItems.forEach((item) => {
  const trigger = item.querySelector('.accordion__trigger');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    accordionItems.forEach((otherItem) => {
      const otherTrigger = otherItem.querySelector('.accordion__trigger');
      otherItem.classList.remove('is-open');
      otherTrigger.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

const flipCards = document.querySelectorAll('.info-card');

flipCards.forEach((card) => {
  card.setAttribute('role', 'button');
  card.setAttribute('aria-pressed', 'false');

  const toggleCard = () => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(isFlipped));
  };

  card.addEventListener('click', toggleCard);

  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleCard();
  });
});

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');

document.querySelectorAll('.popup-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeModal(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

function initEclipseScrollMap(){
  const wrapper = document.querySelector('#es-wrapper');
  if (!wrapper) return;

  const loading = document.querySelector('#es-loading');
  const error = document.querySelector('#es-error');

  if (!window.mapboxgl) {
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'block';
    return;
  }

  const cfg = {
    token: 'pk.eyJ1IjoibGF1cjA1IiwiYSI6ImNpbmtmM2FjazAwODF2eG0yNjhteTcxdHIifQ.l7uzjVe2b1L8dHh_Z9JjoQ',
    style: 'mapbox://styles/laur05/cml8j0rad001v01r0e90u6m8t',
    geojson: 'https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-01/20260202_eclipse_01/shadows_merged_18.291-18.567-2026-simplified-0.0001.geojson',
    existingLayerId: 'shadows-merged-18-bjnzz7',
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    borderColor: 'rgba(255,255,255,0.2)',
    vhPerStep: window.innerWidth <= 768 ? 2.5 : 4,
    playMs: window.innerWidth <= 768 ? 120 : 100,
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

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const pad = (value) => (value < 10 ? `0${value}` : `${value}`);

  function decimalToHms(decimal){
    const localDecimal = decimal + 2;
    const hours = Math.floor(localDecimal);
    const minutes = Math.floor((localDecimal - hours) * 60);
    const seconds = Math.round(((localDecimal - hours) * 60 - minutes) * 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function stepToDecimal(name){
    return parseFloat(name.split('_').pop());
  }

  function preprocessGeojson(geojson){
    const keys = Object.keys(geojson.features[0].properties);
    const allSteps = keys
      .filter((key) => key.startsWith('mancha_ut_'))
      .sort((a, b) => stepToDecimal(a) - stepToDecimal(b));

    state.timeSteps = allSteps.filter((step) => stepToDecimal(step) >= 18.425);
    state.totalSteps = state.timeSteps.length;
    state.stepCache = state.timeSteps.map((step) => ({
      type: 'FeatureCollection',
      features: geojson.features.filter((feature) => feature.properties[step] != null),
    }));

    document.querySelector('#es-driver').style.height = `${state.totalSteps * cfg.vhPerStep}vh`;
  }

  function addLayers(){
    state.map.addSource('es-shadow', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });

    state.map.addLayer({
      id: 'es-shadow-fill',
      type: 'fill',
      source: 'es-shadow',
      paint: {
        'fill-color': cfg.shadowColor,
        'fill-opacity': cfg.shadowOpacity,
      },
    });

    state.map.addLayer({
      id: 'es-shadow-line',
      type: 'line',
      source: 'es-shadow',
      paint: {
        'line-color': cfg.borderColor,
        'line-width': 1,
      },
    });
  }

  function updateStep(index){
    if (index < 0 || index >= state.totalSteps || index === state.currentStep) return;

    state.currentStep = index;
    state.map.getSource('es-shadow').setData(state.stepCache[index]);
    document.querySelector('#es-time-val').textContent = decimalToHms(stepToDecimal(state.timeSteps[index]));

    const percent = (index / (state.totalSteps - 1)) * 100;
    document.querySelector('#es-fill').style.width = `${percent}%`;
    document.querySelector('#es-dot').style.left = `${percent}%`;
  }

  function hideLoading(){
    if (loading) loading.style.display = 'none';
  }

  async function fetchGeojson(){
    try {
      const response = await fetch(cfg.geojson);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      preprocessGeojson(data);
      hideLoading();
      updateStep(0);
    } catch (err) {
      console.error('[EclipseScroll]', err);
      hideLoading();
      if (error) error.style.display = 'block';
    }
  }

  function getScrollProgress(){
    const driver = document.querySelector('#es-driver');
    const rect = driver.getBoundingClientRect();
    const maxTravel = rect.height - window.innerHeight;
    if (maxTravel <= 0) return 0;
    return clamp(-rect.top / maxTravel, 0, 1);
  }

  function onScroll(){
    if (state.totalSteps === 0) return;

    const progress = getScrollProgress();
    const hint = document.querySelector('#es-hint');
    if (!state.hintHidden && progress > 0.005 && hint) {
      hint.style.opacity = '0';
      state.hintHidden = true;
    }

    updateStep(Math.round(progress * (state.totalSteps - 1)));
  }

  function setupScroll(){
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onScroll();
      });
    }, { passive: true });
  }

  function scrollToStep(index){
    const driver = document.querySelector('#es-driver');
    const rect = driver.getBoundingClientRect();
    const maxTravel = rect.height - window.innerHeight;
    const driverTop = window.scrollY + rect.top;
    window.scrollTo({
      top: driverTop + (index / (state.totalSteps - 1)) * maxTravel,
      behavior: 'auto',
    });
  }

  function stopPlay(){
    state.isPlaying = false;
    document.querySelector('#es-play').textContent = '▶';
    clearInterval(state.playTimer);
  }

  function startPlay(){
    state.isPlaying = true;
    document.querySelector('#es-play').textContent = '⏸';

    if (state.currentStep >= state.totalSteps - 1) {
      state.currentStep = -1;
      scrollToStep(0);
    }

    state.playTimer = setInterval(() => {
      const nextStep = state.currentStep + 1;
      if (nextStep >= state.totalSteps) {
        stopPlay();
        return;
      }
      scrollToStep(nextStep);
    }, cfg.playMs);
  }

  function setupControls(){
    const play = document.querySelector('#es-play');
    const reset = document.querySelector('#es-reset');

    play?.addEventListener('click', () => {
      if (state.isPlaying) stopPlay();
      else startPlay();
    });

    reset?.addEventListener('click', () => {
      stopPlay();
      state.currentStep = -1;
      scrollToStep(0);
      updateStep(0);
    });

    document.addEventListener('keydown', (event) => {
      if (!state.isVisible || state.totalSteps === 0) return;

      if (event.key === ' ') {
        event.preventDefault();
        if (state.isPlaying) stopPlay();
        else startPlay();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        stopPlay();
        if (state.currentStep < state.totalSteps - 1) scrollToStep(state.currentStep + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stopPlay();
        if (state.currentStep > 0) scrollToStep(state.currentStep - 1);
      }
    });
  }

  function setupVisibilityGuard(){
    const observer = new IntersectionObserver((entries) => {
      state.isVisible = entries[0].isIntersecting;
      if (!state.isVisible && state.isPlaying) stopPlay();
    }, { threshold: 0 });

    observer.observe(document.querySelector('#es-driver'));
  }

  window.mapboxgl.accessToken = cfg.token;
  state.map = new window.mapboxgl.Map({
    container: 'es-map',
    style: cfg.style,
    center: [-4.5, 40.2],
    zoom: window.innerWidth <= 768 ? 4.5 : 6,
    attributionControl: false,
    scrollZoom: false,
    dragPan: false,
    touchZoomRotate: false,
    doubleClickZoom: false,
    maxZoom: 15,
    minZoom: 4,
  });

  state.map.on('load', () => {
    if (state.map.getLayer(cfg.existingLayerId)) {
      state.map.removeLayer(cfg.existingLayerId);
    }

    addLayers();
    fetchGeojson();
  });

  setupControls();
  setupScroll();
  setupVisibilityGuard();
}

initEclipseScrollMap();
