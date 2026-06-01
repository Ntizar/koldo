# FASE 2 — Plan Maestro: Sistema Eléctrico Futuro v3.4+

**Proyecto:** Sistema Eléctrico Futuro 2026-2035  
**Autor:** David Antizar (Ntizar)  
**Fecha:** 31 de mayo de 2026  
**Versión objetivo:** v3.5  

---

## Resumen

Plan de mejoras priorizadas de menor a mayor dificultad. Cada mejora es atómica: implementable en una única ejecución de cron. Cada entrada incluye descripción, archivos afectados, dificultad y criterios de verificación.

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
|| 16 | Dashboard Monte Carlo | Tab Incertidumbre con simulación multi-semilla, tabla de percentiles P5/P50/P95, gráficos de banda de confianza y amplitud de incertidumbre | app.js, charts.js, index.html, app.css | 🟡 Media | Tab "Incertidumbre" con ejecutor Monte Carlo, tabla de percentiles y gráficos de bandas | ⏳ pendiente

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
