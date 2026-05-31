# FASE 2 — Plan Maestro de Mejoras para Ntizar-Aurora
> Pipeline 9009 · 30 de mayo de 2026
> Versión: v5.1.0 → v5.2.0
> Principio: mejoras atómicas, bajas dificultades primero, 0 breaking changes

## Resumen del Plan

Se proponen **15 mejoras atómicas**, cada una implementable en una única ejecución de cron.
Ordenadas por dificultad creciente (baja → media → alta).

| # | Mejora | Dificultad | Archivo(s) afectado(s) | Impacto |
|---|--------|-----------|----------------------|---------|
| 1 | Focus ring universal | ⭐ Baja | `ntizar.css` | Accesibilidad visual | ✅ hecha 2026-05-30 |
| 2 | CSS Nesting nativo (prueba) | ⭐ Baja | `ntizar.motion.css` | Mantenibilidad | ✅ hecha 2026-05-30 |
| 3 | Expandir `:has()` a accordion | ⭐ Baja | `ntizar.ui.css` | Interactividad sin JS | ✅ hecha 2026-05-30 |
| 4 | Container Queries cards | ⭐ Baja | `ntizar.css` | Responsividad contextual | ✅ hecha 2026-05-31 |
| 5 | Bento Grid pattern | ⭐ Baja | `ntizar.patterns.css` | Layout moderno | ✅ hecha 2026-05-31 |
| 6 | Expandir `:has()` a tabs | ⭐ Baja | `ntizar.ui.css` | Interactividad sin JS | ✅ hecha 2026-05-31 |
| 7 | Glass inputs | ⭐⭐ Media | `ntizar.forms.css` | Coherencia visual | ✅ hecha 2026-05-31 |
| 8 | Glass tablas | ⭐⭐ Media | `ntizar.css` | Coherencia visual | ✅ hecha 2026-05-31 |
| 9 | Expandir `:has()` a dropdown | ⭐⭐ Media | `ntizar.ui.css` | Interactividad sin JS | ✅ hecha 2026-05-31 |
| 10 | View transitions tema/skin | ⭐⭐ Media | `ntizar.next.css` | Experiencia visual | ✅ hecha 2026-05-31 |
| 11 | Subgrid para layouts anidados | ⭐⭐ Media | `ntizar.css` | Layout preciso | ✅ hecha 2026-05-31 |
| 12 | CSS Houdini gradientes | ⭐⭐ Media | `ntizar.next.css` | Rendimiento visual |
| 13 | Nav glass pattern | ⭐⭐ Media | `ntizar.patterns.css` | Coherencia visual |
| 14 | Sistema de tonalidad superficies | ⭐⭐⭐ Alta | `ntizar.next.css` + `ntizar.css` | Profundidad visual |
| 15 | CSS-only dropdown avanzado | ⭐⭐⭐ Alta | `ntizar.ui.css` | Cero JS |

---

## Detalle de Cada Mejora

### Mejora 1: Focus Ring Universal
**Descripción:** Actualizar el `:focus-visible` de todos los componentes para usar un doble anillo de foco (interior + exterior) en TODOS los skins, no solo en el skin `contrast`. El anillo interior usa el color de fondo del componente, el exterior usa el color brand.

**Archivos afectados:**
- `ntizar.css` — capa `ntizar.base`, regla `:focus-visible`

**Dificultad:** ⭐ Baja (10-15 líneas CSS)

**Verificación:**
- [ ] Todos los componentes interactivos muestran doble anillo de foco en tema light y dark
- [ ] El anillo interior coincide con el fondo del componente (usando `color-mix()`)
- [ ] El anillo exterior usa `--nz-color-brand`
- [ ] Funciona en skin aurora, sunset, midnight, ocean, citrus
- [ ] No afecta a elementos no interactivos (`<span>`, `<div>` estáticos)

**Comando de prueba:** Abrir gallery.html → navegar con Tab → verificar doble anillo en botones, inputs, links, tabs, dropdowns.

---

