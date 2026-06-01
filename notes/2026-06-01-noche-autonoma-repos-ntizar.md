# Exploración Autónoma Nocturna — Repositorios Ntizar

**Fecha:** 2026-06-01  
**Tipo:** Auto-aprendizaje profundo  
**Repos analizados:** 26 (12 en profundidad esta sesión)

## Resumen Ejecutivo

Esta sesión nocturna profundizó en repositorios NO explorados en sesiones anteriores, identificando patrones arquitectónicos, técnicas innovadoras y oportunidades de reutilización para el sistema Koldo.

## Repositorios Profundizados Esta Sesión

### 1. YoloConteo — Detección de Objetos 100% en Navegador
- **Stack:** Python (backend) + ONNX + WebGPU (frontend)
- **Modelo:** YOLOv8n (~12 MB) convertido a ONNX
- **Tracker:** ByteTrack (built-in Ultralytics, reemplaza DeepSort)
- **Rendimiento:** 20-40+ fps WebGPU, 5-15 fps WASM fallback
- **Deploy:** Vercel (estático) + API serverless para conteo
- **Objetos:** personas, coches, motos, bicicletas, autobuses, camiones
- **Conteo bidireccional:** línea virtual con cruce en ambas direcciones
- **Export:** CSV + GPS geolocalización
- **Patrón clave:** IA local sin servidor GPU — todo corre en el dispositivo del usuario

### 2. MonteCarloInversion — Simulador Estocástico Institucional
- **5 modelos:** GBM, Heston, Jump-Diffusion (Merton), GARCH(1,1), Bootstrap
- **Web Workers:** ejecución paralela sin bloquear UI
- **Datos:** Yahoo Finance API (via Netlify functions)
- **Backtest automático:** selecciona mejor modelo históricamente
- **Métricas:** VaR, CVaR, Sharpe, Sortino, probabilidades de caída
- **Contexto:** 9 fuentes (técnico, opciones, macro, social, insiders, news, fundamentals, sentiment, consensus)
- **Señal BUY/HOLD/SELL:** score 0-100 con consenso entre modelos
- **Deploy:** Netlify (estático + serverless functions)
- **Patrón clave:** Modelos cuantitativos profesionales en el navegador

### 3. Empleady — Simulador de Rentabilidad de Empleados
- **Stack:** HTML + CSS (Ntizar Aurora) + Vanilla JS
- **Funcionalidad:** cálculo de break-even, curva de aprendizaje, coste/hora real
- **AT/EP por CNAE:** cotización de accidentes de trabajo variable por actividad
- **Multi-empleado:** gestión dinámica de empleados con métricas individuales
- **Export:** CSV + PDF global con Chart.js
- **Sin backend:** SPA autocontenida
- **Patrón clave:** Herramienta financiera auditable sin dependencias

### 4. OrbitMixer — Comparador Satelital con Gestos
- **Stack:** Vanilla HTML/CSS/JS + Vercel Serverless Functions
- **Imágenes:** Sentinel-2 (Earth Search STAC, gratuito)
- **Renderizado:** TiTiler.xyz (COG → PNG, gratuito)
- **Elevación:** OpenTopoData (gratuito)
- **Gestos:** MediaPipe Hands para control manual
- **IA:** OpenRouter con cadena de fallback (Gemini → free)
- **Geocoding:** Nominatim (OSM)
- **Patrones:** 100% free APIs (keys opcionales para features premium)
- **Deploy:** Vercel (frontend estático + serverless functions)

### 5. Rumby — Plataforma de Movilidad Multimodal
- **Stack:** Next.js 16 + React 19 + TypeScript + MapLibre GL
- **Visión:** "Flighty para transporte urbano" — planificación + contexto + incidencias
- **Ciudad semilla:** Madrid
- **Fuentes:** GTFS EMT, BiciMAD, incidencias Ayto Madrid, DGT DATEX II, parking EMT
- **Arquitectura:** conectores modulares con contratos claros
- **Principio:** IA explica y recomienda, no sustituye motor de rutas
- **Deploy:** Next.js (Vercel)
- **Patrón clave:** Plataforma escalable ciudad por ciudad

### 6. Voynich_Solving — Análisis Estructural de Manuscritos
- **Enfoque:** Tratamiento del Voynich como base de datos farmacéutica medieval
- **Hallazgo estructural:** entropía de sufijos baja, alineación vertical alta, perfil no encriptado clásico
- **Tesis:** "La sección de recetas del Voynich parece una notación estructurada compatible con una base de datos farmacéutica medieval"
- **Métricas:** entropía, alineación vertical, perfil estadístico, cobertura 18.7%
- **Sesiones:** 17 sesiones de investigación
- **Estado:** estructura demostrada, lectura semántica no resuelta
- **Patrón clave:** Metodología de análisis estructural vs semántico separadas

