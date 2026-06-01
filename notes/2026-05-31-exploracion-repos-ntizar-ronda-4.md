# Exploración Autónoma de GitHub — Ronda 4 (31/05/2026)

## Contexto
Cuarta ronda de exploración de repositorios del usuario Ntizar en GitHub. Se profundiza en 5 repos que no se habían explorado en rondas anteriores, con foco en patrones de arquitectura, control multimodal, simulación energética y finanzas.

## Repos Explorados en Profundidad

### 1. Ntizar/FreeHands — Control Multimodal Gaze + Gestures + Voice
**Categoría:** Human-Computer Interaction / Accessibility
**Stack:** Python 3.11+, PyQt6, MediaPipe, NumPy, pyautogui, winsound
**Arquitectura:**

```
┌─────────────────────────────────────────────────┐
│                    CLI Entry                     │
│  calibrate | run | doctor | repair | camera      │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              Main Loop (35ms tick)               │
│                                                  │
│  Camera → MediaPipe → Feature Extraction         │
│       ↓                                          │
│  GazeTracker → Ridge Model → Screen Pixel        │
│       ↓                                          │
│  HandTracker → Gesture Classification            │
│       ↓                                          │
│  Fusion Engine → State Machine                   │
│       ↓                                          │
│  Controls → pyautogui (click, scroll, zoom)      │
│       ↓                                          │
│  AudioFeedback → winsound.Beep                   │
└─────────────────────────────────────────────────┘
```

**Lo más valioso:**
- **Calibración por minijuego:** Aim-trainer 9-point grid (ISO standard) con modelo Ridge para mapeo eye→pixel
- **Fusión multimodal:** Gaze + gestures + voice con anti-false-positive (stability frames, cooldown, confidence threshold)
- **Fine aim assist:** Hold 1000ms en radio 70px → snap to target, release a 135px
- **Radial menu:** Open-palm hold → circular action picker con dwell selection
- **Virtual keyboard:** Gaze-based dwell typing via pyautogui
- **Audio feedback:** winsound.Beep con debounce 80ms (high=gestures, low=voice, double=error)
- **Safety:** Right open palm hold 1s = kill switch universal
- **Perfiles de usuario:** Datos en platformdirs (cross-platform), calibración por usuario
- **Ntizar Palette:** Dataclass frozen con colores azul/naranja + glass surfaces

**Patrones clave:**
1. State machine con estados: IDLE, AIMING, FINE_AIM, CLICK, SCROLL, MENU, KEYBOARD
2. Feature engineering para gaze: eye aspect ratio, pupil position, head pose
3. Anti-false-positive: stability_frames (8 frames ≈ 270ms) + cooldown (500ms) + confidence (0.85)
4. Dwell-based interaction: 400ms para radial menu, 800ms para teclado virtual
5. CLI-first design: subcommands para calibración, ejecución, diagnóstico

**Aplicación Koldo:** Control por mirada para accesibilidad, interacción hands-free, patrones de calibración, state machines para HCI.

### 2. Ntizar/SistemaElectricoFuturo — Simulador Eléctrico Español 2026-2035
**Categoría:** Energy Systems / Climate Modeling
**Stack:** HTML estático + Vue 3 CDN + Plotly.js + Ntizar Aurora CSS
**Arquitectura:**

```
┌─────────────────────────────────────────────────┐
│              UI Layer (Vue 3 CDN)                │
│  index.html + app.css                            │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│           Simulation Engine (IIFE modules)       │
│                                                  │
│  SimulatorElectrico → Despacho por mérito        │
│  Demand → 7 sectores con perfiles horarios       │
│  Storage → Baterías + Bombeo con degradación     │
│  Policy → Tope ibérico, CfDs, peajes             │
│  Scenarios → 17 escenarios predefinidos          │
│  Trajectory → Rampas multianuales 2026-2035      │
│  Nuclear → Calendario ENRESA con prórroga        │
│  Weather → Perfiles solar/eólico/hidráulica      │
└─────────────────────────────────────────────────┘
```

**Lo más valioso:**
- **Despacho por mérito:** Pila SRMC con 12 tecnologías (nuclear → eólica → solar → CCGT → carbón)
- **Simulación 8,760 horas:** Anual + trayectoria multianual 2026-2035
- **17 escenarios:** PNIEC, nuclear, VE masivo, sequía, crisis gas, ley climática
- **Demanda sectorial:** 7 sectores (residencial, servicios, industrial, VE, bombas calor, H2, autoconsumo)
- **Almacenamiento avanzado:** Baterías con degradación (2%/365 ciclos) + bombeo con reserva estacional
- **Política energética:** Tope ibérico, CfDs, peajes dinámicos, PVPC
- **Calendario nuclear real:** Basado en ENRESA con opción de prórroga
- **Mulberry32 PRNG:** Reemplazo de Math.sin para aleatoriedad
- **Métricas:** Horas sin gas, estrés de red, LCOE, LCOS, coste del sistema

