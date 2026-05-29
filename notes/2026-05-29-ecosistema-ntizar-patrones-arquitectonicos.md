# Ecosistema Ntizar — Patrones Arquitectónicos

> **Fecha:** 2026-05-29
> **Tipo:** Exploración autónoma de repositorios
> **Fuente:** GitHub API (repos propios + 50 starred repos)

## Resumen Ejecutivo

El ecosistema Ntizar (David Antizar) se compone de dos mundos complementarios:

1. **Repositorios propios** — Aplicaciones web estáticas con identidad visual Ntizar Aurora, sistemas de orquestación multi-agente, y herramientas de productividad.
2. **Repositorios starred** — Selección curada de herramientas de IA, visualización de datos, transit/GTFS, visión por computadora y diseño.

---

## 1. Repositorios Propios de Ntizar

### NtizarBrainMasterMind (⭐2) — Sistema de Orquestación Multi-Agente
- **Stack:** OpenCode + Obsidian
- **Arquitectura:** Dos capas separadas (documental/obsidian + ejecutable/.opencode)
- **Agentes:** 11 agentes especializados con pipeline de 3-10 agentes según complejidad
- **Modelos:** Asignación multi-modelo (Opus para crítico, Gemini para explorador, Haiku para sintetizador)
- **Memoria:** Curva de decaimiento Ebbinghaus (permanente, lento, normal, rápido)
- **Innovación:** 42% reducción de tokens vs v2 gracias a separación capa documental/ejecutable

### Ntizar-Aurora (⭐0) — Design System CSS-only
- **Versión:** 5.1 "Constellation"
- **Características:** CSS-only, sin build, sin JS, namespaced (.nz), 10 packs opcionales
- **CDN público:** jsDelivr
- **Skins:** aurora, sunset, midnight, ocean, citrus, contrast (6 paletas)
- **Packs:** data, charts, maps, viz, motion, forms, ui, patterns, next
- **Tokens:** OKLCH, multi-axis theming, forced-colors, liquid glass real
- **Agent-ready:** AGENTS.md + INDEX.md (~20KB) para que agentes IA no gasten tokens

### solmad (⭐3) — Buscador 3D de Terrazas con Sol
- **Stack:** Vite + React + TypeScript + Leaflet + SunCalc
- **Web Workers + Comlink** para cálculos de sombras sin bloquear UI
- **Three.js** para intro cinematográfica
- **Zustand** para estado global, Tailwind para UI
- **Datos:** Censo oficial de terrazas de Madrid + OSM

### FreeHands (⭐0) — Control sin manos (gaze + gestures + voice)
- **Stack:** Python 3.11+, webcam, Windows first
- **Tecnologías:** Gaze tracking, gesture recognition, voice commands
- **Seguridad:** Kill switch con palma abierta derecha
- **Web:** Duck test en GitHub Pages (no abre cámara)

### XVLegislatura (⭐0) — Atlas Orgánico del Gobierno de España
- **Stack:** D3.js v7 + Ntizar CSS + HTML/CSS/JS vanilla
- **Datos:** RD 1009/2023, BOE, 22 ministerios, 300+ órganos
- **Visualización:** Mapa radial interactivo, organigramas, buscador

### nap-dashboard (⭐1) — Transportes de España (GTFS)
- **Stack:** React + Vite + TypeScript
- **Feature estrella:** Selector de semana en GTFS Viewer con lógica completa del estándar
- **Datos:** Ministerio de Transportes de España, 2.594 operadores

### FamilyTree (⭐0) — Editor visual de árboles genealógicos
- **Stack:** HTML/CSS/JS vanilla + Ntizar Aurora
- **Export:** JSON + Excel
- **Deploy:** GitHub Pages

### empleady (⭐0) — Simulador de rentabilidad de empleados
- **Stack:** HTML/CSS/JS vanilla + Ntizar Aurora
- **Funcionalidad:** Dashboard interactivo de curva de aprendizaje y break-even

---

## 2. Patrones Comunes en Repos de Ntizar

