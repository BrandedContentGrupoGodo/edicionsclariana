// Any dinàmic al peu de pàgina
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* MENÚ MUNICIPIS – HAMBURGUESA MÒBIL */
const navMenu = document.querySelector(".header__menu");
const menuToggle = document.querySelector(".header__menu-toggle");

if (navMenu && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("header__menu--open");
    menuToggle.classList.toggle("header__menu-toggle--open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

// REVEAL SCROLL DEL TÍTOL I SUBTÍTOL (deixem igual)
const revealElements = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  function onScrollFallback() {
    const trigger = window.innerHeight * 0.75;

    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) {
        el.classList.add("is-visible");
      }
    });
  }

  window.addEventListener("scroll", onScrollFallback);
  onScrollFallback();
}
