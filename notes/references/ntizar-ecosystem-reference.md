# Ntizar Ecosystem — System Reference

## Overview
- **User:** Ntizar (David Antizar) — Ingeniero de Caminos, AI Builder
- **Created:** 2023-06-15
- **Public repos:** 26
- **Bio:** "Castillos en el aire, pero con buenos cimientos 🏗️🤖"

## Design System
- **Aurora v5.1 Constellation** — CSS-only design system, blue(#2563eb) + orange(#f97316) identity
- **CDN:** jsDelivr público
- **11 packs** stateless e idempotentes
- **Multi-axis theming:** shape, density, motion, color-system(OKLCH)
- **6 skins:** aurora, sunset, midnight, ocean, citrus, contrast(AAA)
- **Agent-ready:** AGENTS.md + CDN para ahorrar tokens de IA
- **Nightly pipeline:** mejora continua automática nocturna

## Top Repos by Stars
| Repo | Stars | Language | Description |
|------|-------|----------|-------------|
| solmad | 3 | TypeScript | Buscador 3D terrazas con sol Madrid |
| NtizarBrainMasterMind | 2 | CSS | Multi-agent orchestration (OpenCode+Obsidian) |
| IRPFdibujitos | 1 | Python | Calculadora IRPF + progresividad en frío |
| OrbitMixer | 1 | JavaScript | Comparador imágenes satelitales Sentinel-2 |
| nap-dashboard | 1 | TypeScript | Dashboard transporte público español (GTFS) |
| SistemaElectricoFuturo | 1 | JavaScript | Simulador sistema eléctrico 2026-2035 |

## Common Patterns Across Projects
1. **Vanilla-first:** HTML/JS vanilla cuando es posible, React/Vue solo cuando necesario
2. **CDN público:** Aurora, demos, todo en CDN/jsDelivr
3. **GitHub Pages:** deploy estático como plataforma principal
4. **Ntizar Aurora:** design system unificado en TODOS los proyectos frontend
5. **Datos públicos españoles:** datos.gob.es, REE, Ayuntamiento Madrid, NAP
6. **Sin build system:** Vite solo cuando es necesario
7. **Web Workers + Comlink:** patrón recurrente para cálculos pesados
8. **Serverless functions:** Vercel para API backend ligero
9. **State management:** Zustand (solmad, nap-dashboard)
10. **Documentación extensa:** README.md con arquitectura, stack, uso

## Key Technologies
- **Frontend:** React, TypeScript, Vite, Tailwind, Leaflet, Three.js, Vue 3 CDN, Plotly.js
- **Backend:** Vercel Serverless Functions (Node.js)
- **Computer Vision:** MediaPipe (Hands, FaceMesh), WebGazer, faster-whisper
- **Data:** fflate (ZIP), CSV parsing, GTFS, Overpass API, SunCalc
- **State:** Zustand, Pydantic profiles
- **UI:** PyQt6 (desktop), HTML/CSS (web)
- **Testing:** Duck test (end-to-end verification page)

## Data Sources
- **datos.gob.es** — Catálogo de datos abiertos españoles
- **REE/ESIOS** — Mercado eléctrico español
- **Ayuntamiento de Madrid** — Censo de terrazas
- **NAP** — Transporte público español (GTFS)
- **OpenStreetMap/Overpass** — Geometría de edificios
- **Sentinel-2** — Imágenes satelitales (Earth Search STAC)
- **ENRESA** — Calendario nuclear español

## Skills Created from Exploration
1. `electric-system-order-of-merit` — Simulador energético con orden de mérito SRMC
2. `gtfs-browser-parser` — Parser GTFS en navegador sin servidor
3. `mastermind-multi-agent-orchestration` — Orquestación multi-agente v3
4. `solmad-solar-terrace-pattern` — Patrón de cálculo solar en terrazas

## Skills Already Existing (Updated)
- `liquid-glass-css` — Contains Aurora info
- `freehands-multimodal-control` — Already updated with architecture details
