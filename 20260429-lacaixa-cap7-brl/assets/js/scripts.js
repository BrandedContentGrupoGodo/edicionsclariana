// Scroll suave
    const heroCta = document.querySelector(".hero__cta");
    if (heroCta) {
      heroCta.addEventListener("click", (e) => {
        e.preventDefault();
        const videoSection = document.querySelector("#video-section");
        if (videoSection) {
          videoSection.scrollIntoView({
            behavior: "smooth"
          });
        }
      });
    }

    // GSAP Animaciones
    if (window.gsap) {
      gsap.fromTo(".hero__image img", 
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );

      gsap.to(".hero__title", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out"
      });

      gsap.fromTo(".hero__cta", 
        {scale: 0.9, opacity: 0},
        {scale: 1, opacity: 1, duration: 0.8, delay: 1, ease: "elastic.out(1,0.5)"}
      );
    } else {
      // Fallback si GSAP no se carga
      document.querySelectorAll('.hero__image img').forEach(img => img.style.opacity = '1');
      const title = document.querySelector('.hero__title');
      if (title) title.style.opacity = '1';
      const cta = document.querySelector('.hero__cta');
      if (cta) cta.style.opacity = '1';
    }

    // Registrar ScrollTrigger si está disponible
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // ScrollTrigger para el reportaje ancla
    if (document.querySelector("#reportaje")) {
      gsap.to("#reportaje", {
        scrollTrigger: {
          trigger: "#reportaje",
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      });
    }

// Asegurar que las secciones .reportaje sean visibles (sin animación para evitar parpadeo)
    document.querySelectorAll(".reportaje").forEach(section => {
      section.style.opacity = "1";
    });

    // Observar inyecciones del CMS para asegurar visibilidad
    if (window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node;
              if (element.classList && element.classList.contains('reportaje')) {
                element.style.opacity = "1";
              }
              const nested = element.querySelectorAll ? element.querySelectorAll('.reportaje') : [];
              nested.forEach(sec => sec.style.opacity = "1");
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }


// Lightbox funcional
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  });
});

lightboxClose.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  }
});

