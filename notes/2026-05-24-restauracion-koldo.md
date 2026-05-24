# 2026-05-24 — Restauración del sistema Koldo

**Rescate completo.** El agente Hermes fue reconstruido como Koldo.

## Qué se hizo

1. ✅ SOUL.md reescrito con configuración Koldo (agente-principal.md)
2. ✅ Skills del repo sincronizados a `/hermes-home/skills/koldo/`
3. ✅ Notas sincronizadas a `/hermes-home/skills/notes/`
4. ✅ Memoria actualizada con estado del sistema
5. ✅ Commit al repo Koldo

## Estado del sistema

| Componente | Estado |
|---|---|
| Modelo | qwen3.6 ✅ |
| GH Auth | ✅ (Ntizar) |
| ESIOS_API | ✅ en env |
| NAP_API | ✅ en env |
| SOUL.md | ✅ actualizado |
| Skills | ✅ sincronizados |
| nan-dashboard (4000) | ❌ no instalado |
| esios-dashboard (3500) | ❌ no instalado |
| nap-dashboard (3000) | ❌ no instalado |
| Hermes WebUI (8787) | ✅ corriendo |
| Koldo visor web | ✅ koldo.apps.nan.builders |

## Pendiente para restauración completa

- Clonar y arrancar nan-dashboard (puerto 4000)
- Clonar y arrancar esios-dashboard (puerto 3500)
- Clonar y arrancar nap-dashboard (puerto 3000)
- Migrar API keys de /root/.env a NaN Cloud Env (si se recupera el .env)
- Implementar plan multi-agente (fase 1)
