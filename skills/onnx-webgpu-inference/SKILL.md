---
name: onnx-webgpu-inference
description: Patrón para ejecutar modelos YOLO ONNX en el navegador con WebGPU y fallback a WASM
created: 2026-06-01
source: Ntizar/YoloConteo
status: active
tags: [computer-vision, WebGPU, ONNX, YOLO, inference]

---

# Inferencia ONNX con WebGPU en el Navegador

**Proyecto origen:** YoloConteo (Ntizar/YoloConteo)  
**Clusters:** webgpu, onnx, yolo, ia-browser, computer-vision  
**Decay:** normal  

## Descripción

Ejecutar modelos YOLO ONNX directamente en el navegador del usuario, aprovechando la GPU local vía WebGPU con fallback a WASM. No requiere servidor con GPU ni instalación.

## Pasos

### 1. Instalar dependencias

```bash
# No se necesita npm — se carga desde CDN
# onnxruntime-web desde jsdelivr
```

### 2. Cargar modelo con fallback WebGPU → WASM

```javascript
const MODEL_INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.25;
const IOU_THRESHOLD = 0.5;
const ORT_VERSION = '1.22.0';

class Detector {
  constructor() {
    this.session = null;
    this.ready = false;
    this.backend = 'none';
  }

  async init(modelUrl, onProgress) {
    ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;

    const backends = ['webgpu', 'wasm'];
    for (const ep of backends) {
      try {
        if (onProgress) onProgress(`Cargando modelo (${ep.toUpperCase()})…`);
        this.session = await ort.InferenceSession.create(modelUrl, {
          executionProviders: [ep],
        });
        this.backend = ep;
        this.ready = true;
        console.log(`[Detector] Backend: ${ep}`);
        return;
      } catch (e) {
        console.warn(`[Detector] ${ep} failed, trying next:`, e.message);
      }
    }
    throw new Error('No backend disponible para ONNX');
  }
}
```

### 3. Preprocesar frame (letterbox resize)

```javascript
preprocessFrame(video) {
  const canvas = document.createElement('canvas');
  canvas.width = MODEL_INPUT_SIZE;
  canvas.height = MODEL_INPUT_SIZE;
  const ctx = canvas.getContext('2d');
  
  // Letterbox: mantener aspect ratio
  const scale = Math.min(
    MODEL_INPUT_SIZE / video.videoWidth,
    MODEL_INPUT_SIZE / video.videoHeight
  );
  const w = video.videoWidth * scale;
  const h = video.videoHeight * scale;
  const x = (MODEL_INPUT_SIZE - w) / 2;
  const y = (MODEL_INPUT_SIZE - h) / 2;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
  ctx.drawImage(video, x, y, w, h);
  
  const imageData = ctx.getImageData(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
  return imageData.data;
}
```

### 4. Postprocesar resultados (NMS + mapeo a coordenadas originales)

```javascript
postprocessResults(output, videoWidth, videoHeight) {
  // output: tensor [1, 84, 8400] para YOLOv8n
  const data = output.data;
  const numClasses = 80;
  const numBoxes = 8400;
  
  const boxes = [];
  for (let i = 0; i < numBoxes; i++) {
    const scores = data.slice(i * 84, i * 84 + numClasses);
    const maxScore = Math.max(...scores);
    if (maxScore < CONF_THRESHOLD) continue;
    
    const classId = scores.indexOf(maxScore);
    const [cx, cy, w, h] = data.slice(i * 84 + numClasses, i * 84 + numClasses + 4);
    
    // Mapear de espacio del modelo a coordenadas originales
    const x = (cx - w / 2) * (videoWidth / MODEL_INPUT_SIZE);
    const y = (cy - h / 2) * (videoHeight / MODEL_INPUT_SIZE);
    
    boxes.push({ x, y, w, h, score: maxScore, classId });
  }
  
  // Non-maximum suppression
  return this.nms(boxes, IOU_THRESHOLD);
}

nms(boxes, iouThreshold) {
  boxes.sort((a, b) => b.score - a.score);
  const keep = [];
  
  for (const box of boxes) {
    let dominated = false;
    for (const kept of keep) {
      if (this.iou(box, kept) > iouThreshold) {
        dominated = true;
        break;
      }
    }
    if (!dominated) keep.push(box);
  }
  return keep;
}
```

## Pitfalls

- **WebGPU solo en Chrome/Edge 113+** — siempre tener fallback WASM
- **Modelo ~12MB** — descargar una vez y cachear (service worker o cache API)
- **En móvil optimizar saltando frames** de inferencia para mantener fluidez
- **Letterbox**: el resize con padding negro es crítico para precisión de detección
- **COCOs classes**: YOLOv8n detecta 80 clases, filtrar solo las que interesan (personas, coches, motos, bicicletas, autobuses, camiones)

## Rendimiento esperado

| Backend | FPS | Requisito |
|---------|-----|-----------|
| WebGPU | 20-40+ | Chrome/Edge 113+ |
| WASM | 5-15 | Cualquier navegador moderno |

## Referencias

- YoloConteo: `web/detector.js` (~10KB)
- ONNX Runtime Web: https://onnxruntime.ai/docs/get-started/with-web.html
- YOLOv8: https://github.com/ultralytics/ultralytics
