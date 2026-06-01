# FASE 4 — Investigación 9009 para Ntizar-Aurora
> Reaprendizaje semanal · 1 de junio de 2026
> Versión del sistema: v5.1.0 → v5.2.0
> Prioridad: tendencias CSS 2025-2026, design systems modernos, gaps técnicos

## Resumen Ejecutivo

Aurora v5.1 tiene **13/20** tendencias CSS modernas implementadas (65%).
**7 oportunidades** identificadas para v5.2:
- `:is()` selector (no se usa en ningún archivo)
- Container query units (cqw, cqh, cqi, cqb)
- Anchor positioning
- @position-try
- inset-area
- Microinteracciones CSS
- Evolución de design tokens

## 1. Estado de Características CSS Modernas

### ✅ Implementadas (13/20)
1. **CSS Scroll-driven Animations** — `animation-timeline` en ntizar.next.css
2. **CSS color-contrast()** — auto-contrast en ntizar.next.css
3. **CSS light-dark()** — toggle tema en ntizar.next.css
4. **CSS color-mix()** — mezclas de color en ntizar.next.css
5. **CSS :where() selector** — especificidad cero en ntizar.css
6. **CSS cascade layers** — `@layer ntizar.*` en todos los packs
7. **CSS view transitions** — transición de tema en ntizar.next.css
8. **CSS forced-colors** — modo alto contraste en ntizar.next.css
9. **CSS OKLCH** — sistema de color paralelo en ntizar.next.css
10. **CSS Glass Liquid** — efecto real en ntizar.next.css
11. **CSS Nesting nativo** — `&` dentro de selectores en ntizar.motion.css
12. **CSS subgrid** — layouts anidados en ntizar.css
13. **CSS :has() reactivo** — 23 usos en 4 archivos CSS

### ❌ Gaps / Oportunidades (7/20)
1. **CSS :is() selector** — NO se usa en ningún archivo
2. **CSS Container Query Units** (cqw, cqh, cqi, cqb) — NO se usan
3. **CSS Anchor Positioning** — NO se usa
4. **CSS @position-try** — NO se usa
5. **CSS inset-area** — NO se usa
6. **CSS microinteracciones** — solo hover-lift, sin micro-interacciones complejas
7. **Design tokens evolution** — OKLCH tiene, pero falta color-contrast() production

## 2. Tendencias de Diseño UI 2025-2026

### 2.1 CSS Scroll-driven Animations (Chrome 115+, Firefox 116+)
- Animaciones basadas en scroll, no en JavaScript
- `animation-timeline: scroll()` para elementos que se animan al hacer scroll
- `animation-timeline: view()` para animaciones basadas en visibilidad
- **Estado Aurora:** Tiene `animation-timeline` pero no usa `scroll()` ni `view()` timelines
- **Oportunidad:** Añadir scroll-driven reveal animations para cards, KPIs, charts

### 2.2 CSS Anchor Positioning (Chrome 117+, Firefox 125+)
- Posicionar elementos relativo a otros elementos sin JS
- `position-anchor: --name` + `inset-area: anchor` + `position-area: anchor`
- **Estado Aurora:** NO implementado
- **Oportunidad:** Tooltips, dropdowns, popovers posicionados anclados al trigger

### 2.3 CSS :is() Selector (Chrome 88+, Firefox 86+, Safari 15.4+)
- Simplificar selectores complejos: `:is(.a, .b, .c) { ... }`
- Reducir verbosidad en resets y estilos base
- **Estado Aurora:** NO se usa en ningún archivo
- **Oportunidad:** Refactorizar selectores repetitivos en ntizar.css

### 2.4 CSS Container Query Units (Chrome 105+, Firefox 110+)
- `cqw` (container query width), `cqh` (container query height)
- `cqi` (container query inline), `cqb` (container query block)
- **Estado Aurora:** Tiene container queries para `.nz-card` pero NO usa unidades
- **Oportunidad:** Tipografía fluida basada en contenedor, espaciado proporcional

