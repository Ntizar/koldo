# OrbitMixer — Comparador Satelital con IA

## Qué es
Comparador de imágenes satelitales Sentinel-2 para cualquier lugar de la Tierra. Split before/after, control por gestos, explicación IA en español.

## Stack
- **Frontend:** Vanilla HTML/CSS/JS (sin build step)
- **Backend:** Vercel Serverless Functions (Node 20, CommonJS)
- **Identidad:** Ntizar Aurora

## APIs Gratuitas (100% free por defecto)
| Servicio | Uso | Coste |
|----------|-----|-------|
| Mapbox GL JS | Globe basemap | Free (token público) |
| Earth Search STAC | Sentinel-2 scenes | Free, sin key |
| TiTiler.xyz | COG → PNG render | Free, sin key |
| OpenTopoData | Elevation DEM | Free, sin key |
| Nominatim (OSM) | Reverse geocoding | Free, sin key |
| MediaPipe Hands | Hand tracking | Free (CDN) |
| OpenRouter | AI vision (optional) | Optional |

## Endpoints
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| GET | `/api/health` | - | Liveness probe |
| GET | `/api/config` | - | Public config (Mapbox token, aiEnabled) |
| GET | `/api/territory?lat&lon&lang=es` | - | Nominatim reverse geocode |
| POST | `/api/compare` | `{lat, lon, date_from, date_to, mode, layer}` | PNGs before/after + AI analysis |

## Gestos (MediaPipe Hands)
| Gesto | Modo Mapa | Modo Comparador |
|-------|-----------|-----------------|
| ☝️ Índice | Mover cursor | Mover cursor |
| 🤏 Pinch | Drag (pan) | — |
| ✌️ V up | Zoom in | Split right |
| ✌️ V down | Zoom out | Split left |
| 👍 Thumbs-up 5s | Lock area + comparar | Lock area + comparar |

## Variables de Entorno
```
MAPBOX_PUBLIC_TOKEN=pk.xxx          # requerido
OPENROUTER_API_KEY=                 # opcional
OPENROUTER_MODEL=google/gemini-2.5-flash-image
SENTINEL_HUB_INSTANCE_ID=           # opcional (capas espectrales)
```

## Features
- Globe interactivo para seleccionar ubicación
- Date pills para Before/Now
- Analysis modes: vegetation, fire, water, urban, natural color, elevation
- Split card: before/after con drag o range input
- AI card: explicación de cambios, causas probables, magnitud, recomendación
- Territory card: lugar, región, país
- Webcam card: hand tracking con thumbs-up hold

## Deploy
```bash
npm install
npx vercel link
npx vercel pull
npm run dev
npm run deploy  # --prod
```

## Referencias
- Repo: https://github.com/Ntizar/OrbitMixer
