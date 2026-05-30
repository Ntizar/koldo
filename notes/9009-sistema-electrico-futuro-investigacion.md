# FASE 1 — Investigación: Simuladores eléctricos, dashboards energéticos y visualizaciones modernas

**Fecha:** 30 de mayo de 2026  
**Propósito:** Identificar proyectos similares, features, tendencias e ideas concretas para el Sistema Eléctrico Futuro

---

## 1. Proyectos similares identificados

### 1.1 Esios (Red Eléctrica de España)
**URL:** https://www.esios.ree.es/  
**Tipo:** Dashboard energético oficial del operador del sistema español  
**Características principales:**
- Datos en tiempo real de generación por tecnología (nuclear, solar, eólica, hidráulica, gas, carbón)
- Demanda horaria y en tiempo real
- Precios horarios del mercado mayorista (OMIE)
- Interconexiones internacionales
- Datos históricos con filtros por día/mes/año
- Gráficos de series temporales con zoom
- Descarga de datos en CSV/JSON

**Features destacadas:**
- Panel de "Generación por tipo" con áreas apiladas
- Comparativa demanda vs generación
- Mapa de interconexiones con flujos en tiempo real
- Indicadores de CO2 evitado y renovables
- Modo oscuro nativo

**Lecciones para SEF:** El estilo Esios es la referencia visual que David quiere emular. Su paleta azul+naranja+liquid glass ya apunta en esa dirección. La clave es la claridad en la presentación de datos en tiempo real.

---

### 1.2 Ember - Global Electricity Review
**URL:** https://ember-climate.org/  
**Tipo:** Informe anual + visualizaciones interactivas de electricidad global  
**Características principales:**
- Visualizaciones de generación eléctrica por país y tecnología
- Comparativas internacionales (España vs Europa vs mundo)
- Datos de CO2 por electricidad
- Proyecciones hasta 2030
- Gráficos de barras apiladas, líneas temporales, mapas
- Narrativa visual: cada gráfico cuenta una historia

**Features destacadas:**
- Gráficos de "banda de carbón" mostrando sustitución por renovables
- Comparativa precio CO2 por región
- Visualización de cierre de centrales
- Mapas de capacidad instalada por país
- Modo oscuro con paleta oscura profesional

**Lecciones para SEF:** La narrativa visual de Ember es un modelo: cada gráfico debe tener un mensaje claro. La banda de carbón vs renovables es un concepto que podría adaptarse al contexto español (gas vs renovables).

---

### 1.3 Energy-Charts.info (Alberto Valls)
**URL:** https://energy-charts.info/  
**Tipo:** Dashboard interactivo de energías renovables por país  
**Características principales:**
- Selector de país (España incluido)
- Gráficos de generación horaria con áreas apiladas
- Curva de duración de precios
- Comparativa de tecnologías
- Datos históricos desde 2015
- Gráficos de pastel para mix energético
- Modo oscuro/claro

**Features destacadas:**
- Vista de 24 horas con generación por tecnología (similar a SEF)
- Selector de fecha para ver cualquier día
- Gráfico de barras para generación mensual
- Curva de carga vs generación renovable
- Exportación de datos
- Diseño limpio y minimalista

**Lecciones para SEF:** El enfoque de "un país, muchos gráficos" es muy directo. La vista de 24 horas con áreas apiladas es exactamente lo que SEF ya tiene, pero con una UX más pulida. El selector de fecha es una feature que faltaría.

---

### 1.4 Electricity Map
**URL:** https://www.electricitymap.com/  
**Tipo:** Dashboard en tiempo real de electricidad por país  
**Características principales:**
- Mapa mundial con color de intensidad de CO2
- Generación en tiempo real por tecnología
- Precio de electricidad
- Intensidad de carbono en gCO2/kWh
- Datos históricos con filtros
- API pública

**Features destacadas:**
- Mapa mundial con código de colores por intensidad de carbono
- Gráfico de generación en tiempo real con áreas apiladas
- Comparativa de precio entre países
- Widget embebible
- Notificaciones de picos de renovables

**Lecciones para SEF:** El mapa mundial con código de carbono es un concepto potente. Para SEF, un indicador de intensidad de carbono horario (gCO2/kWh) sería un KPI muy valioso añadido al dashboard.

---

### 1.5 National Grid ESO (Reino Unido) - Electricity System Monitor
**URL:** https://www.nationalgrideso.com/  
**Tipo:** Monitor del sistema eléctrico nacional  
**Características principales:**
- Dashboard en tiempo real del sistema eléctrico británico
- Generación por tecnología con porcentajes
- Demanda actual vs media
- Capacidad disponible y reserva
- Datos de interconexión
- Predicción a 24 horas

**Features destacadas:**
- KPIs grandes y claros en la parte superior
- Porcentajes de cada tecnología sobre el total
- Línea de predicción de demanda
- Indicador de "días sin carbón"
- Widget de "cuánta energía limpia se está generando ahora"

**Lecciones para SEF:** Los KPIs grandes en la parte superior son muy efectivos para comunicar el estado actual del sistema. El concepto de "días sin gas" ya existe en SEF pero podría presentarse como un indicador prominente tipo "días sin carbón" del Reino Unido.

---

### 1.6 Open Power System Data (OPSD)
**URL:** https://open-power-system-data.org/  
**Tipo:** Plataforma de datos abiertos del sistema energético europeo  
**Características principales:**
- Datos abiertos de capacidad, generación, demanda
- Cobertura europea (no solo España)
- Datos descargables en CSV
- Comparativas entre países
- Metodología transparente