**Patrones clave:**
1. IIFE modules para namespace isolation (SEF.MODEL, SEF.Utils, SEF.PARAMS_DEFAULT)
2. State persistence entre años: _batteryState, _pumpedState, _hidraulicidadPrev
3. Parametric scenarios: cada escenario sobrescribe solo parámetros relevantes
4. Float64Array para perfiles horarios (8,760 elementos) — memory efficient
5. Clamp para límites físicos (demanda 180-380 TWh, precios -50 a 3000)

**Aplicación Koldo:** Simulación de sistemas complejos, despacho energético, modelado multianual, perfiles horarios.

### 3. Ntizar/MonteCarloInversion — Simulador de Riesgos Bursátiles
**Categoría:** Quantitative Finance / Risk Modeling
**Stack:** Vanilla HTML/CSS/JS, Chart.js, Web Workers, Yahoo Finance API
**Arquitectura:**

```
┌─────────────────────────────────────────────────┐
│              UI Layer (Vanilla JS)               │
│  Black & Gold theme, Chart.js fan chart          │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│         5 Models in Parallel (Web Worker)        │
│                                                  │
│  GBM → Geometric Brownian Motion               │
│  Heston → Volatilidad estocástica              │
│  Jump-Diffusion → Saltos (Merton)              │
│  GARCH(1,1) → Volatilidad variable              │
│  Bootstrap → Sin supuestos distribucionales     │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│         Signal Engine + Risk Metrics             │
│  BUY/HOLD/SELL score 0-100                       │
│  VaR/CVaR 95%/99%                               │
│  Sharpe/Sortino ratios                           │
│  Backtest auto a 1 año                           │
└─────────────────────────────────────────────────┘
```

**Lo más valioso:**
- **5 modelos estocásticos:** GBM, Heston, Jump-Diffusion, GARCH(1,1), Bootstrap
- **Web Workers:** Ejecución paralela sin bloquear UI
- **Señal consensuada:** BUY/HOLD/SELL score 0-100 basado en consenso de 5 modelos
- **VaR/CVaR:** Value at Risk y Conditional VaR al 95% y 99%
- **Backtest automático:** 1 año de datos históricos para validar modelo
- **Contexto completo:** Yahoo Finance + Wikipedia + Reddit + SEC filings
- **PDF export:** Informe descargable

**Patrones clave:**
1. Fan chart con bandas de confianza 95%/99%
2. Consenso de modelos: cada modelo vota BUY/HOLD/SELL, se promedia
3. Web Worker para cómputo pesado (simulación Monte Carlo)
4. CORS proxy chain: allorigins → corsproxy → codetabs → thingproxy

**Aplicación Koldo:** Simulación estocástica, modelado financiero, risk metrics, consenso de modelos.

### 4. Ntizar/nap-dashboard — Dashboard de Transportes de España
**Categoría:** Public Transit / GTFS Data Visualization
**Stack:** React 19 + TypeScript + Vite + React Query + Leaflet + Recharts + fflate
**Arquitectura:**

```
┌─────────────────────────────────────────────────┐
│           React 19 + TypeScript                  │
│  BrowserRouter + React Query + Leaflet          │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│         Pages (Lazy Loaded)                      │
│  Overview → KPIs + Charts (Recharts)            │
│  Datasets → Tabla con filtros                    │
│  Operadores → Directorio ~2,594                  │
│  Mapa → Cobertura geográfica                    │
│  GTFS Viewer → Rutas, paradas, horarios          │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│         Data Layer                               │
│  napClient.ts → API proxy (/api/nap/*)          │
│  gtfsParser.ts → fflate unzip + CSV parse       │
│  useNap.ts → React Query hooks                  │
│  types.ts → Tipos reales de API NAP             │
└─────────────────────────────────────────────────┘
```

