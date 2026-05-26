---
name: glass-refraction
---

# Glass Refraction - Liquid Glass Design System

- **URL:** https://github.com/Z1Code/glass-refraction
- **Categoría:** Frontend / CSS / Design Systems
- **¿Qué hace?:**
  Sistema de diseño "Liquid Glass" inspirado en Apple (WWDC 2025) y la investigación de refacción SVG de kube.io. Proporciona tres niveles de efecto "glassmorphism" con shimmer animado, highlights especulares, dispersión cromática en bordes y filtros SVG de refacción. Se puede usar de dos formas:
  - **CSS-only:** importar `glass-refraction/css` y usar clases (`glass`, `glass-card`, `glass-pill`) en cualquier framework o HTML vanilla.
  - **React:** componentes `<Glass>`, `<GlassCard>`, `<GlassPill>`, y `<GlassFilters>` (SVG filters para refacción).
- **Casos de uso:**
  - Navbars y footers con efecto frosted glass denso (`.glass`)
  - Cards y paneles de contenido con hover lift y specular highlight (`.glass-card`)
  - Tags, badges y pills inline (`.glass-pill`)
  - Hero sections con refacción SVG fuerte (`#glass-refract-strong`)
  - Dashboards con tema oscuro y elementos translúcidos
- **Patrones CSS útiles:**

  **1. Glassmorphism denso con shimmer animado y highlights especulares (.glass):**
  ```css
  .glass {
    position: relative;
    isolation: isolate;
    border-radius: var(--gr-radius);
    /* Shimmer sweep + translucent frosted base */
    background:
      linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%),
      linear-gradient(135deg, var(--gr-bg-start), var(--gr-bg-end));
    background-size: 200% 100%, 100% 100%;
    animation: glass-shimmer var(--gr-shimmer-duration) ease-in-out infinite;
    /* Frosted glass core: blur + color boost + brightness lift */
    -webkit-backdrop-filter: blur(var(--gr-blur)) saturate(var(--gr-saturation)) brightness(1.08);
    backdrop-filter: blur(var(--gr-blur)) saturate(var(--gr-saturation)) brightness(1.08);
    /* Ring border + inset highlight + depth shadow */
    box-shadow:
      0 0 0 0.5px rgba(255,255,255,0.10),
      inset 0 1px 0 rgba(255,255,255,0.12),
      0 4px 24px -4px rgba(0,0,0,0.30);
  }
  ```

  **2. Specular highlight con ::before (glow overhead + línea superior):**
  ```css
  .glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 45%),
      linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.55) 50%, transparent 92%);
    background-size: 100% 100%, 100% 1px;
    animation: specular-breathe var(--gr-specular-duration) ease-in-out infinite;
    pointer-events: none;
    z-index: 3;
  }
  ```

  **3. Dispersión cromática con ::after (4 gradientes radiales + bordes de colores):**
  ```css
  .glass::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(ellipse 55% 50% at 12% 50%, var(--gr-chromatic-blue) 0%, transparent 70%),
      radial-gradient(ellipse 50% 55% at 50% 12%, var(--gr-chromatic-violet) 0%, transparent 70%),
      radial-gradient(ellipse 55% 50% at 88% 50%, var(--gr-chromatic-pink) 0%, transparent 70%),
      radial-gradient(ellipse 50% 55% at 50% 88%, var(--gr-chromatic-green) 0%, transparent 70%);
    /* Chromatic inset edges — cada lado refracta una longitud de onda distinta */
    box-shadow:
      inset  1px  0 0 0 rgba(0,180,255,0.07),
      inset -1px  0 0 0 rgba(255,100,200,0.07),
      inset  0  1px 0 0 rgba(100,255,180,0.05),
      inset  0 -1px 0 0 rgba(255,200,50,0.05);
    opacity: 0.8;
    pointer-events: none;
    z-index: 2;
  }
  ```

  **4. Card con hover lift + chromatic edges en hover (.glass-card):**
  ```css
  .glass-card {
    position: relative;
    isolation: isolate;
    border-radius: var(--gr-radius-card);
    background: linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(15,18,30,0.52) 100%);
    backdrop-filter: blur(var(--gr-blur-card)) saturate(var(--gr-saturation-card));
    box-shadow:
      0 0 0 0.5px rgba(255,255,255,0.06),
      inset 0 1px 0 rgba(255,255,255,0.08),
      0 2px 12px -4px rgba(0,0,0,0.3);
    transition:
      transform 0.35s cubic-bezier(0.4,0,0.2,1),
      box-shadow 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .glass-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 0.5px rgba(255,255,255,0.14),
      inset 0 1px 0 rgba(255,255,255,0.18),
      0 8px 32px -8px rgba(0,0,0,0.45);
  }
  ```

  **5. Specular line superior en cards:**
  ```css
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 14%;
    right: 14%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.30) 50%, transparent);
    pointer-events: none;
    z-index: 3;
  }
  ```

  **6. Pill ligero con backdrop-filter mínimo (.glass-pill):**
  ```css
  .glass-pill {
    display: inline-block;
    border-radius: var(--gr-radius-pill);
    backdrop-filter: blur(var(--gr-blur-pill)) saturate(var(--gr-saturation-pill));
    background: rgba(255,255,255,0.05);
    box-shadow:
      0 0 0 0.5px rgba(255,255,255,0.08),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transition: all 0.25s ease;
  }
  .glass-pill:hover {
    background: rgba(255,255,255,0.09);
    box-shadow:
      0 0 0 0.5px rgba(255,255,255,0.14),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }
  ```

  **7. Animaciones de shimmer y specular breathing:**
  ```css
  @keyframes glass-shimmer {
    0%   { background-position: -200% 0, 0 0; }
    100% { background-position:  200% 0, 0 0; }
  }
  @keyframes specular-breathe {
    0%, 100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
  ```

  **8. Patrón de ::before/::after con z-index y pointer-events:**
  - `isolation: isolate` en el elemento padre crea un nuevo contexto de apilamiento.
  - `::before` (z-index: 3) para specular highlight, `::after` (z-index: 2) para dispersión cromática.
  - Ambos con `pointer-events: none` para no interferir con interacciones.
  - `border-radius: inherit` para heredar el radio del padre.

  **9. Patrón de SVG refacción (feTurbulence + feDisplacementMap):**
  ```xml
  <filter id="glass-refract" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <!-- Pre-blur para suavizar -->
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="preblur" />
    <!-- Ruido fractal como mapa de desplazamiento -->
    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.012" numOctaves="2" seed="42" result="noise" />
    <!-- Suavizar el ruido -->
    <feGaussianBlur in="noise" stdDeviation="3" result="smooth" />
    <!-- Desplazamiento basado en el ruido -->
    <feDisplacementMap in="preblur" in2="smooth" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
    <!-- Boost de saturación post-refacción -->
    <feColorMatrix in="displaced" type="saturate" values="1.3" />
  </filter>
  ```
  Aplicar en CSS: `filter: url(#glass-refract);`

