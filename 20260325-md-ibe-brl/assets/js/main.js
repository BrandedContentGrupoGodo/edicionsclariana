// =========================
// ANIMACIONS SCROLL
// =========================
const animatedElements = document.querySelectorAll('.animate-left, .animate-right');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

animatedElements.forEach(el => observer.observe(el));


// =========================
// COUNTDOWN GLOBAL
// =========================
const targetDate = new Date("2026-07-04T18:00:00+01:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // HERO
  if (document.getElementById("days")) {
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
  }

  // CTA DÍAS (digits separats)
  const digits = String(days).padStart(3, "0").split("");
  if (document.getElementById("d1")) {
    document.getElementById("d1").textContent = digits[0];
    document.getElementById("d2").textContent = digits[1];
    document.getElementById("d3").textContent = digits[2];
  }

  // CTA TEMPS
  if (document.getElementById("cta-hours")) {
    document.getElementById("cta-hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("cta-minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("cta-seconds").textContent = seconds.toString().padStart(2, "0");
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();