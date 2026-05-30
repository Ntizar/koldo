# Investigación de Referencias — ESIOS Dashboard

> **Fecha:** 2026-05-30
> **Objetivo:** Identificar 8 proyectos similares (dashboards energéticos, mercados eléctricos, visualización de datos energéticos) y extraer ideas aplicables al ESIOS Dashboard.
> **Stack actual ESIOS Dashboard:** Express.js + Chart.js (vanilla JS) + PDFKit. Tabs: Resumen, Precio, Demanda, Mix, Interconexiones. Forecast Monte Carlo + escenarios heurísticos. Desplegado en NaN.builders.

---

## 1. Nord Pool Dashboard (Producto Comercial)

- **URL:** https://www.nordpoolgroup.com/en/
- **Stack:** Web platform propia (no open source), React/Angular, APIs REST
- **Descripción:** Plataforma líder de trading de electricidad en Europa nórdica y báltica. Ofrece datos de precios spot, generación, interconexiones y forecast.

### Características clave que NO tiene ESIOS Dashboard

1. **Heatmap de precios por hora y día** — Visualización tipo "calendar heatmap" donde cada celda es una hora de un día, coloreada según el precio. Permite identificar patrones semanales y estacionales de un vistazo.
2. **Exportación de datos en múltiples formatos** — CSV, Excel, JSON con un clic. Los datos descargables incluyen series históricas completas.
3. **Alertas configurables de precios** — El usuario puede configurar umbrales (ej. "avísame cuando el precio supere 100 €/MWh") y recibir notificaciones por email o push.
4. **Comparación multirregional** — Muestra simultáneamente precios de múltiples zonas geográficas (NO1, NO2, SE1, SE2, DK1, DK2, FI, EE, LV, LT, PL, DE-AT-LU) en un mismo gráfico.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Heatmap de precios | Implementar un heatmap con CSS Grid + Chart.js heatmap plugin o canvas personalizado. Los datos ya existen en el dashboard. |
| 🟢 Fácil | Exportar datos a CSV | Añadir botón "Descargar CSV" en cada tab que genere y descargue los datos actuales del día. |
| 🟡 Media | Alertas de precio | Backend: endpoint que reciba umbrales + email. Frontend: UI para configurar alertas. Usar nodemailer o similar. |
| 🔴 Difícil | Comparación multirregional | Requeriría integrar APIs de otros mercados (OMIE, EPEX, Nord Pool) y normalizar datos. Alto valor pero alto esfuerzo. |

---

## 2. National Grid ESO (National Energy System Operator) — GB Dashboard

- **URL:** https://www.nationalgrideso.com/data-and-reports/data-tools
- **Stack:** Web platform, datos abiertos, APIs REST
- **Descripción:** Operador del sistema eléctrico británico. Ofrece dashboards de datos en tiempo real, generación por tecnología, demanda, interconexiones y forecast.

### Características clave que NO tiene ESIOS Dashboard

1. **Dashboard en tiempo real (actualización cada 5 min)** — Muestra demanda actual, generación renovable en tiempo real, y precio del siguiente día. Los datos se actualizan automáticamente sin recargar la página.
2. **Gráfico de "Demand Curve" (curva de carga)** — Visualización clásica de curva de carga con líneas superpuestas de días anteriores para comparar patrones.
3. **Datos históricos descargables por día** — Cada día tiene su propio dataset descargable con generación por tecnología, demanda y precios.
4. **Indicador de "Fuel Mix" con porcentaje en vivo** — Muestra el porcentaje actual de cada fuente (gas, eólica, nuclear, solar, importaciones) con un gráfico de barras apiladas en tiempo real.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Curva de carga comparativa | Añadir un gráfico en el tab Demanda que superponga la curva del día seleccionado con la media de los últimos 7 días o la misma semana del año anterior. |
| 🟢 Fácil | Porcentaje en vivo de cada fuente | En el tab Mix, añadir un panel de "Fuel Mix %" con barras de progreso horizontales para cada tecnología. |
| 🟡 Media | Auto-refresh cada 5 min | Implementar un intervalo en el frontend que refresque los datos automáticamente. Mostrar un contador de "última actualización". |
| 🟡 Media | Datos históricos descargables | Backend: endpoint que devuelva todos los datos de un día en formato CSV/JSON. Frontend: botón de descarga en cada tab. |