- **Cómo integrarlo en proyectos:**

  **Opción A — npm package (React):**
  ```bash
  npm install glass-refraction
  ```
  ```tsx
  import { GlassFilters, Glass, GlassCard, GlassPill } from 'glass-refraction';

  export default function App() {
    return (
      <>
        <GlassFilters /> {/* Mount SVG filters once at root */}
        <Glass as="nav" className="px-4 py-3">Navbar</Glass>
        <GlassCard className="p-6"><h2>Title</h2><p>Content</p></GlassCard>
        <GlassPill className="px-3 py-1">Tag</GlassPill>
      </>
    );
  }
  ```

  **Opción B — CSS-only (cualquier framework):**
  ```css
  @import 'glass-refraction/css';
  ```
  ```html
  <nav class="glass">Navbar</nav>
  <div class="glass-card">Content card</div>
  <span class="glass-pill">Badge</span>
  ```

  **Opción C — Vanilla HTML con SVG inline:**
  Descargar `dist/css/glass.css` e incluir SVG filters inline:
  ```html
  <link rel="stylesheet" href="dist/css/glass.css" />
  <svg class="sr-only" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="glass-refract" x="-5%" y="-5%" width="110%" height="110%"
              color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="preblur"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.012" numOctaves="2" seed="42" result="noise"/>
        <feGaussianBlur in="noise" stdDeviation="3" result="smooth"/>
        <feDisplacementMap in="preblur" in2="smooth" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
        <feColorMatrix in="displaced" type="saturate" values="1.3"/>
      </filter>
    </defs>
  </svg>
  ```

  **Tematización:** Sobrescribir las CSS custom properties en `:root`:
  ```css
  :root {
    --gr-blur: 26px;
    --gr-saturation: 1.7;
    --gr-bg-start: rgba(18, 22, 35, 0.48);
    --gr-bg-end: rgba(12, 16, 28, 0.42);
    --gr-chromatic-blue: rgba(0, 180, 255, 0.045);
    --gr-chromatic-violet: rgba(120, 80, 255, 0.04);
    --gr-chromatic-pink: rgba(255, 100, 200, 0.035);
    --gr-chromatic-green: rgba(100, 255, 180, 0.025);
    --gr-shimmer-duration: 7s;
    --gr-specular-duration: 5s;
  }
  ```

  **Compatibilidad:** Requiere `backdrop-filter` (Chrome 76+, Safari 9+, Firefox 103+, Edge 79+). Los SVG filters funcionan en todos los navegadores modernos.

- **Fecha de aprendizaje:** 2026-05-26
