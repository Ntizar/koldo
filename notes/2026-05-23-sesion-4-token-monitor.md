# Sesión 4 — Monitor de tokens, estadísticas por modelo/fuente + alertas

**Fecha:** 23/05/2026 (19:43–21:20)

## Qué se hizo
- **Endpoint `/api/tokens`**: lee `state.db` de Hermes (SQLite) vía Python. Devuelve breakdown por periodo (today/week/month), por modelo, por fuente (telegram/webui), daily histórico
- **Sección Tokens en dashboard**: 3 métricas en cards (hoy in, hoy out, semana in) + tabla por modelo + tabla por fuente + últimos 7 días
- **Cron Token Watchdog** (cada 3h): alerta si consumo diario supera 50M in / 5M out, o si hay un pico >200% vs día anterior
- **Proxy NAP**: reescritura de HTML en el proxy para rutas absolutas → `/nap/...`. Funciona.

## Técnico
- `token-query.py` en `/persist/nan-dashboard/` — llamado desde server.js vía `execSync`
- HTML del proxy reescribe `src="/` → `src="/nap/"`, `href="/` → `href="/nap/"`
- Services endpoint ahora lee tcp4 + tcp6 (antes perdía puertos IPv6 como NAP 3000 y dashboard 4000)
- Cron jobs: Daily briefing (8AM), System watchdog (6h), Token watchdog (3h)

## Pendiente
- [ ] NAP no muestra API key real — el frontend pide key manual. Solución: que el server inyecte NAP_API_KEY en localStorage del HTML
- [ ] URL personalizada: Cloudflare Tunnel o preguntar a NaN
- [ ] Migrar APIs a NaN Cloud Env
- [ ] Editor de archivos en dashboard
- [ ] Gestor de API keys en dashboard
- [ ] Multi-agente real (más microVMs)