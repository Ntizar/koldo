Aurora Nightly: 4 jobs nocturnos (01-04 UTC). Jobs: 47211a1f (#1 investigación), eaa6b95a (#2 mejora #1), 202bc372 (#3 mejora #2), 5e476d3f (#4 mejora #3 + reaprendizaje). Skill: aurora-nightly. TODOS usan provider: custom con model: qwen3.6. NUNCA openrouter (no hay API key, da 401). Logs en nightly/ repo. TODO castellano.
§
nan-dashboard: /root/workspace/nan-dashboard. Puerto 4000. Esios-style (azul #2563eb + naranja #f97316 + liquid glass, tema claro, Inter). Express + cookie-parser. Admin password via env ADMIN_PASSWORD. Repo: github.com/Ntizar/nan-dashboard.
§
Esios-dashboard: NO night mode, NO CSV export, NO overlays de error, NO skeleton screens, NO animaciones complejas. El usuario quiere la app simple y rápida, sin 'ruido'. La mejora es hacer la app mejor, no añadir más funcionalidades innecesarias.
§
ESIOS: convertEsiosValue() en esios-units.js es fuente de verdad. IDs clave: 1001 (PVPC directo), 600 (pool OMIE directo), 1293 (demanda directo). PBF 1-462 y 10035-10049: /1000. time_trunc=hour = SUMA en API, no promedio. **CRÍTICO**: NO llamar buildSummary() recursivamente desde sí misma (causa OOM en NaN).
§
ESIOS Dashboard NaN: Token real en ESIOS_API env var (no .env). API tarda 5s+ en NaN por cache disk perdido entre reinicios — memory cache + batching paralelo. Frontend: carga progresiva (summary primero, prediccion en bg). CDN cache HTML viejo — meta no-cache + cache-bust.js.
§
Koldo system: SOUL.md en /hermes-home/SOUL.md. Repo Koldo: /root/workspace/Koldo, synced a /hermes-home/skills/koldo/. gh CLI no instalado, git auth via token HTTPS. Stack: qwen3.6 vía NaN, Telegram, 1vCPU/2GB/20GB.
§
Skill design: class-level skills only. No project-specific deploy skills. SistemaElectricoFuturo: Ntizar/SistemaElectricoFuturo, v3.5 Vue 3+Plotly, puerto 6000. Pestaña Datos REE (normativa, CNMC, indicadores). Módulo ree-data.js.
§
9009 multi-iteration: Cuando el usuario pide 20 procesos 9009 o múltiples iteraciones de mejora, implementar directamente con patch/write_file. Los subagentes fallan con timeout en tareas de código extenso. Patrón: explorar → analizar → planificar → implementar directo → commit+push. Skill: 9009-multi-iteration.