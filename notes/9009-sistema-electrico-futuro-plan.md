# FASE 2 — Plan Maestro: Sistema Eléctrico Futuro v3.4+

**Proyecto:** Sistema Eléctrico Futuro 2026-2035  
**Autor:** David Antizar (Ntizar)  
**Fecha:** 31 de mayo de 2026 (FASE 4 — Reaprendizaje: 1 de junio de 2026)  
**Versión objetivo:** v3.6 (enriquecida FASE 4)

---

## Resumen FASE 4 (1 de junio 2026)

Se han investigado 8 fuentes externas: Ember, Energy-Charts.info, ElectricityMap, National Grid ESO, NREL SAM, EU Energy Flex App, ESM/OSeMOSYS, PyPSA. Se han identificado 14 nuevas mejoras (#17-#30), elevando el plan de 16 a 30 mejoras totales. Nuevas tendencias: heatmaps temporales, curvas de flexibilidad, análisis de sensibilidad tornado, exportación PDF, comparativa internacional, LCOE/LCOS, alertas de eventos extremos, degradación de baterías.

---

## Resumen

Plan de mejoras priorizadas de menor a mayor dificultad. Cada mejora es atómica: implementable en una única ejecución de cron. Cada entrada incluye descripción, archivos afectados, dificultad y criterios de verificación.

**Resumen FASE 4 (1 de junio 2026):** 30 mejoras totales (17 completadas + 13 nuevas pendientes). Nuevas ideas basadas en investigación de Ember, Energy-Charts.info, ElectricityMap, EU Energy Flex App, NREL SAM, ESM/OSeMOSYS, PyPSA, National Grid ESO.

**Código de dificultad:**
- 🔵 **Baja** — 1-2 archivos, < 50 líneas, riesgo mínimo
- 🟡 **Media** — 3-5 archivos, 50-200 líneas, riesgo medio
- 🔴 **Alta** — 5+ archivos, > 200 líneas, riesgo alto

---

## Tabla de mejoras priorizadas

|| # | Mejora | Descripción | Archivos afectados | Dificultad | Verificación |
||---|--------|-------------|-------------------|------------|--------------|
|| 1 | Crear package.json + scripts | Incluir dependencias (vue, plotly), scripts de dev y build | package.json | 🔵 Baja | `npm install` funciona, `npm run dev` levanta servidor | ✅ hecha (30/05/2026) |
|| 2 | Exportación de resultados CSV | Botón en dashboard para descargar resultados en CSV | app.js, charts.js | 🔵 Baja | Se descarga un CSV con columnas: hora, demanda, nuclear, solar, eólica, gas, precio, emisiones | ✅ hecha (30/05/2026) |
|| 3 | Indicador de intensidad de carbono | KPI nuevo: gCO2/kWh en el dashboard hero | simulator.js, app.js, app.css | 🔵 Baja | Aparece nuevo KPI en hero con valor gCO2/kWh, color cambia según nivel | ✅ hecha (30/05/2026) |
|| 4 | Tooltips mejorados en gráficos | Añadir más información contextual en hover de gráficos Plotly | charts.js | 🔵 Baja | Al pasar el ratón sobre gráficos aparecen tooltips con datos adicionales | ✅ hecha (31/05/2026) |
|| 5 | Modo presentación | Pantalla completa con KPIs grandes para presentaciones | index.html, app.js, app.css | 🟡 Media | Tecla P activa modo presentación con KPIs grandes y gráficos centrados | ✅ hecha (31/05/2026) |
|| 6 | Mini sparklines en KPIs | Mostrar mini gráfico de tendencia en cada tarjeta KPI del dashboard | app.js, charts.js, app.css | 🟡 Media | Cada KPI card muestra un mini gráfico de líneas de las últimas 7 horas | ✅ hecha (31/05/2026) |
|| 10 | Microanimaciones de transición | Transiciones suaves al cambiar entre escenarios y tabs | app.css, ntizar.css | 🔵 Baja | Al cambiar de escenario o tab, las transiciones son suaves (220ms) | ✅ hecha (31/05/2026) |
|| 7 | Comparación lado a lado | Dos paneles simultáneos para comparar escenarios | app.js, simulator.js, charts.js, app.css | 🟡 Media | Activando modo comparación, aparecen dos dashboards lado a lado | ✅ hecha (31/05/2026) |
|| 8 | Selector de fecha REE | Permitir elegir cualquier fecha de 2025 para datos REE | ree-data.js, app.js, ree-data.css | 🟡 Media | Selector de fecha muestra datos REE correspondientes a esa fecha | ✅ hecha (31/05/2026) |
|| 9 | Gráfico de sankey | Flujos de energía entre tecnologías y sectores | charts.js, simulator.js | 🟡 Media | Nueva sección con gráfico sankey mostrando flujos | ✅ hecha (31/05/2026) |
|| 11 | Service Worker offline | Caché de la aplicación para funcionamiento sin conexión | sw.js, index.html, app.css | 🔴 Alta | La app funciona sin conexión, datos de última simulación se mantienen | ✅ hecha (31/05/2026) |
|| 12 | API REE en tiempo real | Fetch a datos reales de Esios/REE con caché | ree-data.js, app.js, index.html | 🔴 Alta | Datos REE se actualizan automáticamente, con indicador de última actualización | ✅ hecha (31/05/2026) |
|| 13 | Motor headless ESM | Ejecutable en Node.js para tests y análisis | simulator.js, constants.js, weather.js, demand.js, storage.js, policy.js, nuclear.js, trajectory.js, montecarlo.js | 🔴 Alta | Se puede hacer `node motor.mjs --scenario=1` y obtener resultados JSON | ✅ hecha (31/05/2026) |
|| 14 | Tests automatizados Vitest | Validación de calibración 2025 + tests unitarios | package.json, vitest.config.js, tests/ | 🔴 Alta | `npm test` pasa todos los tests (117/117) | ✅ hecha (31/05/2026) |
|| 15 | GitHub Actions CI | Lint + tests + deploy automático a Pages | .github/workflows/ | 🔴 Alta | Cada push a main ejecuta lint, tests y despliega a GitHub Pages | ✅ hecha (31/05/2026) |
||| 16 | Dashboard Monte Carlo | Tab Incertidumbre con simulación multi-semilla, tabla de percentiles P5/P50/P95, gráficos de banda de confianza y amplitud de incertidumbre | app.js, charts.js, index.html, app.css | 🟡 Media | Tab "Incertidumbre" con ejecutor Monte Carlo, tabla de percentiles y gráficos de bandas | ✅ hecha (01/06/2026)
||| 17 | Panel comparación internacional España vs Europa | Nueva tab con comparativa España vs Alemania, Francia, UK, Portugal en barras apiladas (capacidad, intensidad CO2, precio, renovable) | app.js, charts.js, index.html, ree-data.js, app.css | 🟡 Media | Nueva tab con barras comparativas por país | ⏳ pendiente
||| 17b | Paradas de recarga nuclear escalonadas | Simular paradas reales de los 7 reactores (~30 días cada 18 meses, escalonados). Capacidad nuclear varía horariamente. KPI "Paradas nuclear" en critical cards. | nuclear.js, simulator.js, app.js | 🔵 Baja | KPI visible en dashboard, simulación horaria, 117/117 tests | ✅ hecha (01/06/2026)
||| 18 | Curvas de flexibilidad y ventanas de oportunidad | Histograma de horas por rango de precio coloreado por tecnología flexible + curva de flexibilidad. Inspirado en EU Energy Flex App | app.js, charts.js, simulator.js, index.html, app.css | 🟡 Media | Nuevo gráfico de flexibilidad en tab Análisis | ⏳ pendiente
||| 19 | Análisis de sensibilidad tornado | Gráfico de tornado con barras horizontales ordenadas por magnitud de efecto. Variar ±20% cada parámetro y medir impacto en KPI. Inspirado en ESM/OSeMOSYS | app.js, charts.js, simulator.js, index.html, app.css, montecarlo.js | 🔴 Alta | Gráfico de tornado con barras horizontales | ⏳ pendiente
||| 20 | Exportar informes en PDF con @media print | CSS @media print dedicado para generar informes profesionales al imprimir (Ctrl+P). Incluir título, KPIs, gráficos, metadatos. Sin dependencias externas | app.css, index.html | 🔵 Baja | Ctrl+P genera PDF con layout profesional | ✅ hecha (01/06/2026)
||| 21 | Activar eólica offshore con slider dedicado | Slider para capacidad offshore GW con datos de proyectos reales (Galicia Offshore 1.5 GW, Cantábrico Offshore 1.5 GW). Backend ya implementado | app.js, scenarios.js, index.html, charts.js, ree-data.js | 🔵 Baja | Nuevo slider en tab Modelo, Sankey actualizado con flujo offshore | ⏳ pendiente
||| 22 | Semáforo de cumplimiento PNIEC | La función verificarCumplimientoPNIEC() existe pero no se usa. Crear semáforo visual verde/amarillo/rojo por objetivo PNIEC 2030 | app.js, ree-data.js, index.html, app.css | 🔵 Baja | Semáforo con 3 estados por objetivo PNIEC | ⏳ pendiente
||| 23 | Indicador degradación baterías acumulada | Mostrar KPI de degradación % acumulada en trayectorias. Backend implementado (2%/365 ciclos + 1.5%/año) | app.js, charts.js, storage.js, index.html, app.css | 🔵 Baja | KPI degradación % en trayectorias + gráfico descendente | ⏳ pendiente
||| 24 | Vista comparativa cierre vs prórroga nuclear | Vista dedicada comparando escenarios cierre (3, 8) vs prórroga (2, 9) en precio, emisiones, ENS, vertidos, gas | app.js, charts.js, index.html, app.css | 🟡 Media | Vista dedicada con KPIs diferencia y barras comparativas | ⏳ pendiente
||| 25 | Gráfico evolución capacidad instalada 2026-2035 | Barras apiladas mostrando evolución de capacidad instalada por tecnología a lo largo de la trayectoria. Complemento a trayectoria de generación | app.js, charts.js, trajectory.js, index.html, app.css | 🟡 Media | Nuevo gráfico en tab Trayectoria con barras apiladas | ⏳ pendiente
||| 26 | Alertas de eventos extremos en trayectoria | Badges en años con ENS > 0, LOLE > umbral, precio > 200 €/MWh, renovables < 40%. Inspirado en National Grid ESO alerts | app.js, charts.js, trajectory.js, app.css | 🟡 Media | Badges de alerta en línea temporal de trayectoria | ⏳ pendiente
||| 27 | Modo "qué pasaría si" con sliders en tiempo real | Sliders de parámetros clave (gas, CO2, demanda) con efecto inmediato en KPIs sin simulación completa. Inspirado en Energy-Charts.info | app.js, simulator.js, index.html, app.css | 🔴 Alta | Sliders en tiempo real, KPIs se actualizan instantáneamente | ⏳ pendiente
||| 28 | Panel REE enriquecido con generación horaria | Nuevo gráfico de generación horaria por tecnología en tab REE (inspirado en Energy-Charts.info 24h). Datos de interconexiones si disponibles | app.js, charts.js, ree-data.js, index.html, app.css | 🟡 Media | Nuevo gráfico 24h en tab REE con tecnologías | ⏳ pendiente
||| 29 | Comparativa LCOE/LCOS por tecnología | Tabla y gráfico de barras comparando coste nivelado por tecnología. Calcular a partir de datos del simulador. Inspirado en NREL SAM | app.js, charts.js, simulator.js, index.html, app.css | 🟡 Media | Tabla LCOE/LCOS + gráfico de barras | ⏳ pendiente
||| 30 | Visualización vertidos con heatmap horario | Mapa de calor 12x24 (mes x hora) mostrando intensidad de vertido. Complemento visual al KPI de vertidos | app.js, charts.js, simulator.js, index.html, app.css | 🟡 Media | Heatmap 12x24 en tab Análisis con tooltip | ⏳ pendiente


---

## Detalle de cada mejora

### Mejora 1: Crear package.json + scripts ✅
**Dificultad:** 🔵 Baja  
**Archivos afectados:** package.json (nuevo), vite.config.js (nuevo)  
**Descripción:** Crear package.json con dependencias de desarrollo (vite, vitest) y producción (vue, plotly). Incluir scripts: dev, build, test, preview. Esto permite instalar dependencias, ejecutar tests y hacer build sin necesidad de CDN.
**Completada:** 30 de mayo de 2026

**Pasos:**
1. Crear package.json con scripts dev/preview/build
2. Añadir dependencias: vue@3, plotly.js-dist-min
3. Añadir dependencias de desarrollo: vite, vitest, @vitest/browser
4. Verificar que `npm install` y `npm run dev` funcionan

**Verificación:**
- `npm install` termina sin errores
- `npm run dev` levanta servidor en puerto 5173
- La app funciona igual que con CDN

---

### Mejora 2: Exportación de resultados CSV
**Dificultad:** 🔵 Baja  
**Archivos afectados:** index.html, app.js  
**Descripción:** Añadir botón "Exportar CSV" en la barra de acciones del dashboard que descarga un archivo con los datos horarios de la simulación actual: hora, demanda, nuclear, solar, eólica, gas, precio, emisiones.
**Completada:** 30 de mayo de 2026

**Pasos:**
1. Añadir botón "Exportar CSV" en app-main__actions del index.html
2. Implementar función exportarCSV() en app.js que genera CSV desde mixSimulado + preciosSimulados
3. Disparar descarga con Blob + URL.createObjectURL
4. Botón deshabilitado si no hay simulación ejecutada

**Verificación:**
- Botón visible en dashboard junto a "Vista semanal/anual"
- Archivo descargado con nombre `simulacion_YYYY-MM-DD.csv`
- CSV con 8760 filas y columnas correctas
- Se abre correctamente en Excel/Sheets

---

### Mejora 3: Indicador de intensidad de carbono ✅
**Dificultad:** 🔵 Baja  
**Archivos afectados:** simulator.js, app.js  
**Descripción:** Calcular e mostrar intensidad de carbono horaria (gCO2/kWh) como nuevo KPI en el dashboard hero. Se calcula como: (emisiones_totales * 10^12) / (demanda_total_GWh * 10^6). Color dinámico: verde < 100, neutral 100-200, naranja 200-300, rojo > 300.
**Completada:** 30 de mayo de 2026

**Pasos:**
1. Calcular intensidadCarbona en simulator.js tras el cálculo de coberturaRenovable
2. Añadir 'intensidadCarbona' a RESULT_KEYS en app.js
3. Añadir intensidadCarbona: 0 a emptyResults()
4. Crear función intensidadCarbonaTone(value) con umbrales <100/200/300
5. Añadir nuevo KPI en summaryStats computed
6. Verificar valor razonable (~145 gCO2/kWh para España)

**Verificación:**
- Nuevo KPI "Intensidad CO2" en hero con valor gCO2/kWh
- Color cambia según nivel (verde/neutral/naranja/rojo)
- Valor razonable (~145 gCO2/kWh para España con 36 Mt / 248 TWh)
- Commit fdd0a58 pushado a main

---

### Mejora 4: Tooltips mejorados en gráficos ✅
**Dificultad:** 🔵 Baja  
**Archivos afectados:** charts.js  
**Descripción:** Mejorar los tooltips de Plotly añadiendo información contextual: porcentaje de cada tecnología sobre el total en gráficos de mix, precio medio semanal y horas de precio negativo/alto en gráficos de precios, porcentaje de cada tecnología sobre demanda en gráficos mensuales, objetivos PNIEC en el heatmap.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Crear función totalStackY() para calcular totales de pila
2. Crear función pctTrace() con hovertemplate que incluye %{customdata:.1f}% del total
3. Actualizar plotMixSemanal para usar pctTrace con porcentajes
4. Mejorar plotPreciosSemana: añadir media semanal, horas negativas, horas alto precio
5. Mejorar plotPreciosDuracion: añadir precio ponderado, horas negativas, horas alto
6. Mejorar plotPreciosHistograma: añadir % del total por rango
7. Mejorar plotMensual: añadir % de cada tecnología sobre demanda
8. Mejorar plotTrajectoryPNIEC: añadir objetivos PNIEC 2030 en tooltip del heatmap

**Verificación:**
- Tooltips muestran porcentaje de cada tecnología sobre total en gráficos de mix
- Tooltips de precios muestran media, horas negativas y horas alto precio
- Histograma muestra % del total por rango
- Gráfico mensual muestra % de cada tecnología sobre demanda
- Heatmap PNIEC muestra objetivos 2030 de referencia
- No se rompe el layout

---

### Mejora 5: Modo presentación ✅
**Dificultad:** 🟡 Media  
**Archivos afectados:** index.html, app.js, app.css  
**Descripción:** Añadir modo presentación (tecla P) que muestra los KPIs principales en grande, centrados, con gráficos en ancho completo. Ideal para presentaciones y reuniones.
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Añadir 137 líneas de CSS en app.css para .presentation-mode (KPIs 2.8rem, sidebar oculto, hero expandido, indicadores fijos)
2. Añadir estado modoPresentacion en app.js (ref boolean)
3. Añadir función togglePresentacion() que alterna clase presentation-mode en body
4. Añadir event listener keydown para P (toggle) y Escape (salir) en onMounted
5. Añadir botón "Modo presentación" en app-main__actions con clase dinámica
6. Añadir indicadores fijos (badge superior derecho + hint inferior central)
7. Botón cambia a nz-btn--brand-mix cuando está activo

**Verificación:**
- Tecla P activa/desactiva modo presentación (ignora inputs/textarea/selects)
- KPIs se muestran a 2.8rem con peso 900
- Sidebar se oculta completamente con !important
- Hero se expande a 3.5rem, grid a una columna
- Gráficos crecen (xl: 520px, lg: 440px, md: 360px)
- Badge "MODO PRESENTACIÓN" aparece arriba derecha con gradiente brand
- Hint "Pulsa ESC para salir" aparece abajo centro
- Tecla Escape cierra modo presentación
- Botón cambia a brand-mix cuando está activo
- Commit fd0665a pushado a main

---

### Mejora 6: Mini sparklines en KPIs ✅
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, app.css  
**Descripción:** Añadir mini gráficos de líneas (sparklines) en cada tarjeta KPI del dashboard que muestren la evolución de la métrica durante las últimas 7 horas de simulación.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Crear función renderSparkline() en charts.js con Plotly mini-gráfico (sin ejes, spline suave, fill tozeroy)
2. Crear función extraerSparklineData() en app.js que calcula las últimas 7 horas para cada métrica
3. Crear función renderizarSparklines() en app.js que renderiza sparklines en hero KPIs y critical cards
4. Añadir contenedores .sparkline-container en index.html (hero KPIs + critical cards)
5. Añadir CSS para sparkline-container con altura 28px, opacidad 0.85, hover a 1.0
6. Integrar en renderizarGraficos() para refrescar tras cada simulación
7. Funciones getSparklineId() y getCriticalSparklineId() para mapeo labels → IDs

**Verificación:**
- Cada KPI card muestra un mini gráfico de líneas de las últimas 7 horas
- Sparklines con spline suave, fill semitransparente, sin ejes visibles
- Hero KPIs: precio (azul), renovable (verde), emisiones (rojo), CO2 (naranja), coste (azul)
- Critical cards: gas, vertidos, ENS, sin gas, importaciones, estrés, LOLE
- No interfiere con el diseño existente
- Commit a6cee8b pushado a main

---

### Mejora 10: Microanimaciones de transición ✅
**Dificultad:** 🔵 Baja  
**Archivos afectados:** app.css, js/app.js  
**Descripción:** Añadir transiciones suaves (220ms) al cambiar entre escenarios, tabs y vistas. Mejorar la sensación de fluidez de la aplicación. Incluye: transiciones en cards, tabs, botones, KPIs, métricas, tablas, selects, inputs, toggles, gráficos, loading. Animación de pulso en KPIs al cambiar valores.
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Añadir 130+ líneas de CSS transitions en app.css (cards, tabs, botones, KPIs, métricas, tablas, selects, inputs, toggles, gráficos, loading, trajectory)
2. Añadir watcher en app.js para detectar cambios en resultados y aplicar clase kpi-animate
3. Animación de pulso (scale 1.03) en KPIs al cambiar valor
4. Hover effects en scenario-cards y metric-pills
5. Focus rings en inputs y selects

**Verificación:**
- Cambio de escenario tiene transición suave (220ms ease)
- Tabs tienen efecto de activación animado con hover lift
- KPIs animan su cambio de valor con efecto pulse
- Botones tienen efecto press (scale 0.98)
- Scenario cards tienen hover lift
- Métricas tienen hover lift
- Tablas tienen hover row highlight
- Inputs y selects tienen focus ring brand
- Toggles tienen scale al activarse
- No se rompe el layout existente
- Commit 0661f8e pushado a main

---

### Mejora 7: Comparación lado a lado ✅
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, simulator.js, charts.js, app.css  
**Descripción:** Activar modo comparación donde se muestran dos escenarios simultáneamente lado a lado, con los mismos gráficos y KPIs, para comparar directamente.
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Añadir estado de comparación en app.js (modoComparacion, escenarioComparacion, mixComparacion, preciosComparacion)
2. Añadir funciones toggleComparacion(), seleccionarEscenarioComparacion(), cancelarComparacion()
3. Añadir propiedades computadas nombreEscenarioComparacion y comparacionResultados
4. Añadir función simularComparacion() que simula sin sobrescribir resultados principales
5. Envolver dashboard en condicional v-if/v-else para renderizar dos paneles
6. Añadir botón "Comparar" en barra de herramientas y selector de escenario secundario
7. CSS para layout de dos columnas con comparison-layout, comparison-panel
8. Cada panel usa las mismas plantillas Vue pero con datos diferentes (resultados vs comparacionResultados)

**Verificación:**
- Botón "Comparar" activa modo lado a lado
- Selector de escenario secundario permite elegir escenario a comparar
- Dos paneles con escenarios diferentes visibles simultáneamente
- Mismos gráficos y KPIs en ambos paneles
- Botón "Cancelar comparación" cierra el modo
- Template balance: 7 open, 7 close ✅
- Commit bf67945 pushado a main

---

### Mejora 8: Selector de fecha REE ✅
**Dificultad:** 🟡 Media  
**Archivos afectados:** index.html, app.js  
**Descripción:** En la pestaña Datos REE, añadir un selector de fecha que permita al usuario ver datos de cualquier día de 2025, no solo el resumen anual. Al seleccionar una fecha, se ejecuta la simulación con parámetros REE 2026 y se muestran gráficos horarios de generación por tecnología y precio eléctrico para ese día específico.
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Añadir input type="date" en la sección REE del index.html con v-model="fechaREE"
2. Añadir refs fechaREE, datosDiaREE y computed nombreDiaREE en app.js
3. Implementar simularDiaREE(): extrae parámetros REE 2026, ejecuta simulador, slicea 24h del día seleccionado
4. Implementar renderizarGraficoMixDia(): gráfico de pila Plotly con 7 tecnologías
5. Implementar renderizarGraficoPrecioDia(): gráfico de área con línea de media
6. Añadir watcher en fechaREE que dispara simularDiaREE() en nextTick
7. Añadir sección de gráficos horarios en HTML con v-if="fechaREE && datosDiaREE"
8. Exponer nuevas refs y funciones en el return de Vue

**Verificación:**
- Selector de fecha funcional en pestaña REE ✅
- Datos actualizados según fecha seleccionada ✅
- Gráficos horarios para la fecha elegida ✅
- Commit ad4f3c0 pushado a main ✅

---

### Mejora 9: Gráfico de sankey ✅
**Dificultad:** 🟡 Media  
**Archivos afectados:** charts.js, simulator.js, index.html, app.js  
**Descripción:** Añadir un gráfico de sankey que muestre los flujos de energía entre tecnologías de generación y sectores de demanda. Visualiza cómo la energía fluye desde las fuentes hasta los consumidores.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Añadir método `calcularFlujosSankey()` en simulator.js que suma generación por tecnología y demanda por sector
2. Almacenar `_ultimoMix` y `_ultimoDetalleDemanda` en el simulador tras la simulación
3. Implementar `plotSankey()` en charts.js con Plotly sankey (orientación horizontal, colores por tecnología)
4. Añadir sección en index.html dentro de la tab "Análisis" con canvas `plot-sankey`
5. Añadir variable `sankeyData` en app.js y calcularla en `setResults()`
6. Llamar a `SEF.Charts.plotSankey()` en `renderizarGraficos()`
7. Colores: tecnologías con colores del proyecto, sectores en gris suave

**Verificación:**
- Gráfico sankey visible en la tab "Análisis" ✅
- Flujos muestran proporciones correctas ✅
- Nodos: Nuclear, Solar FV, Eólica terrestre, Eólica marina, Hidráulica, Gas CCGT, Importaciones, Baterías, Bombeo, V2G → Residencial, Servicios, Industria, VE, Bombas de calor, H₂ flexible ✅
- Commit 1b70b8c pushado a main ✅

---

### Mejora 11: Service Worker offline ✅
**Dificultad:** 🔴 Alta  
**Archivos afectados:** sw.js (nuevo), index.html, app.js, app.css  
**Descripción:** Implementar service worker para cachear la aplicación y permitir funcionamiento sin conexión. Los datos de la última simulación se mantienen en localStorage. Incluye: caché de assets estáticos (HTML, CSS, JS), estrategia "cache first, network fallback", guardado de simulación en localStorage, indicador visual de estado online/offline, restauración automática de última simulación al recargar.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Crear sw.js con caché de assets estáticos (20+ archivos)
2. Estrategia: cache-first para assets, network-first con fallback para HTML
3. Registrar service worker en index.html con navigator.serviceWorker.register()
4. Añadir estado de conexión (isOnline, connectionVisible, simulationSavedVisible) en app.js
5. Función guardarSimulacionLocal() — serializa params + resultados + mix + precios a localStorage
6. Función cargarSimulacionLocal() — restaura desde localStorage al iniciar
7. Función actualizarEstadoConexion() — escucha eventos online/offline
8. Indicador visual de estado (badge superior derecho con punto verde/naranja)
9. Indicador de simulación guardada (badge inferior derecho con icono 💾)
10. CSS con estilo Aurora (glassmorphism, backdrop-filter, animaciones)
11. En modo presentación, ocultar indicadores de conexión

**Verificación:**
- sw.js registrado sin errores en consola ✅
- Assets estáticos cacheados al primer acceso ✅
- Indicador "En línea" / "Sin conexión" visible al cambiar estado ✅
- Simulación guardada en localStorage al cargar ✅
- Simulación restaurada automáticamente al recargar sin conexión ✅
- Badge "Simulación guardada localmente" aparece 3 segundos tras guardado ✅
- No se rompe el modo presentación ✅
- Commit 6b06c01 pushado a main ✅

---

### Mejora 12: API REE en tiempo real ✅
**Dificultad:** 🔴 Alta  
**Archivos afectados:** ree-data.js, app.js, index.html  
**Descripción:** Implementar fetch a Yahoo Finance (gas TTF, CO2 ETS) para obtener datos reales de mercado. Con caché local (TTL 1h) y fallback a datos estáticos de REE. La API de ESIOS requiere autenticación y no soporta CORS desde el navegador, por lo que se usa Yahoo Finance como fuente de datos de mercado.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Implementar caché en localStorage con TTL de 1 hora en ree-data.js
2. Implementar fetchYahooFinance() usando Yahoo Finance query1 API (sin API key)
3. Implementar construirDatosTiempoReal() que combina Yahoo Finance + datos estáticos REE
4. Implementar cargarDatosTiempoReal() con forceRefresh y cacheClear
5. Añadir IDs de indicadores ESIOS verificados (esios-indicators-correct skill)
6. Integrar en app.js: carga automática en onMounted con estado de carga
7. Añadir función reeActualizarDatos() para actualización manual
8. Añadir badge "En vivo" / "Actualizando..." en la UI
9. Añadir botón "Actualizar" en la sección REE
10. Añadir sección "Fuentes de datos en tiempo real" con tarjetas para gas TTF, CO2 ETS y estado
11. Actualizar callout de fuentes de datos

**Verificación:**
- Badge "En vivo" visible en pestaña REE ✅
- Botón "Actualizar" funcional con spinner de carga ✅
- Gas TTF y CO2 ETS se obtienen de Yahoo Finance ✅
- Caché local con TTL 1 hora ✅
- Fallback a datos estáticos si Yahoo Finance falla ✅
- Indicador "Cargando..." durante la petición ✅
- Commit 750b645 pushado a main ✅

---

### Mejora 13: Motor headless ESM ✅
**Dificultad:** 🔴 Alta  
**Archivos afectados:** motor.mjs (nuevo), package.json (scripts)  
**Descripción:** Crear `motor.mjs` — ejecutable Node.js ESM que carga los 9 módulos SEF en modo headless, exponiendo una CLI completa con soporte para escenarios predefinidos, parámetros personalizados, trayectorias multianuales, simulación Monte Carlo, filtrado de KPIs y salida JSON.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Crear motor.mjs con carga de módulos SEF vía new Function() (evita problemas de scope ESM)
2. Implementar parser de argumentos CLI (--scenario, --params, --anio, --semilla, --compacto, --kpi, --output, --trayectoria, --montecarlo)
3. Soportar entrada por parámetros CLI o archivo JSON
4. Salida en JSON a stdout o archivo (--output)
5. Mantener compatibilidad con versión navegador (los módulos SEF no se modifican)
6. Añadir scripts npm: motor, motor:help

**Verificación:**
- `node motor.mjs --scenario=1` produce resultados JSON ✅
- `node motor.mjs --scenario=5 --compacto` muestra resumen legible ✅
- `node motor.mjs --params params.json --output resultado.json` funciona ✅
- `node motor.mjs --scenario=1 --trayectoria` ejecuta trayectoria 2026-2035 ✅
- `node motor.mjs --scenario=1 --montecarlo` ejecuta Monte Carlo con 9 semillas ✅
- `node motor.mjs --scenario=1 --kpi=precioMedioPonderado,emisionesAnuales` filtra KPIs ✅
- `node motor.mjs --help` muestra ayuda completa ✅
- Resultados idénticos a versión navegador (verificación manual) ✅
- package.json incluye scripts motor y motor:help ✅
- Commit pushado a main ✅

---

### Mejora 14: Tests automatizados Vitest ✅
**Dificultad:** 🔴 Alta  
**Archivos afectados:** package.json, vitest.config.js, tests/  
**Descripción:** Implementar suite de tests con Vitest: tests de calibración contra datos 2025, tests unitarios de cada módulo, tests de trayectoria, tests de regresión para la trayectoria.  
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Configurar Vitest con vitest.config.js
2. Crear helper setup.js para cargar módulos SEF en Node.js (new Function pattern)
3. Tests de calibración: comparar resultados con datos REE 2025 (12 tests)
4. Tests unitarios: cada módulo (weather, demand, storage, policy, simulator) (27 tests)
5. Tests unitarios por módulo: Storage, Policy, Nuclear (38 tests)
6. Tests de trayectoria: verificar consistencia multianual (13 tests)
7. Tests de regresión: resultados reproducibles con misma semilla (27 tests)
8. Total: 117 tests, todos pasando

**Verificación:**
- `npm test` pasa 117/117 tests ✅
- Tests de calibración dentro de rangos aceptables ✅
- Resultados reproducibles con misma semilla ✅
- Tests de trayectoria verifican consistencia multianual ✅
- Tests de regresión verifican rangos físicos y determinismo ✅
- Commit pushado a main ✅

---

### Mejora 15: GitHub Actions CI ✅
**Dificultad:** 🔴 Alta  
**Archivos afectados:** .github/workflows/deploy.yml (nuevo), .eslintrc.json (nuevo)  
**Descripción:** Configurar pipeline CI con GitHub Actions: lint, tests, build y deploy automático a GitHub Pages en cada push a main. Incluye: job de lint+tests+build (lint-and-test), job de deploy a GitHub Pages (deploy) con dependencias, permisos de Pages y environment. Además se creó configuración ESLint (.eslintrc.json) y se corrigió función duplicada getSparklineId en app.js (bug preexistente).
**Completada:** 31 de mayo de 2026

**Pasos:**
1. Crear .github/workflows/deploy.yml con jobs lint-and-test y deploy
2. Configurar job de lint + tests + build (lint-and-test, ubuntu-latest)
3. Configurar job de build + deploy a Pages con permissions y environment
4. Crear .eslintrc.json con globals (SEF, Vue, Plotly, C) y reglas recomendadas
5. Corregir función duplicada getSparklineId en app.js (bug preexistente)
6. Verificar: 0 errores ESLint, 117/117 tests pasando, build HTML preexistente con warning

**Verificación:**
- Workflow deploy.yml creado con jobs lint-and-test y deploy ✅
- ESLint configurado con 0 errores, 15 warnings (variables no usadas) ✅
- Tests: 117/117 pasando ✅
- Commit 48d6652 pushado a main ✅
- Bug corregido: función getSparklineId duplicada en app.js eliminada ✅
- Nota: error de build HTML (parse5) es preexistente en index.html línea 536, no introducido por esta mejora

---

### Mejora 16: Dashboard Monte Carlo con percentiles P5/P50/P95
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, index.html, app.css  
**Descripción:** Nueva tab "Incertidumbre" con capacidad de ejecutar simulaciones Monte Carlo (múltiples semillas climáticas) directamente desde la UI. Muestra tabla de percentiles P5/P50/P95 para 8 KPIs principales, gráficos de banda de confianza con área P5-P95 y línea P50, y cálculo de amplitud de incertidumbre con código de colores (verde/ámbar/rojo). Selector de número de semillas (5, 9, 15, 25, 50) con barra de progreso.  
**Completada:** 1 de junio de 2026

**Pasos:**
1. Añadir tab "Incertidumbre" a MAIN_TABS en app.js
2. Añadir estado Monte Carlo (monteCarloEjecutando, monteCarloProgreso, monteCarloN, monteCarloResultados)
3. Implementar ejecutarMonteCarlo(): bucle con semillas determinísticas, barra de progreso, cálculo de percentiles
4. Añadir funciones auxiliares fmt(), mcAmplitud(), mcRangoClass()
5. Implementar plotMonteCarloBar() y plotMonteCarloBand() en charts.js
6. Implementar renderizarMonteCarlo() para renderizar gráficos al cambiar tab
7. Añadir HTML con tabla de percentiles, selector de semillas, barra de progreso, 4 gráficos de banda
8. Añadir CSS para progress bar, amplitud con colores, responsive

**Verificación:**
- Tab "Incertidumbre" visible en navegación principal ✅
- Botón "Ejecutar Monte Carlo" funcional con selector de semillas ✅
- Barra de progreso visible durante ejecución ✅
- Tabla con 8 KPIs y columnas P5/P50/P95/Rango/Amplitud ✅
- 4 gráficos de banda de confianza (precio, emisiones, renovable, gas) ✅
- Amplitud coloreada: verde <15%, ámbar 15-30%, rojo >30% ✅
- 117/117 tests pasando ✅
- JS válido (node --check) ✅
- Commit 88eeb7f pushado a main ✅

---

### Mejora 17: Panel de comparación internacional España vs Europa
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, index.html, ree-data.js, app.css  
**Descripción:** Añadir una nueva tab o sección que compare los resultados del escenario actual con datos reales de otros países europeos (Alemania, Francia, Reino Unido, Portugal). Mostrar capacidad instalada por tecnología, intensidad de carbono, precio medio, proporción renovable. Inspirado en Ember Global Electricity Review y Energy-Charts.info comparativa internacional.  
**Completada:** pendiente

**Pasos:**
1. Añadir datos de referencia de países (capacidad, generación, precio, CO2) en ree-data.js
2. Crear función compararPaises() en app.js que genera datos comparativos
3. Implementar plotComparacionPaises() en charts.js con barras apiladas por país
4. Añadir tab "Comparativa Europa" en index.html con contenedores de gráficos
5. CSS para layout de tarjetas comparativas por país

**Verificación:**
- Nueva tab con comparativa España vs Alemania vs Francia vs UK vs Portugal
- Barras apiladas por tecnología y métricas individuales
- Tooltips con datos detallados por país
- No se rompe el layout existente

---

### Mejora 18: Curvas de flexibilidad y ventanas de oportunidad
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, simulator.js, index.html, app.css  
**Descripción:** Visualizar ventanas de oportunidad para carga flexible (VE, H₂, bombeo, baterías) en función del precio horario. Mostrar histograma de horas por rango de precio coloreado por tecnología flexible, y curva de flexibilidad con capacidad disponible por rango de precio. Inspirado en EU Energy Flex App.  
**Completada:** pendiente

**Pasos:**
1. Implementar calcularVentanasFlexibilidad() en simulator.js
2. Implementar plotCurvaFlexibilidad() en charts.js con histograma + curva
3. Añadir sección en tab "Análisis" con canvas para gráficos de flexibilidad
4. Mostrar horas de precio negativo, bajo (<30 €/MWh), alto (>100 €/MWh)
5. Indicador de "horas de vertido absorbibles con flexibilidad"

**Verificación:**
- Histograma de horas por rango de precio coloreado por tecnología
- Curva de flexibilidad con capacidad disponible
- Contadores de horas negativas, bajas, altas
- No se rompe el layout existente

---

### Mejora 19: Análisis de sensibilidad tornado
**Dificultad:** 🔴 Alta  
**Archivos afectados:** app.js, charts.js, simulator.js, index.html, app.css, montecarlo.js  
**Descripción:** Implementar análisis de sensibilidad que identifique qué parámetros del escenario más influyen en cada KPI. Visualizar con gráfico de tornado (barras horizontales ordenadas por magnitud de efecto). Inspirado en ESM/OSeMOSYS y PyPSA.  
**Completada:** pendiente

**Pasos:**
1. Implementar analizarSensibilidad() en simulator.js: variar ±20% cada parámetro, ejecutar simulación, medir cambio en KPI
2. Implementar plotTornado() en charts.js con Plotly barras horizontales (rojo/azul)
3. Selector de KPI objetivo (precio, emisiones, ENS, vertidos, renovable)
4. Añadir tab o sub-sección en "Análisis" con controles y gráfico
5. Soporte para análisis global (variar múltiples parámetros simultáneamente)

**Verificación:**
- Gráfico de tornado con barras horizontales ordenadas
- Selector de KPI objetivo funcional
- Valores razonables (parámetros más sensibles = barras más largas)
- No se rompe el layout existente

---

### Mejora 20: Exportar informes en PDF con @media print
**Dificultad:** 🔵 Baja  
**Archivos afectados:** app.css, index.html, js/app.js  
**Descripción:** CSS @media print dedicado para generar informes profesionales al imprimir (Ctrl+P). Incluir título, KPIs, gráficos, metadatos. Sin dependencias externas.
**Completada:** 1 de junio de 2026

**Pasos:**
1. Añadir función `imprimirInforme()` en app.js que llama a `window.print()` con validación de datos
2. Añadir botón "Imprimir" en la barra de acciones del index.html junto a "Exportar CSV"
3. Añadir `fechaInforme` como computed property en app.js (fecha/hora formateada en español)
4. Añadir footer del informe en index.html con metadatos (solo visible en impresión)
5. Añadir `@media print` completo en app.css (259 líneas):
   - `@page` con tamaño A4 y márgenes
   - Ocultar UI no relevante (sidebar, botones, controles, sparklines, badges)
   - Reformat KPIs en grid compacto de tabla
   - Reformat critical cards en grid 3 columnas
   - Simplificar gráficos Plotly (sin modebar, sin hover)
   - Asegurar page-break-inside: avoid en cards y gráficos
   - Forzar colores de contraste para impresión monocromática
   - Forzar fondo blanco incluso en tema oscuro
6. Añadir `imprimirInforme` y `fechaInforme` al return de Vue

**Verificación:**
- Botón "Imprimir" visible junto a "Exportar CSV" ✅
- Botón deshabilitado si no hay simulación ✅
- `@media print` con 259 líneas de CSS profesional ✅
- KPIs se reorganizan en grid compacto al imprimir ✅
- Gráficos Plotly se imprimen sin modebar ni hover ✅
- Footer del informe muestra metadatos (fecha, escenario, semilla) ✅
- 1683 líneas app.js, 226/226 braces CSS ✅
- Commit 5d14389 pushado a main ✅

---

### Mejora 21: Activar eólica offshore con slider dedicado
**Dificultad:** 🔵 Baja  
**Archivos afectados:** app.js, scenarios.js, index.html, charts.js, ree-data.js  
**Descripción:** El offshore está implementado en el motor (capacidad, generación, FC 43%) pero sin control UI. Crear slider para capacidad offshore GW con datos de proyectos reales (Galicia Offshore 1.5 GW, Cantábrico Offshore 1.5 GW). Actualizar Sankey y PNIEC.  
**Completada:** pendiente

**Pasos:**
1. Añadir slider en tab "Modelo" para eolicaOffshore (GW) con rango 0-15
2. Mostrar proyectos reales como referencias visuales (barras de progreso)
3. Actualizar gráfico Sankey para incluir flujo offshore
4. Actualizar tabla de PNIEC con objetivo offshore (3 GW 2030)
5. Añadir datos de proyectos en pestaña REE

**Verificación:**
- Nuevo slider en tab Modelo funcional
- Proyectos reales como referencias
- Sankey actualizado con flujo offshore
- PNIEC actualizado con objetivo offshore

---

### Mejora 22: Semáforo de cumplimiento PNIEC
**Dificultad:** 🔵 Baja  
**Archivos afectados:** app.js, ree-data.js, index.html, app.css  
**Descripción:** La función verificarCumplimientoPNIEC() existe pero no se usa en la UI. Crear un "semáforo" visual que muestre si cada objetivo PNIEC 2030 se cumple (verde), se acerca (amarillo) o se queda corto (rojo). Inspirado en dashboards de cumplimiento normativo.  
**Completada:** pendiente

**Pasos:**
1. Llamar a verificarCumplimientoPNIEC() en app.js tras simulación
2. Crear función renderizarSemforoPNIEC() que genera indicadores visuales
3. Añadir sección en tab PNIEC con semáforo por objetivo
4. CSS para indicadores verde/ámbar/rojo con iconos

**Verificación:**
- Semáforo con 3 estados por objetivo PNIEC
- Renovables, eficiencia, VE, H₂, almacenamiento
- Tooltips con valores actuales vs objetivo

---

### Mejora 23: Indicador degradación baterías acumulada
**Dificultad:** 🔵 Baja  
**Archivos afectados:** app.js, charts.js, storage.js, index.html, app.css  
**Descripción:** La degradación de baterías está implementada (2% por 365 ciclos + 1.5%/año calendario) pero sin visualización. Mostrar KPI de degradación acumulada en trayectorias multianuales con gráfico de línea descendente.  
**Completada:** pendiente

**Pasos:**
1. Calcular degradación acumulada en storage.js durante trayectoria
2. Exponer datos de degradación en resultados del simulador
3. Implementar plotDegradacionBaterias() en charts.js
4. Añadir KPI de degradación en tab Trayectoria
5. Gráfico de línea descendente con año en X y % en Y

**Verificación:**
- KPI de degradación % visible en trayectorias
- Gráfico de degradación descendente
- Valores razonables (degradación gradual)
- No se rompe el layout existente

---

### Mejora 24: Vista comparativa cierre vs prórroga nuclear
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, index.html, app.css  
**Descripción:** Crear una vista dedicada que compare directamente los escenarios de cierre nuclear (3, 8) vs prórroga nuclear (2, 9). Mostrar diferencias en precio, emisiones, ENS, vertidos, dependencia del gas. Inspirado en la comparación lado a lado existente pero enfocada en nuclear.  
**Completada:** pendiente

**Pasos:**
1. Añadir vista dedicada "Nuclear: Cierre vs Prórroga" en app.js
2. Simular escenarios 3+8 y 2+9 automáticamente
3. Implementar plotComparacionNuclear() en charts.js con barras diferencia
4. KPIs de diferencia: precio, emisiones, ENS, gas, renovables
5. CSS para layout de comparación nuclear

**Verificación:**
- Vista dedicada con comparativa nuclear
- KPIs de diferencia calculados correctamente
- Gráficos de barras comparativas
- Tema relevante para debate político actual

---

### Mejora 25: Gráfico evolución capacidad instalada 2026-2035
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, trajectory.js, index.html, app.css  
**Descripción:** Añadir un gráfico de barras apiladas mostrando la evolución de la capacidad instalada por tecnología a lo largo de la trayectoria 2026-2035. Mostrar cómo cambia el mix de capacidad (no solo generación) año a año. Complemento visual a la trayectoria de generación actual.  
**Completada:** pendiente

**Pasos:**
1. Calcular capacidad instalada por tecnología en trajectory.js
2. Implementar plotEvolucionCapacidad() en charts.js con barras apiladas
3. Añadir gráfico en tab Trayectoria
4. Eje X = años 2026-2035, Eje Y = GW, colores por tecnología
5. Tooltip con valores detallados por año y tecnología

**Verificación:**
- Nuevo gráfico en tab Trayectoria
- Barras apiladas por tecnología
- Evolución 2026-2035 visible
- Tooltips con valores detallados

---

### Mejora 26: Alertas de eventos extremos en trayectoria
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, trajectory.js, app.css  
**Descripción:** Detectar y marcar visualmente en la trayectoria eventos extremos: años con ENS > 0, años con LOLE > umbral, años con precio medio > 200 €/MWh, años con renovables < 40%. Mostrar como badges/iconos en la línea temporal. Inspirado en National Grid ESO alerts.  
**Completada:** pendiente

**Pasos:**
1. Detectar eventos extremos en trajectory.js durante simulación
2. Implementar renderizarAlertasTraectoria() en app.js
3. Añadir badges de alerta en línea temporal
4. Tooltip con detalles del evento
5. Leyenda de umbrales de alerta

**Verificación:**
- Badges de alerta en años con eventos extremos
- Tooltip con detalles del evento
- Leyenda de umbrales visible
- No se rompe el layout de trayectoria

---

### Mejora 27: Modo "qué pasaría si" con sliders en tiempo real
**Dificultad:** 🔴 Alta  
**Archivos afectados:** app.js, simulator.js, index.html, app.css  
**Descripción:** Permitir ajustar sliders de parámetros clave (precio gas, precio CO2, demanda industria) y ver el efecto inmediato en los KPIs principales sin ejecutar simulación completa. Inspirado en la interactividad de Energy-Charts.info y dashboards modernos de scenario planning.  
**Completada:** pendiente

**Pasos:**
1. Implementar simulación rápida aproximada en simulator.js (sin ciclo completo de 8760h)
2. Añadir sliders de parámetros clave en app.js
3. Conectar sliders con actualización de KPIs en tiempo real
4. Feedback visual de cambio (flechas arriba/abajo, colores)
5. CSS para sliders y feedback visual

**Verificación:**
- Sliders en tiempo real funcionales
- KPIs se actualizan instantáneamente
- Feedback visual de cambio (colores, flechas)
- No bloquea la UI durante la simulación

---

### Mejora 28: Panel REE enriquecido con generación horaria
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, ree-data.js, index.html, app.css  
**Descripción:** En la tab REE existente, añadir un gráfico de generación horaria por tecnología para el día seleccionado, inspirado en Energy-Charts.info vista 24h. Mostrar también datos de interconexiones (francia-españa) si están disponibles.  
**Completada:** pendiente

**Pasos:**
1. Añadir gráfico de generación horaria en tab REE (ya existe selector de fecha)
2. Implementar plotGeneracionHorariaREE() en charts.js con áreas apiladas
3. Añadir datos de interconexiones si disponibles
4. CSS para nuevo gráfico en layout existente
5. Integrar con selector de fecha existente

**Verificación:**
- Nuevo gráfico de generación horaria en tab REE
- Datos de interconexiones si disponibles
- Compatible con selector de fecha existente
- No se rompe el layout de tab REE

---

### Mejora 29: Comparativa LCOE/LCOS por tecnología
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, simulator.js, index.html, app.css  
**Descripción:** Añadir una tabla y gráfico de barras comparando el LCOE (Levelized Cost of Energy) y LCOS (Levelized Cost of Storage) de cada tecnología del escenario. Calcular a partir de datos del simulador (coste sistema, generación por tecnología, capacidad instalada). Inspirado en NREL SAM y IEA LCOE reports.  
**Completada:** pendiente

**Pasos:**
1. Calcular LCOE/LCOS por tecnología en simulator.js
2. Implementar plotLCOEComparativa() en charts.js con barras horizontales
3. Añadir sección en tab "Análisis" con tabla y gráfico
4. Valores razonables verificables contra datos IEA/NREL
5. Tooltip con desglose de costes

**Verificación:**
- Tabla LCOE/LCOS por tecnología visible
- Gráfico de barras comparativo
- Valores razonables (verificables contra IEA)
- No se rompe el layout existente

---

### Mejora 30: Visualización vertidos con heatmap horario
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, simulator.js, index.html, app.css  
**Descripción:** Crear un mapa de calor (heatmap) mostrando las horas de vertido (exceso de generación renovable sobre demanda) a lo largo del año. Eje X = mes, Eje Y = hora del día, Color = intensidad de vertido. Complemento visual al KPI de vertidos existente.  
**Completada:** pendiente

**Pasos:**
1. Calcular vertidos por hora en simulator.js
2. Implementar plotHeatmapVertidos() en charts.js con Plotly heatmap
3. Añadir sección en tab "Análisis" con canvas heatmap
4. Eje X = meses (12), Eje Y = horas (24), Color = intensidad
5. Tooltip con valores detallados por mes/hora

**Verificación:**
- Heatmap 12x24 visible en tab Análisis
- Colores de bajo a alto vertido
- Tooltip con valores detallados
- Patrones visibles (vertidos solares en verano, eólicos en noche)
