---
name: koldo
description: "Skills del sistema Koldo - agente principal, dashboards, deploy, voz, APIs y automatización para Ntizar."
version: 1.0.0
author: Ntizar
---

# Skills Koldo

Skills propios del sistema Koldo para Ntizar.

## Skills core

- `agente-principal` — Agente principal: orquestación, memoria, GitHub, aprendizaje continuo
- `voice-setup` — STT/TTS configuración
- `secure-api-storage` — Almacenamiento seguro de API keys
- `dashboard-control-center` — NaN Dashboard control center
- `nap-deploy` — Deploy NAP
- `esios-dashboard-deploy` — Deploy dashboard ESIOS en NaN.builders
- `nan-dashboard-deploy` — Deploy portfolio/control center en NaN.builders

## 🆕 Catálogo ESIOS — 20 skills extraídas del proyecto esios-dashboard

Se han extraído 20 patrones reutilizables del proyecto [esios-dashboard](https://github.com/Ntizar/esios-dashboard) (24.469 líneas). Organizados en 5 categorías:

| Categoría | Skills |
|-----------|--------|
| 🏗️ Arquitectura | `arquitectura-dashboard-datos-api` — Flujo completo API → dashboard |
| 🔧 Infraestructura | `api-cliente-http-robusto`, `cache-multicapa-memoria-disco`, `env-validacion-estricta`, `docker-multistage-produccion`, `health-checks-metrics`, `seguridad-helmet-cors` |
| 🖥️ Backend | `fetch-paralelo-fallos-parciales`, `conversion-unidades-api-externa`, `servicio-resumen-consolidado`, `endpoints-dashboard-rest`, `forecast-montecarlo-escenarios` |
| 🎨 Frontend | `frontend-estado-persistencia`, `frontend-orquestacion-carga`, `frontend-api-client-errores`, `frontend-tabs-navegacion`, `frontend-config-mapa-colores`, `frontend-fechas-timezone-local` |
| 🧪 Testing | `testing-jest-mocks-api` — Jest + mocks HTTP + fixtures |

📍 Catálogo completo con descripciones detalladas: [`skills/INDEX.md`](../skills/INDEX.md)
