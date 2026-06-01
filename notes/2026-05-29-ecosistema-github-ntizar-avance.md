# Exploración Autónoma de GitHub — Avance 29/05/2026

## Contexto
Segunda ronda de exploración de repositorios con estrellas del usuario Ntizar. 
La ronda anterior (28/05) cubrió 50 repos y generó 7 skills. Esta ronda 
profundiza en patrones arquitectónicos y sistemas no cubiertos.

## Repos Explorados en Profundidad

### 1. htekdev/vidpipe (166⭐) — Pipeline de Vídeo Agéntico
**Lo más valioso:** Arquitectura de 8 capas (L0-pure → L7-app) con patrón BaseAgent.

**Patrón BaseAgent:**
- Cada agente extiende BaseAgent
- Implementa `getTools()` y `handleToolCall()`
- Soporta múltiples LLM providers (Copilot SDK, OpenAI, Claude)
- Cost tracking por agente
- Sessions reutilizables con contexto persistente

**Agentes:** 15+ agentes especializados (IdeaDiscovery, Producer, Schedule, Chapter, Shorts, MediumVideo, Blog, SocialMedia, Summary, Thumbnail, Graphics, Interview, etc.)

**Asset Pipeline:** Cada agente produce assets tipados (VideoAsset, BlogAsset, ShortVideoAsset, etc.)

### 2. stablyai/orca (3.7k⭐) — IDE Multi-Agente
**Lo más valioso:** Sistema de skills integrado con 3 niveles:

1. **Orchestration** — Mensajería inter-agentes, DAGs, decision gates
2. **CLI** — Worktrees, terminales, browser automation
3. **Computer Use** — Control de apps de escritorio vía accessibility tree

**Patrón AGENTS.md:** Archivo de metadatos legible por máquina con design system, naming conventions, worktree safety rules.

### 3. NangoHQ/nango (9.4k⭐) — Integraciones con 800+ APIs
**Lo más valioso:** Sistema de skills para building integrations:

- 8 skills en `.agents/skills/` para diferentes fases del desarrollo
- Patrón de creating-integration-docs con templates
- Agent builder skill para crear subagentes
- Three primitives: Auth, Proxy, Sync

### 4. crystaldba/postgres-mcp (2.8k⭐) — PostgreSQL MCP Pro
**Lo más valioso:** MCP server completo con:
- Database health analysis
- Index tuning con algoritmos industriales
- Query plan validation
- Safe SQL execution
- Schema intelligence

### 5. Blaizzy/mlx-vlm (4.8k⭐) — Vision Language Models
**Lo más valioso:** Inference y fine-tuning de 20+ VLMs en Mac:
- LLaVA, Pixtral, Florence2, Molmo, Paligemma, IDEFICS
- Server FastAPI con continuous batching
- Speculative decoding (DFlash, Gemma 4 MTP)
- Vision feature caching

### 6. NtizarBrainMasterMind (propio, v3.0)
**Lo más valioso:** Arquitectura de 11 agentes especializados con:
- Memoria persistente con decay Ebbinghaus
- Multi-model routing (cada agente usa su modelo óptimo)
- Dos capas: documental (Obsidian) + ejecutable (OpenCode)
- 40-60% ahorro en tokens vs prompting tradicional

### 7. Ntizar-Aurora (propio, v5.1)
**Lo más valioso:** Design system CSS-only con:
- 10 packs opcionales (dashboards, maps, 3D, landings)
- Liquid Glass real con OKLCH, multi-axis theming
- Namespace `.nz` para evitar conflictos
- DESIGN.md como capa de metadatos legible por máquina
- CDN jsDelivr público

## Patrones Identificados

### Patrón AGENTS.md
Múltiples proyectos usan `AGENTS.md` como capa de metadatos:
- NtizarBrainMasterMind: definición de agentes con wikilinks
- Orca: design system, naming, worktree safety
- Nango: project setup, package manager, git hooks

### Patrón CLAUDE.md
- Nango: simple, solo configuración de npm
- Orca: symlink a AGENTS.md
- Vidpipe: no tiene (usa AGENTS.md)

### Patrón de Skills
Formato estandarizado con:
- YAML frontmatter (name, description, allowed-tools, license)
- Secciones: Overview, When to Use, Quick Reference, Steps, Pitfalls, Verification
- Directorios: references/, templates/, scripts/

### Patrón de Arquitectura en Capas
vidpipe demuestra la mejor práctica: separar tipos puros (L0) de app (L7), con infraestructura y servicios en capas intermedias.

## Nuevas Skills Creadas (7)

1. **layered-agent-architecture** — Patrón BaseAgent + 8 capas (L0-L7)
2. **agentic-video-pipeline** — Pipeline de vídeo con 15+ agentes especializados
3. **nango-integrations** — Plataforma de 800+ APIs con auth, proxy, sync
4. **postgres-mcp-pro** — MCP server para PostgreSQL con tuning y health checks
5. **orca-multi-agent-ide** — IDE multi-agente con worktrees y mensajería
6. **mlx-vlm-inference** — VLM inference en Mac con MLX
7. **agent-skills-standard** — Standard open Agent Skills format

## Skill Existente Actualizada

- **satellite-ai-vision** — Actualizada con código de ejemplo y más detalles

## Métricas de la Exploración

- **50 repos** explorados (todos los con estrellas)
- **12 repos** explorados en profundidad (README + estructura + código)
- **7 skills** nuevas creadas
- **1 skill** existente actualizada
- **Patrones arquitectónicos** identificados: layered-architecture, agent-pattern, skill-format, agentic-pipeline
