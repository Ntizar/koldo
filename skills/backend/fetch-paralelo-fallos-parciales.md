---
name: fetch-paralelo-fallos-parciales
description: "Promise.all para fetch paralelo de múltiples endpoints con manejo de fallos parciales. Patrón para dashboards que consolidan muchos indicadores."
version: 1.0.0
author: Ntizar
---

# Fetch Paralelo con Fallos Parciales

Cuando un dashboard necesita 10+ indicadores de una API, el fetch secuencial es inaceptable. Este patrón lanza todo en paralelo pero permite que algunos endpoints fallen sin romper el conjunto.

## El problema

```javascript
// ❌ Si un indicador falla, TODO falla
const [precio, demanda, nuclear] = await Promise.all([
  fetchIndicator(1001, fecha, token),
  fetchIndicator(1293, fecha, token),
  fetchIndicator(2039, fecha, token),  // ← Si esto falla, todo se rompe
]);
```

## La solución: función safe wrapper

```javascript
// ✅ Safe wrapper: si falla, devuelve null
async function fetchIndicatorSafe(indicatorId, dateStr, token) {
  try {
    return await fetchIndicator(indicatorId, dateStr, token);
  } catch (error) {
    console.warn(`[Safe] Indicador ${indicatorId} no disponible: ${error.message}`);
    return null;
  }
}
```

## Mapa de indicadores con prioridad

```javascript
// Indicadores REQUERIDOS (críticos para el dashboard)
const REQUIRED_IDS = {
  precio: 1001,
  demanda: 1293,
  eolica: 2038,
};

// Indicadores OPCIONALES (degradan a null si fallan)
const OPTIONAL_IDS = {
  bateriaEntrega: 2198,
  bateriaCarga: 2199,
  bombeoConsumo: 2065,
  bombeoTurbinacion: 2066,
};

// Fetch en paralelo con prioridad
const [precioData, demandaData, ...] = await Promise.all([
  fetchIndicator(REQUIRED_IDS.precio, fecha, token),
  fetchIndicator(REQUIRED_IDS.demanda, fecha, token),
  fetchIndicatorSafe(OPTIONAL_IDS.bateriaEntrega, fecha, token),
  fetchIndicatorSafe(OPTIONAL_IDS.bateriaCarga, fecha, token),
]);
```

## Patrón alternativo con Promise.allSettled

```javascript
const results = await Promise.allSettled(
  allIds.map(id => fetchIndicator(id, fecha, token))
);

const data = results.map((result, idx) => {
  if (result.status === 'fulfilled') return result.value;
  console.warn(`Indicador ${allIds[idx]} falló:`, result.reason);
  return null;
});
```

## Buenas prácticas

1. **Identificar REQUIRED vs OPTIONAL** — los críticos deben funcionar
2. **Safe wrapper** para opcionales — nunca romper el dashboard por un dato secundario
3. **Warning log** — registrar qué indicadores fallaron para debug
4. **Devolver null** — el frontend debe manejar valores nulos sin romperse
5. **Agrupar por dependencia** — si A y B son independientes, en paralelo

## Cuándo usar

- Dashboards que consolidan 5+ indicadores
- APIs con disponibilidad irregular (algunos endpoints devuelven 404)
- Forecast que necesita N días de historia (cada día = 1 fetch)

## Pitfalls

- ❌ Promise.all sin safe wrapper → un fallo mata todo el summary
- ❌ No loguear fallos → silencio absoluto cuando un indicador no funciona
- ❌ Tratar todos los indicadores como críticos → dashboard frágil
- ❌ Fetch secuencial de 20 indicadores → 20s de carga

## Referencia

- Código real: `src/domains/energy/summary.service.js` (buildSummary + fetchIndicatorSafe)
- Skills relacionadas: api-cliente-http-robusto, servicio-resumen-consolidado, cache-multicapa-memoria-disco