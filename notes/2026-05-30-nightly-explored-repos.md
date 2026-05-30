---
nombre: Exploración nocturna repos Ntizar — 30 mayo 2026
tipo: exploración-autónoma
fecha: 2026-05-30
estado: completada
---

# Exploración Nocturna — Repos Ntizar (30 mayo 2026)

## Resumen

Esta noche se exploraron 26 repos públicos del usuario Ntizar en GitHub, con foco en los más activos y con mayor valor técnico. Se identificaron patrones arquitectónicos reutilizables, se generaron 3 nuevos skills y se actualizó memoria del sistema.

## Repos Explorados

### 1. FreeHands (Python, MVP desktop+web)
- **URL:** https://github.com/Ntizar/FreeHands
- **Descripción:** Control de PC multimodal sin manos: gaze + gestures + voice
- **Stack:** Python 3.11+, MediaPipe, PyAutoGUI, PyQt6, faster-whisper
- **Arquitectura clave:** State machine anti-falsos-positivos (IDLE→ACTIVE→CONFIRMING→COOLDOWN), GestureStabilizer multi-frame, MultimodalFusion con channel priority, Pydantic profiles con migration/repair
- **Patrones descubiertos:**
  - Anti-false-positive layering (3 capas)
  - Per-gesture calibration thresholds
  - Profile migration + invariant repair
  - Channel priority conflict resolution
- **Skill existente:** `freehands-multimodal-control` (ya actualizado)

### 2. Ntizar-Aurora v5.1 "Constellation" (CSS, 177KB total)
- **URL:** https://github.com/Ntizar/Ntizar-Aurora
- **Descripción:** Design system CSS-only con Liquid Glass real, OKLCH, multi-axis theming
- **11 archivos CSS:** core + 10 packs opt-in (themes, data, charts, maps, viz, motion, forms, ui, patterns, next)
- **Patrones clave:**
  - Scoped bajo `.nz` (no collisiona con otros sistemas)
  - Customization via `data-*` attributes (theme, skin, shape, density, motion, color-system)
  - Liquid Glass real: specular highlight, chromatic edge, dual inset shadow, conic gradient
  - OKLCH color system con scales 50-900 derivadas de hue+chroma
  - Agent-ready: AGENTS.md + INDEX.md para consumo eficiente por IA (~5k tokens)
  - CDN público jsDelivr, versionado pinning
  - Design.md spec con lint WCAG + export Tailwind/DTCG

### 3. NtizarBrainMasterMind v3 (OpenCode + Obsidian)
- **URL:** https://github.com/Ntizar/NtizarBrainMasterMind
- **Descripción:** Framework multi-agente con 11 agentes especializados, memoria Ebbinghaus, arquitectura de dos capas
- **Patrones clave:**
  - Dos capas sin duplicación: Obsidian (documentación rica) + OpenCode (ejecución mínima)
  - 42% reducción de tokens vs v2
  - Pipeline adaptativo según complejidad (3 flujos: simple/medio/complejo)
  - Memoria con decaimiento Ebbinghaus R(t) = a/(log(t+1))^b + c
  - Asignación multi-modelo por agente (Opus para crítico, Haiku para sintetizador)
  - Regla del Crítico: nunca se degrada, se omite si no hay modelo suficiente
- **Skill existente:** `ntizar-mastermind-v3`

### 4. SolMAD (TypeScript, React, Leaflet)
- **URL:** https://solmad.vercel.app
- **Descripción:** Buscador 3D de terrazas con sol en tiempo real en Madrid (6.200+ terrazas)
- **Stack:** Vite + React + TypeScript, Leaflet, SunCalc, Web Workers + Comlink, Three.js, Zustand
- **Patrones clave:**
  - Web Worker + Comlink para cálculos de sombras sin bloquear UI
  - Grid spatial index con visitToken (evita Set en Web Workers)
  - Ray casting contra segmentos de fachada OSM
  - Cache solar multi-capa: localStorage + API Vercel + precompute batch
  - Progresión de carga priorizada (seleccionada → cercanas → visibles)
  - Datos del Ayuntamiento de Madrid (EPSG:25830 → WGS84)
- **Skill nuevo:** `solar-shadow-computation`

### 5. SistemaEléctricoFuturo v3.1 (JavaScript, Vanilla)
- **URL:** https://ntizar.github.io/SistemaElectricoFuturo/
- **Descripción:** Simulador interactivo del sistema eléctrico español 2026-2035
- **Stack:** Vanilla JS, HTML, CSS (Ntizar Aurora), Plotly.js
- **17 escenarios** realistas para España
- **Patrones clave:**
  - Orden de mérito SRMC stack (12 tecnologías)
  - Simulación 8.760 horas con weather series + demand per-sector
  - Degradación de baterías (2% por 365 ciclos)
  - Trajectory state persistence entre años
  - Monte Carlo simulation
  - Política energética: tope ibérico, CfDs, peajes dinámicos, PVPC
