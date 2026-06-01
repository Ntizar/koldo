# Investigación: Nuevas ideas de mejora para SistemaElectricoFuturo

**Fecha:** 1 de junio de 2026 (actualizado en FASE 4)  
**Proyecto:** SistemaElectricoFuturo v3.4+ (Ntizar/SistemaElectricoFuturo)  
**URL:** https://ntizar.github.io/SistemaElectricoFuturo/  
**Stack:** HTML estático + Vue 3 CDN + Plotly.js + CSS propio (Ntizar Aurora). Sin build system.  
**Autores:** David Antizar  

---

## 1. Exploración de la estructura del proyecto

### Archivos principales (13 módulos JS + HTML + CSS + docs)

```
SistemaElectricoFuturo/
├── index.html                    (1091 líneas, UI completa con Vue 3)
├── PLAN.md                       (157 líneas, roadmap con estados)
├── README.md                     (131 líneas)
├── package.json                  (scripts: test, build, dev)
├── motor.mjs                     (CLI headless para Node.js)
├── sw.js                         (Service Worker para offline)
├── css/
│   ├── ntizar.css               (Design system Aurora)
│   ├── ntizar.next.css          (Estilos de transición)
│   ├── app.css                  (Layout y componentes)
│   └── ree-data.css             (Estilos REE)
├── js/
│   ├── constants.js             (Constantes, PRNG Mulberry32, utilidades)
│   ├── theme.js                 (Tema claro/oscuro)
│   ├── nuclear.js               (Calendario ENRESA: 7 reactores)
│   ├── weather.js               (Clima sintético: solar, viento, temp, hidraulicidad)
│   ├── demand.js                (Demanda sectorial: 7 sectores + autoconsumo)
│   ├── storage.js               (Baterías, bombeo, V2G, degradación)
│   ├── policy.js                (Tope ibérico, CfDs, peajes, capacidad)
│   ├── scenarios.js             (22 escenarios predefinidos: 0-21)
│   ├── simulator.js             (Motor principal: despacho SRMC 12 tecnologías)
│   ├── trajectory.js            (Trayectoria 2026-2035 con estado persistente)
│   ├── montecarlo.js            (Multi-semilla: 9 semillas, percentiles P5/P50/P95)
│   ├── charts.js                (Gráficos Plotly: mix, precios, sankey, trayectorias)
│   ├── ree-data.js              (Datos REE 2025, API Yahoo Finance, PNIEC)
│   └── app.js                   (Controlador Vue: 1537 líneas, toda la lógica UI)
└── docs/
    ├── METHODOLOGY.md            (14 secciones: despacho, calibración, fuentes)
    ├── POLICY.md                 (Documentación de política energética)
    └── DATA-2025.md              (Datos de referencia REE 2025)
```

---

## 2. Análisis de los archivos principales

### js/simulator.js — Motor de simulación (29K+ chars)
- **Despacho por orden de mérito (SRMC)** con 12 tecnologías: nuclear, solar, eólica, offshore, hidráulica fluyente, baterías, bombeo, V2G, hidráulica embalse, importación, CCGT, flex down/deficit.
- **Precio marginal** = SRMC de la última tecnología necesaria.
- **Resultados completos:** mix horario, precios, emisiones, ENS, LOLE, horas sin gas, estrés de red, LCOE/LCOS, KPIs de mercado.
- **Estado persistente:** `estadoBateriaFinal`, `estadoBombeoFinal`, `hidraulicidadMedia` se pasan entre años en la trayectoria.

### js/charts.js — Visualización (23K+ chars)
- Gráficos de mix horario (áreas apiladas), precios (serie temporal, histograma, duración), mensual, Sankey, trayectorias.
- Soporte para modo comparación lado a lado.
- Sparklines en KPI cards.

### js/constants.js — Constantes (10K+ chars)
- PRNG Mulberry32 con Box-Muller para normales.
- Factores de capacidad históricos: solar 18%, eólica 24%, offshore 43%.
- Temperaturas mensuales medias España.
- Colores Aurora para cada tecnología.