**Lo más valioso:**
- **GTFS Parser completo:** Parsing de 14+ archivos GTFS en el browser con fflate
- **Selector de semana:** Lógica GTFS calendar.txt → qué servicios operan cada día
- **Lazy loading:** Cada página se carga solo al navegar
- **API proxy pattern:** Client → /api/nap/* → Vercel edge function → NAP API
- **React Query caching:** 5 min stale, 10 min gcTime
- **Leaflet maps:** Rutas en color, paradas como círculos, polilíneas para trayectorias
- **KPI cards + charts:** Recharts para visualizaciones estadísticas

**Patrones clave:**
1. API key en localStorage → inyectada en headers en runtime (nunca en código)
2. fflate para descompresión ZIP en memoria (GTFS files)
3. Calendar logic: calendar.txt + calendar_dates.txt → isServiceActive(date)
4. Headway calculation: frequencies.txt → headwayLabel()
5. Vite middleware para /api/nap/gtfs-proxy en dev

**Aplicación Koldo:** Parser GTFS, visualización de datos de transporte, React Query patterns, lazy loading, API proxy patterns.

### 5. Ntizar/solmad — Buscador de Terrazas con Sol en Madrid
**Categoría:** Urban Data / Solar Computation
**Stack:** Vite + React + TypeScript + Leaflet + Zustand + Tailwind + SunCalc + Three.js
**Lo más valioso:**
- **6,200+ terrazas** del censo oficial del Ayuntamiento de Madrid
- **Cálculo solar en tiempo real:** SunCalc + OSM building footprints + ray casting
- **Web Workers + Comlink:** Cálculos de sombras sin bloquear UI
- **Cache solar:** localStorage + data/sun-cache.json via API
- **Three.js intro:** Intro cinematográfica
- **Datos abiertos:** CC BY 4.0 (Ayuntamiento) + ODbL (OSM)

## Patrones Transversales Detectados Esta Ronda

### 1. State Machine para HCI
FreeHands usa un patrón de state machine con estados bien definidos (IDLE, AIMING, FINE_AIM, CLICK, SCROLL, MENU, KEYBOARD) con transiciones basadas en eventos de gaze/gesture/voice. Anti-false-positives con stability frames + cooldown + confidence threshold.

### 2. IIFE Module Pattern para Simulación
SistemaElectricoFuturo usa IIFE (Immediately Invoked Function Expressions) para crear namespaces (SEF.Model, SEF.Utils, SEF.PARAMS_DEFAULT) sin dependencias de build system. Float64Array para perfiles horarios eficientes.

### 3. Multi-Model Consensus
MonteCarloInversion ejecuta 5 modelos estocásticos en paralelo (Web Workers) y genera una señal consensuada (BUY/HOLD/SELL score 0-100). Backtest automático para validar el modelo más preciso.

### 4. GTFS Parser Client-Side
nap-dashboard parsea archivos GTFS completos (14+ archivos CSV) en el browser usando fflate para descompresión ZIP. Calendar logic para determinar qué servicios operan cada día.

### 5. API Proxy Pattern
nap-dashboard usa un patrón de proxy: client → /api/nap/* → Vercel edge function → API externa. API key nunca en código fuente, inyectada en runtime desde localStorage.

## Skills Creadas Esta Ronda

| Skill | Fuente | Descripción |
|-------|--------|-------------|
| freehands-multimodal-control | Ntizar/FreeHands | Control PC con mirada + gestos + voz, PyQt6 + MediaPipe |
| electric-system-simulator | Ntizar/SistemaElectricoFuturo | Simulador sistema eléctrico español 2026-2035 |
| monte-carlo-stock-simulator | Ntizar/MonteCarloInversion | Simulación estocástica de riesgos bursátiles |
| gtfs-to-html | Ntizar/nap-dashboard | Parser GTFS completo en browser con React Query |

## Repos No Explorados en Profundidad
- Ntizar/Accidentes2024 — Megadashboard de accidentes con víctimas 2024
- Ntizar/FamilyTree — Editor visual de árboles genealógicos
- Ntizar/XVLegislatura — Atlas orgánico del Gobierno de España con D3.js
- Ntizar/IRPFdibujitos — Calculadora IRPF con visualización
- Ntizar/Voynich_Solving — Descifrado manuscrito Voynich
- Ntizar/inicio-en-nan — Guía de inicio en NaN.builders

## Próximas Exploraciones Sugeridas
1. Ntizar/Accidentes2024 — Análisis de datos de tráfico españoles
2. Ntizar/FamilyTree — Patrones de visualización genealógica
3. Ntizar/XVLegislatura — D3.js radial graphs + datos gubernamentales
4. Ntizar/Voynich_Solving — Análisis estadístico de textos cifrados
5. Ntizar/rail-lidar-qa-mvp — Validación LiDAR ferroviaria
