---
name: esios-dashboard
description: "Proyecto completo de dashboard energético español con datos ESIOS/REE — server, frontend, PDF, Telegram cron, deploy NaN."
version: 2.3.0
author: Ntizar
---

# ESIOS Dashboard

Proyecto completo de dashboard energético español con datos ESIOS/REE.

## Ubicación

- **Repo**: `/root/workspace/esios-dashboard` (clon de `Ntizar/esios-dashboard`)
- **URL pública**: `https://esios-dashboard-ntizar-ntizar.apps.nan.builders`
- **Puerto NaN**: 4000
- **Koldo sync**: `/hermes-home/skills/koldo/esios-dashboard`

### Arquitectura del Dashboard Principal (v3.0 — 2026-05-28)

### Pestaña Precio — Pool vs PVPC (v2.3 — mayo 2026)

La pestaña Precio se ha enriquecido con una **comparativa completa Pool OMIE vs PVPC**:

**Indicadores:**
- **Pool OMIE**: ID 600 — Precio mercado SPOT Diario (€/MWh, DIRECTO)
- **PVPC 2.0TD**: ID 1001 — Precio voluntario pequeño consumidor (€/MWh, DIRECTO)

**Qué se muestra (en orden, de arriba a abajo en la pestaña):**

1. **Panel explicativo 📚** con:
   - Columna Pool OMIE vs PVPC con descripciones
   - **Desglose de componentes**: Pool + Restricciones + Intradiarios + Secundaria + Desvíos + Capacidad + Peajes = PVPC
   - Cada componente como badge con tooltip explicativo

