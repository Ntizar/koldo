# Patrones Comunes en Design Systems

Guía de patrones y mejores prácticas que se repiten en los design systems profesionales más destacados. Basado en el análisis de [alexpate/awesome-design-systems](https://github.com/alexpate/awesome-design-systems).

---

## 1. Tokens de Diseño (Design Tokens)

Los design tokens son los valores atómicos que definen la identidad visual de un sistema. Son la base sobre la que se construyen todos los componentes.

### Colores (Color Tokens)

La mayoría de design systems definen:

- **Color system semántico:** `primary`, `secondary`, `success`, `warning`, `error`, `info`
- **Escala de grises:** `gray-50` hasta `gray-900` (10+ niveles)
- **Color de fondo:** `bg-surface`, `bg-elevated`, `bg-overlay`
- **Color de texto:** `text-primary`, `text-secondary`, `text-disabled`, `text-inverse`
- **Color de borde:** `border-default`, `border-strong`, `border-focus`
- **Color de focus:** `focus-ring` con outline visible

**Ejemplos:**
- **Stripe:** Sistema de color con gradientes sutiles y estados interactivos ricos
- **Linear:** Paleta oscura por defecto con acentos púrpura/violeta
- **Material Design:** Sistema de color con tonalidades (50-950) y roles semánticos

### Espaciado (Spacing Tokens)

- **Escala base:** Generalmente múltiplos de 4px o 8px (`4, 8, 12, 16, 24, 32, 48, 64...`)
- **Tokens semánticos:** `space-xs`, `space-sm`, `space-md`, `space-lg`, `space-xl`
- **Consistencia:** Mismo valor de spacing para padding y margin en toda la UI

**Ejemplos:**
- **AWS Cloudscape:** Espaciado compacto optimizado para dashboards con alta densidad
- **Chakra UI:** Sistema de tokens completamente personalizable con `theme.space`

### Tipografía (Typography Tokens)

- **Font families:** 1-2 fuentes principales (ej. Geist Sans + Geist Mono en Vercel)
- **Escalas de tipo:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`
- **Line heights:** Relativos al font-size para legibilidad (1.2-1.6)
- **Font weights:** `normal` (400), `medium` (500), `semibold` (600), `bold` (700)
- **Letter spacing:** Ajustes para títulos y texto pequeño

**Ejemplos:**
- **Vercel (Geist):** Tipografía propietaria optimizada para pantallas de alta resolución
- **IBM Carbon:** Sistema tipográfico con 5 pesos y múltiples lang sets
- **Salesforce Lightning:** Tipografía adaptativa con fallbacks robustos

### Breakpoints y Responsive

- **Mobile-first:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- **Grid system:** 12-column grid con gutters consistentes
- **Container max-widths:** `sm`, `md`, `lg`, `xl`

---

## 2. Componentes Base

Los componentes fundamentales que todo design system incluye:

### Buttons

| Propiedad | Valores típicos |
|---|---|
| **Variants** | `primary`, `secondary`, `ghost`, `destructive`, `link` |
| **Sizes** | `sm`, `md`, `lg` |
| **States** | `default`, `hover`, `active`, `disabled`, `loading` |
| **Props** | `variant`, `size`, `disabled`, `loading`, `leftIcon`, `rightIcon` |

**Patrones clave:**
- Un botón primario visible por sección (jerarquía visual)
- Feedback visual en hover/active/disabled
- Estado de loading con spinner
- Iconos opcionales a izquierda/derecha

**Ejemplos:**
- **Stripe:** Botones con gradientes sutiles y animaciones de transición
- **Linear:** Botones minimalistas con estados de hover elegantes
- **Chakra UI:** Sistema de variant basado en configuración

### Inputs (Form Controls)

- **Text input:** `label`, `placeholder`, `helperText`, `error`, `disabled`, `readOnly`
- **Select/Dropdown:** `options`, `searchable`, `multi-select`, `creatable`
- **Textarea:** `rows`, `maxLength`, `autoResize`
- **Checkbox/Radio:** `checked`, `indeterminate`, `disabled`
- **Toggle/Switch:** `checked`, `disabled`, `size`
- **Date picker:** `range`, `dateTime`, `timeOnly`
- **Validation:** Mensajes de error inline, validación en blur/change, required indicators

**Patrones clave:**
- Labels siempre visibles (no solo placeholder)
- Mensajes de error descriptivos y accesibles
- Estados de loading en formularios
- Autocomplete y autofill support

**Ejemplos:**
- **Atlassian:** Formularios complejos con validación en tiempo real
- **AWS Cloudscape:** Inputs optimizados para alta densidad de datos
- **Shopify Polaris:** Formularios con validación contextual y tooltips

### Cards

- **Estructura:** Header (icono + título + acciones), Body (contenido), Footer (acciones)
- **Variants:** `elevated`, `bordered`, `interactive` (clickable)
- **Sizes:** `sm`, `md`, `lg`
- **Content:** Soporte para imágenes, iconos, badges, avatars

**Patrones clave:**
- Consistencia en padding y border-radius
- Jerarquía clara de contenido
- Acciones consistentes en header/footer
- Estados hover para cards interactivas

### Modals / Dialogs

- **Variants:** `alert`, `confirm`, `form`, `drawer`, `popover`, `tooltip`
- **Props:** `open`, `title`, `description`, `children`, `footer`, `onClose`, `closeOnOverlay`
- **Anchoring:** `center`, `top`, `bottom`, `right`, `left`
- **Focus management:** Trap focus dentro del modal, restore focus al abrir/cerrar

**Patrones clave:**
- No más de 1 modal a la vez (nested modals desaconsejados)
- Botón de cierre siempre visible
- Overlay oscuro con opacity configurable
- Animaciones de entrada/salida suaves
- Focus trap y ARIA attributes

**Ejemplos:**
- **Stripe:** Modals con animaciones fluidas y diseño limpio
- **Linear:** Modals minimalistas con transiciones rápidas
- **IBM Carbon:** Sistema de overlay con múltiples variantes

---

## 3. Voice & Tone Guidelines

Las guías de voz y tono definen cómo debe comunicarse el producto con los usuarios.

### Elementos clave

1. **Personalidad del producto:** ¿Es formal, casual, técnico, amigable?
2. **Tono por contexto:** Diferente para errores vs. éxito vs. onboarding
3. **Convenciones de lenguaje:** Mayúsculas, puntuación, abreviaturas
4. **Terminología:** Glosario de términos del dominio

### Ejemplos notables

- **Duolingo:** Tono juguetón, motivador, con humor. Usa emojis y lenguaje informal.
- **Monzo:** Conversacional, directo, empático. El tono de voz es parte de su marca.
- **BBC GEL:** Formal, claro, consistente. Adaptado para audiencia masiva del UK.
- **Contentful Forma 36:** Técnico pero accesible. Guías de microcopy para estados de UI.
- **Stripe:** Claro, profesional, con toques de humor sutil. Referencia en microcopy de UI.
- **Shopify Polaris:** Empoderador, claro, inclusivo. Guías extensivas de microcopy.

### Patrones de microcopy

- **Botones:** Verbos de acción (`Save`, `Delete`, `Create`)
- **Errores:** Describir el problema + solución (`Email ya registrado. ¿Olvidaste tu contraseña?`)
- **Loading:** Mensajes contextuales (`Guardando cambios...`)
- **Empty states:** Explicar qué falta + acción sugerida
- **Tooltips:** Breves, descriptivos, no reemplazan labels

---

## 4. Accesibilidad (a11y)

Todos los design systems serios incluyen accesibilidad como requisito fundamental.

### Principios WCAG 2.1 (Nivel AA)

| Principio | Descripción |
|---|---|
| **Perceptible** | Info y UI presentes deben ser presentables de formas que los usuarios puedan percibir |
| **Operable** | Componentes de UI y navegación deben ser operables por todos los usuarios |
| **Comprensible** | Info y operación de la UI deben ser comprensibles |
| **Robusto** | Contenido debe ser lo suficientemente robusto para ser interpretado por diversas UA |

### Implementaciones clave

#### 1. Contraste de color
- **Ratio mínimo:** 4.5:1 para texto normal, 3:1 para texto grande
- **Herramientas:** WCAG contrast checker integrado en cada design system
- **Ejemplos:** IBM Carbon incluye checker de contraste; Material Design tiene guías de color accesible

#### 2. Navegación por teclado
- **Tab order:** Lógico y predecible
- **Focus visible:** Outline siempre visible en elementos focusables
- **Skip links:** Enlace para saltar navegación principal
- **Focus trap:** En modals, drawers, menus desplegables

#### 3. ARIA attributes
- **Roles:** `role="dialog"`, `role="alert"`, `role="navigation"`
- **Estados:** `aria-expanded`, `aria-disabled`, `aria-checked`, `aria-selected`
- **Descripciones:** `aria-label`, `aria-labelledby`, `aria-describedby`
- **Live regions:** `aria-live="polite"` para actualizaciones dinámicas

#### 4. Screen reader support
- **Labels:** Todos los inputs con label asociado
- **Icons:** `aria-hidden="true"` en iconos decorativos, `aria-label` en iconos funcionales
- **Semantic HTML:** Usar `<button>`, `<nav>`, `<main>`, `<header>` correctamente

#### 5. Reducción de movimiento
- **prefers-reduced-motion:** Respetar preferencia del sistema operativo
- **Animaciones:** Opcionales, con fallback a transiciones instantáneas

#### 6. Responsive y touch
- **Touch targets:** Mínimo 44x44px (Apple HIG) / 48x48px (Material)
- **Zoom:** Soporte hasta 200% sin pérdida de funcionalidad
- **Orientación:** Funcional en portrait y landscape

### Ejemplos de implementación

- **IBM Carbon:** Testing automatizado de accesibilidad en CI, guías detalladas
- **Microsoft Fluent UI:** Soporte nativo para screen readers, testing con NVDA/JAWS
- **GOV.UK:** Estándares gubernamentales UK, testing con usuarios reales
- **U.S. Web Design Standards:** Cumplimiento Section 508, testing exhaustivo
- **Chakra UI:** Accesibilidad por defecto en todos los componentes

---

## Resumen de patrones

| Patrón | Componentes clave | Design systems de referencia |
|---|---|---|
| **Tokens de color** | Sistema semántico, escala de grises, estados | Stripe, Linear, Material Design |
| **Tokens de espaciado** | Escala base 4/8px, tokens semánticos | Chakra UI, AWS Cloudscape |
| **Tokens tipográficos** | Font families, escalas, line heights | Vercel (Geist), IBM Carbon |
| **Buttons** | Variants, sizes, states, icons | Stripe, Linear, Chakra UI |
| **Form inputs** | Text, select, date, validation | Atlassian, AWS Cloudscape, Polaris |
| **Cards** | Header/body/footer, variants, sizes | Stripe, Material Design |
| **Modals** | Variants, anchoring, focus trap, ARIA | Stripe, Linear, IBM Carbon |
| **Voice & Tone** | Personalidad, microcopy, glosario | Duolingo, Monzo, Stripe, Polaris |
| **Accesibilidad** | WCAG AA, ARIA, keyboard, contrast | IBM Carbon, GOV.UK, Fluent UI |
