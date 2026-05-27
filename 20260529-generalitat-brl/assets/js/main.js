

const counters = document.querySelectorAll('[data-counter]');

const counterObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (!entry.isIntersecting) return;

    const el = entry.target;

    const target = +el.dataset.counter;
    const suffix = el.dataset.suffix || '';

    const duration = 1800;

    let start = 0;

    const startTime = performance.now();

    const updateCounter = (currentTime) => {

      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const ease =
        1 - Math.pow(1 - progress, 3);

      const value = Math.floor(ease * target);

      el.textContent =
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }

    };

    requestAnimationFrame(updateCounter);

    counterObserver.unobserve(el);

  });

}, {
  threshold: 0.45
});

counters.forEach(counter => {
  counterObserver.observe(counter);
});




const dreamSection = document.querySelector('.dream-section');

const dreamItems = document.querySelectorAll('.dream-list__item');

const dreamObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (!entry.isIntersecting) return;

    // activar secció
    dreamSection.classList.add('is-visible');

    // animació punts un a un
    dreamItems.forEach((item, index) => {

      setTimeout(() => {
        item.classList.add('is-visible');
      }, 500 + (index * 180));

    });

    dreamObserver.unobserve(dreamSection);

  });

}, {
  threshold: 0.35
});

dreamObserver.observe(dreamSection);


const studiesSection = document.querySelector('.studies-grid-section');

const studyCards = document.querySelectorAll('.study-card');

const studiesObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (!entry.isIntersecting) return;

    studyCards.forEach((card, index) => {

      setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 220);

    });

    studiesObserver.unobserve(studiesSection);

  });

}, {
  threshold: 0.25
});

studiesObserver.observe(studiesSection);
