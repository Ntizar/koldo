# Investigación FASE 4 — ESIOS Dashboard (2026-06-01)

> **Fecha:** 2026-06-01
> **Objetivo:** Reaprendizaje semanal — buscar NUEVOS proyectos de referencia, tendencias UX/UI 2025-2026, features emergentes

---

## 📊 Estado actual del proyecto

- **19 mejoras** implementadas (100% completadas)
- **10 tabs:** Resumen, Precio, Demanda, Mix, Interconexiones, Heatmap, Clima, Gas TTF, Correlación, Previsión
- **21 endpoints API** en backend
- **~2000 líneas** de código backend por dominio
- **Stack:** Express + Chart.js + vanilla JS
- **Deploy:** NaN.builders

---

## 🔍 Nuevos proyectos de referencia identificados

### 1. Power Flow Card Plus (flixlix/power-flow-card-plus)
- **URL:** https://github.com/flixlix/power-flow-card-plus
- **⭐ 1115 stars** | Actualizado mayo 2026
- **Stack:** Custom card Home Assistant (HTML/JS/CSS)
- **Features clave:**
  - Visualización de flujo de energía con animaciones SVG
  - Soporte para paneles solares, baterías, EV charging, grid import/export
  - Animaciones de flujo tipo "river" con partículas
  - Diseño circular (power wheel) y lineal (energy flow)
  - Personalización extrema de colores, tamaños, layouts
- **Ideas aplicables al ESIOS Dashboard:**
  - **Flujo de energía animado SVG** — Crear un gráfico tipo "sankey" simplificado que muestre el flujo de energía: renovables → demanda, grid → demanda, excedentes → batería/grid
  - **Power wheel para mix eléctrico** — Representación circular del mix con segmentos animados, similar al doughnut pero con efecto de rotación suave
  - **Animaciones de partículas** — Para mostrar el flujo de energía entre tecnologías

### 2. Solectrus (solectrus/solectrus)
- **URL:** https://github.com/solectrus/solectrus
- **⭐ 157 stars** | Actualizado junio 2026
- **Stack:** Ruby, InfluxDB, dashboard self-hosted
- **Features clave:**
  - Dashboard completo de fotovoltaica con monitorización en tiempo real
  - Análisis financiero integrado (costes, ahorros, ROI)
  - Predicción de producción solar basada en weather data
  - Gráficos de rendimiento diario/semanal/mensual/añual
  - Alertas de rendimiento anómalo
- **Ideas aplicables:**
  - **Análisis financiero avanzado** — Extender la calculadora de spreads con ROI de renovables, payback period, costes evitados
  - **Predicción de producción** — Usar datos meteorológicos para predecir generación solar/eólica real
  - **Alertas de rendimiento anómalo** — Detectar desviaciones significativas entre previsto y real

### 3. Energy Flow Card Plus (flixlix/energy-flow-card-plus)
- **URL:** https://github.com/flixlix/energy-flow-card-plus
- **⭐ 247 stars** | Actualizado mayo 2026
- **Features clave:**
  - Tarjeta de distribución energética con dispositivos individuales
  - Soporte para múltiples fuentes (solar, eólica, grid, batería)
  - Visualización de consumo por dispositivo
  - Historial de producción y consumo
- **Ideas aplicables:**
  - **Desglose por tipo de generación** — En el tab Mix, desglosar cada tecnología con su contribución individual y tendencia
  - **Historial de rendimiento** — Gráfico de rendimiento de cada tecnología a lo largo del tiempo

### 4. Lumina Energy Card (Giorgio866/lumina-energy-card)
- **URL:** https://github.com/Giorgio866/lumina-energy-card
- **⭐ 282 stars** | Creado diciembre 2025 (muy reciente)
- **Features clave:**
  - Diseño 3D ultra moderno para monitorización energética
  - Estados de batería visuales con animaciones
  - EV charging con estimación de coste
  - Múltiples arrays solares
  - Efectos de glassmorphism y gradientes
- **Ideas aplicables:**
  - **Efectos visuales modernos** — Glassmorphism, gradientes, sombras suaves en las cards del dashboard
  - **Estados visuales de batería** — Si se añade tab de almacenamiento, usar animaciones de estado
  - **Diseño 3D sutil** — Sombras y gradientes para dar profundidad a las cards de métricas

### 5. Power Wheel Card (gurbyz/power-wheel-card)
- **URL:** https://github.com/gurbyz/power-wheel-card
- **⭐ 181 stars**
- **Features clave:**
  - Representación circular del consumo/producción de energía
  - Animaciones de rotación según nivel de consumo
  - Indicadores visuales de estado (normal, alto, bajo)
