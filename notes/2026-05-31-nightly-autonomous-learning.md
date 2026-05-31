# Exploración Autónoma de Repositorios Ntizar — 2026-05-31

## Resumen
Exploración nocturna de los 26 repositorios públicos de Ntizar en GitHub. Se analizaron en profundidad los 11 más relevantes por estrellas, actividad y valor técnico.

## Repositorios Analizados

### Con estrellas (≥1)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| solmad | 3 | TypeScript | Buscador 3D de terrazas con sol en Madrid |
| NtizarBrainMasterMind | 2 | CSS | Framework multi-agente OpenCode+Obsidian |
| IRPFdibujitos | 1 | Python | Calculadora IRPF con gráficas de progresividad en frío |
| OrbitMixer | 1 | JavaScript | Comparador de imágenes satelitales Sentinel-2 |
| nap-dashboard | 1 | TypeScript | Dashboard de transporte público español (GTFS) |
| SistemaElectricoFuturo | 1 | JavaScript | Simulador sistema eléctrico español 2026-2035 |

### Más activos (últimos pushes)
- **SistemaElectricoFuturo** — pushed 2026-05-31, v3.2, simulador energético completo
- **Ntizar-Aurora** — pushed 2026-05-31, v5.1 Constellation, design system CSS
- **koldo** — pushed 2026-05-31, knowledge repository
- **FreeHands** — pushed 2026-05-31, control multimodal webcam
- **solmad** — pushed 2026-05-30, 6200+ terrazas Madrid

## Aprendizajes Clave

### 1. Aurora Design System (v5.1 Constellation)
- **11 packs CSS** stateless e idempotentes, todo bajo `.nz` scope
- **Multi-axis theming**: shape, density, motion, color-system (OKLCH)
- **Agent-ready**: AGENTS.md + CDN público para ahorrar tokens de IA
- **Liquid glass real** en v5: specular + chromatic edge + dual inset shadow
- **6 skins runtime**: aurora, sunset, midnight, ocean, citrus, contrast (AAA)
- **Nightly pipeline**: 4 jobs nocturnos de mejora continua automática

### 2. FreeHands — Pipeline Multimodal
- **Fusión de 3 canales**: gaze (WebGazer/MediaPipe) + gesture (MediaPipe Hands) + voice
- **State machine**: IDLE → AIMING → DWELL → FIRED
- **GazeStabilityChecker**: variance window 8 frames, max_std 35px
- **Configuración precisa**: fine aim radius 70px, hold 1000ms, alpha 0.22
- **Safety**: palm open 2s = kill switch
- **Plugin system**: 7 hooks extensibles

### 3. Sistema Eléctrico Futuro — Orden de Mérito
- **12 tecnologías** en orden de mérito SRMC
- **Trayectoria 2026-2035** con estado persistente entre años
- **Monte Carlo**: 9 semillas, percentiles P5-P50-P95
- **Almacenamiento con degradación**: 2%/365 ciclos
- **17 escenarios** incluyendo nucleares (ENRESA, prórrogas)
- **Vanilla JS** con Vue 3 CDN, no build system

### 4. nap-dashboard — GTFS Parser en Navegador
- **fflate** para descompresión ZIP en memoria
- **Encoding detection**: UTF-8 → Windows-1252 fallback
- **Tolerancia a errores**: try/catch por fila CSV
- **Navegación semanal**: calendar.txt + calendar_dates.txt → filtrado por día
- **Cap 100k stop_times** para evitar OOM

### 5. Mastermind v3 — Arquitectura Dual
- **Separación documental/ejecutable**: Obsidian + OpenCode
- **42% reducción de tokens** al no duplicar contenido
- **Decaimiento Ebbinghaus**: R(t) = a/(log(t+1))^b + c
- **Flujos adaptativos**: 3 niveles por complejidad (1-2, 3, 4-5)
- **11 agentes especializados** con model routing

### 6. SolMAD — Patrones de Mapa Solar
- **Web Workers + Comlink** para cálculos sin bloquear UI
- **Tile caching** Overpass API con 3 endpoints redundantes
- **SunCalc** para posición solar
- **Leaflet markercluster** para 6200+ puntos
- **Precomputación solar** como script de build

## Skills Creadas
1. `electric-system-order-of-merit` — simulador energético
2. `gtfs-browser-parser` — parser GTFS en navegador
3. `mastermind-multi-agent-orchestration` — orquestación multi-agente
4. `solmad-solar-terrace-pattern` — patrón solar en terrazas

## Skills Existentes Actualizadas
- `liquid-glass-css` — ya contenía info de Aurora
- `freehands-multimodal-control` — ya actualizada con detalles

## Patrones Comunes Detectados
1. **Vanilla-first**: la mayoría de proyectos usan vanilla HTML/JS cuando es posible
2. **CDN público**: Aurora, demos, todo en CDN/jsDelivr
3. **GitHub Pages**: deploy estático como plataforma principal
4. **Ntizar Aurora**: design system unificado en TODOS los proyectos frontend
5. **Datos públicos españoles**: datos.gob.es, REE, Ayuntamiento Madrid, NAP
6. **Sin build system**: Vite solo cuando es necesario (solmad, nap-dashboard)
7. **Web Workers + Comlink**: patrón recurrente para cálculos pesados
8. **Serverless functions**: Vercel para API backend ligero
9. **State management**: Zustand (solmad), Zustand (nap-dashboard)
10. **Documentación en README**: README.md extenso con arquitectura, stack, uso

## Repositorios No Profundizados (pero catalogados)
- inicio-en-nan — Guía paso a paso para NaN.builders (8477 chars README)
- datos-gob-watch — Radar semanal de datasets (2858 chars)
- OrbitMixer — Comparador satelital (3533 chars)
- IRPFdibujitos — Calculadora IRPF (4732 chars)
- rail-lidar-qa-mvp — Validación LiDAR ferroviario (13944 chars)
- FamilyTree, farosspain,lopezaesthetics, MetalHoverLab, weekPlan, Accidentes2024, Rumby, XVLegislatura, empleady, Voynich_Solving, MonteCarloInversion, YoloConteo, PacManMadrid — menores, sin explorar en profundidad
