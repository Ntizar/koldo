---
name: cache-multicapa-memoria-disco
description: "Cache en memoria + disco para APIs externas con TTL, métricas de hit rate y stats. Reduce peticiones API y mejora rendimiento."
version: 1.0.0
author: Ntizar
---

# Cache Multicapa (Memoria + Disco) para APIs

Patrón de doble capa de cache para APIs externas con TTL, métricas y stats.

## Por qué dos capas

| Capa | Velocidad | Persistencia | Uso |
|------|-----------|-------------|-----|
| **Memoria** | <1ms | Sesión | Requests repetidos en misma sesión |
| **Disco** | ~5ms | Entre reinicios | Evita quemar peticiones API al reiniciar |

## Capa 1: Cache en Memoria (con métricas)

```javascript
class MemoryCache {
  constructor(ttlMs = 300000) {
    this.store = new Map();
    this.ttl = ttlMs;
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) { this.misses++; return null; }
    if (Date.now() - entry.ts > this.ttl) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return entry.data;
  }

  set(key, data) {
    this.store.set(key, { ts: Date.now(), data });
  }

  metrics() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? Math.round((this.hits / total) * 10000) / 100 : 0,
      size: this.store.size,
    };
  }
}
```

## Capa 2: Cache en Disco (con TTL)

```javascript
const fs = require('fs').promises;
const path = require('path');

const CACHE_DIR = path.join(process.cwd(), 'data', 'api-cache');

function cacheFilePath(id, dateStr) {
  return path.join(CACHE_DIR, `${id}_${dateStr}.json`);
}

async function readCache(id, dateStr, ttlMs = 300000) {
  try {
    const raw = await fs.readFile(cacheFilePath(id, dateStr), 'utf-8');
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > ttlMs) {
      await fs.unlink(cacheFilePath(id, dateStr)).catch(() => {});
      return null;
    }
    return entry.data;
  } catch { return null; }
}

async function writeCache(id, dateStr, data) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cacheFilePath(id, dateStr), JSON.stringify({ ts: Date.now(), data }), 'utf-8');
  } catch (e) { console.error('[Cache] write error:', e.message); }
}

async function getStats() {
  try {
    const files = await fs.readdir(CACHE_DIR);
    let totalSize = 0;
    for (const file of files) {
      const stat = await fs.stat(path.join(CACHE_DIR, file));
      totalSize += stat.size;
    }
    return { files: files.length, size: totalSize };
  } catch { return { files: 0, size: 0 }; }
}
```

## Integración en el flujo

```
apiFetch(endpoint)
    │
    ├── ¿Cache memoria tiene? → SÍ → devuelve (hits++)
    │
    ├── ¿Cache disco tiene? → SÍ → mete en memoria → devuelve
    │
    └── No → fetch real → guarda en disco + memoria → devuelve (misses++)
```

## Buenas prácticas

- **TTL igual en ambas capas** (ej: 5 min)
- **Métricas expuestas** via endpoint `/cache-stats` o `/metrics`
- **Limpieza manual** via endpoint `/cache-clear` (POST)
- **Formato de clave**: `recurso:param1:param2` (ej: `indicator:1001:2026-05-28`)
- **Archivos en disco**: `{id}_{date}.json` con timestamp interno

## Pitfalls

- ❌ Cache sin TTL → datos stale durante horas
- ❌ Escribir en disco en cada request → ralentiza (cache en memoria primero)
- ❌ No limpiar cache expirada → disco se llena
- ❌ Sin metrics → no sabes si el cache realmente está funcionando

## Referencia

- Código real: `src/infra/cache/memory-cache.js` y `src/infra/cache/disk-cache.js`
- Skills relacionadas: api-cliente-http-robusto, endpoints-dashboard-rest