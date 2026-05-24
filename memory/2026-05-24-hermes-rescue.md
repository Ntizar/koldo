# 2026-05-24 - Rescate de contexto Hermes / NaN

Esta nota existe porque el agente de NaN se quedo sin tokens de contexto y hubo que crear otro agente. El nuevo agente no tenia la memoria de los ultimos dos dias y empezo a tocar cosas sin entender el sistema.

## Estado que debe recordar el agente

- El repo `Ntizar/Koldo` es el segundo cerebro de Ntizar: skills, notas, memoria, config y scripts. No borrar nada del repo.
- El dashboard principal vive en `Ntizar/nan-dashboard`, workspace local `c:\Ntizar_Obsidian\Ntizar_Brain\Github\NaN`.
- NaN Dashboard es un Express + frontend vanilla. Login por `DASH_PASSWORD`; escrituras con re-auth (`X-Auth-Confirm`).
- NaN Spaces no tiene API publica para crear apps, borrar apps, editar env vars o forzar rebuilds. Eso se hace manualmente en `cloud.nan.builders`.
- Lo que si puede hacer el dashboard: registrar apps, sondear healthcheck HTTPS y editar `Dockerfile` / `.env.example` via GitHub Contents API.
- Koldo tambien se sirve como visor web privado en `koldo.apps.nan.builders`, con nginx + Basic Auth. El Dockerfile esta en la raiz de `Ntizar/Koldo` y Kaniko lo construye al hacer push.

## Commits importantes ya recuperados

### Ntizar/Koldo

- `fc8b2a3` - Dockerfile y ajustes LF para que Kaniko encuentre y construya el visor Koldo.
- `209208d` - visor web de notas con nginx, marked y Basic Auth.

### Ntizar/nan-dashboard

- `a537e11` - FASE 2: registro de apps de NaN Spaces, editor GitHub-backed de Dockerfile/.env.example y healthcheck.
- `1a43921` - documento de arquitectura Hermes/NaN en `docs/hermes-architecture.md`.
- `46011b2` - fix UI: elimina un `</div>` suelto que rompia todo el script inline y dejaba las cards en `cargando...`.
- `959e04b` - cambio hecho por Hermes: proxy `/energia/` hacia dashboard ESIOS en puerto 3500. Si no era deseado, revisar antes de revertir; no tocar a ciegas.

## Problema resuelto hoy

El dashboard se quedaba en `cargando...` porque el frontend tenia un `SyntaxError: Unexpected token '<'`. La causa era una linea suelta en `public/index.html`, dentro de `loadFactoryPlane()`:

```js
</div>`;
```

Se elimino y se pusheo el fix en `Ntizar/nan-dashboard` commit `46011b2`.

## Como debe arrancar un agente nuevo

1. Leer `README.md` y `koldo/agente-principal.md` en este repo.
2. Leer esta nota de rescate.
3. Leer `Ntizar/nan-dashboard/docs/hermes-architecture.md`.
4. Revisar `git log --oneline -10` antes de tocar codigo.
5. Si hay cambios raros, explicar primero y hacer cambios pequeños, versionados, sin borrar memoria ni repos.

## Reglas de seguridad operativa

- Nunca borrar memoria, notas, repos ni carpetas completas salvo orden explicita de Ntizar.
- No asumir que la memoria interna del modelo es suficiente: lo importante se guarda en markdown y commit.
- No guardar secretos en notas, commits o chat.
- Antes de editar webs o proxies, confirmar cual es la URL, puerto y repo fuente.
- Si el contexto se acaba, crear una nota de cierre en `memory/` o `notes/` antes de seguir.
