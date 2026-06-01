# Audit de repositorios GitHub de Ntizar — 2026-06-01

## Resumen general

26 repositorios encontrados en `github.com/Ntizar`.
Sin repos con estrellas públicas externas (0-3 stars cada uno).
Todos activos, actualizados recientemente (2026-05-20 a 2026-06-01).

## Categorización por dominio

### 🧠 IA / Multi-agent / Orquestación
- **NtizarBrainMasterMind** (2★) — Framework multi-agente OpenCode + Obsidian, 11 agentes, memoria Ebbinghaus, flujo adaptativo
- **koldo** (0★) — Knowledge repository del sistema Koldo

### 👁️ Computer Vision / Gaze / Gestos
- **FreeHands** (0★) — Control PC sin manos: gaze + gestures + voice. MediaPipe, PyQt6, Kalman filter, fusion multimodal
- **YoloConteo** (0★) — Detección YOLOv8n ONNX en navegador con WebGPU (20-40fps) + tracker IoU + conteo bidireccional

### ⚡ Energía / Sistema Eléctrico
- **SistemaElectricoFuturo** (1★) — Simulador interactivo del sistema eléctrico español 2026-2035, 8760h, Monte Carlo, 17 escenarios, trayectoria multianual
- **hackaton1** (0★) — Dashboard de energía + GTFS trenes (hackathon)

### 🚌 Movilidad / Transporte
- **Rumby** (0★) — Plataforma de movilidad multimodal tipo Flighty: conectores modulares, planner GTFS, incidencias DGT
- **nap-dashboard** (1★) — Dashboard de transporte público España: parser GTFS en navegador, visor de rutas, paradas, horarios
- **datos-gob-watch** (0★) — Radar semanal de datasets de datos.gob.es, pipeline estático con cron

### ☀️ Solar / Terrazas / Geografía
- **solmad** (3★) — Buscador de terrazas con sol en Madrid: SunCalc + Web Workers + Comlink + precomputación + shadow raycasting
- **OrbitMixer** (1★) — Comparador de imágenes satelitales Sentinel-2: split viewer, hand-gesture control, AI vision

### 📊 Datos / Visualización / Políticas
- **Accidentes2024** (0★) — Megadashboard visual de accidentes con víctimas en España 2024
- **XVLegislatura** (0★) — Atlas orgánico del Gobierno de España: mapa radial D3.js, 22 ministerios, 300+ órganos
- **IRPFdibujitos** (1★) — Calculadora visual del IRPF español 2012-2026: progresividad en frío, gráfica de la vergüenza

### 🎨 Design System / UI
- **Ntizar-Aurora** (0★) — Design system CSS-only: v5.1 Constellation, liquid glass, OKLCH, multi-axis theming, agent-ready CDN
- **MetalHoverLab** (0★) — Playground de efectos metalizados con cursor sobre relieves blancos/mármol

### 🔬 Investigación / Ciencia
- **Voynich_Solving** (0★) — Desciframiento estructural del Manuscrito Voynich: la sección de recetas parece base de datos farmacéutica medieval (estructura sí, semántica no)
- **rail-lidar-qa-mvp** (0★) — QA local LiDAR para ferrocarril: Three.js, procesado LAZ
- **familia-tree-editor** (FamilyTree) — Editor visual de árboles genealógicos con estilo Ntizar Aurora

### 🎮 Creativo / Experimental
- **PacManMadrid** (0★) — Pac-Man con ubicación en Madrid
- **MonteCarloInversion** (0★) — Simulador Monte Carlo de inversiones
- **lopezaesthetics** (0★) — (sin descripción)
- **weekPlan** (0★) — Planificador semanal

### 📚 Guía / Onboarding
- **inicio-en-nan** (0★) — Guía paso a paso: desde pagar NaN.builders hasta tener agente IA con Telegram

## Patrones transversales identificados

