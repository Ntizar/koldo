# Hermes Agent

- **URL:** https://github.com/NousResearch/hermes-agent
- **Categoría:** IA / Agentes / Framework
- **¿Qué hace?:** Hermes Agent es un agente AI auto-mejorable construido por Nous Research. Es el único agente con un **loop de aprendizaje integrado**: crea skills desde la experiencia, los mejora durante el uso, se auto-nudgea para persistir conocimiento, busca en sus propias conversaciones pasadas, y construye un modelo profundo del usuario a través de sesiones. Funciona en un VPS de $5, un cluster GPU, o infraestructura serverless. Se conecta por Telegram, Discord, Slack, WhatsApp, Signal y CLI.
- **Casos de uso:**
  - Agente personal autónomo que aprende y mejora con el tiempo
  - Automatización programada (cron) con entrega a cualquier plataforma
  - Delegación paralela de tareas a subagentes aislados
  - Desarrollo de software con agentes de código (Codex, Claude Code, Copilot)
  - Análisis de datos, investigación, monitoring
  - Control de smart home, música, email
  - Generación de imágenes, video, audio
  - MCP servers integration
  - Fine-tuning de modelos con trajectory compression
- **Snippets útiles:**

```bash
# Instalación en Linux/macOS
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Instalación en Windows (PowerShell)
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)

# Comandos CLI principales
hermes setup          # Configuración inicial
hermes model          # Cambiar modelo (sin código)
hermes model list     # Listar modelos disponibles
hermes skills list    # Listar skills
hermes cron           # Gestionar cron jobs
hermes tools          # Gestionar herramientas
hermes memory         # Gestionar memoria
```

```python
# Arquitectura de Hermes Agent
# Componentes principales:

# 1. Gateway - Punto de entrada único
#    gateway/run.py, gateway/session.py
#    Soporta: Telegram, Discord, Slack, WhatsApp, Signal, CLI, API Server

# 2. Agent Runtime - Loop principal de conversación
#    agent/conversation_loop.py
#    agent/context_engine.py        # Motor de contexto
#    agent/prompt_builder.py        # Construcción de prompts
#    agent/memory_manager.py        # Gestión de memoria persistente

# 3. Tool System - Registro centralizado de herramientas
#    tools/registry.py              # Registro central (AST-based auto-discovery)
#    tools/file_tools.py            # Operaciones de archivo
#    tools/terminal_tool.py         # Ejecución de terminal
#    tools/browser_tool.py          # Control de navegador
#    tools/delegate_tool.py         # Delegación a subagentes
#    tools/memory_tool.py           # Memoria persistente
#    tools/skills_tool.py           # Gestión de skills

# 4. Skill System - Progressive Disclosure
#    skills/                          # Skills del sistema
#    agent/skill_utils.py            # Utilidades de skills
#    agent/skill_commands.py         # Comandos de skills
#    Format: SKILL.md con YAML frontmatter
#    - name: skill-name (max 64 chars)
#    - description: Brief description (max 1024 chars)
#    - platforms: [macos, linux]  # Opcional
#    - references/, templates/, assets/  # Archivos soportados

# 5. Model Providers - Multi-provider
#    plugins/model-providers/       # 200+ modelos soportados
#    - Nous Portal, OpenRouter, NovitaAI, NVIDIA NIM
#    - OpenAI, Anthropic, Google Gemini, xAI, HuggingFace
#    - Xiaomi MiMo, Kimi/Moonshot, MiniMax, z.ai/GLM

# 6. Transports - Múltiples backends
#    agent/transports/
#    - anthropic.py, bedrock.py, chat_completions.py, codex.py
#    - gemini_native_adapter.py, gemini_cloudcode_adapter.py

# 7. Cron Scheduler - Automatización programada
#    cron/scheduler.py, cron/jobs.py
#    - Natural language scheduling
#    - Delivery to any platform

# 8. Environment Backends
#    tools/environments/
#    - local, docker, ssh, singularity
#    - modal, daytona, vercel_sandbox
```

```python
# Pattern: Crear un custom tool en Hermes
# tools/registry.py usa AST-based auto-discovery
# Cada tool module llama a registry.register() al nivel del módulo:

from tools.registry import registry

@registry.register(
    name="my_custom_tool",
    toolset="my-tools",
    description="Mi herramienta personalizada",
    emoji="🔧",
)
def my_custom_tool(param1: str, param2: int = 10) -> dict:
    """Descripción que el LLM usa para saber cuándo llamar esta herramienta."""
    # Implementación
    return {"result": "success", "data": param1 * param2}
```

```python
# Pattern: Crear un custom skill
# ~/.hermes/skills/my-skill/SKILL.md
"""
---
name: my-skill
description: Breve descripción de mi skill
version: 1.0.0
platforms: [linux, macos]
---

# My Custom Skill

Instrucciones detalladas para el agente...

## Scripts
- scripts/my_script.py
"""

# Structure:
# skills/my-skill/
# ├── SKILL.md           # Instrucciones principales
# ├── references/        # Docs de soporte
# ├── templates/         # Templates reutilizables
# └── scripts/           # Scripts Python de apoyo
```

```python
# Pattern: Memory system (inyección en system prompt)
# memory_tool.py mantiene dos stores:
# - MEMORY.md: notas del agente (environment facts, conventions)
# - USER.md: perfil del usuario (preferences, communication style)
#
# Delimiter: § (section sign)
# Entries son multiline. Character limits (no tokens).
# Frozen snapshot pattern: system prompt es estable,
# tool responses muestran estado en vivo.

# Pattern: Session Search con FTS5
# session_search_tool.py: búsqueda full-text en sesiones pasadas
# con LLM summarization para cross-session recall
```

- **Cómo integrarlo en proyectos:**
  1. Instalar con el script de instalación oficial
  2. Configurar modelo con `hermes model` (cualquier provider)
  3. Conectar plataforma (Telegram, Discord, etc.)
  4. Crear skills personalizados en `~/.hermes/skills/`
  5. Usar `delegate_task` para paralelización
  6. Configurar cron jobs para automatizaciones
  7. Usar memory para persistencia entre sesiones
  8. Para desarrollo avanzado: extender tools/registry.py con custom tools
- **Fecha de aprendizaje:** 2026-05-26
- **Autores:** Nous Research
- **Stars:** 167,594
- **Licencia:** MIT
- **Documentación:** https://hermes-agent.nousresearch.com/docs/
