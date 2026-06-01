---
name: orca-multi-agente-orquestacion
description: "Patrón de orquestación multi-agente: ejecuta Claude Code, Codex, Gemini y OpenCode en paralelo, cada uno en su propio worktree aislado. Inspirado en Orca (3.5K⭐)."
version: 2.0.0
author: Ntizar + Koldo
---

# Orquestación Multi-Agente (Estilo Orca)

Orquesta múltiples agentes de código (Claude Code, Codex, Gemini, OpenCode) en paralelo con worktrees git aislados, DAG de tareas, y gates de decisión.

## Arquitectura

```
              Orquestador
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
Claude Code     Codex         OpenCode
(worktree A)   (worktree B)   (worktree C)
    │              │              │
    └──────────────┼──────────────┘
                   ▼
           Gate de revisión
                   │
              ┌────┴────┐
              ▼         ▼
           Aceptar   Rechazar→retry
```

## Instalación

```bash
git clone https://github.com/stablyai/orca
cd orca && npm install && npm run dev
```

O compatible con Hermes/Koldo via subagentes:

```javascript
// delegate_task con múltiples agentes en paralelo
const tareas = [
  { goal: "Implementar autenticación JWT en server.js", agent: "claude-code" },
  { goal: "Crear test suite de integración", agent: "codex" },
  { goal: "Documentar API con ejemplos en README", agent: "opencode" },
];
// Cada agente en su propio worktree, resultados mergeados
```

## Patrón: Worktrees Aislados

Cada agente trabaja en su propia copia del repo sin conflictos.

```bash
# Crear worktree para cada agente
git worktree add ../feature-auth feature/auth
git worktree add ../feature-tests feature/tests
git worktree add ../feature-docs feature/docs

# Cada agente trabaja en su worktree independiente
cd ../feature-auth && claude "Implementa JWT auth..."
cd ../feature-tests && codex "Crea tests para auth..."
cd ../feature-docs && opencode "Documenta la API..."

# Merge controlado al final
git worktree remove ../feature-auth
git worktree remove ../feature-tests
git worktree remove ../feature-docs
```

## Patrón: DAG de Tareas con Gates

```javascript
const pipeline = {
  tasks: [
    {
      id: 'auth',
      agent: 'claude-code',
      goal: 'Implementar autenticación JWT',
      dependsOn: [],  // Sin dependencias
    },
    {
      id: 'tests',
      agent: 'codex',
      goal: 'Escribir tests de auth',
      dependsOn: ['auth'],  // Esperar a que auth termine
    },
    {
      id: 'frontend-login',
      agent: 'opencode',
      goal: 'Crear página de login',
      dependsOn: ['auth'],
    },
    {
      id: 'review',
      agent: 'human-or-llm',
      goal: 'Revisar PRs de auth + tests + login',
      dependsOn: ['tests', 'frontend-login'],
      gate: 'approval_required',  // Gate de decisión
    },
  ],
};
```

## Patrón: Gate de Decisión

```javascript
async function gateReview(results) {
  const report = `
  ## Revisión Multi-Agente
  - Auth: ${results.auth.status} — ${results.auth.summary.slice(0, 200)}
  - Tests: ${results.tests.status} — ${results.tests.passRate}% passing
  - Frontend: ${results.frontend.status} — captura: ${results.frontend.screenshot}
  `;

  // Decisión automática: ¿todo OK?
  const allPassed = results.auth.status === 'done'
    && results.tests.passRate > 90
    && results.frontend.status === 'done';

  if (allPassed) {
    await mergeAllWorktrees();
    return { decision: 'approve', report };
  } else {
    return { decision: 'request_changes', report, failed: Object.entries(results).filter(([_, r]) => r.status !== 'done') };
  }
}
```

## Patrón: Inter-Agent Messaging

Los agentes se comunican entre sí para coordinar:

```javascript
// Agente Auth → Agente Frontend (mensaje asíncrono)
await sendMessage('frontend-login', {
  type: 'contract',
  payload: {
    endpoints: {
      POST /api/auth/login: { body: { email, password }, response: { token, user } },
      POST /api/auth/register: { body: { email, password, name }, response: { user } },
    },
  },
});

// Agente Frontend usa ese contrato para saber qué endpoints llamar
```

## Comparativa: Orca vs Hermes delegate_task

| Aspecto | Orca | Hermes delegate_task |
|---------|------|---------------------|
| **Aislamiento** | Worktrees git | Sesiones independientes |
| **Agentes** | Codex, Claude Code, OpenCode, Gemini | Claude Code, Codex, OpenCode |
| **DAG** | Nativo | Manual (tasks array) |
| **Gates** | Approval gates | Via código en el parent |
| **Messaging** | Inter-agent | No (resultado único al final) |
| **Desktop control** | Computer-use nativo | No |

## Buenas prácticas

1. **Worktree aislado por agente** — sin worktree compartido, los agentes se pisan
2. **Gates de revisión obligatorios** — nunca mergear automáticamente sin revisar
3. **Contrato entre agentes** — definir interfaz (endpoints, types) antes de empezar
4. **Timeout por tarea** — 10 min máximo, si no, marcar como fallida
5. **Resultados parciales** — si un agente falla, los demás no se bloquean

## Pitfalls

- ❌ Sin worktres → agentes se pisans cambios (merge hell)
- ❌ Mezclar agentes en el mismo prompt → contexto contaminado
- ❌ Sin gate review → código sin revisar mergeado a main
- ❌ Dependencias circulares → deadlock en el DAG

## Referencia

- Repo Orca: https://github.com/stablyai/orca (3.5K⭐)
- Web: https://onOrca.dev
- Skills relacionadas: testing-jest-mocks-api, github-pr-workflow (si existe)