### Mejora 2: CSS Nesting Nativo (Prueba de Concepto)
**Descripción:** Refactorizar el pack `ntizar.motion.css` para usar la sintaxis de nesting nativo de CSS (`&` dentro de selectores) en lugar de selectores planos BEM. Esto reduce la verbosidad un ~30% y mejora la mantenibilidad.

**Archivos afectados:**
- `ntizar.motion.css` — completo

**Dificultad:** ⭐ Baja (refactorización mecánica, ~200 líneas)

**Verificación:**
- [ ] Todas las animaciones funcionan igual que antes
- [ ] `npm run validate` pasa sin errores
- [ ] `gallery.html` muestra las mismas animaciones
- [ ] No hay cambios en el tamaño del archivo (o reducción)
- [ ] Compatibilidad: Chrome 116+, Firefox 117+, Safari 16.1+ (ya soportado por Aurora)

**Comando de prueba:** `npm run validate && open gallery.html`

---

### Mejora 3: Expandir `:has()` a Accordion
**Descripción:** Añadir estilos reactivos al accordion usando `:has()`. Cuando un `<details>` está abierto, el título cambia de color y aparece un indicador visual. También se puede resaltar la fila del accordion cuando el usuario pasa el mouse sobre cualquier parte del item.

**Archivos afectados:**
- `ntizar.ui.css` — sección accordion

**Dificultad:** ⭐ Baja (15-20 líneas CSS)

**Verificación:**
- [ ] Al abrir un accordion item, el título cambia a color brand
- [ ] Al hacer hover sobre cualquier parte del item, se resalta toda la fila
- [ ] No se rompe la animación de apertura actual
- [ ] Funciona con `prefers-reduced-motion`

**Comando de prueba:** Abrir gallery.html → sección UI → Accordion → probar interacciones.

---

### Mejora 4: Container Queries para `.nz-card`
**Descripción:** Hacer que `.nz-card` reaccione al tamaño de su contenedor usando `@container`. Cuando el contenedor es estrecho (< 400px), la card cambia a layout vertical compacto. Cuando es ancho, usa layout horizontal con imagen a la izquierda.

**Archivos afectados:**
- `ntizar.css` — componente `.nz-card`
- `gallery.html` — demo con contenedores de diferentes tamaños

**Dificultad:** ⭐ Baja (20-25 líneas CSS)

**Verificación:**
- [ ] `.nz-card` dentro de contenedor estrecho (< 400px) → layout vertical compacto
- [ ] `.nz-card` dentro de contenedor ancho → layout horizontal con imagen lateral
- [ ] No se rompe el layout actual de las cards
- [ ] Se añade `container-type: inline-size` al wrapper de cards en gallery.html

**Comando de prueba:** Abrir gallery.html → redimensionar ventana → verificar cambio de layout en cards.

---

### Mejora 5: Bento Grid Pattern
**Descripción:** Añadir un nuevo patrón de layout tipo "bento grid" a `ntizar.patterns.css`. Inspirado en los layouts de Apple, Linear y Figma. Grid asimétrico con celdas de diferentes tamaños que se adaptan al contenido.

**Archivos afectados:**
- `ntizar.patterns.css` — nuevo bloque `.nz-bento-grid`
- `INDEX.md` — añadir entrada en matriz de decisión
- `gallery.html` — sección demo del bento grid

**Dificultad:** ⭐ Baja (30-40 líneas CSS)

**Verificación:**
- [ ] `.nz-bento-grid` crea un grid asimétrico con `grid-template-areas`
- [ ] Modificadores: `--span-2`, `--span-3`, `--span-full` para celdas
- [ ] Responsive: se convierte en stack en pantallas pequeñas
- [ ] Demo en gallery.html con 6-8 celdas de diferentes tamaños
- [ ] Funciona con `.nz-card--glass` dentro de las celdas

**Comando de prueba:** `grep -c "nz-bento-grid" ntizar.patterns.css` (debe ser > 0) + verificar gallery.html.

---

### Mejora 6: Expandir `:has()` a Tabs
**Descripción:** Usar `:has()` para que al hacer hover sobre un tab, se previsualice el borde superior del contenido correspondiente. También: cuando un tab está activo, resaltar toda la columna vertical (list + panel).

