Aurora Nightly: 4 jobs nocturnos (01-04 UTC). Jobs: 47211a1f (#1 investigación), eaa6b95a (#2 mejora #1), 202bc372 (#3 mejora #2), 5e476d3f (#4 mejora #3 + reaprendizaje). Skill: aurora-nightly. TODOS usan provider: custom con model: qwen3.6. NUNCA openrouter (no hay API key, da 401). Logs en nightly/ repo. TODO castellano.
§
Browser tool broken on NaN subdomains (*.apps.nan.builders): Node.js undici internal error. Use curl-based static analysis (web-audit skill).
§
ESIOS: convertEsiosValue() en esios-units.js es fuente de verdad. IDs clave: 1001 (PVPC directo), 600 (pool OMIE directo), 1293 (demanda directo). PBF 1-462 y 10035-10049: /1000. time_trunc=hour = SUMA en API, no promedio. **CRÍTICO**: NO llamar buildSummary() recursivamente desde sí misma (causa OOM en NaN).
§
ESIOS Dashboard NaN: Token en ESIOS_API env var. API tarda 5s+ en NaN. **DIAGNÓSTICO 502**: /healthz uptime crece → crash silencioso. Reset → OOM killer. **CRÍTICO data.js**: setupDateNavigation/updateDateControls DEFINIDAS. charts: `var charts = window.charts = {}` (NO const). tabRendered: NO marcar clima/gas/correlacion/balance en renderTab — solo al terminar fetch lazy.
§
Koldo system: SOUL.md en /hermes-home/SOUL.md. Repo Koldo: /root/workspace/Koldo, synced a /hermes-home/skills/koldo/. gh CLI no instalado, git auth via token HTTPS. Stack: qwen3.6 vía NaN, Telegram, 1vCPU/2GB/20GB.
§
Skill design: class-level skills only. No project-specific deploy skills. SistemaElectricoFuturo: Ntizar/SistemaElectricoFuturo, v3.5 Vue 3+Plotly, puerto 6000. Pestaña Datos REE (normativa, CNMC, indicadores). Módulo ree-data.js.
§
9009 multi-iteration: Cuando el usuario pide 20 procesos 9009 o múltiples iteraciones de mejora, implementar directamente con patch/write_file. Los subagentes fallan con timeout en tareas de código extenso. Patrón: explorar → analizar → planificar → implementar directo → commit+push. Skill: 9009-multi-iteration.
§
FamilyTree v2.1 (ntizar/FamilyTree). Layout: barycenter real (12 iters), orphan_ID huérfanos. Conexiones SVG dinámicas sin offset, rail 35%. Aurora design: glassmorphism, gradientes inline. GitHub Pages ok. Skill: familia-tree-editor v2.1.