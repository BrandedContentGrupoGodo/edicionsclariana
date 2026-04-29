// Fondo de estrellas
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let width, height, stars = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createStars() {
  stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'white';
  ctx.shadowBlur = 6;
  ctx.shadowColor = 'white';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
    ctx.fill();
    star.x += star.dx;
    star.y += star.dy;

    if (star.x < 0 || star.x > width) star.dx *= -1;
    if (star.y < 0 || star.y > height) star.dy *= -1;
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars();
});

resizeCanvas();
createStars();
drawStars();

// Historias
const historias = [
  {
    nombre: "Elena Congost",
    frase: "Los valores están por encima de cualquier podio",
    imagen: "https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/cap1.png",
    enlace: "https://www.mundodeportivo.com/atletismo/20250908/1002525462/elena-congost-atleta-perdio-medalla-guia-constelaciones-streaming-brl.html"
  },
  {
    nombre: "Sergio Garrote",
    frase: "Los rivales representan lo mejor de mí",
    imagen: "https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/cap2.png",
    enlace: "https://www.mundodeportivo.com/ciclismo/20250922/1002534889/sergio-garrote-hand-bike-espanol-campeon-paralimpico-juega-vida-entrenamiento-leyenda-deporte-constelaciones-streaming-brl.html"
  },
  {
    nombre: "Toni Ponce",
    frase: "La medalla de oro son mis hijos",
    imagen: "https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/cap3.png",
    enlace: "https://www.mundodeportivo.com/natacion/20251006/1002542064/toni-ponce-campeon-nada-hijos-promesa-madre-natacion-paralimpico-constelaciones-streaming-brl.html"
  },
  {
    nombre: "Marta Arce",
    frase: "Cuando subo al pódium, lo hago representando a todas las personas que me han acompañado",
    imagen: "https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/cap4.png",
    enlace: "https://www.mundodeportivo.com/juegos-olimpicos/20251020/1002550228/marta-arce-judoka-espanola-volvio-tatami-47-anos-gano-medalla-juegos-judo-paralimpico-constelaciones-streaming-brl.html"
  },
  {
    nombre: "Álvaro del Amo",
    frase: "El peso de la bola es un símbolo, la prueba tangible de que en esta vida nada es fácil",
    imagen: "https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/cap5.png",
    enlace: "https://www.mundodeportivo.com/juegos-olimpicos/20251103/1002559708/alvaro-amo-consejo-cambio-carrera-medallista-espanol-disco-peso-paralimpico-constelaciones-streaming-brl.html"
  },
  {
    nombre: "Ander Cepas",
    frase: "Soy un chaval normal, con mis aciertos y defectos, que siempre intenta estar de buen humor",
    imagen: "https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/cap6.png",
    enlace: "https://www.mundodeportivo.com/juegos-olimpicos/20251117/1002568983/ander-cepas-tenis-mesa-campeon-olvido-era-numero-uno-mundo-constelaciones-streaming-brl.html"
  },
  {
     // ACTUALIZAR EL CAPÍTULO 7
    nombre: "Joel Martín",
    frase: "Del 'no llegarás a nada' a soñar con el oro en Los Ángeles 2028",
    imagen: "https://brandedcontentgrupogodo.github.io/edicionsclariana/20260429-lacaixa-hub-brl/assets/img/cap7.png",
    enlace: "https://www.mundodeportivo.com/juegos-olimpicos/20260429/1004176410/joel-martin-taekwondo-juegos-angeles-2028-constelaciones-streaming-brl.html"
  },
  { locked: true },
  { locked: true },
  { locked: true },
  { locked: true },
  { locked: true }
];

const container = document.getElementById('constelacion');

historias.forEach((historia, i) => {
  const card = document.createElement('div');
  card.className = 'card';

  if (!historia.locked) {
    const { nombre, frase, imagen, enlace } = historia;
    // Historias desbloqueadas
    card.innerHTML = `
      <img src="${imagen}" alt="Retrato de ${nombre}, atleta paralímpico">
      <div class="card-content">
        <h2>${nombre}</h2>
        <p><em>“${frase}”</em></p>
        ${enlace ? `<a href="${enlace}" target="_blank" rel="noopener" class="btn">Ver historia →</a>` : ""}
      </div>
    `;
  } else {
    // Historias bloqueadas
    card.classList.add("locked");
    card.innerHTML = `
      <img src="https://brandedcontentgrupogodo.github.io/ext/caixabank-2025/01_09-07-25/assets/img/locked.png" alt="Historia bloqueada">
      <div class="card-content">
        <p class="soon-text">Próximamente</p>
      </div>
    `;
  }

  container.appendChild(card);

  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 90%'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    delay: i * 0.05
  });
});