- **Ideas aplicables:**
  - **Power wheel del sistema eléctrico** — Circular chart que muestre la proporción de cada fuente en el sistema español

---

## 🎨 Tendencias UX/UI 2025-2026 para dashboards energéticos

### 1. Glassmorphism y Neumorphism
- **Tendencia:** Superficies translúcidas con blur de fondo, bordes sutiles, sombras suaves
- **Aplicación:** Cards de métricas con fondo semitransparente, blur del fondo, bordes con opacidad
- **Referencia:** Lumina Energy Card, Electricity Maps

### 2. Microanimaciones y Transiciones
- **Tendencia:** Animaciones sutiles de 200-300ms para feedback visual
- **Aplicación:** Pulse en métricas cuando cambian, hover effects en tabs, transiciones suaves entre fechas
- **Referencia:** Electricity Maps, Nord Pool

### 3. Dark Mode Nativo
- **Tendencia:** Soporte nativo de tema oscuro con detección automática del sistema
- **Aplicación:** El dashboard ya tiene modo oscuro manual. Mejora: detectar preferencia del sistema (`prefers-color-scheme`) y auto-aplicar
- **Referencia:** Electricity Maps, Home Assistant Energy

### 4. Data Storytelling
- **Tendencia:** Narrativa visual — los datos cuentan una historia con insights automáticos
- **Aplicación:** Generar insights automáticos: "Hoy las renovables supusieron el X% de la demanda, un Y% más que ayer"
- **Referencia:** Ember Climate, Electricity Maps

### 5. Responsive Design Avanzado
- **Tendencia:** Dashboards que funcionan perfectamente en móvil, tablet y desktop
- **Aplicación:** El dashboard actual no es responsive. Mejora: grid CSS adaptable, tabs en scroll horizontal en móvil, gráficos que se redimensionan
- **Referencia:** Gridwatch UK, Home Assistant Energy

### 6. Real-time Streaming
- **Tendencia:** Actualización en tiempo real sin recargar la página
- **Aplicación:** WebSocket o polling para actualizar datos cada X minutos con indicador de "última actualización"
- **Referencia:** National Grid ESO, Electricity Maps

### 7. Comparativas Contextuales
- **Tendencia:** Mostrar datos en contexto: vs ayer, vs semana, vs mes, vs año, vs media histórica
- **Aplicación:** El dashboard ya tiene tendencias. Mejora: añadir comparativas con media móvil de 7/30 días, percentiles históricos
- **Referencia:** Ember Climate, ENTSO-E

### 8. Accesibilidad (a11y)
- **Tendencia:** WCAG 2.1 AA compliance — contraste, navegación por teclado, screen readers
- **Aplicación:** ARIA labels en gráficos, contraste mínimo 4.5:1, navegación por teclado completa
- **Referencia:** Home Assistant, ENTSO-E

### 9. Exportación y Compartir
- **Tendencia:** Compartir dashboards o segmentos con un clic, generar informes PDF
- **Aplicación:** Ya existe CSV. Mejora: compartir captura de gráfico, generar informe diario/semanal PDF automático
- **Referencia:** Nord Pool, ENTSO-E

### 10. Gamificación y Engagement
- **Tendencia:** Elementos de gamificación para engagement: streaks, logros, progreso
- **Aplicación:** Indicador de "racha de días renovables", badge de "día verde" cuando >70% renovable
- **Referencia:** Home Assistant Energy, Wattbewerb

---

## 🆕 Nuevas ideas de mejoras identificadas

### 🟢 FÁCIL (implementación en 1-2 ejecuciones cron)

| # | Idea | Tab/Área | Descripción |
|---|---|---|---|
| 20 | **Detección de tema del sistema** | Global | Auto-detectar `prefers-color-scheme` del sistema operativo y aplicar tema oscuro/claro automáticamente. Mejora del toggle manual existente. |
| 21 | **Navegación por teclado mejorada** | Global | Añadir atajos: `R` = refresh, `E` = export CSV, `H` = ir a hoy, `?` = mostrar ayuda. Ya existen ← → T Y ? |
| 22 | **Indicador "última actualización"** | Global | Mostrar timestamp de cuándo se cargaron los datos + contador de "actualizado hace X min". |
| 23 | **Insights automáticos del día** | Resumen | Generar 2-3 insights automáticos: "Las renovables superaron la demanda", "El precio pico fue X€", "La eólica generó Y GWh" |
| 24 | **Gráfico de barras por tecnología** | Mix | Añadir gráfico de barras verticales mostrando GWh de cada tecnología del día, ordenado por contribución |
| 25 | **Exportar gráfico como PNG** | Global | Botón en cada gráfico para descargar como imagen PNG con un clic |

### 🟡 MEDIA (1-2 semanas)

