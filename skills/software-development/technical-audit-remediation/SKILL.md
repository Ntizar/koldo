---
name: technical-audit-remediation
description: "Ejecutar auditorías técnicas con hallazgos clasificados por severidad y plan de corrección en fases."
version: 1.0.0
author: Hermes Agent
tags: [audit, code-review, remediation, prioritization, multi-phase]
related_skills: [systematic-debugging, writing-plans, subagent-driven-development, google-eng-practices]
---

# Technical Audit Remediation

## Overview

Proceso sistemático para recibir, analizar y ejecutar un plan de mejora técnica basado en una auditoría de código. La auditoría clasifica hallazgos por severidad (🔴 crítico, 🟠 alto, 🟡 medio) y propone correcciones en fases.

**Core principle:** Execute audit remediations in priority order, verifying each phase before moving to the next. Never skip 🔴 critical items for 🟡 medium ones.

## When to Use

- User provides a technical audit document (Markdown, text, or link)
- User says "fix this audit", "execute this audit plan", "do the audit improvements"
- User references an audit of their project that needs implementation
- Any structured document with severity-tagged findings and a phased action plan

## The Process

### Phase 0: Read and Understand

1. **Read the audit document** — identify all findings, their severity, and the proposed phases
2. **Clone/fetch the target repo** — get the codebase locally
3. **Read key files** — start with the files mentioned in 🔴 findings, then expand
4. **Verify the audit's claims** — don't blindly trust every finding; spot-check a few
5. **Create a todo list** — one item per audit finding, mapped to its phase

### Phase 1: Quick Wins (Fase 0 del audit)

Start with the "sincerity and focus" phase — items that are:
- UI text changes (renaming, clarifying)
- Data corrections (wrong dates, wrong values)
- Config fixes (clamps, thresholds)
- Documentation alignment (text matching code behavior)

These are fast, low-risk, and build confidence.

### Phase 2: Core Engine Fixes (Fase 1 del audit)

These are the **heart of the audit** — changes to the simulation/modeling engine:
- PRNG replacement (Math.sin → mulberry32/PCG)
- Algorithm rewrite (heuristics → real algorithm)
- Data calibration (normalization, CF targets)
- Calendar/time fixes (30.5 days → real calendar)
- Verification/asserts (balance checks, invariants)

**CRITICAL:** These are the most impactful changes. Read the ENTIRE affected file before modifying. Run `node --check` after every change.

### Phase 3: Policy and Data Corrections (Fase 2 del audit)

- Policy formula corrections (CfD double-sided, tope ibérico)
- Labeling/naming fixes ("Coste sistema" → "Facturación mayorista")
- Energy budget constraints (hydraulic reservoir limits)
- Demand reconciliation (single source of truth)

### Phase 4: Commit and Push

- **Single commit** with comprehensive message covering all phases
- **Test syntax** on all JS files before committing
- **Push to origin/main** (or the target branch)
- **Verify deployment** if there's a live site (curl -s -o /dev/null -w "%{http_code}" URL)

## Severity Classification

| Tag | Meaning | Action |
|-----|---------|--------|
| 🔴 Crítico | Breaks credibility, wrong data, fundamental flaw | Fix FIRST, never skip |
| 🟠 Alto | Significant bias, misleading behavior | Fix in Phase 2 |
| 🟡 Medio | Inconsistency, missing documentation | Fix in Phase 3 |
| 🟢 Bajo | Scope creep, nice-to-have | Skip or defer |

## Pitfalls

### ⚠️ Don't trust the audit blindly
- Verify 🔴 claims against actual code before fixing
- The auditor may have misidentified a file or line
- Cross-reference multiple sources (code, docs, live UI)

### ⚠️ Don't change too many things in one edit
- Each module change should be self-contained
- Run syntax checks after EACH file modification
- If a change breaks syntax, revert and fix incrementally

