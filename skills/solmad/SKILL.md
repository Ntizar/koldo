# SolMAD — Buscador de Terrazas con Sol en Madrid

## Qué es
Web que cruza censo de terrazas de Madrid con posición del sol y sombras de edificios OSM. Encuentra terrazas con sol directo ahora mismo.

## Stack
- **Build:** Vite + React + TypeScript
- **Mapa:** Leaflet + Leaflet.markercluster
- **Tiles:** CARTO Voyager / OSM / HOT (libres, sin tokens)
- **Solar:** SunCalc
- **Estado:** Zustand
- **UI:** Tailwind
- **Workers:** Web Workers + Comlink
- **3D:** Three.js (intro cinematográfica)
- **Deploy:** Vercel

## Datos
- **Terrazas:** Ayuntamiento de Madrid (CC BY 4.0) — 6,200+
- **Edificios:** OpenStreetMap (ODbL) via Overpass API
- **Tiles:** CARTO / OSM / HOT

## Cálculo de Sombras
1. Cargar terrazas oficiales
2. Descargar footprints OSM por zona visible (no todo Madrid)
3. Estimar alturas: `height`, `building:levels * 3.2m`, fallback 10m
4. Indexar fachadas en grid dentro de Web Worker
5. Ray casting: terraza → sol, verificar obstáculos
6. Repetir en pasos de tiempo para estimar sol restante
7. Cache: localStorage + data/sun-cache.json via API

## Funcionalidades
- Mapa con 6,200+ terrazas marcadas
- Cálculo de sol directo en tiempo real
- Slider de hora con presets y +/-15 min
- Clasificación: sol, sombra, noche
- Ficha: horario, mesas, sillas, superficie, Google Maps
- Botón "Sorpresa" para selección aleatoria
- Geolocalización con gesto explícito
- Priorización: bar seleccionado → cercanas → visibles

## Contribuciones
- Rama review: `solmad/review-contributions`
- PR automático via GitHub API
- Token: `SOLMAD_GITHUB_TOKEN` (secreto Vercel)

## Variables de Entorno Vercel
```
SOLMAD_GITHUB_TOKEN=token_contents_write
GITHUB_OWNER=Ntizar
GITHUB_REPO=solmad
GITHUB_BRANCH=main
CONTRIBUTIONS_PATH=data/contributions.json
SUN_CACHE_PATH=data/sun-cache.json
REVIEW_EMAIL=email
```

## Limitaciones Actuales
- No considera arbolado, toldos, sombrillas, soportales
- Overpass puede devolver menos edificios si lento
- Pendiente: precalculo offline, arbolado, toldos, favoritas, PWA

## Referencias
- Web: https://solmad.vercel.app
- Repo: https://github.com/Ntizar/solmad
