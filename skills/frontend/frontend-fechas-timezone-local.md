---
name: frontend-fechas-timezone-local
description: "Utilidades de fecha/hora en timezone local con soporte DST (horario de verano/invierno). Para dashboards que trabajan con datos horarios en una zona concreta."
version: 1.0.0
author: Ntizar
---

# Fechas y Timezone Local con DST

Patrón para manejar fechas y horas en una zona horaria concreta (ej: Europe/Madrid) con soporte para cambios de horario de verano/invierno.

## Utilidades base

```javascript
const TZ = 'Europe/Madrid';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Validar fecha
function isValidDateStr(dateStr) {
  if (!DATE_RE.test(String(dateStr || ''))) return false;
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return probe.toISOString().slice(0, 10) === dateStr;
}

// Fecha de hoy en Madrid
function formatDateInMadrid(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

// Desplazar fecha (DST-safe)
function addDays(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return date.toISOString().slice(0, 10);
}
```

## Mapeo de timestamps UTC a horas locales

```javascript
// Obtener hora Madrid desde timestamp UTC
function madridDateHourFromUtc(datetimeUtc) {
  const date = new Date(datetimeUtc);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { dateStr: `${value.year}-${value.month}-${value.day}`, hora: value.hour };
}

// Normalizar valores horarios a 24 slots Madrid
function normalizeHourlyValues(values, dateStr) {
  const hours = new Map(
    Array.from({ length: 24 }, (_, h) => [
      String(h).padStart(2, '0'),
      { hora: String(h).padStart(2, '0'), valor: null }
    ])
  );
  for (const value of values || []) {
    const dateHour = madridDateHourFromValue(value);
    if (!dateHour || dateHour.dateStr !== dateStr || !hours.has(dateHour.hora)) continue;
    hours.get(dateHour.hora).valor = parseNum(value.value);
  }
  return Array.from(hours.values());
}
```

## Gestión de DST (horario de verano)

```javascript
// Obtener offset UTC en Madrid para una fecha
function getMadridOffset(dateStr, hour) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, hour || 12, 0, 0));
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, timeZoneName: 'shortOffset',
    hourCycle: 'h23',
  }).formatToParts(probe);
  const tzName = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+1';
  return tzName;  // Devuelve '+01:00' o '+02:00'
}
```

## Comportamiento DST

- **Cambio de primavera**: una hora desaparece (02:00 → 03:00). El slot 02:00 queda vacío.
- **Cambio de otoño**: una hora se repite (03:00 → 02:00). Se colapsa en un solo slot.
- **Siempre 24 slots**: el dashboard mantiene 24 posiciones estables (00-23).

## Buenas prácticas

1. **Intl.DateTimeFormat con timeZone** — la forma más fiable de manejar timezones en JS
2. **Siempre 24 slots** — `emptyHourlyValues()` devuelve array de 24 con nulls
3. **DST-safe addDays** — usar UTC mediodía para evitar desfases de cambio de hora
4. **Validación estricta** — `isValidDateStr` con Date real, no solo regex
5. **Frontend y backend coordinados** — mismo TZ en ambos lados (Europe/Madrid)

## Pitfalls

- ❌ new Date() sin timezone → interpreta en UTC y las horas se desplazan
- ❌ getTimezoneOffset() → no funciona para fechas históricas con DST distinto
- ❌ Asumir UTC+1 fijo → en verano falla por 1 hora
- ❌ No validar fecha con Date real → '2026-02-30' pasa la regex pero es inválida

## Referencia

- Código real: `src/shared/time/madrid.js` (backend) y `public/js/utils.js` (frontend)
- Skills relacionadas: conversion-unidades-api-externa, servicio-resumen-consolidado