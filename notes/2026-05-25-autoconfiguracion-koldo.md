# 2026-05-25 — Configuración automática de Koldo

**Estado actual del sistema.**

## Lo que se hizo

1. ✅ Clonado el repo `Ntizar/Koldo` en `/root/workspace/Koldo`
2. ✅ Instalado `gh` (GitHub CLI)
3. ✅ Autenticado con token de GitHub (cuenta Ntizar)
4. ✅ Copiados los skills de Koldo a `/hermes-home/skills/koldo/`
5. ✅ Creado SKILL.md principal en `/hermes-home/skills/koldo/SKILL.md`
6. ✅ Configurado `skills.external_dirs` en config.yaml apuntando al repo
7. ✅ Creado script de auto-configuración en `scripts/koldo-autoconfig.sh`
8. ✅ Hecho commit y push al repo
9. ✅ Creado cron job diario (09:00 UTC) para sincronización automática

## Estado del sistema

| Componente | Estado |
|---|---|
| Modelo | qwen3.6 (custom provider, NaN) |
| GH Auth | ✅ (Ntizar) |
| Repo Koldo | ✅ clonado y sincronizado |
| Skills Koldo | ✅ instalados en `/hermes-home/skills/koldo/` |
| Cron autoconfig | ✅ diario a las 09:00 UTC |
| SOUL.md | ✅ configurado |

## Estructura del repo

```
Koldo/
├── koldo/           ← Skills personales
│   ├── agente-principal.md
│   ├── dashboard-control-center.md
│   ├── nap-deploy.md
│   ├── secure-api-storage.md
│   └── voice-setup.md
├── notes/           ← Notas y apuntes
├── memory/          ← Respaldo de memoria
├── config/          ← Configuraciones
├── scripts/         ← Automatizaciones
├── .deploy/         ← Deploy para NaN Spaces (nginx)
├── Dockerfile       ← Para visor web
└── README.md
```

## Próximos pasos

- Verificar que los skills se cargan correctamente en una nueva sesión
- Implementar el plan multi-agente (fase 1)
- Sincronizar notas de sesiones pasadas al repo
- Configurar backup automático de memoria al repo
