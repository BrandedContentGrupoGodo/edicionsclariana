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
 * REVEAL-ON-SCROLL – COMPATIBLE AMB IFRAME / LA VANGUARDIA
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

// seguiment del scroll per detectar si hi ha moviment real
let lastScrollY = window.scrollY;
let scrollHasMoved = false;

window.addEventListener("scroll", () => {
  if (window.scrollY !== lastScrollY) {
    scrollHasMoved = true;
    lastScrollY = window.scrollY;
  }
  revealOnScroll();
});

window.addEventListener("resize", revealOnScroll);
window.addEventListener("load", () => {
  revealOnScroll();

  // PLA C: si després d'una estona NO hi ha hagut scroll real,
  // forcem que tot sigui visible igualment (cap text queda "bloquejat")
  setTimeout(() => {
    if (!scrollHasMoved) {
      revealElements.forEach((el) => el.classList.add("is-visible"));
    }
  }, 1500);
});

// crida extra per si algun element ja és visible d'entrada
revealOnScroll();
