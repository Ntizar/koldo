---
name: liquid-glass-css
description: "CSS con efecto Liquid Glass estilo Esios/Aurora — gradientes azul+naranja, backdrop-filter glass, grid patterns y orbes radiales. Reutilizable para cualquier portfolio o dashboard de Ntizar."
version: 1.0.0
author: Koldo
tags: [css, liquid-glass, aurora, esios, portfolio, design, glassmorphism]
---

# Liquid Glass CSS — Estilo Esios/Aurora

CSS con efecto Liquid Glass basado en el estilo visual del dashboard ESIOS y Aurora de Ntizar. Azul (#2563eb) + Naranja (#f97316) con efectos de cristal translúcido.

## Cuando usar

- Crear portfolios web para Ntizar
- Diseñar dashboards con el estilo Esios/Aurora
- Cualquier interfaz que necesite glassmorphism profesional
- Portfolios públicos + dashboards privados

## Variables CSS principales

```css
:root {
  --nz-color-brand: #2563eb;        /* Azul principal */
  --nz-color-brand-dark: #1d4ed8;   /* Azul oscuro */
  --nz-color-accent: #f97316;       /* Naranja */
  --nz-color-accent-dark: #ea580c;  /* Naranja oscuro */
  --nz-border-glass: rgba(37, 99, 235, 0.16);
  --nz-text-muted: #475569;
  --nz-text-soft: #64748b;
  --glass-bg: linear-gradient(145deg, rgba(255,255,255,0.82), rgba(239,246,255,0.68) 62%, rgba(255,247,237,0.7));
  --glass-border: rgba(37, 99, 235, 0.14);
  --glass-shadow: 0 12px 34px rgba(37, 99, 235, 0.10), inset 0 1px 0 rgba(255,255,255,0.86);
  --glass-blur: blur(18px) saturate(145%);
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

## Componentes reutilizables

### Glass (mixin base)
```css
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-shadow);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}
```

### Glass Strong (header, modales)
```css
.glass-strong {
  background: linear-gradient(145deg, rgba(255,255,255,0.92), rgba(219,234,254,0.82) 56%, rgba(255,237,213,0.76));
  border: 1px solid rgba(37, 99, 235, 0.18);
  box-shadow: 0 18px 45px rgba(37, 99, 235, 0.12), inset 0 1px 0 rgba(255,255,255,0.9);
  backdrop-filter: blur(22px) saturate(145%);
}
```

### Background pattern
```css
body::before {
  content: "";
  position: fixed; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(37,99,235,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.08));
}

