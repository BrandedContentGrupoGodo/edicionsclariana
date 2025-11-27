/***************************************************************
 * ANY DINÀMIC AL PEU DE PÀGINA
 ***************************************************************/
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/***************************************************************
 * MENÚ MUNICIPIS – HAMBURGUESA MÒBIL
 ***************************************************************/
const navMenu = document.querySelector(".header__menu");
const menuToggle = document.querySelector(".header__menu-toggle");

if (navMenu && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("header__menu--open");
    menuToggle.classList.toggle("header__menu-toggle--open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/***************************************************************
 * REVEAL-ON-SCROLL COMPATIBLE AMB LA VANGUARDIA
 * (sense IntersectionObserver)
 ***************************************************************/
const revealElements = document.querySelectorAll(".reveal-on-scroll");

function revealOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerPoint) {
      el.classList.add("is-visible");
    }
  });
}

// Executem en els moments clau
window.addEventListener("load", revealOnScroll);
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("resize", revealOnScroll);

// Per si ja hi ha elements visibles de bon principi
revealOnScroll();
