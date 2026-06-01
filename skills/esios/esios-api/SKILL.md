---
name: esios-api
description: "Guía completa de la API ESIOS/REE — indicadores, unidades correctas, IDs verificados contra índice robusto, errores comunes y patrones de parsing."
version: 3.2.0
author: Ntizar
tags: [esios, api, ree, energía, electricidad]

---

# API ESIOS/REE — Guía Completa

La API de ESIOS (REE) devuelve datos del sistema eléctrico español. Es la fuente de verdad del dashboard.

## Base URL

`https://api.esios.ree.es`

## Autenticación

Header: `x-api-key: <token>`

El token está en `/hermes-home/.env` como `ESIOS_API` (o `ESIOS_API_TOKEN`).

## Formato de respuesta

```json
{
  "indicator": {
    "values": [
      {
        "value": 123.45,
        "datetime": "2026-05-25T00:00:00.000+02:00",
        "datetime_utc": "2026-05-24T22:00:00Z",
        "tz_time": "2026-05-24T22:00:00.000Z",
        "geo_id": 8741,
        "geo_name": "Península"
      }
    ]
  }
}
```

## 🔥 REGLA CRÍTICA: `time_trunc=hour` SUMA los valores (NO promedia)

**2026-05-29 — Descubrimiento CRUCIAL.** El parámetro `time_trunc=hour` en la API ESIOS **SUMA** los 12 valores de 5 minutos de cada hora, no los promedia.

Ejemplo verificado: ID 2039 (Nuclear) a las 21:00 → sin truncar = 5040 MW cada 5 min ✅, con `time_trunc=hour` = 60,502 (12× sumado) ❌.

**SOLUCIÓN en el dashboard:** se ha eliminado `time_trunc=hour` del cliente ESIOS (`esios.client.js`). Ahora los datos llegan crudos (12 valores cada 5 minutos) y `normalizeHourlyValues` **promedia** los 12 valores de cada hora. También se ha añadido el endpoint `/api/esios/summary-5min` que devuelve los 288 valores de 5 min sin colapsar.

## ⚠️ Reglas de unidades (ACTUALIZADO 2026-05-29)

**🔥 CAMBIO IMPORTANTE:** Al quitar `time_trunc=hour`, los datos vienen en **unidades reales** (MW, €/MWh, tCO₂/h) sin multiplicador. Ya NO hay que dividir entre 10 para los IDs de telemedida (2038-2067, 1293, etc.).

### ⚠️ REGLA DE ORO: Usar `convertEsiosValue()` del dashboard

**Fuente de verdad:** `/root/workspace/esios-dashboard/src/shared/esios-units.js`

**NUNCA asumir unidades por nombre de indicador.** Usar siempre la función `convertEsiosValue(indicatorId, rawValue)` del dashboard.

```javascript
// Función exacta a usar en CUALQUIER script ESIOS (ACTUALIZADA 2026-05-29):
const DIRECT_IDS = new Set([
  1001,        // PVPC €/MWh (filtrar por geo_id=8741 Península)
  1777, 1778, 1779, 1780,  // Previsión D+1 (MW)
  10358, 10359,  // Previsión renovable D+1 (MW)
  10355, 10356,  // CO2 ratio (tCO₂/MWh, tCO₂/h)
  10207, 10208, 10209,  // Interconexiones (MW)
  // Telemedida nacional SIN time_trunc → MW directos cada 5 min
  2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047,
  2048, 2049, 2050, 2051, 2065, 2066, 2067,
  10351, 10352,  // Gen real renovable/no renovable (MW)
  10206,         // Gen real Solar (MW)
  1293,          // Demanda real (MW)
  2052,          // Demanda prevista (MW)
  10006,         // Gen libre CO2 (MW)
  10232,         // Potencia disponible (MW)
  2198, 2199,    // Batería entrega/carga (MW)
]);

function convertEsiosValue(indicatorId, rawValue) {
  if (rawValue === null || rawValue === undefined) return null;
  const num = Number(rawValue);
  if (!Number.isFinite(num)) return null;
  if (DIRECT_IDS.has(indicatorId)) return Math.round(num * 100) / 100;
  if (indicatorId >= 1 && indicatorId <= 462) return Math.round(num / 1000 * 100) / 100;
  if (indicatorId === 623) return Math.round(num / 1000 * 100) / 100;
  return Math.round(num * 100) / 100;  // fallback directo
}
```

### 🔥 REGLA SIMPLIFICADA sobre unidades

**Solo hay 2 tipos de IDs:**

