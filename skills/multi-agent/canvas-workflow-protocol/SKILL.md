---
name: canvas-workflow-protocol
description: "Protocolo de flujo de trabajo Canvas (Kanvas) para gestión colaborativa de tareas entre humanos y agentes IA usando Obsidian Canvas. CLI tool como único medio de modificación, con ciclo de vida estricto de colores y detección de dependencias."
version: "1.0.0"
category: multi-agent
tags: [multi-agent, canvas, workflow, kanvas]

---

# Canvas Workflow Protocol (Kanvas)

Protocolo de gestión colaborativa de tareas entre un humano y un agente IA usando un archivo `.canvas` de Obsidian como tablero compartido.

**Referencia:** https://github.com/XMihura/Kanvas

## Principio Fundamental

**Los agentes NUNCA editan `.canvas` directamente.** Todas las modificaciones pasan por `canvas-tool.py`, que aplica reglas de transición, detección de ciclos y gestión automática de estados bloqueados.

```bash
python canvas-tool.py "<archivo>.canvas" <comando> [args]
```

## Ciclo de Vida de Tareas

| Color | Estado | Quién lo mueve | Comando |
|-------|--------|----------------|---------|
| 🟣 Purple (`"6"`) | Propuesto | Agente | `propose` |
| 🔴 Red (`"1"`) | To Do | Humano | (aprobación humana) |
| 🟠 Orange (`"2"`) | Doing | Agente | `start` |
| 🔵 Cyan (`"5"`) | Review | Agente | `finish` |
| 🟢 Green (`"4"`) | Done | Humano | (verificación humana) |
| ⬜ Gray (`"0"`) | Blocked | Herramienta | auto-gestiona |

### Flujo de transiciones
```
Proposed(Purple) → Approve → ToDo(Red) → Start → Doing(Orange) → Finish → Review(Cyan) → Verify → Done(Green)
```

### Bloqueo automático
Si una tarea depende de algo que no es green, se convierte en gray automáticamente. Cuando la dependencia se completa, se reactiva a red.

## Comandos del CLI

### Lectura (solo lectura)
```bash
python canvas-tool.py "Project.canvas" status          # Overview completo
python canvas-tool.py "Project.canvas" show <TASK-ID>   # Detalle de tarea
python canvas-tool.py "Project.canvas" list [STATE|GROUP]  # Listar tareas
python canvas-tool.py "Project.canvas" blocked          # Tareas bloqueadas
python canvas-tool.py "Project.canvas" blocking         # Qué bloquea a otros
python canvas-tool.py "Project.canvas" ready            # Tareas listas para trabajar
python canvas-tool.py "Project.canvas" dump             # JSON crudo
```

### Ciclo de vida
```bash
python canvas-tool.py "Project.canvas" start <TASK-ID>   # Red → Orange
python canvas-tool.py "Project.canvas" finish <TASK-ID>  # Orange → Cyan
python canvas-tool.py "Project.canvas" pause <TASK-ID>   # Orange → Red
```

### Propuestas (crea tarjetas púrpura)
```bash
python canvas-tool.py "Project.canvas" propose <GROUP> "<TITULO>" "<DESC>" [--depends-on ID ...]
python canvas-tool.py "Project.canvas" propose-group "<LABEL>"
python canvas-tool.py "Project.canvas" batch              # Bulk-add desde JSON stdin
```

### Edición y mantenimiento
```bash
python canvas-tool.py "Project.canvas" edit <TASK-ID> "<TEXTO>"  # Solo tareas orange
python canvas-tool.py "Project.canvas" add-dep <FROM> <TO>       # Añadir dependencia
python canvas-tool.py "Project.canvas" normalize                  # Asignar IDs, actualizar bloqueados
```

## Formato Batch JSON (stdin)
```json
{
  "groups": ["Backend", "Frontend"],
  "tasks": [
    {"group": "Backend", "title": "API endpoints", "desc": "Crear endpoints REST", "depends_on": []},
    {"group": "Frontend", "title": "Dashboard UI", "desc": "Interfaz principal", "depends_on": ["API endpoints"]}
  ]
}
```

## Reglas Estrictas para Agentes

### Lo que PUEDE hacer un agente:
- Leer el tablero: `status`, `show`, `list`, `blocked`, `blocking`, `ready`, `dump`
- Normalizar: `normalize`
- Proponer tareas: `propose` o `batch` (crea tarjetas púrpura)
- Proponer grupos: `propose-group` o `batch`
- Iniciar tarea: `start <ID>` (red → orange)
- Finalizar tarea: `finish <ID>` (orange → cyan)
- Pausar tarea: `pause <ID>` (orange → red)
- Editar texto: `edit <ID> "<texto>"` (solo tareas orange)
- Añadir dependencias: `add-dep <FROM> <TO>`

### Lo que NO PUEDE hacer un agente:
- Editar `.canvas` directamente
- Marcar cualquier tarjeta como green (solo humano)
- Trabajar en tarjetas púrpura (propuestas pendientes)
- Trabajar en tarjetas grises (bloqueadas)
- Trabajar en tarjetas cyan (pendientes de revisión humana)
- Eliminar tarjetas o flechas
- Cambiar tarjetas verdes

## Protocolo de Sesión

1. **Inicio:** `status` → reportar estado al humano
2. **Elegir tarea:** `ready` → preguntar prioridad al humano
3. **Trabajar:** `start <ID>` → ejecutar → `finish <ID>`
4. **Subtareas:** si se descubren, proponer con `propose`
5. **Repetir:** tras verificación humana (green), `normalize` + `ready`

## Aplicación Práctica

Cuando Ntizar necesite gestionar proyectos complejos con múltiples agentes:
- Inicializar con `canvas-tool.py init`
- Copiar RULES.md y CLAUDE.md al proyecto
- Usar el protocolo de sesión para coordinación humano-agente
- El tablero `.canvas` es la fuente de verdad compartida
- Funciona con cualquier agente CLI (Claude Code, Codex, Gemini, Hermes)

## Ventajas del Patrón

- **Agent-agnostic:** No depende de un modelo específico
- **Git-friendly:** `.canvas` es JSON que diff y mergea
- **Seguridad:** La CLI impide transiciones inválidas
- **Transparencia:** El humano tiene autoridad final
- **Simple:** Sin SaaS, sin cuentas, sin build step