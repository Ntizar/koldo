# Plan 9009 — ESIOS Dashboard

> **Fecha de creación:** 2026-05-30
> **Fecha de última actualización:** 2026-06-01 (FASE 4 — Reaprendizaje)
> **Estado:** En ejecución
> **Proyecto:** /root/workspace/esios-dashboard

## Resumen del análisis

- **63 archivos** en el repo
- **33 tests** — 33/33 passing
- **Deploy activo** en NaN.builders
- **Stack:** Express + Chart.js + vanilla JS
- **10 tabs:** Resumen, Precio, Demanda, Mix, Interconexiones, Heatmap, Clima, Gas TTF, Correlación, Previsión
- **19 mejoras completadas** (100% de la FASE 2 original)
- **FASE 4 completada:** 19 nuevas ideas identificadas (2026-06-01)

## Plan de mejoras priorizadas

### FASE 2 — Mejoras originales (completadas)

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
| 18 | Activar tab Previsión D+1 — gráfico Monte Carlo de precios con banda de confianza 95% + renovables previstas | Precio | baja | render.js, data.js, ui.js, index.html | Tab Previsión visible con métricas eólicas/solares previstas y gráfico de precios con media + banda p5-p95 | ✅ completado 2026-06-01 |
| 19 | Indice de sostenibilidad del dia (0-100) — score compuesto: % renovable (40%) + CO2 (30%) + precio competitivo (30%) con SVG circular | Resumen | baja | render.js, summary.service.js, index.html, data.js | SVG circular con score, desglose de componentes, etiqueta de calidad | ✅ completado 2026-06-01 (ya existente en render.js, summary.service.js) |

### FASE 4 — Nuevas ideas identificadas (2026-06-01)

| # | Mejora | Área | Dificultad | Archivos | Verificación | Estado |
|---|---|---|---|---|---|---|
| 20 | Detección de tema del sistema — auto-detectar prefers-color-scheme y aplicar tema automáticamente | Global | baja | styles.css, index.html | Toggle respeta preferencia del SO | ⏳ pendiente |
| 21 | Navegación por teclado mejorada — añadir atajos R=refresh, E=export, H=hoy | Global | baja | ui.js, data.js | Atajos funcionales, toast de ayuda | ⏳ pendiente |
| 22 | Indicador "última actualización" — mostrar timestamp + contador de minutos | Global | baja | render.js, data.js | Timestamp visible con contador | ⏳ pendiente |
| 23 | Insights automáticos del día — generar 2-3 insights: "renovables superaron demanda", "precio pico fue X" | Resumen | baja | render.js, summary.service.js | 2-3 insights generados automáticamente | ⏳ pendiente |
| 24 | Gráfico de barras por tecnología — GWh de cada tecnología ordenado por contribución | Mix | baja | render-charts.js, index.html | Gráfico de barras verticales por tecnología | ⏳ pendiente |
| 25 | Exportar gráfico como PNG — botón en cada gráfico para descargar como imagen | Global | baja | render.js, styles.css | Botón de export PNG funcional | ⏳ pendiente |
| 26 | Comparativa con media móvil 7 días — línea de media móvil en precio y demanda | Precio/Demanda | media | render-charts.js, data.js, render-zoom.js | Línea MM7 visible en gráficos | ⏳ pendiente |
| 27 | Panel de rendimiento mensual — métricas acumuladas del mes: % renovable, ahorro total, emisiones | Resumen | media | render.js, summary.service.js, index.html | Panel con métricas mensuales acumuladas | ⏳ pendiente |
| 28 | Gráfico de densidad de precios — histograma con percentiles P10/P25/P50/P75/P90 | Precio | media | render-charts.js, data.js | Histograma con percentiles marcados | ⏳ pendiente |
| 29 | Responsive design básico — CSS grid adaptable, tabs en scroll horizontal en móvil | Global | media | styles.css, index.html | Dashboard usable en móvil | ⏳ pendiente |
| 30 | Informe PDF diario automático — endpoint /api/report/daily con resumen y gráficos | Global | media | report.service.js, server.js, index.html | PDF generado con datos del día | ⏳ pendiente |
| 31 | Correlación renovable-precio — gráfico de dispersión con Pearson entre % renovable y precio | Correlación | media | render-charts.js, summary.service.js | Scatter plot con r de Pearson | ⏳ pendiente |
| 32 | Visualización de flujo de energía — SVG con flujo animado: renovables→demanda, importaciones→demanda | Resumen | media | render.js, index.html, styles.css | SVG con flujo animado de energía | ⏳ pendiente |
| 33 | Auto-refresh cada 5 minutos — polling automático con indicador de última actualización | Global | alta | data.js, server.js, ui.js | Datos se actualizan automáticamente | ⏳ pendiente |
| 34 | Predicción de producción solar/eólica — usar weather data para predecir generación renovable | Mix | alta | weather.service.js, summary.service.js, render-charts.js | Predicción vs real con % error | ⏳ pendiente |
| 35 | Análisis financiero avanzado — ROI renovables, payback period, costes evitados, proyección | Resumen | alta | summary.service.js, render.js, index.html | Métricas financieras avanzadas | ⏳ pendiente |
| 36 | Alertas configurables de precio — backend endpoint + UI para configurar umbrales | Precio | alta | summary.service.js, render.js, index.html, styles.css | UI de configuración + alertas | ⏳ pendiente |
| 37 | Dashboard embebible (iframe) — endpoint /embed con gráficos principales embebibles | Global | alta | server.js, index.html, styles.css | HTML embebible funcional | ⏳ pendiente |
| 38 | Historial de percentiles — mostrar dónde se sitúa el precio actual en distribución histórica | Precio | alta | summary.service.js, render.js, index.html | Percentil histórico visible | ⏳ pendiente |
