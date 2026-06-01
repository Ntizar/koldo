# FASE 1 — Investigación: Tendencias y Proyectos Similares 2025-2026
> Pipeline 9009 · 30 de mayo de 2026

## 1. Proyectos Similares Encontrados

### 1.1 Shadcn/ui (con CSS Variables + Glass)
**Tipo:** Colección de componentes reutilizables, no un framework CSS
**Stack:** Tailwind + Radix UI + CSS Variables
**Lo que tiene de similar:** Tokens CSS personalizables, nombrespaced, modular
**Features clave:**
- Tokens CSS en `:root` para colores, radios, sombras
- Cada componente es un archivo individual (tree-shaking real)
- Soporte dark mode nativo con variables CSS
- Comunidad enorme con miles de contribuciones
- **Glass/morphism:** componentes como `Card` con backdrop-blur y bordes translúcidos
**Lecciones para Aurora:** El modelo de "componentes como archivos individuales" para tree-shaking real. Aurora podría ofrecer archivos CSS por componente dentro de cada pack.

### 1.2 Pico CSS (v2/v3)
**Tipo:** Framework CSS semántico, sin clases
**Stack:** CSS puro, sin clases requeridas
**Lo que tiene de similar:** CSS-only, sin JS, accesible por defecto
**Features clave:**
- Usa selectores semánticos (`<button>`, `<nav>`) en lugar de clases
- Temas integrados (light, dark, high-contrast)
- Muy ligero (~15 KB)
- Diseño minimalista y funcional
**Lecciones para Aurora:** La filosofía "sin clases" es alternativa a la de Aurora, pero el enfoque de temas integrados y ligereza son relevantes. Aurora podría explorar un modo "semántico" opcional.

### 1.3 DaisyUI (v5 — con Glass y Aurora)
**Tipo:** Plugin de componentes para Tailwind
**Stack:** Tailwind CSS plugin
**Lo que tiene de similar:** Temas predefinidos, componentes listos, glass effects
**Features clave:**
- Temas completos (aurora, cupcake, bumblebee, corporate, etc.)
- Componentes con glass/morphism (`glass` class)
- Modificadores por estado (disabled, active, loading)
- Integración con Tailwind CLI para tree-shaking
- **Tema "aurora":** inspirado directamente en auroras boreales, con gradientes azul/púrpura/verde
**Lecciones para Aurora:** El nombre "aurora" como tema es una tendencia real. DaisyUI demuestra que los temas inspirados en fenómenos naturales son populares. La clase `glass` de DaisyUI es un buen referente para comparar con el liquid glass de Aurora.

### 1.4 Apple visionOS Human Interface Guidelines (Liquid Glass)
**Tipo:** Sistema de diseño de Apple para visionOS
**Stack:** SwiftUI (no CSS)
**Lo que tiene de similar:** Liquid Glass como lenguaje visual principal
**Features clave:**
- **Vidrio como material:** no solo transparencia, sino refracción, reflejos, profundidad
- **Specular highlights** que siguen el cursor/gesto
- **Chromatic aberration** en bordes
- **Profundidad contextual:** el vidrio se adapta al contenido detrás
- **Jerarquía por grosor:** más vidrio = más prominente
- **Adaptación ambiental:** el vidrio absorbe colores del entorno
**Lecciones para Aurora:** Aurora ya implementa la mayoría de estas características en `ntizar.next.css`. La oportunidad es expandir: más componentes glass (inputs glass, tablas glass, nav glass), y mejor adaptación ambiental con `color-mix()` en backdrop.

### 1.5 Vercel Aceternity UI / Magic UI
**Tipo:** Colección de componentes con animaciones CSS avanzadas
**Stack:** Tailwind + CSS animations
**Lo que tiene de similar:** Animaciones CSS puras, efectos visuales avanzados
**Features clave:**
- **Scroll-driven animations** sin JavaScript
- **Marquee infinito** con CSS puro
- **Text reveal** con clip-path y animaciones
- **Aurora background effects** — gradientes animados
- **Bento grid layouts** — layout popular 2025
- **Spotlight effects** — iluminación que sigue el cursor
**Lecciones para Aurora:** El pack `ntizar.motion.css` ya tiene shimmer, glow-pulse, aurora-pan. Se podría expandir con: spotlight effect, text reveal, bento grid, y más scroll-driven animations.

