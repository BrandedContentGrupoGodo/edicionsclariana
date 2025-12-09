document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll("[data-animate]");

  // Si no hi ha elements o el navegador no suporta IntersectionObserver → mostrar directament
  if (!("IntersectionObserver" in window) || animatedElements.length === 0) {
    animatedElements.forEach(el => el.classList.add("in-view"));
    return;
  }

  // Configuració de l’observer
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observerInstance.unobserve(entry.target); // només animem un cop
        }
      });
    },
    {
      root: null,         // viewport
      threshold: 0.25,    // quan un 25% és visible (lleugerament més suau)
      rootMargin: "0px 0px -10% 0px" // fa que l’animació comenci una mica abans
    }
  );

  // Observem cada element
  animatedElements.forEach(el => observer.observe(el));
});
