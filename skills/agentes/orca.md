# Orca - IDE para Flotas de Agentes Paralelos
- **URL**: https://github.com/stablyai/orca
- **Categoría**: Agentes / IDE
- **Stars**: 3,487
- **¿Qué hace?**: Orca es un IDE multiplataforma (macOS, Linux, Windows) que actúa como **orquestador de flotas de agentes de IA**. Permite ejecutar múltiples agentes de código CLI (Claude Code, Codex, Gemini, Grok, OpenCode, Hermes Agent, y 30+ más) en paralelo, cada uno en su propio **worktree git aislado**. Incluye terminal con splits estilo Ghostty, automatización de navegador (snapshot → interact → re-snapshot), control de escritorio (computer-use), integración con GitHub/GitLab/Linear/Bitbucket, automatización programada con triggers, app móvil compañera (iOS/Android), y un sistema completo de orquestación inter-agentes con mensajería, DAG de tareas, decision gates y dispatch automático. Es un Electron app escrito en TypeScript (MIT).
- **Arquitectura**:
  - **Worktree-native**: Cada agente opera en su propio `git worktree`, completamente aislado. No hay stashing ni branch juggling.
  - **Multi-agent terminals**: Múltiples terminales de agentes en tabs y panes con splits (horizontal/vertical).
  - **CLI pública (`orca`)**: Superficie de control unificada que conecta con el runtime de Orca. Todos los comandos son RPC al editor.
  - **Tres subsistemas CLI**:
    1. **orca-cli**: worktrees, terminales, browser automation, automations.
    2. **orca orchestration**: mensajería inter-agentes, DAG de tareas, dispatch, decision gates, coordinator loops.
    3. **orca computer-use**: control de escritorio vía árboles de accesibilidad y screenshots.
  - **Mensajería inter-agentes**: SQLite-backed mail store con push-on-idle. Los agentes reciben mensajes automáticamente cuando van a idle.
  - **Task DAG**: Las tareas tienen dependencias. Cuando una tarea se marca `completed`, las dependientes se promueven automáticamente a `ready`.
  - **Circuit breaker**: Tras 3 fallos consecutivos, el dispatch se marca `circuit_broken` para evitar loops infinitos.
  - **Coordinator loop**: Fase automática de `decomposing → dispatching → monitoring → merging → done`.
  - **Browser automation**: Motor basado en `agent-browser` (Playwright-like) con snapshot de árbol de accesibilidad + element refs.
  - **Computer-use**: Usa árboles de accesibilidad nativos (AXUIElement en macOS, UIA en Windows, AT-SPI en Linux) + screenshots.
  - **Estructura del código**: `src/cli/` (CLI pública), `src/main/` (Electron main process con hooks por agente), `src/renderer/` (UI), `src/shared/` (tipos y lógica), `skills/` (SKILL.md para agentes), `mobile/` (app Expo), `native/` (computer-use nativo Swift/Python/PowerShell).
- **Casos de uso**:
  - Ejecutar varios agentes de IA (Claude Code, Codex, Gemini, etc.) simultáneamente en repositorios aislados
  - Orquestación multi-agente con DAG de tareas, dispatch automático y mensajería inter-agentes
  - Automatización de navegador (snapshot → interact → re-snapshot) vía CLI
  - Control de escritorio (computer-use) para interactuar con apps locales vía accesibilidad
  - Automatización programática de flujos de trabajo con orca automations (cron, triggers)
  - Revisión de diffs generados por IA con anotaciones inline
  - Conectar worktrees remotos vía SSH
  - Control de agentes desde app móvil (iOS/Android)
  - Crear un worktree por issue de GitHub
  - Coordinar flujos de decomposición de specs en subtareas paralelas con gates de decisión humanos
