---
name: health-checks-metrics
description: "Health checks, readiness probes y métricas Prometheus para dashboards Node.js. /healthz, /readyz y /metrics."
version: 1.0.0
author: Ntizar
---

# Health Checks + Readiness + Métricas

Tres endpoints estándar para monitorizar el estado de un dashboard backend.

## Endpoints

### /healthz — Estado básico

Indica que el proceso está vivo. Sin dependencias externas.

```javascript
app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    ts: new Date().toISOString(),
  });
});
```

### /readyz — Readiness de dependencias

Verifica que las dependencias externas están configuradas (tokens, bases de datos, etc.).

```javascript
app.get('/readyz', (req, res) => {
  const esiosReady = Boolean(env.TOKEN);
  const status = esiosReady ? 'ready' : 'degraded';
  res.status(esiosReady ? 200 : 503).json({
    status,
    uptime: process.uptime(),
    ts: new Date().toISOString(),
    checks: {
      api_token: esiosReady,
      // Añadir más checks aquí
    },
  });
});
```

### /metrics — Métricas Prometheus

```javascript
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  const m = cache.metrics();
  res.send(
    `# HELP api_cache_hits Total cache hits
# TYPE api_cache_hits counter
api_cache_hits ${m.hits}
# HELP api_cache_misses Total cache misses
# TYPE api_cache_misses counter
api_cache_misses ${m.misses}
# HELP api_cache_hit_rate Cache hit rate percentage
# TYPE api_cache_hit_rate gauge
api_cache_hit_rate ${m.hitRate}
# HELP api_cache_size Current cache size
# TYPE api_cache_size gauge
api_cache_size ${m.size}
# HELP app_uptime_seconds Server uptime
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${Math.round(process.uptime())}`
  );
});
```

## Test de token

```javascript
app.get('/api/v1/test-token', async (req, res) => {
  try {
    const fecha = formatDateInMadrid(new Date()).slice(0, 10);
    const data = await fetchIndicator(1001, fecha, env.TOKEN);
    if (data?.indicator?.values?.length > 0) {
      res.json({ ok: true, token: 'ok', sample_value: data.indicator.values[0].value });
    } else {
      res.json({ ok: false, token: 'invalid' });
    }
  } catch (err) {
    res.json({ ok: false, token: 'error', message: err.message });
  }
});
```

## Buenas prácticas

1. **healthz ≠ readyz** — healthz = proceso vivo, readyz = dependencias ok
2. **503 en readyz** — si falta una dependencia, devolver 503 (no 200)
3. **Métricas de cache** — hit rate indica si el cache está funcionando
4. **Timestamp ISO** — en todas las respuestas para correlación temporal
5. **Uptime** — ayuda a detectar reinicios inesperados

## Pitfalls

- ❌ healthz y readyz iguales → no detectas tokens caídos
- ❌ Sin timeout en test-token → request se cuelga
- ❌ Métricas sin labels → difícil de agregar por instancia

## Referencia

- Código real: `server.js` (healthz, readyz, metrics, test-token)
- Skills relacionadas: env-validacion-estricta, cache-multicapa-memoria-disco