### js/app.js — Controlador Vue (38K+ chars)
- 22 escenarios configurables con sliders interactivos.
- 4 tabs principales: Dashboard, Análisis, Trayectoria, Configuración.
- Sub-tabs: escenarios, modelo, política, PNIEC, REE, guía, información.
- Funcionalidades: exportar CSV, copiar config, modo presentación (P), comparación lado a lado, selector fecha REE, simulación de día específico.

---

## 3. Features ocultas / no implementadas

### Funciones que existen pero no se usan directamente en la UI:

1. **`SEF.MonteCarlo.simularMultiSemilla()`** — El módulo `montecarlo.js` está cargado en `index.html` y expuesto en `SEF.MonteCarlo`. **Ahora tiene UI con la mejora #16** (Dashboard Monte Carlo, completada 1/6/2026). Tab "Incertidumbre" con ejecutor, tabla de percentiles y gráficos de banda.

2. **`SEF.REEData.cargarDatosTiempoReal()`** — Se ejecuta automáticamente en `onMounted` y actualiza gas TTF y CO2 desde Yahoo Finance, pero los datos de generación/demanda en tiempo real de ESIOS/REE están **bloqueados por CORS** (la API requiere auth y no soporta CORS). Hay `fetchEsiosData()` que siempre retorna `null` como placeholder.

3. **`SEF.REEData.verificarCumplimientoPNIEC()`** — Función completa que compara resultados con objetivos PNIEC 2024, pero **no se usa en la UI**. Propuesta: mejora #22 (semáforo de cumplimiento PNIEC).

4. **`SEF.Storage.v2gDisponible()`** — Función de V2G implementada pero con un valor muy bajo (0.012 GW máx). Podría ser más visible en el dashboard.

5. **`SEF.Storage.degradeBattery()`** — La degradación de baterías está implementada (2% por 365 ciclos + 1.5%/año calendario) pero **no se muestra ningún KPI de degradación acumulada** en la UI. Propuesta: mejora #23.

