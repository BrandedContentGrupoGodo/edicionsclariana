const animatedElements = document.querySelectorAll(".animate-left, .animate-right");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("active"));
}

const slides = [...document.querySelectorAll(".carousel-slide")];
const dots = [...document.querySelectorAll(".carousel-dots button")];
let activeSlide = 0;
let carouselTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
}

function startCarousel() {
  if (slides.length < 2) return;
  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 4500);
}

if (slides.length && dots.length) {
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      window.clearInterval(carouselTimer);
      showSlide(index);
      startCarousel();
    });
  });

  startCarousel();
}
