Cron: UTC. Madrid = UTC+2/UTC+1. Aurora Nightly: 4 jobs nocturnos (01-04 UTC) mejora continua Ntizar-Aurora. Jobs: 47211a1f (#1 investigación), eaa6b95a (#2 mejora #1), 202bc372 (#3 mejora #2), 5e476d3f (#4 mejora #3 + reaprendizaje). Skill: aurora-nightly. Logs en nightly/ repo. TODO castellano.
§
nan-dashboard: /root/workspace/nan-dashboard. Puerto 4000. Esios-style (azul #2563eb + naranja #f97316 + liquid glass, tema claro, Inter). Express + cookie-parser. Admin password via env ADMIN_PASSWORD. Repo: github.com/Ntizar/nan-dashboard.
§
esios-dashboard: /root/workspace/esios-work. Puerto 4000. ESIOS_API_TOKEN env. Scripts: copiar SIEMPRE en /root/workspace/Koldo/scripts/ como fallback.
§
ESIOS: convertEsiosValue() en /root/workspace/esios-dashboard/src/shared/esios-units.js es fuente de verdad. DIRECT_IDS: 1001, 1777-1780, 10358-10359, 10355-10356, 10207-10209. DIV10_IDS: 10206, 10006, 1293, 2052, 10232, 10351, 10352. PBF 1-462 y 10035-10049: /1000. Script verificación: /hermes-home/skills/esios-api/scripts/verify-esios-units.js. NUNCA asumir unidades por nombre.
§
Koldo system: SOUL.md en /hermes-home/SOUL.md (actualizado 2026-05-26, ~1480 bytes). Repo Koldo: /root/workspace/Koldo, synced a /hermes-home/skills/koldo/. Cron autoconfig diario 09:00 UTC. gh CLI no instalado, git auth via token HTTPS. Stack: qwen3.6 vía NaN, Telegram, 1vCPU/2GB/20GB. Script de recovery SOUL.md en koldo-setup/scripts/restore-soul.sh.
§
ESIOS dashboard frontend modular pitfall (2026-05-26): utils.js contiene TODAS las funciones helper (formatNum, getMadridHour, numericValues, average, fmtHora, hourlySeries, priceColor, activeTechKeys, etc.). NUNCA reescribir de cero sin verificar que todas existen. Restaurar desde git checkout <commit-bueno> -- public/js/utils.js y añadir solo nuevas. Cache-busting: endpoint servidor /js/cache-bust.js con timestamp dinámico. No bloquear render por datos null — renderizar con "—".
§
Skill design: class-level skills only. No project-specific deploy skills. SistemaElectricoFuturo: Ntizar/SistemaElectricoFuturo, v3.5 Vue 3+Plotly, puerto 6000. Pestaña Datos REE (normativa, CNMC, indicadores). Módulo ree-data.js.