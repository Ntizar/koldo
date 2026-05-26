# Orca

- **URL:** https://github.com/stablyai/orca
- **Categoría:** IA / Agent IDE
- **¿Qué hace?:** Orca es un IDE multiplataforma (macOS, Linux, Windows) que actúa como orquestador de agentes de IA. Permite ejecutar múltiples agentes de código CLI (Claude Code, Codex, Gemini, Grok, OpenCode, etc.) en paralelo, cada uno en su propio worktree git aislado. Incluye terminal con splits, automatización de navegador, control de escritorio (computer-use), integración con GitHub/GitLab/Linear, app móvil compañera, y un sistema de orquestación inter-agentes con mensajería, DAG de tareas, gates de decisión y dispatch automático. Usa Electron + TypeScript, licencia MIT.
- **Casos de uso:**
  - Ejecutar varios agentes de IA (Claude Code, Codex, Gemini) simultáneamente en repositorios aislados
  - Orquestación multi-agente con DAG de tareas, dispatch automático y mensajería inter-agentes
  - Automatización de navegador (snapshot → interact → re-snapshot) vía CLI
  - Control de escritorio (computer-use) para interactuar con apps locales vía accesibilidad
  - Automatización programática de flujos de trabajo con orca automations (cron, triggers)
  - Revisión de diffs generados por IA con anotaciones inline
  - Conectar worktrees remotos vía SSH
  - Control de agentes desde app móvil (iOS/Android)
- **Snippets útiles:**
  ```bash
  # Verificar que Orca está corriendo
  orca status --json

  # Listar worktrees activos
  orca worktree ps --json

  # Crear un worktree para una tarea
  orca worktree create --repo id:<repoId> --name fix-login --issue 123 --comment "seed" --json

  # Lanzar un agente en un terminal nuevo
  orca terminal create --worktree active --title "worker-1" --command "claude" --json

  # Esperar a que el agente arranque (tui-idle)
  orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 60000 --json

  # Enviar mensaje a un agente
  orca terminal send --terminal <handle> --text "Fix the login button CSS" --enter --json

  # Leer output de terminal
  orca terminal read --terminal <handle> --json

  # Automatización de navegador (snapshot-interact loop)
  orca goto --url https://example.com --json
  orca snapshot --json
  orca click --element @e3 --json
  orca snapshot --json

  # Orquestación: crear y dispatch tarea
  orca orchestration task-create --spec "Implement auth flow" --json
  orca orchestration dispatch --task <taskId> --to <terminalHandle> --inject --json

  # Esperar respuesta del worker
  orca orchestration check --wait --types worker_done,escalation --timeout-ms 300000 --json

  # Crear automatización programada
  orca automations create --name "Daily review" --trigger daily --time 09:00 \
    --prompt "Review open changes" --provider codex --repo id:<repoId> --json

  # Computer use: listar apps y controlar desktop
  orca computer list-apps --json
  orca computer get-app-state --app com.spotify.client --json
  orca computer click --app com.spotify.client --element-index 42 --json
  ```
- **Cómo integrarlo en proyectos:**
  1. **Instalación:** Descargar desde onOrca.dev o vía Homebrew (`brew install --cask stablyai/orca/orca`), AUR (`yay -S stably-orca-bin`), o releases de GitHub.
  2. **Configurar agentes:** Trae tus propias suscripciones (Claude Code, Codex, etc.). Orca detecta automáticamente los CLIs instalados.
  3. **Usar el CLI en scripts:** El comando `orca` es la superficie pública para controlar el editor. Verificar con `command -v orca` y `orca status --json`. Usar `--json` para output parseable.
  4. **Worktrees:** Cada tarea de agente vive en su propio worktree git. Usar `orca worktree create` en lugar de `git worktree` directamente para mantener el estado sincronizado con Orca.
  5. **Orquestación:** Para flujos multi-agente, usar `orca orchestration` (task-create, dispatch, check --wait). Los workers reportan con `worker_done`. Usar `--inject` para que el agente reciba instrucciones de comunicación.
  6. **Automations:** Crear flujos programados con `orca automations create`. Soporta triggers: `hourly`, `daily`, `weekdays`, `weekly`, cron expressions, RRULE.
  7. **Browser automation:** Usar el loop `goto → snapshot → interact → snapshot` para automatizar navegadores desde agentes.
  8. **Computer use:** Para control de escritorio, usar `orca computer` con el patrón snapshot-act-snapshot. Requiere permisos de accesibilidad.
  9. **Mobile companion:** Controlar agentes desde el teléfono con la app Orca IDE (iOS/Android).
  10. **Estructura del código:** `src/cli/` (CLI pública), `src/main/` (Electron main process), `src/renderer/` (UI), `src/shared/` (tipos y lógica compartida), `skills/` (SKILL.md para agentes), `mobile/` (app Expo).
- **Fecha de aprendizaje:** 2026-05-26
