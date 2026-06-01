---
name: cache-multicapa
description: "Patrón de cache en dos capas (memoria + disco) con TTL, métricas de hit rate y limpieza automática. Reduce carga de APIs externas."
version: 2.0.0
author: Ntizar
license: MIT
tags: [infraestructura, cache, rendimiento, patrones, nodejs]
metadata:
  hermes:
    related_skills: [cliente-http-robusto, health-checks-metrics]
---

# Cache Multicapa — Patrón de Doble Capa (Memoria + Disco)

## ¿Qué enseña este skill?

Un patrón de diseño para **cachear datos de APIs externas** en dos capas: memoria (rápida, volátil) y disco (lenta, persistente). Cada capa tiene su propio TTL.

## ¿Cuándo usarlo?

- Consumes una API externa con límites de rate o costos por petición
- Los datos no son ultra-críticos en tiempo real (toleras staleness dentro del TTL)
- Tu app se reinicia frecuentemente (containers, serverless) y quieres evitar quemar peticiones API
- Necesitas métricas de rendimiento (hit rate) para tomar decisiones

## ¿Cuándo NO usarlo?

- Los datos cambian cada segundo y necesitas consistencia fuerte → usa DB en lugar de cache
- El volumen de datos es enorme (GBs) → el cache en memoria se desbordará
- Solo tienes un consumidor de los datos → una sola capa de memoria basta
- La API ya devuelve cache headers (ETag, Cache-Control) → usa la cache del navegador/proxy

## Arquitectura del patrón

```
                    ┌──────────────────┐
                    │   Petición API   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Memoria  │  │   Disco  │  │   API    │
        │  (Map)   │→ │ (FS JSON)│→ │ Externa  │
        │  <1ms    │  │  ~5ms    │  │  ~200ms  │
        └──────────┘  └──────────┘  └──────────┘
          HIT            MISS           FETCH
```

## Código del patrón

```javascript
const fs = require('fs').promises;
const path = require('path');

/**
 * Cache en memoria con métricas y TTL.
 */
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

  clear() {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
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

/**
 * Cache en disco con TTL y limpieza automática de expirados.
 */
class DiskCache {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
  }

  _filePath(key) {
    return path.join(this.cacheDir, `${key.replace(/:/g, '_')}.json`);
  }

  async read(key, ttlMs) {
    try {
      const raw = await fs.readFile(this._filePath(key), 'utf-8');
      const entry = JSON.parse(raw);
      if (Date.now() - entry.ts > ttlMs) {
        await fs.unlink(this._filePath(key)).catch(() => {});
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  async write(key, data) {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      await fs.writeFile(
        this._filePath(key),
        JSON.stringify({ ts: Date.now(), data }),
        'utf-8'
      );
    } catch (e) {
      console.error(`[DiskCache] write error for ${key}:`, e.message);
    }
  }

  async clear() {
    try {
      const files = await fs.readdir(this.cacheDir);
      for (const file of files) {
        await fs.unlink(path.join(this.cacheDir, file)).catch(() => {});
      }
    } catch (e) {
      console.error('[DiskCache] clear error:', e.message);
    }
  }

  async stats() {
    try {
      const files = await fs.readdir(this.cacheDir);
      let totalSize = 0;
      for (const file of files) {
        const stat = await fs.stat(path.join(this.cacheDir, file));
        totalSize += stat.size;
      }
      return { files: files.length, size: totalSize };
    } catch {
      return { files: 0, size: 0 };
    }
  }
}

/**
 * Orquestador de cache multicapa.
 * Flujo: memoria → disco → API
 */
class MultiLayerCache {
  constructor(opts = {}) {
    this.memory = new MemoryCache(opts.ttlMs ?? 300000);
    this.disk = new DiskCache(opts.diskDir ?? './data/api-cache');
    this.ttlMs = opts.ttlMs ?? 300000;
  }

  async get(key) {
    // 1. Memoria
    const mem = this.memory.get(key);
    if (mem) return mem;

    // 2. Disco
    const disk = await this.disk.read(key, this.ttlMs);
    if (disk) {
      this.memory.set(key, disk); // Promover a memoria
      return disk;
    }

    // 3. Miss total
    return null;
  }

  async set(key, data) {
    this.memory.set(key, data);
    await this.disk.write(key, data);
  }

  clear() {
    this.memory.clear();
    return this.disk.clear();
  }

  metrics() {
    return {
      memory: this.memory.metrics(),
      disk: this.disk.stats(),
    };
  }
}

module.exports = { MemoryCache, DiskCache, MultiLayerCache };
```

## Flujo de decisión

```
¿Tengo el dato?
  ├─ Sí en memoria → devolver (hit++)
  ├─ No en memoria, sí en disco → cargar en memoria + devolver
  └─ No en ninguna → fetch API → guardar en ambas capas (miss++)
```

## Configuración por escenario

| Tipo de dato | TTL memoria | TTL disco | ¿Promover disco→memoria? |
|-------------|-------------|-----------|-------------------------|
| Precios eléctricos | 5 min | 5 min | Sí |
| Indicadores estáticos | 1 hora | 24 horas | Sí |
| Datos de usuario | 1 min | 5 min | Sí |
| Logs/métricas | No cache | No cache | — |

## Mejores prácticas

1. **TTL uniforme** — usa el mismo TTL en ambas capas para evitar inconsistencias
2. **Promover disco a memoria** — cuando se lee del disco, cargar en memoria para la próxima petición
3. **Claves normalizadas** — usar formato `recurso:param1:param2` para consistencia
4. **Métricas expuestas** — exponer hit rate via endpoint `/metrics` para monitorizar efectividad
5. **Limpieza periódica** — el disco se llena si no se limpian los expirados (el TTL en disco ayuda, pero una limpieza periódica es buena práctica)

## Pitfalls

- ❌ Cache sin TTL → datos stale durante horas o días
- ❌ Escribir en disco en cada request sin TTL → disco se llena indefinidamente
- ❌ No promover disco a memoria → cada reinicio vuelve a leer del disco (pierdes el beneficio de la capa rápida)
- ❌ Sin métricas → no sabes si el cache realmente está funcionando (hit rate < 20% = problema)
- ❌ TTL del disco > TTL de memoria → inconsistencia: el disco tiene datos más frescos que la memoria

## Referencias

- Código real: `src/infra/cache/` del proyecto ESIOS Dashboard
- Skills relacionadas: [cliente-http-robusto](../api-cliente-http-robusto/), [health-checks-metrics](../health-checks-metrics/)