---

## 3. Ember — Global Electricity Review (Open Data Dashboard)

- **URL:** https://ember-climate.org/data/data-viewer/
- **Stack:** Python (FastAPI/Flask), D3.js, Chart.js, datos abiertos
- **Descripción:** Ember Climate produce el Global Electricity Review con datos abiertos de generación eléctrica por país y tecnología. Su data viewer permite explorar series temporales de generación y emisiones.

### Características clave que NO tiene ESIOS Dashboard

1. **Comparativa año vs año (YoY)** — Visualización lado a lado de datos del mismo período en años consecutivos, con cálculo automático del % de cambio.
2. **Filtro por país/región** — Selector que permite cambiar entre diferentes países y ver la misma métrica (ej. % renovable) en España, Francia, Alemania, etc.
3. **Gráfico de emisiones CO₂ por tecnología** — Muestra las toneladas de CO₂ emitidas por cada tecnología de generación, con datos de factores de emisión.
4. **Data viewer interactivo con zoom y panning** — Gráficos que permiten hacer zoom en períodos específicos y arrastrar para ver diferentes rangos temporales.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Comparativa YoY en Mix | En el tab Resumen, añadir un selector "Comparar con año anterior" que muestre las barras del mismo mes del año previo con % de cambio. |
| 🟢 Fácil | Gráfico CO₂ por tecnología | Ya se tiene el dato de CO₂ específico. Calcular emisiones totales por tecnología usando factores de emisión conocidos y mostrar en el tab Mix. |
| 🟡 Media | Zoom y panning en gráficos | Integrar chartjs-plugin-zoom (ya existe como paquete npm) en todos los gráficos de línea. |
| 🔴 Difícil | Multi-país | Requeriría integrar datos de ESIOS de otros países o de APIs de entso-e.eu. Alto valor estratégico. |

---

## 4. ENTSO-E Transparency Platform

- **URL:** https://transparency.entsoe.eu/
- **Stack:** Web platform propia, APIs REST (open data), datos normalizados
- **Descripción:** Plataforma europea de transparencia del sistema eléctrico. Ofrece datos normalizados de generación, demanda, consumo, interconexiones, paradas de plantas y precios para todos los países europeos.

### Características clave que NO tiene ESIOS Dashboard

1. **Datos normalizados de toda Europa** — Los datos de todos los países siguen el mismo esquema (B2B/B2C APIs), lo que permite comparaciones transfronterizas.
2. **API de paradas de generación (Outages)** — Muestra cuándo una planta está parada (mantenimiento o avería) y cuánto volumen de generación se pierde.
3. **Datos de "Reservas" y "Balancing"** — Muestra las reservas activas (aumentar/disminuir generación) y el balance real del sistema.
4. **Mapa de interconexiones con flujo en vivo** — Visualización geográfica de los flujos entre países con colores según la dirección y magnitud del flujo.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟡 Media | API de paradas de generación | Integrar la API de Outages de ENTSO-E para España. Mostrar en un nuevo tab o en el tab Mix las paradas de plantas. |
| 🟡 Media | Panel de Balancing/Reservas | Los datos de balancing están disponibles en ESIOS (indicador de balance). Añadir un gráfico de reservas activas en el tab Resumen. |
| 🟡 Media | Mapa de interconexiones | Crear un SVG/Canvas con un mapa simplificado de Europa y líneas animadas para los flujos entre España y Francia/Africa. |
| 🔴 Difícil | Multi-país con normalización ENTSO-E | Integrar la API completa de ENTSO-E. Requiere key de API, normalización de datos y mapeo de indicadores. |

---

## 5. Electricity Maps (Producto Comercial — ahora part of Nea)

- **URL:** https://app.electricitymaps.com/
- **Stack:** React, Mapbox GL, D3.js, Node.js backend, APIs propias
- **Descripción:** Plataforma líder en visualización de datos energéticos en tiempo real. Muestra el CO₂ de la electricidad por país, generación por tecnología, precios y flujos de interconexión en un mapa interactivo.

