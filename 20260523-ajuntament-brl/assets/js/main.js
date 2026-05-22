/* ========================================
MODALS
======================================== */

const modalTriggers = document.querySelectorAll('[data-modal-open]');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

/* OPEN */

modalTriggers.forEach(trigger => {

    trigger.addEventListener('click', () => {

        const modalId = trigger.dataset.modalOpen;

        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.add('is-active');

        document.body.style.overflow = 'hidden';
    });
});

/* CLOSE */

modalCloseButtons.forEach(button => {

    button.addEventListener('click', () => {

        const modal = button.closest('.modal-bcn');

        if (!modal) return;

        modal.classList.remove('is-active');

        document.body.style.overflow = '';
    });
});

/* ESC */

document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape') {

        document.querySelectorAll('.modal-bcn').forEach(modal => {

            modal.classList.remove('is-active');
        });

        document.body.style.overflow = '';
    }
});

/* ========================================
FLIP CARDS
======================================== */

const flipCards = document.querySelectorAll('.flip-card-bcn');

flipCards.forEach(card => {

    card.addEventListener('click', () => {

        card.classList.toggle('is-flipped');
    });
});