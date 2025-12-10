document.addEventListener("DOMContentLoaded", () => {
  // ...el que ja tinguessis abans

  const flipCards = document.querySelectorAll(".faq-card--flip");

  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });
});
