---
name: orbitmixer-satellite-compare
description: "OrbitViewer - Comparador de imágenes satelitales Sentinel-2 con split viewer, control por gestos y explicación IA en español."
version: "1.0.0"
category: geospatial
---

# OrbitViewer - Satellite Image Comparator

Comparador de imágenes satelitales Sentinel-2 con split viewer y control por gestos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Vanilla HTML/CSS/JS (sin build) |
| Backend | Vercel Serverless Functions (Node 20, CommonJS) |
| Globe | Mapbox GL JS (token público, free tier) |
| Satellite | Earth Search STAC (AWS, free) |
| Render | TiTiler.xyz COG→PNG (free) |
| Elevation | OpenTopoData DEM (free) |
| Geocoding | Nominatim/OSM (free) |
| Gestures | MediaPipe Hands (CDN) |
| AI Vision | OpenRouter (optional, Google Gemini) |

## 100% Free APIs

| Servicio | Coste |
|----------|-------|
| Earth Search STAC | Free, no key |
| TiTiler.xyz | Free, no key |
| OpenTopoData | Free, no key |
| Nominatim | Free, no key |
| MediaPipe Hands | Free |
| AI Vision | Optional (OpenRouter key) |

## Environment Variables

```bash
MAPBOX_PUBLIC_TOKEN=***          # required (browser-safe)
OPENROUTER_API_KEY=***           # optional (AI vision)
TILESET_ID=***                   # optional (custom tileset)
```

## Architecture

```
public/
  app.js          -> Main app logic
  gestures.js     -> MediaPipe hand tracking
  i18n.js         -> Internationalization
  index.html      -> SPA entry point
  orbitmixer.css  -> Ntizar Aurora styling

api/
  compare.js      -> Satellite image comparison
  config.js       -> Configuration
  health.js       -> Health check
  territory.js    -> Territory/geocoding
```

## Features

- Split before/after viewer
- Hand-gesture control (MediaPipe)
- AI vision explanation in Spanish
- Real Sentinel-2 imagery
- Elevation data (DEM)
- Reverse geocoding
- Ntizar Aurora visual identity

## Visual Identity

- Glass surfaces
- Blue → orange gradients
- Inter + JetBrains Mono fonts
- Ntizar Aurora v5.1

## Repositorio

https://github.com/Ntizar/OrbitMixer

## Aplicación práctica

Reutilizar para:
- Comparación temporal de imágenes satelitales
- Monitoreo de cambios en territorios
- Visualización geoespacial con control por gestos
- Proyectos que necesiten STAC + COG + TiTiler
