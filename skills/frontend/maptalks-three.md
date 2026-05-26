# maptalks.three

- **URL:** https://github.com/maptalks/maptalks.three
- **Categoría:** Frontend / 3D Maps / GIS
- **¿Qué hace?:** Es un plugin que integra Three.js como capa de renderizado dentro de maptalks.js. Permite crear mapas 2D/3D con geometría extruida, modelos 3D, líneas gruesas, heatmaps, terreno y gráficos personalizados usando WebGL. Es un complemento del ecosistema maptalks-gl, diseñado para casos que requieren alta personalización visual (efectos de iluminación, materiales PBR, post-procesado, animaciones) que maptalks-gl no cubre.
- **Casos de uso:**
  - Edificios 3D extruidos a partir de GeoJSON/Polygon con alturas dinámicas
  - Barras 3D (bar charts geográficos) con gradientes de color
  - Líneas 3D extruidas y líneas gruesas (fat lines) con materiales Three.js
  - Modelos 3D (GLTF/GLB/OBJ/MTL) posicionados sobre el mapa
  - Puntos 3D con texturas, tamaños variables y blending personalizado
  - Heatmaps 3D con gradientes de color y contadores
  - Terreno 3D a partir de tiles RGB (Mapbox Terrain RGB)
  - Gráficos personalizados extendiendo `BaseObject`
  - Post-procesado (bloom, antialiasing) usando `GroupGLLayer`
  - Carga masiva de datos con workers asíncronos y tile-based loading
- **Snippets útiles:**

```javascript
// === Instalación básica (UMD) ===
// Cargar en orden: three.js → maptalks → maptalks.three
<script src="https://unpkg.com/three@0.138.0/build/three.min.js"></script>
<script src="https://unpkg.com/maptalks/dist/maptalks.min.js"></script>
<script src="https://unpkg.com/maptalks.three/dist/maptalks.three.js"></script>
```

```javascript
// === Hello World — capa Three.js básica ===
const map = new maptalks.Map('map', {
    center: [19.06, 42.17],
    zoom: 3,
    pitch: 60
});

const threeLayer = new maptalks.ThreeLayer('t');
threeLayer.prepareToDraw = function (gl, scene, camera) {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, -10, -10).normalize();
    scene.add(light);
};
threeLayer.addTo(map);
```

```javascript
// === Con maptalks-gl y post-procesado (bloom) ===
const threeLayer = new maptalks.ThreeLayer('t', {
    forceRenderOnMoving: true,
    forceRenderOnRotating: true
});
threeLayer.prepareToDraw = function (gl, scene, camera) {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, -10, 10).normalize();
    scene.add(light);
};

const sceneConfig = {
    postProcess: { enable: true, antialias: { enable: true } }
};
const groupLayer = new maptalks.GroupGLLayer('group', [threeLayer], { sceneConfig });
groupLayer.addTo(map);
```

```javascript
// === Edificios extruidos desde GeoJSON ===
const material = new THREE.MeshPhongMaterial({ color: 0x4488ff });
countries.features.forEach(function (g) {
    const height = g.properties.population;
    const extrudePolygon = threeLayer.toExtrudePolygon(g, { height: height }, material);
    threeLayer.addMesh(extrudePolygon);
});
```

```javascript
// === Barras 3D con gradientes de color ===
const bar = threeLayer.toBar([120, 31], {
    radius: 100,
    height: 100,
    topColor: '#ff0000',
    bottomColor: '#2d2f61'
}, material);
threeLayer.addMesh(bar);
```

```javascript
// === Modelos 3D (GLTF/GLB) ===
const loader = new THREE.GLTFLoader();
loader.load('./data/model.glb', function (gltf) {
    const model = gltf.scene;
    model.rotation.x = Math.PI / 2;
    model.scale.set(100, 100, 100);
    const baseObject = threeLayer.toModel(model, {
        coordinate: map.getCenter()
    });
    threeLayer.addMesh(baseObject);
});
```

```javascript
// === Puntos con textura personalizada ===
function createTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 16; canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const material = new THREE.PointsMaterial({
    size: 20,
    sizeAttenuation: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: createTexture('#ff0000')
});

const point = threeLayer.toPoint([120, 31], { height: 50 }, material);
threeLayer.addMesh(point);
```