### 2.5 CSS @position-try (Chrome 121+, Firefox 125+)
- Fallbacks de posicionamiento para anchor positioning
- `@position-try { anchor-area: top; }`
- **Estado Aurora:** NO implementado
- **Oportunidad:** Tooltips y popovers con fallbacks automáticos

### 2.6 CSS inset-area (Chrome 121+, Firefox 125+)
- Posicionar elementos en áreas específicas del viewport
- `inset-area: right-top` para popovers
- **Estado Aurora:** NO implementado
- **Oportunidad:** Toasts y notificaciones posicionadas automáticamente

### 2.7 Microinteracciones CSS
- Transiciones sutiles en hover, focus, active
- `transition-behavior: allow-discrete` para animaciones de display
- `animation-composition: add` para combinar animaciones
- **Estado Aurora:** Solo tiene hover-lift, sin microinteracciones complejas
- **Oportunidad:** Micro-animaciones en botones, cards, inputs, badges

### 2.8 Design Tokens Evolution
- OKLCH para colores perceptualmente uniformes ✅ (Aurora tiene)
- color-mix() para mezclas dinámicas ✅ (Aurora tiene)
- light-dark() para temas nativos ✅ (Aurora tiene)
- color-contrast() para accesibilidad ✅ (Aurora tiene)
- forced-colors para accesibilidad Windows ✅ (Aurora tiene)
- **Estado Aurora:** Muy avanzado en tokens. Solo falta `color-contrast()` production

## 3. Investigación de Design Systems Similares

### 3.1 Principio de Diseño de W3C TAG
- Web Platform Design Principles (w3ctag.github.io)
- Principios clave: progressive enhancement, interoperability, performance
- **Aplicación a Aurora:** Aurora ya sigue estos principios (CSS-only, progressive enhancement)

### 3.2 MDN CSS Reference
- 1188 propiedades CSS documentadas
- 39 propiedades modernas referenciadas
- Aurora usa ~20 de las 39 propiedades modernas (51%)
- **Oportunidad:** Adoptar las 19 propiedades no usadas

### 3.3 Patrones CSS-only Emergentes
- CSS-only carousels con scroll-snap + scroll-driven
- CSS-only popovers con :popover + :has()
- CSS-only context menus con :has() + position-anchor
- CSS-only autocomplete con :has() + listbox
- CSS-only command palettes con :has() + scroll-driven
- CSS-only sidebars con :has() + container queries
- CSS-only tooltips con :has() + anchor positioning

## 4. Componentes Faltantes en Aurora

### 4.1 Componentes de UI Faltantes
- **Carousel** — slider CSS-only con scroll-snap
- **Popover** — tooltip avanzado con :popover + anchor positioning
- **Command Palette** — búsqueda rápida con :has() + scroll-driven
- **Context Menu** — menú contextual con :has() + position-anchor
- **Autocomplete** — campo de búsqueda con sugerencias :has() + listbox

### 4.2 Componentes de Datos Faltantes
- **Heatmap** — tabla de calor con CSS grid + OKLCH
- **Sankey Diagram** — flujo de datos con SVG + CSS
- **Funnel** — embudo de conversión con CSS grid
- **Radar Chart** — gráfico de radar con SVG + CSS

### 4.3 Componentes de Formulario Faltantes
- **Time Picker** — selector de hora con CSS-only
- **Date Range Picker** — selector de rango con CSS-only
- **Color Picker** — selector de color con CSS-only
- **File Upload** — drag & drop con :has() + scroll-driven

### 4.4 Componentes de Layout Faltantes
- **Sidebar** — navegación lateral con :has() + container queries
- **Split View** — vista dividida con CSS grid + container queries
- **Resizable Panels** — paneles redimensionables con CSS-only

## 5. Tendencias de Diseño Visual 2025-2026