2. **Gráfico comparativo "Pool vs PVPC"** (`chartPoolVsPvpc`):
   - Doble línea: Pool en azul sólido (#2563eb) + PVPC en naranja punteado (#f97316)
   - Tooltip muestra ambas series + diferencia calculada en footer
   - Interacción: mode='index' para comparar hora a hora

3. **Gráfico de diferencia "PVPC − Pool"** (`chartDiferenciaPool`):
   - Barras coloreadas: azul si < media, naranja si > media
   - Tooltip muestra Pool → PVPC (€/MWh) en detalle
   - El usuario ve de un vistazo los componentes adicionales del PVPC

4. **Gráfico PVPC original** (se mantiene con área sombreada)

5. **Histograma de distribución de precios** (se mantiene)

**Métricas de resumen:**
- Subtítulo de precio muestra: `Pico: X · Valle: Y €/MWh · Diferencia: Z €`
- Backend devuelve `pool_medio`, `pool_pico`, `pool_valle` en el resumen

**Tabla horaria:**
- Nueva columna `Pool €/MWh` a la izquierda del PVPC

**Previsión ocultada:**
- La pestaña de Previsión está comentada en HTML (`<!-- Previsión ocultada -->`) — lista para reactivar cuando esté disponible, sin borrar el código

**Para implementar esta extensión en otro proyecto:**
1. En `summary.service.js`:
   - Añadir `pool: 600` a TELE_IDS
   - Añadir `fetchIndicator(TELE_IDS.pool, fecha, token)` después de precioData
   - Añadir `poolData` al destructuring
   - Añadir `const pool = buildHourlySeries(TELE_IDS.pool, poolData, fecha)`
   - Añadir `mergeSeries(hourlyMap, pool, 'pool')`
   - Añadir `pool_medio/pool_pico/pool_valle` al resumen
   - Repetir en `buildSummary5min` (mismo patrón)
2. En `render.js`:
   - Antes del chartPrecio existente, crear chartPoolVsPvpc (Chart.js type:'line', 2 datasets)
   - Crear chartDiferenciaPool (Chart.js type:'bar' con colores dinámicos)
   - En `renderMetrics`, añadir cálculo de diferencia en el subtítulo de precio
3. En `render-final.js`:
   - Añadir columna `pool` al array `tableColumns` (antes de precio)
4. En `index.html`:
   - Añadir card con panel explicativo (`.pool-pvpc-explanation`, `.components-breakdown`)
   - Añadir `chartPoolVsPvpc` y `chartDiferenciaPool` en sus chart-cards
   - Comentar la pestaña previsión: `<!-- <button ...>🔮 Previsión</button> -->`
   - Comentar la sección previsión: `<!-- <div id="section-prevision"> ... </div> -->`
5. CSS necesario: `.pool-pvpc-explanation`, `.pool-def`, `.pvpc-def`, `.components-breakdown`, `.component-tag`, `.component-tag.pool-tag`, `.component-tag.plus`, `.component-eq`

### Estructura de HTML
- 5 tabs visibles: Resumen, Precio, Demanda, Mix, Interconexiones
- Previsión ocultada (comentada en HTML) — reactivar quitando comentarios
- Selector de fechas: botones ◀ 📅 ▶ + día seleccionado visible
- NO usar `fechaInput` DOM element — usar `AppState.fecha` directamente
- Todas las tecnologías visibles: Nuclear, CC, Carbón, Cogeneración, Hidráulica, Solar FV, Solar Térmica, Eólica

### Patrón AppState.fecha (CRÍTICO)
- NUNCA referenciar `document.getElementById('fechaInput')` en el código
- Todas las funciones usan `AppState.fecha` como fuente de verdad
- `setupDateNavigation()` usa `AppState.fecha` directamente con botones ◀ 📅 ▶
- `cargarDatos()` lee `AppState.fecha || getMadridDateStr()`
- `setupKeyboardShortcuts()` usa `AppState.fecha` directamente
- `state.js` NO referencia `fechaInput` — solo lee/escribe `AppState`

### Scripts de frontend (orden de carga)
1. `config.js` — constantes, INDICATORS_CONFIG, techMap
2. `state.js` — AppState + persistencia
3. `utils.js` — helpers (formatNum, fmtHora, etc.)
4. `api.js` — cliente fetch
5. `ui.js` — tabs, keyboard shortcuts (NO range buttons)
6. `data.js` — cargarDatos, renderAll, setupDateNavigation
7. `render.js` — renderMetrics, renderTechCards, renderGeneracionMix, etc.
8. `render-charts.js` — gráficos adicionales
9. `render-final.js` — CO2 tracker, tabla horaria (sin init duplicado)

### ⚠️ Pitfall: múltiples DOMContentLoaded handlers
Tanto `data.js` como `render-final.js` tienen `DOMContentLoaded`. El de `render-final.js` llama a `cargarDatos()` que debe estar definido. Como `data.js` carga ANTES, `cargarDatos` está en scope global. Si hay error en `data.js` (ej: CDN falla), `cargarDatos` no se define → `ReferenceError`.

### ⚠️ Pitfall: render-final.js NO duplica init
El `DOMContentLoaded` en `render-final.js` debe ser mínimo: solo el botón de carga y auto-refresh. Todo el init (loadState, setupTabs, setupDateNavigation, setupKeyboardShortcuts) va en `data.js`.

## Arquitectura v2.0 (modular por dominios)

```
esios-work/
├── server.js              ← Bootstrap Express + routing (647 líneas)
├── src/
│   ├── config/
│   │   └── env.js         ← Validación estricta de variables de entorno
│   ├── shared/
│   │   ├── time/madrid.js ← Centraliza Europe/Madrid
│   │   └── io/csv.repository.js ← FS async para CSV
│   ├── infra/
│   │   ├── clients/esios.client.js ← HTTP client con retry/backoff/jitter + disk cache
│   │   ├── clients/nan.client.js   ← HTTP client para NaN/LLM API
│   │   ├── cache/memory-cache.js   ← Cache memoria con métricas
│   │   └── cache/disk-cache.js     ← Cache disco persistente (TTL 5 min)
│   ├── domains/
│   │   ├── energy/energy.service.js       ← Lógica energía principal
│   │   ├── energy/summary.service.js      ← Builder de resúmenes diarios
│   │   ├── forecast/montecarlo.service.js ← Simulación Monte Carlo
│   │   └── reports/report.service.js      ← Informes IA + PDF
│   └── jobs/
│       ├── refresh.job.js
│       ├── telegram.job.js
│       └── daily-report.job.js
├── public/
│   ├── index.html           ← HTML mínimo (223 líneas)
│   ├── css/styles.css       ← Estilos extraídos
- `public/js/cache-bust.js` — Script de cache-busting dinámico (inyecta ?v=timestamp en otros scripts)
│       ├── api.js           ← Cliente fetch con AbortController
│       ├── config.js        ← Indicadores, techMap, constantes
│       ├── state.js         ← AppState + persistencia localStorage/URL
│       ├── utils.js         ← Helpers (formatNum, fmtHora, etc.)
│       ├── ui.js            ← Range buttons, tabs, keyboard
│       ├── data.js          ← cargarDatos + renderAll orquestador
│       ├── render.js        ← Metrics, cards, gráficos principales
│       ├── render-charts.js ← Monte Carlo, gen real, interconexiones
│       └── render-final.js  ← CO2 tracker, tabla horaria, init
├── tests/                   ← Jest: 24 tests pasando
│   ├── api.test.js          ← 8 tests integración endpoints
│   ├── env.test.js          ← 2 tests variables entorno
│   ├── time.test.js         ← 3 tests timezone Madrid
│   └── utils.test.js        ← 11 tests utilidades datos
├── scripts/
│   └── fetch-all-indicators.js  ← Usa ESIOS_API_TOKEN env (NO hardcode)
└── data/                    ← CSV cache + PDF cache
```

## Notas de arquitectura

- **CommonJS estricto**: Todo usa `require()`/`module.exports`. NO usar ESM.
- **Sin autollamadas HTTP internas**: Los endpoints llaman servicios de dominio directamente.
- **Todo I/O async**: `fs/promises` en toda la pila.
- **Helmet + CORS whitelist**: No CORS abierto.
- **Método de arranque**: `node server.js` (no `npm start` en prod).

## Endpoints API

| Endpoint | Descripción |
|---|---|
| `GET /api/esios/summary?fecha=YYYY-MM-DD` | Todo combinado (precios, demanda, generación, CO2, interconexiones, previsión) |
| `GET /api/esios/precios` | PVPC por hora |
| `GET /api/esios/demanda` | Demanda real + prevista |
| `GET /api/esios/generacion` | Generación medida por tecnología |
| `GET /api/esios/generacion-real` | Gen renovable vs no renovable |
| `GET /api/esios/co2` | CO2 específico (t/MWh) |
| `GET /api/esios/interconexiones` | Francia, Portugal, Marruecos |
| `GET /api/esios/prevision` | Previsión eólica y solar D+1 |
| `GET /api/esios/prediccion` | Monte Carlo precios |
| `GET /api/esios/informe` | Informe Qwen/LLM |
| `GET /api/esios/pdf?fecha=YYYY-MM-DD` | PDF diario |
| `POST /api/esios/refresh` | Fuerza fetch y guarda CSV |
| `GET /api/esios/test-token` | Diagnóstico: verifica si token ESIOS funciona |
| `GET /api/esios/cache-stats` | Stats cache disco + memoria |
| `POST /api/esios/cache-clear` | Limpia todo el cache (disco + memoria) |
| `GET /healthz` | Health check |
| `GET /readyz` | Readiness (verifica tokens) |

## Indicadores ESIOS clave

Para la guía COMPLETA y actualizada de IDs y unidades, consultar la skill `esios-api`.

| ID | Nombre | Unidad |
|---|---|---|
| 1001 | PVPC 2.0TD | €/MWh |
| 600 | Precio mercado SPOT Diario (Pool OMIE) | €/MWh |
| 1293 | Demanda real | MW |
| 10035 | Gen medida Hidráulica | MWh (→ MW /1000) |
| 10037 | Gen medida Eólica | MWh (→ MW /1000) |
| 10041 | Gen medida Otras renovables | MWh (→ MW /1000) |
| 10205 | Gen medida solar | MW (NO kWh) |
| 10206 | Gen T.Real Solar | MW (NO kWh) |
| 4 | Nuclear programada | MWh/periodo |
| 9 | CC programada | MWh/periodo (1 valor/día) |
| 10351 | Gen T.Real renovable | MW (NO kWh) |
| 10352 | Gen T.Real no renovable | MW (NO kWh) |
| 10006 | Gen libre CO2 | MW (NO porcentaje) |
| 10355 | CO2 asociado gen real | tCO₂/h (NO tCO₂/MWh) |
| 10207 | Intercon Francia (telemedida) | MWh (→ MW /1000) |
| 10208 | Intercon Portugal (telemedida) | MWh (→ MW /1000) |
| 2052 | Demanda prevista nacional | MW |
| 1777 | Previsión D+1 eólica | MW |
| 1779 | Previsión D+1 fotovoltaica | MW |
| 10358 | Previsión D+1 renovable total | MW |

**IDs que ya NO existen:** 460 (previsionDemanda), 541 (previsionEolica), 10350 (no es previsión).
**IDs de interconexión incorrectos:** 10014 (P48), 10015 (P48) → usar 10207, 10208 (telemedida).

## Referencia de indicadores completa

El archivo `data/esios-indicator-index.json` contiene los 2018 indicadores con unidades, tipos y descripciones. **Siempre validar IDs contra este archivo** antes de hardcodear. El archivo está también en `references/esios-indicator-reference.md` con una tabla resumida de los IDs críticos.

## ⚠️ Reglas críticas

1. **Unidades ESIOS**: Los indicadores de telemedida (10035, 10037, 10041, 10043, 10207, 10208) devuelven **MWh**, NO kWh ni MW. Siempre dividir entre 1000.
2. **⚠️ `genOtrasRenMedida`**: ID 10041 (medida), NO 10042 (P48 programada). Usar 10042 causa datos null/incorrectos.
3. **CO2 Libre (10006)**: NO es porcentaje ni kWh — es `MW` según esios-indicator-index.json.
4. **CO2 Real (10355)**: Es `tCO2/h` (tasa horaria), NO tCO₂/MWh.
5. **Ciclo Combinado (9)**: Solo 1 valor diario (programación PBF), no por hora.
6. **CO2 total estimado** = `gen_total_MWh * factor_específico_CO2`.
7. **Previsión D+1**: Usar IDs 2052, 1777, 1779, 10358. NUNCA 460, 541, 10350.

## Deploy en NaN

- Push a `main` → auto-deploy con Kaniko
- Variables de entorno: `ESIOS_API`, `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Puerto: 4000 (configurado en Dockerfile y server.js)

## ⚠️ Pitfall: Siempre hacer `git push` + verificar deploy tras cambios locales

El dashboard se despliega en GitHub → NaN.builders mediante auto-deploy con Kaniko. Los cambios locales en `/root/workspace/esios-dashboard/` **no se reflejan en producción hasta que se hace push a GitHub y NaN reconstruye el contenedor**.

**Flujo correcto** tras cualquier cambio local:
```bash
cd /root/workspace/esios-dashboard
git add -A
git commit -m "feat: descripción del cambio"
git push origin main
# Esperar 10-30s a que NaN reconstruya (GitHub webhook → Kaniko build → redeploy)
# Verificar: curl https://esios-dashboard-ntizar-ntizar.apps.nan.builders/healthz
# Si el uptime es bajo (< 60s), el nuevo contenedor está sirviendo
```

**Si no se despliega tras push** (el contenedor antiguo sigue corriendo):
```bash
git commit --allow-empty -m "chore: trigger redeploy NaN"
git push origin main
```

**Verificar que el nuevo código se sirve:** comprobar que el HTML incluye los cambios esperados:
```bash
curl -s https://esios-dashboard-ntizar-ntizar.apps.nan.builders/ | grep -c 'característica_nueva'
```

## 📚 Referencias

- `references/dashboard-architecture-v3.md` — Arquitectura del dashboard principal v3.0 (tabs, AppState.fecha, orden de scripts)
- `references/tdz-and-promise-all-fix.md` — Guía de TDZ errors y anti-patrones Promise.all con ejemplos de código

## Simuladores del Sistema Eléctrico

### SistemaElectricoFuturo (Ntizar, repo propio) ⭐1
**URL:** https://ntizar.github.io/SistemaElectricoFuturo/ | **v3.5** | **MIT**
Simulador interactivo del sistema eléctrico español con horizonte 2026-2035. Combina simulación anual de 8.760 horas con trayectoria multianual.

**18 escenarios:** cierre ENRESA, VE masivo, autoconsumo 30 GW, crisis gas, ley climática, sequías, ola de calor, datos REE reales...
**Stack:** Vue 3 + Plotly + Ntizar Aurora v5 + Liquid Glass
**Características:** demanda sectorial, calendario nuclear ENRESA, almacenamiento avanzado (degradación baterías, bombeo, V2G), política energética (tope ibérico, CfDs, peajes dinámicos, PVPC), **datos REE en tiempo real + normativa vigente + informes CNMC**

### Patrón: Añadir sección "Datos en Tiempo Real + Normativa" a un simulador estático

Cuando quieras enriquecer un dashboard/ simulador con datos oficiales actuales, normativa y regulatory framework:

1. **Crear archivo independiente** (`js/ree-data.js`) con datos estructurados:
   - Demanda real y prevista (MW)
   - Estructura de generación por tecnología (capacidad, generación TWh, % participación, tendencia)
   - Normativa vigente (leyes, RD, planes, mecanismos) con estado e impacto
   - Informes oficiales (CNMC, REE, comisiones)
   - Indicadores de mercado (precios, CO₂, interconexión)
   - Objetivos PNIEC/planificación

2. **Crear pestaña en el sidebar** del dashboard:
   - Añadir tab al array SIDE_TABS en setup de Vue
   - Renderizar secciones HTML con los datos del módulo
   - Usar computed properties para formatear (reeGeneracion, reeNormativa, reeInformes…)

3. **Cargar en onMounted()**:
   ```javascript
   const reeData = ref(null);
   const reeGeneracion = ref([]);
   // ...
   onMounted(() => {
     const datos = SEF.REEData.obtenerDatosREE();
     reeData.value = datos.demandaActual;
     // Formatear tablas y arrays...
   });
   ```

4. **Exponer en return** del setup de Vue:
   ```javascript
   return { reeData, reeGeneracion, reeNormativa, reeInformes, reeMercado, reePniec, ... };
   ```

5. **CSS dedicado** `css/ree-data.css` — tarjetas glass, progress bars, tendencias

6. **Documentación complementaria**:
   - `docs/POLICY.md` → marco legal completo con tablas de normativa
   - `docs/DATA-2025.md` → datos reales con fuentes y tablas

### ⚠️ Pitfall: Modularidad de los datos de normativa
- No mezclar datos estáticos con la lógica del simulador (simulator.js)
- Usar un módulo aparte (ree-data.js) que se carga ANTES que app.js
- Los datos de normativa e informes cambian con el tiempo — documentar fecha de última actualización

### electriciPy_market (cristobal-GC) ⭐31
Simulador de mercado eléctrico simplificado para educación. Python.
**Conceptos:** merit order, supply/demand clearing, bidding estratégico, dispatch, costes, penalizaciones, forecast eólica/solar, restricciones técnicas.

### TrEnergIA / hackaton1 (Ntizar, repo propio)
Gemelo energético ferroviario: GTFS local → circulaciones → consumo por viaje → optimización vs mix ESIOS horario.
**Score:** `0.5*renovable - 0.3*CO2 - 0.2*precio`
**Output:** dashboard HTML con mapa OSM, gráficas, auditoría.json
- `references/mega-audit-2026-05-26.md` — Auditoría técnica completa y bloque F (tests Jest, pitfalls CommonJS)
- `references/esios-indicator-reference.md` — IDs críticos verificados contra esios-indicator-index.json con reglas de unidades
- `references/cache-busting-pattern.md` — Patrón de cache-busting dinámico (endpoint server + headers)
- `references/disk-cache-pattern.md` — Caché persistente en disco para reducir peticiones API ESIOS

## 📁 Estructura de caché

- `data/esios-cache/{id}_{fecha}.json` — Cache disco (TTL 5 min, reduce peticiones API ~95%)
- `data/` — CSVs originales, PDFs cache, índices de indicadores

## 🔧 Troubleshooting

> Para problemas de deploy NaN (502, cache stale, env vars), ver skill `nan-deploy`.

### 502 Bad Gateway en `/api/esios/summary`

Causas posibles (en orden de frecuencia):

1. **TDZ error (const usado antes de declarar)**: El `summary` tiene 30+ variables `const`. Si una se usa antes de su declaración, el proceso Node.js crasha instantáneamente (502 en <1s). **Siempre verificar orden de declaraciones** en bloques grandes de código.
2. **Promise.all sin tolerancia**: 30 llamadas en paralelo donde una falla derrumba todo. **Usar wrapper try/catch individual** para cada llamada.
3. **Token ESIOS inválido (403)**: Verificar con `curl` directo a `api.esios.ree.es`. Si el token da 403, renovarlo en https://www.esios.ree.es/es/api.
4. **Timeout de Cloudflare**: Si el backend tarda >30s, Cloudflare devuelve 502. Reducir timeout de `esiosFetch` a 8s para fallar rápido.

### Frontend no muestra datos aunque API responde 200

- **Cache del navegador**: El HTML puede servir versión vieja. Añadir headers `Cache-Control: no-cache` para `.html` y `/` en el server Express.
- **Verificar con curl directo**: `curl https://dashboard/api/esios/summary?fecha=YYYY-MM-DD` — si devuelve datos pero el frontend no, es problema de frontend (JS error, cache, o renderAll fallando).
- **Verificar overlay de loading**: Si el spinner persiste, el `showLoading(false)` no se ejecutó. Revisar si hay error antes del `finally` en `cargarDatos()`.

### Diagnóstico rápido

```bash
# 1. Verificar que el backend responde
curl -s https://dashboard/readyz

# 2. Verificar endpoint individual (si funciona pero summary no → TDZ o Promise.all)
curl -s "https://dashboard/api/esios/precios?fecha=2026-05-25"

# 3. Verificar summary
curl -s -w "HTTP:%{http_code}" "https://dashboard/api/esios/summary?fecha=2026-05-25"

# 4. Verificar token ESIOS directamente
curl -s "https://api.esios.ree.es/indicators/1001?start_date=2026-05-25T00:00:00+02:00&end_date=2026-05-25T23:59:59+02:00&time_trunc=hour" \
  -H "x-api-key: $ESIOS_API" -H "Accept: application/json" | head -c 100
```

### ⚠️ Pitfall: `shouldFetchPrediccion` — pasar la misma fecha, no el día siguiente

El endpoint `/api/esios/prediccion` recibe una fecha y hace Monte Carlo con los **7 días previos** de historial. El frontend NUNCA debe pasar `getTomorrowStr(fecha)`.

**Incorrecto**: `apiFetch('prediccion', getTomorrowStr(fechaFinal))` → 502 si el día siguiente no tiene datos.
**Correcto**: `apiFetch('prediccion', fechaFinal)` → usa historial de 7 días antes de la fecha seleccionada.

La función `shouldFetchPrediccion(fecha)` en `utils.js` debe devolver true para cualquier fecha dentro de los últimos 7 días (el Monte Carlo siempre tiene historial suficiente).

### ⚠️ Pitfall: El endpoint `/api/esios/prediccion` funciona con cualquier fecha válida

El endpoint de Monte Carlo **NO necesita datos futuros**. Recibe una fecha y usa los 7 días previos de historial para simular precios. Por tanto:
- Si el usuario selecciona **hoy** → pedir prediccion para **hoy** (funciona, usa historial de los 7 días anteriores)
- Si el usuario selecciona **ayer** → pedir prediccion para **ayer** (funciona)
- Si el usuario selecciona **días anteriores** → pedir prediccion para esa fecha (funciona si tiene 7 días de historial)

**NUNCA pasar `getTomorrowStr(fecha)`** — eso siempre falla porque el día siguiente no tiene datos de ESIOS.

### ⚠️ Pitfall: `activeTechKeys` debe definirse en `config.js`

La función `activeTechKeys(summary)` filtra las tecnologías con datos reales (> 0). Si no está definida, `renderGeneracionMix()` falla con "activeTechKeys is not defined" → página en blanco.

### ⚠️ Pitfall: Cache del navegador — `?v=` + `Cache-Control`

Los archivos JS del frontend se sirven sin cache-busting → el navegador sirve versión antigua → errores de "is not defined" o "is not a function".

**Solución**:
1. Añadir `?v=202605260830` (timestamp) a todos los `<script src>` en `index.html`
2. Añadir `Cache-Control: no-cache, no-store, must-revalidate` para `.js` en el Express middleware
3. El usuario debe hacer **Ctrl+Shift+R** (recarga forzada)

### ⚠️ Pitfall: Datos null → página en blanco

Si `summary.valores` tiene 24 filas pero todos los valores son `null` (token inválido, fecha sin datos, etc.), `renderAll()` no detecta el estado vacío y renderiza gráficos vacíos.

**Solución**: Añadir check `hasRealData` en `renderAll()`:
```javascript
const hasRealData = v.some(d => d.precio !== null && d.precio !== undefined);
if (!hasRealData) { /* mostrar empty-state con mensaje */ return; }
```

### ⚠️ Pitfall: Error handlers globales en frontend

Sin `window.addEventListener('error')` → errores JS silenciosos. Siempre añadir:
```javascript
window.addEventListener('error', (e) => {
  console.error('[Frontend Error]', e.message, 'at', e.filename + ':' + e.lineno);
  showToast('⚠️ Error: ' + e.message, 'error');
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason);
});
```

### ⚠️ Pitfall: `hasRealData` check demasiado agresivo en `renderAll()`

NUNCA bloquear el renderizado completo si los datos vienen null. Si `summary.valores` tiene 24 filas pero todos los campos son `null` (token inválido, fecha sin datos), **no hacer return prematuro** — los renderers individuales ya manejan null mostrando "—".

**Incorrecto**: `const hasRealData = v.some(d => d.precio !== null); if (!hasRealData) { return; }` → pantalla en blanco.
**Correcto**: Eliminar el check `hasRealData`. Dejar que los renderers manejen null individualmente. Si no hay datos, se ven "—" en los campos. Si hay datos parciales, se ven los que hay.

### ⚠️ Pitfall: Cache del navegador — `?v=` + `Cache-Control`

Los archivos JS del frontend se sirven sin cache-busting → el navegador sirve versión antigua → errores de "is not defined" o "is not a function".

**Solución** (en orden de robustez):

1. **Endpoint server con timestamp dinámico** (RECOMENDADO, probado y funciona):
   - Servidor: `app.get('/js/cache-bust.js', ...)` que responde JS con `Date.now()` incrustado
   - HTML: `<script src="/js/cache-bust.js"></script>` antes de los otros scripts
   - El script inyecta `?v=timestamp` en todos los `script[src^="js/"]`
   - Cada carga de página genera timestamp nuevo → navegador SIEMPRE descarga JS nuevos
   - Ver: `references/disk-cache-pattern.md`

2. **`Cache-Control: no-cache, no-store, must-revalidate`** para `.js` en el Express middleware.

3. **`?v=timestamp` estático** en `<script src>` (fallback, pero el navegador puede cachear).

4. El usuario debe hacer **Ctrl+Shift+R** (recarga forzada) como último recurso.

**⚠️ NO usar inline script en index.html** — el script inline se ejecuta antes de que los `<script src>` se carguen, pero puede causar problemas de orden. El endpoint server es más robusto.

### ⚠️ Pitfall: Error handlers globales en frontend

Sin `window.addEventListener('error')` → errores JS silenciosos. Siempre añadir:
```javascript
window.addEventListener('error', (e) => {
  console.error('[Frontend Error]', e.message, 'at', e.filename + ':' + e.lineno);
  showToast('⚠️ Error: ' + e.message, 'error');
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason);
});
```

### ⚠️ Pitfall: Debugging — renderAll falla silenciosamente

Cuando el dashboard carga pero está en blanco, el problema suele ser un error en una de las funciones de render. Añadir `console.log` con prefijo `[renderAll]` antes y después de CADA función:

```javascript
function renderAll(summary, prediccion, ayer, multi) {
  console.log('[renderAll] summary.valores.length =', (summary.valores || []).length);
  try {
    renderMetrics(summary);
    console.log('[renderAll] renderMetrics OK');
    renderTechCards(summary);
    console.log('[renderAll] renderTechCards OK');
    // ... cada función con su log
  } catch (err) {
    console.error('[renderAll] ERROR:', err);
    showToast('⚠️ Error al renderizar: ' + err.message, 'error');
  }
}
```

El usuario abre F12 → Console y ve exactamente qué función falla.

### ⚠️ Pitfall: Funciones helper ausentes en utils.js

Al reescribir `utils.js`, es fácil eliminar funciones que otros módulos necesitan (`formatNum`, `numericValues`, `average`, `fmtHora`, `hourlySeries`, `priceColor`, `getMadridHour`). **Siempre verificar que TODAS las funciones llamadas por render.js, render-charts.js y render-final.js estén definidas en utils.js o config.js.**

**Procedimiento seguro al editar utils.js:**
1. Antes de reescribir, hacer `git show HEAD:public/js/utils.js > /tmp/utils-backup.js`
2. Tras los cambios, verificar con: `grep -oP 'function \K[a-zA-Z_]+' public/js/utils.js`
3. Comparar con las funciones llamadas en render*.js: `grep -oP 'function \K[a-zA-Z_]+' public/js/render*.js`
4. Cualquier función llamada pero no definida → CRASH silencioso → página en blanco

### ⚠️ Pitfall: Token ESIOS inválido → datos null → pantalla en blanco

Si el token ESIOS_API_TOKEN en NaN Spaces es inválido o no está configurado, el backend devuelve `{valores: 24 filas, todos null}`. El frontend renderiza pero la pantalla se ve en blanco porque todos los valores son "—".

**Solución en 3 capas:**
1. **Backend**: Endpoint `/api/esios/test-token` que verifica si el token funciona devolviendo datos reales
2. **Frontend**: Check `hasRealData` en `renderAll()` que detecta si `precio` es null en todas las filas y muestra mensaje informativo con icono 🔑
3. **Server**: `console.error('[ESIOS] summary error:', err.message)` en catch del summary para visibilidad en logs

**Diagnóstico**: `curl https://<app>/api/esios/test-token` debe devolver `{"ok":true,"token":"ok",...}`. Si devuelve `ok:false`, el token no funciona.

### ⚠️ Pitfall: Peticiones masivas a ESIOS — violan reglas de uso

El token ESIOS prohíbe *"peticiones masivas, redundantes o innecesarias"*. Cada recarga del dashboard hacía 30+ peticiones API.

**Solución**: `src/infra/cache/disk-cache.js` — caché persistente en disco con TTL 5 min:
- Primera carga: 30 peticiones API + 30 writes en disco
- Recargas siguientes: 0 peticiones API (todo desde disco)
- Tras 5 min: 30 peticiones API (cache expirado)
- Reduce ~95% las peticiones a ESIOS

**Verificar cache**: `curl https://<app>/api/esios/cache-stats` → `{disk: {files, size}, memory: {hits, misses, hitRate}}`
**Limpiar cache**: `curl -X POST https://<app>/api/esios/cache-clear`

### ⚠️ Pitfall: CO2 tracker demasiado complejo para su valor

El CO2 tracker (`renderCO2` + `renderCO2Tracker` + tabla horaria + barra de progreso) añadía 50+ líneas de código frontend sin aportar valor significativo al usuario.

**Decisión**: Eliminar el tracker de CO2. Dejar solo las métricas básicas de CO2 en `renderMetrics` (si existen). El gráfico de CO2 y la tabla horaria se ocultan con `display: none`.

**Si se necesita CO2 en el futuro**: Añadir como tab opcional separada, no como parte del dashboard principal.

### Frontend se queda en spinner infinito (iOS Safari)

**Síntoma**: El dashboard muestra "Cargando datos energéticos..." indefinidamente en iPhone/iPad.

**Causa**: Safari en iOS cachea agresivamente el HTML. Si el frontend se actualizó pero el navegador sirve versión vieja, el código JS antiguo no funciona con el backend nuevo.

**Solución** (en este orden):

1. **Configuración → Safari → Avanzadas → Activar "Experiencia de usuario"**
2. **Volver al dashboard → Mantener pulsado el botón de recarga (⟳) → "Vaciar caché"**
3. Recargar la página

Si no funciona:
- **Configuración → Safari → Eliminar historial y datos de sitios web**

**Prevención**: El server Express ya incluye `Cache-Control: no-cache, no-store` headers para `.html` y `/` en `server.js` (añadido en fix de mayo 2026). Esto debería prevenir el problema, pero Safari a veces ignora estos headers.

## Cron Telegram

- Job ID: `9e7570152a99` (esios-daily-telegram)
- Schedule: `0 7 * * *` (07:00 UTC diario)
- Script: `scripts/esios-telegram.js`
- Envía resumen con precios, generación, CO2, interconexiones

### ⚠️ Pitfall: Script requiere env vars explícitas en cron

`scripts/esios-telegram.js` lee `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` de `process.env`, pero **no se heredan automáticamente** en sesiones cron (no_agent o agent-driven).

**Solución** — pasar las vars explícitamente al ejecutar:

```bash
export TELEGRAM_BOT_TOKEN=$(cat /proc/1/environ 2>/dev/null | tr '\0' '\n' | grep '^TELEGRAM_BOT_TOKEN=' | sed 's/^TELEGRAM_BOT_TOKEN=//')
export TELEGRAM_CHAT_ID="7288273982"
export ESIOS_API=$(cat /proc/1/environ 2>/dev/null | tr '\0' '\n' | grep '^ESIOS_API=' | sed 's/^ESIOS_API=//')
node /root/workspace/esios-work/scripts/esios-telegram.js
```

El `TELEGRAM_BOT_TOKEN` vive en `/proc/1/environ` (proceso padre del gateway). El `TELEGRAM_CHAT_ID` está en `/persist/hermes-home/.env` como `TELEGRAM_HOME_CHANNEL`.