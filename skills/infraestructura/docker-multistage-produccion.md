---
name: docker-multistage-produccion
description: "Dockerfile multistage para Node.js con usuario no-root, health checks y build optimizado para NaN.builders/Kaniko."
version: 1.0.0
author: Ntizar
---

# Docker Multistage para Producción en NaN.builders

Patrón de Dockerfile multistage para apps Node.js, optimizado para la plataforma NaN.builders (Kaniko build).

## Dockerfile completo

```dockerfile
# Stage 1: Dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Producción
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Usuario no-root (seguridad)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar solo lo necesario
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY src/ ./src/
COPY public/ ./public/
COPY data/ ./data/

USER appuser
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/healthz || exit 1

CMD ["node", "server.js"]
```

## Archivos auxiliares

### .dockerignore
```
.git
.gitignore
.env
.env.local
node_modules
__pycache__
*.md
tests/
```

### .gitignore
```
node_modules/
.env
.env.local
*.log
data/esios-cache/
```

## Buenas prácticas

1. **Multistage** — separar `npm ci` del runtime reduce la imagen final
2. **npm ci** — usa `package-lock.json` para builds reproducibles
3. **Usuario no-root** — `adduser -S appuser` + `USER appuser`
4. **Health check** — Docker HEALTHCHECK para que la plataforma detecte caídas
5. **Solo lo necesario** — no copiar tests, docs, ni node_modules de dev
6. **EXPOSE explícito** — debe coincidir con el puerto configurado en NaN

## Reglas críticas para NaN.builders

- **Puerto**: el EXPOSE del Dockerfile debe coincidir con el puerto configurado en el espacio NaN
- **PORT env**: la app debe usar `process.env.PORT || 4000`
- **Env vars**: se configuran en la pestaña Env de NaN, NUNCA en .env en Git
- **Kaniko**: no soporta `--build-arg` para secrets

## Pitfalls

- ❌ `npm install` en vez de `npm ci` → build no reproducible
- ❌ Usuario root → vulnerabilidad de seguridad
- ❌ Sin HEALTHCHECK → NaN no detecta si la app está caída
- ❌ EXPOSE 3000 pero la app usa 4000 → 502 Bad Gateway
- ❌ package-lock.json desactualizado → Kaniko falla

## Referencia

- Código real: `Dockerfile` del proyecto ESIOS Dashboard
- Skills relacionadas: env-validacion-estricta, nan-deploy