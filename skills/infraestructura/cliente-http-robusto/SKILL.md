---
name: cliente-http-robusto
description: "Patrón de cliente HTTP con reintentos, backoff exponencial con jitter y timeouts. Para consumir APIs externas de forma resiliente."
version: 2.0.0
author: Ntizar
license: MIT
tags: [infraestructura, http, resiliencia, patrones, nodejs]
metadata:
  hermes:
    related_skills: [cache-multicapa-memoria-disco, env-validacion-estricta]
---

# Cliente HTTP Robusto — Patrón de Resiliencia para APIs Externas

## ¿Qué enseña este skill?

Un patrón de diseño para consumir APIs externas de forma **resiliente**: reintentos con backoff exponencial + jitter, timeouts agresivos y manejo estructurado de errores.

## ¿Cuándo usarlo?

- Consumes una API externa que puede ser inestable (rate limits, timeouts, 5xx)
- La disponibilidad de la API es importante pero no crítica (puedes fallback a cache)
- Necesitas evitar saturar la API con reintentos masivos (el jitter distribuye la carga)

## ¿Cuándo NO usarlo?

- La API es tuya y puedes controlar su disponibilidad → optimiza el backend, no el cliente
- Necesitas latencia determinista (el backoff introduce incertidumbre)
- La API ya tiene su propio mecanismo de reintentos → no doble-capa, es redundante
- Operaciones no-idempotentes (POST que crea recursos) → no reintentar sin lógica adicional

## Estructura del patrón

```
src/infra/clients/
  ├── http-client.js      ← Patrón genérico (reutilizable)
  ├── esios.client.js     ← Implementación concreta para ESIOS
  ├── nan.client.js       ← Implementación concreta para NaN
  └── index.js            ← Exporta todos los clientes
```

## Código del patrón

```javascript
const https = require('https');

/**
 * Cliente HTTP con reintentos, backoff exponencial + jitter y timeout.
 *
 * @param {Object} opts - Configuración
 * @param {number} opts.maxRetries - Máximo número de reintentos (default: 3)
 * @param {number} opts.baseDelay - Retraso base en ms (default: 1000)
 * @param {number} opts.maxDelay - Retraso máximo en ms (default: 10000)
 * @param {number} opts.timeout - Timeout por request en ms (default: 8000)
 * @param {Object} opts.headers - Cabeceras por defecto
 * @returns {Function} Función fetch con reintentos
 */
function createHttpClient(opts = {}) {
  const maxRetries = opts.maxRetries ?? 3;
  const baseDelay = opts.baseDelay ?? 1000;
  const maxDelay = opts.maxDelay ?? 10000;
  const timeout = opts.timeout ?? 8000;
  const defaultHeaders = opts.headers ?? {};

  // Jitter: desincroniza reintentos para evitar thundering herd
  function jitter(base, factor = 0.5) {
    const range = factor * base;
    return base - range / 2 + Math.random() * range;
  }

  function request(pathname, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      function attempt(retriesLeft) {
        const req = https.request(pathname, {
          method,
          headers: { ...defaultHeaders, 'Accept': 'application/json' },
          timeout,
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            // 4xx = error del cliente (no reintentar)
            if (res.statusCode >= 400 && res.statusCode < 500) {
              reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 500)}`));
              return;
            }
            // 5xx = error del servidor (reintentar si queda capacidad)
            if (res.statusCode >= 500) {
              if (retriesLeft > 0) {
                const delay = Math.min(
                  baseDelay * Math.pow(2, maxRetries - retriesLeft),
                  maxDelay
                );
                setTimeout(() => attempt(retriesLeft - 1), jitter(delay));
              } else {
                reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 500)}`));
              }
              return;
            }
            try { resolve(JSON.parse(data)); }
            catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
          });
        });

        req.on('error', (err) => {
          // Errores de red (DNS, connection refused) → reintentar
          if (retriesLeft > 0) {
            const delay = Math.min(
              baseDelay * Math.pow(2, maxRetries - retriesLeft),
              maxDelay
            );
            setTimeout(() => attempt(retriesLeft - 1), jitter(delay));
          } else {
            reject(new Error(`Network error: ${err.message}`));
          }
        });

        req.on('timeout', () => {
          req.destroy();
          if (retriesLeft > 0) {
            const delay = Math.min(
              baseDelay * Math.pow(2, maxRetries - retriesLeft),
              maxDelay
            );
            setTimeout(() => attempt(retriesLeft - 1), jitter(delay));
          } else {
            reject(new Error(`Request timeout after ${timeout}ms`));
          }
        });

        if (body) req.write(JSON.stringify(body));
        req.end();
      }

      attempt(maxRetries);
    });
  }

  return request;
}

module.exports = { createHttpClient };
```

## Flujo integrado con cache

```javascript
// Patrón recomendado: intentar cache antes de llamar a la API
async function fetchWithCache(endpoint, client, cache) {
  // 1. ¿Cache memoria tiene?
  const mem = cache.memory.get(endpoint);
  if (mem) return mem;

  // 2. ¿Cache disco tiene?
  const disk = await cache.disk.read(endpoint);
  if (disk) {
    cache.memory.set(endpoint, disk);
    return disk;
  }

  // 3. Fetch real con reintentos
  const data = await client(endpoint);

  // 4. Guardar en ambas capas
  cache.memory.set(endpoint, data);
  await cache.disk.write(endpoint, data);

  return data;
}
```

## Configuración por escenario

| Escenario | maxRetries | baseDelay | maxDelay | timeout |
|-----------|-----------|-----------|----------|---------|
| API estable | 1 | 500ms | 2000ms | 5000ms |
| API inestable | 5 | 1000ms | 15000ms | 10000ms |
| API con rate limit | 3 | 2000ms | 30000ms | 8000ms |
| Fetch en paralelo (N items) | 2 | 500ms | 5000ms | timeout_total / N |

## Mejores prácticas

1. **Solo reintentar errores transitorios** — 5xx y errores de red. Los 4xx son errores del cliente, no se retryean.
2. **Timeout proporcional al número de requests** — si haces N fetches en paralelo, cada uno necesita timeout suficiente.
3. **Jitter siempre** — sin jitter, N clientes que fallan simultáneamente volverán a fallar simultáneamente (thundering herd).
4. **Combinar con cache** — el cliente robusto reduce picos, la cache reduce volumen. Juntos son sinérgicos.
5. **Configurar por entorno** — en dev, menos reintentos (feedback rápido). En prod, más reintentos (tolerancia a fallos).

## Pitfalls

- ❌ Reintentar sin backoff → DDOS involuntario a la API externa
- ❌ Timeout demasiado alto → un request colgado bloquea el event loop entero
- ❌ Reintentar respuestas 4xx → estás reintentando un error de tu parte (parametro incorrecto, auth fallido)
- ❌ Sin jitter → thundering herd: todos reintentan al mismo tiempo
- ❌ Fetch secuencial de N items con timeout individual bajo → tiempo total = N × timeout
- ❌ Deploy con timeout menor que la latencia real → funciona en dev (cache), falla en prod (sin cache)

## Referencias

- Código real: `src/infra/clients/` del proyecto ESIOS Dashboard
- Skills relacionadas: [cache-multicapa-memoria-disco](../cache-multicapa-memoria-disco/), [env-validacion-estricta](../env-validacion-estricta/)
