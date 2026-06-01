---
name: health-checks-metrics
description: "Patrón de health checks, readiness probes y métricas Prometheus para aplicaciones Node.js. Tres endpoints estándar: /healthz, /readyz y /metrics."
version: 2.0.0
author: Ntizar
license: MIT
tags: [infraestructura, monitorizacion, health, metrics, patrones]
metadata:
  hermes:
    related_skills: [env-validacion-estricta, cache-multicapa-memoria-disco]
---

# Health Checks + Readiness + Métricas — Patrón de Observabilidad

## ¿Qué enseña este skill?

Un patrón de diseño para **observabilidad básica** de aplicaciones Node.js: tres endpoints estándar que responden a diferentes preguntas sobre el estado del sistema.

## ¿Cuándo usarlo?

- Despliegas en Kubernetes, Docker Swarm o plataformas que hacen health checks automáticos
- Necesitas monitorizar el estado de tu aplicación (uptime, errores, rendimiento)
- Quieres integrar con Prometheus/Grafana para dashboards
- Tu equipo necesita detectar fallos antes de que los usuarios los reporten

## ¿Cuándo NO usarlo?

- Tu app es un script de una ejecución → no necesita endpoints de health
- Usas un APM completo (New Relic, Datadog) → puede cubrir estos endpoints por ti
- La aplicación es interna sin monitorización → prioriza funcionalidad primero

## Arquitectura de los tres endpoints

```
                    ┌─────────────────────┐
                    │    Tu Aplicación     │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │ /healthz  │  │  /readyz  │  │  /metrics │
        │ (Liveness)│  │(Readiness)│  │ (Prometheus)│
        └───────────┘  └───────────┘  └───────────┘
         ¿Vivo?          ¿Listo?        ¿Cómo
         ¿Proceso        ¿Dependencias   van las
         funcionando?    configuradas?   métricas?
```

## Código del patrón

```javascript
/**
 * Patrón de tres endpoints de observabilidad.
 *
 * healthz  = Liveness    → ¿El proceso está vivo?
 * readyz   = Readiness   → ¿Las dependencias están ok?
 * metrics  = Prometheus  → ¿Cómo van las métricas?
 */

// ============================================================
// /healthz — Liveness probe
// ============================================================
// Responde SIEMPRE con 200 mientras el proceso esté vivo.
// No verifica dependencias externas.
//
// Lo que usa: Docker HEALTHCHECK, Kubernetes livenessProbe
// Frecuencia: cada 10-30 segundos
// Acción si falla: reiniciar el contenedor

app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    ts: new Date().toISOString(),
  });
});

// ============================================================
// /readyz — Readiness probe
// ============================================================
// Responde 200 si todas las dependencias están configuradas.
// Responde 503 si falta algo (degradado).
//
// Lo que usa: Kubernetes readinessProbe
// Frecuencia: cada 5-15 segundos
// Acción si falla: quitar de los endpoints de servicio
//   (no se envían requests pero el contenedor no se reinicia)

app.get('/readyz', (req, res) => {
  const checks = {};

  // Verificar cada dependencia externa
  checks.esios_api = Boolean(env.ESIOS_TOKEN);
  checks.database = dbConnected; // si tienes DB

  const allReady = Object.values(checks).every(v => v);
  const status = allReady ? 'ready' : 'degraded';
  const httpStatus = allReady ? 200 : 503;

  res.status(httpStatus).json({
    status,
    uptime: Math.round(process.uptime()),
    ts: new Date().toISOString(),
    checks,
  });
});

// ============================================================
// /metrics — Prometheus metrics
// ============================================================
// Formato Prometheus text/plain. Labels para agregar por instancia.
//
// Lo que usa: Prometheus scrape, Grafana dashboards
// Frecuencia: cada 15-60 segundos (configurable en Prometheus)

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');

  const m = cache.metrics();
  const diskStats = cache.disk ? cache.disk.stats() : { files: 0, size: 0 };

  res.send(`
# HELP app_uptime_seconds Server uptime in seconds
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${Math.round(process.uptime())}

# HELP api_cache_hits_total Total cache hits
# TYPE api_cache_hits_total counter
api_cache_hits_total ${m.hits}

# HELP api_cache_misses_total Total cache misses
# TYPE api_cache_misses_total counter
api_cache_misses_total ${m.misses}

# HELP api_cache_hit_rate_percent Cache hit rate percentage
# TYPE api_cache_hit_rate_percent gauge
api_cache_hit_rate_percent ${m.hitRate}

# HELP api_cache_memory_size Current number of items in memory cache
# TYPE api_cache_memory_size gauge
api_cache_memory_size ${m.size}

# HELP api_cache_disk_files Current number of files in disk cache
# TYPE api_cache_disk_files gauge
api_cache_disk_files ${diskStats.files}

# HELP api_cache_disk_size_bytes Total size of disk cache in bytes
# TYPE api_cache_disk_size_bytes gauge
api_cache_disk_size_bytes ${diskStats.size}
  `.trim());
});
```

## Diferencia clave: healthz vs readyz

| Aspecto | /healthz | /readyz |
|---------|----------|---------|
| Pregunta | ¿Vivo? | ¿Listo? |
| Verifica | Proceso funcionando | Dependencias externas |
| Código HTTP | Siempre 200 | 200 o 503 |
| Si falla | Reiniciar contenedor | Quitar de servicio |
| Usa en | livenessProbe | readinessProbe |
| Frecuencia | Cada 30s | Cada 10s |

## Mejores prácticas

1. **Separar healthz de readyz** — healthz = proceso vivo, readyz = dependencias ok. Son preguntas diferentes.
2. **503 en readyz** — si falta una dependencia, devolver 503 (no 200). El load balancer lo detecta.
3. **Métricas con labels** — si tienes múltiples instancias, añadir `instance` label para diferenciar.
4. **Timestamp ISO** — en todas las respuestas para correlación temporal entre logs y métricas.
5. **Uptime en segundos** — ayuda a detectar reinicios inesperados (si el uptime se resetea frecuentemente).
6. **No exponer /metrics públicamente** — proteger con auth o limitar a la red interna.

## Pitfalls

- ❌ healthz y readyz iguales → no detectas tokens caídos o APIs fuera de línea
- ❌ Readyz siempre 200 → el load balancer sigue enviando tráfico a una instancia degradada
- ❌ Métricas sin labels → difícil de agregar por instancia en Prometheus
- ❌ Exponer /metrics a internet → expone información interna de tu sistema
- ❌ Health check que llama a la API externa → si la API está caída, tu health check también falla (circular)

## Referencias

- Código real: `server.js` (healthz, readyz, metrics) del proyecto ESIOS Dashboard
- Skills relacionadas: [env-validacion-estricta](../env-validacion-estricta/), [cache-multicapa-memoria-disco](../cache-multicapa-memoria-disco/)