**Archivos afectados:**
- `ntizar.ui.css` — sección tabs

**Dificultad:** ⭐ Baja (10-15 líneas CSS)

**Verificación:**
- [ ] Hover sobre tab → previsualización del borde del panel
- [ ] Tab activo → resalta toda la columna vertical
- [ ] No se rompe la funcionalidad actual de tabs
- [ ] Compatible con `prefers-reduced-motion`

**Comando de prueba:** Abrir gallery.html → sección UI → Tabs → probar hover.

---

### Mejora 7: Glass Inputs
**Descripción:** Añadir variante glass para los campos de formulario. `.nz-input--glass` con backdrop-blur, borde translúcido y fondo semitransparente. Coherente con el estilo Liquid Glass del sistema.

**Archivos afectados:**
- `ntizar.forms.css` — componente `.nz-input`

**Dificultad:** ⭐⭐ Media (15-20 líneas CSS)

**Verificación:**
- [ ] `.nz-input--glass` tiene backdrop-blur, fondo semitransparente, borde sutil
- [ ] Funciona en tema light y dark
- [ ] Funciona con todos los skins
- [ ] El placeholder y el texto son legibles (contraste AA)
- [ ] Demo en gallery.html

**Comando de prueba:** Abrir gallery.html → sección Forms → inputs glass → verificar contraste.

---

### Mejora 8: Glass Tablas
**Descripción:** Añadir variante glass para las tablas. `.nz-table--glass` con fondo semitransparente, backdrop-blur y bordes sutiles. Las celdas mantienen legibilidad sobre fondos coloridos.

**Archivos afectados:**
- `ntizar.css` — componente `.nz-table`

**Dificultad:** ⭐⭐ Media (15-20 líneas CSS)

**Verificación:**
- [ ] `.nz-table--glass` tiene fondo semitransparente y backdrop-blur
- [ ] Las celdas son legibles sobre fondos coloridos
- [ ] Los hover states de las filas funcionan correctamente
- [ ] Funciona en tema light y dark
- [ ] Demo en gallery.html con datos de ejemplo

**Comando de prueba:** Abrir gallery.html → sección core → tablas glass → verificar legibilidad.

---

### Mejora 9: Expandir `:has()` a Dropdown
**Descripción:** Usar `:has()` para que el dropdown se abra/cierre con hover (además del estado `.is-open`). También: resaltar el item del dropdown cuando el mouse está sobre él sin necesidad de JS.

**Archivos afectados:**
- `ntizar.ui.css` — componente `.nz-dropdown`

**Dificultad:** ⭐⭐ Media (20-25 líneas CSS)

**Verificación:**
- [ ] Dropdown se abre con hover sobre el trigger
- [ ] Dropdown se cierra cuando el mouse sale del área
- [ ] Los items se resaltan en hover
- [ ] El estado `.is-open` sigue funcionando para JS
- [ ] Compatible con `prefers-reduced-motion`

**Comando de prueba:** Abrir gallery.html → sección UI → Dropdown → probar hover.

---

### Mejora 10: View Transitions para Cambio de Skin
**Descripción:** Añadir transiciones suaves al cambiar de skin o tema. Usar la View Transitions API para que el cambio de color sea una animación fluida de ~300ms, no un cambio instantáneo.

**Archivos afectados:**
- `ntizar.next.css` — sección de transiciones
- `gallery.html` — botón de cambio de skin con transición

**Dificultad:** ⭐⭐ Media (15-20 líneas CSS + JS mínimo)

**Verificación:**
- [ ] Cambiar skin → transición suave de colores (~300ms)
- [ ] Cambiar tema (light/dark) → transición suave
- [ ] Funciona en Chrome/Edge (View Transitions API)
- [ ] Degradación grácil en Firefox/Safari (cambio instantáneo)
- [ ] No interfiere con animaciones existentes

**Comando de prueba:** Abrir gallery.html → cambiar skin con el selector → verificar transición.

---

### Mejora 11: Subgrid para Layouts Anidados
**Descripción:** Permitir que los grids anidados dentro de `.nz-grid` se alineen perfectamente usando CSS subgrid. Esto es crucial para dashboards donde las cards dentro de un grid necesitan compartir columnas con el grid padre.

