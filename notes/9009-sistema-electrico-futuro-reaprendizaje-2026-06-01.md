# FASE 4 — Reaprendizaje: Sistema Eléctrico Futuro

**Fecha:** 1 de junio de 2026  
**Propósito:** Buscar NUEVOS proyectos similares, features, tendencias. Enriquecer plan maestro. Revisar mejoras completadas.

---

## 1. Investigación de fuentes externas (1 de junio 2026)

### 1.1 Energy-Charts.info (Alberto Valls)
**URL:** https://energy-charts.info/  
**Tipo:** Dashboard interactivo de energías renovables por país  
**Features verificadas:**
- ✅ Selector de país (España incluido)
- ✅ Modo oscuro
- ✅ Emisiones CO2
- ✅ Compartible (share link)
- ✅ Responsive
- ❌ Exportar datos
- ❌ Vista semanal/mensual/anual
- ❌ Curva de duración de precios
- ❌ Gráfico pie para mix
- ❌ Mapa de centrales

**Lecciones para SEF:** Energy-Charts tiene vista de 24h con áreas apiladas que SEF ya tiene, pero su selector de fecha y exportación de datos son features que podrían inspirar mejoras. La comparativa internacional no la tiene, pero Ember sí.

### 1.2 Ember - Global Electricity Review
**URL:** https://ember-climate.org/  
**Tipo:** Informe anual + visualizaciones interactivas de electricidad global  
**Features verificadas:**
- ✅ Gráficos interactivos
- ✅ Comparativa internacional (países)
- ✅ Modo oscuro
- ✅ Seguimiento de CO2
- ✅ Análisis de sustitución carbón
- ✅ Crecimiento renovable
- ✅ Demanda eléctrica
- ❌ Descarga de datos
- ❌ Transiciones animadas
- ❌ Narrativa visual

**Lecciones para SEF:** La comparativa internacional de Ember es un modelo directo para una nueva tab en SEF. La narrativa visual (cada gráfico cuenta una historia) podría aplicarse a los gráficos de trayectoria.

### 1.3 ElectricityMap
**URL:** https://www.electricitymap.com/  
**Tipo:** Dashboard en tiempo real de electricidad por país  
**Features verificadas:**
- ✅ App móvil
- ❌ Mapa mundial (no accesible sin API key)
- ❌ Datos en tiempo real (requiere API key)
- ❌ Comparativa de precios entre países

**Lecciones para SEF:** El mapa mundial con código de carbono ya está parcialmente implementado (KPI de intensidad CO2). La API de ElectricityMap requiere key pero los datos públicos de España están disponibles.

### 1.4 National Grid ESO (Reino Unido)
**URL:** https://www.nationalgrideso.com/  
**Tipo:** Monitor del sistema eléctrico nacional  
**Features verificadas:**
- ❌ Dashboard en tiempo real (redirige a otra sección)

**Lecciones para SEF:** El concepto de "días sin carbón" como indicador prominente ya existe en SEF. Las alertas de eventos extremos (ENS, LOLE, precios altos) son un patrón que podría implementarse en la trayectoria.

### 1.5 NREL SAM (System Advisor Model)
**Tipo:** Simulador de energía renovable profesional  
**Features relevantes:**
- Análisis financiero (LCOE, NPV, IRR)
- Análisis de degradación de baterías
- Escenarios climáticos históricos
- Análisis de riesgo
- Informes PDF profesionales

**Lecciones para SEF:** El análisis LCOE/LCOS por tecnología y la visualización de degradación de baterías son features que podrían añadirse a SEF con cálculo a partir de datos existentes.

### 1.6 EU Energy Flex App
**Tipo:** Dashboard de flexibilidad energética (Comisión Europea)  
**Features relevantes:**
- Perfiles de demanda flexibles
- Visualización de curvas de carga
- Análisis de flexibilidad sectorial
- Ventanas de oportunidad para carga flexible

**Lecciones para SEF:** Las curvas de flexibilidad y ventanas de oportunidad son un concepto directamente aplicable a SEF, ya que tiene datos de VE, H₂, bombeo y baterías.

### 1.7 ESM / OSeMOSYS
**Tipo:** Modelado de sistemas energéticos open-source  
**Features relevantes:**
- Análisis de sensibilidad tornado
- Optimización multi-objetivo
- Mapas de calor de flujos
- Análisis de incertidumbre

**Lecciones para SEF:** El análisis de sensibilidad tornado es una herramienta profesional que podría implementarse como mejora de alto impacto.

