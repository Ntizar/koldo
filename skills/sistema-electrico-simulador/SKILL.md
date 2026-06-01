---
name: sistema-electrico-simulador
description: Patrón para construir simuladores del sistema eléctrico español con orden de mérito, 8760 horas/año y trayectorias multianuales
created: 2026-06-01
source: Ntizar/SistemaElectricoFuturo
status: active
tags: [data-science, electricidad, simulación, sistema eléctrico]

---

# Simulador del Sistema Eléctrico Español

**Proyecto origen:** SistemaElectricoFuturo (Ntizar/SistemaElectricoFuturo)  
**Clusters:** simulacion, energia, orden-merito, monte-carlo  
**Decay:** normal  

## Descripción

Simulador interactivo del sistema eléctrico español con simulación anual de 8.760 horas y trayectoria multianual 2026-2035. Implementa orden de mérito (merit order), precio marginal SRMC y múltiples escenarios.

## Arquitectura del Simulador

### Módulos principales

```
simulator.js    — Motor principal (8760 horas, orden mérito, precio marginal)
demand.js       — Demanda sectorial (residencial, servicios, industria, VE, PH, H2)
storage.js      — Almacenamiento (baterías, bombeo, degradación)
policy.js       — Política energética (tope ibérico, CfDs, peajes)
scenarios.js    — 17 escenarios realistas
trajectory.js   — Trayectoria multianual 2026-2035
nuclear.js      — Calendario nuclear real + prórrogas
weather.js      — Datos meteorológicos
montecarlo.js   — Simulación Monte Carlo para escenarios de riesgo
charts.js       — Visualización con Plotly
```

### Orden de Mérito (Merit Order)

```javascript
const ordenMerito = [
  { tec: 'nuclear',      srmc: 10,  gw: gen.nuclear },
  { tec: 'solar',        srmc: 0,   gw: gen.solar },
  { tec: 'eolica',       srmc: 0,   gw: gen.eolica },
  { tec: 'offshore',     srmc: 0,   gw: gen.offshore },
  { tec: 'hidroFluyente', srmc: 5,  gw: gen.hidroFluyente },
  { tec: 'baterias',     srmc: 30,  gw: gen.baterias },
  { tec: 'bombeo',       srmc: 35,  gw: gen.bombeo },
  { tec: 'v2g',          srmc: 40,  gw: gen.v2g },
  { tec: 'hidroEmbalse', srmc: 45,  gw: gen.hidroEmbalse },
  { tec: 'importacion',  srmc: precioFrontera, gw: gen.importacion },
  { tec: 'gas',          srmc: costeCCGT, gw: gen.gas },
  { tec: 'flexDown',     srmc: precioEscasez, gw: gen.flexDown },
];

// Precio marginal = SRMC de última tecnología necesaria
for (let i = ordenMerito.length - 1; i >= 0; i--) {
  if (ordenMerito[i].gw > 0.01) {
    precio = ordenMerito[i].srmc;
    break;
  }
}
```

### Cálculo de precio CCGT

```javascript
const calorEsp = 1 / rendimientoCCGT;          // ej: 1/0.45 = 2.22
const costeComb = precioGas * calorEsp;         // €/MWh combustible
const costeCO2 = (FACTOR_CO2_GAS / rendimientoCCGT) * precioCO2;
const costeCCGT = costeComb + costeCO2 + omCCGT;
```

### Escenarios incluidos

| # | Escenario | Idea |
|---|-----------|------|
| 0 | Datos Reales 2025 | Referencia base |
| 1 | PNIEC Base 2030 | Despliegue renovable ref. |
| 2 | Prórroga Nuclear | Más firmeza nuclear |
| 3 | Sin Nuclear | Cierre acelerado |
| 4 | Almacenamiento Masivo | Mucha batería y bombeo |
| 5 | Crisis del Gas | Gas y CO₂ muy altos |
| 6 | Hidrógeno Verde | Electrólisis flexible |
| 7 | Sequía Extrema | Baja hidraulicidad |
| 8 | Cierre Nuclear ENRESA | Calendario oficial |
| 9 | Prórroga 60 Años | Seguridad suministro |
| 10 | Apagón Ibérico | Shock inercia |
| 11 | VE Masivo 2030 | 10M VE + V2G |
| 12 | Autoconsumo 30 GW | FV detrás del contador |
| 13 | PNIEC Actualizado | Variante ambiciosa |
| 14 | Ley Climático 2050 | Senda descarbonización |
| 15 | Ola Calor Extrema | Pico demanda |
| 16 | Crisis Geopolítica | Shock gas + CO₂ |

## Pasos para crear un simulador similar

### 1. Definir modelo de demanda

```javascript
calcularDemandaAjustada(params) {
  const years = params.anioObjetivo - BASE_ANIO;
  const growth = Math.pow(1 + params.crecimientoDemanda / 100, years);
  const electr = params.electrificacionTWh * years;
  const efficiency = Math.max(0.82, 1 - params.eficienciaDemanda / 100);
  return clamp((params.demandaAnual * growth + electr) * efficiency, 180, 380);
}
```

### 2. Implementar orden de mérito

- Definir tecnologías con SRMC
- Ordenar por coste marginal creciente
- Precio = SRMC de última tecnología despachada

### 3. Simulación horaria

```javascript
for (let hora = 0; hora < 8760; hora++) {
  const demanda = getDemandaHora(hora);
  const solar = getSolarHora(hora);
  const eolica = getEolicaHora(hora);
  // ... generar por tecnología
  
  const precio = calcularPrecioMarginal(generacion, demanda);
  // ... registrar métricas
}
```

### 4. Trayectoria multianual

- Rampas de despliegue por año
- Acumulación de capacidad
- Degradación de baterías entre años
- Estado persistente entre años

## Pitfalls

- **SRMC nuclear** = 10 €/MWh (must-run, no combustible en mercado)
- **SRMC renovables** = 0 (coste marginal cero)
- **Precio de escasez** actúa como techo cuando hay déficit >30%
- **Inercia insuficiente** añade +25 €/MWh al precio
- **Reserva insuficiente** añade +18 €/MWh
- **Hidráulica de embalse** tiene coste de oportunidad del agua (~45 €/MWh)
- **Cálculo CCGT**: `precioGas / η + CO2 * 0.37 / η + O&M`

## Referencias

- SistemaElectricoFuturo: `js/simulator.js` (~36KB)
- SistemaElectricoFuturo: `js/scenarios.js` (~19KB)
- SistemaElectricoFuturo: `js/montecarlo.js` (~5KB)
- REE datos: https://www.ree.es/es/datos
- OMIE: https://www.omie.es/
