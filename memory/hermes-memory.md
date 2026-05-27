Cron: UTC. Madrid = UTC+2 verano, UTC+1 invierno. Crear cron: Madrid→restar 2h/1h→UTC. NUNCA UTC al usuario. no_agent=True falla con Python → no_agent=False. Paradas BiciMad: Bellver(2002), Metro Tetuán(1612), María de Guzmán(1540).
§
nan-dashboard: /root/workspace/nan-dashboard. Puerto 4000. Esios-style (azul #2563eb + naranja #f97316 + liquid glass, tema claro, Inter). Express + cookie-parser. Admin password via env ADMIN_PASSWORD. Repo: github.com/Ntizar/nan-dashboard.
§
esios-dashboard: /root/workspace/esios-work. Puerto 4000. ESIOS_API_TOKEN env. Scripts: copiar SIEMPRE en /root/workspace/Koldo/scripts/ como fallback.
§
ESIOS: telegram script /root/workspace/Koldo/scripts/esios-telegram.js (Canvas PNG, NO emojis). Cron: 0 9 * * * UTC. IDs: 2052/1777/1779/10358 (prev), 10207/10208 (intercon). Muertos: 460/541/10350/10014/10015. MWh→MW /1000. 10355=tCO2/h. Fuente: esios-indicator-index.md.
§
Koldo system: SOUL.md en /hermes-home/SOUL.md (actualizado 2026-05-26, ~1480 bytes). Repo Koldo: /root/workspace/Koldo, synced a /hermes-home/skills/koldo/. Cron autoconfig diario 09:00 UTC. gh CLI no instalado, git auth via token HTTPS. Stack: qwen3.6 vía NaN, Telegram, 1vCPU/2GB/20GB. Script de recovery SOUL.md en koldo-setup/scripts/restore-soul.sh.
§
ESIOS dashboard frontend modular pitfall (2026-05-26): utils.js contiene TODAS las funciones helper (formatNum, getMadridHour, numericValues, average, fmtHora, hourlySeries, priceColor, activeTechKeys, etc.). NUNCA reescribir de cero sin verificar que todas existen. Restaurar desde git checkout <commit-bueno> -- public/js/utils.js y añadir solo nuevas. Cache-busting: endpoint servidor /js/cache-bust.js con timestamp dinámico. No bloquear render por datos null — renderizar con "—".
§
Skill design principle: never create project-specific deploy skills (e.g., esios-dashboard-deploy). Instead, update class-level skills (esios-nan-deploy, nan-deploy, secure-api-storage) with project-specific patterns. Project skills don't survive — class-level skills do.