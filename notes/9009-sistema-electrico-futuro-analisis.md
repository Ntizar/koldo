# FASE 0 — Análisis: Sistema Eléctrico Futuro

**Proyecto:** Sistema Eléctrico Futuro 2026-2035  
**Autor:** David Antizar (Ntizar)  
**Versión actual:** v3.3  
**Stack:** HTML estático + Vue 3 CDN + Plotly.js + CSS propio (Ntizar Aurora)  
**URL:** https://ntizar.github.io/SistemaElectricoFuturo/  
**Fecha de análisis:** 30 de mayo de 2026  

---

## 1. Estructura del proyecto



**Total:** ~5.515 líneas de código (JS + CSS), sin build system, sin package.json.

---

## 2. Resumen del README

Simulador interactivo del sistema eléctrico español con horizonte 2026-2035. La v3 combina simulación anual de 8.760 horas con trayectoria multianual. Incluye:

- **22 escenarios** (ampliados a 22 con IDs 18-21 ceteris paribus nuclear)
- **Demanda sectorial**: residencial, servicios, industria, VE, bombas de calor, H2, autoconsumo
- **Calendario nuclear real** basado en ENRESA con prórroga configurable
- **Almacenamiento avanzado**: degradación de baterías, bombeo con reserva estacional, V2G
- **Política energética**: tope ibérico, CfDs, peajes dinámicos, PVPC, pagos por capacidad
- **Trayectoria 2026-2035** con rampas de despliegue y estado persistente
- **Métricas**: horas sin gas, estrés de red, coste del sistema, LCOE, LCOS, ENS, LOLE
- **Monte Carlo** multi-semilla con percentiles P5-P50-P95

---

## 3. Arquitectura técnica

### Motor de simulación (simulator.js)
- Despacho por orden de mérito (12 tecnologías en pila SRMC)
- 8.760 horas/año, balance energético horario
- Tecnología final que fija el precio marginal
- Hidráulica con presupuesto energético (38% fluyente + 62% embalse)
- Interconexiones con Francia/Portugal
- V2G, electrólisis flexible, autoconsumo FV

### Visualización (charts.js)
- Plotly.js con layout base personalizado
- Gráficos: mix horario apilado, precio spot, barras comparativas, curva de duración
- Vistas semanal/anual, distribución de precios
- Trayectoria multianual con gráficos de evolución

### Diseño (ntizar.css + app.css)
- Sistema de diseño Aurora v4 con tokens CSS
- Modo claro (por defecto) y oscuro
- Liquid glass: transparencias, gradientes, blur
- Paleta: azul #2563eb + naranja #f97316
- Componentes reutilizables: cards, badges, buttons, fields, ranges

### Datos REE (ree-data.js)
- Datos estáticos de referencia 2025
- Estructura de generación por tecnología
- Normativa vigente, informes, mercado

---

## 4. Puntos fuertes identificados

1. **Motor de simulación sólido**: despacho SRMC realista con 12 tecnologías, balance horario, hidráulica con presupuesto energético
2. **Diseño visual excelente**: sistema Aurora v4 completo, liquid glass, tema claro/oscuro, responsive
3. **22 escenarios** con cobertura amplia del espectro energético español
4. **Documentación técnica**: METHODOLOGY.md, POLICY.md, DATA-2025.md, glosario de 18 términos
5. **Pestaña Información**: marco legal (10 leyes), organismos (9), fuentes (16 enlaces)
6. **Monte Carlo**: 9 semillas con percentiles para análisis de sensibilidad
7. **Trayectoria multianual**: 10 años consecutivos con rampas y estado persistente
8. **KPIs de seguridad**: ENS, LOLE, horas inercia crítica, horas sin gas

---

## 5. Áreas de mejora identificadas

### Críticas
- **Sin package.json ni build system**: no hay forma de instalar dependencias ni testear con Node
- **Sin tests automatizados**: la validación técnica es manual
- **Sin CI/CD**: no hay GitHub Actions para lint/tests/deploy
- **Sin motor headless**: no se puede ejecutar la simulación fuera del navegador

### Importantes
- **Carga de datos REE estática**: no hay API en vivo, los datos pueden quedar desactualizados
- **Sin exportación de resultados**: no hay forma de descargar datos en CSV/JSON
- **Sin modo offline**: no hay service worker ni PWA
- **Sin accesibilidad**: no hay roles ARIA, navegación por teclado, contraste verificado

### Estéticas/UX
- **Sin animaciones de transición** entre escenarios
- **Sin compartir configuración** (ya tiene copiar config JSON)
- **Sin indicador de carga** (ya tiene spinner básico)

---

## 6. Resumen de archivos principales

| Archivo | Líneas | Función |
|---------|--------|---------|
| app.js | 821 | App Vue 3, estado, UI, tabs, KPIs |
| scenarios.js | 531 | 22 escenarios con parámetros |
| simulator.js | 520 | Motor de simulación anual (SRMC) |
| charts.js | 514 | Gráficos Plotly (mix, precios, trayectorias) |
| app.css | 437 | Overrides específicos de la app |
| ntizar.css | 1187 | Sistema de diseño Aurora v4 |
| ree-data.js | 271 | Datos REE 2025 de referencia |
| constants.js | 263 | Constantes, PRNG, utilidades, datos |
| storage.js | 134 | Baterías, bombeo, V2G |
| demand.js | 138 | Demanda sectorial horaria |
| montecarlo.js | 145 | Monte Carlo multi-semilla |
| trajectory.js | 101 | Trayectoria multianual 2026-2035 |
| weather.js | 99 | Clima sintético AR(1) |
| policy.js | 76 | Política energética |
| nuclear.js | 53 | Calendario ENRESA |
| theme.js | 111 | Gestión tema claro/oscuro |
| ree-data.css | 114 | Estilos pestaña REE |
