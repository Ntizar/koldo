---
name: ntizar-glass-ui-patterns
description: "Patrones de UI con efecto Liquid Glass estilo Ntizar: glass-morphism con backdrop-filter, SVG filters para refracción, paleta azul+naranja, componentes reutilizables en vanilla HTML/CSS/JS."
version: "1.0.0"
category: frontend
---

# Ntizar Glass UI Patterns

> **Inspirado en:** Ntizar Aurora Design System + proyectos estáticos de Ntizar
> **Stack:** Vanilla HTML/CSS/JS, sin frameworks, sin build tools

## Qué es

Colección de patrones de interfaz con efecto Liquid Glass signature de Ntizar: cristal líquido con refracción vía filtros SVG, paleta azul (#3b82f6) + naranja (#f97316), sobre fondos oscuros.

## Paleta de Colores

```css
:root {
  --nz-blue: #3b82f6;
  --nz-orange: #f97316;
  --nz-dark: #0a0f1e;
  --nz-dark-light: #111827;
  --nz-white: #f8fafc;
  --nz-gray: #94a3b8;
}
```

## Efecto Liquid Glass

### Nivel Sutil
```css
.glass-sutil {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Nivel Estándar
```css
.glass-estandar {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

### Nivel Fuerte
```css
.glass-fuerte {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Con Refracción SVG (Chrome/Chromium)
```css
.glass-refraction {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

## Componentes Reutilizables

### Cards Glass
```html
<div class="card-glass">
  <h3>Título</h3>
  <p>Contenido con efecto cristal</p>
</div>
```

```css
.card-glass {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}
.card-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}
```

### Botones
```css
.btn-primary {
  background: var(--nz-blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-accent {
  background: var(--nz-orange);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}
```

### Badges / Tags
```css
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.2);
  color: var(--nz-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}
```

### Navbar Glass
```css
.navbar-glass {
  background: rgba(10, 15, 30, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### Modales Glass
```css
.modal-glass {
  background: rgba(10, 15, 30, 0.9);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px;
}
```

## Fondos Aurora

### Gradiente Aurora
```css
.bg-aurora {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    var(--nz-dark);
}
```

### Orbs Flotantes
```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}
.orb-blue {
  width: 300px; height: 300px;
  background: var(--nz-blue);
}
.orb-orange {
  width: 200px; height: 200px;
  background: var(--nz-orange);
  animation-delay: -4s;
}
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}
```

## Animaciones

### Fade Up
```css
.fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.6s ease forwards;
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
```

### Gradient Shift
```css
.gradient-shift {
  background-size: 200% 200%;
  animation: gradientMove 6s ease infinite;
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## Patrón de Proyecto Estático

```
proyecto/
├── index.html          # Página principal
├── ntizar.css          # O cargar desde CDN Aurora
├── app.js              # Lógica vanilla JS
├── data/               # Datos estáticos (JSON, CSV)
└── assets/             # Imágenes, iconos
```

Deploy: GitHub Pages (directamente desde repo)

## Proyectos de Referencia

| Proyecto | Stack | Descripción |
|----------|-------|-------------|
| solmad | Vite + React + TS + Leaflet | Terrazas con sol en Madrid |
| XVLegislatura | D3.js + Vanilla | Atlas Gobierno de España |
| FamilyTree | Vanilla + Aurora | Árbol genealógico visual |
| empleady | Vanilla + Aurora | Rentabilidad empleados |
| nap-dashboard | React + TS + GTFS | Transporte público España |

## Lecciones Clave

1. **Vanilla first** — Para proyectos simples, HTML/CSS/JS vanilla es suficiente
2. **CDN para CSS** — Aurora se carga desde jsDelivr, no hay que incluirlo en el repo
3. **GitHub Pages** — Deploy automático desde main branch, sin build step
4. **Data attributes** — Para configuración visual (theme, skin, shape, density)
5. **Sin build tools** — Los proyectos de Ntizar evitan webpack, babel, etc.