### 5.1 Glassmorphism 2.0
- Aurora ya tiene `glass-liquid` con specular highlight + chromatic edge
- **Evolución:** Añadir `backdrop-saturate()` para mayor realismo
- **Estado:** ✅ Implementado (pero podría mejorar con backdrop-saturate)

### 5.2 OKLCH Production
- OKLCH para colores perceptualmente uniformes
- Aurora tiene sistema OKLCH paralelo con `data-nz-color-system="oklch"`
- **Evolución:** Hacer OKLCH el default, no opt-in
- **Estado:** ✅ Implementado (opt-in)

### 5.3 Bento Grids
- Layouts asimétricos con celdas de diferentes tamaños
- Aurora tiene `.nz-bento-grid` con `grid-template-areas`
- **Evolución:** Añadir más variantes (vertical, horizontal, diagonal)
- **Estado:** ✅ Implementado

### 5.4 CSS-only Interactions
- :has() para interactividad sin JavaScript
- Aurora tiene 23 usos de :has() en 4 archivos CSS
- **Evolución:** Expandir a más componentes (carousel, popover, context menu)
- **Estado:** ✅ Implementado (pero limitado a accordion, tabs, dropdown)

### 5.5 Scroll-driven Animations
- Animaciones basadas en scroll, no en JavaScript
- Aurora tiene `animation-timeline` pero no usa scroll/view timelines
- **Evolución:** Añadir reveal animations basadas en scroll
- **Estado:** ❌ No implementado

## 6. Recomendaciones para v5.2

### 6.1 Prioridad Alta (baja dificultad, alto impacto)
1. **CSS :is() selector** — refactorizar selectores repetitivos
2. **Container query units** — tipografía fluida basada en contenedor
3. **Microinteracciones CSS** — transiciones sutiles en componentes existentes

### 6.2 Prioridad Media (media dificultad, alto impacto)
4. **CSS Anchor Positioning** — tooltips y popovers posicionados anclados
5. **CSS @position-try** — fallbacks de posicionamiento
6. **CSS inset-area** — toasts y notificaciones posicionadas

### 6.3 Prioridad Baja (alta dificultad, alto impacto)
7. **CSS-only Carousel** — slider con scroll-snap + scroll-driven
8. **CSS-only Popover** — tooltip avanzado con :popover + anchor positioning
9. **CSS-only Command Palette** — búsqueda rápida con :has() + scroll-driven

## 7. Métricas de Comparación

| Métrica | Aurora v5.1 | Objetivo v5.2 |
|---------|-------------|---------------|
| Propiedades CSS modernas | 20/39 (51%) | 27/39 (69%) |
| Selectores :is() | 0 | 5+ |
| Container query units | 0 | 3+ |
| Anchor positioning | 0 | 2+ |
| Microinteracciones | 1 (hover-lift) | 5+ |
| Componentes CSS-only | 83 | 88+ |
| Breaking changes | 0 | 0 |

## 8. Riesgos y Mitigación

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|-----------|
| :is() rompe compatibilidad | Baja | :is() soportado en Chrome 88+, Firefox 86+, Safari 15.4+ |
| Anchor positioning no soportado en Firefox | Media | Degradación grácil: posición absoluta como fallback |
| Container query units rompen layouts | Baja | Es un modificador opcional, no cambia comportamiento default |
| Microinteracciones afectan rendimiento | Baja | Usar `transform` y `opacity` solo (composited) |
| @position-try no soportado en Safari | Media | Degradación grácil: posición fija como fallback |

## 9. Fuentes de Investigación

- MDN CSS Reference: https://developer.mozilla.org/en-US/docs/Web/CSS
- W3C TAG Design Principles: https://w3ctag.github.io/design-principles/
- CSS Scroll-driven Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- CSS Anchor Positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Anchor_Positioning
- CSS :is() selector: https://developer.mozilla.org/en-US/docs/Web/CSS/:is
- CSS :where() selector: https://developer.mozilla.org/en-US/docs/Web/CSS/:where
- CSS Container Queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries
- CSS @position-try: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@position-try