### Características clave que NO tiene ESIOS Dashboard

1. **Mapa interactivo de CO₂ por país** — Mapa del mundo con países coloreados según su intensidad de carbono (gCO₂/kWh). Al hacer clic se ven los detalles.
2. **Gráfico de "Carbon Intensity" en tiempo real** — Línea de tiempo con las emisiones de CO₂ por kWh para las próximas 72 horas, con proyección basada en forecast.
3. **Stack de generación con drag-and-drop** — Visualización interactiva de la pila energética donde se puede hacer hover sobre cada tecnología para ver su contribución exacta.
4. **Modo oscuro/claro automático** — El tema se adapta automáticamente a la hora del día (oscuro de noche, claro de día).

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Modo oscuro/claro | Añadir un toggle en el header para cambiar entre tema claro y oscuro. CSS variables + localStorage para persistencia. |
| 🟢 Fácil | Tooltip mejorado con CO₂/kWh | En el gráfico de Mix, mejorar los tooltips para mostrar el CO₂ específico de cada hora junto con la generación. |
| 🟡 Media | Gráfico de Carbon Intensity forecast | Usar los datos de forecast existentes y añadir una línea de proyección de CO₂/kWh para las próximas 24h. |
| 🔴 Difícil | Mapa interactivo de interconexiones | Integrar Leaflet o Mapbox GL para un mapa de Europa con flujos animados. Requiere datos geoespaciales y librerías pesadas. |

---

## 6. Power Progress (Open Source — GitHub)

- **URL:** https://github.com/power-progress/power-progress
- **Alternativa relevante:** https://github.com/wattbewerb/wattbewerb (Dashboard de energía solar suizo)
- **Stack:** Vue.js, Chart.js, PostgreSQL, REST API
- **Descripción:** Proyectos open source de dashboards de energía. Wattbewerb es un dashboard suizo de monitorización solar con análisis de rendimiento, comparativas y predicciones.

### Características clave que NO tiene ESIOS Dashboard

1. **Análisis de rendimiento (performance ratio)** — Calcula el ratio entre la generación real y la esperada, mostrando si el sistema está funcionando de forma óptima.
2. **Comparativa de rendimiento mes a mes/año** — Gráficos de rendimiento acumulados con indicadores de tendencia (mejora/peora vs período anterior).
3. **Estimación de ahorro económico** — Convierte la generación en euros ahorrados, con desglose por tecnología y período.
4. **Dashboard de rendimiento de plantas individuales** — Permite monitorizar múltiples fuentes de generación de forma independiente.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Estimación de ahorro económico | Calcular el coste de lo que se habría pagado sin renovables (precio pool × generación renovable) y mostrarlo como "ahorro" en el tab Resumen. |
| 🟢 Fácil | Indicador de tendencia (mejora/peora) | En las métricas principales, añadir una flecha ↑↓ con el % de cambio respecto al día anterior o la semana anterior. |
| 🟡 Media | Performance ratio de renovables | Comparar generación real vs prevista para eólica y solar, calculando un % de acierto. Mostrar en el tab Mix. |
| 🟡 Media | Comparativa semanal/mensual | Añadir un selector temporal en el Resumen que permita comparar el día actual con la media semanal o mensual del mismo indicador. |

---

## 7. EPEX SPOT Dashboard (Producto Comercial)

- **URL:** https://www.epexspot.com/
- **Stack:** Web platform propia, gráficos interactivos, APIs REST
- **Descripción:** Bolsa de electricidad europea (Francia, Alemania, España, etc.). Su plataforma ofrece datos de futuros, precios intradiarios, y herramientas de análisis de mercado.

### Características clave que NO tiene ESIOS Dashboard

