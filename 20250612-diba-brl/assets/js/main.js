$(document).ready(function() {
  










 document.addEventListener("DOMContentLoaded", () => {
            const images = document.querySelectorAll(".image-container img");
            const observer = new IntersectionObserver(entries => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("show");
                        }, index * 800); // Retraso de 0.5s entre cada imagen
                    }
                });
            }, { threshold: 0.5 });
            
            images.forEach(img => observer.observe(img));
        });



const observer = new IntersectionObserver(entries => {
  // Loop over the entries
  entries.forEach(entry => {
    // If the element is visible
    if (entry.isIntersecting) {
      // Add the animation class
      entry.target.classList.add('square-animation');
    }
  });
});

observer.observe(document.querySelector('.verdes2'));