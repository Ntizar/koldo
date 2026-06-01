---
name: madrid-3pixel
description: "Madrid 3Pixel — visor isométrico de Madrid en píxel art con sistema de tiles, 7 fases día/noche, efecto nieve/lluvia/niebla, y edificios 3D de Madrid. Aurora v5.1 CSS."
version: 0.1.0
author: Ntizar
tags: [madrid, isometric, pixel-art, map, visualization, aurora]
---

# Madrid 3Pixel

## Repo
`Ntizar/Madrid3Pixel` → **ntizar.github.io/Madrid3Pixel/**

## Stack
- **Visor**: Canvas 2D vanilla JS (image-rendering: pixelated)
- **Proyección**: Isométrica con rotación configurable
- **CSS**: Aurora v5.1 (azul #2563eb + naranja #f97316, liquid glass)
- **Tiles**: Sistema procedural con tipado (ground/building/park/water)
- **Efectos**: Partículas en canvas overlay (nieve, lluvia, niebla)
- **Deploy**: GitHub Pages via Actions

## Estructura
```
Madrid3Pixel/
├── index.html               # HTML con UI Aurora + controles
├── src/css/style.css        # Sistema de diseño Aurora
├── src/js/main.js           # Motor: proyección, tiles, render, partículas
├── src/js/tiles.js          # Generador de tiles placeholder SVG
├── .github/workflows/deploy.yml  # CI/CD GitHub Pages
└── README.md
```

## Funcionalidades clave
- **7 fases de iluminación**: night, dawn, morning, midday, afternoon, sunset, dusk
- **Edificios 3D**: generación procedural con landmarks de Madrid (Sol, Gran Vía, Retiro, Debod...)
- **Río Manzanares**: curva animada con shimmer
- **Metro de Madrid**: 6 líneas coloreadas (L1-L6 circular)
- **Controles**: hora del día, efectos clima (nieve/lluvia/niebla), estilo visual, capas, rotación
- **Respnsive**: soporte táctil (pinch zoom + drag)

## Cómo se usa
```
npx serve . -l 3000    # Dev local
python3 -m http.server 8080  # Alternativa
```
GitHub Pages se deploya automáticamente al hacer push a main.

## Referencia
Inspirado en [isometric.nyc](https://isometric.nyc) por cannoneyed.

## Patrones derivados
- **`references/backdrop-pattern.md`** — Patrón para extraer MADRID_BG como fondo procedural estático detrás de elementos DOM interactivos (árbol genealógico, dashboard, galería). Módulo IIFE autocontenido, ~400 líneas, sin dependencias.
