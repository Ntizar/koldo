# Megaauditoría técnica esios-dashboard

**Fecha**: 2026-05-26  
**Proyecto**: `esios-work` (Ntizar/esios-dashboard)

## Resumen ejecutivo

Estado funcional pero frágil para escalar. Se ejecutó refactorización completa en 6 bloques.

## Bloques implementados

### Bloque A — Seguridad (P0)
- Token hardcodeado eliminado de `scripts/fetch-all-indicators.js`
- `.env.example` creado con todas las variables
- `src/config/env.js` con validación estricta (fail-fast)
- `helmet` + CORS whitelist por `ALLOWED_ORIGINS`

### Bloque B — Backend modular (P1)
- `server.js` reducido de 1486 → 647 líneas (56%)
- `src/` creado con estructura por capas y dominios
- Clientes HTTP extraídos (`esios.client.js`, `nan.client.js`)
- Servicios de dominio: energy, forecast, reports
- Eliminadas autollamadas HTTP internas

### Bloque C — Datos y tiempo (P1)
- `src/shared/time/madrid.js` centraliza Europe/Madrid
- `src/shared/io/csv.repository.js` con FS async
- Contratos de datos definidos por endpoint

### Bloque D — Persistencia y cache (P1/P2)
- Todo I/O migrado a `fs/promises`
- Cache memoria con métricas (hits/miss/size/rate)
- Reintentos HTTP con backoff exponencial + jitter

### Bloque E/G — Frontend modular (P1/P2)
- `index.html` reducido de 2256 → 223 líneas
- CSS extraído a `public/css/styles.css`
- JS dividido en 9 módulos: api, config, state, utils, ui, data, render, render-charts, render-final

### Bloque F — Tests (P2)
- Jest configurado con `testEnvironment: node`
- 24/24 tests pasando:
  - `time.test.js` — 3 tests timezone Madrid
  - `utils.test.js` — 11 tests utilidades de datos
  - `env.test.js` — 2 tests variables entorno
  - `api.test.js` — 8 tests integración endpoints

## Criterios de aceptación cumplidos

1. **Seguridad**: Sin secretos en código, headers endurecidos, CORS restringido
2. **Confiabilidad**: Reintentos + backoff + límites de concurrencia, sin HTTP interno
3. **Mantenibilidad**: Arquitectura por dominios/capas, duplicidad eliminada
4. **Testabilidad**: 24 tests unitarios + integración
5. **Operabilidad**: Logger estructurado, `/metrics` Prometheus, health/readiness
6. **Escalabilidad**: Nuevo dominio integrable sin tocar existentes

## Pitfalls descubiertos

- **CommonJS vs ESM**: Vitest no funciona con `require()`. Usar Jest con `@jest/globals` para proyectos CommonJS.
- **Locale formatNum**: `toLocaleString('es-ES')` puede no incluir separador de miles en entornos con locale por defecto. Tests deben aceptar ambas formas.
- **Server abierto en tests**: Importar `server.js` en supertest deja TCP abierto. Usar `--forceExit --detectOpenHandles` en Jest.
- **Module cache en tests**: `delete require.cache[require.resolve(...)]` necesario para re-cargar módulos con env variables diferentes.
