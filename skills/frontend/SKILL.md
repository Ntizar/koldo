---
name: ntizar-static-web-patterns
description: "Patrones de desarrollo web estático de Ntizar: GitHub Pages, Ntizar Aurora CSS, sin build step, vanilla JS/HTML/CSS, data pipeline con Node.js scripts."
version: "1.0.0"
category: frontend
---

# Ntizar Static Web Patterns

Patrones recurrentes en los proyectos web estáticos de Ntizar.

## Filosofía General

- **Sin build step**: HTML + CSS + JS vanilla siempre que sea posible
- **GitHub Pages** como hosting principal
- **Ntizar Aurora CSS** como design system
- **Datos externos** via scripts Node.js que generan JSON estático
- **Zero dependencies** en frontend (sin npm, sin bundler)

## Patrones Comunes

### 1. Data Pipeline Estático

```
API externa (datos.gob.es, ESIOS, GTFS, etc.)
  -> scripts/fetch.mjs (Node.js)
  -> data/output.json
  -> index.html lee JSON estático
  -> GitHub Pages deploy
```

Ejemplos:
- `datos-gob-watch`: datos.gob.es API → JSON → Pages
- `solmad`: Ayuntamiento Madrid JSON → prepare:data → JSON → Pages
- `Accidentes2024`: Excel → Python → JSON → Pages

### 2. Single HTML App

Un solo `index.html` con CSS y JS inline:
- `weekPlan`
- `lopezaesthetics`
- `farosspain`

### 3. Vite + React Apps

Para proyectos que necesitan React:
- `solmad`: Vite + React + TypeScript + Zustand + Tailwind
- `PacManMadrid`: React + Vite + Mapbox
- `Accidentes2024`: React + Vite
- `Rumby`: Next.js + TypeScript

### 4. GitHub Actions Deploy

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
```

### 5. Ntizar Aurora Integration

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.css">
<body class="nz" data-nz-theme="light">
```

### 6. Leaflet Maps Pattern

```javascript
const map = L.map('map').setView([40.4168, -3.7038], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap contributors © CARTO'
}).addTo(map);
```

Tiles libres: CARTO Voyager, CARTO Light, OSM, HOT

### 7. Web Workers Pattern

Para cálculos pesados sin bloquear UI:
- `solmad`: cálculos de sombras en Web Worker + Comlink
- `MonteCarloInversion`: 5 modelos GBM/Heston en paralelo en Web Workers

### 8. Next.js Modular Pattern

```
src/app/
  api/     -> Serverless functions
  page.tsx -> Pages
docs/     -> Architecture docs
```

Ejemplo: `Rumby` con conectores modulares por ciudad/proveedor.

## Repos de Ejemplo

| Repo | Stack | URL |
|------|-------|-----|
| solmad | Vite+React+TS+Leaflet | solmad.vercel.app |
| farosspain | Vanilla HTML/CSS/JS | GitHub Pages |
| weekPlan | Vanilla HTML/CSS/JS | GitHub Pages |
| MonteCarloInversion | Vanilla JS + Web Workers | GitHub Pages |
| OrbitMixer | Vanilla + Vercel Functions | Vercel |
| Rumby | Next.js + TypeScript | En desarrollo |
| PacManMadrid | React+Vite+Mapbox | GitHub Pages |

## Repositorio de referencia

https://github.com/Ntizar/Ntizar-Aurora (design system)

## Aplicación práctica

Para cualquier proyecto web estático de Ntizar:
1. Empezar con vanilla HTML/CSS/JS + Aurora CSS
2. Usar GitHub Pages para deploy
3. Scripts Node.js para pipelines de datos
4. Leaflet + tiles libres para mapas
5. Web Workers para cálculos pesados
6. Escalar a Vite/React solo si la interactividad lo requiere
