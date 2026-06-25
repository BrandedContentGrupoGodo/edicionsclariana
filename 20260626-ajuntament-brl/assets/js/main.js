const carousel = document.querySelector('.carousel-tour');

if (carousel) {
  const isSpanish = document.documentElement.lang === 'es';
  const track = carousel.querySelector('.carousel-tour__track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-tour__slide'));
  const dotsWrap = carousel.querySelector('.carousel-tour__dots');
  const prev = carousel.querySelector('.carousel-tour__arrow--prev');
  const next = carousel.querySelector('.carousel-tour__arrow--next');
  let current = 0;

  const dots = slides.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${isSpanish ? 'Ir a la imagen' : 'Anar a la imatge'} ${index + 1}`);
    button.addEventListener('click', () => setSlide(index));
    dotsWrap.appendChild(button);
    return button;
  });

  const setSlide = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === current));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === current));
  };

  prev.addEventListener('click', () => setSlide(current - 1));
  next.addEventListener('click', () => setSlide(current + 1));
  setSlide(0);
}

document.querySelectorAll('.flip-card-tour').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});

const openButtons = document.querySelectorAll('[data-modal-open]');
const closeButtons = document.querySelectorAll('[data-modal-close]');

const closeModals = () => {
  document.querySelectorAll('.modal-tour.is-active').forEach((modal) => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
};

openButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modalOpen);
    if (!modal) return;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', closeModals);
});

document.querySelectorAll('.modal-tour').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModals();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModals();
});
