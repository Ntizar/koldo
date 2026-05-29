---
name: ntizar-aurora-design-system
description: "Ntizar Aurora v5.1 — CSS-only design system con namespace .nz, 10 packs opcionales, 6 skins, liquid glass real, OKLCH theming. CDN público en jsDelivr."
version: "1.0.0"
category: frontend
---

# Ntizar Aurora Design System

> **Versión:** 5.1 "Constellation"
> **Tipo:** CSS-only design system, sin build step, sin JS
> **Repo:** https://github.com/Ntizar/Ntizar-Aurora
> **CDN:** https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/

## Qué es

Aurora es un sistema de diseño 100% CSS con namespace `.nz` que proporciona componentes, tokens y layouts listos para usar. No requiere build, npm ni JavaScript.

## CDN Público

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.css">
```

## Carga Rápida

```html
<body class="nz"
      data-nz-theme="light"
      data-nz-skin="aurora"
      data-nz-shape="default"
      data-nz-density="comfortable">
```

## 10 Packs Opcionales

| Pack | Archivo | Uso |
|------|---------|-----|
| Core | `ntizar.css` | Tokens, resets, layout base |
| Themes | `ntizar.themes.css` | 6 skins |
| Data | `ntizar.data.css` | KPIs, dashboards |
| Charts | `ntizar.charts.css` | Gráficos |
| Maps | `ntizar.maps.css` | Leaflet, Mapbox |
| Viz | `ntizar.viz.css` | Three.js, aurora fondos |
| Motion | `ntizar.motion.css` | Animaciones |
| Forms | `ntizar.forms.css` | Switch, OTP, range, stepper |
| UI | `ntizar.ui.css` | Modal, drawer, tabs, toast |
| Patterns | `ntizar.patterns.css` | App-shell, hero, pricing, footer |
| Next | `ntizar.next.css` | Liquid glass real, OKLCH, forced-colors |

## 5 Reglas No Negociables

1. **Siempre envolver con `.nz`** — `class="nz"` en `<body>` o sección
2. **Usar solo clases de INDEX.md** — No inventar nombres
3. **Nunca hardcodear valores** — Usar tokens `var(--nz-color-brand)`, `var(--nz-space-4)`
4. **No reescribir CSS que Aurora ya proporciona** — Botones, cards, modals, tabs, etc.
5. **Personalizar vía root attributes** — `data-nz-theme`, `data-nz-skin`, `data-nz-shape`, `data-nz-density`

## 6 Skins

aurora (default), sunset, midnight, ocean, citrus, contrast

## 4 Shapes

default, sharp, rounded, brutalist

## 3 Densidades

compact, comfortable, spacious

## Componentes Principales

- **Botones:** `.nz-btn`, `.nz-btn-primary`, `.nz-btn-secondary`, `.nz-btn-ghost`
- **Cards:** `.nz-card` con variantes glass
- **Badges:** `.nz-badge` con colores por estado
- **Inputs:** `.nz-field`, `.nz-input`, `.nz-label`
- **Layout:** `.nz-grid`, `.nz-flex`, `.nz-container`
- **Modals:** `.nz-modal`, `.nz-drawer`
- **Tabs:** `.nz-tabs`, `.nz-tab`
- **Alerts:** `.nz-alert`, `.nz-toast`

## Liquid Glass Effect

```css
.nz-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}
```

3 niveles: sutil, estándar, fuerte.

## Paleta

- **Azul primario:** `#3b82f6`
- **Naranja acento:** `#f97316`
- **Fondo oscuro:** `#0a0f1e`

## Agent-Ready

Para agentes IA (Claude Code, Copilot, Cursor, etc.):
- **NO pegar el CSS en el prompt** (~170KB = ~50k tokens)
- **Cargar solo INDEX.md** (~16KB = ~4k tokens) como mapa de clases
- **Enlazar CSS vía CDN** en HTML generado
- **Usar solo clases documentadas** en INDEX.md

## Proyectos que usan Aurora

- NtizarBrainMasterMind (learning platform)
- solmad (terrazas Madrid)
- XVLegislatura (gobierno España)
- FamilyTree (árbol genealógico)
- empleady (rentabilidad empleados)
- nap-dashboard (transporte España)

## Referencias

- [AGENTS.md](https://github.com/Ntizar/Ntizar-Aurora/blob/master/AGENTS.md) — Guía para agentes IA
- [INDEX.md](https://github.com/Ntizar/Ntizar-Aurora/blob/master/INDEX.md) — Mapa operativo de clases
- [DESIGN.md](https://github.com/Ntizar/Ntizar-Aurora/blob/master/DESIGN.md) — Spec canónico compatible Google DESIGN.md
- [demo.html](https://github.com/Ntizar/Ntizar-Aurora/blob/master/design-system/demo.html) — Demo visual
