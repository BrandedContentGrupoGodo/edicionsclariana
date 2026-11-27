(() => {
  const root = document.querySelector('.md-sagrera');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stats = root.querySelector('.md-stats');
  if (!('IntersectionObserver' in window) || reduced) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    const counters = stats.querySelectorAll('[data-count]');
    const start = performance.now();
    const format = new Intl.NumberFormat('es-ES', { useGrouping: 'always' });
    function tick(now) {
      const progress = Math.min((now - start) / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counters.forEach(counter => {
        counter.textContent = format.format(Math.round(Number(counter.dataset.count) * eased));
      });
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, { threshold: 0.35 });
  observer.observe(stats);

  const revealDuration = 320;
  let nextCardStart = 0;
  const revealObserver = new IntersectionObserver(entries => {
    const now = performance.now();
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      revealObserver.unobserve(target);

      let delay = 0;
      if (target.matches('.md-card')) {
        delay = Math.max(0, nextCardStart - now);
        nextCardStart = now + delay + revealDuration;
      }

      target.style.setProperty('--md-reveal-delay', delay + 'ms');
      target.classList.remove('md-reveal-pending');
    }
  }, { threshold: 0.12 });
  root.querySelectorAll('.md-photo, .md-card').forEach(target => {
    target.classList.add('md-reveal', 'md-reveal-pending');
    revealObserver.observe(target);
  });
})();