**Lecciones para SEF:** La transparencia metodológica es un valor añadido. Podría añadirse una sección de "Metodología de calibración" que explique cómo se obtienen los factores de capacidad sintéticos.

---

### 1.7 PVGIS (Comisión Europea)
**URL:** https://joint-research-centre.ec.europa.eu/pvgis-online/solar-energy-information-system_en  
**Tipo:** Herramienta de evaluación de energía solar  
**Características principales:**
- Datos de irradiación solar por ubicación
- Estimación de producción fotovoltaica
- Gráficos de producción mensual
- Análisis de autoconsumo
- Datos históricos de 10-30 años

**Lecciones para SEF:** El análisis de autoconsumo con datos históricos reales es un concepto que podría enriquecer el módulo de autoconsumo FV de SEF.

---

## 2. Tendencias actuales en visualización energética

### 2.1 Diseño visual
- **Liquid glass / glassmorphism**: Tarjetas semitransparentes con blur de fondo (ya implementado en SEF con Aurora v4)
- **Modo oscuro nativo**: No como añadido, sino como tema principal (SEF lo tiene pero hay que verificar funcionalidad completa)
- **Tipografía Inter**: Fuente sans-serif moderna y legible (ya implementada)
- **Gradientes suaves**: Transiciones de color entre tecnologías (SEF usa colores sólidos, podría beneficiarse de gradientes)
- **Microanimaciones**: Transiciones suaves al cambiar entre escenarios (no implementado)

### 2.2 Visualización de datos
- **Áreas apiladas**: Para mostrar mix energético (ya implementado en SEF)
- **Curvas de duración**: Para precios y demanda (ya implementado)
- **Mapas de calor**: Para mostrar patrones horarios (no implementado)
- **Gráficos de sankey**: Para flujos de energía (no implementado)
- **Indicadores de intensidad de carbono**: gCO2/kWh en tiempo real (no implementado)
- **Barras comparativas**: Año actual vs año anterior (ya implementado)
- **Mini gráficos sparkline**: Para tendencias rápidas (no implementado)

### 2.3 Interacción
- **Zoom y filtrado temporal**: Seleccionar rangos de tiempo (parcialmente implementado con selector de semana)
- **Comparación lado a lado**: Dos escenarios simultáneos (no implementado)
- **Exportación de datos**: CSV/JSON (no implementado)
- **Compartir configuración**: URL con parámetros (parcial: copiar config JSON)
- **Modo presentación**: Pantalla completa con KPIs grandes (no implementado)

### 2.4 Arquitectura
- **Sin build system**: HTML estático + CDN (SEF lo hace bien)
- **Service Worker**: Para modo offline (no implementado)
- **API de datos**: Fetch a fuentes oficiales con caché (no implementado)
- **Motor headless**: Ejecutable en Node.js (no implementado)
- **Tests automatizados**: Vitest/Jest (no implementado)

---

## 3. Ideas concretas extraídas

### Prioridad alta (impacto alto, esfuerzo medio)
1. **Indicador de intensidad de carbono horario** (gCO2/kWh): KPI nuevo en el dashboard, calculado a partir de emisiones y generación total por hora
2. **Exportación de resultados**: Botón para descargar resultados en CSV con datos horarios completos
3. **Comparación lado a lado de escenarios**: Dos paneles simultáneos para comparar dos escenarios diferentes
4. **Selector de fecha para datos REE**: Permitir al usuario elegir cualquier fecha de 2025 para ver datos reales

### Prioridad media (impacto medio, esfuerzo bajo)
5. **Mini gráficos sparkline** en los KPIs: Mostrar tendencia de los últimos 7 días en cada tarjeta KPI
6. **Gráfico de sankey**: Flujos de energía entre tecnologías y sectores de demanda
7. **Modo presentación**: Pantalla completa con KPIs grandes para presentaciones
8. **Tooltips mejorados**: Más información contextual en los gráficos Plotly
9. **Indicador de "días sin gas" prominente**: Estilo National Grid ESO, como KPI hero

### Prioridad baja (impacto medio, esfuerzo alto)
10. **Service Worker para modo offline**: Caché de la aplicación
11. **API REE en tiempo real**: Fetch a datos reales de Esios/REE
12. **Motor headless ESM**: Ejecutable en Node.js para tests y análisis
13. **Tests automatizados**: Vitest para validación de calibración
14. **GitHub Actions CI**: Lint + tests + deploy automático

---

## 4. Referencias de estilo Esios para David

El estilo Esios se caracteriza por:
- **Azul corporativo #2563eb** como color primario
- **Naranja #f97316** como color de acento
- **Fondo blanco/gris claro** en modo claro
- **Fondo oscuro #0f172a** en modo oscuro
- **Tarjetas con sombra suave** y bordes redondeados
- **Tipografía limpia** (Inter o similar)
- **Gráficos de áreas apiladas** con colores diferenciados
- **KPIs grandes** en la parte superior
- **Indicadores de tendencia** (flechas arriba/abajo)
- **Transiciones suaves** entre estados

El sistema Aurora v4 de SEF ya implementa la mayoría de estos elementos. La brecha principal está en:
- Verificar que el modo oscuro funciona completamente
- Añadir microanimaciones
- Mejorar la presentación de KPIs hero
- Añadir indicadores de intensidad de carbono
