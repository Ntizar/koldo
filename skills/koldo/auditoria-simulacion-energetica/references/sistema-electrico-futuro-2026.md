# Auditoría de Sistema Eléctrico Futuro v3.1 — Referencia

> Proyecto auditado: https://ntizar.github.io/SistemaElectricoFuturo/
> Repositorio: Ntizar/SistemaElectricoFuturo (main)
> Versión: v3.1
> Fecha: mayo 2026

## Perfil del proyecto

- Simulador del sistema eléctrico español 2026-2035
- Stack: HTML estático + Vue 3 CDN + Plotly.js + CSS propio
- Sin build, sin tests, sin CI
- 17 escenarios, despacho horario 8760h/año
- Desplegado en GitHub Pages + NaN.builders

## Nota global: 6/10

## Hallazgos principales

### S1 (Crítico) — Precio heurístico, no por orden de mérito
En `simulator.js → calcularPrecioMarginal()`:
```js
if (ratioRenovable > 1.20) precio = Math.max(-20, 5 - (ratioRenovable - 1) * 44);
```
Corrección: implementar despacho real por SRMC (coste marginal de corto plazo) ordenando tecnologías y precio = última unidad.

### S2 (Crítico) — Renovables sin calibrar
- Factor `1.35` arbitrario en weather.js
- FC históricos existen (0.18 solar) pero no se usan para normalizar
- Offshore = onshore × 1.18 (correlación total, físicamente falsa)
- CF solar real REE 2025 ≈ 0.24, no 0.18

### S3 (Crítico) — PRNG defectuoso
`Math.sin`-based en constants.js. Sustituir por mulberry32.

### D1 (Crítico) — Calendario ENRESA erróneo
Ascó II: código dice 2031, texto dice 2032, real es sep 2032.
Vandellós II: código dice 2032, texto dice 2035, real es feb 2035.

### D2 (Alto) — "Tiempo real" estático
ree-data.js tiene datos hardcodeados pero UI muestra "Última actualización" como si fuese live.

### D3 (Alto) — Tope ibérico arbitrario
Fórmula `65 + yearIndex * 6` sin relación con el RDL 10/2022 real.

### D4 (Alto) — CfD a una sola cara
Nunca devuelve dinero al consumidor cuando spot > strike (sesga coste al alza).

## Plan de acción resumen

| Fase | Duración | Qué |
|------|----------|-----|
| 0 | 1-2 días | Sinceridad: quitar "tiempo real", corregir ENRESA, alinear texto/código |
| 1 | 1-2 sem | Núcleo: PRNG correcto, despacho real SRMC, calibrar renovables, calendario real |
| 2 | 1 sem | Calibración: test 2025, demanda reconciliada, hidráulica con presupuesto, recargas nucleares |
| 3 | 1 sem | Producto: escenarios ceteris paribus, vista comparativa nuclear, Monte Carlo multi-semilla |
| 4 | Continuo | Vite + Vitest + CI + headless + documentar constantes |
