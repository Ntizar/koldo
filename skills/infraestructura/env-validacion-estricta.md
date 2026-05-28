---
name: env-validacion-estricta
description: "Validación de variables de entorno con exit early, defaults, health checks y renovación de nombres. Patrón para apps Node.js con APIs externas."
version: 1.0.0
author: Ntizar
---

# Validación Estricta de Variables de Entorno

Patrón para validar que todas las variables de entorno necesarias existen antes de arrancar.

## Estructura

```javascript
// src/config/env.js
const REQUIRED = ['ESIOS_API_TOKEN'];
const DEFAULTS = {
  PORT: '4000',
  CACHE_TTL_MS: '300000',
  ALLOWED_ORIGINS: '*',
};

function loadEnv() {
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Variables obligatorias faltantes: ${missing.join(', ')}`);
    console.error('   Copia .env.example a .env y rellena los valores.');
    process.exit(1);
  }

  return {
    ESIOS_TOKEN: process.env.ESIOS_API_KEY,      // ← Renombrar para consistencia interna
    PORT: parseInt(process.env.PORT, 10) || DEFAULTS.PORT,
    CACHE_TTL_MS: parseInt(process.env.CACHE_TTL_MS, 10) || DEFAULTS.CACHE_TTL_MS,
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || DEFAULTS.ALLOWED_ORIGINS)
      .split(',').map(o => o.trim()).filter(Boolean),
    // Constantes del proyecto
    API_BASE: 'https://api.ejemplo.com',
    DATA_DIR: process.env.DATA_DIR || './data',
    TIMEZONE: 'Europe/Madrid',
  };
}

module.exports = { loadEnv };
```

## Archivos necesarios

```
proyecto/
├── .env                ← LOCAL, NUNCA en Git (valores reales)
├── .env.example        ← SI en Git (documentación de variables)
├── .dockerignore       ← excluye .env
└── .gitignore          ← excluye .env
```

## Ejemplo .env.example

```bash
# Token API — OBLIGATORIO
ESIOS_API_TOKEN=tu_token_aqui

# Puerto (default: 4000)
PORT=4000

# TTL cache en ms (default: 300000 = 5 min)
CACHE_TTL_MS=300000

# Orígenes CORS permitidos (separados por coma)
ALLOWED_ORIGINS=https://midominio.com

# Claves opcionales
NAN_API_KEY=
```

## Health check con readiness

```javascript
app.get('/readyz', (req, res) => {
  const esiosReady = Boolean(env.ESIOS_TOKEN);
  const status = esiosReady ? 'ready' : 'degraded';
  res.status(esiosReady ? 200 : 503).json({
    status, uptime: process.uptime(),
    checks: { esios_api_token: esiosReady },
  });
});
```

## Buenas prácticas

1. **Exit early** — si falta una variable obligatoria, salir con error claro
2. **Renombrar variables** — `ESIOS_API_TOKEN` → `ESIOS_TOKEN` (consistencia interna)
3. **Defaults en código** — no asumir que process.env tiene valor
4. **Parseo explícito** — `parseInt` para números, `.split(',')` para listas
5. **.env.example en Git** — documentación viva de qué necesita el proyecto
6. **Readiness check** — expone qué dependencias están disponibles

## Pitfalls

- ❌ Usar `process.env.VAR` directamente sin default → undefined crash
- ❌ Token en frontend (código público) → seguridad comprometida
- ❌ No validar al arrancar → fallo silencioso horas después
- ❌ Hardcodear URLs de API → imposible cambiar de entorno

## Referencia

- Código real: `src/config/env.js` y `.env.example` del proyecto ESIOS Dashboard
- Skills relacionadas: seguriad-helmet-cors, health-checks-metrics