body::after {
  content: "";
  position: fixed; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 600px 400px at 10% 20%, rgba(37,99,235,0.08) 0%, transparent 70%),
    radial-gradient(ellipse 500px 500px at 85% 70%, rgba(249,115,22,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 400px 300px at 50% 90%, rgba(37,99,235,0.05) 0%, transparent 70%);
}
```

### App Cards
```css
.app-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
  backdrop-filter: var(--glass-blur);
  transition: all 0.3s ease;
}
.app-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15);
}
```

### Status badges
```css
.app-status.active { color: #16a34a; background: rgba(22, 163, 74, 0.1); }
.app-status.planned { color: #f97316; background: rgba(249, 115, 22, 0.1); }
.app-status.offline { color: #dc2626; background: rgba(220, 38, 38, 0.1); }
```

### Botones
```css
.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 4px 12px rgba(37,99,235,0.25);
}
.btn-accent {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  box-shadow: 0 4px 12px rgba(249,115,22,0.25);
}
.btn-ghost {
  background: rgba(255,255,255,0.5);
  color: #475569;
  border: 1px solid rgba(37, 99, 235, 0.16);
}
```

## Estructura HTML típica

```html
<!-- Hero -->
<header class="hero-header">
  <div class="hero-kicker">NaN Builders</div>
  <h1 class="hero-title">Nombre <span class="accent">Subtítulo</span></h1>
  <p class="hero-subtitle">Descripción</p>
  <div class="hero-actions">
    <a href="#" class="btn btn-primary">🚀 Ver</a>
    <button class="btn btn-accent">🔐 Admin</button>
  </div>
</header>

<!-- Nav tabs -->
<div class="nav-tabs">
  <button class="nav-tab active" data-filter="all">Todas</button>
  <button class="nav-tab" data-filter="data">📊 Data</button>
</div>

<!-- App grid -->
<div class="apps-grid">
  <a href="#" class="app-card featured" data-category="data">
    <div class="app-icon">⚡</div>
    <div class="app-info">
      <div class="app-name">App Name</div>
      <div class="app-desc">Description</div>
    </div>
    <div class="app-meta">
      <span class="app-status active"><span class="dot"></span> Activo</span>
    </div>
  </a>
</div>
```

## Responsive

```css
@media (max-width: 768px) {
  .apps-grid { grid-template-columns: 1fr; }
  .admin-grid { grid-template-columns: 1fr; }
  .admin-metrics { grid-template-columns: repeat(2, 1fr); }
  .kanban-board { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .admin-metrics { grid-template-columns: 1fr; }
}
```

## ⚠️ Pitfalls

- **No mezclar tema claro/oscuro** — este estilo es CLARO por defecto. Si necesitas oscuro, cambia los colores base y los gradientes de fondo.
- **backdrop-filter no funciona en Safari antiguo** — siempre incluir `-webkit-backdrop-filter` como fallback.
- **El grid pattern de fondo puede ser pesado** — en móviles de gama baja, considera quitar `body::before` con `@media (prefers-reduced-motion)`.
- **Las animaciones `fadeInUp` con delay** — si tienes más de 6 cards, el delay acumulativo hace que las últimas aparezcan tarde. Ajusta el `nth-child` o usa `IntersectionObserver`.

## Ntizar Aurora (v5.1 Constellation) — Sistema de diseño propio

Aurora es el sistema de diseño propio de Ntizar, versionado v5.1. Es la fuente de verdad para el estilo Azul+Naranja.

**Repo:** https://github.com/Ntizar/Ntizar-Aurora
**CDN:** jsDelivr público disponible
**Stack:** CSS-only, sin dependencias, ~170KB total (10 packs opcionales)
**Version pin:** Reemplazar `@master` con `@v5.1.0` en CDN URLs para producción

### CDN público
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.next.css">
```

### Arquitectura Constellation (11 packs + next)

| Archivo | Contenido | Cargar cuando |
|---------|-----------|---------------|
| `ntizar.css` | Core (≈40KB): tokens, base, objects, componentes base, utilities | **Siempre** |
| `ntizar.themes.css` | 5 skins + paleta charts | Quieras cambiar identidad |
| `ntizar.data.css` | KPIs, stat-tile, progress, meter, skeletons, avatars, timeline, tags | Dashboards/data-heavy |
| `ntizar.charts.css` | `.nz-chart` contenedor, legends, tooltips, sparkline CSS-only, donut | Gráficos |
| `ntizar.maps.css` | `.nz-map` para Leaflet/Mapbox/MapLibre, overlays HUD, pins | Mapas |
| `ntizar.viz.css` | Stages full-bleed para three.js, fondos aurora, orbs, glow rings | 3D/generative art |
| `ntizar.motion.css` | reveal/rise/scale/glow/aurora-pan/shimmer, marquee, typing, hover-lift | Animaciones |
| `ntizar.forms.css` | Switch, OTP, file drop, range, stepper, input-group, form-grid | Formularios |
| `ntizar.ui.css` | Modal, drawer, tabs, accordion, dropdown, toast, tooltip, command-bar | Overlays/interacciones |
| `ntizar.patterns.css` | App-shell, hero, pricing, FAQ, footer, auth-shell, empty-state | Páginas completas |
| `ntizar.next.css` | **v5**: Liquid Glass real, OKLCH, multi-axis, mesh, forced-colors | Capa disruptiva |

**Cada pack es stateless e idempotente.** Puedes cargar 1 o los 11 sin colisiones.

### 6 Skins Runtime
- `aurora` — Default, azul (#2563eb) + naranja (#f97316)
- `sunset` — Tonos cálidos
- `midnight` — Oscuro profundo
- `ocean` — Tonos azules
- `citrus` — Tonos amarillos/naranjas
- `contrast` — WCAG AAA

### Multi-axis Theming (v5 / next.css)
```html
<body class="nz"
      data-nz-theme="light"
      data-nz-skin="aurora"
      data-nz-shape="default"        <!-- sharp | rounded | brutalist -->
      data-nz-density="comfortable"  <!-- compact | spacious -->
      data-nz-motion="standard"      <!-- springy | calm | none -->
      data-nz-color-system="hex">    <!-- oklch -->
```

### 6 Skins
- `aurora` — Default, azul + naranja
- `sunset` — Tonos cálidos
- `midnight` — Oscuro profundo
- `ocean` — Tonos azules
- `citrus` — Tonos amarillos/naranjas
- `contrast` — WCAG AAA

### Principios
- **CSS-only**: sin JS obligatorio
- **Namespaced**: todo vive dentro de `.nz`
- **Light-first**: modo claro por defecto
- **Liquid Glass**: efecto glassmorphism real
- **OKLCH**: colores perceptualmente uniformes
- **Modular packs**: activar solo lo que necesitas

### Liquid Glass Real (v5 / next.css)
- `--glass-liquid`: specular highlight + chromatic edge + dual inset shadow + saturate backdrop
- `.nz-aurora-mesh[--animated|--glass|--hero]`: aurora mesh backgrounds
- OKLCH color system paralelo (`--nz-oklch-*`, activable con `data-nz-color-system="oklch"`)
- Forced-colors mode para accesibilidad

### Uso básico
```html
<body class="nz" data-nz-theme="light" data-nz-skin="aurora">
  <section class="nz-section">
    <div class="nz-container nz-stack nz-stack--lg">
      <h1>Mi app</h1>
    </div>
  </section>
</body>
```

### Agent-Ready (CRÍTICO para ahorrar tokens)
```
❌ NO pegar el CSS en el prompt (170KB ≈ 50.000 tokens)
✅ SÍ: Dar al agente solo AGENTS.md + INDEX.md (~5.000 tokens)
✅ SÍ: Enlazar CSS vía CDN público en el HTML generado
✅ SÍ: Decir al agente "Usa Aurora classes de INDEX.md, nunca inventes nombres"
```

### Drop-in files para AI tooling
- `AGENTS.md` — Open standard (OpenAI, Sourcegraph, Anthropic)
- `.github/copilot-instructions.md` — Auto-loaded por GitHub Copilot
- Para Claude Code: copiar `AGENTS.md` a `CLAUDE.md`
- Para Cursor: copiar a `.cursor/rules/aurora.mdc`

### CSS Houdini @property con @layer (v5.2+)
- Los `@property` declarations **DEBEN estar fuera de cualquier `@layer`** — el spec CSS lo exige.
- Las reglas CSS que usan esas propiedades custom deben ir dentro de `@layer ntizar.components` (o cualquier otro layer).
- Patrón correcto:
  ```css
  /* FUERA de @layer — nivel global */
  @property --nz-gradient-angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 135deg;
  }

  /* DENTRO de @layer — reglas que usan la propiedad */
  @layer ntizar.components {
    .mi-clase {
      background: linear-gradient(var(--nz-gradient-angle), ...);
    }
  }
  ```
- Degradación grácil: si `@property` no es soportado (Firefox), el navegador ignora la propiedad y usa el valor por defecto del gradiente.
- `@property` acepta tipos: `<angle>`, `<percentage>`, `<color>`, `<length>`, `<number>`. Cada uno debe tener `syntax` correcto e `initial-value` compatible.
- Ejemplo en Aurora: `ntizar.next.css` tiene 4 `@property` declarados (mejora #12 del plan 9009): `--nz-gradient-angle`, `--nz-gradient-pos`, `--nz-gradient-pos-2`, `--nz-gradient-pos-3`.

### Limitaciones honestas
- **No JS shipped**: modals/tabs/drawers están estilizados, no comportados (hay que togglear clases)
- **No tree-shaking**: se carga el pack completo
- **WCAG AAA** solo en skin `contrast`
- **Sin releases taggeados aún**: pinzar con `@v5.1.0` hasta que se taggee

### glass-refraction (Z1Code) ⭐35 — Alternativa avanzada
**Qué hace:** Liquid Glass design system con SVG refraction filters, specular highlights y chromatic edge dispersion.
**Instalación:** `npm install glass-refraction`
**Tiers:** `.glass` (navbar/hero denso), `.glass-card` (cards medio), `.glass-pill` (tags ligero)
**React components:** `<GlassFilters>`, `<Glass>`, `<GlassCard>`, `<GlassPill>`

## Aurora Nightly (Mejora Continua Nocturna)

El sistema de diseño Aurora tiene un pipeline automático de mejora continua: 4 jobs nocturnos que investigan tendencias web, analizan gaps y aplican mejoras CSS focalizadas al repositorio `Ntizar-Aurora`.

- **Skill:** `aurora-nightly`
- **Workflow:** investigación → análisis gap → 3 mejoras CSS → commit → reaprendizaje
- **Schedule:** 01:00-04:00 UTC diarios
- **Repo:** `/root/workspace/Ntizar-Aurora`
- **Logs:** `nightly/research-log.md`, `nightly/iteration-log.md`

Ver `references/config-current.md` en la skill `aurora-nightly` para job IDs y estado actual.

### Archivos de referencia

- `references/ntizar-projects-patterns.md` — Patrones de 6 proyectos Ntizar (solmad, XVLegislatura, nap-dashboard, FreeHands, FamilyTree, empleady): vanilla-first, Web Workers + Comlink, GitHub Pages deploy, datos públicos españoles
- `references/css-houdini-property-pattern.md` — Patrón CSS Houdini @property: estructura (fuera de @layer), gradientes animables, keyframes, compatibilidad navegador
- `references/css-only-dropdown-has-pattern.md` — Patrón dropdown CSS-only: checkbox hack + :has(), sin JavaScript, compatible con .is-open para JS
- `/hermes-home/skills/devops/agent-observability/references/nan-portfolio-pattern.md` — Patrón completo de portfolio en NaN Spaces con esta estética
- `/root/workspace/nan-dashboard/public/css/style.css` — Implementación completa y funcional