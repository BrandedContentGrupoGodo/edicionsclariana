(function(){
  const slideText = {
    es: [
      { title: 'Fase 1', subtitle: 'Primer contacto'},
      { title: 'Fase 2', subtitle: 'Eclipse parcial' },
      {
        title: 'Fase 3',
        subtitle: 'Totalidad'
      },
      { title: 'Fase 4', subtitle: 'Fin de la totalidad' },
      { title: 'Fase 5', subtitle: 'Fin del eclipse' },
    ],
    ca: [
      { title: 'Fase 1', subtitle: 'Primer contacte'},
      { title: 'Fase 2', subtitle: 'Eclipsi parcial' },
      {
        title: 'Fase 3',
        subtitle: 'Totalitat'
      },
      { title: 'Fase 4', subtitle: 'Fi de la totalitat' },
      { title: 'Fase 5', subtitle: "Fi de l'eclipsi" },
    ],
  };

  const phasePositions = [-9, 20, 29.5, 48, 78];
  const roots = Array.from(document.querySelectorAll('.eclipse-phase-interactive'));
  const travelMs = 11500;
  const totalityHoldMs = 2000;
  const loopMs = travelMs + totalityHoldMs;
  if (!roots.length) return;

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t){
    return a + (b - a) * t;
  }

  function easeOutQuad(t){
    return 1 - (1 - t) * (1 - t);
  }

  function easeInOutSine(t){
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function mixColor(a, b, t){
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
    ];
  }

  function rgb(color){
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }

  function getPhaseState(progress, easing){
    const raw = progress * (phasePositions.length - 1);
    const section = Math.min(Math.floor(raw), phasePositions.length - 1);
    const local = raw - section;
    const eased = easing(local);
    const next = Math.min(section + 1, phasePositions.length - 1);
    const activePhase = local < 0.45 ? section : next;
    const positionPercent = lerp(phasePositions[section], phasePositions[next], eased);
    return { activePhase, positionPercent, progress, section, local };
  }

  function getLoopProgress(elapsedMs){
    const totalityProgress = 0.5;
    const holdStart = travelMs * totalityProgress;
    const elapsed = elapsedMs % loopMs;
    if (elapsed < holdStart) return elapsed / travelMs;
    if (elapsed < holdStart + totalityHoldMs) return totalityProgress;
    return (elapsed - totalityHoldMs) / travelMs;
  }

  function getTotalityOpacity(state, useGlobalBoost){
    const target = phasePositions[2];
    const distance = Math.abs(state.positionPercent - target);
    const range = 4;
    const localOpacity = distance >= range ? 0 : Math.pow(1 - distance / range, 2);
    if (!useGlobalBoost) return localOpacity;

    const globalTotality = 1 - Math.abs(state.progress - 0.5) / 0.5;
    return Math.max(localOpacity, globalTotality * 0.9);
  }

  function setMobileAtmosphere(progress){
    const dim = easeInOutSine(1 - Math.abs(progress - 0.5) / 0.5);
    const base = [37, 37, 37];
    const dark = [7, 7, 8];
    const warm = [48, 45, 38];
    const outColor = progress < 0.5 ? mixColor(base, dark, dim) : mixColor(dark, warm, 1 - dim);
    const softText = mixColor([255, 255, 255], [244, 236, 210], dim * 0.65);
    const mutedAlpha = lerp(0.88, 0.76, dim);

    document.documentElement.style.setProperty('--bg', rgb(outColor));
    document.documentElement.style.setProperty('--page', rgb(outColor));
    document.documentElement.style.setProperty('--eclipse-dim', dim.toFixed(3));
    document.documentElement.style.setProperty('--eclipse-soft-text', rgb(softText));
    document.documentElement.style.setProperty('--eclipse-muted-text', `rgba(${softText[0]},${softText[1]},${softText[2]},${mutedAlpha.toFixed(3)})`);
  }

  function resetAtmosphere(){
    document.documentElement.style.setProperty('--bg', '#2a2a2a');
    document.documentElement.style.setProperty('--page', '#2a2a2a');
    document.documentElement.style.setProperty('--eclipse-dim', '0');
    document.documentElement.style.setProperty('--eclipse-soft-text', '#ffffff');
    document.documentElement.style.setProperty('--eclipse-muted-text', 'rgba(255,255,255,.86)');
  }

  function updateRoot(root, state, useGlobalBoost){
    const lang = root.dataset.lang === 'ca' ? 'ca' : 'es';
    const slides = slideText[lang];
    const totalityImage = root.querySelector('.eclipse-phase-interactive__image--totality');
    const title = root.querySelector('.eclipse-phase-interactive__title');
    const subtitle = root.querySelector('.eclipse-phase-interactive__subtitle');
    const description = root.querySelector('.eclipse-phase-interactive__description');
    const moon = root.querySelector('.eclipse-phase-interactive__moon');
    const imageContainer = root.querySelector('.eclipse-phase-interactive__image-container');
    const copy = root.querySelector('.eclipse-phase-interactive__copy');
    const slide = slides[state.activePhase];

    if (root.dataset.phase !== String(state.activePhase)) {
      root.dataset.phase = String(state.activePhase);
      copy.classList.remove('is-visible');
      title.textContent = slide.title;
      subtitle.textContent = slide.subtitle;
      description.textContent = slide.text || '';
      requestAnimationFrame(() => copy.classList.add('is-visible'));
    }

    const imageWidth = imageContainer.offsetWidth;
    const moonDiameter = moon.offsetWidth;
    const moonX = (state.positionPercent / 100) * imageWidth;
    const constrainedX = clamp(moonX, -moonDiameter, imageWidth);
    moon.style.transform = `translate(${constrainedX}px, -50%)`;
    totalityImage.style.opacity = String(getTotalityOpacity(state, useGlobalBoost));

    if (state.section === 4) {
      moon.style.opacity = '0';
    } else if (state.section === 3 && state.local > 0.5) {
      moon.style.opacity = String(Math.max(0, 0.9 * (1 - (state.local - 0.5) * 2)));
    } else {
      moon.style.opacity = '0.9';
    }
  }

  const players = roots.map((root) => ({
    root,
    raf: 0,
    startedAt: 0,
    running: false,
  }));

  function renderPlayer(player, time){
    if (!player.running) return;
    const progress = getLoopProgress(time - player.startedAt);
    const state = getPhaseState(progress, easeInOutSine);
    updateRoot(player.root, state, true);
    player.raf = requestAnimationFrame((nextTime) => renderPlayer(player, nextTime));
  }

  function startPlayer(player){
    if (player.running) return;
    player.running = true;
    player.startedAt = performance.now();
    player.root.classList.add('is-playing');
    player.raf = requestAnimationFrame((time) => renderPlayer(player, time));
  }

  function stopPlayer(player){
    if (!player.running) return;
    player.running = false;
    player.root.classList.remove('is-playing');
    cancelAnimationFrame(player.raf);
    player.raf = 0;
    resetAtmosphere();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const player = players.find((item) => item.root === entry.target);
      if (!player) return;
      if (entry.isIntersecting) startPlayer(player);
      else stopPlayer(player);
    });
  }, {
    root: null,
    threshold: 0.35,
  });

  players.forEach((player) => {
    const state = getPhaseState(0, easeInOutSine);
    updateRoot(player.root, state, true);
    observer.observe(player.root);
  });
})();
