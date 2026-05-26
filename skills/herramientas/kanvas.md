---
name: kanvas
---

# Kanvas

- **URL:** https://github.com/XMihura/Kanvas
- **Categoría:** Herramientas / Gestión de proyectos con IA
- **¿Qué hace?:**
Kanvas es un sistema de gestión de proyectos que integra agentes de IA (Claude Code, Codex, Gemini CLI, etc.) con un tablero visual en Obsidian Canvas. Proporciona un flujo de trabajo donde los humanos planifican y los agentes ejecutan, todo coordinado a través de un archivo `.canvas` JSON y una CLI de Python que mantiene las transiciones de estado válidas.

- **Casos de uso:**
  - Coordinar proyectos donde humanos y agentes de IA trabajan juntos
  - Planificar tareas con dependencias visuales (flechas) en Obsidian Canvas
  - Mantener un historial versionable del progreso del proyecto en Git
  - Usar múltiples agentes simultáneamente o cambiar entre ellos
  - Gestionar tareas que son para humanos, para agentes, o mixtas
  - Automatizar el bloqueo/desbloqueo de tareas dependientes

- **Snippets/Conceptos clave:**
  - **Estados de tareas (por color):**
    - 🟣 Purple = Proposed (agente propone)
    - 🔴 Red = To Do (humano aprueba)
    - 🟠 Orange = Doing (agente o humano trabaja)
    - 🔵 Cyan = Review (agente termina, humano revisa)
    - 🟢 Green = Done (humano verifica)
    - ⬜ Gray = Blocked (dependencia no completada, automático)
  - **Flujo:** `Propose → Purple → Approve → Red → Start → Orange → Finish → Cyan → Verify → Green`
  - **CLI tool** (`canvas-tool.py`): Python 3.7+, cero dependencias. Mantiene agentes honestos:
    ```bash
    # Inicializar en un proyecto
    python canvas-tool.py init /path/to/project

    # Leer estado
    python canvas-tool.py Project.canvas status
    python canvas-tool.py Project.canvas show <ID>
    python canvas-tool.py Project.canvas list [STATE|GROUP]
    python canvas-tool.py Project.canvas ready      # tareas rojas listas
    python canvas-tool.py Project.canvas blocked    # tareas bloqueadas

    # Transiciones
    python canvas-tool.py Project.canvas start <ID>   # Red → Orange
    python canvas-tool.py Project.canvas finish <ID>  # Orange → Cyan
    python canvas-tool.py Project.canvas pause <ID>   # Orange → Red
    python canvas-tool.py Project.canvas edit <ID> "text"  # actualizar descripción

    # Agregar tareas
    python canvas-tool.py Project.canvas propose "group" "title" "description" [--depends-on ID ...]
    python canvas-tool.py Project.canvas propose-group "label"
    python canvas-tool.py Project.canvas batch          # bulk-add desde stdin JSON
    python canvas-tool.py Project.canvas add-dep FROM TO
    python canvas-tool.py Project.canvas normalize      # asignar IDs, arreglar blocked
    ```
  - **Agent instructions:** `CLAUDE.md` para Claude Code, `AGENTS.md` para Codex/Gemini. Se pegan en el system prompt.
  - **Canvas Watcher Plugin:** Plugin opcional de Obsidian que lintea el board al editar, auto-gestiona estados bloqueados y detecta dependencias circulares.
  - **Archivo `.canvas`:** JSON que versionas en Git. Cada commit refleja el estado del board en ese momento.

- **Cómo integrarlo en proyectos:**
  1. **Setup:** Clona Kanvas fuera del proyecto y ejecuta `python canvas-tool.py init /path/to/project`.
  2. **Planificación:** Abre el `.canvas` en Obsidian. Agrega tareas, establece prioridades y dependencias con flechas.
  3. **Instrucciones para agentes:** Copia `CLAUDE.md` o `AGENTS.md` al root del proyecto como system prompt.
  4. **Flujo de trabajo:**
     - El agente propone tareas con `propose` (se ponen purple)
     - El humano aprueba (purple → red)
     - El agente ejecuta con `start` → `finish` (orange → cyan)
     - El humano verifica y marca done (cyan → green)
  5. **Commit por tarea:** Después de cada tarea, haz commit del código Y del `.canvas` juntos.
  6. **Múltiples agentes:** El board es agnóstico — puedes usar Claude + Codex + Gemini en el mismo proyecto.

- **Fecha de aprendizaje:** 2026-05-26
