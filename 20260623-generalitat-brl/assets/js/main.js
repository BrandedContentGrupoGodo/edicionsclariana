const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach((card) => {
  card.addEventListener('pointerenter', () => {
    flipCards.forEach((otherCard) => {
      if (otherCard !== card) otherCard.classList.remove('is-flipped');
    });

    card.classList.add('is-flipped');
  });

  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-flipped');
  });

  card.addEventListener('focus', () => {
    flipCards.forEach((otherCard) => {
      if (otherCard !== card) otherCard.classList.remove('is-flipped');
    });

    card.classList.add('is-flipped');
  });

  card.addEventListener('blur', () => {
    card.classList.remove('is-flipped');
  });
});

const accordionItems = document.querySelectorAll('.accordion__item');

accordionItems.forEach((item) => {
  const trigger = item.querySelector('.accordion__trigger');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});
