document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
  const dots = Array.from(carousel.querySelectorAll(".dot"));
  const prev = carousel.querySelector(".carousel__arrow--prev");
  const next = carousel.querySelector(".carousel__arrow--next");

  if (!track || !slides.length) return;

  let current = 0;

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  if (prev) {
    prev.addEventListener("click", () => goToSlide(current - 1));
  }

  if (next) {
    next.addEventListener("click", () => goToSlide(current + 1));
  }

  window.setInterval(() => goToSlide(current + 1), 9000);
});

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.modalOpen);
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    if (modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal.is-open").forEach(closeModal);
});
