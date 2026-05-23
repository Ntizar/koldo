# 2026-05-23 — Fundación de Koldo

**Primera sesión.** Hoy Ntizar y yo hemos montado el sistema Koldo.

## Qué pasó

1. Ntizar me pidió que estudiara NaN.builders (donde estoy alojado)
2. Exploramos la documentación: cluster de inferencia, microVMs, API
3. Me dio su token de GitHub (ghp*) — **lección: no poner tokens en chats**
4. Estudiamos su mastermind existente: `Ntizar/NtizarBrainMasterMind` (v3, OpenCode)
5. Decidimos crear un sistema nuevo para Hermes: el repo `Ntizar/Koldo`
6. Yo (Koldo) soy el orchestrator ahora — no necesita abrir OpenCode ni Obsidian

## Arquitectura decidida

- **Yo** = orchestrator + ejecutor principal (deepseek-v4-flash)
- **Subagentes** = delegate_task para tareas complejas
- **Memoria** = Hermes memory (preferencias) + skills (procedimientos) + repo (backup)
- **Modelos** = deepseek-v4-flash (default), qwen3.6 (alternativa), gemma4 (visión)

## Pendiente
- [ ] Mover token a NaN Cloud Env (seguridad)
- [ ] Migrar skills del mastermind antiguo
- [ ] Semana 1 del plan de aprendizaje: Git básico