| # | Idea | Tab/Área | Descripción |
|---|---|---|---|
| 26 | **Comparativa con media móvil 7 días** | Precio/Demanda | En los gráficos de precio y demanda, añadir línea de media móvil de 7 días para identificar desviaciones |
| 27 | **Panel de rendimiento mensual** | Resumen | Tab o sección con métricas acumuladas del mes: % renovable, ahorro total, emisiones evitadas |
| 28 | **Gráfico de densidad de precios** | Precio | Histograma de distribución de precios del día con percentiles marcados (P10, P25, P50, P75, P90) |
| 29 | **Responsive design básico** | Global | CSS grid adaptable para móvil: tabs en scroll horizontal, gráficos que se redimensionan, métricas en 1 columna |
| 30 | **Informe PDF diario automático** | Global | Endpoint `/api/report/daily` que genere PDF con resumen del día, gráficos principales y métricas clave |
| 31 | **Correlación renovable-precio** | Correlación | Gráfico de dispersión con correlación Pearson entre % renovable y precio en cada hora |
| 32 | **Visualización de flujo de energía** | Resumen | SVG con flujo animado: renovables → demanda, importaciones → demanda, excedentes → grid |

### 🔴 DIFÍCIL (1+ mes)

| # | Idea | Tab/Área | Descripción |
|---|---|---|---|
| 33 | **Auto-refresh cada 5 minutos** | Global | WebSocket o polling para actualizar datos automáticamente con indicador de "última actualización" |
| 34 | **Predicción de producción solar/eólica** | Mix | Usar datos meteorológicos para predecir generación renovable y compararla con la real |
| 35 | **Análisis financiero avanzado** | Resumen | ROI de renovables, payback period, costes evitados, proyección de ahorro mensual/anual |
| 36 | **Alertas configurables de precio** | Precio | Backend: endpoint para configurar umbrales. Frontend: UI para configurar alertas |
| 37 | **Dashboard embebible (iframe)** | Global | Endpoint `/embed` que devuelva HTML con solo los gráficos principales, embebible en otras webs |
| 38 | **Historial de percentiles** | Precio | Mostrar dónde se sitúa el precio actual en la distribución histórica (percentil 1-100) |

---

## 📈 Tendencias emergentes 2025-2026

1. **IA generativa en dashboards** — Chatbot integrado que responde preguntas sobre los datos ("¿Cuál fue el precio máximo ayer?")
2. **Digital twins del sistema eléctrico** — Simulación en tiempo real del sistema eléctrico con datos reales
3. **Integración con mercados europeos** — Comparación España-Francia-Alemania en tiempo real
4. **Carbon accounting automático** — Cálculo automático de huella de carbono por actividad
5. **Energy transition tracking** — Seguimiento del progreso hacia objetivos de transición energética (2030, 2050)
6. **EV charging optimization** — Optimización de carga de vehículos eléctricos basada en precio y renovables
7. **Community energy sharing** — Dashboards comunitarios de energía compartida

---

## 🎯 Recomendaciones Prioritarias para FASE 4

Basado en el análisis, estas son las **mejores nuevas ideas** con mejor relación impacto/esfuerzo:

1. **🥇 Detección de tema del sistema** (Fácil, Alto impacto UX) — Mejora inmediata del modo oscuro existente
2. **🥈 Insights automáticos del día** (Fácil, Alto impacto) — Convierte datos en narrativa accionable
3. **🥉 Responsive design básico** (Media, Alto impacto) — Hace el dashboard usable en móvil
4. **Comparativa con media móvil 7 días** (Media, Alto impacto) — Da contexto temporal valioso
5. **Gráfico de densidad de precios con percentiles** (Media, Medio impacto) — Análisis estadístico avanzado

---

## 📚 Fuentes Consultadas

- Power Flow Card Plus: https://github.com/flixlix/power-flow-card-plus (⭐1115)
- Lumina Energy Card: https://github.com/Giorgio866/lumina-energy-card (⭐282)
- Energy Flow Card Plus: https://github.com/flixlix/energy-flow-card-plus (⭐247)
- Power Wheel Card: https://github.com/gurbyz/power-wheel-card (⭐181)
- Solectrus: https://github.com/solectrus/solectrus (⭐157)
- OpenNEM: https://opennem.org.au/
- Electricity Maps: https://app.electricitymaps.com/
- Home Assistant Energy: https://www.home-assistant.io/integrations/energy/
- Gridwatch UK: https://gridwatch.co.uk/
- Wattbewerb: https://wattbewerb.ch/
- ENTSO-E: https://transparency.entsoe.eu/
- Ember Climate: https://ember-climate.org/
- National Grid ESO: https://www.nationalgrideso.com/
- Nord Pool: https://www.nordpoolgroup.com/
