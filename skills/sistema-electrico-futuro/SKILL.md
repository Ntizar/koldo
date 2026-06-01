# Sistema Eléctrico Futuro — Simulador 2026-2035

## Qué es
Simulador interactivo del sistema eléctrico español con simulación anual de 8,760 horas y trayectoria multianual 2026-2035.

## Stack
- **Frontend:** Vanilla HTML/CSS/JS
- **Design System:** Ntizar Aurora v4 (modo claro por defecto)
- **Gráficos:** Plotly.js
- **Deploy:** GitHub Pages

## Estructura
```
SistemaElectricoFuturo/
├── index.html
├── PLAN.md
├── css/
│   ├── ntizar.css
│   └── app.css
├── js/
│   ├── constants.js
│   ├── theme.js
│   ├── nuclear.js
│   ├── weather.js
│   ├── demand.js
│   ├── storage.js
│   ├── policy.js
│   ├── scenarios.js
│   ├── simulator.js
│   ├── trajectory.js
│   ├── charts.js
│   └── app.js
└── docs/
    ├── METHODOLOGY.md
    ├── POLICY.md
    └── DATA-2025.md
```

## Modos de Análisis
1. **Simulación anual:** 8,760 horas para un año objetivo
2. **Trayectoria 2026-2035:** 10 años consecutivos con rampas y estado persistente

## 17 Escenarios
| # | Escenario | Idea |
|---|-----------|------|
| 0 | Datos Reales 2025 | Referencia base |
| 1 | PNIEC Base 2030 | Despliegue renovable + almacenamiento ref |
| 2 | Prórroga Nuclear | Más firmeza nuclear |
| 3 | Sin Nuclear | Cierre acelerado, tensión sistema |
| 4 | Almacenamiento Masivo | Batería + bombeo para excedentes |
| 5 | Crisis del Gas | Gas y CO₂ muy altos |
| 6 | Hidrógeno Verde | Electrólisis flexible |
| 7 | Sequía Extrema | Baja hidraulicidad |
| 8 | Cierre Nuclear ENRESA | Calendario oficial sin prórroga |
| 9 | Prórroga 60 Años | Seguridad suministro |
| 10 | Apagón Ibérico | Shock inercia + reserva rodante |
| 11 | VE Masivo 2030 | 10M VE, smart charging, V2G |
| 12 | Autoconsumo 30 GW | FV detrás contador gran escala |
| 13 | PNIEC 2030 Actualizado | Variante más ambiciosa |
| 14 | Ley Cambio Climático 2050 | Senda descarbonización |
| 15 | Ola de Calor Extrema | Pico demanda + penalización solar |
| 16 | Crisis Geopolítica | Shock gas+CO₂ + prórroga nuclear |

## Módulos
- **nuclear.js:** Calendario real ENRESA + opción prórroga
- **weather.js:** Condiciones meteorológicas
- **demand.js:** Demanda sectorial (residencial, servicios, industria, VE, bombas calor, H2, autoconsumo)
- **storage.js:** Baterías (degradación 2%/365 ciclos), bombeo con reserva estacional, V2G
- **policy.js:** Tope ibérico, CfDs, peajes dinámicos, PVPC, pagos capacidad
- **scenarios.js:** Definición de 17 escenarios
- **simulator.js:** Motor principal 8,760 horas
- **trajectory.js:** Trayectoria multianual 2026-2035
- **charts.js:** Visualización Plotly

## Métricas
- Horas sin gas
- Estrés de red
- Coste del sistema
- LCOE aproximado
- LCOS aproximado

## Fuentes
- REE, OMIE, MITECO, CNMC, ENTSO-E, EU ETS

## Referencias
- Web: https://ntizar.github.io/SistemaElectricoFuturo/
- Repo: https://github.com/Ntizar/SistemaElectricoFuturo
