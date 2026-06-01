---
name: servicio-resumen-consolidado
description: "Construcción de un resumen consolidado desde múltiples series horarias con merge, stats y degradación graceful. Patrón para dashboards que combinan N indicadores."
version: 1.0.0
author: Ntizar
license: MIT
metadata:
  hermes:
    tags: [resumen, series, horarias, merge, stats, consolidacion]
    related_skills: [fetch-paralelo-fallos-parciales, conversion-unidades-api-externa, frontend-estado-persistencia]
---

# Servicio de Resumen Consolidado

Patrón para combinar múltiples series temporales (precio, demanda, generación, CO2) en un único objeto estructurado con estadísticas diarias.

## Estructura del servicio

```
src/domains/
  └── energy/
      ├── summary.service.js    ← Servicio principal
      └── energy.service.js     ← Servicio auxiliar
```

## Flujo del servicio

```
1. Fetch paralelo de todos los indicadores (con safe wrapper)
2. buildHourlySeries() para cada indicador → serie de 24 slots
3. createHourlyMap() → 24 slots vacíos (hora 00-23)
4. mergeSeries() → inyecta cada serie en el mapa
5. Cálculo de estadísticas (media, max, min, total) por clave
6. Devolver { fecha, resumen, valores }
```

## Funciones helpers clave

```javascript
// Convertir datos crudos a serie horaria (24 slots)
function buildHourlySeries(indicatorId, data, dateStr) {
  const rows = data?.indicator?.values
    ? normalizeHourlyValues(data.indicator.values, dateStr)
    : emptyHourlyValues();
  return rows.map((row) => ({
    hora: row.hora,
    valor: convertApiValue(indicatorId, row.valor),
  }));
}

// Crear mapa base con 24 slots vacíos
function createHourlyMap() {
  return new Map(emptyHourlyValues().map((row) => [row.hora, { hora: row.hora }]));
}

// Merge de una serie en el mapa
function mergeSeries(hourlyMap, series, key) {
  series.forEach((row) => {
    const current = hourlyMap.get(row.hora) || { hora: row.hora };
    current[key] = row.valor;
    hourlyMap.set(row.hora, current);
  });
}

// Obtener estadísticas de una clave
function getStats(valores, key) {
  const vals = valores
    .map(v => v[key])
    .filter(Number.isFinite);
  if (!vals.length) return { media: null, max: null, min: null, total: null };
  return {
    media: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    max: Math.round(Math.max(...vals)),
    min: Math.round(Math.min(...vals)),
    total: Math.round(vals.reduce((a, b) => a + b, 0)),
  };
}
```

## Contrato de salida

```json
{
  "fecha": "2026-05-28",
  "resumen": {
    "precio_medio": 145.0,
    "demanda_media": 30890,
    "gen_renovable_media": 16860,
    "pct_renovable": 58.0
  },
  "valores": [
    { "hora": "00", "precio": 133.5, "demanda": 31757, "nuclear": 6061, ... },
    { "hora": "01", "precio": 131.0, "demanda": 29906, "nuclear": 6066, ... }
  ]
}
```

## Buenas prácticas

1. **24 slots fijos** — siempre devolver 24 horas, rellenar con null si falta
2. **Stats por clave** — función genérica `getStats(key)` en vez de calcular a mano
3. **Degradación graceful** — si un indicador opcional falla, sus valores son null
4. **Estructura plana** — `resumen` para agregados, `valores` para serie horaria
5. **Unidades en el resumen** — incluir `unidad_precio`, `unidad_potencia`, etc.

## Pitfalls

- ❌ No normalizar timezone → horas desplazadas (UTC vs local)
- ❌ No distinguir REQUIRED vs OPTIONAL → un fallo rompe todo
- ❌ Calcular stats dos veces → duplicación de lógica
- ❌ Orden de merge incorrecto → alias duplicados sobreescriben

## Referencia

- Código real: `src/domains/energy/summary.service.js`
- Skills relacionadas: fetch-paralelo-fallos-parciales, conversion-unidades-api-externa, frontend-estado-persistencia