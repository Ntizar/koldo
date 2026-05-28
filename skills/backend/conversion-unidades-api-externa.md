---
name: conversion-unidades-api-externa
description: "Conversión de valores crudos de API externa a unidades humanas. Patrón para APIs que devuelven valores en múltiplos (×10, ×100, ×1000)."
version: 1.0.0
author: Ntizar
---

# Conversión de Unidades de API Externa

Muchas APIs (ESIOS/REE, sensores IoT, etc.) devuelven valores en múltiplos para evitar decimales. Este patrón centraliza la conversión en un solo módulo.

## El problema

API devuelve `60622` pero el valor real es `6062 MW` (dividir entre 10).
API devuelve `1234567` pero es `1234.567 MWh` (dividir entre 1000).

## Solución: módulo único de conversión

```javascript
// src/shared/api-units.js

// IDs que NO necesitan conversión (valores directos)
const DIRECT_IDS = new Set([
  1001,  // PVPC — €/MWh directo
  1777,  // Previsión eólica — MW directo
  10207, // Interconexión Francia — MW directo
]);

// IDs que dividen entre 10
const DIV10_IDS = new Set([
  1293,  // Demanda real
  10351, // Gen renovable
  2052,  // Demanda prevista
]);

function roundTo2(value) {
  return Math.round(value * 100) / 100;
}

function convertApiValue(indicatorId, rawValue) {
  if (rawValue === null || rawValue === undefined) return null;

  const num = Number(rawValue);
  if (!Number.isFinite(num)) return null;

  // 1. IDs directos — sin conversión
  if (DIRECT_IDS.has(indicatorId)) return roundTo2(num);

  // 2. IDs del rango PBF (1-462) — MWh → dividir entre 1000
  if (indicatorId >= 1 && indicatorId <= 462) return roundTo2(num / 1000);

  // 3. IDs de telemedida nacional (2000-2099) — MW → dividir entre 10
  if (indicatorId >= 2000 && indicatorId <= 2099) return roundTo2(num / 10);

  // 4. IDs DIV10 explícitos
  if (DIV10_IDS.has(indicatorId)) return roundTo2(num / 10);

  // 5. Fallback: dividir entre 10
  return roundTo2(num / 10);
}
```

## Estrategia de verificación

Siempre verificar empíricamente los valores contra la documentación real:

```
| ID | Nombre     | Raw avg | Conversión | Unidad |
|----|------------|---------|------------|--------|
| 1001 | PVPC      | 142     | 142 (dir)  | €/MWh  |
| 2039 | Nuclear   | 60622   | 6062 (/10) | MW     |
| 623  | Llenado   | 500000  | 500 (/1000)| MWh    |
```

## Buenas prácticas

1. **Módulo único** — `api-units.js` en `src/shared/`, no disperso por el código
2. **Rangos primero** — procesar rangos de IDs antes que IDs individuales
3. **Set de IDs** — `Set.has()` es O(1), mejor que arrays o switches
4. **Audit trail** — mantener un documento de verificación (AUDIT.md) con valores reales
5. **Tests** — probar cada ID con su valor crudo

## Pitfalls

- ❌ Asumir que todos los valores se dividen igual → algunos son directos
- ❌ No verificar empíricamente → confiar en docs desactualizados
- ❌ Conversión dispersa → cada módulo tiene su propia lógica
- ❌ No manejar null/undefined → NaN en el dashboard

## Referencia

- Código real: `src/shared/esios-units.js` + `AUDIT-2026-05-28.md` del proyecto ESIOS
- Skills relacionadas: fetch-paralelo-fallos-parciales, servicio-resumen-consolidado