document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     MENÚ HAMBURGUESA RESPONSIVE
  ============================================================ */
  const toggle = document.querySelector(".site-header__toggle");
  const nav = document.querySelector(".site-header__nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open");
      document.body.classList.toggle("nav-open");
    });
  }


  /* ============================================================
     ANIMACIÓ DELS NÚMEROS (de 0 al valor)
  ============================================================ */
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  if (statNumbers.length) {
    const animateStats = () => {
      statNumbers.forEach((el) => {
        const target = parseFloat(el.dataset.target);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const isDecimal = el.dataset.format === "decimal";

        const duration = 1200; // ms
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const value = target * progress;
          let display;

          if (isDecimal) {
            display = value.toFixed(1).replace(".", ",");
          } else {
            display = Math.round(value).toString();
          }

          el.textContent = `${prefix}${display}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.querySelector(".stats-section");
    if (statsSection) observer.observe(statsSection);
  }


  /* ============================================================
     ACORDIÓ “LA RESPOSTA DE LA CIUTAT”
  ============================================================ */
  const accordions = document.querySelectorAll(".cr-accordion");

  accordions.forEach((item) => {
    const header = item.querySelector(".cr-accordion__header");
    const panel = item.querySelector(".cr-accordion__panel");

    if (!header || !panel) return;

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Tancar tots els altres
      accordions.forEach((other) => {
        const otherPanel = other.querySelector(".cr-accordion__panel");
        if (otherPanel) {
          other.classList.remove("is-open");
          otherPanel.style.maxHeight = null;
        }
      });

      // Obrir el seleccionat si estava tancat
      if (!isOpen) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

    /* ============================================================
     TABS / PASTILLES – TIPOLOGIES DE VIOLÈNCIES DIGITALS
  ============================================================ */
  const digitalTypesSection = document.querySelector(".digital-types");

  if (digitalTypesSection) {
    const pills = digitalTypesSection.querySelectorAll(".dt-pill");
    const card = digitalTypesSection.querySelector(".digital-types__card");
    const cardTitle = digitalTypesSection.querySelector(".digital-types__card-title");
    const cardText = digitalTypesSection.querySelector(".digital-types__card-text");

    const setCardFromPill = (pill) => {
      if (!pill) return;
      const title = pill.dataset.title || pill.textContent.trim();
      const body = pill.dataset.body || "";

      cardTitle.textContent = title;
      cardText.textContent = body;

      // petita animació de canvi
      card.classList.add("digital-types__card--changing");
      setTimeout(() => {
        card.classList.remove("digital-types__card--changing");
      }, 180);
    };

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        if (pill.classList.contains("dt-pill--active")) return;

        pills.forEach((p) => p.classList.remove("dt-pill--active"));
        pill.classList.add("dt-pill--active");
        setCardFromPill(pill);
      });
    });

    // inicialitzar targeta amb la pill activa o la primera
    const initial = digitalTypesSection.querySelector(".dt-pill--active") || pills[0];
    if (initial) setCardFromPill(initial);
  }


    /* ============================================================
     FLIP CARDS – SECCIÓ 4 QUADRATS
  ============================================================ */
  const flipCards = document.querySelectorAll(".call-card--flippable");

  flipCards.forEach((card) => {
    const inner = card.querySelector(".call-card__inner");
    const img = card.querySelector(".call-card__front-image");
    const bg = card.dataset.bg;

    // assignem imatge de fons des de data-bg
    if (bg && img) {
      img.style.backgroundImage = `url("${bg}")`;
    }

    // clic per girar
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });


  /* ============================================================
     FLIP BANNER – NOU DEPARTAMENT + PIS ALEJANDRO/VANESA
  ============================================================ */
  const flipBanners = document.querySelectorAll(".flip-banner--flippable");

  flipBanners.forEach((banner) => {
    const inner = banner.querySelector(".flip-banner__inner");
    const img =
      banner.querySelector(".flip-banner__image") ||
      banner.querySelector(".flip-banner__side-image");
    const bg = banner.dataset.bg;
    const closeBtn = banner.querySelector(".flip-banner__close");

    // Imatge de fons des de data-bg
    if (bg && img) {
      img.style.backgroundImage = `url("${bg}")`;
    }

    // Clic general per girar
    banner.addEventListener("click", () => {
      banner.classList.toggle("is-flipped");
    });

    // Botó X -> només tanca (sense tornar-la a girar per error)
    if (closeBtn) {
      closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        banner.classList.remove("is-flipped");
      });
    }
  });


/* ============================================================
   CAROUSEL (4 fotos, auto-play, arrows, fade)
============================================================ */
const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carouselEl) => {
  const slides = carouselEl.querySelectorAll(".carousel__slide");
  const dots = carouselEl.closest(".carousel-section__inner")
                .querySelectorAll(".carousel__dot");
  const btnPrev = carouselEl.querySelector(".carousel__arrow--prev");
  const btnNext = carouselEl.querySelector(".carousel__arrow--next");

  let index = 0;
  let timer;

  const showSlide = (i) => {
    slides.forEach((slide, n) => {
      slide.classList.toggle("is-active", n === i);
    });
    dots.forEach((dot, n) => {
      dot.classList.toggle("is-active", n === i);
    });
    index = i;
  };

  const nextSlide = () => {
    showSlide((index + 1) % slides.length);
  };

  const prevSlide = () => {
    showSlide((index - 1 + slides.length) % slides.length);
  };

  // Auto-play
  const startAuto = () => {
    timer = setInterval(nextSlide, 5000);
  };
  const stopAuto = () => {
    clearInterval(timer);
  };

  // Inicial
  showSlide(0);
  startAuto();

  // Events
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAuto();
      showSlide(i);
      startAuto();
    });
  });

  btnNext.addEventListener("click", () => {
    stopAuto();
    nextSlide();
    startAuto();
  });

  btnPrev.addEventListener("click", () => {
    stopAuto();
    prevSlide();
    startAuto();
  });
});


  /* ============================================================
     POPUP OFICINA DEL CATALÀ
  ============================================================ */
  const popupTrigger = document.getElementById("popupOficinaTrigger");
  const popup = document.getElementById("popupOficina");

  if (popupTrigger && popup) {
    const closeBtn = popup.querySelector(".popup-oficina__close");

    const openPopup = () => {
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open-popup");
    };

    const closePopup = () => {
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open-popup");
    };

    popupTrigger.addEventListener("click", openPopup);

    if (closeBtn) {
      closeBtn.addEventListener("click", closePopup);
    }

    // tancar clicant fora del panell
    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        closePopup();
      }
    });

    // tancar amb tecla ESC
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && popup.classList.contains("is-open")) {
        closePopup();
      }
    });
  }



  /* ============================================================
     DEBUG (el pots eliminar)
  ============================================================ */
  console.log("JS carregat – Menú + Stats + Acordions funcionant.");

});