**Archivos afectados:**
- `ntizar.css` — objetos `.nz-grid`

**Dificultad:** ⭐⭐ Media (10-15 líneas CSS)

**Verificación:**
- [ ] `.nz-grid--subgrid` activa `grid-template-columns: subgrid`
- [ ] Los items dentro del subgrid se alinean con las columnas del padre
- [ ] No se rompe el grid normal (es un modificador opcional)
- [ ] Demo en gallery.html con grid anidado

**Comando de prueba:** Abrir gallery.html → sección objects → grids anidados → verificar alineación.

---

### Mejora 12: CSS Houdini para Gradientes Animados
**Descripción:** Usar `@property` de CSS Houdini para hacer que los gradientes de Aurora sean animables directamente en CSS, sin necesidad de animar el gradiente completo. Esto permite efectos más fluidos y con mejor rendimiento.

**Archivos afectados:**
- `ntizar.next.css` — sección Aurora Mesh y gradientes

**Dificultad:** ⭐⭐ Media (20-25 líneas CSS)

**Verificación:**
- [ ] `@property --nz-gradient-angle` permite animar el ángulo del gradiente
- [ ] `@property --nz-gradient-pos` permite animar la posición de los stops
- - El Aurora Mesh se anima más suavemente
- [ ] Degradación grácil: si `@property` no es soportado, el gradiente funciona normalmente
- [ ] No afecta al rendimiento (medir con Lighthouse)

**Comando de prueba:** Abrir gallery.html → sección viz → Aurora Mesh → verificar suavidad de animación.

---

### Mejora 13: Nav Glass Pattern
**Descripción:** Añadir un patrón de navegación con efecto glass a `ntizar.patterns.css`. `.nz-nav--glass` con backdrop-blur, borde inferior translúcido y fondo semitransparente. Ideal para apps con contenido detrás del nav.

**Archivos afectados:**
- `ntizar.patterns.css` — nuevo bloque `.nz-nav--glass`
- `INDEX.md` — añadir entrada
- `gallery.html` — demo del nav glass

**Dificultad:** ⭐⭐ Media (20-25 líneas CSS)

**Verificación:**
- [ ] `.nz-nav--glass` tiene backdrop-blur, borde inferior translúcido
- [ ] Funciona en tema light y dark
- [ ] El texto es legible sobre fondos coloridos
- [ ] Demo en gallery.html con navegación real
- [ ] Compatible con `.nz-app-shell`

**Comando de prueba:** Abrir gallery.html → section patterns → nav glass → verificar look.

---

### Mejora 14: Sistema de Tonalidad para Superficies
**Descripción:** Expandir el sistema de tokens de superficie para incluir "tonalidades" — no solo colores, sino superficies con profundidad, textura y brillo. Cada color brand/accent tendrá una superficie tonal con variantes: soft, raised, pressed, glass.

**Archivos afectados:**
- `ntizar.next.css` — tokens de superficie tonal
- `ntizar.css` — componentes que usan superficies
- `DESIGN.md` — actualizar spec de superficies
- `INDEX.md` — actualizar matriz de decisión

**Dificultad:** ⭐⭐⭐ Alta (50-80 líneas CSS, múltiples archivos)

**Verificación:**
- [ ] Tokens `--nz-surface-brand-soft`, `--nz-surface-brand-raised`, `--nz-surface-brand-pressed`
- [ ] Tokens `--nz-surface-accent-soft`, `--nz-surface-accent-raised`, `--nz-surface-accent-pressed`
- [ ] Modificadores `.nz-surface--brand-soft`, `.nz-surface--brand-raised`, etc.
- [ ] Funciona en tema light y dark
- [ ] Funciona en todos los skins
- [ ] Demo en gallery.html
- [ ] `npm run validate` pasa sin errores

**Comando de prueba:** `npm run validate && open gallery.html`

---

### Mejora 15: CSS-Only Dropdown Avanzado
**Descripción:** Crear un dropdown completamente CSS usando `:has()` que maneje apertura/cierre, cierre al hacer click fuera, y cierre al presionar Escape. Sin una línea de JavaScript.

