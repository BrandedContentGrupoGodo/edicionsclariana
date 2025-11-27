document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     NO-JS FALLBACK
  ============================================================ */
  document.documentElement.classList.remove("no-js");


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

        const duration = 1200;
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

          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      });
    };

    const statsSection = document.querySelector(".stats-section");
    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
          }
        });
      }, { threshold: 0.3 });

      observer.observe(statsSection);
    }
  }


  /* ============================================================
     ACORDIÓ
  ============================================================ */
  const accordions = document.querySelectorAll(".cr-accordion");

  accordions.forEach((item) => {
    const header = item.querySelector(".cr-accordion__header");
    const panel = item.querySelector(".cr-accordion__panel");

    if (!header || !panel) return;

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      accordions.forEach((other) => {
        const otherPanel = other.querySelector(".cr-accordion__panel");
        if (otherPanel) {
          other.classList.remove("is-open");
          otherPanel.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });


  /* ============================================================
     TABS / PASTILLES
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

      card.classList.add("digital-types__card--changing");
      setTimeout(() => card.classList.remove("digital-types__card--changing"), 180);
    };

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        if (pill.classList.contains("dt-pill--active")) return;

        pills.forEach((p) => p.classList.remove("dt-pill--active"));
        pill.classList.add("dt-pill--active");
        setCardFromPill(pill);
      });
    });

    const initial = digitalTypesSection.querySelector(".dt-pill--active") || pills[0];
    if (initial) setCardFromPill(initial);
  }


  /* ============================================================
     FLIP CARDS
  ============================================================ */
  const flipCards = document.querySelectorAll(".call-card--flippable");

  flipCards.forEach((card) => {
    const img = card.querySelector(".call-card__front-image");
    const bg = card.dataset.bg;

    if (bg && img) img.style.backgroundImage = `url("${bg}")`;

    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  });


  /* ============================================================
     FLIP BANNERS
  ============================================================ */
  const flipBanners = document.querySelectorAll(".flip-banner--flippable");

  flipBanners.forEach((banner) => {
    const img =
      banner.querySelector(".flip-banner__image") ||
      banner.querySelector(".flip-banner__side-image");
    const bg = banner.dataset.bg;
    const closeBtn = banner.querySelector(".flip-banner__close");

    if (bg && img) img.style.backgroundImage = `url("${bg}")`;

    banner.addEventListener("click", () => banner.classList.toggle("is-flipped"));

    if (closeBtn) {
      closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        banner.classList.remove("is-flipped");
      });
    }
  });


  /* ============================================================
     FADE-UP genèric
  ============================================================ */
  const fades = document.querySelectorAll(".fade-up");

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

  fades.forEach(el => fadeObserver.observe(el));


  /* ============================================================
     FADE-RIGHT (destacats entrant per la dreta)
  ============================================================ */
  const fadeRights = document.querySelectorAll(".fade-right");

  const fadeRightObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        fadeRightObserver.unobserve(entry.target);
      }
    });
  },{threshold:0.2, rootMargin:"0px 0px -10% 0px"});

  fadeRights.forEach(el=>fadeRightObserver.observe(el));

/* ============================================================
   FADE-LEFT (imatges entrant per l’esquerra)
============================================================ */
const fadeLefts = document.querySelectorAll(".fade-left");

const fadeLeftObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      fadeLeftObserver.unobserve(entry.target);
    }
  });
},{threshold:0.2, rootMargin:"0px 0px -10% 0px"});

fadeLefts.forEach(el => fadeLeftObserver.observe(el));

  /* ============================================================
     TEXT BLOCKS dins hero / story-scroll
  ============================================================ */
  const textBlocks = document.querySelectorAll(".text-block");

  const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  }, { threshold: 0.55 });

  textBlocks.forEach(b => textObserver.observe(b));


  /* ============================================================
     SECCIONS BLANQUES (slice, intro)
  ============================================================ */
  const sections = document.querySelectorAll(".slice, .intro");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ============================================================
     REDUCED MOTION
  ============================================================ */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".fade-up, .fade-right, .text-block, .slice, .intro").forEach(el => {
      el.style.transition = "none";
      el.style.transform = "none";
      el.style.opacity = 1;
    });
  }


  /* ============================================================
     DEBUG
  ============================================================ */
  console.log("JS carregat – Menú + Stats + Acordions + Animacions OK");

});



/* ============================================================
   3 CARDS → MODALS
============================================================ */
const caseCards = document.querySelectorAll(".case-card");
const modals = document.querySelectorAll(".case-modal");

const openModal = (id) => {
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
};

const closeModal = (modal) => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
};

caseCards.forEach(card=>{
  card.addEventListener("click", ()=>{
    openModal(card.dataset.modal);
  });
});

modals.forEach(modal=>{
  modal.querySelectorAll("[data-close]").forEach(btn=>{
    btn.addEventListener("click", ()=>closeModal(modal));
  });
});

// tancar amb ESC
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    modals.forEach(m=>{
      if(m.classList.contains("is-open")) closeModal(m);
    });
  }
});
