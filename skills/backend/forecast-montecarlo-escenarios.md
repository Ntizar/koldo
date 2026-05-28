---
name: forecast-montecarlo-escenarios
description: "Simulación Monte Carlo con escenarios heurísticos para predicción de precios horarios. Integra drivers externos como viento, solar, demanda, temperatura, gas y CO2."
version: 1.0.0
author: Ntizar
---

# Forecast con Monte Carlo y Escenarios

Patrón para construir predicciones de series horarias combinando histórico + Monte Carlo + escenarios heurísticos.

## Arquitectura

```
src/domains/forecast/
  ├── montecarlo.service.js         ← Simulación pura
  └── price-forecast.service.js     ← Orquestación + escenarios
```

## Monte Carlo

```javascript
function monteCarloSimulation(historico, numSims = 1000) {
  const hourlyStats = {};
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    const valores = historico
      .map(dia => dia.find(v => v.hora === hh))
      .filter(entry => entry && entry.valor !== null)
      .map(entry => entry.valor);

    if (valores.length === 0) {
      hourlyStats[hh] = { media: null, desviacion: null, p5: null, p25: null, p50: null, p75: null, p95: null };
      continue;
    }

    const n = valores.length;
    const media = valores.reduce((a, b) => a + b, 0) / n;
    const varianza = valores.reduce((sum, v) => sum + (v - media) ** 2, 0) / n;
    const desviacion = Math.sqrt(varianza);
    const factorRuido = Math.max(1.0, 1.5 - (n / 14));
    const sigma = desviacion * factorRuido;

    // Box-Muller transform
    const simulaciones = [];
    for (let i = 0; i < numSims; i++) {
      let u1 = 0, u2 = 0;
      while (u1 === 0) u1 = Math.random();
      while (u2 === 0) u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      simulaciones.push(Math.max(0, media + z * sigma));
    }
    simulaciones.sort((a, b) => a - b);

    hourlyStats[hh] = {
      media: Math.round(media * 100) / 100,
      desviacion: Math.round(desviacion * 100) / 100,
      p5: Math.round(simulaciones[Math.floor(numSims * 0.05)] * 100) / 100,
      p25: Math.round(simulaciones[Math.floor(numSims * 0.25)] * 100) / 100,
      p50: Math.round(simulaciones[Math.floor(numSims * 0.50)] * 100) / 100,
      p75: Math.round(simulaciones[Math.floor(numSims * 0.75)] * 100) / 100,
      p95: Math.round(simulaciones[Math.floor(numSims * 0.95)] * 100) / 100,
    };
  }
  return hourlyStats;
}
```

## Escenarios heurísticos

Cada driver externo tiene un perfil horario que modela su impacto:

```javascript
const WIND_PROFILE = [1.15, 1.15, 1.12, 1.08, 1.02, 0.98, ...];  // 24h
const SOLAR_PROFILE = [0, 0, 0, 0, 0, 0.05, 0.18, 0.4, ...];      // 24h
const DEMAND_PROFILE = [0.95, 0.92, 0.9, 0.88, ...];              // 24h

function scenarioImpactForHour(hour, scenario) {
  const wind = scenario.windDeltaPct * -0.25 * WIND_PROFILE[hour];
  const solar = scenario.solarDeltaPct * -0.18 * SOLAR_PROFILE[hour];
  const demand = scenario.demandDeltaPct * 0.42 * DEMAND_PROFILE[hour];
  const temperature = scenario.temperatureDeltaC * 1.1 * TEMPERATURE_PROFILE[hour];
  return {
    meanAdjustmentPct: wind + solar + hydro + demand + temperature,
    volatilityFactor: Math.max(0.5, 1 + (scenario.volatilityDeltaPct / 100)),
  };
}
```

## Parseo de parámetros (bilingüe)

```javascript
function parseForecastOptions(query = {}) {
  return {
    historyDays: clampNumber(firstDefined(query, ['historyDays', 'historiaDias'], 14), 3, 45, 14),
    simulations: clampNumber(firstDefined(query, ['simulations', 'simulaciones'], 1000), 100, 5000, 1000),
    scenario: {
      windDeltaPct: clampNumber(firstDefined(query, ['windDeltaPct', 'eolicaPct'], 0), -100, 300, 0),
      solarDeltaPct: clampNumber(firstDefined(query, ['solarDeltaPct', 'solarPct'], 0), -100, 300, 0),
      demandDeltaPct: clampNumber(firstDefined(query, ['demandDeltaPct', 'demandaPct'], 0), -100, 300, 0),
      temperatureDeltaC: clampNumber(firstDefined(query, ['temperatureDeltaC', 'temperaturaC'], 0), -20, 20, 0),
    },
  };
}
```

## Contrato de salida

```json
{
  "fecha": "2026-05-28",
  "prediccion": [
    { "hora": "00", "media": 68.4, "desviacion": 9.2, "p5": 50.8, "p50": 67.9, "p95": 88.7 }
  ],
  "precio_medio_estimado": 71.2,
  "intervalo_confianza_95": [44.1, 108.9],
  "dias_historia": 14,
  "metadata": {
    "modelo": "historical-hourly-montecarlo",
    "simulations": 1000,
    "scenario": { "active": true, "drivers": { "windDeltaPct": 10, ... } }
  }
}
```

## Buenas prácticas

1. **Clamp de parámetros** — evitar valores absurdos (historyDays negativo, simulaciones 1M)
2. **Alias bilingües** — aceptar parámetros en español e inglés
3. **Mínimo de historia** — si hay menos de 3 días, no hacer predicción
4. **Intervalos de confianza** — p5/p25/p50/p75/p95 para cada hora
5. **Metadata completa** — qué se usó para generar la predicción

## Pitfalls

- ❌ Box-Muller sin clamp → precios negativos
- ❌ FactorRuido demasiado alto → volatilidad artificial
- ❌ Sin mínimo de historia → 1 día de datos produce predicción absurda
- ❌ Escenarios sin límite → windDeltaPct +300% no tiene sentido físico

## Referencia

- Código real: `src/domains/forecast/montecarlo.service.js` y `price-forecast.service.js`
- Skills relacionadas: servicio-resumen-consolidado, fetch-paralelo-fallos-parciales