**Archivos afectados:**
- `ntizar.ui.css` — componente `.nz-dropdown` (refactorización completa)
- `INDEX.md` — actualizar documentación
- `gallery.html` — demo sin JavaScript

**Dificultad:** ⭐⭐⭐ Alta (40-50 líneas CSS, lógica compleja)

**Verificación:**
- [ ] Dropdown se abre con click en el trigger (usando `:has()` y checkbox hack o `:focus-within`)
- [ ] Se cierra al hacer click fuera
- [ ] Se cierra con Escape
- [ ] Funciona con submenús anidados
- [ ] Compatible con `prefers-reduced-motion`
- [ ] Demo en gallery.html sin JavaScript

**Comando de prueba:** Abrir gallery.html → sección UI → dropdown avanzado → probar sin JS.

---

## Resumen de Priorización

### Sprint 1 (Semana 1) — Mejoras Bajas (1-6)
| # | Mejora | Tiempo estimado |
|---|--------|----------------|
| 1 | Focus ring universal | 30 min |
| 2 | CSS Nesting nativo | 1 hora | ✅ hecha 2026-05-30 |
| 3 | `:has()` accordion | 30 min | ✅ hecha 2026-05-30 |
| 4 | Container Queries cards | 1 hora | ✅ hecha 2026-05-31 |
| 5 | Bento grid pattern | 1 hora | ✅ hecha 2026-05-31 |
| 6 | `:has()` tabs | 30 min | ✅ hecha 2026-05-31 |
| **Total** | | **~4 horas** |

### Sprint 2 (Semana 2) — Mejoras Medias (7-13)
| # | Mejora | Tiempo estimado |
|---|--------|----------------|
| 7 | Glass inputs | 1 hora | ✅ hecha 2026-05-31 |
| 8 | Glass tablas | 1 hora |
| 9 | `:has()` dropdown | 1.5 horas | ✅ hecha 2026-05-31 |
| 10 | View transitions skin | 1.5 horas |
| 11 | Subgrid layouts | 1 hora | ✅ hecha 2026-05-31 |
| 12 | CSS Houdini gradientes | 1.5 horas |
| 13 | Nav glass pattern | 1 hora |
| **Total** | | **~8 horas** |

### Sprint 3 (Semana 3) — Mejoras Altas (14-15)
| # | Mejora | Tiempo estimado |
|---|--------|----------------|
| 14 | Sistema tonalidad superficies | 3-4 horas |
| 15 | CSS-only dropdown avanzado | 3-4 horas |
| **Total** | | **~7 horas** |

## Métricas de Éxito

| Métrica | Actual | Objetivo v5.2 |
|---------|--------|--------------|
| Componentes con container-queries | 0 | 1 (.nz-card) |
| Componentes con glass | 3 (card, surface, btn) | 7 (+ input, input--glass-strong, input--glass-brand, input--glass-accent, table, nav) |
| Componentes con :has() reactivo | 1 (.nz-accordion) | 5 (accordion ✅, tabs ✅, dropdown ✅, dropdown avanzado) |
| Skins con focus ring universal | 1 (contrast) | 6 (todos) |
| Patrones de layout | 8 | 9 (+ bento grid) |
| Componentes con subgrid | 0 | 1 (.nz-grid--subgrid) |
| Breaking changes | 0 | 0 |
| Tokens nuevos | 0 | ~12 |
| Líneas CSS nuevas | 0 | ~300-400 |

## Riesgos y Mitigación

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|-----------|
| CSS nesting no soportado en Safari antiguo | Baja (Safari 16.1+) | Aurora ya requiere Safari moderno para v5 features |
| Container queries rompen layouts existentes | Baja | Es un modificador opcional (`--container`), no cambia comportamiento default |
| View transitions API solo en Chrome | Media | Degradación grácil: cambio instantáneo en otros navegadores |
| `:has()` dropdown es complejo | Media | Probar primero con accordion/tabs, escalar gradualmente |
| CSS Houdini no soportado en Firefox | Media | `@property` es condicional: si no se soporta, el gradiente funciona normalmente |
