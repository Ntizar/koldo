---
name: endpoints-dashboard-rest
description: "Diseño de endpoints REST para un dashboard de datos — summary, indicator genérico, monthly, yearly, predicción. Patrón con endpoints en español."
version: 1.0.0
author: Ntizar
license: MIT
metadata:
  hermes:
    tags: [api, rest, endpoints, dashboard, espanol]
    related_skills: [cache-multicapa-memoria-disco, health-checks-metrics, seguridad-helmet-cors]
---

# Endpoints REST para Dashboard de Datos

Catálogo de endpoints REST diseñados para servir un dashboard con datos de APIs externas. Todos los nombres en español.

## Catálogo de endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Frontend dashboard principal |
| `GET` | `/healthz` | Estado básico del proceso |
| `GET` | `/readyz` | Readiness (token configurado, etc.) |
| `GET` | `/metrics` | Métricas Prometheus |
| `GET` | `/api/v1/summary?fecha=YYYY-MM-DD` | Dataset consolidado del día |
| `GET` | `/api/v1/indicator?id=ID&fecha=YYYY-MM-DD` | Indicador genérico (cualquier ID) |
| `GET` | `/api/v1/monthly?id=ID&mes=YYYY-MM` | Serie diaria de un mes |
| `GET` | `/api/v1/yearly?id=ID&ano=YYYY` | Serie agregada por año |
| `GET` | `/api/v1/forecast?fecha=YYYY-MM-DD&param=value` | Predicción con escenarios |
| `GET` | `/api/v1/test-token` | Verificar token API |
| `GET` | `/api/v1/cache-stats` | Estado del cache |
| `POST` | `/api/v1/cache-clear` | Limpiar cache manualmente |

## Patrón de implementación

```javascript
// server.js

// Summary consolidado (el más usado)
app.get('/api/v1/summary', async (req, res) => {
  try {
    const fecha = getRequestDate(req);  // Valida o usa hoy
    const cacheKey = `summary:${fecha}`;
    let data = cache.get(cacheKey);
    if (!data) {
      data = await buildSummary(fecha, env.TOKEN);
      cache.set(cacheKey, data);
    }
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Error al obtener resumen' });
  }
});

// Indicador genérico (cualquier ID)
app.get('/api/v1/indicator', async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const fecha = getRequestDate(req);
    if (!id || isNaN(id)) return res.status(400).json({ error: '"id" requerido' });

    const cacheKey = `indicator:${id}:${fecha}`;
    let data = cache.get(cacheKey);
    if (!data) {
      const raw = await fetchIndicator(id, fecha, env.TOKEN);
      data = { id, values: raw?.indicator?.values || [], info: getInfo(id) };
      cache.set(cacheKey, data);
    }
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Error al obtener indicador' });
  }
});
```

## Buenas prácticas

1. **Fechas en YYYY-MM-DD** — formato estándar ISO, validado con regex + Date
2. **Cache en todos los endpoints GET** — evitar llamadas repetidas a API externa
3. **Nombres en español** — `prediccion`, `fecha`, `resumen`, `valores`
4. **Error handling consistente** — siempre devolver JSON, nunca HTML
5. **Validación de parámetros** — `parseInt` + `isNaN` + `isValidDateStr`
6. **Soporte de query params extra** — para escenarios, filtros, etc.

## Validación de fecha

```javascript
function getRequestDate(req) {
  const raw = req.query.fecha || req.query.date;
  return isValidDateStr(raw) ? raw : formatDateInMadrid();
}
```

## Cache-busting para el frontend

```javascript
app.get('/js/cache-bust.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`var CACHE_BUST=${Date.now()};`);
});
```

## Pitfalls

- ❌ No validar fechas → fechas inválidas como '2026-02-30' pasan
- ❌ Sin cache en indicador genérico → cada request quema una petición API
- ❌ Error HTML en vez de JSON → el frontend no puede parsear
- ❌ Nombres en inglés y español mezclados → inconsistencia

## Referencia

- Código real: `server.js` del proyecto ESIOS Dashboard
- Skills relacionadas: cache-multicapa-memoria-disco, health-checks-metrics, seguridad-helmet-cors