(() => {
      const mount = document.getElementById("lv-eclipse-seguridad-2026-v2");
      if (!mount) return;
      if (mount.dataset.lvEclipseInitV2 === "1") return;
      mount.dataset.lvEclipseInitV2 = "1";

      const root = mount.attachShadow ? mount.attachShadow({ mode: "open" }) : mount;
      const safetyCssHref = "https://brandedcontentgrupogodo.github.io/edicionsclariana/20260707-generalitat-brl/assets/css/safety-widget.css?v=20260706b";

      try {
        // ===== Ajustes =====
        const PRO_DIM_MAX = 0.60;
        const PRO_DIM_EXP = 1.18;
        const PRO_NOISE_MAX = 0.10;
        const PRO_NOISE_SCALE = 25;

        const BAD_GLASS_OPACITY = 0.40;
        const BAD_GLASS_CONTRAST = 1.65;

        // Ruido: "static" (sin movimiento) | "wander" (aleatorio suave)
        const NOISE_MOTION = "static";

        const CLOUD_SPRITE_PRESETS = {
          1: {
            lumps: [
              { x: 156, y: 262, rx: 106, ry: 58, a: 0.78 },
              { x: 312, y: 226, rx: 158, ry: 78, a: 0.92 },
              { x: 498, y: 240, rx: 186, ry: 92, a: 1.0 },
              { x: 684, y: 230, rx: 142, ry: 72, a: 0.9 },
              { x: 816, y: 252, rx: 98, ry: 54, a: 0.74 },
            ],
            wisps: [
              { x: 304, y: 314, rx: 232, ry: 46, a: 0.34 },
              { x: 648, y: 304, rx: 194, ry: 42, a: 0.28 },
            ],
          },
          2: {
            lumps: [
              { x: 150, y: 232, rx: 92, ry: 48, a: 0.76 },
              { x: 286, y: 250, rx: 150, ry: 74, a: 0.9 },
              { x: 472, y: 222, rx: 178, ry: 88, a: 1.0 },
              { x: 652, y: 246, rx: 154, ry: 76, a: 0.88 },
              { x: 824, y: 226, rx: 112, ry: 56, a: 0.7 },
            ],
            wisps: [
              { x: 232, y: 304, rx: 186, ry: 40, a: 0.3 },
              { x: 560, y: 318, rx: 246, ry: 48, a: 0.34 },
              { x: 826, y: 300, rx: 134, ry: 30, a: 0.2 },
            ],
          },
          3: {
            lumps: [
              { x: 176, y: 242, rx: 96, ry: 50, a: 0.74 },
              { x: 330, y: 222, rx: 148, ry: 72, a: 0.92 },
              { x: 516, y: 246, rx: 166, ry: 82, a: 1.0 },
              { x: 692, y: 224, rx: 136, ry: 68, a: 0.86 },
              { x: 838, y: 248, rx: 92, ry: 46, a: 0.68 },
            ],
            wisps: [
              { x: 256, y: 314, rx: 206, ry: 38, a: 0.26 },
              { x: 592, y: 300, rx: 228, ry: 44, a: 0.32 },
            ],
          },
        };

        function paintCloudEllipse(g, x, y, rx, ry, fill, blur) {
          g.save();
          g.filter = `blur(${blur}px)`;
          g.fillStyle = fill;
          g.beginPath();
          g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }

        function makeCloudSpriteDataURL(variant) {
          const preset = CLOUD_SPRITE_PRESETS[variant] || CLOUD_SPRITE_PRESETS[1];
          const c = document.createElement("canvas");
          c.width = 960;
          c.height = 480;
          const g = c.getContext("2d", { alpha: true });

          preset.wisps.forEach((w) => {
            paintCloudEllipse(g, w.x, w.y + 20, w.rx, w.ry, `rgba(28,38,52,${0.08 * w.a})`, 34);
          });

          preset.lumps.forEach((l) => {
            paintCloudEllipse(g, l.x, l.y + 18, l.rx, l.ry, `rgba(26,34,48,${0.12 * l.a})`, 34);
          });

          preset.lumps.forEach((l) => {
            paintCloudEllipse(g, l.x, l.y, l.rx, l.ry, `rgba(150,164,178,${0.19 * l.a})`, 24);
          });

          preset.lumps.forEach((l) => {
            paintCloudEllipse(g, l.x - l.rx * 0.12, l.y - l.ry * 0.18, l.rx * 0.72, l.ry * 0.60, `rgba(226,234,239,${0.20 * l.a})`, 18);
          });

          preset.wisps.forEach((w) => {
            paintCloudEllipse(g, w.x, w.y, w.rx, w.ry, `rgba(176,188,198,${0.10 * w.a})`, 24);
          });

          return c.toDataURL("image/png");
        }

        const CLOUD_SPRITES = {
          "cloud-1.webp": makeCloudSpriteDataURL(1),
          "cloud-2.webp": makeCloudSpriteDataURL(2),
          "cloud-3.webp": makeCloudSpriteDataURL(3),
        };

        const cloudAsset = (name) => CLOUD_SPRITES[name] || "";

        const CLOUD_LAYERS = [
          {
            src: cloudAsset("cloud-1.webp"),
            speed: 0.0055,
            opacity: 0.56,
            bob: 0.004,
            blur: 0.3,
            instances: [
              { x: -0.34, y: 0.22, w: 0.54, alpha: 0.96, phase: 0.3 },
              { x: 0.78, y: 0.17, w: 0.46, alpha: 0.88, phase: 1.7 },
            ],
          },
          {
            src: cloudAsset("cloud-2.webp"),
            speed: 0.0085,
            opacity: 0.43,
            bob: 0.005,
            blur: 0.2,
            instances: [
              { x: -0.08, y: 0.50, w: 0.36, alpha: 0.82, phase: 1.1 },
              { x: 0.92, y: 0.58, w: 0.34, alpha: 0.76, phase: 2.3 },
              { x: 0.18, y: 0.86, w: 0.58, alpha: 0.66, phase: 0.4 },
              { x: 1.12, y: 0.92, w: 0.52, alpha: 0.60, phase: 2.6 },
            ],
          },
          {
            src: cloudAsset("cloud-3.webp"),
            speed: 0.0115,
            opacity: 0.36,
            bob: 0.0035,
            blur: 0.1,
            instances: [
              { x: 0.24, y: 0.70, w: 0.30, alpha: 0.74, phase: 1.8 },
              { x: 1.20, y: 0.34, w: 0.28, alpha: 0.68, phase: 2.7 },
              { x: -0.12, y: 0.95, w: 0.50, alpha: 0.52, phase: 1.2 },
              { x: 0.66, y: 0.90, w: 0.48, alpha: 0.50, phase: 3.1 },
            ],
          },
        ];

        const URLS = {
          mini: {
            "camara-sin-filtro":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/camara-fotos-mini.svg",
            "cristal-ahumado":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/cristal-ahumado-mini.svg",
            "cd-dvd":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/disco-cd-dvd-mini.svg",
            "filtro-profesional":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/filtro-profesional-mini.svg",
            "soldador-14":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/filtro-soldador-mini.svg",
            "gafas-eclipse":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/gafas-eclipse-homologadas-mini.svg",
            "gafas-sol":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/gafas-sol-mini.svg",
            movil:
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/movil-mini.svg",
            radiografia:
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/radiografia-mini.svg",
            "visor-homologado":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/visor-eclipse-homologado-mini.svg",
          },
          big: {
            "gafas-sol":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/gafas-sol-big.svg",
            "gafas-eclipse":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/gafas-eclipse-homologadas-big.svg",
            "cristal-ahumado":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/cristal-ahumado-big.svg",
            "filtro-profesional":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/filtro-profesional-big.svg",
            "soldador-14":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/filtro-soldador-big.svg",
            "visor-homologado":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/visor-eclipse-homologado-big.svg",
            "camara-sin-filtro":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/camara-fotos-big.svg",
            "cd-dvd":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/disco-cd-dvd-big.svg",
            movil:
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/movil-big.svg",
            radiografia:
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/radiografia-big.svg",
          },
          bigGlassMask: {
            "gafas-sol":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/gafas-sol-big-glassmask.svg",
            "gafas-eclipse":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/gafas-eclipse-homologadas-big-glassmask.svg",
            "cristal-ahumado":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/cristal-ahumado-big-glassmask.svg",
            "filtro-profesional":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/filtro-profesional-big-glassmask.svg",
            "soldador-14":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/filtro-soldador-big-glassmask.svg",
            "visor-homologado":
              "https://grupogodo.github.io/lavanguardia-narrativas-visuales-2026-02/20260224-eclipse-solar-total-2026-simulador-seguridad-visualizacion/visor-eclipse-homologado-big-glassmask.svg",
          },
        };

        Object.values(URLS.big).forEach((u) => {
          const img = new Image();
          img.decoding = "async";
          img.src = u;
          if (typeof img.decode === "function") img.decode().catch(() => {});
        });

        const CLOUD_IMAGES = new Map();
        CLOUD_LAYERS.forEach((layer) => {
          if (CLOUD_IMAGES.has(layer.src)) return;
          const img = new Image();
          img.decoding = "async";
          img.src = layer.src;
          if (typeof img.decode === "function") img.decode().catch(() => {});
          CLOUD_IMAGES.set(layer.src, img);
        });

        const COLORS = {
          bg: "#2a2a2a",
          strokeOuter: "#666666",
          yellow: "#ffed89",
          greyText: "#c8c5c5",
          blueText: "#6a8099",
          red: "#ed5656",
          amber: "#fbb03b",
          green: "#8cc63f",
          cardBg: "#2a2a2a",
        };

        const ITEMS = [
          {
            id: "gafas-sol",
            name: "Gafas de Sol",
            cardLabel: "Gafas\nde Sol",
            level: "no",
            pill: "¡No son seguras!",
            whyTitle: "¡No son seguras!",
            why:
              "No filtran lo suficiente, menos aún los rayos ultravioletas y los infrarrojos; la radiación solar sigue dañando la retina",
            miniSvg: URLS.mini["gafas-sol"],
            bigSvg: URLS.big["gafas-sol"],
            bigScale: 0.92,
            desktopBigScale: 1.06,
          },
          {
            id: "camara-sin-filtro",
            name: "Cámara sin filtro",
            cardLabel: "Cámara\nsin filtro",
            level: "no",
            pill: "¡No es segura!",
            whyTitle: "¡No es segura!",
            why:
              "Mirar a través del visor o del objetivo puede concentrar la luz. Hay riesgo para tus ojos y para el sensor si no hay filtro solar",
            miniSvg: URLS.mini["camara-sin-filtro"],
            bigSvg: URLS.big["camara-sin-filtro"],
            bigScale: 0.92,
          },
          {
            id: "movil",
            name: "Teléfono móvil",
            cardLabel: "Teléfono\nmóvil",
            level: "no",
            pill: "¡No es seguro!",
            whyTitle: "¡No es seguro!",
            why: "No es un filtro solar y no protege si miras el Sol directamente",
            miniSvg: URLS.mini["movil"],
            bigSvg: URLS.big["movil"],
            bigScale: 0.92,
            desktopBigScale: 1.04,
          },
          {
            id: "gafas-eclipse",
            name: "Gafas de eclipse homologadas",
            cardLabel: "Gafas\nde eclipse\nhomologadas",
            level: "si",
            pill: "Sí son seguras",
            whyTitle: "¡Sí son seguras!",
            why:
              "Si están en buen estado, sin rayas, agujeros ni dobleces, y cumplen la norma DIN EN ISO 12312-2:2015, son adecuadas para visión directa",
            miniSvg: URLS.mini["gafas-eclipse"],
            bigSvg: URLS.big["gafas-eclipse"],
            bigScale: 0.92,
            desktopBigScale: 1.14,
          },
          {
            id: "visor-homologado",
            name: "Visor solar homologado",
            cardLabel: "Visor\nsolar\nhomologado",
            level: "si",
            pill: "Sí es seguro",
            whyTitle: "¡Sí es seguro!",
            why:
              "Es un visor certificado para observación solar directa y cumple los requisitos de la norma DIN EN ISO 12312-2:2015",
            miniSvg: URLS.mini["visor-homologado"],
            bigSvg: URLS.big["visor-homologado"],
            bigScale: 0.92,
            desktopBigScale: 1.08,
          },
          {
            id: "filtro-profesional",
            name: "Filtro solar profesional",
            cardLabel: "Filtro\nsolar\nprofesional",
            level: "si",
            pill: "Sí es seguro",
            whyTitle: "¡Sí es seguro!",
            why:
              "Está diseñado para bloquear la radiación en el rango adecuado: luz visible, ultravioleta e infrarrojo",
            miniSvg: URLS.mini["filtro-profesional"],
            bigSvg: URLS.big["filtro-profesional"],
            bigScale: 0.78,
          },
          {
            id: "soldador-14",
            name: "Filtro de soldador",
            cardLabel: "Filtro de\nsoldador",
            level: "no",
            pill: "¡No es seguro!",
            whyTitle: "¡No es seguro!",
            why:
              "No es un método homologado para observación solar directa. No garantiza el filtrado de radiación como un filtro solar certificado",
            miniSvg: URLS.mini["soldador-14"],
            bigSvg: URLS.big["soldador-14"],
            bigScale: 0.74,
          },
          {
            id: "radiografia",
            name: "Radiografía",
            cardLabel: "Radiografía",
            level: "no",
            pill: "¡No es segura!",
            whyTitle: "¡No es segura!",
            why: "No garantiza bloquear la radiación peligrosa",
            miniSvg: URLS.mini.radiografia,
            bigSvg: URLS.big.radiografia,
            bigScale: 0.78,
          },
          {
            id: "cd-dvd",
            name: "CD/DVD",
            cardLabel: "CD/DVD",
            level: "no",
            pill: "¡No es seguro!",
            whyTitle: "¡No es seguro!",
            why: "No filtra la luz solar de forma fiable",
            miniSvg: URLS.mini["cd-dvd"],
            bigSvg: URLS.big["cd-dvd"],
            bigScale: 0.78,
          },
          {
            id: "cristal-ahumado",
            name: "Cristal ahumado",
            cardLabel: "Cristal\nahumado",
            level: "no",
            pill: "¡No es seguro!",
            whyTitle: "¡No es seguro!",
            why: "Oscurece la vista, pero no protege adecuadamente frente a la radiación ultravioleta e infrarroja",
            miniSvg: URLS.mini["cristal-ahumado"],
            bigSvg: URLS.big["cristal-ahumado"],
            bigScale: 0.78,
          },
        ];

        const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
        const order = [
          "gafas-sol",
          "camara-sin-filtro",
          "movil",
          "gafas-eclipse",
          "visor-homologado",
          "filtro-profesional",
          "soldador-14",
          "radiografia",
          "cd-dvd",
          "cristal-ahumado",
        ];

        const pillClass = (lvl) => (lvl === "si" ? "green" : lvl === "cuidado" ? "amber" : "red");
        const pillHudClass = (lvl) => (lvl === "si" ? "hud-green" : lvl === "cuidado" ? "hud-amber" : "hud-red");
        const levelColor = (lvl) => (lvl === "si" ? COLORS.green : lvl === "cuidado" ? COLORS.amber : COLORS.red);
        const borderColor = levelColor;

        const GLASS_IDS = new Set(Object.keys(URLS.bigGlassMask));
        const PRO_IDS = new Set(["gafas-eclipse", "visor-homologado", "filtro-profesional"]);
        const BAD_IDS = new Set(["gafas-sol", "cristal-ahumado", "soldador-14"]);

        const MASK_BLOBS = new Map();
        const MASK_AR = new Map();

        function extractAspectRatioFromSvgText(txt) {
          const vb = txt.match(/viewBox\s*=\s*["']([^"']+)["']/i);
          if (vb) {
            const parts = vb[1].trim().split(/[\s,]+/).map(Number);
            if (parts.length === 4 && isFinite(parts[2]) && isFinite(parts[3]) && parts[2] > 0 && parts[3] > 0) {
              return parts[2] / parts[3];
            }
          }
          const w = txt.match(/width\s*=\s*["']([\d.]+)(px)?["']/i);
          const h = txt.match(/height\s*=\s*["']([\d.]+)(px)?["']/i);
          if (w && h) {
            const ww = parseFloat(w[1]);
            const hh = parseFloat(h[1]);
            if (isFinite(ww) && isFinite(hh) && ww > 0 && hh > 0) return ww / hh;
          }
          return null;
        }

        async function svgToBlobURL(url) {
          const res = await fetch(url, { mode: "cors", cache: "force-cache" });
          if (!res.ok) throw new Error("fetch failed");
          const txt = await res.text();
          const ar = extractAspectRatioFromSvgText(txt);
          const blob = new Blob([txt], { type: "image/svg+xml" });
          return { blobUrl: URL.createObjectURL(blob), ar };
        }

        async function prefetchMaskBlobs() {
          const jobs = [];
          for (const id of GLASS_IDS) {
            const u = URLS.bigGlassMask[id];
            if (!u) continue;
            jobs.push(
              svgToBlobURL(u)
                .then(({ blobUrl, ar }) => {
                  MASK_BLOBS.set(id, blobUrl);
                  if (ar && isFinite(ar) && ar > 0.2 && ar < 5) MASK_AR.set(id, ar);
                })
                .catch(() => {})
            );
          }
          await Promise.all(jobs);
        }

        const masksPrefetchPromise = prefetchMaskBlobs();

        const IMG_DECODED = new Map();
        function ensureDecoded(url) {
          if (!url) return Promise.reject(new Error("no url"));
          if (IMG_DECODED.has(url)) return IMG_DECODED.get(url);

          const p = new Promise((resolve, reject) => {
            let done = false;
            const ok = () => {
              if (done) return;
              done = true;
              resolve(true);
            };
            const bad = () => {
              if (done) return;
              done = true;
              reject(new Error("decode failed"));
            };

            const img = new Image();
            img.decoding = "async";
            img.onload = ok;
            img.onerror = bad;
            img.src = url;

            if (typeof img.decode === "function") {
              img.decode().then(ok).catch(() => {});
            }
          });

          IMG_DECODED.set(url, p);
          return p;
        }

        CLOUD_LAYERS.forEach((layer) => {
          ensureDecoded(layer.src).catch(() => {});
        });

        root.innerHTML = `
          <link rel="stylesheet" href="${safetyCssHref}">
<div class="w" role="group" aria-label="Simulador de seguridad para observar el eclipse (visión directa)">
            <div class="top">
              <div class="view" id="view">
                <canvas></canvas>

                <div id="fxProBase" class="fxProBase" aria-hidden="true"></div>
                <div id="fxProBurn" class="fxProBurn" aria-hidden="true"></div>
                <div id="fxProDither" class="fxProDither" aria-hidden="true"></div>
                <div id="fxBadGlass" class="fxBadGlass" aria-hidden="true"></div>

                <div id="bigWrap" class="bigWrap" aria-hidden="true">
                  <img id="bigObj" class="bigObj" alt="" decoding="async" />
                  <button id="bigDismiss" class="bigDismiss" type="button" aria-label="Quitar objeto del visualizador"></button>
                </div>
                <div class="viewMode" aria-hidden="true">Visión directa simulada</div>
                <div class="viewPrompt" aria-hidden="true">
                  <div class="viewPromptCard">
                    <p class="viewPromptTitle" id="viewPromptTitle">Arrastra aquí un objeto</p>
                    <p class="viewPromptBody" id="viewPromptBody">para saber si su uso es seguro</p>
                  </div>
                </div>
                <div class="desktopVerdict" id="desktopVerdict" aria-live="polite">
                  <div class="desktopVerdictInner">
                    <div class="desktopVerdictHead">
                      <div class="desktopVerdictTitle red" id="desktopVerdictTitle"></div>
                      <div class="desktopVerdictItem" id="desktopVerdictItem"></div>
                    </div>
                    <div class="desktopVerdictBody" id="desktopVerdictBody"></div>
                  </div>
                </div>

                <div class="hudTitle" id="hudTitle">—</div>
                <div class="hudPill hud-red" id="hudPill">—</div>

                <div class="bottomHint">
                  <div id="hintCopy">Arrastra un objeto sobre el cielo para ver el eclipse a través de él y saber si es seguro para observarlo</div>
                  <div class="right">Visión directa simulada</div>
                </div>
              </div>

              <aside class="panel" id="panel" aria-live="polite">
                <h3 class="panelTitle">¿Con qué es seguro observar el eclipse de Sol?</h3>
                <p class="panelIntro" id="panelIntroCopy">
                  Prueba arrastrando un objeto al visualizador de la izquierda para comprobar si permite observar el eclipse con seguridad
                </p>

                <div class="verdictSlot">
                  <div class="panelVerdictTitle red" id="verdictTitle"></div>
                  <div class="panelVerdictBody red" id="verdictBody"></div>
                </div>

              </aside>
            </div>

            <div class="trayWrap" id="trayWrap">
              <button class="trayToggle" id="trayToggle" type="button" aria-expanded="false" aria-controls="trayPanel">
                <span class="trayToggleText">
                  <span class="trayToggleLabel" id="trayToggleLabel">Objetos para probar</span>
                  <span class="trayToggleHint" id="trayToggleHint">Toca para desplegar la bandeja</span>
                </span>
                <span class="trayToggleIcon" aria-hidden="true"></span>
              </button>
              <div class="trayPanel" id="trayPanel">
                <div class="trayGrid" id="tray"></div>
              </div>
              <div class="trayScrollUI" id="trayScrollUI" aria-hidden="true">
                <button class="trayScrollBtn prev" id="trayScrollPrev" type="button" tabindex="-1" aria-label="Desplazar bandeja hacia la izquierda"></button>
                <div class="trayScrollTrack" id="trayScrollTrack">
                  <div class="trayScrollThumb" id="trayScrollThumb"></div>
                </div>
                <button class="trayScrollBtn next" id="trayScrollNext" type="button" tabindex="-1" aria-label="Desplazar bandeja hacia la derecha"></button>
              </div>
              <div class="legend" aria-label="Leyenda">
                <div class="legItem"><span class="dot red"></span><span>Totalmente desaconsejados (grave riesgo de daño ocular)</span></div>
                <div class="legItem"><span class="dot green"></span><span>Aconsejados, aunque sólo durante menos de un minuto de uso</span></div>
              </div>
            </div>
          </div>
        `;

        const $ = (sel, el = root) => el.querySelector(sel);
        const view = $("#view");
        const canvas = root.querySelector("canvas");
        const tray = $("#tray");
        const panel = $("#panel");

        const fxProBase = $("#fxProBase");
        const fxProBurn = $("#fxProBurn");
        const fxProDither = $("#fxProDither");
        const fxBadGlass = $("#fxBadGlass");

        const bigWrap = $("#bigWrap");
        const bigObj = $("#bigObj");
        const bigDismiss = $("#bigDismiss");
        const desktopVerdict = $("#desktopVerdict");
        const desktopVerdictTitle = $("#desktopVerdictTitle");
        const desktopVerdictItem = $("#desktopVerdictItem");
        const desktopVerdictBody = $("#desktopVerdictBody");

        const hudTitle = $("#hudTitle");
        const hudPill = $("#hudPill");
        const verdictTitle = $("#verdictTitle");
        const verdictBody = $("#verdictBody");

        const hintCopy = $("#hintCopy");
        const panelIntroCopy = $("#panelIntroCopy");
        const viewPromptTitle = $("#viewPromptTitle");
        const viewPromptBody = $("#viewPromptBody");
        const trayWrap = $("#trayWrap");
        const trayToggle = $("#trayToggle");
        const trayToggleLabel = $("#trayToggleLabel");
        const trayToggleHint = $("#trayToggleHint");
        const trayPanel = $("#trayPanel");
        const trayScrollUI = $("#trayScrollUI");
        const trayScrollTrack = $("#trayScrollTrack");
        const trayScrollThumb = $("#trayScrollThumb");
        const trayScrollPrev = $("#trayScrollPrev");
        const trayScrollNext = $("#trayScrollNext");

        const ctx = canvas.getContext("2d", { alpha: false });
        const prefersReduced =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mqCompact = window.matchMedia ? window.matchMedia("(max-width:700px)") : { matches: false };
        const mqMobile = window.matchMedia ? window.matchMedia("(max-width:560px)") : { matches: false };
        const mqCoarse = window.matchMedia ? window.matchMedia("(pointer: coarse)") : { matches: false };
        const mqTabletUp = window.matchMedia ? window.matchMedia("(min-width:701px)") : { matches: true };
        const mqDesktop = window.matchMedia ? window.matchMedia("(min-width:1101px)") : { matches: true };
        const PROMPT_RETURN_DELAY = 220;
        const MOBILE_SWAP_DELAY = 205;

        const DESKTOP_HINT_TITLE =
          "Arrastra este objeto al cielo para comprobar si permite observar el eclipse con seguridad";
        const MOBILE_HINT_TITLE =
          "Toca este objeto para llevarlo al cielo y comprobar si permite observar el eclipse con seguridad";

        let mobileActive = null;
        let mobileDragging = null;
        let mobileTrayOpen = false;
        let mobileSwapTimer = 0;
        let mobileSwapToken = 0;
        let promptHoldTimer = 0;

        function clearPromptHold() {
          if (promptHoldTimer) {
            clearTimeout(promptHoldTimer);
            promptHoldTimer = 0;
          }
          view.classList.remove("is-prompt-hold");
        }

        function holdPromptReturn() {
          if (!mqTabletUp.matches) return;
          if (promptHoldTimer) clearTimeout(promptHoldTimer);
          view.classList.add("is-prompt-hold");
          promptHoldTimer = setTimeout(() => {
            promptHoldTimer = 0;
            if (!view.classList.contains("is-over")) {
              view.classList.remove("is-prompt-hold");
            }
          }, PROMPT_RETURN_DELAY);
        }

        const GHOST_DOM_ID = "lv-eclipse-seguridad-2026-v2-ghost";
        const prevGhost = document.getElementById(GHOST_DOM_ID);
        if (prevGhost) prevGhost.remove();

        const ghost = document.createElement("div");
        ghost.id = GHOST_DOM_ID;
        ghost.setAttribute("aria-hidden", "true");
        ghost.style.cssText = `
          position: fixed;
          left: 0;
          top: 0;
          transform: translate3d(-50%, -50%, 0);
          width: 64px;
          height: 64px;
          pointer-events: none;
          z-index: 2147483647;
          opacity: 0;
          transition: opacity .12s ease;
          filter: drop-shadow(0 12px 18px rgba(0,0,0,.30));
          will-change: left, top, opacity, transform;
        `;

        const ghostImg = document.createElement("img");
        ghostImg.alt = "";
        ghostImg.style.cssText = `
          width: 100%;
          height: 100%;
          display: block;
        `;

        ghost.appendChild(ghostImg);
        document.body.appendChild(ghost);

        function syncGhostSize() {
          const s = mqCompact.matches ? 58 : 64;
          ghost.style.width = s + "px";
          ghost.style.height = s + "px";
        }
        syncGhostSize();

        function clamp(v, a, b) {
          return Math.max(a, Math.min(b, v));
        }
        function clamp01(x) {
          return clamp(x, 0, 1);
        }
        function lerp(a, b, t) {
          return a + (b - a) * t;
        }
        function smoothstep(a, b, x) {
          const t = clamp((x - a) / (b - a), 0, 1);
          return t * t * (3 - 2 * t);
        }
        function mixRGB(a, b, t) {
          return [
            Math.round(lerp(a[0], b[0], t)),
            Math.round(lerp(a[1], b[1], t)),
            Math.round(lerp(a[2], b[2], t)),
          ];
        }
        function rgb(c) {
          return `rgb(${c[0]},${c[1]},${c[2]})`;
        }
        function rgba(c, a) {
          return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
        }

        function usesTapTrayMode() {
          return !!(mqCompact.matches && mqCoarse.matches);
        }

        function usesCustomTrayScrollbar() {
          return !!mqCompact.matches;
        }

        let trayScrollRAF = 0;
        let trayThumbDrag = null;

        function getTrayScrollMetrics() {
          const trackWidth = trayScrollTrack ? trayScrollTrack.clientWidth : 0;
          const clientWidth = trayPanel ? trayPanel.clientWidth : 0;
          const scrollWidth = trayPanel ? trayPanel.scrollWidth : 0;
          const scrollLeft = trayPanel ? trayPanel.scrollLeft : 0;
          const scrollable = Math.max(0, scrollWidth - clientWidth);
          const rawThumbWidth = scrollWidth > 0 ? (trackWidth * clientWidth) / scrollWidth : trackWidth;
          const thumbWidth = scrollable > 0 ? Math.min(trackWidth, Math.max(28, rawThumbWidth)) : trackWidth;
          const maxThumbX = Math.max(0, trackWidth - thumbWidth);
          const thumbX =
            scrollable > 0 && maxThumbX > 0 ? (clamp(scrollLeft, 0, scrollable) / scrollable) * maxThumbX : 0;

          return {
            clientWidth,
            maxThumbX,
            scrollLeft,
            scrollWidth,
            scrollable,
            thumbWidth,
            thumbX,
            trackWidth,
          };
        }

        function scheduleTrayScrollbarSync() {
          if (trayScrollRAF) return;
          trayScrollRAF = requestAnimationFrame(() => {
            trayScrollRAF = 0;
            syncTrayScrollbar();
          });
        }

        function primeTrayScrollbarSync() {
          scheduleTrayScrollbarSync();
          requestAnimationFrame(() => {
            scheduleTrayScrollbarSync();
          });
          setTimeout(scheduleTrayScrollbarSync, 80);
          setTimeout(scheduleTrayScrollbarSync, 220);
        }

        function setTrayScrollPosition(nextLeft, behavior = "auto") {
          if (!trayPanel) return;
          const metrics = getTrayScrollMetrics();
          const left = clamp(nextLeft, 0, metrics.scrollable);

          if (behavior !== "auto" && typeof trayPanel.scrollTo === "function") {
            trayPanel.scrollTo({
              left,
              behavior: prefersReduced ? "auto" : behavior,
            });
          } else {
            trayPanel.scrollLeft = left;
          }

          scheduleTrayScrollbarSync();
        }

        function syncTrayScrollbar() {
          if (!trayScrollUI || !trayScrollTrack || !trayScrollThumb || !trayScrollPrev || !trayScrollNext) return;

          const customScrollbar = usesCustomTrayScrollbar();
          const metrics = getTrayScrollMetrics();
          const hasOverflow = customScrollbar && metrics.scrollable > 1 && metrics.trackWidth > 0;

          trayScrollUI.classList.toggle("is-active", hasOverflow);
          trayScrollPrev.disabled = !hasOverflow || metrics.scrollLeft <= 1;
          trayScrollNext.disabled = !hasOverflow || metrics.scrollLeft >= metrics.scrollable - 1;

          if (!hasOverflow) {
            trayScrollThumb.style.width = "";
            trayScrollThumb.style.transform = "";
            trayScrollThumb.dataset.x = "0";
            return;
          }

          trayScrollThumb.style.width = metrics.thumbWidth.toFixed(2) + "px";
          trayScrollThumb.style.transform = `translate3d(${metrics.thumbX.toFixed(2)}px,0,0)`;
          trayScrollThumb.dataset.x = String(metrics.thumbX);
        }

        function onTrayThumbMove(e) {
          if (!trayThumbDrag || e.pointerId !== trayThumbDrag.pointerId) return;

          e.preventDefault();

          const metrics = getTrayScrollMetrics();
          const nextThumbX = clamp(trayThumbDrag.startLeft + (e.clientX - trayThumbDrag.startX), 0, metrics.maxThumbX);
          const nextScrollLeft =
            metrics.maxThumbX > 0 ? (nextThumbX / metrics.maxThumbX) * metrics.scrollable : 0;

          setTrayScrollPosition(nextScrollLeft, "auto");
        }

        function endTrayThumbDrag(e) {
          if (!trayThumbDrag) return;
          if (e && e.pointerId != null && e.pointerId !== trayThumbDrag.pointerId) return;

          trayThumbDrag = null;
          trayScrollThumb.classList.remove("is-dragging");

          window.removeEventListener("pointermove", onTrayThumbMove, { passive: false });
          window.removeEventListener("pointerup", endTrayThumbDrag, { passive: true });
          window.removeEventListener("pointercancel", endTrayThumbDrag, { passive: true });
        }

        function updateTraySelection(activeBtn = null) {
          const tapMode = usesTapTrayMode();
          Array.from(tray.children).forEach((el) => {
            const active = el === activeBtn;
            el.classList.toggle("is-selected", active && !tapMode);
            el.classList.toggle("is-dim", active && tapMode);
            el.classList.toggle("is-returnable", active && tapMode);
            el.setAttribute("aria-pressed", active ? "true" : "false");
            const itemName = el.dataset.itemName || "";
            el.setAttribute(
              "aria-label",
              active && tapMode ? `${itemName}. Toca para devolverlo a la bandeja.` : itemName
            );
          });
        }

        function updateMobileTrayCopy() {
          if (!trayToggleLabel || !trayToggleHint) return;

          if (!mqCompact.matches) {
            trayToggleLabel.textContent = "Objetos para probar";
            trayToggleHint.textContent = "Arrastra un objeto al visualizador";
            return;
          }

          if (usesTapTrayMode()) {
            trayToggleLabel.textContent = mobileActive ? mobileActive.it.name : "Objetos para probar";
            trayToggleHint.textContent = mobileActive
              ? "Desliza la bandeja para cambiar de objeto"
              : "Desliza la bandeja para ver más";
            return;
          }

          trayToggleLabel.textContent = "Objetos para probar";
          trayToggleHint.textContent = "Arrastra un objeto al visualizador";
        }

        function setMobileTrayOpen(open) {
          mobileTrayOpen = false;
          if (trayWrap) trayWrap.classList.toggle("is-open", mobileTrayOpen);
          if (trayToggle) trayToggle.setAttribute("aria-expanded", mobileTrayOpen ? "true" : "false");
          updateMobileTrayCopy();
        }

        function clearMobileSwap() {
          mobileSwapToken++;
          if (mobileSwapTimer) {
            clearTimeout(mobileSwapTimer);
            mobileSwapTimer = 0;
          }
        }

        function getMobileTargetPoint() {
          const r = view.getBoundingClientRect();
          return {
            x: r.width / 2,
            y: r.height * 0.41,
          };
        }

        function primeMobileItemAssets(it) {
          if (it.bigSvg) ensureDecoded(it.bigSvg).catch(() => {});
          masksPrefetchPromise
            .then(() => {
              const mu = getMaskUrl(it.id);
              if (mu) ensureDecoded(mu).catch(() => {});
            })
            .catch(() => {});
        }

        function mountMobileItem(it, btn, token = mobileSwapToken) {
          if (token !== mobileSwapToken) return;
          if (!usesTapTrayMode()) return;

          mobileActive = { it, btn };
          updateTraySelection(btn);
          bigWrap.classList.remove("is-dragging");
          bigWrap.classList.add("is-draggable");
          setMobileTrayOpen(false);

          view.classList.add("is-over");
          setHUD(it);
          setPanel(it);
          hideGhost(true);

          const { x, y } = getMobileTargetPoint();
          lastOverX = x;
          lastOverY = y;

          bigWrap.style.left = x + "px";
          bigWrap.style.top = y + "px";

          primeMobileItemAssets(it);

          showBig(it, () => {
            if (token !== mobileSwapToken) return;
            if (!mobileActive || mobileActive.it.id !== it.id) return;
            applyFX(it, x, y);
            bigWrap.classList.add("is-draggable");
            updateMobileTrayCopy();
          });
        }

        function dismissMobileItem() {
          if (!mobileActive) return;
          clearMobileState(true);
          primeTrayScrollbarSync();
        }

        function resetMobileSelection(resetView = true) {
          clearMobileSwap();
          mobileActive = null;
          updateTraySelection();
          bigWrap.classList.remove("is-draggable", "is-dragging");

          if (resetView) {
            view.classList.remove("is-over");
            setHUD(null);
            setPanel(null);
            hideBig(true);
            hideProFX(true);
            hideBadFX(true);
          }
        }

        function clearMobileState(resetView = true) {
          endViewDrag();
          resetMobileSelection(resetView);
          setMobileTrayOpen(false);
        }

        function applyMobileCopy() {
          const isCompact = !!mqCompact.matches;
          const isTapMode = usesTapTrayMode();

          if (viewPromptTitle) {
            viewPromptTitle.textContent = isTapMode ? "Toca un objeto" : "Arrastra aquí un objeto";
          }

          if (viewPromptBody) {
            viewPromptBody.textContent = isTapMode
              ? "para saber si su uso es seguro"
              : "para saber si su uso es seguro";
          }

          if (hintCopy) {
            hintCopy.textContent = isTapMode
              ? "Toca un objeto de la bandeja para verlo en grande. Puedes moverlo dentro del cielo y devolverlo tocando el aspa o su tarjeta."
              : "Arrastra un objeto sobre el cielo para ver el eclipse a través de él y saber si es seguro para observarlo.";
          }

          if (panelIntroCopy) {
            panelIntroCopy.textContent = isTapMode
              ? "Toca un objeto de la bandeja para llevarlo al visualizador y comprobar si permite observar el eclipse con seguridad. Puedes moverlo dentro del cielo y devolverlo con el aspa o tocando de nuevo su tarjeta."
              : "Prueba arrastrando un objeto al visualizador de la izquierda para comprobar si permite observar el eclipse con seguridad.";
          }

          Array.from(tray.children).forEach((btn) => {
            if (isCompact) {
              btn.removeAttribute("title");
            } else {
              btn.title = DESKTOP_HINT_TITLE;
            }
          });

          updateMobileTrayCopy();

          if (!isTapMode && mobileActive) {
            clearMobileState(true);
            return;
          }

          if (!isCompact || isTapMode) {
            setMobileTrayOpen(false);
          }

          primeTrayScrollbarSync();
        }

        if (mqCompact.addEventListener) {
          mqCompact.addEventListener("change", applyMobileCopy);
          mqCompact.addEventListener("change", syncGhostSize);
        } else if (mqCompact.addListener) {
          mqCompact.addListener(applyMobileCopy);
          mqCompact.addListener(syncGhostSize);
        }

        if (mqMobile.addEventListener) {
          mqMobile.addEventListener("change", applyMobileCopy);
          mqMobile.addEventListener("change", syncGhostSize);
          mqMobile.addEventListener("change", primeTrayScrollbarSync);
        } else if (mqMobile.addListener) {
          mqMobile.addListener(applyMobileCopy);
          mqMobile.addListener(syncGhostSize);
          mqMobile.addListener(primeTrayScrollbarSync);
        }

        if (mqCoarse.addEventListener) {
          mqCoarse.addEventListener("change", applyMobileCopy);
        } else if (mqCoarse.addListener) {
          mqCoarse.addListener(applyMobileCopy);
        }

        if (trayPanel) {
          trayPanel.addEventListener("scroll", scheduleTrayScrollbarSync, { passive: true });
        }

        if (trayScrollPrev) {
          trayScrollPrev.addEventListener("click", () => {
            if (!usesCustomTrayScrollbar()) return;
            setTrayScrollPosition(trayPanel.scrollLeft - Math.max(trayPanel.clientWidth * 0.72, 120), "smooth");
          });
        }

        if (trayScrollNext) {
          trayScrollNext.addEventListener("click", () => {
            if (!usesCustomTrayScrollbar()) return;
            setTrayScrollPosition(trayPanel.scrollLeft + Math.max(trayPanel.clientWidth * 0.72, 120), "smooth");
          });
        }

        if (trayScrollTrack) {
          trayScrollTrack.addEventListener("pointerdown", (e) => {
            if (!usesCustomTrayScrollbar()) return;
            if (e.target === trayScrollThumb) return;

            const rect = trayScrollTrack.getBoundingClientRect();
            const metrics = getTrayScrollMetrics();
            const nextThumbX = clamp(e.clientX - rect.left - metrics.thumbWidth / 2, 0, metrics.maxThumbX);
            const nextScrollLeft =
              metrics.maxThumbX > 0 ? (nextThumbX / metrics.maxThumbX) * metrics.scrollable : 0;

            setTrayScrollPosition(nextScrollLeft, "smooth");
            e.preventDefault();
          });
        }

        if (trayScrollThumb) {
          trayScrollThumb.addEventListener("pointerdown", (e) => {
            if (!usesCustomTrayScrollbar()) return;
            const metrics = getTrayScrollMetrics();
            if (metrics.scrollable <= 1) return;

            trayThumbDrag = {
              pointerId: e.pointerId,
              startLeft: parseFloat(trayScrollThumb.dataset.x || "0") || 0,
              startX: e.clientX,
            };

            trayScrollThumb.classList.add("is-dragging");

            try {
              trayScrollThumb.setPointerCapture(e.pointerId);
            } catch (_) {}

            window.addEventListener("pointermove", onTrayThumbMove, { passive: false });
            window.addEventListener("pointerup", endTrayThumbDrag, { passive: true });
            window.addEventListener("pointercancel", endTrayThumbDrag, { passive: true });

            e.preventDefault();
            e.stopPropagation();
          });
        }

        if (trayToggle) {
          trayToggle.addEventListener("click", () => {
            if (!mqCompact.matches || usesTapTrayMode()) return;
            setMobileTrayOpen(!mobileTrayOpen);
          });
        }

        function activateMobileItem(it, btn) {
          if (!usesTapTrayMode()) return;

          if (mobileActive && mobileActive.it.id === it.id && bigWrap.classList.contains("is-mounted")) {
            dismissMobileItem();
            return;
          }

          endViewDrag();
          clearMobileSwap();
          setMobileTrayOpen(false);
          hideGhost(true);
          updateTraySelection(btn);
          primeMobileItemAssets(it);

          const token = mobileSwapToken;
          const isReplacing = !!(
            mobileActive &&
            bigWrap.classList.contains("is-mounted") &&
            bigWrap.classList.contains("is-visible")
          );

          if (isReplacing) {
            hideProFX(false);
            hideBadFX(false);
            hideBig(false);
            setPanel(null);

            mobileSwapTimer = setTimeout(() => {
              mobileSwapTimer = 0;
              mountMobileItem(it, btn, token);
            }, MOBILE_SWAP_DELAY);
            return;
          }

          mountMobileItem(it, btn, token);
        }

        function startViewDrag(e) {
          if (!usesTapTrayMode() || !mobileActive) return;
          if (!bigWrap.classList.contains("is-mounted")) return;

          e.preventDefault();

          const br = bigWrap.getBoundingClientRect();
          mobileDragging = {
            pointerId: e.pointerId,
            offsetX: e.clientX - br.left,
            offsetY: e.clientY - br.top,
            halfW: br.width / 2,
            halfH: br.height / 2,
            startX: e.clientX,
            startY: e.clientY,
            moved: false,
          };

          try {
            bigWrap.setPointerCapture(e.pointerId);
          } catch (_) {}

          bigWrap.classList.add("is-dragging");

          window.addEventListener("pointermove", onViewDragMove, { passive: false });
          window.addEventListener("pointerup", endViewDrag, { passive: true });
          window.addEventListener("pointercancel", endViewDrag, { passive: true });
        }

        function onViewDragMove(e) {
          if (!mobileDragging || e.pointerId !== mobileDragging.pointerId) return;

          e.preventDefault();

          if (
            !mobileDragging.moved &&
            (Math.abs(e.clientX - mobileDragging.startX) > 6 || Math.abs(e.clientY - mobileDragging.startY) > 6)
          ) {
            mobileDragging.moved = true;
          }

          const vr = view.getBoundingClientRect();
          let x = e.clientX - vr.left - mobileDragging.offsetX + mobileDragging.halfW;
          let y = e.clientY - vr.top - mobileDragging.offsetY + mobileDragging.halfH;

          x = clamp(x, mobileDragging.halfW, vr.width - mobileDragging.halfW);
          y = clamp(y, mobileDragging.halfH, vr.height - mobileDragging.halfH);

          lastOverX = x;
          lastOverY = y;
          scheduleBigMove(x, y);
        }

        function endViewDrag(e) {
          if (!mobileDragging) return;
          if (e && e.pointerId != null && e.pointerId !== mobileDragging.pointerId) return;

          const dragState = mobileDragging;
          const tappedObject =
            !!usesTapTrayMode() &&
            !!mobileActive &&
            !!dragState &&
            !dragState.moved &&
            !!e &&
            bigWrap.contains(e.target);

          mobileDragging = null;
          bigWrap.classList.remove("is-dragging");

          window.removeEventListener("pointermove", onViewDragMove, { passive: false });
          window.removeEventListener("pointerup", endViewDrag, { passive: true });
          window.removeEventListener("pointercancel", endViewDrag, { passive: true });

          if (tappedObject) {
            resetMobileSelection(true);
            setMobileTrayOpen(false);
          }
        }

        bigWrap.addEventListener("pointerdown", startViewDrag);
        if (bigDismiss) {
          bigDismiss.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
          });
          bigDismiss.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (usesTapTrayMode()) dismissMobileItem();
          });
        }

        let nPosX = 0,
          nPosY = 0;
        let nVelX = 0.6,
          nVelY = 0.4;

        function getMaskUrl(id) {
          const raw = URLS.bigGlassMask[id];
          const blob = MASK_BLOBS.get(id);
          return blob || raw || "";
        }
        function setMask(el, maskUrl) {
          el.style.webkitMaskImage = `url("${maskUrl}")`;
          el.style.maskImage = `url("${maskUrl}")`;
        }
        function clearMask(el) {
          el.style.webkitMaskImage = "";
          el.style.maskImage = "";
        }

        function hideMaskedLayerNow(el, maskClearDelay = 34) {
          clearTimeout(el._lvMaskTimer);

          el.style.transition = "none";
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          el.getBoundingClientRect();

          el._lvMaskTimer = setTimeout(() => {
            clearMask(el);
            el.style.transition = "";
            el.style.opacity = "";
            el.style.visibility = "";
          }, maskClearDelay);
        }

        function clearMaskLater(el, delay = 190) {
          clearTimeout(el._lvMaskTimer);
          el._lvMaskTimer = setTimeout(() => {
            if (!el.classList.contains("is-on")) clearMask(el);
          }, delay);
        }

        function makeNoiseDataURL(size = 128) {
          const c = document.createElement("canvas");
          c.width = c.height = size;
          const g = c.getContext("2d", { alpha: true });
          const img = g.createImageData(size, size);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
            d[i + 3] = 255;
          }
          g.putImageData(img, 0, 0);
          return c.toDataURL("image/png");
        }

        let currentScale = 1;
        function setCurrentScale(sc) {
          currentScale = Number(sc) || 1;
          if (!isFinite(currentScale) || currentScale <= 0) currentScale = 1;
        }
        function getEffectiveBigScale(it) {
          const raw = mqDesktop.matches ? it?.desktopBigScale ?? it?.bigScale ?? 1 : it?.bigScale ?? 1;
          const tapBoost = usesTapTrayMode() ? 1.12 : 1;
          const scale = (Number(raw) || 1) * tapBoost;
          return isFinite(scale) && scale > 0 ? scale : 1;
        }
        function resetFXBase() {
          view.style.removeProperty("--fx-w");
          view.style.removeProperty("--fx-h");
        }
        function syncFXSizeFromBig() {
          if (!bigWrap.classList.contains("is-mounted")) return;
          const r = bigWrap.getBoundingClientRect();
          if (!r.width || !r.height) return;

          const baseW = r.width / currentScale;
          const baseH = r.height / currentScale;

          view.style.setProperty("--fx-w", baseW.toFixed(1) + "px");
          view.style.setProperty("--fx-h", baseH.toFixed(1) + "px");
        }

        let proFxToken = 0;
        let badFxToken = 0;

        function positionFX(x, y, scStr) {
          fxProBase.style.left = x + "px";
          fxProBase.style.top = y + "px";
          fxProBurn.style.left = x + "px";
          fxProBurn.style.top = y + "px";
          fxProDither.style.left = x + "px";
          fxProDither.style.top = y + "px";
          fxBadGlass.style.left = x + "px";
          fxBadGlass.style.top = y + "px";

          fxProBase.style.setProperty("--big-scale", scStr);
          fxProBurn.style.setProperty("--big-scale", scStr);
          fxProDither.style.setProperty("--big-scale", scStr);
          fxBadGlass.style.setProperty("--big-scale", scStr);
        }

        function hideProFX(immediate = false) {
          proFxToken++;
          const t = proFxToken;

          fxProBase.classList.remove("is-on");
          fxProBurn.classList.remove("is-on");
          fxProDither.classList.remove("is-on");

          fxProBurn.style.setProperty("--pro-dim", "0");
          fxProDither.style.setProperty("--pro-noise", "0");

          if (immediate) {
            hideMaskedLayerNow(fxProBase);
            hideMaskedLayerNow(fxProBurn);
            hideMaskedLayerNow(fxProDither);
            return;
          }

          clearMaskLater(fxProBase, 190);
          clearMaskLater(fxProBurn, 190);
          clearMaskLater(fxProDither, 190);

          setTimeout(() => {
            if (t !== proFxToken) return;
            if (
              fxProBase.classList.contains("is-on") ||
              fxProBurn.classList.contains("is-on") ||
              fxProDither.classList.contains("is-on")
            ) {
              return;
            }
            clearMask(fxProBase);
            clearMask(fxProBurn);
            clearMask(fxProDither);
          }, 210);
        }

        function hideBadFX(immediate = false) {
          badFxToken++;
          const t = badFxToken;

          fxBadGlass.classList.remove("is-on");

          if (immediate) {
            hideMaskedLayerNow(fxBadGlass);
            return;
          }

          clearMaskLater(fxBadGlass, 190);

          setTimeout(() => {
            if (t !== badFxToken) return;
            if (fxBadGlass.classList.contains("is-on")) return;
            clearMask(fxBadGlass);
          }, 210);
        }

        function showProFX(it, x, y) {
          hideBadFX(true);

          const maskUrl = getMaskUrl(it.id);
          if (!maskUrl) {
            hideProFX(false);
            return;
          }

          proFxToken++;
          const t = proFxToken;

          setMask(fxProBase, maskUrl);
          setMask(fxProBurn, maskUrl);
          setMask(fxProDither, maskUrl);

          const scale = getEffectiveBigScale(it);
          const sc = String(scale);
          setCurrentScale(scale);
          positionFX(x, y, sc);
          syncFXSizeFromBig();

          ensureDecoded(maskUrl)
            .then(() => {
              if (t !== proFxToken) return;
              if (!bigWrap.classList.contains("is-visible")) return;
              if (!isBigReadyFor(it.bigSvg)) return;
              fxProBase.classList.add("is-on");
              fxProBurn.classList.add("is-on");
              fxProDither.classList.add("is-on");
            })
            .catch(() => {
              if (t === proFxToken) hideProFX(true);
            });
        }

        function showBadFX(it, x, y) {
          hideProFX(true);

          const maskUrl = getMaskUrl(it.id);
          if (!maskUrl) {
            hideBadFX(false);
            return;
          }

          badFxToken++;
          const t = badFxToken;

          setMask(fxBadGlass, maskUrl);

          const scale = getEffectiveBigScale(it);
          const sc = String(scale);
          setCurrentScale(scale);
          positionFX(x, y, sc);
          syncFXSizeFromBig();

          ensureDecoded(maskUrl)
            .then(() => {
              if (t !== badFxToken) return;
              if (!bigWrap.classList.contains("is-visible")) return;
              if (!isBigReadyFor(it.bigSvg)) return;
              fxBadGlass.classList.add("is-on");
            })
            .catch(() => {
              if (t === badFxToken) hideBadFX(true);
            });
        }

        function applyFX(it, x, y) {
          if (!it) {
            hideProFX(false);
            hideBadFX(false);
            return;
          }
          if (PRO_IDS.has(it.id)) return showProFX(it, x, y);
          if (BAD_IDS.has(it.id)) return showBadFX(it, x, y);
          hideProFX(false);
          hideBadFX(false);
        }

        function setHUD(it) {
          if (!it) {
            hudTitle.textContent = "—";
            hudPill.textContent = "—";
            hudPill.className = "hudPill hud-red";
            return;
          }

          hudTitle.textContent = it.name;

          hudPill.textContent = it.pill || it.whyTitle || "—";
          hudPill.className = `hudPill ${pillHudClass(it.level)}`;
        }

        function updateVerdictPair(titleEl, bodyEl, containerEl, it, defaultStroke = null, titleBaseClass = "", bodyBaseClass = "", tintBody = false, metaEl = null) {
          if (!titleEl || !bodyEl) return;

          if (containerEl && containerEl._hideTimer) {
            clearTimeout(containerEl._hideTimer);
            containerEl._hideTimer = null;
          }

          if (!it) {
            if (containerEl) {
              containerEl.classList.remove("is-active");
              containerEl.style.setProperty("--desktop-verdict-stroke", "rgba(255,255,255,.14)");
              containerEl._hideTimer = setTimeout(() => {
                if (containerEl.classList.contains("is-active")) return;
                titleEl.style.display = "none";
                bodyEl.style.display = "none";
                titleEl.textContent = "";
                bodyEl.textContent = "";
                if (metaEl) {
                  metaEl.textContent = "";
                  metaEl.style.display = "none";
                }
                if (titleBaseClass) titleEl.className = titleBaseClass;
                if (bodyBaseClass) bodyEl.className = bodyBaseClass;
              }, 190);
            } else {
              titleEl.style.display = "none";
              bodyEl.style.display = "none";
              titleEl.textContent = "";
              bodyEl.textContent = "";
              if (metaEl) {
                metaEl.textContent = "";
                metaEl.style.display = "none";
              }
              if (titleBaseClass) titleEl.className = titleBaseClass;
              if (bodyBaseClass) bodyEl.className = bodyBaseClass;
            }
            if (defaultStroke) panel.style.setProperty("--panel-stroke", defaultStroke);
            return;
          }

          if (titleBaseClass) titleEl.className = `${titleBaseClass} ${pillClass(it.level)}`;
          if (bodyBaseClass) bodyEl.className = tintBody ? `${bodyBaseClass} ${pillClass(it.level)}` : bodyBaseClass;

          titleEl.textContent = it.whyTitle;
          bodyEl.textContent = it.why;
          titleEl.style.display = "block";
          bodyEl.style.display = "block";
          if (metaEl) {
            metaEl.textContent = it.name;
            metaEl.style.display = "block";
          }

          if (containerEl) {
            containerEl.classList.add("is-active");
            containerEl.style.setProperty("--desktop-verdict-stroke", levelColor(it.level));
          }

          if (defaultStroke) {
            panel.style.setProperty("--panel-stroke", levelColor(it.level));
          }
        }

        function setPanel(it) {
          updateVerdictPair(verdictTitle, verdictBody, null, it, COLORS.yellow, "panelVerdictTitle", "panelVerdictBody", true);
          updateVerdictPair(desktopVerdictTitle, desktopVerdictBody, desktopVerdict, it, null, "desktopVerdictTitle", "desktopVerdictBody", false, desktopVerdictItem);
        }

        function showGhost(it) {
          ghostImg.src = it.miniSvg || "";
          ghostImg.alt = it.name;
          ghost.style.opacity = "1";
        }

        function hideGhost(immediate = false) {
          if (!immediate) {
            ghost.style.transition = "opacity .12s ease";
            ghost.style.opacity = "0";
            return;
          }

          ghost.style.transition = "none";
          ghost.style.opacity = "0";
          ghost.getBoundingClientRect();

          requestAnimationFrame(() => {
            ghost.style.transition = "opacity .12s ease";
          });
        }

        function moveGhost(x, y) {
          ghost.style.left = x + "px";
          ghost.style.top = y + "px";
        }

        let bigToken = 0;
        let overInView = false;
        let currentBigSrc = "";
        let currentBigReady = false;
        let bigHideTimer = 0;

        let lastOverX = 0;
        let lastOverY = 0;

        let moveRAF = 0;
        let moveX = 0;
        let moveY = 0;
        function scheduleBigMove(x, y) {
          moveX = x;
          moveY = y;
          if (moveRAF) return;
          moveRAF = requestAnimationFrame(() => {
            moveRAF = 0;

            if (bigWrap.classList.contains("is-mounted")) {
              bigWrap.style.left = moveX + "px";
              bigWrap.style.top = moveY + "px";
            }

            if (fxProBase.classList.contains("is-on") || fxBadGlass.classList.contains("is-on")) {
              const sc =
                fxProBase.style.getPropertyValue("--big-scale") ||
                fxBadGlass.style.getPropertyValue("--big-scale") ||
                "1";
              positionFX(moveX, moveY, sc);
            }
          });
        }

        function freezeBigAndFXPosition() {
          if (moveRAF) {
            cancelAnimationFrame(moveRAF);
            moveRAF = 0;
          }

          const hasBig = bigWrap.classList.contains("is-mounted");
          const hasFx = fxProBase.classList.contains("is-on") || fxBadGlass.classList.contains("is-on");
          if (!hasBig && !hasFx) return;

          bigWrap.style.left = lastOverX + "px";
          bigWrap.style.top = lastOverY + "px";

          const sc =
            bigWrap.style.getPropertyValue("--big-scale") ||
            fxProBase.style.getPropertyValue("--big-scale") ||
            fxBadGlass.style.getPropertyValue("--big-scale") ||
            "1";

          positionFX(lastOverX, lastOverY, sc);
        }

        function isBigReadyFor(src) {
          if (!src) return false;
          if (currentBigSrc !== src || !currentBigReady) return false;
          return !!(bigObj.complete && bigObj.naturalWidth > 0);
        }

        function showBig(it, onReady) {
          if (!it || !it.bigSvg) return;

          if (bigHideTimer) {
            clearTimeout(bigHideTimer);
            bigHideTimer = 0;
          }

          bigWrap.dataset.itemId = it.id || "";

          const scale = getEffectiveBigScale(it);
          setCurrentScale(scale);
          bigWrap.style.setProperty("--big-scale", String(scale));

          if (MASK_AR.has(it.id)) {
            const ar = MASK_AR.get(it.id);
            bigWrap.style.setProperty("--big-ar", `${ar.toFixed(6)} / 1`);
          } else {
            bigWrap.style.removeProperty("--big-ar");
          }

          resetFXBase();

          const src = it.bigSvg;
          const visibleToken = bigToken;

          if (isBigReadyFor(src)) {
            bigWrap.classList.add("is-mounted");
            if (!bigWrap.classList.contains("is-visible")) {
              requestAnimationFrame(() => {
                if (visibleToken !== bigToken) return;
                if (!isBigReadyFor(src)) return;
                if (!bigWrap.classList.contains("is-mounted")) return;
                bigWrap.classList.add("is-visible");
              });
            }
            requestAnimationFrame(() => {
              if (visibleToken !== bigToken) return;
              if (!isBigReadyFor(src)) return;
              if (!bigWrap.classList.contains("is-mounted")) return;
              syncFXSizeFromBig();
              if (typeof onReady === "function") onReady();
            });
            return;
          }

          currentBigSrc = src;
          currentBigReady = false;

          bigToken++;
          const token = bigToken;
          let revealed = false;

          bigWrap.classList.add("is-mounted");
          bigWrap.classList.remove("is-visible");

          const revealOnce = () => {
            if (revealed) return;
            if (token !== bigToken) return;
            if (!(bigObj.complete && bigObj.naturalWidth > 0)) return;
            revealed = true;
            currentBigReady = true;

            requestAnimationFrame(() => {
              if (token !== bigToken) return;
              if (!isBigReadyFor(src)) return;
              if (!bigWrap.classList.contains("is-mounted")) return;
              syncFXSizeFromBig();
              bigWrap.classList.add("is-visible");
              if (typeof onReady === "function") onReady();
            });
          };

          bigObj.onload = revealOnce;
          bigObj.onerror = () => {
            if (token === bigToken) {
              currentBigReady = false;
              currentBigSrc = "";
              hideBig(true);
            }
          };

          const currentImgSrc = bigObj.currentSrc || bigObj.src || "";
          if (currentImgSrc !== src) {
            bigObj.src = src;
          } else if (bigObj.complete && bigObj.naturalWidth > 0) {
            revealOnce();
          }

          if (typeof bigObj.decode === "function") {
            bigObj.decode().then(revealOnce).catch(() => {});
          }
        }

        function hideBig(immediate = false) {
          bigToken++;
          if (bigHideTimer) {
            clearTimeout(bigHideTimer);
            bigHideTimer = 0;
          }
          bigWrap.classList.remove("is-visible");

          if (immediate) {
            bigWrap.classList.remove("is-mounted", "is-draggable", "is-dragging");
            delete bigWrap.dataset.itemId;
            bigObj.removeAttribute("src");
            currentBigSrc = "";
            currentBigReady = false;
            resetFXBase();
            return;
          }

          const t = bigToken;
          bigHideTimer = setTimeout(() => {
            bigHideTimer = 0;
            if (t !== bigToken) return;
            bigWrap.classList.remove("is-mounted", "is-draggable", "is-dragging");
            delete bigWrap.dataset.itemId;
            resetFXBase();
          }, 190);
        }

        tray.innerHTML = "";
        for (const id of order) {
          const it = byId[id];

          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "item";
          btn.style.borderColor = borderColor(it.level);
          btn.dataset.itemName = it.name;
          btn.setAttribute("aria-label", it.name);
          btn.setAttribute("aria-pressed", "false");

          btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (usesTapTrayMode()) activateMobileItem(it, btn);
          });

          const img = document.createElement("img");
          img.className = "mini";
          img.alt = it.name;
          img.decoding = "async";
          img.loading = "lazy";
          img.onload = () => {
            primeTrayScrollbarSync();
          };
          img.onerror = () => {
            img.style.display = "none";
            primeTrayScrollbarSync();
          };
          img.src = it.miniSvg || "";
          if (img.complete) {
            requestAnimationFrame(primeTrayScrollbarSync);
          }

          const lbl = document.createElement("div");
          lbl.className = "lbl";
          lbl.innerHTML = String(it.cardLabel || "").replace(/\n/g, "<br>");

          const trayReturn = document.createElement("span");
          trayReturn.className = "trayReturn";
          trayReturn.setAttribute("aria-hidden", "true");
          trayReturn.innerHTML = '<span class="trayReturnArrow"></span><span class="trayReturnText">Devolver</span>';

          btn.appendChild(img);
          btn.appendChild(lbl);
          btn.appendChild(trayReturn);

          btn.addEventListener("pointerdown", (e) => {
            if (usesTapTrayMode() || (mqCompact.matches && e.pointerType === "touch")) return;
            startDrag(e, it, btn);
          });

          tray.appendChild(btn);
        }

        applyMobileCopy();
        primeTrayScrollbarSync();

        const CYCLE_MS = prefersReduced ? 150000 : 48000;
        let dpr = 1;
        let W = 0;
        let H = 0;
        let raf = 0;
        let running = false;
        let startT = performance.now();

        function resize() {
          const r = view.getBoundingClientRect();
          const w = Math.max(1, Math.floor(r.width));
          const h = Math.max(1, Math.floor(r.height));
          const ndpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
          if (w === W && h === H && ndpr === dpr) return;
          W = w;
          H = h;
          dpr = ndpr;
          canvas.width = Math.floor(W * dpr);
          canvas.height = Math.floor(H * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          requestAnimationFrame(syncFXSizeFromBig);
        }
        const ro = new ResizeObserver(resize);
        ro.observe(view);

        const trayRO = new ResizeObserver(primeTrayScrollbarSync);
        if (trayPanel) trayRO.observe(trayPanel);
        if (tray) trayRO.observe(tray);
        if (trayScrollTrack) trayRO.observe(trayScrollTrack);

        function heldProgress(t) {
          const a = 0.445;
          const b = 0.555;
          const midStart = 0.492;
          const midSpan = 0.016;
          const midEnd = midStart + midSpan;

          if (t < a) return smoothstep(0, 1, t / a) * midStart;
          if (t < b) return midStart + ((t - a) / (b - a)) * midSpan;
          return midEnd + smoothstep(0, 1, (t - b) / (1 - b)) * (1 - midEnd);
        }

        function drawCloudSprite(img, x, y, w, h, alpha, blurPx, blendMode = "source-over") {
          if (!img || !img.complete || !img.naturalWidth || alpha <= 0.002) return;

          ctx.save();
          ctx.globalCompositeOperation = blendMode;
          ctx.globalAlpha = alpha;
          ctx.filter = blurPx > 0 ? `blur(${blurPx}px)` : "none";
          ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
          ctx.restore();
        }

        function drawClouds(now, dark, cx, cy, sunR) {
          if (W < 320) return;

          const timeS = prefersReduced ? 0 : now * 0.001;
          const clearInner = sunR * 1.9;
          const clearOuter = sunR * 3.1;
          const cloudStrength = mqMobile.matches ? 1.02 : 1.16;
          const dayCloudBoost = lerp(1.34, 0.86, dark);
          const dayCloudScreen = 1 - smoothstep(0.06, 0.46, dark);

          for (const layer of CLOUD_LAYERS) {
            const img = CLOUD_IMAGES.get(layer.src);
            if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) continue;

            const ratio = img.naturalHeight / img.naturalWidth;
            const layerAlpha = layer.opacity * lerp(1, 0.74, dark) * cloudStrength * dayCloudBoost;
            const blurPx = Math.max(0, Math.round(Math.min(W, H) * layer.blur * 0.01 * 10) / 10);

            for (const cloud of layer.instances) {
              const wrap = ((((cloud.x + timeS * layer.speed) % 1.95) + 1.95) % 1.95) - 0.32;
              const w = cloud.w * W;
              const h = w * ratio;
              const x = wrap * W;
              const y = cloud.y * H + Math.sin(timeS * 0.22 + cloud.phase) * H * layer.bob;

              const dx = Math.max(Math.abs(x - cx) - w * 0.24, 0);
              const dy = Math.max(Math.abs(y - cy) - h * 0.20, 0);
              const dist = Math.hypot(dx, dy);
              const avoid = smoothstep(clearInner, clearOuter, dist);
              const alpha = layerAlpha * cloud.alpha * avoid;

              drawCloudSprite(img, x, y, w, h, alpha, blurPx);
              if (dayCloudScreen > 0.002) {
                drawCloudSprite(img, x, y, w, h, alpha * 0.62 * dayCloudScreen, blurPx + 1.1, "screen");
              }
            }
          }
        }

        function drawBase(now) {
          resize();
          const t = ((now - startT) % CYCLE_MS) / CYCLE_MS;
          const p = heldProgress(t);

          const cx = W * 0.50;
          const cy = H * (usesTapTrayMode() ? 0.42 : 0.46);
          const sunR = Math.min(W, H) * 0.13;
          const moonR = sunR * 1.04;

          const moonX = lerp(cx + sunR * 2.25, cx - sunR * 2.25, p);
          const moonY = cy + Math.sin(2 * Math.PI * t) * sunR * 0.02;

          const d = Math.hypot(moonX - cx, moonY - cy);
          const mag = 1 - clamp(d / (sunR * 2.0), 0, 1);
          const nearTotal = smoothstep(0.82, 0.99, mag);
          const dark = smoothstep(0.58, 0.99, mag);

          const k = clamp01(1 - dark);
          const dim = PRO_DIM_MAX * Math.pow(k, PRO_DIM_EXP);
          const noise = Math.min(PRO_NOISE_MAX, dim * 0.60);

          fxProBurn.style.setProperty("--pro-dim", dim.toFixed(3));
          fxProDither.style.setProperty("--pro-noise", noise.toFixed(3));

          if (NOISE_MOTION === "wander") {
            nVelX += (Math.random() - 0.5) * 0.22;
            nVelY += (Math.random() - 0.5) * 0.22;
            nVelX = clamp(nVelX, -1.2, 1.2);
            nVelY = clamp(nVelY, -1.2, 1.2);
            nPosX = (nPosX + nVelX) % PRO_NOISE_SCALE;
            nPosY = (nPosY + nVelY) % PRO_NOISE_SCALE;
            fxProDither.style.setProperty("--nx", (-nPosX).toFixed(1) + "px");
            fxProDither.style.setProperty("--ny", (-nPosY).toFixed(1) + "px");
          } else {
            fxProDither.style.setProperty("--nx", "0px");
            fxProDither.style.setProperty("--ny", "0px");
          }

          const warm = smoothstep(0.55, 0.98, mag);
          const warmStrong = clamp(warm * 0.85 + nearTotal * 0.35, 0, 1);
          const coronaWarm = smoothstep(0.15, 1.0, nearTotal);

          const open = 1 - smoothstep(0.06, 0.30, mag);
          const blueBoost = clamp01(open * (1 - dark));

          const sunDiscBlur = lerp(0.60, 0.38, dark);
          const haloBlur = lerp(1.35, 1.05, dark);
          const moonBlur = lerp(0.85, 0.46, nearTotal);

          const skyTopRGB = [
            Math.round(lerp(150, 16, dark)),
            Math.round(lerp(172, 22, dark)),
            Math.round(lerp(189, 40, dark)),
          ];
          const skyBotRGB = [
            Math.round(lerp(205, 8, dark)),
            Math.round(lerp(220, 12, dark)),
            Math.round(lerp(230, 20, dark)),
          ];

          const sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, rgb(skyTopRGB));
          sky.addColorStop(1, rgb(skyBotRGB));
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);

          drawClouds(now, dark, cx, cy, sunR);

          {
            const halo0 = mixRGB([255, 255, 255], [255, 250, 200], warmStrong);
            const halo1 = mixRGB([255, 248, 232], [255, 220, 140], warmStrong);
            const halo2 = mixRGB([255, 242, 220], [255, 200, 80], warmStrong);

            const a0 = clamp01(1.0 * (1 - dark) * (1 + 0.95 * blueBoost));
            const a1 = clamp01(0.6 * (1 - dark) * (1 + 1.1 * blueBoost));

            ctx.save();
            ctx.filter = `blur(${haloBlur}px)`;

            const tailA = clamp01(0.10 * (1 - dark) * (1 + 0.85 * blueBoost));
            const halo = ctx.createRadialGradient(cx, cy, sunR * 0.10, cx, cy, sunR * 3.85);
            halo.addColorStop(0.00, rgba(halo0, a0));
            halo.addColorStop(0.25, rgba(halo1, a1));
            halo.addColorStop(0.62, rgba(halo1, tailA));
            halo.addColorStop(0.82, rgba(halo2, tailA * 0.55));
            halo.addColorStop(1.00, rgba(halo2, 0.0));

            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(cx, cy, sunR * 3.85, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (blueBoost > 0.02) {
              ctx.save();
              ctx.globalCompositeOperation = "screen";
              ctx.globalAlpha = clamp01(0.55 * blueBoost);
              ctx.filter = "blur(2.2px)";

              const bloom = ctx.createRadialGradient(cx, cy, sunR * 0.55, cx, cy, sunR * 2.35);
              bloom.addColorStop(0.00, "rgba(255,255,255,0.58)");
              bloom.addColorStop(0.18, "rgba(255,255,255,0.30)");
              bloom.addColorStop(0.38, "rgba(255,255,255,0.14)");
              bloom.addColorStop(0.62, "rgba(255,255,255,0.07)");
              bloom.addColorStop(0.80, "rgba(255,255,255,0.03)");
              bloom.addColorStop(1.00, "rgba(255,255,255,0.00)");

              ctx.fillStyle = bloom;
              ctx.beginPath();
              ctx.arc(cx, cy, sunR * 2.35, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }

          {
            const sunC0 = mixRGB([255, 255, 255], [255, 253, 240], warmStrong);
            const sunC1 = mixRGB([255, 250, 232], [255, 230, 160], warmStrong);
            const sunC2 = mixRGB([255, 240, 200], [255, 191, 85], warmStrong);

            ctx.save();
            ctx.filter = `blur(${sunDiscBlur}px)`;
            const sunGrad = ctx.createRadialGradient(cx, cy, sunR * 0.08, cx, cy, sunR);
            sunGrad.addColorStop(0, rgb(sunC0));
            sunGrad.addColorStop(0.55, rgb(sunC1));
            sunGrad.addColorStop(1, rgb(sunC2));
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, sunR + 0.5, 0, Math.PI * 2);
          ctx.clip();
          ctx.filter = `blur(${moonBlur}px)`;

          const skyT = clamp01(moonY / H);
          const skyAtMoon = mixRGB(skyTopRGB, skyBotRGB, skyT);
          const enter = 1 - smoothstep(0.02, 0.22, mag);
          const lift = clamp01(0.12 * enter * (1 - dark));
          const moonRGB = mixRGB(skyAtMoon, [255, 255, 255], lift);

          ctx.fillStyle = rgb(moonRGB);
          ctx.beginPath();
          ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (nearTotal > 0.03) {
            const corC = mixRGB([255, 255, 255], [255, 190, 90], coronaWarm);

            ctx.save();
            ctx.globalCompositeOperation = "screen";
            ctx.globalAlpha = nearTotal * 0.95;
            ctx.filter = "blur(0.58px)";
            const coronaInner = sunR * 0.96;
            const coronaOuter = sunR * 3.15;

            const corona = ctx.createRadialGradient(cx, cy, coronaInner, cx, cy, coronaOuter);
            corona.addColorStop(0.00, rgba(corC, 0.00));
            corona.addColorStop(0.02, rgba(corC, 0.88));
            corona.addColorStop(0.10, rgba(corC, 0.40));
            corona.addColorStop(0.35, rgba(corC, 0.18));
            corona.addColorStop(0.60, rgba(corC, 0.10));
            corona.addColorStop(1.00, rgba(corC, 0.00));

            ctx.fillStyle = corona;
            ctx.beginPath();
            ctx.arc(cx, cy, coronaOuter, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          {
            const vgOuter = 0.22 + 0.10 * dark;
            const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.18, cx, cy, Math.max(W, H) * 0.82);
            vg.addColorStop(0.00, "rgba(0,0,0,0)");
            vg.addColorStop(0.55, "rgba(0,0,0,0)");
            vg.addColorStop(0.82, `rgba(0,0,0,${0.12 + 0.06 * dark})`);
            vg.addColorStop(1.00, `rgba(0,0,0,${vgOuter})`);
            ctx.save();
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
          }
        }

        function tick(now) {
          if (!running) return;
          drawBase(now);
          raf = requestAnimationFrame(tick);
        }

        const io = new IntersectionObserver(
          (entries) => {
            const on = entries && entries[0] && entries[0].isIntersecting;
            running = !!on;
            if (running) {
              startT = performance.now();
              if (!raf) raf = requestAnimationFrame(tick);
            } else {
              if (raf) cancelAnimationFrame(raf);
              raf = 0;
            }
          },
          { threshold: 0.12 }
        );
        io.observe(mount);

        let dragging = null;

        function startDrag(e, it, btn) {
          e.preventDefault();
          try {
            btn.setPointerCapture(e.pointerId);
          } catch (_) {}
          dragging = { it, btn, pointerId: e.pointerId };

          overInView = false;
          btn.classList.add("is-dim");

          showGhost(it);
          moveGhost(e.clientX, e.clientY);
          updateOver(e.clientX, e.clientY);

          masksPrefetchPromise
            .then(() => {
              const mu = getMaskUrl(it.id);
              if (mu) ensureDecoded(mu).catch(() => {});
            })
            .catch(() => {});

          if (it.bigSvg) ensureDecoded(it.bigSvg).catch(() => {});

          window.addEventListener("pointermove", onMove, { passive: true });
          window.addEventListener("pointerup", onUp, { passive: true });
          window.addEventListener("pointercancel", onUp, { passive: true });
        }

        function onMove(ev) {
          if (!dragging || ev.pointerId !== dragging.pointerId) return;
          moveGhost(ev.clientX, ev.clientY);
          updateOver(ev.clientX, ev.clientY);
        }

        function onUp(ev) {
          if (!dragging || ev.pointerId !== dragging.pointerId) return;

          dragging.btn.classList.remove("is-dim");
          dragging = null;

          overInView = false;
          view.classList.remove("is-over");
          holdPromptReturn();

          setPanel(null);
          hideGhost();
          if (moveRAF) {
            cancelAnimationFrame(moveRAF);
            moveRAF = 0;
          }
          hideProFX(true);
          hideBadFX(true);
          hideBig(true);

          window.removeEventListener("pointermove", onMove, { passive: true });
          window.removeEventListener("pointerup", onUp, { passive: true });
          window.removeEventListener("pointercancel", onUp, { passive: true });
        }

        function updateOver(clientX, clientY) {
          if (!dragging) return;

          const r = view.getBoundingClientRect();
          const x = clientX - r.left;
          const y = clientY - r.top;
          lastOverX = x;
          lastOverY = y;

          const over = x >= 0 && y >= 0 && x <= r.width && y <= r.height;

          if (over) {
            clearPromptHold();
          }
          view.classList.toggle("is-over", over);

          if (over) {
            if (!overInView) {
              overInView = true;

              hideGhost(true);
              setHUD(dragging.it);
              setPanel(dragging.it);

              bigWrap.style.left = x + "px";
              bigWrap.style.top = y + "px";

              showBig(dragging.it, () => {
                if (!dragging || !overInView) return;
                applyFX(dragging.it, lastOverX, lastOverY);
              });
            }
            scheduleBigMove(x, y);
          } else {
            if (overInView) {
              overInView = false;
              holdPromptReturn();
              setPanel(null);
              if (moveRAF) {
                cancelAnimationFrame(moveRAF);
                moveRAF = 0;
              }
              hideProFX(true);
              hideBadFX(true);
              hideBig(true);
              showGhost(dragging.it);
            }
          }
        }

        (async () => {
          const noiseUrl = makeNoiseDataURL(128);
          fxProDither.style.setProperty("--noise-url", `url("${noiseUrl}")`);
          fxProDither.style.setProperty("--noise-size", `${PRO_NOISE_SCALE}px`);

          nPosX = Math.random() * PRO_NOISE_SCALE;
          nPosY = Math.random() * PRO_NOISE_SCALE;

          await masksPrefetchPromise.catch(() => {});

          hideProFX(true);
          hideBadFX(true);

          setHUD(null);
          setPanel(null);
          hideGhost(true);
          hideBig(true);

          startT = performance.now();
          drawBase(performance.now());
        })();
      } catch (err) {
        root.innerHTML = `<link rel="stylesheet" href="${safetyCssHref}"><div class="safety-widget-error">
          El widget ha fallado por un error de JavaScript. Abre la consola para ver el detalle.
        </div>`;
        console.error("[Eclipse widget] Error:", err);
      }
    })();
