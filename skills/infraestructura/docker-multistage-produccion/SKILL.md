---
name: docker-multistage-produccion
description: "Patrón de Dockerfile multistage para Node.js con usuario no-root, health checks y build optimizado para plataformas serverless."
version: 2.0.0
author: Ntizar
license: MIT
tags: [infraestructura, docker, contenedores, patrones, produccion]
metadata:
  hermes:
    related_skills: [env-validacion-estricta, health-checks-metrics]
---

# Docker Multistage para Producción — Patrón de Construcción Segura

## ¿Qué enseña este skill?

Un patrón de Dockerfile **multistage** para aplicaciones Node.js que separa la construcción de dependencias del runtime, ejecuta como usuario no-root y expone health checks.

## ¿Cuándo usarlo?

- Despliegas apps Node.js en contenedores (Docker, Kubernetes, plataformas serverless)
- Necesitas imágenes pequeñas para reducir superficie de ataque y tiempos de deploy
- La plataforma de deploy usa Kaniko o similares (no tienen acceso a root)
- Quieres builds reproducibles y deterministas

## ¿Cuándo NO usarlo?

- Tu app no necesita contenedores (deploy directo a VM o PaaS)
- Necesitas herramientas de desarrollo en el contenedor (debuggers, compiladores) → usa un stage adicional
- La imagen base es demasiado grande para tu caso → considera distroless o scratch

## Estructura del proyecto

```
proyecto/
├── Dockerfile              ← Patrón multistage
├── .dockerignore           ← Archivos a excluir del build context
├── .gitignore              ← Archivos a excluir de Git
├── package.json
├── package-lock.json
├── server.js
└── src/
```

## Código del patrón

### Dockerfile

```dockerfile
# ============================================================
# Stage 1: Construcción de dependencias
# ============================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar solo los archivos de dependencias para aprovechar cache
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ============================================================
# Stage 2: Runtime de producción
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Crear usuario no-root (seguridad por defecto)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar solo lo necesario del stage de dependencias
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules

# Copiar código de la aplicación
COPY package.json ./
COPY server.js ./
COPY src/ ./src/
COPY public/ ./public/
COPY data/ ./data/

# Cambiar a usuario no-root
USER appuser

# Puerto expuesto (debe coincidir con PORT)
EXPOSE 4000

# Health check para que la plataforma detecte caídas
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/healthz || exit 1

CMD ["node", "server.js"]
```

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
*.log
data/esios-cache/
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

1. **Alpine como base** — imágenes ~5MB vs ~900MB de la versión completa. Suficiente para Node.js.
2. **npm ci en vez de npm install** — usa package-lock.json para builds 100% reproducibles.
3. **Usuario no-root** — `adduser -S appuser` + `USER appuser`. Si el contenedor es comprometido, el daño es limitado.
4. **COPY selectivo** — solo copiar lo que la app necesita. Menos archivos = imagen más pequeña = menos superficie de ataque.
5. **EXPOSE explícito** — documenta el puerto y ayuda a la plataforma a configurarlo correctamente.
6. **HEALTHCHECK** — permite que Docker/Kubernetes detecten si la app está viva y respondiendo.

## Reglas para plataformas serverless (NaN.builders, etc.)

- **Puerto**: el `EXPOSE` debe coincidir con el puerto configurado en la plataforma
- **PORT env**: la app debe usar `process.env.PORT || 4000`
- **Env vars**: se configuran en la plataforma, NUNCA en `.env` dentro del Git
- **Kaniko**: no soporta `--build-arg` para secrets → usar secrets de la plataforma

## Pitfalls

- ❌ `npm install` en vez de `npm ci` → build no reproducible, puede variar entre builds
- ❌ Usuario root → si hay vulnerabilidad en la app, el atacante tiene root en el contenedor
- ❌ Sin HEALTHCHECK → la plataforma no detecta si la app está caída
- ❌ EXPOSE diferente al puerto real → la plataforma no puede hacer proxy
- ❌ package-lock.json desactualizado → el build puede fallar o instalar versiones incorrectas
- ❌ Copiar node_modules del host → pueden tener dependencias de desarrollo o ser incompatibles

## Referencias

- Código real: `Dockerfile` del proyecto ESIOS Dashboard
- Skills relacionadas: [env-validacion-estricta](../env-validacion-estricta/), [health-checks-metrics](../health-checks-metrics/)
