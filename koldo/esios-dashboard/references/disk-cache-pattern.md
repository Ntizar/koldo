# Patrón de Disk Cache para ESIOS API

**Fecha**: 2026-05-26  
**Proyecto**: esios-dashboard  
**Estado**: Implementado

## Problema

El token ESIOS dice: *"no realice peticiones masivas, redundantes o innecesarias"*.  
Cada recarga del dashboard hacía 30+ peticiones a la API de ESIOS.

## Solución: `src/infra/cache/disk-cache.js`

Sistema de caché persistente en disco que reduce peticiones API ~95%:

### Flujo

1. **Primera carga** → 30 peticiones API → datos guardados en `data/esios-cache/`
2. **Recargas siguientes** → 0 peticiones API → datos servidos desde disco
3. **Tras 5 min** → cache expirado → 30 peticiones API
4. **Cada 2h** → cada indicador se regenera individualmente

### Implementación

```javascript
// src/infra/cache/disk-cache.js
const CACHE_DIR = path.join(process.cwd(), 'data', 'esios-cache');
const CACHE_TTL = 300000; // 5 minutos

// leeCache(indicatorId, dateStr, ttlMs) → datos o null
// escribeCache(indicatorId, dateStr, data) → void
// borraCache(indicatorId, dateStr) → void
// limpiaTodo() → void
// estadisticas() → {files, size, sizeHuman}
```

### Integración en esios.client.js

```javascript
async function fetchIndicator(indicatorId, dateStr, token) {
  // 1. Try disk cache first
  const cached = await diskCache.readCache(indicatorId, dateStr, CACHE_TTL);
  if (cached) return cached;

  // 2. Fetch from ESIOS API
  const data = await esiosFetch(pathname, token);

  // 3. Cache the result
  await diskCache.writeCache(indicatorId, dateStr, data);

  return data;
}
```

### Archivos cache

Formato: `data/esios-cache/{indicatorId}_{YYYY-MM-DD}.json`

```json
{
  "ts": 1748262000000,
  "data": { "indicator": { "values": [...] } }
}
```

### Endpoints de gestión

- `GET /api/esios/cache-stats` → `{disk: {files, size}, memory: {hits, misses, hitRate}}`
- `POST /api/esios/cache-clear` → limpia todo el cache

## Beneficios

- ~95% menos peticiones a ESIOS en uso normal
- Cumple reglas de uso del token ESIOS
- Datos persistentes entre reinicios del servidor
- Sin dependencias externas (Redis, etc.)
