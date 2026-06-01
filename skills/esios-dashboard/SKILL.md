# ESIOS Dashboard — Arquitectura y Patrones

## Stack
- **Backend:** Node.js + Express + Helmet + dotenv
- **Frontend:** Chart.js + JavaScript vanilla
- **Cache:** MemoryCache (RAM) + DiskCache (filesystem) con TTL
- **API:** ESIOS/REE (datos horarios del sistema eléctrico español)

## Arquitectura por Dominios
```
src/
├── domains/
│   ├── energy/          # energy.service.js, summary.service.js
│   ├── forecast/        # price-forecast.service.js, montecarlo.service.js
│   └── reports/         # report.service.js
├── infra/
│   ├── clients/         # esios.client.js, nan.client.js
│   └── cache/           # memory-cache.js, disk-cache.js
├── shared/
│   ├── time/madrid.js   # Timezone Europe/Madrid, DST handling
│   ├── io/csv.repository.js
│   └── esios-units.js   # Conversión de unidades ESIOS
└── config/
    └── env.js           # Validación de variables de entorno
```

## Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Dashboard principal |
| GET | `/api/esios/indicators` | Lista indicadores (opcional: ?category=) |
| GET | `/api/esios/indicator?id=&fecha=` | Datos horarios de un indicador |
| GET | `/api/esios/monthly?id=&mes=` | Datos mensuales (agrega diario) |
| GET | `/api/esios/yearly?id=&ano=` | Datos anuales (agrega mensual) |
| GET | `/api/esios/summary` | Resumen diario consolidado |
| GET | `/api/esios/prediccion` | Forecast Monte Carlo |
| GET | `/api/esios/test-token` | Verifica token ESIOS |
| GET | `/api/esios/cache-stats` | Métricas de cache |
| POST | `/api/esios/cache-clear` | Limpia cache |
| GET | `/healthz` | Liveness probe |
| GET | `/readyz` | Readiness probe |
| GET | `/metrics` | Prometheus metrics |

## Conversión de Unidades ESIOS
- IDs directos: PVPC, previsiones D+1/H+3, ratio CO2, interconexiones
- IDs PBF y llenado hidráulico: dividir entre 1000
- Telemedidas nacionales y agregados diarios: dividir entre 10
- Baterías 2198/2199: dividir entre 10

## Modelo de Fechas
- Siempre Europe/Madrid (no UTC plano)
- Formato público: YYYY-MM-DD
- DST: 23h (primavera) → slot vacío; 25h (otoño) → colapsa en mismo slot
- Selector limita a últimos 365 días, bloquea fechas futuras

## Monte Carlo Forecast
- Box-Muller transform para generación de normales
- 1000 simulaciones por hora
- Factor de ruido: `max(1.0, 1.5 - n/14)` donde n = días históricos
- Percentiles: p5, p25, p50, p75, p95
- Mínimo 0 (precios no negativos)

## Seguridad
- Helmet con CSP estricto
- CORS whitelist por ALLOWED_ORIGINS
- Tokens ESIOS solo en backend (nunca frontend)
- Cache-busting en JS estáticos

## Variables de Entorno
| Variable | Obligatoria | Default | Uso |
|----------|-------------|---------|-----|
| ESIOS_API_TOKEN | Sí | - | Token ESIOS |
| PORT | No | 4000 | Puerto HTTP |
| CACHE_TTL_MS | No | 300000 | TTL cache |
| ALLOWED_ORIGINS | No | * | CORS whitelist |
| DATA_DIR | No | ./data | Cache en disco |

## Deploy
- Docker: Dockerfile incluido
- NaN.builders: Procedimiento documentado
- Vercel: No aplicable (requiere Node server)