### Patrón 1: Ntizar Aurora como Design System Unificado
Todos los proyectos web de Ntizar comparten:
- CSS `ntizar.css` con namespace `.nz`
- Paleta azul (#3b82f6) + naranja (#f97316)
- Efecto liquid glass con backdrop-filter + SVG filters
- Sin frameworks CSS externos (solo tokens Aurora)
- Deploy en GitHub Pages (estático)

### Patrón 2: Vanilla First + Frameworks Selectivos
- Proyectos simples → HTML/CSS/JS vanilla (FamilyTree, XVLegislatura, empleady)
- Proyectos complejos → Vite + React + TypeScript (solmad, nap-dashboard)
- NUNCA Angular/Vue — preferencia clara por React o vanilla

### Patrón 3: Datos Públicos Españoles como Fuente
- BOE (Gobierno de España)
- Ministerio de Transportes (GTFS)
- Ayuntamiento de Madrid (terrazas)
- Bicimad API
- ESIOS/REE (mercado eléctrico)

### Patrón 4: Mapas y Visualización Geoespacial
- Leaflet (proyectos propios)
- D3.js (XVLegislatura)
- maptalks.three (starred)
- GTFS visualization (nap-dashboard, transit-map starred)
- TrafficLab 3D (starred)

---

## 3. Repositorios Starred Más Relevantes

### Herramientas de IA / Agentes
| Repo | ⭐ | Descripción |
|------|-----|-------------|
| microsoft/markitdown | 127K | Conversión de archivos a Markdown para LLMs |
| microsoft/VibeVoice | 47K | Voice AI open-source (TTS + ASR) |
| stablyai/orca | 3.6K | IDE multi-agente (Claude Code, Codex, etc.) |
| NangoHQ/nango | 9.3K | Integraciones con 800+ APIs |
| K-Dense-AI/scientific-agent-skills | 26K | 142 skills para agentes científicos |

### Visualización de Datos / Mapas
| Repo | ⭐ | Descripción |
|------|-----|-------------|
| MobilityData/awesome-transit | 1.7K | Lista comunitaria de APIs transit |
| vasile/transit-map | 372 | Animación de transporte público en mapa |
| gabrielAHN/gtfs-viz | 49 | Visualización GTFS en-browser con DuckDB WASM |
| duy-phamduc68/TrafficLab-3D | 310 | Digital twin de tráfico con CCTV + Google Maps |
| sparkyniner/DRISH-X | 228 | Inteligencia de carga desde satélite Sentinel-2 |

### Visión por Computadora / ML
| Repo | ⭐ | Descripción |
|------|-----|-------------|
| antoinelame/GazeTracking | 2.5K | Eye tracking con webcam |
| Blaizzy/mlx-vlm | 4.7K | Vision Language Models en Mac con MLX |
| PINTO0309/PINTO_model_zoo | 4.3K | Modelos convertidos entre frameworks |

### Diseño / UI
| Repo | ⭐ | Descripción |
|------|-----|-------------|
| alexpate/awesome-design-systems | 24K | Colección de design systems |
| google/eng-practices | 22K | Prácticas de ingeniería de Google |
| htekdev/vidpipe | 166 | Pipeline de vídeo agéntico |
| maptalks/maptalks.three | 645 | Integración maptalks + three.js |

---

## 4. Lecciones Aprendidas

### 4.1 Separación de Capas (Mastermind v3)
La separación entre capa documental (Obsidian, legible por humanos) y capa ejecutable (OpenCode, mínimo YAML) reduce un 42% el gasto en tokens. Este patrón es aplicable a cualquier sistema de agentes.

### 4.2 CSS-Only Design Systems
Aurora demuestra que un design system completo puede ser 100% CSS sin build step. El patrón de namespace `.nz` evita colisiones. Los "packs" opcionales permiten modularidad.

### 4.3 Web Workers + Comlink para Cálculos Pesados
Solmad usa este patrón para cálculos de sombras solares sin bloquear la UI. Es el patrón correcto para cualquier app que haga cálculos intensivos en el navegador.

### 4.4 Curva de Decaimiento Ebbinghaus para Memoria
El sistema de memoria de Mastermind aplica una función de decaimiento real (`R(t) = a / (log(t+1))^b + c`) para 4 niveles de relevancia. Esto mantiene el contexto ligero y relevante.

### 4.5 Multi-Modelo por Rol
No todos los agentes necesitan el mismo modelo. Asignar Opus al crítico, Gemini al explorador y Haiku al sintetizador ahorra 40-60% en costes manteniendo calidad.

### 4.6 Datos Públicos como Ventaja Competitiva
Ntizar consistently usa datos públicos españoles (BOE, GTFS, terrazas Madrid, Bicimad) como fuente de valor. Es un patrón replicable: datos abiertos + buena UX = producto valioso.
