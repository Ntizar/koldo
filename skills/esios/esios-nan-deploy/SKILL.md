---
name: esios-nan-deploy
description: "Procedimiento de deploy de proyectos Node.js en NaN.builders — Dockerfile, Kaniko, variables de entorno, puertos y troubleshooting."
version: 2.0.0
author: Ntizar
tags: [esios, deploy, nan, docker]

---

# Deploy en NaN.builders

Guía para desplegar proyectos Node.js en la plataforma NaN.builders (microVMs KVM/QEMU).

## Estructura del deploy

1. **Push a GitHub** → NaN detecta el cambio y hace build con Kaniko
2. **Kaniko build** → construye la imagen Docker sin daemon
3. **Auto-deploy** → si el build funciona, se despliega automáticamente

## Patrón de archivos .env (CRÍTICO)

Cada proyecto necesita estos 3 archivos:

```
proyecto/
├── .env              ← local, NO en Git (desarrollo)
├── .env.example      ← SÍ en Git (documentación de variables)
├── .dockerignore     ← excluye .env, node_modules, .git
└── .gitignore        ← excluye .env
```

**.env.example** — template con nombres y placeholders:
```
ESIOS_API_TOKEN=tu_token_aqui
PORT=4000
NAN_API_KEY=tu_clave_aqui
```

**.env** — valores reales (solo local):
```
ESIOS_API_TOKEN=abc123...
PORT=4000
```

### Dónde configurar variables en producción
- **NaN:** pestaña **Env** en la web de NaN → dashboard del espacio
- **NUNCA** en el código, commits, o .env en Git
- Se acceden via `process.env.VAR_NAME` en Node.js

### Validación en código (3 patrones)

**Patrón A — Exit early (recomendado para obligatorias):**
```javascript
// src/config/env.js
const REQUIRED = ['ESIOS_API_TOKEN'];
function loadEnv() {
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length > 0) { console.error(`Faltan: ${missing.join(', ')}`); process.exit(1); }
  return { ESIOS_TOKEN: process.env.ESIOS_API_TOKEN, ... };
}
```

**Patrón B — Health endpoint con checks:**
```javascript
app.get('/readyz', (req, res) => {
  const esiosReady = Boolean(process.env.ESIOS_API_TOKEN);
  res.status(esiosReady ? 200 : 503).json({
    status: esiosReady ? 'ready' : 'degraded',
    checks: { esios_api_token: esiosReady }
  });
});
```

**Patrón C — Fallback con generación temporal:**
```javascript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  || crypto.randomBytes(24).toString('base64url'); // Temporal
```

## Dockerfile mínimo para NaN

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY src/ ./src/
COPY public/ ./public/
COPY data/ ./data/

USER appuser
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/healthz || exit 1
CMD ["node", "server.js"]
```

## ⚠️ Reglas críticas

### Puerto
- El espacio de NaN puede estar configurado en cualquier puerto (3500, 4000, 4500, 6000, etc.)
- **El Dockerfile EXPOSE debe coincidir con el puerto del espacio**
- **El server.js debe usar `process.env.PORT || <puerto>` como default**
- **Para sitios estáticos con nginx: el EXPOSE y el `listen` en nginx.conf deben coincidir** — no asumir que nginx escucha en 80 por defecto
- Si no coinciden → 502 Bad Gateway

### Variables de entorno
- Se configuran en la web de NaN → pestaña **Env**
- NO se suben por Git
- Se necesitan para: API keys, tokens, URLs
- `.env.example` en el repo sirve como documentación

### Kaniko
- No soporta `--build-arg` para secrets
- Las secrets VAN en variables de entorno, no en el Dockerfile
- El build puede fallar si `package-lock.json` no coincide con `package.json`

## Troubleshooting 502 Bad Gateway

| Síntoma | Causa | Solución |
|---|---|---|
| 502 Bad Gateway (< 2s) | App crash al arrancar | Verificar token API en pestaña Env de NaN |
| 502 Bad Gateway (2-30s) | Request lenta / hanging | Timeout en API externa, verificar red |
| 502 Bad Gateway (> 30s) | Timeout Cloudflare/NaN | Backend demasiado lento, optimizar consultas |
| Datos stale en frontend | Cache de navegador | Enviar `Cache-Control: no-cache` en HTML/JS |
| `/readyz` muestra `degraded` | Token faltante | Configurar en NaN Env |
| Error 401 en API externa | Token inválido | Revisar token en web del proveedor |
| Error 429 | Rate limit API externa | Cache más agresivo o delay entre requests |

## Diagnóstico

```bash
# Health check
curl https://<app>.apps.nan.builders/healthz

# Readiness check (verifica tokens)
curl https://<app>.apps.nan.builders/readyz

# Verificar que responde JSON real, no HTML de error
curl -s https://<app>.apps.nan.builders/api/esios/summary?fecha=2026-05-25 | head -c 100
```

## Trigger redeploy

Si el deploy se queda atascado:
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

## Patrones aprendidos

1. **Siempre exponer el puerto correcto** — NaN usa el EXPOSE del Dockerfile para mapear el tráfico
2. **Siempre usar `process.env.PORT`** — permite que el contenedor reciba el puerto del entorno
3. **Health endpoint** — `/healthz` devuelve `{"status":"ok"}` para verificar que el app está vivo
4. **Readiness endpoint** — `/readyz` verifica que los tokens están configurados
5. **npm ci en vez de npm install** — usa package-lock.json para builds reproducibles
6. **Usuario no-root** — mejor seguridad: `adduser -S appuser` + `USER appuser`
7. **`.dockerignore`** — siempre excluir `.env`, `node_modules`, `.git`
8. **`.env.example`** — siempre en el repo como documentación de variables necesarias