### ⚠️ Breaking API changes require updating all callers
- When changing a function signature (e.g., `calcularPrecioMarginal`), update EVERY call site
- Use `search_files` to find all references before modifying
- In this project: simulator.js calls were updated after the function signature changed

### ⚠️ UI changes must match code changes
- If you rename a concept in code (e.g., "Coste sistema" → "Facturación mayorista"), update the UI label too
- Check both the JS logic AND the HTML template
- Update guide text that references the old terminology

### ⚠️ Don't introduce new bugs while fixing old ones
- After each phase, verify ALL JS files pass `node --check`
- Check git diff to see the scope of changes
- If a fix requires understanding a complex system, read the skill references first

### ⚠️ PRNG replacement changes random sequences
- Mulberry32 produces DIFFERENT random sequences than Math.sin
- This means simulation results will change even with the same seed
- This is CORRECT (the old PRNG was broken), but document it in the commit message

### ⚠️ SRMC price model changes the entire pricing behavior
- Old model: heuristic interpolation with magic constants
- New model: SRMC stack — price = cost of marginal technology
- Results will be fundamentally different — this is the point
- The old results are NOT comparable to new results

## Verification Checklist

After completing all phases:

- [ ] All JS files pass `node --check`
- [ ] `git diff --stat` shows expected scope (8-10 files, not 50)
- [ ] Every 🔴 finding has a corresponding code change
- [ ] UI labels match the new terminology
- [ ] Guide/documentation text is consistent with code changes
- [ ] Commit message references all audit findings by ID (S1, D2, etc.)
- [ ] Push succeeds to target branch
- [ ] Live site returns 200 (if applicable)

## Output Format

Always provide a **chulo summary** at the end (per user preference):

```
## 🎯 Resumen de lo ejecutado — ProjectName vX.Y

> X archivos modificados, +N / −M líneas, Y hallazgos corregidos.

### ✅ Fase 0 — [title]
| Hallazgo | Acción |
|----------|--------|
| 🔴 D1 | ✅ Corregido... |

### ✅ Fase 1 — [title]
| Hallazgo | Acción |
|----------|--------|
| 🔴 S1 | ✅ Reescrito... |

### 🗺️ Próximos pasos (Fase 3 y 4)
| ID | Pendiente | Prioridad |
|----|-----------|-----------|
| — | [next item] | Alta |
```

## Integration with Other Skills

### With writing-plans
Use this skill when the plan is ALREADY PROVIDED as an audit. If the user says "plan this project" instead of "fix this audit", use `writing-plans` first to create the audit, then apply this skill.

### With systematic-debugging
If a fix introduces a new bug, switch to systematic-debugging to find the root cause before continuing the audit remediation.

### With subagent-driven-development
For very large audits (20+ findings across many files), consider dispatching subagents per phase. Each subagent handles one phase's changes.

### With google-eng-practices
When the audit is about code quality standards (naming, structure, comments), cross-reference with Google's engineering practices for professional code review standards.

## Example Workflow

```
[Audit received: 15 findings, 4 phases]
[Clone repo, read key files]
[Create todo: 15 items mapped to phases]

--- Fase 0 (Quick wins) ---
[Fix D2: rename UI text]
[Fix D1: correct dates]
[Fix D5: update clamp]
[Fix R1: align guide text]
✅ 4 items done

--- Fase 1 (Core engine) ---
[Fix S3: PRNG replacement]
[Fix S1: SRMC price model]
[Fix S2: CF calibration]
[Fix S6: real calendar]
[Fix R2: balance verification]
✅ 5 items done

--- Fase 2 (Policy) ---
[Fix D3: tope ibérico documentation]
[Fix D4: CfD double-sided]
[Fix D6: label rename]
✅ 3 items done

--- Commit and push ---
[git add -A, node --check all]
[git commit -m "vX.Y: audit remediation..."]
[git push origin main]
✅ Done

[Provide chulo summary]
```