| Tipo | IDs | Acción | Unidad |
|---|---|---|---|
| **DIRECTOS (MW/€/MWh reales)** | 1001, 1293, 2038-2067, 2052, 10351, 10352, 10206, 10006, 10232, 2198, 2199, 1777-1780, 10358, 10359, 10355, 10356, 10207-10209 | Valor directo | MW o €/MWh o tCO₂ |
| **PBF / programados** | 1-462 (PBF), 623 (hidráulico), 10035-10049 (PBF programado) | ÷ 1000 | GWh/periodo (MW·h) |
| **NO existen** | 10035-10041 (temperatura, viento, radiación) | — | ESIOS NO tiene datos meteorológicos reales. Para clima usar Open-Meteo API. Ver `9009-mejora-continua:references/esios-no-clima-data.md`. |

**NO hay división entre 10.** Todos los IDs que antes estaban en DIV10_IDS ahora son DIRECT_IDS desde que quitamos `time_trunc=hour`.

## CO2 — Reglas correctas

- **10006 (Gen libre CO2)**: MW, directo (antes /10)
- **10033 (Porcentaje gen libre CO2)**: %, directo
- **10355 (CO2 asociado gen real)**: tCO2/MWh, **valor directo**
- **10356 (CO2 asociado gen real SNP)**: tCO2/MWh, **valor directo**

## ⚠️ IDs CORRECTOS de previsión D+1

| Concepto | ID correcto | Unidad |
|---|---|---|
| Demanda prevista | **2052** | MW |
| Eólica prevista | **1777** | MW |
| Solar prevista | **1779** | MW |
| Renovable prevista | **10358** | MW |

## ⚠️ IDs CORRECTOS de interconexión

| Concepto | ID | Unidad | Divisor |
|---|---|---|---|
| Interconexión Francia | **10207** | MW | DIRECTO |
| Interconexión Portugal | **10208** | MW | DIRECTO |
| Interconexión Marruecos | **10209** | MW | DIRECTO |

## ⚠️ Pitfall: PVPC (ID 1001) — 120 valores/día (5 geo zonas)

El indicador PVPC 2.0TD (ID 1001) devuelve **120 valores por día** (24h × 5 zonas), NO 24. Las zonas son:

| geo_id | Nombre | Nota |
|---|---|---|
| 8741 | **Península** | La zona principal |
| 8742 | Canarias | Precios distintos |
| 8743 | Baleares | Precios distintos |
| 8744 | Ceuta | Precios distintos |
| 8745 | Melilla | Precios distintos |

**⚠️ Filtrar SIEMPRE por `geo_id=8741`** al consumir PVPC:

```javascript
const peninsula = data.indicator.values.filter(v => v.geo_id === 8741);
```

Los demás indicadores (1293, 10206, 10351, etc.) solo devuelven 24 valores con un único geo_id (8741).

## ⚠️ Pitfall: `genOtrasRenMedida` — ID 10042 vs 10041

ID 10042 es **"Total Gen + Total Interconexiones programada P48"**, NO "otras renovables medida". El correcto es **10041** (MWh → /1000).

## ⚠️ Pitfall: Indicador 9 (Ciclo Combinado)

Solo devuelve **1 valor diario**, no 24 horarios. Es PBF programado, no telemedida.

## ⚠️ Pitfall: Destructuring en Promise.all

Si haces `Promise.all([...])` con N elementos pero el destructuring tiene M variables donde M < N, **todos los datos quedan desplazados**. Verificar que el número de variables coincide EXACTAMENTE.

## ⚠️ Pitfall: Cache del navegador

Cambios en JS no se reflejan por cache. Solución: endpoint `/js/cache-bust.js` con timestamp dinámico.

## ⚠️ Pitfall: IDs que NO están en el índice curado

Si un ID no está en `esios-indicator-index.json`, **no usarlo**. Ejemplos: 460 (previsionDemanda), 541 (previsionEolica).

## Endpoints del dashboard

### `/api/esios/summary`

Resumen diario consolidado con 24 slots horarios (promedio de los valores de 5 min).

### `/api/esios/summary-5min` (NUEVO)

Resolución de 5 minutos (288 slots/día). Mismos datos que summary, pero sin colapsar a 24h.

```
GET /api/esios/summary-5min?fecha=2026-05-27
```

Respuesta:
```json
{
  "fecha": "2026-05-27",
  "resolucion": "5min",
  "slots": 288,
  "valores": [
    { "hora": "00:00", "nuclear": 5040, "eolica": 4500, ... },
    { "hora": "00:05", "nuclear": 5041, "eolica": 4520, ... },
    ...
  ]
}
```

**Ventajas:**
- Captura picos y valles que se pierden con datos horarios
- Mejor para análisis de intradiario y forecast
- Detecta variabilidad rápida (solar, eólica)
- Compatible con gráficos de alta resolución

## Open-Meteo API (datos de clima)

ESIOS NO tiene datos meteorológicos reales (temperatura, viento, radiación, precipitación). Usar **Open-Meteo** (gratuito, sin API key).

**URL base**: `https://api.open-meteo.com/v1/forecast`

