# FASE 0 — Análisis del Proyecto Ntizar-Aurora
> Pipeline 9009 · 30 de mayo de 2026

## 1. Estructura del Proyecto

```
Ntizar-Aurora/
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── pages.yml
│       └── design-lint.yml
├── skins/
│   ├── DESIGN.sunset.md
│   ├── DESIGN.midnight.md
│   ├── DESIGN.ocean.md
│   └── DESIGN.citrus.md
├── nightly/
│   ├── research-log.md
│   ├── README.md
│   ├── iteration-log.md
│   └── summary.md
├── dist/
│   └── .gitignore
├── .git
├── AGENTS.md          (16 KB / ~4k tokens — guía para agentes IA)
├── DESIGN.md          (spec canónico de tokens/componentes — Google design.md)
├── INDEX.md           (mapa operativo de clases y packs)
├── SYSTEM.md          (constitución del sistema — reglas de versionado y naming)
├── USAGE.md           (guía narrativa con escenarios completos)
├── README.md          (documentación principal, changelog v4.1 → v5.1)
├── package.json       (metadata npm, scripts de lint/build)
├── gallery.html       (showcase único con todo el sistema)
├── demo.html          (demo rápida)
├── index.html         (landing del proyecto)
│
├── ntizar.css              (core — ≈41 KB: tokens, base, objects, components, utilities)
├── ntizar.themes.css       (5 skins: aurora, sunset, midnight, ocean, citrus — ≈6 KB)
├── ntizar.next.css         (v5: liquid glass, OKLCH, multi-axis, mesh, AAA — ≈25 KB)
├── ntizar.ui.css           (modal, drawer, tabs, dropdown, toast, tooltip, command-bar — ≈22 KB)
├── ntizar.patterns.css     (app-shell, hero, pricing, FAQ, footer, auth — ≈18 KB)
├── ntizar.forms.css        (switch, OTP, file drop, range, stepper — ≈15 KB)
├── ntizar.data.css         (KPIs, progress, skeleton, avatar, timeline — ≈12 KB)
├── ntizar.motion.css       (reveal, glow-pulse, aurora-pan, shimmer — ≈10 KB)
├── ntizar.viz.css          (three.js stages, aurora backgrounds, orbs — ≈9 KB)
├── ntizar.maps.css         (Leaflet/Mapbox/MapLibre styling — ≈8 KB)
└── ntizar.charts.css       (Chart.js/Apex/D3 wrappers, sparkline — ≈7 KB)

Total: ~177 KB de CSS combinado
```

## 2. Descripción General

**Ntizar Aurora** es un sistema de diseño CSS puro (sin build, sin JS obligatorio) con efecto **Liquid Glass** estilo visionOS. La identidad visual se basa en **azul (#2563eb) + naranja (#f97316)** con gradientes Aurora.

**Versión actual:** v5.1.0 "Constellation"

**Stack:** HTML/CSS/JS vanilla. CSS-only por defecto.

**Arquitectura modular:**
- **1 core** (`ntizar.css`): tokens, base, objetos, componentes base, utilidades
- **10 packs opt-in**: themes, data, charts, maps, viz, motion, forms, ui, patterns, next

**Características principales:**
- Namespaced bajo `.nz` — no colisiona con otros sistemas
- Tokens CSS (`--nz-*`) en lugar de valores literales
- Multi-axis theming: shape, density, motion, color-system
- OKLCH color system paralelo
- Liquid Glass real con specular highlight dinámico
- 6 skins (aurora, sunset, midnight, ocean, citrus, contrast AAA)
- Compatibilidad con forced-colors y prefers-reduced-motion
- Integración con agentes IA (AGENTS.md, design.md, CDN público)
- CI con lint de diseño (WCAG AA, tokens huérfanos, refs rotas)
- Export a Tailwind y DTCG

## 3. Archivos Clave

### AGENTS.md
Guía para agentes IA. Explica cómo usar Aurora sin consumir tokens: cargar solo INDEX.md, enlazar CSS vía CDN, seguir las 5 reglas duras.

### DESIGN.md
Spec canónico en formato Google design.md. Espejo 1:1 de los tokens reales. Incluye colores, tipografía, layout, elevación, formas, componentes. Cada skin tiene su propio archivo en `skins/DESIGN.*.md`.

### INDEX.md
Mapa operativo. "Necesito X → archivo Y, clases Z". Matriz de decisión completa. Incluye recetas para Chart.js, Leaflet, three.js.

### SYSTEM.md
Constitución del sistema. Principios, arquitectura, convenciones de naming, reglas de versionado semántico, cómo añadir componentes y packs.

### package.json
Metadata npm (no publish). Scripts: `lint:design`, `build:tailwind`, `build:dtcg`, `validate`. Usa `@google/design.md` CLI.

### nightly/
Registro de mejoras nocturnas. Documenta features CSS 2026 aplicadas: `:has()`, scroll-driven animations, `content-visibility`, `oklch(from ...)`.

### gallery.html
Showcase canónico. Toda la API pública visible. Es la "fuente de verdad" visual del sistema.

## 4. Métricas del Proyecto

| Métrica | Valor |
|---|---|
| Versión | v5.1.0 |
| Total CSS | ~177 KB (11 archivos) |
| Core | ~41 KB |
| Packs | 10 opt-in |
| Skins | 6 (5 + contrast AAA) |
| Tokens | 50+ (`--nz-*`) |
| Clases documentadas | 200+ |
| Licencia | MIT |
| CDN | jsDelivr |
| CI | GitHub Actions (design-lint) |

## 5. Fortalezas Identificados

1. **Arquitectura modular excepcional** — cada pack es independiente e idempotente
2. **Integración IA de primer nivel** — AGENTS.md, design.md, CDN público, copilot instructions
3. **Liquid Glass real** — specular highlight, chromatic edge, dual inset shadow
4. **Multi-axis theming** — 4 ejes ortogonales combinables
5. **OKLCH color system** — perceptualmente uniforme, mejor dark mode
6. **Accesibilidad sólida** — WCAG AAA skin, forced-colors, prefers-reduced-motion
7. **Constitución clara** — SYSTEM.md define reglas no negociables
8. **CI de diseño** — lint automático de contraste, tokens huérfanos, refs rotas

## 6. Áreas de Oportunidad

1. **Sin releases etiquetados** — `@master` y `@v5.1.0` resuelven diferente (documentado en README)
2. **Sin tree-shaking** — cargar 5 componentes = cargar pack entero
3. **Sin JS incluido** — modal/tabs/drawer necesitan toggle manual de clases
4. **Solo Chrome/Edge para features v5** — scroll-driven animations requieren Chrome 115+, oklch(from) Chrome 112+
5. **Sin documentación visual por skin** — cada skin necesita su propia galería
6. **Sin sistema de diseño tokens exportable** — solo a Tailwind/DTCG, no a Figma/Storybook
7. **Demo.html y index.html** — podrían ser más completos como playground interactivo
8. **Sin changelog en formato estándar** — el changelog está mezclado con el README