### Tabs y secciones comentadas:
- No hay código comentado significativo en los archivos principales.
- El PLAN.md marca 2 items como ⏳ Pendiente: **paradas de recarga nuclear (S7)** y **vista comparativa cierre vs prórroga en UI** (ahora mejora #24).

### Variables no referenciadas en la UI:
- `offshore` — Implementado en el motor pero con capacidad 0 en todos los escenarios. Los proyectos Galicia Offshore y Cantábrico Offshore (1.5 GW cada uno) aparecen en `ree-data.js` pero no se pueden activar. Propuesta: mejora #21.
- `v2gPct` — Parámetro de slider pero el valor máximo de V2G es mínimo (0.012 GW).
- `h2FlexibilidadHoras` — Parámetro en escenarios pero sin control UI dedicado.

### Features del motor headless (motor.mjs) que no tienen contrapartida en UI:
- `--trayectoria` — Ejecuta trayectoria 2026-2035 desde CLI (sí existe en UI).
- `--montecarlo` — Ejecuta Monte Carlo desde CLI (ahora existe en UI con mejora #16).
- `--compacto` — Salida resumida.
- `--kpi=<kpi1,kpi2>` — Filtrado de KPIs.
- `imprimirResumen()` — Resumen legible por consola.

---

## 4. Benchmark de proyectos similares en GitHub

### Proyectos de referencia identificados:

1. **Energy-System-Modeler (ESM) / OSeMOSYS** — Modelado de sistemas energéticos open-source. Features destacadas: análisis de sensibilidad, optimización multi-objetivo, mapas de calor de flujos.

2. **PyPSA (Python for Power System Analysis)** — Simulador de redes eléctricas. Features clave: optimización de despacho con restricciones de red (PTDF), análisis de inversión, integración de datos reales de ENTSO-E.

3. **NREL SAM (System Advisor Model)** — Simulador de energía renovable. Features: análisis financiero (LCOE, NPV, IRR), escenarios climáticos históricos, análisis de riesgo.

4. **Energy Flex App (EU Commission)** — Dashboard de flexibilidad energética. Features: perfiles de demanda flexibles, visualización de curvas de carga, análisis de flexibilidad sectorial.

5. **ENTSO-E Transparency Platform** — Plataforma de datos abiertos del sistema eléctrico europeo. Features: datos horarios reales, predicciones, balance de mercado.

6. **Solar Forecast Arbiter (NREL)** — Herramienta de validación de predicciones solares. Feature clave: comparación de múltiples modelos con métricas de error.

7. **GridX / GridPath** — Planificación de sistemas eléctricos con alta penetración renovable. Features: análisis de confiabilidad (LOLE, ENS), planificación de transmisión, escenarios de descarbonización.

### Features de referencia que podrían inspirar mejoras:

- **Análisis de sensibilidad tornado** (ESM/PyPSA) — Visualizar qué parámetros más afectan a cada KPI. → Mejora #19
- **Curvas de flexibilidad** (Energy Flex App) — Mostrar ventanas de oportunidad para carga flexible. → Mejora #18
- **Análisis financiero** (NREL SAM) — NPV, IRR, payback period por tecnología. → Mejora #29 (LCOE/LCOS)
- **Integración ENTSO-E** — Datos reales de interconexiones y balance. → Mejora #28 (REE enriquecido)
- **Validación de predicciones** (Solar Forecast Arbiter) — Comparar simulación contra datos reales.
- **Análisis de confiabilidad** (GridPath) — LOLE, ENS, EENS con umbrales reguladores. → Mejora #26 (alertas extremos)
- **Mapas de calor de flujos** — Visualizar flujos de energía por región/hora. → Mejora #30 (heatmap vertidos)
- **Degradación de baterías** (NREL SAM) — Monitorización de degradación acumulada. → Mejora #23
- **Exportación PDF profesional** (NREL SAM) — Informes con gráficos y KPIs. → Mejora #20
- **Comparativa internacional** (Ember) — Barras apiladas por país. → Mejora #17
- **Sliders en tiempo real** (Energy-Charts.info) — Ajuste de parámetros con efecto inmediato. → Mejora #27

---

## 5. Tendencias actuales en visualización energética (2025-2026)

### 5.1 Diseño visual
- **Liquid glass / glassmorphism:** Tarjetas semitransparentes con blur de fondo (ya implementado en SEF con Aurora v4)
- **Modo oscuro nativo:** No como añadido, sino como tema principal (SEF lo tiene pero hay que verificar funcionalidad completa)
- **Tipografía Inter:** Fuente sans-serif moderna y legible (ya implementada)
- **Gradientes suaves:** Transiciones de color entre tecnologías (SEF usa colores sólidos, podría beneficiarse de gradientes)
- **Microanimaciones:** Transiciones suaves al cambiar entre escenarios (implementado en mejora #10)

### 5.2 Visualización de datos
- **Áreas apiladas:** Para mostrar mix energético (ya implementado en SEF)
- **Curvas de duración:** Para precios y demanda (ya implementado)
- **Heatmaps temporales:** Mes x hora para patrones de generación/demanda/vertidos (NUEVO → mejora #30)
- **Gráficos de sankey:** Para flujos de energía (implementado en mejora #9)
- **Indicadores de intensidad de carbono:** gCO2/kWh en tiempo real (implementado en mejora #3)
- **Barras comparativas:** Año actual vs año anterior (ya implementado)
- **Mini gráficos sparkline:** Para tendencias rápidas (implementado en mejora #6)
- **Curvas de flexibilidad:** Ventanas de oportunidad para carga flexible (NUEVO → mejora #18)
- **Gráficos de tornado:** Análisis de sensibilidad (NUEVO → mejora #19)
- **Barras de capacidad instalada:** Evolución de capacidad (NUEVO → mejora #25)

### 5.3 Interacción
- **Zoom y filtrado temporal:** Seleccionar rangos de tiempo (parcialmente implementado con selector de semana)
- **Comparación lado a lado:** Dos escenarios simultáneos (implementado en mejora #7)
- **Exportación de datos:** CSV/JSON (CSV implementado en mejora #2)
- **Exportación PDF:** Informes profesionales (NUEVO → mejora #20)
- **Compartir configuración:** URL con parámetros (parcial: copiar config JSON)
- **Modo presentación:** Pantalla completa con KPIs grandes (implementado en mejora #5)
- **Sliders en tiempo real:** Ajuste de parámetros con efecto inmediato (NUEVO → mejora #27)

### 5.4 Arquitectura
- **Sin build system:** HTML estático + CDN (SEF lo hace bien)
- **Service Worker:** Para modo offline (implementado en mejora #11)
- **API de datos:** Fetch a fuentes oficiales con caché (parcial: Yahoo Finance en mejora #12)
- **Motor headless:** Ejecutable en Node.js (implementado en mejora #13)
- **Tests automatizados:** Vitest (implementado en mejora #14)
- **CI/CD:** GitHub Actions (implementado en mejora #15)

---

## 6. 14 ideas concretas de mejora añadidas en FASE 4

| # | Mejora | Dificultad | Inspiración | Prioridad |
|---|--------|-----------|-------------|-----------|
| 17 | Panel comparación internacional España vs Europa | 🟡 Media | Ember, Energy-Charts | Alta |
| 18 | Curvas de flexibilidad y ventanas de oportunidad | 🟡 Media | EU Energy Flex App | Media-Alta |
| 19 | Análisis de sensibilidad tornado | 🔴 Alta | ESM/OSeMOSYS, PyPSA | Alta |
| 20 | Exportar informes en PDF con @media print | 🔵 Baja | NREL SAM, IEA | Media |
| 21 | Activar eólica offshore con slider dedicado | 🔵 Baja | Backend existente | Alta |
| 22 | Semáforo de cumplimiento PNIEC | 🔵 Baja | Función existente | Media-Alta |
| 23 | Indicador degradación baterías acumulada | 🔵 Baja | NREL SAM | Baja |
| 24 | Vista comparativa cierre vs prórroga nuclear | 🟡 Media | Comparación existente | Media-Alta |
| 25 | Gráfico evolución capacidad instalada 2026-2035 | 🟡 Media | Ember, IEA | Media |
| 26 | Alertas de eventos extremos en trayectoria | 🟡 Media | National Grid ESO | Media |
| 27 | Modo "qué pasaría si" con sliders en tiempo real | 🔴 Alta | Energy-Charts.info | Alta |
| 28 | Panel REE enriquecido con generación horaria | 🟡 Media | Energy-Charts.info | Media |
| 29 | Comparativa LCOE/LCOS por tecnología | 🟡 Media | NREL SAM, IEA | Media-Alta |
| 30 | Visualización vertidos con heatmap horario | 🟡 Media | Heatmaps modernos | Media |

---

## 7. Resumen comparativo

**Estado del proyecto:** 16/30 mejoras completadas (53%).  
**Mejoras pendientes:** 14 (4 nuevas por dificultad baja, 8 media, 2 alta).  
**Fuentes investigadas en FASE 4:** Ember, Energy-Charts.info, ElectricityMap, National Grid ESO, NREL SAM, EU Energy Flex App, ESM/OSeMOSYS, PyPSA.  
**Tendencias 2025-2026 identificadas:** Heatmaps temporales, curvas de flexibilidad, barras de capacidad, gráficos de tornado, semáforos de cumplimiento, sliders en tiempo real, exportación PDF profesional, alertas de eventos extremos, LCOE/LCOS por tecnología.
