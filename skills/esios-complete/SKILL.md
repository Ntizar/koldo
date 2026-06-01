---
name: esios-complete
description: "Conocimiento completo de ESIOS/REE: API, indicadores, unidades, deploy en NaN, troubleshooting frontend, informes Telegram, Open-Meteo, Yahoo Finance. Unificado de 5 skills en 1."
version: "1.0.0"
author: Koldo
tags: [esios, ree, energía, electricidad, deploy, telegram, api, nan]
---

# ESIOS/REE — Conocimiento Completo

**Unificado de 5 skills:** esios-api, esios-indicators-correct, esios-nan-deploy, esios-dashboard-troubleshooting, esios-telegram-report

## Tabla de Contenido

1. [API ESIOS](#1-api-esios) — Endpoints, autenticación, parsing, pitfalls
2. [Indicadores y Unidades](#2-indicadores-y-unidades) — IDs correctos, reglas de conversión
3. [Deploy en NaN.builders](#3-deploy-en-nanbuilders) — Dockerfile, Kaniko, variables, troubleshooting
4. [Dashboard Frontend Troubleshooting](#4-dashboard-frontend-troubleshooting) — Problemas comunes y soluciones
5. [Informe Telegram](#5-informe-telegram) — Script esios-telegram.js, gráficos Canvas
6. [Datos Externos](#6-datos-externos) — Open-Meteo (clima) y Yahoo Finance (gas/CO2)

---

## 1. API ESIOS

**Base URL:** `https://api.esios.ree.es`
**Autenticación:** Header `x-api-key: <token>`

### Formato de respuesta

```json
{
  "indicator": {
    "values": [
      { "value": 123.45, "datetime": "2026-05-25T00:00:00.000+02:00" }
    ]
  }
}
```

### 🔥 REGLA CRÍTICA: Sin time_trunc=hour

**time_trunc=hour SUMA los 12 valores de 5 minutos, NO los promedia.**

**Solución:** Sin truncar → datos cada 5 min (288 slots/día) → promediar los 12 valores de cada hora con `convertEsiosValue()`.

### Endpoints del dashboard

- `/api/esios/summary` — 24 slots horarios (promedio de 5 min)
- `/api/esios/summary-5min` — 288 slots de 5 min sin colapsar

### Pitfalls

- **PVPC (ID 1001):** 120 valores/día (24h × 5 geo zonas). Filtrar por `geo_id=8741` (Península)
- **ID 9 (Ciclo Combinado):** Solo 1 valor diario, no 24 horarios
- **Destructuring en Promise.all:** Verificar que el número de variables coincide EXACTAMENTE con N elementos
- **Cache del navegador:** Cambios en JS no se reflejan. Usar `/js/cache-bust.js`

---

## 2. Indicadores y Unidades

### 🔥 Fuente de verdad: `convertEsiosValue()`

**NUNCA asumir unidades por nombre de indicador.** Usar siempre la función `convertEsiosValue(indicatorId, rawValue)` del dashboard.

```javascript
const DIRECT_IDS = new Set([
  1001,        // PVPC €/MWh (filtrar por geo_id=8741 Península)
  600,         // Pool OMIE €/MWh
  1293,        // Demanda real (MW)
  2052,        // Demanda prevista (MW)
  2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047,
  2048, 2049, 2050, 2051, 2065, 2066, 2067,  // Telemedida nacional (MW)
  10351, 10352,  // Gen real renovable/no renovable (MW)
  10206,         // Gen real Solar (MW)
  10006,         // Gen libre CO2 (MW)
  10232,         // Potencia disponible (MW)
  2198, 2199,    // Batería entrega/carga (MW)
  1777, 1778, 1779, 1780,  // Previsión D+1 (MW)
  10358, 10359,  // Previsión renovable D+1 (MW)
  10355, 10356,  // CO2 ratio (tCO₂/MWh, tCO₂/h)
  10207, 10208, 10209,  // Interconexiones (MW)
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

### Reglas simplificadas

| Tipo | IDs | Acción | Unidad |
|---|---|---|---|
| **DIRECTOS** | 1001, 600, 1293, 2038-2067, 2052, 10351, 10352, 10206, 10006, 10232, 2198, 2199, 1777-1780, 10358, 10359, 10355, 10356, 10207-10209 | Valor directo | MW o €/MWh o tCO₂ |
| **PBF/programados** | 1-462 (PBF), 623 (hidráulico), 10035-10049 | ÷ 1000 | GWh/periodo (MW·h) |

### ⚠️ IDs CORRECTOS de previsión D+1

| Concepto | ID | Unidad |
|---|---|---|
| Demanda prevista | **2052** | MW |
| Eólica prevista | **1777** | MW |
| Solar prevista | **1779** | MW |
| Renovable prevista | **10358** | MW |

### ⚠️ IDs CORRECTOS de interconexión

| Concepto | ID | Unidad |
|---|---|---|
| Francia | **10207** | MW directo |
| Portugal | **10208** | MW directo |
| Marruecos | **10209** | MW directo |

---

## 3. Deploy en NaN.builders

### Estructura del deploy

1. **Push a GitHub** → NaN detecta y hace build con Kaniko
2. **Kaniko build** → construye la imagen Docker sin daemon
3. **Auto-deploy** → si el build funciona, se despliega automáticamente

### Patrón de archivos .env

```
proyecto/
├── .env              ← local, NO en Git (desarrollo)
├── .env.example      ← SÍ en Git (documentación)
├── .dockerignore     ← excluye .env, node_modules, .git
└── .gitignore        ← excluye .env
```

### Dockerfile mínimo para NaN

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY src/ ./src/
COPY public/ ./public/
COPY data/ ./data/

USER appuser
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/healthz || exit 1
CMD ["node", "server.js"]
```

### Reglas críticas

- **Puerto:** El Dockerfile EXPOSE debe coincidir con el puerto del espacio NaN
- **Variables de entorno:** Se configuran en la web de NaN → pestaña **Env**
- **Kaniko:** No soporta `--build-arg` para secrets → usar variables de entorno

### Health endpoints

- `/healthz` — `{status: "ok"}` — verifica que el app está vivo
- `/readyz` — verifica que los tokens están configurados

### Trigger redeploy

```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

---

## 4. Dashboard Frontend Troubleshooting

### Problemas comunes

#### 1. Dashboard se queda en "Cargando..." para siempre

**Causa:** Error JS no capturado que no oculta el loading overlay.

**Verificar:**
- `showLoading` existe en `utils.js`
- `utils.js` se carga ANTES que `data.js` en el HTML
- `setupDateNavigation` y `updateDateControls` están DEFINIDAS en `data.js`

#### 2. API responde 5.2s+ en NaN pero 0.5s local

**Causa:** Disk cache se pierde entre reinicios en NaN.

**Solución:** Memory cache en `server.js` + batching paralelo (5 por batch × 3 concurrentes) + timeout 15s + 2 reintentos con backoff.

#### 3. CDN/NaN cachea versión vieja del HTML

**Solución:** Meta tags `Cache-Control: no-cache` + `cache-bust.js` + deploy vacío.

#### 4. NaN sirve versión antigua de archivos JS (página en blanco)

**Solución:** `git commit --allow-empty` + `git push` → esperar 2-3 min → verificar hashes.

#### 5. Frontend tarda 10s+ en mostrar datos

**Solución:** Carga progresiva — mostrar summary primero, prediccion en segundo plano.

### Verificación rápida

```bash
curl -s -o /dev/null -w "HTML: %{http_code} %{size_download}\n" URL
curl -s -w "SUMMARY: %{http_code} %{time_total}s\n" URL/api/esios/summary?fecha=2026-05-30
curl -s URL/js/data.js | head -c 100
curl -s URL/js/cache-bust.js
```

---

## 5. Informe Telegram

### Script

`scripts/esios-telegram.js` — Node.js puro + canvas npm

### Envía

1. **Texto resumen** con análisis automático (precios, demanda, renovables, CO2, interconexiones)
2. **5 gráficos PNG** con Canvas: PVPC, Demanda, Solar vs Demanda, Interconexiones, CO2

### Variables de entorno

- `TELEGRAM_BOT_TOKEN` — token del bot
- `TELEGRAM_CHAT_ID` — chat de destino
- `ESIOS_API_TOKEN` — token ESIOS/REE

### Pitfalls

- **NUNCA usar IDs 10035-10043** — devuelven null
- **Interconexiones:** valores negativos = importación, mostrar línea de cero
- **Unidades:** >= 1000 MW → GW, < 1000 MW → MW. NUNCA "k MW"
- **Cron jobs no heredan variables** — el script lee de `/proc/1/environ` y `/hermes-home/.env`

### Gráficos

Todos usan `drawLineChart()` con:
- Fondo oscuro `#0f172a`
- Colores: azul `#2563eb`, naranja `#f97316`, verde `#22c55e`, amarillo `#eab308`
- Opciones: `stacked: false`, `showZero: true`

---

## 6. Datos Externos

### Open-Meteo (clima)

ESIOS NO tiene datos meteorológicos. Usar Open-Meteo (gratuito, sin API key).

```
https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&hourly=temperature_2m,shortwave_radiation&start_date=2026-05-28&end_date=2026-05-30&timezone=Europe%2FMadrid
```

**⚠️ Usar `shortwave_radiation` (NO `solar_radiation`).**

### Yahoo Finance (gas/CO2)

Alternativa sin API key para frontend puro.

```
https://query1.finance.yahoo.com/v8/finance/chart/TTF=F?range=1d&interval=1d
```

**Tickers útiles:**
- `TTF=F` — Gas natural TTF
- `EURO0=DXX` — EU ETS CO2 Emissions
- `CL=F` — Crude Oil WTI

---

## Archivos de Referencia

- `references/verificacion-unidades.md` — Procedimiento para detectar unidades incorrectas
- `references/verificacion-empirica-ids-2026-05-28.md` — Verificación empírica de IDs
- `references/pvpc-geo-zones-2026-05-28.md` — Zonas geográficas PVPC
- `references/esios-units-verification.md` — Verificación de unidades
- `references/esios-telegram-ids.md` — IDs para informes Telegram
- `references/yahoo-finance-frontend-pattern.md` — Patrón Yahoo Finance frontend

## Scripts

- `scripts/verify-esios-units.js` — Script de verificación de unidades