1. **Gráfico de futuros por mes/año** — Visualización de los contratos futuros de electricidad para los próximos 5-10 años, con curvas de forward.
2. **Histograma de precios intradiarios** — Distribución de precios en las diferentes sesiones intradiarias (hay 7 sesiones de trading intradiario en Europa).
3. **Spread entre mercados** — Visualización del diferencial de precio entre mercados vecinos (ej. España vs Francia, España vs Alemania).
4. **Curva de oferta (supply curve)** — Muestra la ordenación de ofertas de generación por precio marginal, desde la más barata hasta la más cara.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Spread España-Francia | Los datos de interconexiones ya incluyen flujos. Calcular el diferencial de precio España-Francia usando datos de ESIOS y mostrar en un nuevo gráfico. |
| 🟢 Fácil | Histograma de precios | Ya existe un histograma básico. Mejorar para mostrar percentiles (P10, P25, P50, P75, P90) y estadísticas descriptivas. |
| 🟡 Media | Curva de oferta | Reconstruct la curva de oferta usando datos de generación por tecnología ordenados por coste marginal. Requiere datos de costes que no están en ESIOS. |
| 🔴 Difícil | Futuros y forward curves | Requeriría integrar APIs de OMIE o EPEX para datos de futuros. Alto valor para traders pero muy complejo. |

---

## 8. Gridwatch (Open Data — UK)

- **URL:** https://gridwatch.co.uk/
- **Stack:** Python (Django), Chart.js, datos abiertos de National Grid ESO
- **Descripción:** Dashboard británico de monitorización del sistema eléctrico en tiempo real. Simple, rápido, con datos actualizados cada 5 minutos.

### Características clave que NO tiene ESIOS Dashboard

1. **Página "hoy" por defecto** — Al entrar, muestra automáticamente los datos del día actual sin necesidad de seleccionar fecha.
2. **Widget embebible (iframe)** — Permite incrustar el gráfico de generación en cualquier web con un simple iframe.
3. **Diseño minimalista y rápido** — Sin animaciones pesadas, carga en <1 segundo. Prioriza la velocidad sobre los efectos visuales.
4. **Enlaces a fuentes de datos originales** — Cada dato enlaza a la fuente oficial (National Grid ESO, ESO API), con versión y timestamp de los datos.

### Ideas concretas priorizadas por dificultad

| Dificultad | Idea | Descripción |
|---|---|---|
| 🟢 Fácil | Ir al día de hoy por defecto | Cambiar el comportamiento por defecto para que al cargar muestre automáticamente el día actual. |
| 🟢 Fácil | Widget embebible | Crear un endpoint `/embed/chart?chart=mix` que devuelva un HTML con solo el gráfico, embebible en iframes. |
| 🟢 Fácil | Timestamp de datos | Mostrar en cada gráfico la fecha/hora de los datos y un enlace a la fuente ESIOS original. |
| 🟡 Media | Modo "lite" sin animaciones | Añadir un parámetro URL `?lite=1` que desactive animaciones CSS y transiciones para máxima velocidad. |

---

## Resumen de Ideas Priorizadas por Dificultad

### 🟢 FÁCIL (implementación en 1-3 días)

| # | Idea | Tab/Área | Impacto |
|---|---|---|---|
| 1 | **Exportar datos a CSV** | Global | Alto — los usuarios pueden descargar datos para análisis propio |
| 2 | **Modo oscuro/claro** | Global | Medio — mejora UX significativamente |
| 3 | **Ir al día de hoy por defecto** | Global | Alto — mejora primera impresión |
| 4 | **Timestamp de datos + enlace fuente** | Global | Medio — transparencia y confianza |
| 5 | **Estimación de ahorro económico** | Resumen | Alto — valor añadido claro para usuarios |
| 6 | **Indicador de tendencia (↑↓)** | Resumen | Medio — contexto inmediato |
| 7 | **Heatmap de precios** | Precio | Alto — visualización muy intuitiva de patrones |
| 8 | **Zoom y panning en gráficos** | Global | Medio — mejora navegación temporal |
| 9 | **Widget embebible** | Global | Medio — permite compartir gráficos |

### 🟡 MEDIA (1-2 semanas)