### 7. MetalHoverLab — Efecto Metalizado con Cursor
- **Técnica:** derivación de relieve desde luminancia, gradientes y contrastes locales
- **Efecto:** foco de luz que el cursor mueve, recalcula sombreado y tinte metálico
- **Materiales:** oro, plata, bronce, color libre
- **Export:** HTML autocontenido, React/Next component, snippet
- **Sin Rive:** renderer canvas inline, no dependencia de Rive
- **Controles:** metal/color, base mármol, radio de luz, profundidad, especular, tinte, halo
- **Patrón clave:** Efecto visual 3D sin WebGL, solo canvas 2D + luminancia

### 8. Patrón Headless SEF — Módulos JS en Node.js
- **Técnica:** `new Function()` para ejecutar módulos que esperan `window.SEF` en Node.js
- **Módulos:** 12 archivos JS que se cargan dinámicamente
- **Namespace:** `globalThis.SEF` como contenedor de estado
- **CLI:** argumentos `--scenario=N`, `--anio=Y`, `--params=file.json`, `--output=file.json`
- **Trayectoria:** simulación multianual con estado persistente
- **Patrón clave:** Puente entre código frontend (que usa window) y headless (Node.js)

## Patrones Técnicos Nuevos Detectados

### A. Headless Bridge Pattern (SEF motor.mjs)
Ejecutar módulos JavaScript diseñados para navegador en Node.js:
```javascript
function cargarModuloSEF(ruta) {
    const SEF = globalThis.SEF || {};
    globalThis.SEF = SEF;
    if (!globalThis.window) globalThis.window = { SEF: SEF };
    const codigo = readFileSync(ruta, 'utf-8');
    new Function(...Object.keys(SEF), codigo)(...Object.values(SEF));
}
```
**Valor:** reutilizar lógica de simulación frontend en CI/CD, batch jobs, testing.

### B. 100% Free API Chain (OrbitMixer)
Cadena de APIs gratuitas con fallbacks:
```
Sentinel-2 → Earth Search STAC (gratis)
  ↓
COG → PNG → TiTiler.xyz (gratis)
  ↓
Elevación → OpenTopoData (gratis)
  ↓
IA → OpenRouter → fallback chain (gratis)
```
**Valor:** cualquier proyecto geoespacial puede usar esta cadena sin coste.

### C. WebGPU + ONNX Inference (YoloConteo)
Detección de objetos en el navegador sin servidor:
```
Cámara → YOLOv8n (ONNX) → WebGPU → ByteTrack → Conteo
```
**Valor:** cualquier proyecto de visión por computador puede usar este patrón.

### D. Modelos Estocásticos en Web Workers (MonteCarloInversion)
5 modelos ejecutándose en paralelo:
```
Worker 1: GBM
Worker 2: Heston
Worker 3: Jump-Diffusion
Worker 4: GARCH(1,1)
Worker 5: Bootstrap
→ Backtest automático → Mejor modelo → Señal BUY/HOLD/SELL
```
**Valor:** simulación cuantitativa profesional sin backend.

### E. Conector Modular Rumby
Arquitectura de conectores con contratos claros:
```
Fuente externa → Conector → Contrato → Motor de rutas
```
**Valor:** escalabilidad ciudad por ciudad sin rehacer el core.

### F. Relieve desde Luminancia (MetalHoverLab)
Derivar información 3D de una imagen 2D:
```
Imagen → Luminancia → Gradientes → Contraste local → Relieve → Sombreado → Metal
```
**Valor:** efectos visuales 3D sin WebGL, compatible con CMS que sanitizan scripts.

## Tecnologías Identificadas por Proyecto

| Proyecto | Frontend | Backend | Deploy | Estrella |
|----------|----------|---------|--------|----------|
| YoloConteo | Canvas + WebGPU | Python/Flask | Vercel | IA local |
| MonteCarloInversion | Vanilla JS | Netlify Functions | Netlify | Cuantitativo |
| Empleady | Vanilla JS | Ninguno | GitHub Pages | Financiero |
| OrbitMixer | Vanilla JS | Vercel SF | Vercel | Geoespacial |
| Rumby | Next.js 16 | Next.js | Vercel | Movilidad |
| Voynich | Python | Ninguno | GitHub | Investigación |
| MetalHoverLab | Canvas 2D | Ninguno | GitHub Pages | Visual |
| SEF | Vue 3 CDN | motor.mjs | GitHub Pages | Energético |
| solmad | React + TS | Vercel SF | Vercel | Solar |
| nap-dashboard | React + TS | Vercel SF | Vercel | GTFS |
| FreeHands | Python | Local | pip | Accesibilidad |
| Mastermind | Obsidian+OC | OpenCode | Local | Multi-agente |
| Aurora | CSS | Ninguno | jsDelivr CDN | Design System |

## Oportunidades para Koldo

1. **WebGPU + ONNX:** patrón reutilizable para detección en navegador sin servidor
2. **Headless bridge:** ejecutar simulaciones frontend en Node.js para CI/CD
3. **Free API chain:** patrón para proyectos geoespaciales sin coste
4. **Modelos estocásticos:** framework de simulación cuantitativa en navegador
5. **Conectores modulares:** arquitectura para integrar múltiples fuentes de datos
6. **Relieve luminancia:** técnica para efectos visuales 3D sin WebGL
7. **Conteo bidireccional:** patrón para tracking de eventos con línea virtual