- **Snippets útiles**:
  ```bash
  # ── Verificar Orca y estado ──
  orca status --json
  orca worktree ps --json
  orca terminal list --json

  # ── Worktrees ──
  orca worktree create --repo id:<repoId> --name fix-login --issue 123 --comment "seed" --json
  orca worktree set --worktree active --comment "reproduced bug; collecting logs" --json
  orca worktree rm --worktree id:<worktreeId> --force --json

  # ── Terminales de agentes ──
  orca terminal create --worktree active --title "worker-1" --command "claude" --json
  orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 60000 --json
  orca terminal read --terminal <handle> --json
  orca terminal send --terminal <handle> --text "continue" --enter --json
  orca terminal split --terminal <handle> --direction horizontal --command "npm test" --json

  # ── Browser automation (snapshot-interact loop) ──
  orca goto --url https://example.com --json
  orca snapshot --json
  orca click --element @e3 --json
  orca snapshot --json
  orca wait --text "Dashboard" --json

  # ── Orquestación inter-agentes ──
  # Crear terminal worker
  orca terminal create --worktree active --title "worker-1" --command "claude" --json
  # Esperar boot
  orca terminal wait --terminal term_abc123 --for tui-idle --timeout-ms 60000 --json
  # Crear y dispatch tarea
  orca orchestration task-create --spec "Fix the login button CSS" --json
  orca orchestration dispatch --task task_def456 --to term_abc123 --inject --json
  # Esperar worker_done (no sleep loops!)
  orca orchestration check --wait --types worker_done,escalation --timeout-ms 300000 --json

  # ── Mensajería inter-agentes ──
  orca orchestration send --to @all --subject "Update" --body "Done with phase 1" --type status --json
  orca orchestration check --wait --types worker_done --timeout-ms 120000 --json
  orca orchestration reply --id <msg_id> --body "Acknowledged" --json

  # ── Decision gates ──
  orca orchestration gate-create --task <taskId> --question "Proceed with production deploy?" --options '["yes","no"]' --json
  orca orchestration gate-resolve --id <gateId> --resolution "yes" --json

  # ── Automations ──
  orca automations create --name "Daily review" --trigger daily --time 09:00 \
    --prompt "Review open changes" --provider codex --repo id:<repoId> --json
  orca automations list --json

  # ── Computer-use ──
  orca computer list-apps --json
  orca computer get-app-state --app com.spotify.client --json
  orca computer click --app com.spotify.client --element-index 42 --json

  # ── Grupos de terminales ──
  orca orchestration send --to @claude --subject "Hello" --body "Hi" --json
  orca orchestration send --to @codex --subject "Hello" --body "Hi" --json
  orca orchestration send --to @all --subject "Broadcast" --body "All done" --json
  ```
- **Cómo integrarlo en proyectos**:
  1. **Instalación**: Descargar desde [onOrca.dev](https://onOrca.dev) o vía Homebrew (`brew install --cask stablyai/orca/orca`), AUR (`yay -S stably-orca-bin`), o releases de GitHub.
  2. **Verificar instalación**: `command -v orca` y `orca status --json`. El comando `orca` debe estar en PATH.
  3. **Configurar agentes**: Trae tus propias suscripciones (Claude Code, Codex, etc.). Orca detecta automáticamente los CLIs instalados. Soporta 30+ agentes CLI.
  4. **Worktrees**: Cada tarea de agente vive en su propio worktree git. Usar `orca worktree create` en lugar de `git worktree` directamente para mantener el estado sincronizado con Orca. Los worktree selectors soportan: `id:`, `path:`, `branch:`, `issue:`, `active`/`current`.
  5. **Orquestación**: Para flujos multi-agente, usar `orca orchestration` (task-create, dispatch, check --wait). Los workers reportan con `worker_done`. Usar `--inject` para que el agente reciba instrucciones de comunicación. El coordinator loop automatiza: decomposing → dispatching → monitoring → merging → done.
  6. **Automations**: Crear flujos programados con `orca automations create`. Soporta triggers: `hourly`, `daily`, `weekdays`, `weekly`, cron expressions, RRULE.
  7. **Browser automation**: Usar el loop `goto → snapshot → interact → snapshot` para automatizar navegadores desde agentes. Usar `--page <browserPageId>` para flujos concurrentes.
  8. **Computer use**: Para control de escritorio, usar `orca computer` con el patrón snapshot-act-snapshot. Requiere permisos de accesibilidad.
  9. **Mobile companion**: Controlar agentes desde el teléfono con la app Orca IDE (iOS/Android).
  10. **Agent guidance**: Si `orca` está en PATH, usarlo directamente sin preflight checks. Actualizar worktree comments en checkpoints significativos. Preferir `--json` para output parseable. Usar `terminal wait --for tui-idle` en lugar de sleeps.
- **Fecha de aprendizaje**: 2026-05-27
