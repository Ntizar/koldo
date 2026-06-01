# Exploración de Repositorios Ntizar — 2026-05-29

## Resumen

Se exploraron 7 repositorios principales del usuario Ntizar en GitHub para identificar patrones, tecnologías, arquitecturas y conocimientos reutilizables.

## Repos Explorados

### 1. NtizarBrainMasterMind (2★) — Multi-agent AI Orchestration
- **Stack:** Obsidian + OpenCode CLI
- **Arquitectura:** 11 agentes especializados con pipeline obligatorio (orchestrator → classifier → explorer → planner → spec-writer → implementer → reviewer → critic → synthesizer → archiver → librarian)
- **Innovación clave:** Sistema de memoria con decaimiento Ebbinghaus (R(t) = a/log(t+1)^b + c)
- **Dos capas:** Documental (Obsidian/agents/) + Ejecutable (.opencode/)
- **Multi-modelo:** Cada agente usa el modelo óptimo (Opus para critic/orchestrator, Gemini para explorer, Haiku para synthesizer)
- **4 skills de dominio:** software-dev, dashboard-dev, web-deploy, pwa-android
- **Design System incluido:** ntizar.css (1,379 líneas) con efecto Liquid Glass
- **Plataforma de aprendizaje:** Brain Academy v3.0 con gamificación
- **Roadmap v3.1:** Integración MCP multi-agente, presupuesto de tokens, handoffs en streaming

### 2. Ntizar-Aurora (0★) — Design System v5.1 "Constellation"
- **Stack:** CSS puro, sin build step, sin JS
- **Arquitectura modular:** 11 packs independientes (core + 10 opcionales)
- **Namespaced:** `.nz` class para evitar colisiones
- **6 skins:** aurora, sunset, midnight, ocean, citrus, contrast
- **CDN público:** jsdelivr (cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/)
- **v5 features:** Liquid glass real (SVG filters), OKLCH, multi-axis theming, forced-colors
- **Agent-ready:** AGENTS.md + INDEX.md como documentación mínima para agentes (~20KB vs 170KB)
- **Packs:** themes, data, charts, maps, viz, motion, forms, ui, patterns, next
- **Versionado semántico:** 5.1.0 en CDN

### 3. esios-dashboard (0★) — Dashboard Energético
- **Stack:** Node.js + Express + Chart.js vanilla
- **Arquitectura por dominios:** domains/energy, domains/forecast, infra/clients, infra/cache, shared/
- **Cache multicapa:** MemoryCache (RAM) + DiskCache (filesystem) con TTL
- **API ESIOS/REE:** Endpoints para indicador, monthly, yearly, summary, prediccion
- **Conversión de unidades:** src/shared/esios-units.js (divide entre 10, 1000, etc.)
- **Forecast Monte Carlo:** simulación de precios con Box-Muller + percentiles (p5, p25, p50, p75, p95)
- **Timezone:** Europe/Madrid nativo, manejo de DST (23h/25h days)
- **Seguridad:** Helmet + CSP estricto + CORS whitelist
- **Health checks:** /healthz, /readyz, /metrics (Prometheus)
- **Docker:** Dockerfile incluido

### 4. solmad (3★) — Madrid Solea
- **Stack:** Vite + React + TypeScript + Leaflet + Zustand + Tailwind
- **Funcionalidad:** 6,200+ terrazas de Madrid + cálculo solar en tiempo real
- **Cálculo de sombras:** SunCalc + OSM building footprints + ray casting
- **Web Workers + Comlink:** Cálculos pesados sin bloquear UI
- **Three.js:** Intro cinematográfica
- **Datos:** Ayuntamiento de Madrid (CC BY 4.0) + OSM (ODbL)
- **Contribuciones:** PRs automáticos via GitHub API (rama review → main)
- **Cache solar:** localStorage + data/sun-cache.json via API
- **Deploy:** Vercel

### 5. IRPFdibujitos (1★) — Calculadora IRPF España
- **Stack:** Python (motor) + HTML/CSS/JS vanilla (web)
- **Motor fiscal:** Parámetros normativos 2012-2026, cotizaciones SS, reducciones, deducciones
- **Datos:** JSON precalculados, GitHub Pages
- **Licencia dual:** Código MIT + Contenido CC0 1.0
- **Tests:** 47 tests pytest
- **Divulgativo:** Visualización de progresividad en frío
- **Open source:** Convocatoria a fiscalistas para auditoría

### 6. OrbitMixer (1★) — Comparador Satelital
- **Stack:** Vanilla HTML/CSS/JS + Vercel Serverless Functions
- **Imágenes:** Sentinel-2 via Earth Search STAC (AWS, free)
- **Render COG→PNG:** TiTiler.xyz (free)
- **Elevación:** OpenTopoData (free)
- **Geocoding:** Nominatim OSM (free)
- **Hand tracking:** MediaPipe Hands (CDN)
- **AI vision:** OpenRouter + fallback chain (optional)
- **Gesture control:** Índice, pinche, V up/down, thumbs-up hold
- **100% free APIs** por defecto

### 7. SistemaElectricoFuturo (1★) — Simulador Eléctrico
- **Stack:** Vanilla HTML/CSS/JS con Ntizar Aurora v4
- **Simulación:** 8,760 horas anuales + trayectoria multianual 2026-2035
- **17 escenarios:** PNIEC, nuclear, VE masivo, sequía, crisis gas, etc.
- **Módulos:** nuclear, weather, demand, storage, policy, scenarios, simulator, trajectory, charts
- **Fuentes:** REE, OMIE, MITECO, CNMC, ENTSO-E, EU ETS
- **Métricas:** horas sin gas, estrés de red, LCOE, LCOS

## Patrones Identificados

### Patrones de Arquitectura
1. **Vanilla-first:** La mayoría de proyectos usan HTML/CSS/JS vanilla como base
2. **Arquitectura por dominios:** Separación clara domains/infra/shared
3. **Cache multicapa:** Memory + Disk con TTL y métricas
4. **APIs externas con fallback:** Siempre hay fallback graceful
5. **Ntizar Aurora como identidad visual:** Design system unificador

### Patrones de Datos
1. **Conversión de unidades centralizada:** esios-units.js
2. **Timezone handling:** Europe/Madrid nativo
3. **Datos precalculados:** JSON para web estática
4. **Manejo de DST:** Normalización de horas 23/25

### Patrones de Deploy
1. **Vercel:** solmad, OrbitMixer
2. **GitHub Pages:** IRPFdibujitos, SistemaElectricoFuturo
3. **Docker:** esios-dashboard
4. **NaN.builders:** koldo

### Patrones de Licenciamiento
1. **MIT:** Código (casi universal)
2. **CC0:** Contenido/datos (IRPFdibujitos)
3. **Dual licensing:** Código + Contenido separado
