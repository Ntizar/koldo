---
name: solar-shadow-computation
description: "SolMAD — Cálculo de sombras solares para terrazas: Web Workers + Comlink, grid-based segment index, ray casting contra edificios OSM, cache solar. Patrón de computación pesada sin bloquear UI."
version: "1.0.0"
category: gis
tags: [data-science, solar, shadows, SolMAD]

---

# SolMAD — Solar Shadow Computation

> **Repo:** https://github.com/Ntizar/solmad
> **Stack:** Vite + React + TypeScript, Leaflet, SunCalc, Web Workers + Comlink, Three.js
> **URL:** https://solmad.vercel.app

## Qué es

Aplicación que cruza el censo de 6.200+ terrazas de Madrid con la posición del sol y sombras de edificios OSM para mostrar qué terrazas tienen sol directo en tiempo real.

## Arquitectura de Cálculo de Sombras

```
1. Cargar terrazas oficiales (Ayuntamiento de Madrid)
2. Descargar footprints edificios OSM por zona visible (no todo Madrid)
3. Estimar alturas: height, building:levels * 3.2m, fallback 10m
4. Indexar segmentos en grid espacial (Web Worker)
5. Para cada terraza: ray casting hacia sol → ¿bloquea edificio?
6. Repetir en pasos de tiempo → estimar minutos de sol restantes
7. Cache por terraza + día + franja 15min (localStorage + API)
```

## Patrón Web Worker + Comlink

```typescript
// src/workers/shadows.worker.ts
import * as Comlink from 'comlink';

class SegIndex {
  cell = 60; // grid cell size in meters
  grid = new Map<string, Seg[]>();

  build(buildings, originLng, originLat) {
    // Index cada segmento de fachada en celda grid
    for (const b of buildings) {
      for (let i = 0; i < ring.length - 1; i++) {
        this.indexSeg({ ax, ay, bx, by, h: b.height });
      }
    }
  }

  forEachAlongRay(ox, oy, dx, dy, len, fn) {
    // Algoritmo de ray tracing con grid
    // Evita Set: usa visitToken (incremental) para marked segments
    // 3x3 cells alrededor del paso para coverage
    const token = ++this.visitToken;
    for (let i = 0; i <= steps; i++) {
      const x = ox + dx * t, y = oy + dy * t;
      // Check 3x3 cells around current position
      for (let nx = cx-1; nx <= cx+1; nx++) {
        for (let ny = cy-1; ny <= cy+1; ny++) {
          if (s.tag === token) continue; // skip already visited
          s.tag = token;
          if (fn(s) === true) return; // early exit on blocker
        }
      }
    }
  }
}
```

## Patrón: Grid Spatial Index con visitToken

```typescript
// En vez de usar Set (costoso en Web Workers), usar un token incremental
// Cada llamada a forEachAlongRay incrementa visitToken
// Los segmentos marcados con token != current se ignoran
// Esto permite reutilizar el grid sin limpiar
const token = ++this.visitToken;
// ... marcar segmentos con this.tag = token
```

## Patrón: Progresión de Carga Priorizada

```typescript
// 1. Calcular terraza seleccionada primero
// 2. Calcular 10 terrazas más cercanas a ubicación
// 3. Calcular visibles en el mapa
// Indicador de progreso muestra qué fase está activa
```

## Patrón: Cache Solar Multi-Capa

```typescript
// Capa 1: localStorage (por terraza + día + franja 15min)
// Capa 2: data/sun-cache.json (API Vercel)
// Capa 3: precompute-sun.mjs (batch pre-cálculo diario)
// Invalidación: nuevo día o franja > 15min diferente
```

## Datos

- **Terrazas:** Portal datos abiertos Ayuntamiento de Madrid (CC BY 4.0)
- **Edificios:** OpenStreetMap Overpass API (ODbL)
- **Cálculo solar:** SunCalc library
- **Proyección:** EPSG:25830 → WGS84

## Limitaciones conocidas

- No considera arbolado real, toldos, sombrillas, soportales
- Overpass puede devolver menos edificios si la red/API es lenta
- Alturas estimadas (no reales): `building:levels * 3.2m` o fallback `10m`

## Scripts clave

| Script | Función |
|--------|---------|
| `scripts/prepare-data.mjs` | Limpieza datos Ayuntamiento → `terrazas.min.json` |
| `scripts/precompute-sun.mjs` | Pre-cálculo solar batch diario |
| `api/contribute.ts` | Endpoint Vercel para aportes usuarios → PR review |
| `api/sun-cache.ts` | Endpoint Vercel para cache solar |
