$(document).ready(function() {
  // Inicializar los contadores en 0 al cargar la página
  $(".count").each(function() {
    $(this).text("0");
  });

  // Función que maneja la animación
  function animateCount() {
    $(".count").each(function () {
      var $this = $(this);
      
      // Aseguramos que el valor dentro de .count sea un número válido
      var endValue = parseInt($this.data('target'), 10); // Usamos data-target para obtener el valor objetivo
      
      // Si el valor no es un número o es NaN, no realizamos la animación
      if (isNaN(endValue)) return;

      // Verificamos si ya se ejecutó la animación para no repetirla
      if (!$this.hasClass('animated')) {

        var startValue = 0; // Valor inicial del contador
        var duration = 2000; // Duración de la animación en milisegundos
        var startTime = null;

        function animateCounter(timestamp) {
          if (!startTime) startTime = timestamp; // Establecer el tiempo de inicio

          var progress = timestamp - startTime; // Progreso de la animación
          var value = Math.min(startValue + (endValue - startValue) * (progress / duration), endValue); // Calcular el valor actual

          // Actualizar el texto del contador
          $this.text(Math.floor(value)); // Usamos Math.floor para una animación más suave

          if (progress < duration) {
            requestAnimationFrame(animateCounter); // Continuar la animación
          } else {
            $this.text(endValue); // Aseguramos que el contador llegue al valor final
            $this.addClass('animated'); // Marcar como animado al final
          }
        }

        // Iniciar la animación
        requestAnimationFrame(animateCounter);
      }
    });
  }

  // Función que se ejecuta cuando se hace scroll
  $(window).scroll(function() {
    // Verificamos si el scroll ha pasado de los 1500 píxeles
    if ($(window).scrollTop() > 4000) {
      animateCount(); // Ejecutar la animación
    }
  });

  // También ejecutamos la animación cuando la página ya esté cargada (si ya se pasó de 1500px al cargar)
  if ($(window).scrollTop() > 4000) {
    animateCount(); // Ejecutar la animación si ya se pasó de 1500 píxeles al cargar
  }
});






$(document).ready(function() {
  // Inicializar los contadores en 0 al cargar la página
  $(".count2").each(function() {
    $(this).text("0");
  });

  // Función que maneja la animación
  function animateCountx() {
    $(".count2").each(function () {
      var $this = $(this);
      
      // Aseguramos que el valor dentro de .count sea un número válido
      var endValue = parseInt($this.data('target2'), 10); // Usamos data-target para obtener el valor objetivo
      
      // Si el valor no es un número o es NaN, no realizamos la animación
      if (isNaN(endValue)) return;

      // Verificamos si ya se ejecutó la animación para no repetirla
      if (!$this.hasClass('animated2')) {

        var startValue = 0; // Valor inicial del contador
        var duration = 2000; // Duración de la animación en milisegundos
        var startTime = null;

        function animateCounterx(timestamp) {
          if (!startTime) startTime = timestamp; // Establecer el tiempo de inicio

          var progress = timestamp - startTime; // Progreso de la animación
          var value = Math.min(startValue + (endValue - startValue) * (progress / duration), endValue); // Calcular el valor actual

          // Actualizar el texto del contador
          $this.text(Math.floor(value)); // Usamos Math.floor para una animación más suave

          if (progress < duration) {
            requestAnimationFrame(animateCounterx); // Continuar la animación
          } else {
            $this.text(endValue); // Aseguramos que el contador llegue al valor final
            $this.addClass('animated2'); // Marcar como animado al final
          }
        }

        // Iniciar la animación
        requestAnimationFrame(animateCounterx);
      }
    });
  }

  // Función que se ejecuta cuando se hace scroll
  $(window).scroll(function() {
    // Verificamos si el scroll ha pasado de los 1500 píxeles
    if ($(window).scrollTop() > 1000) {
      animateCountx(); // Ejecutar la animación
    }
  });

  // También ejecutamos la animación cuando la página ya esté cargada (si ya se pasó de 1500px al cargar)
  if ($(window).scrollTop() > 1000) {
    animateCountx(); // Ejecutar la animación si ya se pasó de 1500 píxeles al cargar
  }
});

















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