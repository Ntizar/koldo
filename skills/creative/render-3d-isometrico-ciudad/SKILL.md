---
name: render-3d-isometrico-ciudad
description: "Render 3D isométrico de ciudades en Canvas 2D — edificios con 3 caras (frontal/lateral/tejado), depth sorting, ciclo día/noche, clima y datos de coordenadas reales."
version: "1.0.0"
tags: [canvas, 3d, isometric, city, madrid]
---

# Render 3D Isométrico de Ciudad en Canvas 2D

Renderizado de una ciudad real en 3D isométrico sobre Canvas 2D vanilla JS. Cada edificio tiene 3 caras (fachada, lateral, tejado) con colores y sombras dinámicas según la hora del día.

## Cuándo usar

- Quieres un visor isométrico de una ciudad sin WebGL/Three.js
- Tienes coordenadas de edificios (x, y, altura, ancho, fondo) y quieres visualizarlos en 3D
- Necesitas ciclo día/noche con iluminación dinámica
- Quieres capas: edificios, parques, río, calles, metro

## Estructura de datos

```js
// Cada edificio tiene coordenadas de mundo (ux, uy), dimensiones y color
const building = {
  ux: 0,           // coordenada X en mundo
  uy: 0,           // coordenada Y en mundo
  w: 1.0,          // ancho
  d: 1.0,          // fondo  
  h: 5,            // altura (determina altura visual 3D)
  color: '#c0a080', // color base hex o hsl
  roof: '#d0b898',  // color tejado (opcional)
  label: 'Edificio', // etiqueta (opcional)
  landmark: false,   // si es landmark destacado
};
```

## Proyección isométrica

```js
function isoProject(ux, uy, z = 0) {
  const rad = (state.rotation * Math.PI) / 180;
  const c = Math.cos(rad), s = Math.sin(rad);
  const rx = ux * c - uy * s, ry = ux * s + uy * c;
  return { 
    x: (rx - ry) * gridScale, 
    y: (rx + ry) * gridScale * 0.5 - z   // *0.5 = factor isométrico
  };
}

function worldToScreen(ux, uy, z = 0) {
  const center = isoProject(0, 0);
  const p = isoProject(ux, uy, z);
  return {
    x: (p.x - center.x) * zoom + canvas.width/2 + panX,
    y: (p.y - center.y) * zoom + canvas.height/2 + panY,
  };
}
```

## Render 3 caras del edificio

```js
function renderBuilding3D(ctx, b, tc, zoom) {
  const uw = b.w * 30 * zoom;   // ancho en pantalla
  const ud = b.d * 30 * zoom;   // fondo en pantalla
  const uh = b.h * 12 * zoom;   // altura en pantalla
  const p = worldToScreen(b.ux, b.uy);
  const cx = p.x, baseY = p.y;
  const isoOffX = ud * 0.35;    // desplazamiento isométrico X
  const isoOffY = ud * 0.2;     // desplazamiento isométrico Y

  // CARA SUPERIOR (tejado)
  ctx.beginPath();
  ctx.moveTo(cx, baseY - uh);
  ctx.lineTo(cx + isoOffX, baseY - uh - isoOffY);
  ctx.lineTo(cx + isoOffX + uw, baseY - uh - isoOffY);
  ctx.lineTo(cx + uw, baseY - uh);
  ctx.closePath();
  ctx.fillStyle = roofColor;
  ctx.fill();

  // CARA FRONTAL
  ctx.fillStyle = faceMain;
  ctx.fillRect(cx, baseY - uh, uw, uh);

  // CARA LATERAL DERECHA (más oscura)
  ctx.beginPath();
  ctx.moveTo(cx + uw, baseY - uh);
  ctx.lineTo(cx + uw + isoOffX, baseY - uh - isoOffY);
  ctx.lineTo(cx + uw + isoOffX, baseY - isoOffY);
  ctx.lineTo(cx + uw, baseY);
  ctx.closePath();
  ctx.fillStyle = faceSide;
  ctx.fill();
  
  // Ventanas (en cara frontal)
  if (uw > 10) {
    // grid de ventanas
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillStyle = windowColor;
        ctx.fillRect(wx, wy, winW, winH);
      }
    }
  }
}
```

## Depth sorting (far-to-near)

Los edificios se renderizan en orden de menor a mayor `(uy + ux)` para proyección isométrica:

```js
buildings.sort((a, b) => (a.uy + a.ux) - (b.uy + b.ux));
```

## Ciclo día/noche

7 fases con colores de cielo, ambiente y ventanas:

| Fase | Hora | Ambient |
|------|------|---------|
| Noche | 00:00-05:59 | 0.12 |
| Amanecer | 06:00-07:59 | 0.30 |
| Mañana | 08:00-11:59 | 0.65 |
| Mediodía | 12:00-14:59 | 1.00 |
| Tarde | 15:00-16:59 | 0.85 |
| Atardecer | 17:00-18:59 | 0.50 |
| Crepúsculo | 19:00-20:59 | 0.20 |

El `ambient` modula el brillo de colores y la opacidad de ventanas.

## Color dinámico

```js
function adjustColor(hex, amount) {
  // suma amount a R, G, B (clamping 0-255)
}
function colorFromHSL(hslStr, ambient) {
  // ajusta lightness según ambient
}
```

## Capas del mapa (orden de render)

1. **Cielo** — gradiente vertical con `tc.sky`
2. **Suelo** — grid de baldosas
3. **Calles** — rectángulos semitransparentes
4. **Parques** — áreas verdes con árboles circulares
5. **Río** — línea ancha curveada
6. **Metro** — líneas con paradas
7. **Edificios** — depth sorted, 3 caras
8. **Labels** — texto encima de landmarks

## Interacción

```js
// Pan: mousedown/mousemove/mouseup
// Zoom: wheel event (state.zoom *= delta)
// Touch: touchstart/touchmove/touchend con pinch-to-zoom
// Rotación: slider input actualiza state.rotation
```

## Pitfalls

- **Depth sorting incorrecto**: usar `uy + ux` para isométrico 3D. Si la altura afecta (edificios muy altos), restar `height * factor`.
- **Cara lateral invisible**: el offset isométrico (`isoOffX`) debe ser suficiente para que se vea la profundidad. Si es < 8px, la cara lateral es imperceptible.
- **Ventanas nocturnas**: usar `Math.random() > 0.3` para simular ventanas apagadas de noche.
- **Labels siempre visibles**: filtrar con `zoom > 0.8` y verificar que estén dentro del viewport.
- **Edificios fuera de pantalla**: skip si `p.x < -50 || p.x > w+50 || p.y < -50 || p.y > h+50`.
- **Referencia para el usuario**: Ntizar/Madrid3Pixel es la implementación de referencia de este patrón.

## Referencias

- `references/madrid-coordinates.md` — Datos de coordenadas reales de Madrid centro (30+ landmarks, calles, parques, río Manzanares, 6 líneas de metro)
