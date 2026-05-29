# Dashboard Principal — Patrón de Arquitectura v3.0

## Contexto
2026-05-28: Se rediseñó completamente el dashboard principal del ESIOS Dashboard.
El HTML anterior era solo el "visor de indicadores" (sidebar + indicador individual).
Se reemplazó por un dashboard completo con 6 tabs, métricas, gráficos y tablas.

## Estructura HTML
- `index.html`: Dashboard principal con tabs (Resumen, Precio, Demanda, Mix, Interconexiones, Previsión)
- NO hay `fechaInput` DOM element — la fecha se gestiona puramente en `AppState.fecha`
- Selector de fechas: botones ◀ 📅 ▶ + display del día seleccionado
- CSS: `date-selector-main`, `date-nav`, `date-display` para el nuevo selector

## Patrón AppState.fecha
- `state.js`: define `AppState` con `fecha`, `activeTab`, `data`, `ui`
- `loadState()`: restaura desde localStorage/URL hash, NUNCA referencia DOM
- `saveState()`: persiste a localStorage
- TODAS las funciones de UI usan `AppState.fecha` directamente
- NUNCA `document.getElementById('fechaInput')` — nunca más

## Scripts de frontend (orden)
1. config.js → constantes
2. state.js → AppState
3. utils.js → helpers
4. api.js → fetch client
5. ui.js → tabs, keyboard (NO range buttons)
6. data.js → cargarDatos, renderAll, init
7. render.js → render functions
8. render-charts.js → gráficos adicionales
9. render-final.js → CO2, tabla (sin init duplicado)

## Pitfalls documentados
- Múltiples DOMContentLoaded: data.js define cargarDatos, render-final.js la llama
- Si data.js falla (CDN, syntax), cargarDatos no existe → ReferenceError
- Solución: verificar que todos los scripts cargan correctamente
