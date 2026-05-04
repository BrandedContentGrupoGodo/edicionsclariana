/* =====================
   CAROUSEL
===================== */
const wrapper = document.querySelector('.carousel__wrapper');

if (wrapper) {
  const slides = document.querySelectorAll('.carousel__slide');
  const dots = document.querySelectorAll('.dot');

  let current = 0;

  function goToSlide(index) {
    current = index;
    wrapper.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  setInterval(() => {
    current = (current + 1) % slides.length;
    goToSlide(current);
  }, 10000);
}


/* =====================
   POPUP FILANTROPIA
===================== */
const openBtn = document.querySelector('.open-popup');
const popup = document.getElementById('popup-filantropia');
const closeBtn = document.querySelector('.popup__close');
const overlay = document.querySelector('.popup__overlay');

if (openBtn && popup && closeBtn && overlay) {
  openBtn.addEventListener('click', () => {
    popup.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
    popup.classList.remove('active');
  });
}


/* =====================
   TALENTO POPUPS (FIX REAL)
===================== */

const plusBtns = document.querySelectorAll('.talento__plus');

if (plusBtns.length) {

  plusBtns.forEach(btn => {

    btn.addEventListener('click', (e) => {

      const id = btn.getAttribute('data-popup');
      const popup = document.getElementById(id);

      if (!popup) return;

      // cerrar todos
      document.querySelectorAll('.popup-card').forEach(p => {
        p.classList.remove('active');
      });

      // POSICIÓN INTELIGENTE (no se sale de pantalla)
      const popupWidth = 320;
      const popupHeight = 300;

      let left = e.clientX;
      let top = e.clientY;

      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 20;
      }

      if (top + popupHeight > window.innerHeight) {
        top = window.innerHeight - popupHeight - 20;
      }

      popup.style.left = left + 'px';
      popup.style.top = top + 'px';

      popup.classList.add('active');
    });

  });

  // cerrar popup
  document.querySelectorAll('.popup-card .close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.popup-card').classList.remove('active');
    });
  });

  // cerrar si clic fuera (UX mejor)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.popup-card') && !e.target.closest('.talento__plus')) {
      document.querySelectorAll('.popup-card').forEach(p => {
        p.classList.remove('active');
      });
    }
  });

}


const accordionItems = document.querySelectorAll('.accordion__item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion__header');

  header.addEventListener('click', () => {

    const isActive = item.classList.contains('active');

    // cerrar todos
    accordionItems.forEach(i => i.classList.remove('active'));

    // abrir actual
    if (!isActive) {
      item.classList.add('active');
    }

  });
});

const videoBlocks = document.querySelectorAll('.video-block__media');

videoBlocks.forEach(block => {
  const img = block.querySelector('img');
  const btn = block.querySelector('.video-block__play');
  const video = block.querySelector('video');

  block.addEventListener('click', () => {

    img.style.display = 'none';
    btn.style.display = 'none';

    video.style.display = 'block';
    video.play();

  });
});


const autoCarousel = document.querySelector('.carousel-auto__track');

if (autoCarousel) {

  const slides = autoCarousel.querySelectorAll('img');
  let index = 0;

  setInterval(() => {

    index++;

    if (index >= slides.length) {
      index = 0;
    }

    autoCarousel.style.transform = `translateX(-${index * 100}%)`;

  }, 4000);

}


const ytBlocks = document.querySelectorAll('.video-block__media');

ytBlocks.forEach(block => {

  block.addEventListener('click', () => {

    const videoId = block.dataset.video;
    const iframe = block.querySelector('iframe');
    const img = block.querySelector('img');
    const btn = block.querySelector('.video-block__play');

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    iframe.style.display = 'block';
    img.style.display = 'none';
    btn.style.display = 'none';

  });

});