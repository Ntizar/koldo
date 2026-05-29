---
name: ntizar-mastermind-v3
description: "Arquitectura completa del sistema Ntizar Mastermind v3 — orquestación multi-agente con 11 agentes especializados, pipeline de flujo adaptativo, memoria Ebbinghaus, y arquitectura de dos capas (Obsidian + OpenCode)."
version: "1.0.0"
category: multi-agent
---

# Ntizar Mastermind v3 — Multi-Agent Orchestration

> **Repo:** https://github.com/Ntizar/NtizarBrainMasterMind
> **Versión:** 3.0
> **Agentes:** 11 especializados
> **Stack:** OpenCode + Obsidian

## Qué es

Framework open-source de orquestación multi-agente que funciona sobre OpenCode + Obsidian. Transforma el flujo de IA de "una conversación a la vez" a un sistema de inteligencia persistente y auto-mejorable.

## Arquitectura de Dos Capas

```
CAPA DOCUMENTAL (Obsidian)          CAPA EJECUCIÓN (OpenCode)
agents/XX-name.md                   .opencode/agents/ntizar-XX.md
|                                   |
| - Full mission statement          | - YAML frontmatter (model, tools)
| - Wikilinks                       | - Minimal operational instructions
| - Rich context & examples         | - Reference to Obsidian doc
| - Interconnection map             | - Output format spec
| - Human-readable                  | - Machine-executable
```

**Resultado:** 42% reducción de tokens vs v2. El `.opencode/` dice "Read agents/XX-name.md for full context" en vez de duplicar.

## Los 11 Agentes

| # | Agente | Rol | Modelo recomendado |
|---|--------|-----|-------------------|
| 00 | **Orquestador** | Clasifica tareas, diseña flujos, delega | Claude Opus / GPT-4o |
| 01 | **Clasificador** | Evalúa complejidad, dominio, ambigüedad | (integrado en Orquestador) |
| 02 | **Explorador** | Lee contexto sin modificar nada | Gemini 2.5 Pro (1M tokens) |
| 03 | **Planificador** | Define estrategia, pasos, criterios | Claude Opus / Sonnet |
| 04 | **Spec Writer** | Convierte plan en spec ejecutable | Claude Opus / Sonnet |
| 05 | **Implementador** | Ejecuta la spec, produce entregables | Claude Sonnet / Flash |
| 06 | **Revisor** | Validación PASS/FAIL contra spec | Claude Sonnet / Flash |
| 07 | **Crítico** | Revisión adversarial | Claude Opus / GPT-4o |
| 08 | **Sintetizador** | Transforma reportes en resultados | Claude Haiku / Flash |
| 09 | **Archivador** | Destila aprendizajes con decaimiento | Claude Haiku / Flash |
| 10 | **Bibliotecario** | Mantiene grafo de conocimiento | Claude Haiku / Flash |

**Regla del Crítico:** Nunca se degrada. Si el mejor modelo no está disponible, se omite completamente.

## Pipeline de Flujos

| Complejidad | Flujo |
|------------|-------|
| 1-2 (simple) | CLASSIFY → IMPLEMENT → REVIEW → SYNTHESIZE |
| 3 (medio) | CLASSIFY → EXPLORE → PLAN → IMPLEMENT → REVIEW → SYNTHESIZE → ARCHIVE |
| 4-5 (complejo) | CLASSIFY → EXPLORE → PLAN → SPEC → IMPLEMENT → REVIEW → CRITICIZE → SYNTHESIZE → ARCHIVE |

## Memoria con Decaimiento Ebbinghaus

```
R(t) = a / (log(t+1))^b + c
```

| Tipo | 30 días | 90 días | 180 días | Uso |
|------|---------|---------|----------|-----|
| Permanente | 100% | 100% | 100% | Reglas del sistema, patrones fundamentales |
| Lento | 71% | 58% | 48% | Patrones técnicos reutilizables |
| Normal | 52% | 37% | 29% | Soluciones a problemas específicos |
| Rápido | 30% | 18% | 12% | Fixes puntuales, contexto temporal |

## Asignación Multi-Modelo

- **Orquestador + Crítico** → Claude Opus / GPT-4o (alto razonamiento)
- **Explorador** → Gemini 2.5 Pro (contexto 1M tokens)
- **Implementador** → Claude Opus / Sonnet (generación código)
- **Revisor** → Claude Sonnet / Flash (criterios concretos)
- **Sintetizador + Archivador** → Claude Haiku / Flash (tareas mecánicas)

**Ahorro:** 40-60% en tokens manteniendo calidad.

## Comunicación entre Agentes

Reportes estructurados con secciones obligatorias:
- Explorer: `EXPLORER REPORT` (max 500 tokens)
- Planner: `PLAN v1` con objective, criteria, steps, risks
- Spec Writer: `SPEC v1` (max 700 tokens) — requiere aprobación humana
- Implementer: `IMPLEMENTER REPORT` + deliverables
- Reviewer: `REVIEWER REPORT` con PASS/FAIL
- Critic: `CRITIC REPORT` con hallazgos adversarios

## Estructura del Proyecto

```
ntizar-mastermind/
├── AGENTS.md                    # Punto de entrada
├── agents/                      # CAPA DOCUMENTAL
│   ├── 00-orchestrator.md       # ... hasta 10-librarian.md
│   ├── session-prompt.md        # Prompt de activación
│   ├── state/                   # Config + estado de sesión
│   ├── templates/               # Intake, specs, reviews, learnings
│   ├── skills/                  # Conocimiento de dominio
│   ├── learnings/               # Patrones con metadatos decaimiento
│   └── projects/                # Hubs de proyectos
└── .opencode/                   # CAPA EJECUCIÓN
    ├── agents/                  # Configs YAML + instrucciones mínimas
    ├── commands/                # Comandos slash
    └── templates/               # Templates de ejecución
```

## Diseño Visual

- **Paleta:** Azul `#3b82f6` + Naranja `#f97316` sobre fondo `#0a0f1e`
- **Efecto:** Cristal líquido con filtros SVG
- **3 niveles de glass:** sutil, estándar, fuerte
- **CSS:** 1,379 líneas en `design-system/ntizar.css`

## Casos de Uso

- Desarrollo de software
- Investigación
- Estrategia y planificación
- Escritura y contenido
- Operaciones y gestión de conocimiento
- Análisis de datos
- Creatividad

## Lecciones Clave

1. **Separación de capas** reduce tokens un 42% — documental (legible) vs ejecutable (mínimo)
2. **Multi-modelo por rol** ahorra 40-60% — no todos los agentes necesitan el mismo modelo
3. **Decaimiento Ebbinghaus** mantiene contexto relevante — conocimiento viejo se desvanece naturalmente
4. **Crítico inamovible** — nunca degradar el modelo del crítico, mejor omitirlo
5. **Reportes estructurados** con límites de tokens — comunicación eficiente entre agentes

## Referencias

- [ARCHITECTURE.md](https://github.com/Ntizar/NtizarBrainMasterMind/blob/master/docs/ARCHITECTURE.md) — Deep dive técnico
- [README_EN.md](https://github.com/Ntizar/NtizarBrainMasterMind/blob/master/README_EN.md) — Versión en inglés
- [AGENTS.md](https://github.com/Ntizar/NtizarBrainMasterMind/blob/master/AGENTS.md) — Guía de agentes
