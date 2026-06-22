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

/* ========================================
STATS COUNTER
======================================== */

const statsSection = document.querySelector('.stats-bcn');
const statNumbers = document.querySelectorAll('.stats-bcn__item strong');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const numberFormatter = new Intl.NumberFormat('ca-ES');

const getNumberValue = (text) => {

    return Number(text.replace(/\D/g, ''));
};

const animateNumber = (element, target) => {

    const duration = 2000;
    const startTime = performance.now();

    const tick = (currentTime) => {

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * easedProgress);

        element.textContent = numberFormatter.format(currentValue);

        if (progress < 1) {

            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
};

if (statsSection && statNumbers.length) {

    statNumbers.forEach(number => {

        number.dataset.target = String(getNumberValue(number.textContent));

        if (!reducedMotion) {

            number.textContent = '0';
        }
    });

    const startCounters = () => {

        statNumbers.forEach(number => {

            const target = Number(number.dataset.target);

            if (reducedMotion) {

                number.textContent = numberFormatter.format(target);

                return;
            }

            animateNumber(number, target);
        });
    };

    const observer = new IntersectionObserver((entries, currentObserver) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            startCounters();

            currentObserver.disconnect();
        });
    }, {
        threshold: 0.35
    });

    observer.observe(statsSection);
}