### 1. Design System Ntizar Aurora
- **Presente en**: solmad, SistemaElectricoFuturo, Ntizar-Aurora, MetalHoverLab, IRPFdibujitos, OrbitMixer, XVLegislatura, FamilyTree, YoloConteo, Accidentes2024, nap-dashboard, datos-gob-watch, rail-lidar-qa-mvp, FarosSpain
- **Patrón**: CSS-only, azul #2563eb + naranja #f97316, liquid glass, sin dependencias JS
- **CDN público**: `https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.css`
- **AGENTS.md**: Estándar para que los agentes AI usen Aurora sin pegar CSS en el prompt

### 2. Zero-server deployment
- **Presente en**: solmad, SistemaElectricoFuturo, IRPFdibujitos, OrbitMixer, FarosSpain, FamilyTree, YoloConteo, datos-gob-watch, rail-lidar-qa-mvp
- **Plataformas**: GitHub Pages, Vercel, Netlify
- **Patrón**: HTML/CSS/JS vanilla, sin build step, sin backend propio

### 3. Web Workers para cálculos pesados
- **Presente en**: solmad (shadows), YoloConteo (YOLO inference)
- **Patrón**: Computación intensiva en Web Worker, comunicación vía Comlink o postMessage

### 4. GitHub Actions como cron
- **Presente en**: solmad (precompute-sun), datos-gob-watch (weekly digest), SistemaElectricoFuturo (deploy)
- **Patrón**: Workflow con `schedule: cron` que ejecuta script → genera datos → commit → deploy

### 5. Contribuciones con PR review
- **Presente en**: solmad
- **Patrón**: Formulario → rama review → PR automático → revisión humana

### 6. Agentes con definiciones en Markdown
- **Presente en**: NtizarBrainMasterMind
- **Patrón**: Cada agente tiene archivo `agents/NN-nombre.md` con frontmatter, misión, reglas, output format

### 7. Memoria con decaimiento Ebbinghaus
- **Presente en**: NtizarBrainMasterMind
- **Patrón**: `R(t) = a / (log(t+1))^b + c`, 4 tipos de decay, archivado automático

### 8. Conectores modulares
- **Presente en**: Rumby, nap-dashboard
- **Patrón**: Cada fuente de datos es un conector independiente con contrato definido

## Proyectos más maduros (por estructura y documentación)

1. **NtizarBrainMasterMind** — Documentación extensa, arquitectura de dos capas, 11 agentes, learnings con decay
2. **SistemaElectricoFuturo** — 14 módulos JS, 17 escenarios, Monte Carlo, trayectoria multianual, documentación técnica
3. **FreeHands** — Pipeline completo gaze+gestures+voice, Kalman filter, calibration, perfiles
4. **solmad** — Web Workers, Comlink, precomputación, contribuciones, 6200+ terrazas
5. **Rumby** — Arquitectura modular por ciudad, conectores, planner GTFS

## Proyectos con potencial de aprendizaje

1. **Voynich_Solving** — Metodología de análisis estructural de textos: entropía de sufijos, alineación vertical, perfiles estadísticos
2. **YoloConteo** — YOLO ONNX en navegador con WebGPU, tracker IoU, conteo bidireccional
3. **OrbitMixer** — Pipeline gratuito de imágenes satelitales: STAC + TiTiler + COG→PNG
4. **datos-gob-watch** — Pipeline de digest semanal con cron GitHub Actions
5. **XVLegislatura** — Visualización D3.js de organigramas gubernamentales

## Lecciones aprendidas

1. **Ntizar prioriza proyectos con impacto social/práctico**: energía, transporte, datos públicos, accesibilidad
2. **Siempre busca cero dependencias**: CSS-only, vanilla JS, sin frameworks cuando es posible
3. **Documentación es parte del producto**: cada repo tiene README detallado, docs/, METHODODOLOGY.md
4. **Diseño consistente**: Ntizar Aurora es el hilo conductor de todos los proyectos frontend
5. **Open source con propósito**: MIT license en la mayoría, datos CC0
6. **Aprende de fracasos**: Voynich documenta honestamente lo que no se pudo demostrar
7. **Multi-modal es la tendencia**: FreeHands (gaze+gestures+voice), OrbitMixer (satellite+gesture+AI)
8. **Performance en navegador**: Web Workers, WebGPU, Comlink son patrones recurrentes
