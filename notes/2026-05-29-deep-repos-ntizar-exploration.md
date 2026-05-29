# Exploración Profunda de Repos Ntizar — 29/05/2026

## Contexto
Segunda ronda de exploración autónoma: esta vez se hicieron análisis profundos (README completo, estructura de archivos, código clave) de los repos más relevantes del usuario Ntizar, no solo listados superficiales.

## 26 Repos Propios de Ntizar — Clasificación Profunda

### 🏆 Tier 1: Proyectos Tecnológicamente Significativos

#### 1. solmad (3⭐) — Buscador 3D de Terrazas con Sol en Madrid
- **Stack:** Vite + React + TypeScript + Leaflet + SunCalc + Three.js + Zustand + Tailwind + Comlink (Web Workers)
- **Innovación técnica:** Web Workers con Comlink para cálculos de sombras sin bloquear UI. Precomputación solar con cache GitHub. 6.200+ terrazas del censo municipal.
- **Arquitectura:** `src/workers/shadows.worker.ts` — SegIndex con spatial hashing grid (60px cells) para ray-casting eficiente sobre edificios OSM. Mapeo de coordenadas geo a metros con mPerDegLng/Lat.
- **Contribuciones:** PRs automáticos vía API GitHub (token Vercel), rama review `solmad/review-contributions`
- **Deploy:** Vercel con edge functions (`/api/contribute`, `/api/sun-cache`)
- **Lección clave:** Web Workers + Comlink = cálculos pesados sin jank. Spatial hashing para ray-casting sobre miles de polígonos.

#### 2. NtizarBrainMasterMind (2⭐) — Orquestación Multi-Agente v3
- **Arquitectura de 2 capas:** Documental (Obsidian `.md`) + Ejecutable (`.opencode/` YAML). Reducción de 42% en tokens del layer ejecutable.
- **11 Agentes especializados:** Orchestrator → Explorer → Planner → Spec Writer → Implementer → Reviewer → Critic → Synthesizer → Archiver → Librarian
- **3 flujos adaptativos:** Corto (4 agentes), Medio (6), Largo (10) según complejidad 1-5
- **Memoria Ebbinghaus:** `R(t) = a/(log(t+1))^b + c` con 4 tipos de decay (permanente, lento, normal, rápido). Protocolo de carga bajo demanda: solo cargar learnings con R(t) > 0.3
- **Librarian agent:** Mantiene salud documental, detecta skills con reaprendizaje activo, propone archivado por decay
- **Archiver agent:** Formato v2 con clusters, proyectos, patrones, conexiones wikilink
- **Lección clave:** Separación documental/ejecutable es clave para token efficiency. Carga bajo demanda de memoria > memoria siempre en contexto.

#### 3. FreeHands (0⭐) — Control PC con Ojos/Manos/Voz
- **Stack:** Python 3.11+ + PyQt6 + MediaPipe + WebGazer.js
- **Pipeline:** Capture → GazeTracker → HandTracker → Fusion (state machine) → ActionDispatcher → Overlay
- **Fine Aim Pointer:** deque de muestras con ventana temporal, centroid estable, alpha blending suave
- **Gestures:** Índice=click izq, Medio=click der, Index+Medio=double click, Ambas manos=zoom, Palma derecha 2s=toggle pause
- **Safety:** Palma abierta derecha 2s = kill switch siempre accesible
- **Arquitectura modular:** `src/freehands/actions/`, `capture/`, `fusion/`, `gaze/`, `gestures/`, `profiles/`, `ui/`, `voice/`
- **Lección clave:** State machine para fusion multimodal. Fine aim con ventana temporal y centroid. Kill switch físico siempre disponible.

#### 4. Ntizar-Aurora (0⭐) — Design System v5.1 Constellation
- **10 packs opcionales:** core, themes, data, charts, maps, viz, motion, forms, ui, patterns + next.css (v5)
- **6 Skins:** aurora, sunset, midnight, ocean, citrus, contrast (WCAG AAA)
- **Multi-axis theming:** `data-nz-theme`, `data-nz-skin`, `data-nz-shape`, `data-nz-density`, `data-nz-motion`, `data-nz-color-system`
- **Liquid Glass real:** specular highlight + chromatic edge + dual inset shadow + saturate backdrop (v5)
- **Agent-ready:** AGENTS.md + INDEX.md (~5k tokens vs 50k del CSS completo). CDN jsDelivr público
- **Drop-in files:** copilot-instructions.md, CLAUDE.md, .cursor/rules/aurora.mdc
- **Lección clave:** Nunca pegar CSS en prompts. AGENTS.md como fuente de verdad para agentes. CDN pin con version tag.

### 🥈 Tier 2: Proyectos Interesantes

#### 5. SistemaElectricoFuturo (1⭐) — Simulador Eléctrico España 2026-2035
- **17 escenarios:** cierre ENRESA, VE masivo, autoconsumo 30GW, crisis gas, sequías, ola calor
- **8.760 horas simulación** con trayectoria multianual, degradación baterías, calendario nuclear real
- **Métricas:** horas sin gas, estrés red, LCOE, LCOS, coste del sistema
- **Arquitectura:** constants → demand/storage/policy/weather → simulator → trajectory → charts → app

#### 6. IRPFdibujitos (1⭐) — Calculadora IRPF 2012-2026
- **Progresividad en frío:** tramos no actualizados con IPC → pagas más IRPF nominalmente
- **Vanilla HTML/JS** — cero npm, cero build
- **Código MIT, datos CC0** — auditable por fiscalistas
- **Lección clave:** Problemas españoles reales + visualización simple = impacto viral