### 1.6 WindiCSS / UnoCSS (Atomic CSS Engines)
**Tipo:** Motores de utilidades atómicas (sucesores de Tailwind)
**Stack:** CSS puro generado en build
**Lo que tiene de similar:** Atomic utilities, tokens, modular
**Features clave:**
- **UnoCSS:** motor de utilidades atómicas universal
- **Presets:** Tailwind, Windi, Uno, CSS vars
- **Tree-shaking perfecto** — solo lo que usas
- **CSS Houdini** para custom properties en runtime
**Lecciones para Aurora:** Aurora ya tiene utilidades atómicas (`.u-nz-*`). La oportunidad es explorar CSS Houdini para utilidades runtime que no existían antes (ej: `@property` para animaciones de gradientes).

### 1.7 Linear App Design System
**Tipo:** Design system de producto (Linear)
**Stack:** CSS Modules + Tokens
**Lo que tiene de similar:** Minimalismo, glass effects, precisión visual
**Features clave:**
- **Bento grid** como patrón de layout dominante
- **Micro-interacciones** con CSS transitions
- **Glassmorphism refinado** — no excesivo, contextual
- **Keyboard-first navigation** — accesibilidad real
- **Dark mode perfecto** — no solo invertir colores
- **Focus rings elegantes** — doble anillo, colores adaptativos
**Lecciones para Aurora:** El enfoque de Linear en micro-interacciones y glass contextual es muy relevante. Aurora podría añadir: focus ring mejorado, keyboard shortcuts visibles, y bento grid como patrón en `patterns.css`.

### 1.8 Radix Themes
**Tipo:** Colección de componentes accesibles sin estilos
**Stack:** React + CSS
**Lo que tiene de similar:** Accesibilidad como prioridad, tokens CSS
**Features clave:**
- **Accesibilidad nativa** — ARIA, keyboard navigation, screen readers
- **Tokens CSS** — personalización completa sin tocar CSS
- **Composición** — componentes construidos con partes pequeñas
- **Sin estilos por defecto** — el usuario decide la estética
**Lecciones para Aurora:** Radix demuestra que la accesibilidad y la personalización van de la mano. Aurora ya tiene contrast skin AAA y forced-colors. Se podría profundizar en: ARIA live regions para toasts, focus trap en modales (documentado en INDEX.md), y composability de componentes.

### 1.9 CSS Container Queries + Subgrid (Tendencia 2025-2026)
**Tipo:** Características CSS nativas que están revolucionando layouts
**Stack:** CSS puro
**Lo que tiene de similar:** Layout sin JS, responsive contextual
**Features clave:**
- **Container queries:** layouts que reaccionan al contenedor, no al viewport
- **CSS subgrid:** alineación perfecta en grids anidados
- **`:has()` selector:** estilos basados en hijos
- **CSS nesting nativo:** sintaxis anidada sin preprocesador
- **View transitions API:** transiciones entre estados de página
**Lecciones para Aurora:** Aurora ya implementó `:has()` en la última iteración nocturna. Las oportunidades restantes son: container queries para componentes responsivos (ej: `.nz-card--responsive` que cambia layout según su contenedor), subgrid para layouts anidados, y CSS nesting nativo para simplificar el código de los packs.

### 1.10 Google Material Design 3 (Dynamic Color)
**Tipo:** Sistema de diseño de Google
**Stack:** Web Components + CSS
**Lo que tiene de similar:** Sistema de tokens, temas dinámicos, glass effects
**Features clave:**
- **Dynamic color:** genera paleta completa desde un color semilla
- **Tonalidad:** cada color tiene 10+ variaciones automáticas
- **Glass / tonal surfaces:** superficies con efecto vidrio
- **Motion system:** curvas de animación predefinidas
- **Typography scale:** sistema tipográfico completo con clamp()
- **Shape system:** radii predefinidos y custom
**Lecciones para Aurora:** El sistema de tonalidad de Material 3 es muy similar a lo que Aurora hace con OKLCH. La oportunidad es expandir: generar escalas de color automáticamente desde un solo token, y añadir un sistema de "tonalidad" para superficies (no solo colores).

## 2. Tendencias CSS 2025-2026 Identificadas