| # | Idea | Tab/Área | Impacto |
|---|---|---|---|
| 1 | **Curva de carga comparativa** | Demanda | Alto — comparar patrones de demanda |
| 2 | **Auto-refresh cada 5 min** | Global | Alto — datos siempre actualizados |
| 3 | **Gráfico CO₂ por tecnología** | Mix | Alto — desglose de emisiones |
| 4 | **Performance ratio de renovables** | Mix | Medio — métrica de calidad de forecast |
| 5 | **Comparativa semanal/mensual** | Resumen | Medio — contexto temporal más amplio |
| 6 | **Alertas de precio** | Precio | Medio — funcionalidad proactiva |
| 7 | **Panel de Balancing/Reservas** | Resumen | Alto — datos operativos del sistema |
| 8 | **Mapa de interconexiones** | Interconexiones | Alto — visualización geográfica |

### 🔴 DIFÍCIL (1+ mes)

| # | Idea | Tab/Área | Impacto |
|---|---|---|---|
| 1 | **Comparación multirregional** | Global | Muy alto — pero requiere múltiples APIs |
| 2 | **Futuros y forward curves** | Precio | Alto — datos de OMIE/EPEX |
| 3 | **Mapa interactivo de Europa** | Global | Alto — Leaflet/Mapbox GL + datos geoespaciales |
| 4 | **Curva de oferta** | Mix | Medio — requiere datos de costes marginales |
| 5 | **Integración ENTSO-E completa** | Global | Muy alto — normalización multi-país |

---

## Hallazgos Clave por Área

### Visualización
- Los mejores dashboards usan **heatmaps** para datos temporales (precios por día/hora)
- Los **gráficos apilados con hover detallado** son estándar en mix energético
- Los **indicadores de tendencia** (flechas ↑↓ con %) dan contexto inmediato
- El **modo oscuro** es ya una expectativa estándar de UX

### Funcionalidad
- La **exportación de datos** (CSV/JSON) es una feature casi obligatoria
- El **auto-refresh** con indicador de "última actualización" mejora mucho la UX
- Las **alertas configurables** son un diferenciador clave
- El **zoom y panning** en gráficos temporales es esencial para análisis

### Datos
- La **comparativa temporal** (vs ayer, vs semana anterior, vs mismo mes año anterior) da contexto invaluable
- El **ahorro económico calculado** convierte datos técnicos en información accionable
- Los **factores de emisión por tecnología** permiten calcular emisiones reales por fuente
- Los **datos de balancing/reservas** son operativamente relevantes

### UX/UI
- **Ir al día actual por defecto** reduce fricción inicial
- Los **widgets embebibles** permiten compartir y ampliar alcance
- La **transparencia de fuentes** (enlaces a datos originales) genera confianza
- El **diseño minimalista** con carga rápida es preferible a efectos visuales pesados

---

## Recomendaciones Prioritarias para ESIOS Dashboard

Basado en el análisis, estas son las **top 5 mejoras** con mejor relación impacto/esfuerzo:

1. **🥇 Exportar datos a CSV** (Fácil, Alto impacto) — Los usuarios finales necesitan los datos en formato analizable. Implementar en cada tab un botón "Descargar CSV".

2. **🥈 Heatmap de precios** (Fácil, Alto impacto) — Visualización superior para identificar patrones de precios. Se puede hacer con CSS Grid + divs coloreados o un canvas personalizado.

3. **🥉 Modo oscuro + indicadores de tendencia** (Fácil, Alto impacto) — Mejora UX inmediata y da contexto a las métricas.

4. **Auto-refresh + curva de carga comparativa** (Media, Alto impacto) — Datos siempre actualizados y comparación con patrones históricos.

5. **Estimación de ahorro económico** (Fácil, Alto impacto) — Calcular y mostrar el ahorro generado por renovables en €/día.

---

## Fuentes Consultadas

- Nord Pool: https://www.nordpoolgroup.com/en/
- National Grid ESO: https://www.nationalgrideso.com/data-and-reports/data-tools
- Ember Climate: https://ember-climate.org/data/data-viewer/
- ENTSO-E Transparency: https://transparency.entsoe.eu/
- Electricity Maps: https://app.electricitymaps.com/
- Wattbewerb (CH): https://wattbewerb.ch/
- EPEX SPOT: https://www.epexspot.com/
- Gridwatch (UK): https://gridwatch.co.uk/
- OpenNEM (Australia): https://opennem.org.au/
- Power Progress: https://github.com/power-progress/power-progress
