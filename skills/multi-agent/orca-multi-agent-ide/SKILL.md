---
name: orca-multi-agent-ide
version: "1.0.0"
description: >
  Orca — IDE multi-agente para orquestar flotas de agentes de código en 
  paralelo. Worktrees aislados, mensajería entre agentes, DAGs de tareas, 
  decision gates. Compatible con Claude Code, Codex, Gemini, OpenCode, etc.
license: MIT
tags: [multi-agent, orca, IDE, code-orchestration]

---

# Orca — IDE Multi-Agente

## Visión General

[Orca](https://github.com/stablyai/orca) (3.7k⭐) es un IDE de próxima generación para trabajar con flotas de agentes de código en paralelo. Disponible en macOS, Windows y Linux.

## Características Principales

### Worktrees Aislados
- Cada agente trabaja en su propio worktree git
- Aislamiento completo entre agentes
- Sin conflictos de archivos

### Agentes Soportados
- Claude Code
- OpenAI Codex
- xAI Grok
- Google Antigravity
- OpenCode
- Y cualquier CLI agent

### Mensajería Inter-Agentes
- SQLite-backed mail store
- Push-on-idle delivery
- Message types: `status`, `dispatch`, `worker_done`, `merge_ready`
- Priority levels: normal, high, urgent

### Orchestration Patterns
- DAGs de tareas con dependencias
- Decision gates (human-in-the-loop)
- Coordinator loops
- Decomposición de specs en subtasks paralelas

## Skills de Orca

### 1. Orchestration
Para coordinación agente-agente:
```bash
# Enviar tarea a worker
orca orchestration send --to worker1 --subject "Implement feature X" --body "..."

# Esperar respuesta
orca orchestration check --wait --types worker_done --timeout-ms 120000

# Check inbox
orca orchestration inbox --limit 10 --json
```

### 2. CLI
Para control de terminales y worktrees:
```bash
# Worktree management
orca worktree create --repo myproject --branch feature-x
orca worktree list --json

# Terminal management
orca terminal read --terminal claude-code-1
orca terminal write --terminal claude-code-1 --text "make build"
orca terminal wait --terminal claude-code-1 --timeout 300

# Browser automation
orca browser snapshot
orca browser click --ref @e5
orca browser type --ref @e3 --text "search query"
```

### 3. Computer Use
Para control de apps de escritorio:
```bash
# List apps
orca computer list-apps --json

# Get app state
orca computer get-app-state --app com.spotify.client --json

# Click element
orca computer click --app com.spotify.client --element-index 42 --json
```

## Patrón de Uso

```
Orchestrator Agent
    ├── Worktree 1 → Claude Code (feature A)
    ├── Worktree 2 → Codex (feature B)
    ├── Worktree 3 → OpenCode (feature C)
    └── Decision Gate → Human approval
```

## Referencias
- [Orca GitHub](https://github.com/stablyai/orca)
- [Orca Website](https://onOrca.dev)
- Skills: `skills/orchestration/`, `skills/orca-cli/`, `skills/computer-use/`
