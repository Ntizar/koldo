# FASE 2 — Plan Maestro: Sistema Eléctrico Futuro v3.4+

**Proyecto:** Sistema Eléctrico Futuro 2026-2035  
**Autor:** David Antizar (Ntizar)  
**Fecha:** 30 de mayo de 2026  
**Versión objetivo:** v3.4  

---

## Resumen

Plan de mejoras priorizadas de menor a mayor dificultad. Cada mejora es atómica: implementable en una única ejecución de cron. Cada entrada incluye descripción, archivos afectados, dificultad y criterios de verificación.

**Código de dificultad:**
- 🔵 **Baja** — 1-2 archivos, < 50 líneas, riesgo mínimo
- 🟡 **Media** — 3-5 archivos, 50-200 líneas, riesgo medio
- 🔴 **Alta** — 5+ archivos, > 200 líneas, riesgo alto

---

## Tabla de mejoras priorizadas

| # | Mejora | Descripción | Archivos afectados | Dificultad | Verificación |
|---|--------|-------------|-------------------|------------|--------------|
| 1 | Crear package.json + scripts | Incluir dependencias (vue, plotly), scripts de dev y build | package.json | 🔵 Baja | `npm install` funciona, `npm run dev` levanta servidor |
| 2 | Exportación de resultados CSV | Botón en dashboard para descargar resultados en CSV | app.js, charts.js | 🔵 Baja | Se descarga un CSV con columnas: hora, demanda, nuclear, solar, eólica, gas, precio, emisiones |
| 3 | Indicador de intensidad de carbono | KPI nuevo: gCO2/kWh en el dashboard hero | simulator.js, app.js, app.css | 🔵 Baja | Aparece nuevo KPI en hero con valor gCO2/kWh, color cambia según nivel |
| 4 | Tooltips mejorados en gráficos | Añadir más información contextual en hover de gráficos Plotly | charts.js | 🔵 Baja | Al pasar el ratón sobre gráficos aparecen tooltips con datos adicionales |
| 5 | Modo presentación | Pantalla completa con KPIs grandes para presentaciones | index.html, app.js, app.css | 🟡 Media | Tecla P activa modo presentación con KPIs grandes y gráficos centrados |
| 6 | Mini sparklines en KPIs | Mostrar mini gráfico de tendencia en cada tarjeta KPI del dashboard | app.js, charts.js, app.css | 🟡 Media | Cada KPI card muestra un mini gráfico de líneas de las últimas 7 horas |
| 7 | Comparación lado a lado | Dos paneles simultáneos para comparar escenarios | app.js, simulator.js, charts.js, app.css | 🟡 Media | Activando modo comparación, aparecen dos dashboards lado a lado |
| 8 | Selector de fecha REE | Permitir elegir cualquier fecha de 2025 para datos REE | ree-data.js, app.js, ree-data.css | 🟡 Media | Selector de fecha muestra datos REE correspondientes a esa fecha |
| 9 | Gráfico de sankey | Flujos de energía entre tecnologías y sectores | charts.js, simulator.js | 🟡 Media | Nueva pestaña o sección con gráfico de sankey mostrando flujos |
| 10 | Microanimaciones de transición | Transiciones suaves al cambiar entre escenarios y tabs | app.css, ntizar.css | 🔵 Baja | Al cambiar de escenario o tab, las transiciones son suaves (220ms) |
| 11 | Service Worker offline | Caché de la aplicación para funcionamiento sin conexión | sw.js, index.html | 🔴 Alta | La app funciona sin conexión, datos de última simulación se mantienen |
| 12 | API REE en tiempo real | Fetch a datos reales de Esios/REE con caché | ree-data.js, app.js, app.css | 🔴 Alta | Datos REE se actualizan automáticamente, con indicador de última actualización |
| 13 | Motor headless ESM | Ejecutable en Node.js para tests y análisis | simulator.js, constants.js, weather.js, demand.js, storage.js, policy.js, nuclear.js, trajectory.js, montecarlo.js | 🔴 Alta | Se puede hacer `node motor.mjs --scenario=1` y obtener resultados JSON |
| 14 | Tests automatizados Vitest | Validación de calibración 2025 + tests unitarios | package.json, vitest.config.js, tests/ | 🔴 Alta | `npm test` pasa todos los tests, cobertura > 80% |
| 15 | GitHub Actions CI | Lint + tests + deploy automático a Pages | .github/workflows/ | 🔴 Alta | Cada push a main ejecuta lint, tests y despliega a GitHub Pages |

---

## Detalle de cada mejora

### Mejora 1: Crear package.json + scripts
**Dificultad:** 🔵 Baja  
**Archivos afectados:** package.json (nuevo)  
**Descripción:** Crear package.json con dependencias de desarrollo (vite, vitest) y producción (vue, plotly). Incluir scripts: dev, build, test, preview. Esto permite instalar dependencias, ejecutar tests y hacer build sin necesidad de CDN.

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
**Archivos afectados:** app.js, charts.js  
**Descripción:** Añadir botón "Exportar CSV" en el dashboard que descarga un archivo con los datos horarios de la simulación actual: hora, demanda, nuclear, solar, eólica, offshore, hidráulica, gas, baterías, bombeo, importaciones, exportaciones, precio, emisiones CO2.