#### 7. nap-dashboard (1⭐) — Dashboard GTFS Transporte España
- **Parsing GTFS en navegador:** fflate descompresión en memoria, detección encoding, tolerancia a malformados
- **Calendario semanal GTFS completo:** calendar_dates.txt > calendar.txt lógica
- **100K cap en stop_times** para no bloquear hilo principal
- **Tipos de ruta europeos extendidos** (NeTEx 100-1700)

#### 8. datos-gob-watch (0⭐) — Weekly Digest datos.gob.es
- **Pattern:** Node.js script → GitHub Actions → GitHub Pages
- **Heurísticas de ranking:** formatos reutilizables (JSON, CSV, GEOJSON), temáticas con potencial producto
- **Cron semanal:** `0 7 * * 1` (lunes 7am)
- **Lección clave:** Pattern reutilizable para cualquier fuente de datos pública periódica

### 🥉 Tier 3: Proyectos Creativos y Experimentales

#### 9. FamilyTree (0⭐) — Editor Árbol Genealógico
- **Motor de parentesco canonico:** father, mother, untypedParents, partners, manualPosition
- **Reglas de integridad:** sin duplicar, sin autociclos, simetría obligatoria
- **Layout por generaciones** con rail familiar ortogonal
- **Export JSON con timestamp** en nombre de archivo

#### 10. MetalHoverLab (0⭐) — Playground Relieves Metálicos
- **Canvas-based:** luminancia → relieve → cursor light → metalización
- **Export HTML/React/Next** autocontenido
- **Presets reales:** Bisonte I, Bisonte II

#### 11. XVLegislatura (0⭐) — Atlas Gobierno España
- **D3.js + Ntizar CSS** — estructura orgánica 22 ministerios
- **Atlas interactivo** de la XV Legislatura

#### 12. MonteCarloInversion (0⭐) — Simulador Monte Carlo
- **Escenarios heurísticos** para inversiones
- **Patrones ya capturados** en skill `forecast-montecarlo-escenarios`

## Patrones Globales Identificados

### Patrón de Arquitectura de Proyectos Ntizar
1. **Datos españoles abiertos** → ESIOS, datos.gob.es, GTFS, PNOA, ministerios
2. **Problemas reales españoles** → sistema eléctrico, transporte, IRPF, accidentes, terrazas
3. **Ntizar Aurora** como sistema de diseño unificador (azul + naranja)
4. **Frontend-first**: HTML/CSS/JS vanilla o React/Vite, deploy en GitHub Pages/Vercel
5. **Open source** con licencia MIT, datos CC0 cuando aplica
6. **Sin backend propio** cuando es posible: edge functions, GitHub API, CDN

### Patrón de Intereses
1. **Transporte/GTFS** (11 repos propios + 4 externos)
2. **Energía española** (ESIOS, sistema eléctrico futuro)
3. **Visión por computadora** (FreeHands, rail-lidar, YoloConteo)
4. **Diseño UI/UX** (Aurora, Liquid Glass, estilos)
5. **Agentes IA** (MasterMind, Orca, Kanvas)
6. **Datos abiertos** (datos.gob.es watch, GTFS, accidentes)

### Patrones Técnicos Repetibles
1. **Web Workers + Comlink** para cálculos pesados sin bloquear UI
2. **Precomputación + cache** (solmad: solar precomputed, sun cache)
3. **GitHub API como backend** (contribuciones, cache, deploy)
4. **GitHub Actions + Pages** para deploy estático automatizado
5. **Parsing tolerante** (GTFS: try/catch por fila, encoding detection)
6. **State machines** para sistemas multimodales (FreeHands fusion)
7. **Spatial indexing** (SegIndex grid hashing para ray-casting)
8. **Ebbinghaus decay** para gestión de memoria/contexto

## Comparativa con Skills Existentes

### liquid-glass-css
- **Ya cubre** las bases de Aurora (tokens, skins, CDN)
- **Falta actualizar con:** v5.1 Constellation, 10 packs completos, multi-axis theming, liquid glass real, AGENTS.md pattern, drop-in files para AI tooling
- **Decisión:** Actualizar skill con los detalles de v5.1

### multi-agent-orchestration
- **Ya cubre** Orca y Kanvas superficialmente
- **Falta incluir:** Ntizar MasterMind v3 con sus 11 agentes, Ebbinghaus decay, 2-layer architecture, 3 adaptive flows, librarian/archiver protocols
- **Decisión:** Actualizar skill con detalles de MasterMind v3

### Nuevas skills a crear
- `datos-gob-watch-pattern` — Pattern de digest periódico de datos abiertos
- `web-workers-comlink` — Patrón de Web Workers con Comlink para cálculos pesados
- `gtfs-browser-parsing` — Patrón de parsing GTFS en navegador con fflate

## Archivos Existentes Relevantes del Sistema Koldo
- `/opt/koldo/skills/liquid-glass-css/SKILL.md` — Actualizar con v5.1
- `/opt/koldo/skills/devops/multi-agent-orchestration/SKILL.md` — Actualizar con MasterMind v3
- `/opt/koldo/skills/data/` — skills de datos existentes
- `/opt/koldo/skills/frontend/` — skills frontend existentes
- `/opt/koldo/notes/2026-05-28-starred-repos-autonomous-learning.md` — Primera ronda (superficial)
