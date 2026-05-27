# Exploración Autónoma de Repos con Estrellas — 28/05/2026

## Contexto
Exploración autónoma de los 50 repositorios con estrellas del usuario Ntizar en GitHub para identificar patrones, herramientas reutilizables y conocimiento valioso.

## Panorama General
- **50 repositorios** con estrellas
- **26 repositorios propios** de Ntizar
- **6 categorías principales** identificadas:
  1. Agentes IA y orquestación (8 repos)
  2. Transporte GTFS y transit (11 repos)
  3. Visión por computadora y ML (12 repos)
  4. Diseño CSS Liquid Glass (2 repos)
  5. Herramientas de procesamiento (4 repos)
  6. MCP e integraciones (3 repos)

## Hallazgos Principales

### 1. Ecosistema de Agentes IA (muy maduro)
- **Orca** (3534⭐): IDE para flotas de agentes paralelos con worktrees aislados. Soporta 20+ agentes (Claude Code, Codex, Gemini, Hermes Agent, OpenCode...)
- **Scientific Agent Skills** (26216⭐): 138 skills científicas listas para usar. Standard open Agent Skills.
- **NtizarBrainMasterMind** (repo propio): Orquestación multi-agente con memoria persistente, decaimiento Ebbinghaus, 11 agentes especializados, multi-model routing. 40-60% ahorro en tokens.
- **Kanvas** (169⭐): Board visual en Obsidian Canvas para humanos+agentes.

### 2. Stack GTFS/Transporte (completo)
- **gtfs-to-html** (225⭐): GTFS → horarios HTML/PDF/CSV accesibles
- **static-GTFS-manager** (159⭐): GUI para crear/editar/export GTFS
- **payanam** (17⭐): Mapeo de rutas sin datos geo → GTFS
- **awesome-transit** (1756⭐): Catálogo comunitario de herramientas transit
- **SistemaElectricoFuturo** (propio): Simulador eléctrico España 2026-2035, 17 escenarios, 8760h/año
- **TrEnergIA/hackaton1** (propio): Gemelo energético ferroviario GTFS+ESIOS

### 3. Diseño Ntizar Aurora (propio, v5.1)
- CSS-only, sin dependencias, ~170KB
- 10 packs opcionales (dashboards, maps, 3D, landings...)
- Liquid Glass real con OKLCH, multi-axis theming, forced-colors
- Agent-ready: AGENTS.md + INDEX.md para no quemar tokens
- CDN público jsDelivr disponible
- **Pattern clave:** Nunca pegar CSS en prompts de agentes

### 4. Vision ML y Satélite
- **DRISH-X** (228⭐): Tráfico de carga desde Sentinel-2 (spectral smear detection)
- **TrafficLab-3D** (309⭐): CCTV mp4 → digital twin 3D
- **Boxer3D** (398⭐): YOLO + LiDAR iPhone → AR 3D object detection
- **City2Graph** (1212⭐): GeoPandas → NetworkX → PyTorch Geometric
- **AWS DEM Downloader** (8⭐): Terrain tiles para mapping

### 5. Herramientas de Procesamiento
- **vidpipe** (166⭐): Vídeo raw → shorts/reels/captions/blog. Whisper + Gemini + Copilot SDK
- **markitdown** (125610⭐): Cualquier archivo → Markdown
- **VibeVoice** (47464⭐): TTS frontier, multilingual, 90 min long-form
- **Nango** (9186⭐): 800+ APIs integrations, auth proxy, AI-generated

## Skills Generadas (7 nuevas)
1. `transit-gtfs-toolkit` — Toolkit GTFS completo
2. `liquid-glass-aurora` — Sistema de diseño Ntizar Aurora
3. `multi-agent-orchestration` — Patrones orquestación multi-agente
4. `satellite-ai-vision` — Visión satelital y computer vision
5. `electric-market-sim` — Simuladores sistema eléctrico español
6. `video-processing-pipeline` — Pipeline vídeo con IA
7. (Ya existentes: hermes-agent, markitdown, postgres-mcp, nango, metabase, vibevoice, voicebox, scientific-agent-skills, orca, mlx-vlm, pinto-model-zoo, api-mega-list, google-eng-practices)

## Repos Propios Más Relevantes de Ntizar
1. **solmad** (3⭐): Buscador 3D de terrazas con sol en Madrid. Leaflet + SunCalc + Three.js + Zustand
2. **FreeHands** (0⭐): Control PC con ojos/manos/voz. Webcam only. MVP desktop+web
3. **Ntizar-Aurora** (0⭐): Design System Liquid Glass v5.1
4. **IRPFdibujitos** (1⭐): Calculadora IRPF 2012-2026 con gráficas
5. **NtizarBrainMasterMind** (2⭐): Multi-agent orchestration framework
6. **rail-lidar-qa-mvp** (0⭐): Validación calidad LiDAR ferroviario
7. **hackaton1/TrEnergIA** (0⭐): Gemelo energético ferroviario GTFS+ESIOS
8. **SistemaElectricoFuturo** (1⭐): Simulador eléctrico España 2026-2035
9. **nap-dashboard** (1⭐): Dashboard React+Vite para datos NAP
10. **FamilyTree** (0⭐): Editor visual árboles genealógicos
11. **datos-gob-watch** (0⭐): Weekly digest datos.gob.es

## Patrones Identificados

### Patrón de Proyectos de Ntizar
1. **Datos abiertos españoles** como fuente principal (ESIOS, datos.gob.es, GTFS Renfe, PNOA)
2. **Visualización interactiva** como output principal (mapas 3D, dashboards, gráficas)
3. **Ntizar Aurora** como sistema de diseño unificador
4. **Libre y open-source** con licencia MIT
5. **Stack moderno**: Vite + React + TypeScript + Leaflet + Three.js
6. **Problemas reales españoles**: sistema eléctrico, transporte, IRPF, accidentes

### Patrón de Intereses
- Transporte público y GTFS (11 repos)
- Energía y sistema eléctrico español
- Visión por computadora y ML
- Diseño UI/UX con Liquid Glass
- Agentes IA y orquestación
- Datos abiertos y open data