**Parámetros clave**:
- `latitude`/`longitude` — Coordenadas (ej. 40.4168, -3.7038 para Madrid)
- `hourly` — Parámetros horarios (temperatura_2m, relative_humidity_2m, dew_point_2m, weather_code, cloud_cover, precipitation, visibility, wind_speed_10m, **shortwave_radiation**)
- `daily` — Parámetros diarios (temperature_2m_max, temperature_2m_min, precipitation_sum, etc.)
- `start_date`/`end_date` — Rango de fechas explícito (YYYY-MM-DD)
- `timezone=Europe%2FMadrid`

**⚠️ Regla crítica**: Usar `shortwave_radiation` (NO `solar_radiation`, que fue renombrado). No combinar `past_days` con `start_date`/`end_date`.

**Ejemplo correcto**:
```
https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,shortwave_radiation&start_date=2026-05-28&end_date=2026-05-30&timezone=Europe%2FMadrid
```

## Errores comunes

- **401**: Token inválido
- **429**: Rate limit (esperar 1s)
- **500**: Error interno REE (retry con backoff)
- **Valores null**: Algunos indicadores no tienen datos para fechas recientes

## 📸 Gráficos horarios para Telegram (Canvas/PNG)

**NUNCA usar emojis Unicode para gráficos horarios.** Son ilegibles en Telegram.

**Solución correcta:** generar imágenes PNG con `canvas` y enviarlas como fotos.

### Colores del dashboard ESIOS

- Azul: `#2563eb` (precios, líneas principales)
- Naranja: `#f97316` (demanda, Portugal)
- Verde: `#22c55e` (eólica, renovable)
- Amarillo: `#eab308` (solar)
- Rojo: `#ef4444` (no renovable)
- Púrpura: `#a855f7` (cogeneración)
- Rosa: `#ec4899` (otras renovables)
- Azul claro: `#3b82f6` (Francia, hidráulica)
- Gris: `#6b7280` (carbón)

## 📎 Archivos de referencia

- `references/verificacion-unidades.md` — Procedimiento para detectar unidades incorrectas en scripts ESIOS (señales de alerta 10×/1000×, pasos de verificación)
- `references/verificacion-empirica-ids-2026-05-28.md`
- `references/pvpc-geo-zones-2026-05-28.md`
- `references/esios-units-verification.md`
- `references/esios-telegram-ids.md`
- `references/yahoo-finance-frontend-pattern.md` — Patrón completo para usar Yahoo Finance como alternativa CORS-free a ESIOS en frontend puros (caché, fetch, fallback, UI badge)
- `scripts/verify-esios-units.js` — Script de verificación de unidades
- **NOTA:** Para datos de clima (temperatura, viento, precipitación), ESIOS NO tiene estos datos. Usar Open-Meteo API. Ver `9009-mejora-continua:references/esios-no-clima-data.md`.

## Yahoo Finance — Alternativa sin API key para frontend puro

**Problema:** La API de ESIOS requiere autenticación (`x-api-key`) y no soporta CORS desde el navegador. Los proyectos frontend puros (sin backend Node.js) no pueden llamar directamente a ESIOS.

**Solución:** Usar Yahoo Finance query1 API para datos de mercado (gas TTF, CO2 ETS, commodities). Funciona sin API key desde el navegador, soporta CORS, y devuelve JSON parseable.

**URL base:** `https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?range=1d&interval=1d`

**Tickers útiles para energía:**
- `TTF=F` — Gas natural TTF (Netherlands)
- `EURO0=DXX` — EU ETS CO2 Emissions
- `CL=F` — Crude Oil WTI
- `BZ=F` — Crude Oil Brent

**Implementación en frontend (JavaScript vanilla):**
```javascript
function fetchYahooFinance(ticker) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`;
    return fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then(data => {
            const result = data.chart?.result?.[0];
            if (!result) return null;
            const quotes = result.indicators?.quote?.[0];
            const meta = result.meta;
            if (!quotes || !meta) return null;
            return { precio: quotes.close[0], meta };
        })
        .catch(() => null);
}
```

**Patrón de integración con datos estáticos REE:**
1. Fetch paralelo de Yahoo Finance (gas TTF, CO2) + datos estáticos REE
2. Si Yahoo Finance devuelve datos: sobrescribir precios en el objeto de mercado
3. Si Yahoo Finance falla: mantener valores de referencia REE como fallback
4. Caché en localStorage con TTL (1 hora recomendado) para evitar llamadas innecesarias
5. Indicador visual en UI: badge "En vivo" / "Actualizando..." / "Datos de referencia"

**Ver:** `references/yahoo-finance-frontend-pattern.md` para el patrón completo de implementación con caché y fallback.

## 🔄 Relación con otras skills

- `esios-api` (esta) — Guía de la API ESIOS: indicadores, unidades, IDs, parsing.
- `esios-dashboard-deploy` — Procedimiento de deploy en NaN.builders.
- `esios-nan-deploy` — Procedimiento de deploy en NaN.