- **Skill nuevo:** `electric-system-simulator`

### 6. datos-gob-watch (Node.js, GitHub Pages)
- **URL:** https://ntizar.github.io/datos-gob-watch/
- **Descripción:** Radar semanal de datasets interesantes de datos.gob.es
- **Stack:** Node.js, HTML plano, CSS, GitHub Actions
- **Patrones clave:**
  - Fetch API externa → normalización → scoring heurístico → JSON → HTML estático
  - Scoring: formatos reutilizables (+10), temáticas producto (+12), distribuciones (+8)
  - Paginación API con break condition
  - GitHub Actions semanal (cron lunes 08:00 UTC)
  - Normalización multilingüe (preferir español)
  - URI tail → label legible
- **Skill nuevo:** `static-digest-pipeline`

### 7. IRPFdibujitos (Python + Vanilla Web)
- **URL:** https://ntizar.github.io/IRPFdibujitos/
- **Descripción:** Web divulgativa sobre IRPF España 2012-2026 + progresividad en frío
- **Stack:** Python (motor) + vanilla HTML/CSS/JS (web)
- **Patrones clave:**
  - Motor Python calcula parámetros normativos → JSON precalculados
  - Web vanilla (cero npm, cero build) consume JSON
  - Licencia dual: código MIT, contenido CC0 1.0
  - Convocatoria abierta a fiscalistas para auditoría del código
  - Gráfica de progresividad en frío (tramos no deflactados)
  - 47 tests pytest en motor Python

## Repos Adicionales Explorados

| Repo | Lenguaje | Descripción |
|------|----------|-------------|
| XVLegislatura | JavaScript | Atlas D3.js estructura Gobierno España XV Legislatura |
| Accidentes2024 | JavaScript | Dashboard accidentes con víctimas España 2024 |
| OrbitMixer | JavaScript | Comparador imágenes satelitales Sentinel |
| MonteCarloInversion | JavaScript | Simulación Monte Carlo inversiones |
| MetalHoverLab | JavaScript | Playground metal hover effects |
| FamilyTree | HTML | Editor visual árboles genealógicos Aurora |
| weekPlan | JavaScript | Planificador semanal |
| Rumby | TypeScript | Proyecto TypeScript |
| hackaton1 | Python | Hackathon project |
| rail-lidar-qa-mvp | Python | QA MVP LiDAR railway |
| YoloConteo | Python | Contador de personas |
| Voynich_Solving | Python | Desciframiento Manuscrito Voynich |
| empleady | CSS | Proyecto CSS |
| farosspain | HTML | Proyecto HTML |
| lopezaesthetics | HTML | Proyecto HTML |
| PacManMadrid | JavaScript | Pac-Man Madrid |
| nap-dashboard | TypeScript | Dashboard React + Vite |
| inicio-en-nan | Markdown | Guía NaN.builders |

## Patrones Transversales Identificados

### 1. Design System Unificado
Todos los proyectos frontend usan Ntizar Aurora (CSS-only, scoped `.nz`, data attributes). Es el pegamento visual del ecosistema.

### 2. Vanilla-First
Múltiples proyectos (SistemaElectricoFuturo, IRPFdibujitos web, datos-gob-watch) usan vanilla JS/HTML/CSS sin frameworks, sin build step, sin npm. Filosofía: "cero excusas".

### 3. GitHub Pages como Deploy Target
Mínimo 5 proyectos usan GitHub Pages: datos-gob-watch, IRPFdibujitos, FreeHands (duck test), SolMAD (Vercel), SistemaElectricoFuturo.

### 4. Licencias Abiertas
- Código: casi siempre MIT
- Contenido/datos: CC0 1.0 (IRPFdibujitos)
- Convocatoria abierta a contribución

### 5. Agent-Ready Documentation
Aurora tiene AGENTS.md optimizado para consumo por IA (~5k tokens en vez de 50k). Este patrón se extiende a otros repos.

## Skills Creados Esta Noche

1. **solar-shadow-computation** — Patrón Web Worker + Comlink + grid spatial index + ray casting solar
2. **static-digest-pipeline** — Pipeline fetch→normalize→score→JSON→HTML→GitHub Pages
3. **electric-system-simulator** — SRMC order-of-merit, 8760h simulation, trajectory persistence

## Skills Existentes Actualizados

- `freehands-multimodal-control` — Ya existente, ya cubre FreeHands
- `ntizar-mastermind-v3` — Ya existente, cubre NtizarBrainMasterMind

## Memoria del Sistema Actualizada

Se guardaron en memoria los patrones clave del ecosistema Ntizar.
