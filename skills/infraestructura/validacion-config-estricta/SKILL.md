---
name: validacion-config-estricta
description: "Patrón de validación estricta de variables de entorno con exit early, defaults tipados y readiness checks. Evita fallos silenciosos en producción."
version: 2.0.0
author: Ntizar
license: MIT
tags: [infraestructura, configuracion, validacion, patrones, nodejs]
metadata:
  hermes:
    related_skills: [seguridad-helmet-cors, health-checks-metrics]
---

# Validación Estricta de Configuración — Patrón de Configuración Segura

## ¿Qué enseña este skill?

Un patrón de diseño para **validar y centralizar la configuración** de una aplicación al arrancar. Falla rápido si falta algo, convierte tipos explícitamente, y expone un readiness check.

## ¿Cuándo usarlo?

- Tu app depende de variables de entorno (tokens, URLs, puertos)
- Quieres que la app falle al arrancar si falta configuración, no horas después en producción
- Necesitas convertir tipos (string → number, string → array) de forma consistente
- Despliegas en múltiples entornos (dev, staging, prod) con configuraciones diferentes

## ¿Cuándo NO usarlo?

- Tu app no tiene configuración externa → hardcodear es suficiente
- Usas un sistema de configuración centralizado (Consul, Vault, AWS Secrets Manager) → usa ese sistema
- La configuración es dinámica y cambia en runtime → usa un loader en vez de validar al arrancar

## Estructura del patrón

```
proyecto/
├── src/
│   └── config/
│       └── env.js            ← Validación y carga de configuración
├── .env                      ← LOCAL, NUNCA en Git
├── .env.example              ← SI en Git (documentación)
├── .dockerignore             ← excluye .env
└── .gitignore                ← excluye .env
```

## Código del patrón

```javascript
/**
 * Validación estricta de variables de entorno.
 *
 * Patrón: exit early — si falta algo crítico, la app no arranca.
 * Convierte tipos explícitamente para evitar bugs de tipado.
 */

const REQUIRED = [
  'ESIOS_API_TOKEN',
  // Añadir aquí todas las variables obligatorias
];

const DEFAULTS = {
  PORT: '4000',
  CACHE_TTL_MS: '300000',       // 5 minutos
  ALLOWED_ORIGINS: '*',
  NODE_ENV: 'production',
};

function loadEnv() {
  // 1. Verificar variables obligatorias
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error(`\n❌ Variables obligatorias faltantes:`);
    missing.forEach(k => console.error(`   - ${k}`));
    console.error('\n   Copia .env.example a .env y rellena los valores.\n');
    process.exit(1);
  }

  // 2. Construir config con tipos convertidos
  return {
    // Variables obligatorias (renombrar para consistencia interna)
    ESIOS_TOKEN: process.env.ESIOS_API_TOKEN,

    // Números con default
    PORT: parseInt(process.env.PORT, 10) || parseInt(DEFAULTS.PORT, 10),
    CACHE_TTL_MS: parseInt(process.env.CACHE_TTL_MS, 10) || parseInt(DEFAULTS.CACHE_TTL_MS, 10),

    // Listas separadas por coma
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || DEFAULTS.ALLOWED_ORIGINS)
      .split(',').map(o => o.trim()).filter(Boolean),

    // Strings con default
    NODE_ENV: process.env.NODE_ENV || DEFAULTS.NODE_ENV,

    // Constantes del proyecto (no configurables)
    API_BASE: 'https://api.esios.ree.es',
    DATA_DIR: process.env.DATA_DIR || './data',
    TIMEZONE: 'Europe/Madrid',
  };
}

module.exports = { loadEnv };
```

## Uso en la aplicación

```javascript
// server.js
const { loadEnv } = require('./src/config/env');

// Validar Y cargar al arrancar (falla rápido)
const env = loadEnv();

// Usar la configuración validada
const app = require('express')();
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
```

## Ejemplo de .env.example

```bash
# Token API ESIOS — OBLIGATORIO
ESIOS_API_TOKEN=tu_token_aqui

# Puerto (default: 4000)
PORT=4000

# TTL cache en ms (default: 300000 = 5 min)
CACHE_TTL_MS=300000

# Orígenes CORS permitidos (separados por coma)
ALLOWED_ORIGINS=https://midominio.com

# Claves opcionales (dejar vacío si no se usan)
NAN_API_KEY=
```

## Health check con readiness

```javascript
// src/config/readiness.js
function createReadinessCheck(env) {
  return async function readinessCheck() {
    const checks = {};

    // Verificar que el token API es válido (no solo que existe)
    checks.esios_api = Boolean(env.ESIOS_TOKEN);

    // Añadir más checks aquí según dependencias
    // checks.database = await db.ping();

    const allReady = Object.values(checks).every(v => v);
    const status = allReady ? 'ready' : 'degraded';
    const httpStatus = allReady ? 200 : 503;

    return { status, httpStatus, checks };
  };
}
```

## Mejores prácticas

1. **Exit early** — si falta una variable obligatoria, salir con error claro. No intentar continuar.
2. **Renombrar para consistencia** — `ESIOS_API_TOKEN` (externo) → `ESIOS_TOKEN` (interno). La interfaz de la app no debería depender de nombres externos.
3. **Parseo explícito** — siempre convertir tipos: `parseInt` para números, `.split(',')` para listas. Nunca usar valores string donde se espera número.
4. **.env.example en Git** — es documentación viva de qué necesita el proyecto. Cada variable obligatoria debe estar documentada.
5. **Separar obligatorio de opcional** — las obligatorias causan exit(1). Las opcionales tienen default.
6. **Readiness check** — expone qué dependencias están disponibles, no solo que el proceso está vivo.

## Pitfalls

- ❌ Usar `process.env.VAR` directamente sin default → `undefined` crash en runtime
- ❌ Token en código frontend (código público) → cualquier persona puede usar tu API
- ❌ No validar al arrancar → fallo silencioso horas después en producción
- ❌ Hardcodear URLs de API → imposible cambiar de entorno sin modificar código
- ❌ Validar pero no usar la configuración validada → seguir usando `process.env` directamente en el código
- ❌ Variables obligatorias sin documentación → el desarrollador no sabe qué configurar

## Referencias

- Código real: `src/config/env.js` y `.env.example` del proyecto ESIOS Dashboard
- Skills relacionadas: [seguridad-helmet-cors](../seguridad-helmet-cors/), [health-checks-metrics](../health-checks-metrics/)
