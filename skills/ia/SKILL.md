---
name: ntizar-mastermind-architecture
description: "Arquitectura del sistema Ntizar Mastermind v3 - orquestación multi-agente con 11 agentes especializados, memoria Ebbinghaus, y arquitectura de dos capas (Obsidian + OpenCode)."
version: "1.0.0"
category: multi-agent
---

# Ntizar Mastermind Architecture

Sistema de orquestación multi-agente de Ntizar (David Antizar) con 11 agentes especializados.

## Arquitectura de Dos Capas

```
agents/                    .opencode/agents/
(Obsidian - Documentación)     (OpenCode - Ejecución)
```

- **Capa documental** (`agents/`): contexto rico, wikilinks, misiones, interconexiones. Fuente de verdad legible por humanos.
- **Capa de ejecución** (`.opencode/`): config YAML mínima, instrucciones operativas, asignación de modelos.

## Los 11 Agentes

| # | Agente | Rol | Modelo recomendado |
|---|--------|-----|-------------------|
| 00 | Orquestador | Clasifica tareas, diseña flujos, delega | Claude Opus / GPT-4o |
| 01 | Clasificador | Evalúa complejidad, dominio, ambigüedad | - |
| 02 | Explorador | Lee contexto sin modificar nada | Gemini 2.5 Pro (1M tokens) |
| 03 | Planificador | Define estrategia, pasos, criterios | Claude Opus / Sonnet |
| 04 | Spec Writer | Convierte plan en spec ejecutable | Claude Opus / Sonnet |
| 05 | Implementador | Ejecuta la spec | Claude Opus / Sonnet |
| 06 | Revisor | Validación PASS/FAIL | Claude Sonnet / Flash |
| 07 | Crítico | Revisión adversarial | Claude Opus |
| 08 | Sintetizador | Transforma reportes en resultados | Claude Haiku / Flash |
| 09 | Archivador | Destila aprendizajes con decaimiento | Claude Haiku / Flash |
| 10 | Bibliotecario | Indexa y organiza | Claude Haiku / Flash |

## Sistema de Memoria Ebbinghaus

```
R(t) = a / (log(t+1))^b + c
```

| Tipo | 30 días | 90 días | 180 días | Uso |
|------|---------|---------|----------|-----|
| Permanente | 100% | 100% | 100% | Reglas del sistema |
| Lento | 71% | 58% | 48% | Patrones técnicos |
| Normal | 52% | 38% | 30% | Conocimiento de dominio |
| Rápido | 35% | 22% | 15% | Detalles de sesión |

## Skills de Dominio

- `software-dev`: 6 fases obligatorias, matriz de decisiones
- `dashboard-dev`: Pipeline de 6 fases, re-aprendizaje dinámico
- `web-deploy`: Patrón single-source, checklists
- `pwa-android`: Progressive Web Apps con offline-first

## Las 12 Reglas (resumen)

1. Flujo completo obligatorio
2. Sincronización multi-archivo
3. Verificar integridad binaria (magic bytes)
4. Deploy consciente de la plataforma
5. README actualizado con cada versión
6. El humano decide la arquitectura
7. ... (ver repo completo)

## Repositorio

https://github.com/Ntizar/NtizarBrainMasterMind

## Aplicación práctica

Cuando Ntizar necesita un sistema multi-agente estructurado:
- Cargar este skill para entender la arquitectura
- Usar el flujo completo (11 agentes) para tareas complejas
- Aplicar decaimiento Ebbinghaus para gestión de memoria
- Asignar modelos según rol (no usar el más caro para todo)
