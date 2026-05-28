---
name: frontend-orquestacion-carga
description: "Orquestación de carga de datos: AbortController, auto-refresh, renderizado por secciones, toast de estado. Patrón para dashboards con carga única centralizada."
version: 1.0.0
author: Ntizar
---

# Orquestación de Carga en Dashboards Vanilla JS

Patrón para centralizar la carga de datos, evitar duplicados, manejar cancelaciones y coordinar el renderizado.

## Estructura

```javascript
// data.js — único punto de entrada de datos
let abortController = null;
let autoRefreshHandle = null;

async function cargarDatos() {
  // 1. Normalizar fecha
  AppState.fecha = normalizeDate(AppState.fecha || getTodayStr());

  // 2. Actualizar controles UI
  updateDateControls();
  saveState();

  // 3. Abortar carga anterior si existe
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const signal = abortController.signal;

  try {
    // 4. Fetch en paralelo (summary + predicción)
    const promises = [
      apiFetch('summary', AppState.fecha, signal),
      shouldFetchPrediccion(AppState.fecha) ? apiFetch('prediccion', AppState.fecha, signal) : Promise.resolve(null),
    ];

    const results = await Promise.allSettled(promises);
    if (signal.aborted) return;

    // 5. Procesar resultados
    const summary = results[0].status === 'fulfilled' ? results[0].value : null;
    const prediccion = results[1].status === 'fulfilled' ? results[1].value : null;

    if (summary) {
      AppState.data.summary = summary;
      AppState.data.prediccion = prediccion;
      renderAll(summary, prediccion);
      showToast('✅ Datos cargados: ' + AppState.fecha, 'success');
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    showToast('❌ Error: ' + err.message, 'error');
  } finally {
    if (!signal.aborted) updateLoadButton(false);
  }
}
```

## Renderizado por secciones

```javascript
function renderAll(summary, prediccion) {
  const valores = summary.valores || [];
  if (!valores.length) { showToast('📭 Sin datos', 'warning'); return; }

  // Enriquecer datos para los renders
  summary.precios = valores.map(d => ({ hora: d.hora, valor: d.precio }));
  summary.generacion = {};
  techKeys.forEach(key => {
    summary.generacion[key] = valores.map(d => ({ hora: d.hora, valor: d[key] }));
  });

  // Renderizar cada sección (cada función sabe qué hacer si no hay datos)
  renderMetrics(summary);
  renderTechCards(summary);
  renderHourlyTable(summary);
  renderPrecioCurve(summary);
  renderDemanda(summary);
  renderGeneracionMix(summary);
  renderIntercon(summary);
  renderPrevision(summary);
  renderMonteCarlo(prediccion);
}
```

## Inicialización única

```javascript
document.addEventListener('DOMContentLoaded', () => {
  if (window.__initialized) return;
  window.__initialized = true;

  loadState();
  AppState.fecha = normalizeDate(AppState.fecha || getTodayStr());
  updateDateControls();
  setupTabs();
  setupDateNavigation();

  // Carga inicial
  cargarDatos();

  // Auto-refresh cada 10 min si estamos en el día de hoy
  autoRefreshHandle = setInterval(() => {
    if (AppState.fecha === getTodayStr()) cargarDatos();
  }, 600000);
});
```

## Buenas prácticas

1. **Carga única centralizada** — un solo `cargarDatos()`, no múltiples DOMContentLoaded
2. **AbortController** — cancelar fetch anterior si usuario cambia de fecha rápido
3. **Promise.allSettled** — un fetch puede fallar sin matar al otro
4. **Guard con signal.aborted** — no renderizar datos de una request cancelada
5. **Auto-refresh solo para hoy** — no recargar datos históricos
6. **Guard de inicialización** — evitar doble carga si el script se carga dos veces

## Pitfalls

- ❌ Múltiples DOMContentLoaded → cargarDatos() se dispara N veces
- ❌ Sin AbortController → request antigua sobreescribe datos nuevos
- ❌ Promise.all (no allSettled) → si predicción falla, summary no se renderiza
- ❌ Renderizar fuera del try/catch → error en un gráfico rompe todo

## Referencia

- Código real: `public/js/data.js` del proyecto ESIOS Dashboard
- Skills relacionadas: frontend-api-client-errores