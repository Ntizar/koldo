# Patrón de Fondo Madrid Pixel Art

Cómo extraer el motor de Madrid3Pixel y usarlo como **fondo procedural estático** detrás de elementos DOM interactivos (árbol genealógico, dashboard, galería, etc.).

## Arquitectura

```
MADRID_BG (IIFE singleton)
├── Canvas overlay (z-index: 0, pointer-events: none, opacity: 0.35)
├── Render pipeline (una sola pasada)
│   ├── Ground (color arena #e8e0d0 + grid de manzanas)
│   ├── Calles principales (Gran Vía, Castellana, Prado)
│   ├── Río Manzanares (curva con shimmer + puentes)
│   ├── Parques (Retiro, Casa de Campo, Atocha)
│   ├── Edificios (grid procedural hash-seed)
│   ├── Landmarks (15 lugares reales con labels)
│   └── Metro (6 líneas coloreadas con paradas)
└── Caché: bgCanvas (solo regenera en resize)
```

## Integración en cualquier proyecto

### 1. Insertar el módulo

Copiar el bloque `const MADRID_BG = (() => { ... })();` en el JS principal del proyecto. Este bloque no tiene dependencias externas — solo Canvas 2D API.

### 2. Inicializar

```js
// En init() o DOMContentLoaded
if (typeof MADRID_BG !== 'undefined') {
  MADRID_BG.init();
}

// En resize handler
window.addEventListener('resize', () => {
  if (typeof MADRID_BG !== 'undefined') {
    MADRID_BG.resize();
  }
});
```

### 3. CSS del contenedor

El canvas se inserta como `position:absolute;z-index:0;pointer-events:none`. El contenedor principal debe tener `position:relative;z-index:1` para que el contenido quede por encima.

```css
.wrap-contenedor {
  position: relative;
  z-index: 1; /* por encima del canvas de Madrid */
}
```

## Configuración

| Parámetro | Default | Descripción |
|---|---|---|
| `PIXEL` | 4 | Tamaño de píxel base (px) |
| `PAL.ground` | `#e8e0d0` | Color arena Madrid |
| `opacity` (css) | `0.35` | Opacidad del canvas overlay |
| `scale` | `min(w,h)/24` | Escala del grid de Madrid |

## Landmarks disponibles

15 landmarks incluidos: Puerta del Sol, Gran Vía, Parque del Retiro, Atocha, Cibeles, Chamberí, Chamartín, Salamanca, Casa de Campo, Vicálvaro, Barajas, Almudena, Templo de Debod, Plaza Mayor, Reina Sofía.

## Diferencias con Madrid3Pixel standalone

| Aspecto | Madrid3Pixel | Fondo (MADRID_BG) |
|---|---|---|
| Interactivo | Sí (zoom, paneo, rotación) | No (estático, solo resize) |
| Canvas | Principal, interactivo | Overlay, pointer-events:none |
| Día/Noche | 7 fases dinámicas | No aplica |
| Partículas | Nieve, lluvia, niebla | No |
| Tiles | Sistema de tiles con carga | Renderizado directo una pasada |
| Métricas | 1145 líneas JS | ~400 líneas inline |