**Pasos:**
1. Añadir botón en la zona de acciones del dashboard
2. Implementar función que genere CSV desde mixSimulado y resultados
3. Disparar descarga con Blob + URL.createObjectURL

**Verificación:**
- Botón visible en dashboard
- Archivo descargado con nombre `simulacion_YYYY-MM-DD.csv`
- CSV con 8760 filas y columnas correctas
- Se abre correctamente en Excel/Sheets

---

### Mejora 3: Indicador de intensidad de carbono
**Dificultad:** 🔵 Baja  
**Archivos afectados:** simulator.js, app.js, app.css  
**Descripción:** Calcular e mostrar intensidad de carbono horaria (gCO2/kWh) como nuevo KPI en el dashboard hero. Se calcula como: (emisiones_totales * 1000000) / (demanda_total * 1000). Color dinámico: verde < 100, amarillo 100-200, naranja 200-300, rojo > 300.

**Pasos:**
1. Calcular intensidadCarbona en simulator.js
2. Añadir a RESULT_KEYS
3. Mostrar como nuevo KPI card en summaryStats
4. Añadir estilo de color dinámico en app.css

**Verificación:**
- Nuevo KPI "Intensidad CO2" en hero con valor gCO2/kWh
- Color cambia según nivel (verde/amarillo/naranja/rojo)
- Valor razonable (~150-250 gCO2/kWh para España)

---

### Mejora 4: Tooltips mejorados en gráficos
**Dificultad:** 🔵 Baja  
**Archivos afectados:** charts.js  
**Descripción:** Mejorar los tooltips de Plotly añadiendo información contextual: porcentaje de cada tecnología sobre el total, precio ponderado por demanda, horas acumuladas por rango de precio.

**Pasos:**
1. Personalizar hovertemplate en cada trace de Plotly
2. Añadir hoverinfo con datos adicionales
3. Mostrar leyenda contextual en los gráficos

**Verificación:**
- Tooltips muestran más información que antes
- Leyenda contextual visible
- No se rompe el layout

---

### Mejora 5: Modo presentación
**Dificultad:** 🟡 Media  
**Archivos afectados:** index.html, app.js, app.css  
**Descripción:** Añadir modo presentación (tecla P) que muestra los KPIs principales en grande, centrados, con gráficos en ancho completo. Ideal para presentaciones y reuniones.

**Pasos:**
1. Añadir clase .presentation-mode en body
2. CSS con KPIs grandes, gráficos centrados, sidebar oculto
3. Event listener para tecla P
4. Botón de activación en la barra de acciones

**Verificación:**
- Tecla P activa/desactiva modo presentación
- KPIs se muestran grandes y centrados
- Sidebar se oculta
- Tecla Escape sale del modo

---

### Mejora 6: Mini sparklines en KPIs
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, charts.js, app.css  
**Descripción:** Añadir mini gráficos de líneas (sparklines) en cada tarjeta KPI del dashboard que muestren la evolución de la métrica durante las últimas 7 horas de simulación.

**Pasos:**
1. Extraer últimas 7 horas de datos del mix simulado
2. Crear mini gráfico Plotly para cada KPI
3. Estilizar como sparkline (sin ejes, pequeño)
4. Añadir en cada tarjeta KPI del dashboard

**Verificación:**
- Cada KPI card muestra un mini gráfico de líneas
- Sparkline muestra evolución de las últimas 7 horas
- No interfiere con el diseño existente

---

### Mejora 7: Comparación lado a lado
**Dificultad:** 🟡 Media  
**Archivos afectados:** app.js, simulator.js, charts.js, app.css  
**Descripción:** Activar modo comparación donde se muestran dos escenarios simultáneamente lado a lado, con los mismos gráficos y KPIs, para comparar directamente.

**Pasos:**
1. Añadir estado de comparación en app.js
2. Duplicar la estructura de gráficos en el template
3. Permitir seleccionar segundo escenario
4. CSS para layout de dos columnas

**Verificación:**
- Botón "Comparar" activa modo lado a lado
- Dos paneles con escenarios diferentes
- Mismos gráficos y KPIs en ambos paneles
- Botón "Cancelar comparación" cierra el modo

---

### Mejora 8: Selector de fecha REE
**Dificultad:** 🟡 Media  
**Archivos afectados:** ree-data.js, app.js, ree-data.css  
**Descripción:** En la pestaña Datos REE, añadir un selector de fecha que permita al usuario ver datos de cualquier día de 2025, no solo el resumen anual.

**Pasos:**
1. Añadir selector de fecha en la sección REE
2. Calcular datos REE para la fecha seleccionada
3. Mostrar gráficos horarios para esa fecha
4. Actualizar KPIs REE según fecha

**Verificación:**
- Selector de fecha funcional en pestaña REE
- Datos actualizados según fecha seleccionada
- Gráficos horarios para la fecha elegida

---

