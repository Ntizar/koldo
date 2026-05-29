# Ntizar Aurora Design System — Usage Guide

## Qué es
Ntizar Aurora v5.1 "Constellation" es un sistema de diseño CSS-only (sin build, sin JS, sin npm) con identidad azul+naranja. Namespace `.nz` para evitar colisiones.

## Instalación rápida
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.themes.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.ui.css">
```

## Uso correcto con IA
**NO** pegar los CSS en el prompt. Usar:
1. `AGENTS.md` + `INDEX.md` como referencia (~20KB)
2. CDN para servir los CSS al navegador
3. Generar solo HTML con clases de Aurora

## 5 reglas no negociables
1. Siempre envolver con `class="nz"` en `<body>` o sección
2. Usar solo clases documentadas en INDEX.md
3. Nunca hardcodear valores (hex, px, rem) — usar tokens `var(--nz-*)`
4. Nunca escribir CSS para cosas que Aurora ya tiene
5. Personalizar via data attributes: `data-nz-theme`, `data-nz-skin`, `data-nz-shape`, `data-nz-density`, `data-nz-motion`

## Packs disponibles
| Pack | Uso |
|------|-----|
| ntizar.css | Core: botones, cards, badges, layout |
| ntizar.themes.css | 5 skins + paletas charts |
| ntizar.data.css | KPIs, progress, skeleton, avatars, timeline |
| ntizar.charts.css | Chart.js / Apex / D3 wrappers |
| ntizar.maps.css | Leaflet / Mapbox / MapLibre styling |
| ntizar.viz.css | three.js stages, aurora backgrounds |
| ntizar.motion.css | Animaciones: reveal, glow-pulse, shimmer |
| ntizar.forms.css | Switch, OTP, file drop, range, stepper |
| ntizar.ui.css | Modal, drawer, tabs, dropdown, toast |
| ntizar.patterns.css | App-shell, hero, pricing, FAQ, footer, auth |
| ntizar.next.css | Liquid glass real, OKLCH, multi-axis, mesh |

## Interactividad (sin JS)
Aurora no incluye JS. Convención:
- Toggle state class en el componente root (ej: `.nz-modal--open`)
- El CSS ya maneja todos los estados visuales

## Versionado
- CDN: `@master` (último) o `@v5.1.0` (pin para producción)
- API sigue semver
- v5.x backward compatible con v4.x

## Referencias
- Repo: https://github.com/Ntizar/Ntizar-Aurora
- CDN: https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/
- Docs: INDEX.md, AGENTS.md, USAGE.md, DESIGN.md, gallery.html
