# 🎓 Graduation Experience 2026 — Daniel Silva

> **Landing page cinematográfica** para la graduación de Daniel Silva como Ingeniero en Sistemas.
> Inspirada en Apple, Stripe, Vercel, Linear, Framer, Raycast, VisionOS y Tron Legacy.

---

## 🚀 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| CSS (Vanilla) | Diseño, animaciones, responsive |
| JavaScript ES2025 | Módulos, lógica |
| Three.js r169 | Esfera holográfica 3D |
| GSAP 3.12 | Animaciones cinematográficas |
| Lenis 1.1 | Smooth scroll |
| Canvas API | Partículas de fondo |
| Web Audio API | Música generativa |

---

## 📁 Estructura

```
graduacion-2026/
├── index.html              ← Página principal
├── site.webmanifest        ← PWA manifest
├── robots.txt              ← SEO
├── sitemap.xml             ← SEO
├── assets/
│   ├── img/og-image.png    ← Open Graph image
│   └── icons/favicon.svg   ← Favicon SVG
├── css/
│   ├── variables.css       ← Design tokens
│   ├── animations.css      ← Keyframes
│   ├── components.css      ← UI components
│   ├── cursor.css          ← Custom cursor
│   ├── responsive.css      ← Mobile-first breakpoints
│   └── style.css           ← Stylesheet principal
└── js/
    ├── utils.js            ← Helpers
    ├── loader.js           ← Intro SYSTEM UPDATE
    ├── sphere.js           ← Three.js sphere
    ├── particles.js        ← Canvas particles
    ├── cursor.js           ← Glow cursor
    ├── scroll.js           ← Lenis + parallax
    ├── timeline.js         ← Timeline reveal
    ├── countdown.js        ← Cuenta regresiva
    ├── music.js            ← Web Audio ambient
    ├── whatsapp.js         ← Confirmación WA
    └── main.js             ← Orquestador + CONFIG
```

---

## ⚙️ Configuración

Editar `js/main.js` → objeto `CONFIG`:

```js
export const CONFIG = {
  name:        'Daniel Silva',
  title:       'Ingeniero en Sistemas',
  date:        '2026-11-23T09:00:00-05:00',
  restaurant:  'El Grán Balcón',
  address:     'Cra 13 N° 18 - 37',
  mapsUrl:     'https://maps.google.com/...',
  whatsapp:    '+57 3115120652',
  facebookLive:'https://www.facebook.com/unisangilchiquinquira/?locale=es_LA',
};
```

---

## 🌐 Deploy en GitHub Pages

1. Crear repositorio en GitHub
2. Subir todos los archivos
3. Settings → Pages → Branch: `main` / `root`
4. Acceder en `https://<usuario>.github.io/<repo>/`

---

## 🎨 Paleta de Colores

| Token | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#050816` | Fondo principal |
| `--cyan` | `#00F5FF` | Acento principal, glow |
| `--blue` | `#3A86FF` | Acento secundario |
| `--teal` | `#64FFDA` | Detalles, textos acento |
| `--purple` | `#7B2CBF` | Elementos terciarios |

---

## ✅ Checklist de Características

- [x] Intro cinematográfica SYSTEM UPDATE (~4s)
- [x] Esfera holográfica Three.js con partículas
- [x] Canvas de partículas conectadas con repulsión de mouse
- [x] Cursor glow personalizado con lerp suave
- [x] Smooth scroll con Lenis
- [x] Storytelling con frases animadas en scroll
- [x] Invitación con glassmorphism
- [x] Timeline interactivo (Ceremonia + Cena + Celebración)
- [x] Badge LIVE animado
- [x] Cuenta regresiva en tiempo real con flip animation
- [x] Confirmación por WhatsApp con mensaje pre-cargado
- [x] Música generativa (Web Audio API, sin archivos externos)
- [x] Cierre "Mission Accomplished"
- [x] SEO completo (meta, OG, Twitter Cards, structured data)
- [x] Web manifest + favicon SVG
- [x] WCAG AA accesible (aria-labels, focus-visible, reduced-motion)
- [x] Mobile-first responsive
- [x] Código modular, comentado, sin duplicación

---

*Daniel Silva · System Engineer · Version 5.0 · 2026*
