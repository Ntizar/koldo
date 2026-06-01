# Koldo System — Concrete Setup Reference

## User: Ntizar
- **GitHub**: github.com/Ntizar (25+ public repos, 7 private)
- **Location**: Madrid
- **Bio**: Ingeniero de Caminos · AI Builder
- **Model**: qwen3.6 (custom provider)
- **TTS**: Álvaro (es-ES-AlvaroNeural, Edge TTS)

## Repo: Ntizar/Koldo (private)
- **Path**: `/root/workspace/Koldo`
- **Remote**: `https://github.com/Ntizar/Koldo.git`
- **Last commit**: `9025852 docs: agregar nota de autoconfiguración 2026-05-25`

## Installed skills (in `/hermes-home/skills/koldo/`)
1. `SKILL.md` — Umbrella index
2. `agente-principal.md` — Agent identity, rules, subagent model
3. `dashboard-control-center.md` — Dashboard control center
4. `nap-deploy.md` — NAP deployment
5. `secure-api-storage.md` — Secure API storage
6. `voice-setup.md` — TTS/STT configuration

## Config
- `skills.external_dirs`: `/root/workspace/Koldo/koldo`
- Cron: `koldo-autoconfig` — daily at 09:00 UTC, 3 executions max
- Token: stored in `/hermes-home/.env` as `GITHUB_TOKEN`
