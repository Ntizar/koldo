# Criterios de Eliminación de Skills

**Actualizado:** 2026-06-01 tras auditoría completa

## Criterio Fundamental

Un skill debe ser un **patrón reutilizable con valor educativo**. No debe ser la documentación de un proyecto específico.

## ✅ SE MANTIENEN (tienen valor educativo)

### Patrones de diseño frontend
- `frontend-service-worker-pwa` — Patrón PWA con Service Worker
- `frontend-error-boundaries` — Error boundaries para dashboards
- `frontend-debugging-patterns` — Patrones de debugging frontend
- `web-workers-comlink` — Patrón Web Workers con Comlink
- `webgpu-onnx-detection` — Ejecución de modelos en navegador
- `liquid-glass-css` — Patrón CSS con efecto glass

### Patrones de infraestructura y backend
- `api-credentials` — Patrón de gestión de credenciales
- `node-esm-interop` — Patrón ESM/CommonJS
- `docker-multistage-produccion` — Patrón Dockerfile
- `cache-multicapa-memoria-disco` — Patrón de cache
- `env-validacion-estricta` — Patrón de validación de env vars

### Patrones de algoritmos y computación
- `kalman-cursor-smoothing` — Filtro Kalman 2D
- `iterative-algorithm-refinement` — Refinamiento iterativo
- `web-workers-comlink` — Patrón Web Workers con Comlink
- `solar-shadow-computation` — Computación pesada sin bloquear UI

### Patrones de arquitectura y orquestación
- `layered-agent-architecture` — Arquitectura en capas L0-L7
- `mastermind-multi-agent-orchestration` — Orquestación multi-agente
- `delegar-no-comprimir` — Patrón de delegación sin compresión
- `9009-multi-iteration` — Patrón de mejora iterativa

### Referencias de buenas prácticas
- `google-eng-practices` — Prácticas de ingeniería de Google
- `markitdown` — Patrón de conversión de formatos
- `liteparse-rust-pdf-ocr` — Patrón de OCR rápido
- `agent-skills-standard` — Formato estándar de skills

### Skills propios del sistema
- `koldo-setup` — Setup del sistema Koldo
- `koldo/freehands-architecture` — Arquitectura de FreeHands
- `koldo/auditoria-simulacion-energetica` — Auditoría de simuladores
- `esios-api`, `esios-indicators-correct`, `esios-nan-deploy` — Conocimiento ESIOS

## ❌ SE ELIMINAN (no tienen valor educativo)

### Project-readmes puros
Skills que son esencialmente el README de un proyecto, sin contener un patrón reutilizable:
- `esios-dashboard` — README del proyecto esios-work
- `nan-dashboard-deploy` — Deploy específico de nan-dashboard
- `nan-spaces-portfolio` — Deploy específico de nan-dashboard
- `sistema-electrico-futuro` — README del proyecto
- `rumby-multimodal-mobility` — README del proyecto
- `ia` — README del proyecto
- `devops` (top-level) — README del proyecto
- `frontend` (top-level) — README del proyecto

### Scripts específicos
Skills que documentan un script concreto, no un patrón:
- `9009-mejora-continua` — Redundante con `9009-multi-iteration`
- `market-electric-report` — Script específico de informes

### APIs específicas
Skills que documentan una API concreta, no un patrón:
- `bicimad-api` — API específica de Bicimad

### Editores/simuladores/calculadoras específicas
- `familia-tree-editor` — Editor específico
- `empleady-employee-profitability` — Simulador específico
- `irpf-calculator-visual` — Calculadora específica
- `orbitmixer-satellite-compare` — Comparador específico

### Efectos visuales específicos
- `metalhoverlab-cursor-relief` — Efecto específico

### Análisis específicos
- `voynich-structural-analysis` — Análisis específico de manuscrito

### Listas de referencias
- `awesome-design-systems` — Lista de referencias, no patrón

### Sin valor educativo
- `metabase` — Solo descripción, sin contenido útil
- `vibevoice` — Solo descripción, sin contenido útil

## ⚠️ FUSIONAR (cobren lo mismo)

### Grupo ESIOS (5 → 1)
- `esios-api` + `esios-indicators-correct` + `esios-nan-deploy` + `esios-dashboard-troubleshooting` + `esios-telegram-report`
- → Unificar en un skill `esios-complete` con secciones claras

### Grupo GitHub (8 → 2)
- `github-auth` + `github-repo-management` + `github-knowledge-repo` + `github-pr-workflow` + `github-issues` + `github-code-review` + `github-pages-static` + `git-repo-recovery`
- → Unificar en `github-workflow` (general) + `github-knowledge-repo` (específico)

### Grupo Frontend (4 → 2)
- `frontend-api-client-errores` + `frontend-orquestacion-carga` + `frontend-estado-persistencia` + `frontend-fechas-timezone-local` + `frontend-tabs-navegacion` + `frontend-sparklines-plotly` + `frontend-config-mapa-colores`
- → Unificar en `frontend-dashboards` (patrón completo) + `frontend-utilities` (utilidades)

### Grupo Infraestructura (7 → 2)
- `docker-multistage-produccion` + `env-validacion-estricta` + `health-checks-metrics` + `seguridad-helmet-cors` + `api-cliente-http-robusto` + `cache-multicapa-memoria-disco`
- → Unificar en `nodejs-production` (patrón completo) + `security-hardening` (seguridad)

### Grupo DevOps (11 → 3)
- `nan-deploy` + `koldo-setup` + `aurora-nightly` + `aurora-nightly-pipeline` + `cron-script-pattern` + `static-digest-pipeline` + `nango` + `nango-integrations` + `postgres-mcp` + `postgres-mcp-pro` + `layered-agent-architecture`
- → Unificar en `deploy-patterns` + `monitoring-patterns` + `architecture-patterns`

## Criterio de Decisión Rápido

Antes de crear un skill, aplicar el filtro:

1. **¿Es un patrón reutilizable?** → Si es específico de un proyecto → ❌ NO es skill
2. **¿Aporta conocimiento educativo?** → Si solo documenta un CLI tool → ❌ NO es skill
3. **¿Es compacto?** → Si es >5KB → ⚠️ usar refs pattern
4. **¿Tiene tags?** → Mínimo 3 tags descriptivos
5. **¿Es necesario?** → Si ya existe un skill similar → ⚠️ fusionar