### 2.1 Glassmorphism Evolucionado → Liquid Glass
- Ya no es solo `backdrop-filter: blur()`
- Incluye: refracción cromática, specular highlights dinámicos, grosor aparente
- **Estado en Aurora:** ✅ Implementado en `ntizar.next.css` (v5)
- **Oportunidad:** más componentes glass, glass para inputs/tablas/nav

### 2.2 OKLCH como Estándar de Color
- Espacio de color perceptualmente uniforme
- Mejor dark mode automático
- Gradientes suaves entre cualquier par de colores
- **Estado en Aurora:** ✅ Implementado en `ntizar.next.css` (v5)
- **Oportunidad:** usar `oklch(from ...)` para derivar sombras y bordes algorítmicamente

### 2.3 Scroll-Driven Animations
- Animaciones vinculadas al scroll sin JavaScript
- `animation-timeline: view()` y `animation-timeline: scroll()`
- **Estado en Aurora:** ✅ Implementado en `ntizar.motion.css` (iteración nocturna)
- **Oportunidad:** expandir a progress bars contextuales, reveal por sección

### 2.4 Container Queries como Estándar
- Layouts que reaccionan al contenedor, no al viewport
- Esencial para componentes reutilizables
- **Estado en Aurora:** ❌ No implementado
- **Oportunidad:** componentes responsivos basados en contenedor

### 2.5 CSS Nesting Nativo
- Sintaxis anidada sin preprocesador
- Soporte universal en navegadores modernos
- **Estado en Aurora:** ❌ Usa selectores planos BEM
- **Oportunidad:** refactorizar packs a nesting nativo (simplifica código)

### 2.6 `:has()` Selector
- Estilos basados en el estado de hijos
- Interactividad sin JavaScript
- **Estado en Aurora:** ✅ Implementado (iteración nocturna)
- **Oportunidad:** expandir a más componentes (tabs, dropdowns, accordions)

### 2.7 View Transitions API
- Transiciones entre estados de página
- Navegación con animaciones fluidas
- **Estado en Aurora:** ❌ No implementado
- **Oportunidad:** transiciones entre temas light/dark, entre skins

### 2.8 CSS Houdini (Worklets)
- Custom properties animables con `@property`
- Pintores personalizados
- **Estado en Aurora:** ❌ No implementado
- **Oportunidad:** gradientes animados con `@property`, efectos de partículas CSS

### 2.9 Bento Grid Layouts
- Layouts modulares asimétricos
- Dominantes en 2025-2026
- **Estado en Aurora:** ❌ No implementado
- **Oportunidad:** patrón `nz-bento-grid` en `patterns.css`

### 2.10 Focus Rings Elegantes
- Doble anillo de foco (accesibilidad + estética)
- Colores adaptativos
- **Estado en Aurora:** ✅ En skin contrast (doble anillo)
- **Oportunidad:** focus ring mejorado para todos los skins, no solo contrast

## 3. Ideas Concretas Derivadas de la Investigación

### Alta Prioridad (baja dificultad)
1. **Container Queries para `.nz-card`** — que la card se adapte al ancho de su contenedor
2. **CSS Nesting nativo** — refactorizar un pack como prueba de concepto
3. **Expandir `:has()` a más componentes** — tabs, accordion, dropdown
4. **Focus ring mejorado** — doble anillo para todos los skins (no solo contrast)
5. **Bento grid pattern** — nuevo patrón en `patterns.css`

### Media Prioridad
6. **View transitions para cambio de skin** — transición suave entre aurora/sunset/midnight
7. **CSS Houdini para gradientes animados** — aurora mesh más fluido con `@property`
8. **Subgrid para layouts anidados** — `.nz-grid` dentro de `.nz-grid` alineado perfectamente
9. **Componentes glass expandidos** — inputs glass, tablas glass, nav glass
10. **Sistema de tonalidad para superficies** — no solo colores, sino superficies con tonalidad

### Baja Prioridad (más complejidad)
11. **Modo semántico opcional** — que los componentes funcionen con selectores semánticos (como Pico)
12. **Export a Figma tokens** — además de Tailwind y DTCG
13. **Storybook integration** — para visualizar componentes interactivamente
14. **Sistema de iconos integrado** — con SVG inline y CSS-only
15. **CSS-only dropdown con `:has()`** — eliminar necesidad de JS para dropdowns simples