### Mejora 9: Gráfico de sankey
**Dificultad:** 🟡 Media  
**Archivos afectados:** charts.js, simulator.js  
**Descripción:** Añadir un gráfico de sankey que muestre los flujos de energía entre tecnologías de generación y sectores de demanda. Visualiza cómo la energía fluye desde las fuentes hasta los consumidores.

**Pasos:**
1. Calcular flujos de generación por tecnología
2. Calcular demanda por sector
3. Implementar gráfico sankey con Plotly
4. Añadir en la pestaña Análisis o como nueva sección

**Verificación:**
- Gráfico sankey visible en la interfaz
- Flujos muestran proporciones correctas
- Leyenda clara con tecnologías y sectores

---

### Mejora 10: Microanimaciones de transición
**Dificultad:** 🔵 Baja  
**Archivos afectados:** app.css, ntizar.css  
**Descripción:** Añadir transiciones suaves (220ms) al cambiar entre escenarios, tabs y vistas. Mejorar la sensación de fluidez de la aplicación.

**Pasos:**
1. Añadir transiciones CSS a cards, tabs y gráficos
2. Animar cambios de estado en KPIs
3. Suavizar transiciones entre vistas semanal/anual

**Verificación:**
- Cambio de escenario tiene transición suave
- Tabs tienen efecto de activación animado
- KPIs animan su cambio de valor

---

### Mejora 11: Service Worker offline
**Dificultad:** 🔴 Alta  
**Archivos afectados:** sw.js, index.html, app.css  
**Descripción:** Implementar service worker para cachear la aplicación y permitir funcionamiento sin conexión. Los datos de la última simulación se mantienen en localStorage.

**Pasos:**
1. Crear sw.js con caché de assets estáticos
2. Registrar service worker en index.html
3. Implementar estrategia de caché primero
4. Guardar última simulación en localStorage
5. Mostrar indicador de modo offline

**Verificación:**
- App funciona sin conexión tras primera carga
- Última simulación se mantiene al recargar offline
- Indicador visual de modo online/offline

---

### Mejora 12: API REE en tiempo real
**Dificultad:** 🔴 Alta  
**Archivos afectados:** ree-data.js, app.js, app.css  
**Descripción:** Implementar fetch a la API de Esios/REE para obtener datos reales de generación, demanda y precios. Con caché local y fallback a datos estáticos.

**Pasos:**
1. Investigar API de Esios/REE (documentación pública)
2. Implementar función de fetch con caché
3. Añadir fallback a datos estáticos si la API no está disponible
4. Mostrar indicador de "última actualización"
5. Añadir botón de actualización manual

**Verificación:**
- Datos REE se actualizan desde API
- Fallback a datos estáticos funciona si API falla
- Indicador de última actualización visible
- Botón de actualización manual funcional

---

### Mejora 13: Motor headless ESM
**Dificultad:** 🔴 Alta  
**Archivos afectados:** simulator.js, constants.js, weather.js, demand.js, storage.js, policy.js, nuclear.js, trajectory.js, montecarlo.js  
**Descripción:** Refactorizar el motor de simulación para que sea ejecutable en Node.js como módulo ESM. Permitiría ejecutar simulaciones desde terminal, generar datos para tests y alimentar otros análisis.

**Pasos:**
1. Extraer lógica de simulación a módulo ESM independiente
2. Crear interfaz de línea de comandos (CLI)
3. Soportar entrada por parámetros o archivo JSON
4. Salida en JSON a stdout o archivo
5. Mantener compatibilidad con versión navegador

**Verificación:**
- `node motor.mjs --scenario=1` produce resultados JSON
- Resultados idénticos a versión navegador
- Tests unitarios pasan en Node.js

---

### Mejora 14: Tests automatizados Vitest
**Dificultad:** 🔴 Alta  
**Archivos afectados:** package.json, vitest.config.js, tests/  
**Descripción:** Implementar suite de tests con Vitest: tests de calibración contra datos 2025, tests unitarios de cada módulo, tests de regresión para la trayectoria.

**Pasos:**
1. Configurar Vitest con vitest.config.js
2. Tests de calibración: comparar resultados con datos REE 2025
3. Tests unitarios: cada módulo (weather, demand, storage, policy, simulator)
4. Tests de trayectoria: verificar consistencia multianual
5. Tests de regresión: resultados reproducibles con misma semilla

**Verificación:**
- `npm test` pasa todos los tests
- Cobertura > 80%
- Resultados reproducibles con misma semilla
- Tests de calibración dentro de rangos aceptables

---

### Mejora 15: GitHub Actions CI
**Dificultad:** 🔴 Alta  
**Archivos afectados:** .github/workflows/  
**Descripción:** Configurar pipeline CI con GitHub Actions: lint, tests, build y deploy automático a GitHub Pages en cada push a main.

**Pasos:**
1. Crear .github/workflows/deploy.yml
2. Configurar job de lint + tests
3. Configurar job de build + deploy a Pages
4. Activar GitHub Pages con source desde GitHub Actions
5. Verificar deploy automático

**Verificación:**
- Cada push a main ejecuta CI
- Tests pasan antes del deploy
- GitHub Pages se actualiza automáticamente
- Notificaciones de éxito/fallo por email
