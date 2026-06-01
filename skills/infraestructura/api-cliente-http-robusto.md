---
name: api-cliente-http-robusto
description: "Cliente HTTP con reintentos, backoff exponencial, jitter y timeout para APIs externas. Patrón probado con ESIOS/REE."
version: 1.0.0
author: Ntizar
---

# Cliente HTTP Robusto para APIs Externas

Patrón probado con ESIOS/REE que maneja reintentos con backoff exponencial + jitter para evitar picos de carga.

## Estructura

```
src/infra/clients/
  ├── esios.client.js     ← Cliente concreto (hereda el patrón)
  ├── nan.client.js       ← Otro cliente con mismo patrón
  └── ...                 ← Añadir más proveedores aquí
```

## Código base

```javascript
const https = require('https');

// Configuración
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;   // 1s
const MAX_DELAY = 10000;   // 10s
const TIMEOUT = 8000;      // 8s

// Jitter para evitar picos de reintentos
function jitter(base, factor = 0.5) {
  const range = factor * base;
  return base - range / 2 + Math.random() * range;
}

// Fetch con reintentos
function apiFetch(pathname, token, retries = MAX_RETRIES, timeout = TIMEOUT) {
  return new Promise((resolve, reject) => {
    const url = `https://api.ejemplo.com${pathname}`;
    const req = https.get(url, {
      headers: { 'x-api-key': token, 'Accept': 'application/json' },
      timeout,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`API ${res.statusCode}: ${body.slice(0, 300)}`));
          return;
        }
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`Parse error: ${e.message}`)); }
      });
    });
    req.on('error', (err) => {
      if (retries > 0) {
        const delay = Math.min(BASE_DELAY * Math.pow(2, MAX_RETRIES - retries), MAX_DELAY);
        setTimeout(() => apiFetch(pathname, token, retries - 1, timeout).then(resolve).catch(reject), jitter(delay));
      } else {
        reject(err);
      }
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('API timeout')); });
  });
}
```

## Patrón fetch con cache (recomendado)

```javascript
async function fetchIndicator(indicatorId, dateStr, token) {
  // 1. Try disk cache first
  const cached = await diskCache.readCache(indicatorId, dateStr, CACHE_TTL);
  if (cached) return cached;

  // 2. Fetch from API
  const data = await apiFetch(`/endpoint/${indicatorId}?date=${dateStr}`, token);

  // 3. Cache the result
  await diskCache.writeCache(indicatorId, dateStr, data);

  return data;
}
```

## Buenas prácticas

1. **Token NUNCA en frontend** — siempre server-side, validado en env.js
2. **Timeout agresivo** (8s por defecto) — APIs externas pueden colgarse
3. **Backoff exponencial** (1s → 2s → 4s) + jitter aleatorio
4. **Cache antes de retornar** — reduce peticiones en caso de error posterior
5. **Headers mínimos** — solo los necesarios (x-api-key, Accept)

## Pitfalls

- ❌ Reintentar sin backoff → DDOS a la API externa
- ❌ Timeout demasiado alto → request colgado bloquea el event loop
- ❌ Sin cache → cada reinicio del server quema peticiones API frescas
- ❌ No parsear errores HTTP → 502/503 sin mensaje útil

## Referencia

- Código real: `src/infra/clients/esios.client.js` del proyecto ESIOS Dashboard
- Skills relacionadas: cache-multicapa-memoria-disco, env-validacion-estricta