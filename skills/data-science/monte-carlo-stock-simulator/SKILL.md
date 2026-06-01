---
name: monte-carlo-stock-simulator
description: "Simulador Monte Carlo de riesgos bursátiles en navegador: 5 modelos estocásticos (GBM, Heston, Jump-Diffusion, GARCH, Bootstrap), Web Worker, señales BUY/HOLD/SELL, VaR/CVaR, Sharpe/Sortino. Sin servidor, sin registro."
version: 1.0.0
category: finance
tags: [data-science, monte-carlo, stocks, finance]

---

# Monte Carlo Stock Simulator

Simulador de riesgos bursátiles de Ntizar (David Antizar) que aplica modelos estocásticos institucionales directamente en el navegador.

## Repositorio

https://github.com/Ntizar/MonteCarloInversion
https://ntizar.github.io/MonteCarloInversion/

## Stack

- Vanilla JS (ESM modules)
- Web Workers para simulación sin bloquear UI
- Plotly.js para gráficos (fan chart, histogramas)
- GitHub Pages para deploy

## Los 5 Modelos Estocásticos

| Modelo | Qué captura mejor | Característica |
|--------|-------------------|----------------|
| GBM | Tendencia + volatilidad constante | Modelo clásico Black-Scholes |
| Heston | Volatilidad estocástica (mean-reverting) | Captura clustering de volatilidad |
| Jump-Diffusion | Eventos extremos (crashes, rallies) | Saltos Poisson en precio |
| GARCH(1,1) | Volatilidad que cambia con el tiempo | Captura fat tails |
| Bootstrap | No-paramétrico, basado en datos reales | Re-muestreo de rendimientos históricos |

## Arquitectura del simulador (código fuente real)

```
public/js/
  simulation.js          — Motor principal: 5 modelos + consenso
  simulation-worker.js   — Web Worker para cálculos pesados
  math-utils.js          — Mulberry32 RNG, percentiles, rolling stats
  api.js                 — Fetch de datos de Yahoo Finance
  charts.js              — Plotly: fan chart, histogramas
  config.js              — Configuración por defecto
  fundamentals.js        — Análisis fundamental
  technicals.js          — Indicadores técnicos
  options.js             — Análisis de opciones
  news.js                — Sentimiento de noticias
  insiders.js            — Insider trading
  reddit.js              — Sentimiento Reddit
  macro.js               — Contexto macro
  screener.js            — Comparación entre activos
  portfolio.js           — Análisis de portfolio
  exporter.js            — Exportar a PDF
  cache.js               — Cache local de resultados
```

## Señal de consenso

- Cada modelo genera una señal BUY/HOLD/SELL
- Score 0-100 basado en consenso entre los 5 modelos
- Fan chart con bandas de confianza 95%/99%
- VaR y CVaR al 95% y 99%

## Métricas calculadas

- **VaR/CVaR**: cuánto puedes perder en el peor escenario
- **Probabilidades**: de caída ≥10%, ≥20%, ≥30%
- **Sharpe y Sortino**: rentabilidad ajustada al riesgo
- **Señal**: BUY/HOLD/SELL con score 0-100

## Código clave (simulation.js)

```js
// checkpoint-based validation: re-evalúa el modelo en puntos históricos
// para calibrar confianza en la simulación futura
function buildCheckpointIndices(priceCount, horizon, minTrainingDays, checkpointStep, maxCheckpoints) {
  // Construye índices de validación cruzada temporal
}

// classifyDirection: clasifica retornos en up/down/neutral
function classifyDirection(returnPct, neutralBandPct) {
  if (returnPct > neutralBandPct) return 1;
  if (returnPct < -neutralBandPct) return -1;
  return 0;
}
```

## Pitfalls

- Usar Mulberry32 como PRNG (no Math.random) para reproducibilidad
- Los Web Workers deben serializar datos — no pasar funciones
- Yahoo Finance API tiene rate limits — usar cache local
- Los modelos son educativos, no advice financiero
- El bootstrap requiere al menos 250 días de datos históricos
- GARCH necesita convergencia numérica — tener fallback a GBM
- checkpoint-based validation permite calibrar confianza del modelo