// main.js

// ============ CARRUSELS ============

(function () {
  const carousels = document.querySelectorAll("[data-carousel]");
  const AUTO_INTERVAL = 5000; // ms

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
    const dots = Array.from(carousel.querySelectorAll(".carousel__dot"));
    if (!slides.length || !dots.length) return;

    let index = 0;
    let timer = null;

    function showSlide(newIndex) {
      index = (newIndex + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(() => {
        showSlide(index + 1);
      }, AUTO_INTERVAL);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // clic als punts
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        startAuto();
      });
    });

    // pausa mentre el ratolí és sobre el carrusel
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    // inici
    showSlide(0);
    startAuto();
  });
})();


// ============ MENU MOBIL (HAMBURGUESA) ============

(function () {
  const toggle = document.querySelector(".site-header__toggle");
  const nav = document.querySelector(".site-header__nav");
  if (!toggle || !nav) return;

  function openNav() {
    toggle.classList.add("is-open");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  // estat inicial
  toggle.setAttribute("aria-expanded", "false");

  // click botó
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });

  // tanca amb ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // tanca quan cliques un enllaç dins el menú (p.ex. ES / CAT)
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeNav();
  });
})();
