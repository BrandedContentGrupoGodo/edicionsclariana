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
     DEBUG (el pots eliminar)
  ============================================================ */
  console.log("JS carregat – Menú + Stats + Acordions funcionant.");

});