### 1.8 PyPSA (Python for Power System Analysis)
**Tipo:** Simulador de redes eléctricas  
**Features relevantes:**
- Optimización de despacho con restricciones de red
- Análisis de inversión
- Integración de datos reales de ENTSO-E
- Análisis de confiabilidad (LOLE, ENS)

**Lecciones para SEF:** Ya tiene LOLE y ENS calculados. La integración ENTSO-E para datos reales de interconexiones sería una mejora valiosa.

---

## 2. Tendencias 2025-2026 en dashboards energéticos

### 2.1 Visualización de datos
- **Heatmaps temporales:** Mapas de calor mes x hora para patrones de generación/demanda/vertidos (cada vez más comunes en dashboards modernos)
- **Curvas de flexibilidad:** Visualización de ventanas de oportunidad para carga flexible (Energy Flex App)
- **Barras de capacidad instalada:** Evolución de capacidad (no solo generación) a lo largo del tiempo (Ember, IEA)
- **Gráficos de tornado:** Análisis de sensibilidad profesional (ESM, PyPSA)
- **Semáforos de cumplimiento:** Indicadores visuales verde/amarillo/rojo para objetivos regulatorios (PNIEC, UE)

### 2.2 Interacción
- **Sliders en tiempo real:** Ajuste de parámetros con efecto inmediato en KPIs (Energy-Charts.info, dashboards modernos)
- **Exportación PDF profesional:** @media print dedicado sin dependencias externas (NREL SAM, IEA)
- **Alertas de eventos extremos:** Badges en líneas temporales para años críticos (National Grid ESO)
- **Comparativas internacionales:** Barras apiladas por país (Ember, Energy-Charts)

### 2.3 Análisis avanzado
- **LCOE/LCOS por tecnología:** Coste nivelado calculado a partir de datos del simulador (NREL SAM, IEA)
- **Degradación de almacenamiento:** Visualización de degradación acumulada de baterías (NREL SAM)
- **Análisis de sensibilidad:** Identificación de parámetros más influyentes (ESM, PyPSA)
- **Simulación Monte Carlo:** Bandas de confianza y percentiles (NREL SAM) — ya implementado en SEF

---

## 3. Mejoras completadas que necesitan refinamiento

### Mejora #16: Dashboard Monte Carlo
**Estado:** ✅ Completada (1 de junio 2026)  
**Refinamiento posible:** 
- Añadir exportación de resultados Monte Carlo en CSV
- Permitir guardar/load de semillas personalizadas
- Añadir gráfico de amplitud de incertidumbre por KPI (no solo banda)
- Comparar amplitud entre escenarios

### Mejora #12: API REE en tiempo real
**Estado:** ✅ Completada (31 de mayo 2026)  
**Refinamiento posible:**
- Los datos de generación/demanda en tiempo real de ESIOS/REE están bloqueados por CORS
- Solo gas TTF y CO2 ETS funcionan (Yahoo Finance)
- Podría implementarse un proxy backend simple para datos REE

---

## 4. Resumen de FASE 4

**Nuevas ideas añadidas al plan:** 14 (mejoras #17 a #30)

**Distribución por dificultad:**
- 🔵 Baja: 4 (#20, #21, #22, #23)
- 🟡 Media: 8 (#17, #18, #24, #25, #26, #28, #29, #30)
- 🔴 Alta: 2 (#19, #27)

**Prioridad de implementación recomendada:**
1. #21 Offshore slider (🔵 Baja, backend listo)
2. #22 Semáforo PNIEC (🔵 Baja, función existente)
3. #23 Degradación baterías (🔵 Baja, backend listo)
4. #20 Exportar PDF (🔵 Baja, solo CSS)
5. #17 Comparativa internacional (🟡 Media, alto impacto visual)
6. #24 Comparativa nuclear (🟡 Media, tema político actual)
7. #18 Curvas flexibilidad (🟡 Media, narrativa descarbonización)
8. #25 Evolución capacidad (🟡 Media, complemento trayectoria)
9. #26 Alertas extremos (🟡 Media, interpretación trayectoria)
10. #28 REE enriquecido (🟡 Media, complementa tab REE)
11. #29 LCOE/LCOS (🟡 Media, análisis financiero)
12. #30 Heatmap vertidos (🟡 Media, visualización potente)
13. #19 Análisis sensibilidad (🔴 Alta, herramienta clave)
14. #27 Modo "qué pasaría si" (🔴 Alta, interactividad premium)

**Fuentes investigadas:** Ember, Energy-Charts.info, ElectricityMap, National Grid ESO, NREL SAM, EU Energy Flex App, ESM/OSeMOSYS, PyPSA
