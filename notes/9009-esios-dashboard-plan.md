# Plan 9009 — ESIOS Dashboard

> **Fecha de creación:** 2026-05-30
> **Estado:** En ejecución
> **Proyecto:** /root/workspace/esios-dashboard

## Resumen del análisis

- **63 archivos** en el repo
- **33 tests** — 30 pasan, 3 fallan (tests con valores mock desactualizados tras cambio time_trunc)
- **Deploy activo** en NaN.builders
- **Stack:** Express + Chart.js + vanilla JS
- **Últimos cambios:** chartjs-plugin-zoom integrado, zoom/panning en todos los gráficos

## Plan de mejoras priorizadas

| # | Mejora | Área | Dificultad | Archivos | Verificación | Estado |
|---|---|---|---|---|---|---|
| 1 | Arreglar tests fallidos (summary + time) — valores mock desactualizados tras eliminar time_trunc | Tests | baja | tests/summary.test.js, tests/time.test.js | npm test → 33/33 passing | ✅ completado 2026-05-30 |
| 2 | Exportar datos a CSV por tab — botón "Descargar CSV" en cada tab | Frontend | baja | render.js, render-charts.js, styles.css | Botón visible, descarga funcional | ✅ completado 2026-05-30 |
| 3 | Heatmap de precios semanal — visualización de 7 días con colores por precio | Precio | media | render.js, render-charts.js, data.js, styles.css, index.html | Heatmap visible, tooltips funcionales | ✅ completado 2026-05-30 (ya existente, datos reales ESIOS) |
| 4 | Modo oscuro/claro con toggle — CSS variables + localStorage | Global | baja | styles.css, index.html, theme.js | Toggle visible, tema persiste | ✅ completado 2026-05-30 |
| 5 | Indicadores de tendencia (↑↓ %) — comparar con día anterior en métricas principales | Resumen | baja | render.js, data.js, api.js | Flechas visibles con % de cambio | ✅ completado 2026-05-30 |
| 6 | Estimación de ahorro económico — calcular €/día ahorrado por renovables | Resumen | baja | render.js, summary.service.js | Métrica de ahorro visible | ✅ completado 2026-05-31 |
| 7 | Zoom y panning en gráficos — integrar chartjs-plugin-zoom | Global | media | index.html, render.js, data.js, styles.css, render-zoom.js | Zoom con rueda, pan con drag, botón reset | ✅ completado 2026-05-31 |
| 8 | Timestamp de datos + enlace a fuente ESIOS — mostrar fecha/hora y enlace | Global | baja | render.js, index.html, styles.css | Timestamp visible con fecha, enlace a ESIOS y REE | ✅ completado 2026-05-31 |
| 9 | Curva de carga comparativa — superponer día seleccionado vs media 7 días | Demanda | media | render-charts.js, data.js, render-zoom.js, index.html | Gráfico con 2 líneas superpuestas, tabla comparativa, stats | ✅ completado 2026-05-31 |
| 10 | Performance ratio renovable — comparar gen real vs prevista eólica/solar | Mix | media | render-charts.js, summary.service.js | Métrica de % acierto visible | ✅ completado 2026-05-31 |
| 11 | Panel de Balancing/Reservas — mostrar balance del sistema | Resumen | media | render.js, summary.service.js, index.html | Gráfico de balance visible | ✅ completado 2026-05-31 |
| 12 | Mapa de interconexiones con SVG — visualización geográfica simplificada con flujos animados | Interconexiones | media | render-intercon-map.js, render-charts.js, index.html | Mapa SVG con países, flujos animados, métricas, gráfico de barras | ✅ completado 2026-05-31 |
| 13 | Emisiones CO2 del mix — calcular emisiones CO2 del mix español en tiempo real con datos del mix | Resumen | baja | render.js, summary.service.js, index.html | Métrica de kg CO2/MWh y toneladas totales visible | ✅ completado 2026-05-31 (ya existente en render-final.js) |
| 14 | Calculadora de spreads — comparar precio hora pico vs hora valle, mostrar diferencial | Precio | baja | render.js, data.js | Diferencial €/MWh visible con indicador visual | ✅ completado 2026-05-31 |
| 15 | Alertas de precios extremos — destacar horas con precios > 200€/MWh o < 0€ | Precio | baja | render.js, data.js, index.html, styles.css | Badges resumen, estadísticas y tabla detallada con alertas | ✅ completado 2026-05-31 |
| 16 | Comparativa histórica mix — comparar mix eléctrico actual vs mismo mes año anterior | Mix | media | render-charts.js, summary.service.js, data.js | Gráfico de barras comparativo actual vs año anterior | ✅ completado 2026-05-31 |
| 17 | Widget autoconsumo solar — métricas de autoconsumo: producción, excedentes, consumo neto | Hogar | baja | render.js, summary.service.js, index.html | Panel con KPIs de autoconsumo solar, doughnut distribución, gráfico horario solar vs demanda | ✅ completado 2026-05-31 |
