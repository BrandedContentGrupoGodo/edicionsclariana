(() => {
  const routeBlocks = document.querySelectorAll("#salut-supplement [data-routes]");
  if (!routeBlocks.length) return;

  const routesCa = [
    {
      image: "assets/img/ruta-1.jpg",
      alt: "Sender d'alta muntanya amb excursionistes",
      title: "Rutes d'alta muntanya",
      place: "Parc Nacional d'Aigüestortes i Estany de Sant Maurici",
      copy:
        "El camí de l'estany de Sant Maurici, des de l'aparcament del Prat de Pierró, és una proposta assequible per entrar en contacte amb el paisatge d'alta muntanya: dura aproximadament 1 h 15 min d'anada i salva 260 metres de desnivell. Per a qui vulgui anar més enllà, el recorregut circular de l'estany de Sant Maurici al mirador, passant per la cascada i l'estany de Ratera, dura unes 2 h 30 min i té dificultat baixa.",
    },
    {
      image: "assets/img/ruta-2.jpg",
      alt: "Excursionista caminant per un paisatge obert",
      title: "Caminades entre boscos i fagedes",
      place: "Parc Natural del Montseny",
      copy:
        "Santa Fe és punt de partida de diversos itineraris senyalitzats entre boscos, com l'Empedrat de Morou, la volta al pantà de Santa Fe o el camí cap al Turó de l'Home i les Agudes. Són propostes que permeten descobrir alguns dels paisatges forestals més característics del massís i adaptar la sortida al temps i la preparació de cadascú.",
    },
    {
      image: "assets/img/ruta-3.jpg",
      alt: "Mirador en un paisatge volcànic",
      title: "Itineraris volcànics",
      place: "Parc Natural de la Zona Volcànica de la Garrotxa",
      copy:
        "Una de les rutes més representatives és la circular que uneix la Fageda d'en Jordà, el volcà de Santa Margarida i el Croscat: 10,9 quilòmetres, 290 metres de desnivell i unes 3 h 15 min de recorregut, amb dificultat moderada. Per a una passejada més curta, la volta per la Fageda d'en Jordà és circular, té 2,6 quilòmetres i es completa aproximadament en una hora.",
    },
    {
      image: "assets/img/ruta-4.jpg",
      alt: "Persones caminant prop d'una cala",
      title: "Rutes litorals",
      place: "Parc Natural de Cap de Creus",
      copy:
        "El Paratge de Tudela ofereix una ruta circular fàcil de 4 quilòmetres i aproximadament 1 h 30 min entre afloraments rocosos modelats pel vent i el mar. Una altra opció és el camí de Cadaqués al cap de Creus, de 9,2 quilòmetres i dificultat moderada, que permet acostar-se al paisatge mineral i litoral d'aquest extrem del país.",
    },
    {
      image: "assets/img/ruta-5.jpg",
      alt: "Ciclistes passant per una passera",
      title: "Recorreguts entre arrossars i llacunes",
      place: "Parc Natural del Delta de l'Ebre",
      copy:
        "La ruta circular entre la desembocadura, el Garxal i Riumar té 6,9 quilòmetres i pràcticament no presenta desnivell. Es pot fer a peu o en bicicleta i permet recórrer un mosaic de riu, llacunes, dunes, platges i arrossars, amb nombroses oportunitats per observar la fauna del Delta.",
    },
    {
      image: "assets/img/ruta-6.jpg",
      alt: "Visitants en una ruta de muntanya",
      title: "Camins panoràmics",
      place: "Parc Natural del Cadí-Moixeró i Muntanya de Montserrat",
      copy:
        "Al Cadí-Moixeró, l'itinerari adaptat del Cap del Ras recorre poc més d'un quilòmetre entre prats subalpins i boscos de pi negre fins a un mirador sobre la Batllia i bona part del Pirineu central. A Montserrat, l'itinerari fins a Sant Jeroni, des del Pla de les Taràntules, és circular, té 7 quilòmetres i unes 2 h 30 min de durada, i culmina al cim més alt del massís, a 1.236 metres.",
    },
  ];

  const routesEs = [
    {
      image: "assets/img/ruta-1.jpg",
      alt: "Sendero de alta montaña con excursionistas",
      title: "Rutas de alta montaña",
      place: "Parc Nacional d'Aigüestortes i Estany de Sant Maurici",
      copy:
        "El camino del estany de Sant Maurici, desde el aparcamiento del Prat de Pierró, es una propuesta asequible para entrar en contacto con el paisaje de alta montaña: dura aproximadamente 1 h 15 min de ida y salva 260 metros de desnivel. Para quien quiera ir más allá, el recorrido circular del estany de Sant Maurici al mirador, pasando por la cascada y el estany de Ratera, dura unas 2 h 30 min y tiene dificultad baja.",
    },
    {
      image: "assets/img/ruta-2.jpg",
      alt: "Excursionista caminando por un paisaje abierto",
      title: "Caminatas entre bosques y hayedos",
      place: "Parc Natural del Montseny",
      copy:
        "Santa Fe es punto de partida de diversos itinerarios señalizados entre bosques, como l'Empedrat de Morou, la vuelta al pantano de Santa Fe o el camino hacia el Turó de l'Home y les Agudes. Son propuestas que permiten descubrir algunos de los paisajes forestales más característicos del macizo y adaptar la salida al tiempo y la preparación de cada persona.",
    },
    {
      image: "assets/img/ruta-3.jpg",
      alt: "Mirador en un paisaje volcánico",
      title: "Itinerarios volcánicos",
      place: "Parc Natural de la Zona Volcànica de la Garrotxa",
      copy:
        "Una de las rutas más representativas es la circular que une la Fageda d'en Jordà, el volcán de Santa Margarida y el Croscat: 10,9 kilómetros, 290 metros de desnivel y unas 3 h 15 min de recorrido, con dificultad moderada. Para un paseo más corto, la vuelta por la Fageda d'en Jordà es circular, tiene 2,6 kilómetros y se completa aproximadamente en una hora.",
    },
    {
      image: "assets/img/ruta-4.jpg",
      alt: "Personas caminando cerca de una cala",
      title: "Rutas litorales",
      place: "Parc Natural de Cap de Creus",
      copy:
        "El Paratge de Tudela ofrece una ruta circular fácil de 4 kilómetros y aproximadamente 1 h 30 min entre afloramientos rocosos modelados por el viento y el mar. Otra opción es el camino de Cadaqués al cap de Creus, de 9,2 kilómetros y dificultad moderada, que permite acercarse al paisaje mineral y litoral de este extremo del país.",
    },
    {
      image: "assets/img/ruta-5.jpg",
      alt: "Ciclistas pasando por una pasarela",
      title: "Recorridos entre arrozales y lagunas",
      place: "Parc Natural del Delta de l'Ebre",
      copy:
        "La ruta circular entre la desembocadura, el Garxal y Riumar tiene 6,9 kilómetros y prácticamente no presenta desnivel. Se puede hacer a pie o en bicicleta y permite recorrer un mosaico de río, lagunas, dunas, playas y arrozales, con numerosas oportunidades para observar la fauna del Delta.",
    },
    {
      image: "assets/img/ruta-6.jpg",
      alt: "Visitantes en una ruta de montaña",
      title: "Caminos panorámicos",
      place: "Parc Natural del Cadí-Moixeró i Muntanya de Montserrat",
      copy:
        "En el Cadí-Moixeró, el itinerario adaptado del Cap del Ras recorre poco más de un kilómetro entre prados subalpinos y bosques de pino negro hasta un mirador sobre la Batllia y buena parte del Pirineo central. En Montserrat, el itinerario hasta Sant Jeroni, desde el Pla de les Taràntules, es circular, tiene 7 kilómetros y unas 2 h 30 min de duración, y culmina en el pico más alto del macizo, a 1.236 metros.",
    },
  ];

  const routes = document.documentElement.lang.startsWith("es")
    ? routesEs
    : routesCa;

  routeBlocks.forEach((block) => {
    const thumbs = [...block.querySelectorAll(".route-thumb")];
    const card = block.querySelector(".route-card");
    const cardImage = block.querySelector(".route-card__image");
    const cardTitle = block.querySelector(".route-card h3");
    const cardPlace = block.querySelector(".route-card h4");
    const cardCopy = block.querySelector(".route-card p");
    let activeIndex = 0;
    let timer = null;

    const setActive = (index) => {
      const nextIndex = (index + routes.length) % routes.length;
      const route = routes[nextIndex];
      activeIndex = nextIndex;
      thumbs.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("is-active", thumbIndex === nextIndex);
      });
      card.classList.add("is-switching");
      window.setTimeout(() => {
        cardImage.src = route.image;
        cardImage.alt = route.alt;
        cardTitle.textContent = route.title;
        cardPlace.textContent = route.place;
        cardCopy.textContent = route.copy;
        card.classList.remove("is-switching");
      }, 180);
    };

    const restartTimer = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => setActive(activeIndex + 1), 15000);
    };

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        setActive(index);
        restartTimer();
      });
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reducedMotion.matches) {
      restartTimer();
      reducedMotion.addEventListener("change", (event) => {
        if (event.matches) window.clearInterval(timer);
        else restartTimer();
      });
    }
  });

  const photoCarousels = document.querySelectorAll(
    "#salut-supplement [data-photo-carousel]",
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  photoCarousels.forEach((carousel, carouselIndex) => {
    const slides = [...carousel.querySelectorAll("img")];
    if (slides.length < 2) return;

    let activeIndex = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains("is-active")),
    );
    let timer = null;
    let delayTimer = null;

    const showSlide = (nextIndex) => {
      slides[activeIndex].classList.remove("is-active");
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides[activeIndex].classList.add("is-active");
    };

    const start = () => {
      window.clearInterval(timer);
      window.clearTimeout(delayTimer);
      delayTimer = window.setTimeout(() => {
        showSlide(activeIndex + 1);
        timer = window.setInterval(() => showSlide(activeIndex + 1), 3000);
      }, carouselIndex * 1500);
    };

    if (!reducedMotion.matches) start();

    reducedMotion.addEventListener("change", (event) => {
      window.clearInterval(timer);
      window.clearTimeout(delayTimer);
      if (!event.matches) start();
    });
  });
})();
