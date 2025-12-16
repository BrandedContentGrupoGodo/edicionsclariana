(function () {
  const openers = document.querySelectorAll('[data-modal-open]');
  const ESC = 'Escape';

  function openModal(key) {
    const modal = document.getElementById(`modal-${key}`);
    if (!modal) return;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Bloquejar scroll del body
    document.documentElement.style.overflow = 'hidden';

    // Focus al botó de tancar
    const closeBtn = modal.querySelector('[data-modal-close]');
    closeBtn && closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  openers.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });

  document.addEventListener('click', (e) => {
    const closeEl = e.target.closest('[data-modal-close]');
    if (!closeEl) return;
    const modal = e.target.closest('.modal');
    if (modal) closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== ESC) return;
    const modal = document.querySelector('.modal.is-open');
    if (modal) closeModal(modal);
  });
})();
