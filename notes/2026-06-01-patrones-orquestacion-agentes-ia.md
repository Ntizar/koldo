# Patrones de Orquestación de Agentes IA

**Fecha**: 2026-06-01
**Fuente**: Exploración de repositorios con estrellas de Ntizar

---

## Resumen

Se identificaron 3 patrones de orquestación de agentes IA de alto valor:

## Patrón 1: Orca — Worktrees Aislados para Agentes Paralelos

**Referencia**: stablyai/orca (3818★)

Orca permite ejecutar múltiples agentes de código (Claude Code, Codex CLI, OpenCode, etc.) lado a lado, cada uno en su propio worktree git aislado, rastreados desde un solo IDE.

### Características
- Worktrees git aislados para cada agente
- Multiplataforma (macOS, Windows, Linux)
- Agentes compatibles: Claude Code, OpenClaude, Codex, Grok, Antigravity, OpenCode
- Panel unificado de seguimiento

### Lección para Koldo
- El aislamiento de worktrees es un patrón robusto para ejecución paralela segura
- Cada agente opera en su propio espacio sin interferir con otros

## Patrón 2: Kanvas — Canvas de Obsidian para Coordinación Humano-Agente

**Referencia**: XMihura/Kanvas (170★)

Kanvas proporciona un tablero visual de proyectos en Obsidian Canvas donde se planifican tareas y los agentes interactúan a través de una CLI.

### Características
- Archivos .canvas JSON que diff, merge y versionan como cualquier archivo
- Agent-agnostic: funciona con Claude Code, Codex, Gemini CLI, etc.
- Flujo bidireccional: humanos añaden tareas, agentes proponen y reportan
- Sin SaaS, sin build step, sin cuentas

### Lección para Koldo
- El patrón Canvas→JSON→CLI es una convención de flujo de trabajo simple pero efectiva
- Los archivos JSON diff-friendly permiten versionado Git de planes de proyecto

## Patrón 3: SkillSpector — Seguridad como Parte del Pipeline

**Referencia**: NVIDIA/SkillSpector (766★)

Escáner de seguridad que detecta 64 patrones de vulnerabilidad en 16 categorías antes de instalar skills.

### Características
- 26.1% de skills tienen vulnerabilidades, 5.2% intención maliciosa
- Análisis estático + evaluación semántica con LLM
- Risk scoring 0-100 con recomendaciones
- Soporta repos, URLs, zips, directorios, archivos

### Lección para Koldo
- La seguridad de skills debe ser un paso en el pipeline, no una reflexión posterior
- El análisis estático rápido + LLM semántico es un patrón de dos etapas efectivo

## Patrón 4: Hermes Agent — Learning Loop Integrado

**Referencia**: NousResearch/hermes-agent (174906★)

El propio Hermes tiene un loop de aprendizaje integrado: crea skills de experiencia, las mejora durante el uso, se auto-nudgea para persistir conocimiento, busca en sus propias conversaciones pasadas.

### Características
- Creación automática de skills de experiencia
- Mejora continua durante el uso
- Búsqueda en conversaciones pasadas (session_search)
- Modelo profundo del usuario a través de sesiones
- Multi-model: cualquier provider (OpenRouter, OpenAI, NVIDIA, etc.)
- Multi-platform: Telegram, web, CLI

### Lección para Koldo
- El learning loop integrado es el patrón fundamental de un agente auto-mejorable
- session_search + memory + skills forman el trío de persistencia de conocimiento

---

## Comparativa de Patrones

| Patrón | Enfoque | Aislamiento | Coordinación |
|--------|---------|-------------|--------------|
| Orca | IDE multi-agente | Worktrees git | Panel unificado |
| Kanvas | Canvas visual | JSON files | Tablero compartido |
| SkillSpector | Seguridad | Análisis estático | Risk scoring |
| Hermes | Learning loop | Session-based | Memory + Skills |

## Aplicación a Koldo

1. **Orquesta agentes en worktrees aislados** (patrón Orca)
2. **Planifica en Canvas JSON** (patrón Kanvas)
3. **Valida seguridad antes de instalar** (patrón SkillSpector)
4. **Mantiene learning loop integrado** (patrón Hermes)