```javascript
// === Líneas con materiales ===
const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true
});
const lineStrings = maptalks.GeoJSON.toGeometry(geojson);
const mesh = threeLayer.toLines(lineStrings, {
    interactive: false,
    minZoom: 11,
    maxZoom: 19
}, material);
threeLayer.addMesh(mesh);
```

```javascript
// === Líneas gruesas (FatLine) ===
const fatMaterial = new THREE.LineMaterial({
    color: 0x00ffff,
    transparent: true,
    linewidth: 4  // en píxeles
});
const fatLine = threeLayer.toFatLine(new maptalks.LineString(coordinates), {}, fatMaterial);
threeLayer.addMesh(fatLine);
```

```javascript
// === Heatmap 3D ===
const data = features.map(f => ({
    coordinate: [f.lng, f.lat],
    count: Math.random() * 100
}));
const heatmap = threeLayer.toHeatMap(data, {
    size: 2,
    gradient: {
        0.25: 'rgb(0,0,200)',
        0.55: 'rgb(0,255,0)',
        0.85: 'yellow',
        1.0: 'rgb(255,0,0)'
    }
}, material);
threeLayer.addMesh(heatmap);
```

```javascript
// === Eventos en geometría 3D ===
point.on('click mouseover mouseout', function (e) {
    if (e.type === 'mouseover') {
        this.setSymbol(highlightMaterial);
    } else if (e.type === 'mouseout') {
        this.setSymbol(defaultMaterial);
    }
});
```

```javascript
// === Tooltip e InfoWindow ===
point.setToolTip('Mi información', {
    showTimeout: 0,
    eventsPropagation: true,
    dx: 10
});
point.setInfoWindow({
    content: 'Detalles del punto',
    title: 'Info',
    animationDuration: 0
});
```

```javascript
// === Custom BaseObject (círculo personalizado) ===
class Circle extends BaseObject {
    constructor(coordinate, options, material, layer) {
        options = maptalks.Util.extend({}, { radius: 100, altitude: 0 }, options, { layer, coordinate });
        super();
        this._initOptions(options);
        const { altitude, radius } = options;
        const r = layer.distanceToVector3(radius, radius).x;
        const geometry = new THREE.CircleBufferGeometry(r, 50);
        this._createMesh(geometry, material);
        const z = layer.altitudeToVector3(altitude, altitude).x;
        const position = layer.coordinateToVector3(coordinate, z);
        this.getObject3d().position.copy(position);
    }
}
const circle = new Circle([120, 31], { radius: 200 }, material, threeLayer);
threeLayer.addMesh(circle);
```

```javascript
// === Animación de geometría ===
threeLayer._needsUpdate = !threeLayer._needsUpdate;
if (threeLayer._needsUpdate) {
    threeLayer.redraw();
}
```

- **Cómo integrarlo en proyectos:**
  1. **Dependencias:** Instalar `maptalks` (o `maptalks-gl`), `three` y `maptalks.three`:
     ```bash
     npm i maptalks three maptalks.three
     ```
  2. **Importación (ESM):**
     ```javascript
     import * as THREE from 'three';
     import * as maptalks from 'maptalks';
     import { ThreeLayer } from 'maptalks.three';
     ```
  3. **CDN (UMD):** Cargar en orden: `three.min.js` → `maptalks.min.js` → `maptalks.three.js`. El namespace se monta en `maptalks` (ej: `maptalks.ThreeLayer`).
  4. **Versión de Three.js:** Lockear la versión de Three.js. Los demos oficiales usan `three@0.138.0`. Para `three >= 128`, el UMD es ES6; para entornos ES5 usar `maptalks.three.es5.js` con `three <= 127`.
  5. **Con maptalks-gl:** Para post-procesado (bloom, antialias), envolver `ThreeLayer` dentro de `GroupGLLayer` con `sceneConfig`.
  6. **Rendimiento:** Usar `toExtrudePolygons`/`toLines`/`toPoints` para batch rendering de múltiples geometías. Habilitar `asynchronous: true` para procesamiento vía Web Workers. Usar `forceRenderOnMoving: true` solo si se necesita renderizado continuo durante interacción.
  7. **Navegador soportados:** IE 11, Chrome, Firefox y navegadores modernos con WebGL.
- **Fecha de aprendizaje:** 2026-05-26
