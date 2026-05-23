# Aprendizaje persistente — Sesión 5 (23/05/2026)

## Arquitectura del dashboard
- Express sirve frontend + APIs, puerto 4000 (IPv6 por defecto con Node.js)
- Autenticación: Basic Auth (contraseña en `DASH_PASSWORD`), solo en `/api/*`
- El frontend se renderiza completamente desde un HTML estático con JS vanilla
- Sin frameworks frontend — todo es DOM manipulation directa (más ligero, sin build step)

## Proxy NAP
- Para rutas absolutas en SPA (`/assets/...`, `/favicon.svg`) detrás de un prefijo como `/nap/`, el proxy **debe reescribir el HTML**
- Regex: `src="/` → `src="/nap/"`, `href="/` → `href="/nap/"`
- Proxy nativo con `http.request` de Node (sin dependencias) funciona perfectamente

## Servicios / ProcNet
- `/proc/net/tcp` SOLO contiene IPv4. Las apps modernas de Node.js escuchan en IPv6
- Para detectar TODOS los puertos: leer `/proc/net/tcp` + `/proc/net/tcp6`
- Formato tcp6: `00000000000000000000000000000000:0FA0` — misma lógica de parseo que tcp4

## Tokens / SQLite
- Hermes guarda datos de sesiones en `/hermes-home/state.db` (SQLite)
- Tabla `sessions` tiene: `input_tokens`, `output_tokens`, `estimated_cost_usd`, `actual_cost_usd`, `model`, `source`, `user_id`
- No instalar `better-sqlite3` (tarda 60s+ en compilar). Usar Python que tiene sqlite3 nativo
- Llamar script Python desde Node con `execSync('python3 script.py')`

## Cron de Hermes
- Los cronjobs se guardan en `/hermes-home/cron/jobs.json` (formato: `{jobs: [{id, name, schedule, ...}]}`)
- Estado y outputs en `/hermes-home/cron/output/<id>.json`
- El scheduler de Hermes maneja los disparos — el endpoint solo lee/escribe la config

## Prácticas con el patch tool
- Strings largos (>2000 chars) en `new_string` del patch tool se truncan con `...[truncated]`
- Solución: dividir en parches pequeños, o usar write_file + read_file + patch con strings cortos
- Para contenido HTML largo, es mejor escribir el bloque completo con write_file

## Cambio de modelo
- El endpoint POST `/api/config/set-model` modifica `config.yaml` (líneas `default:` y `provider:`)
- PERO no reinicia el agente — el cambio solo es efectivo tras reiniciar Hermes
- Pendiente: enviar SIGHUP o `systemctl restart hermes`

## URL de NaN.builders
- `{project-slug}.apps.nan.builders` — controlado por la plataforma
- No se puede cambiar desde dentro de la microVM
- Para dominio personalizado: Cloudflare Tunnel

## NAP Dashboard
- Corre en puerto 3000, frontend Vite/React en `dist/`
- Proxy a `nap.transportes.gob.es/api` con header `ApiKey` desde env
- El frontend pide API key manual (guardada en localStorage `nap_api_key`)
- Solución futura: inyectar la key auto desde el servidor en el HTML servido