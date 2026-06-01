# Patrón de Detección YOLO en Navegador — WebGPU + WASM Fallback

## Resumen

YoloConteo implementa detección de objetos YOLOv8n directamente en el navegador usando ONNX Runtime Web con WebGPU como backend principal y WASM como fallback.

## Hallazgos clave

### 1. Backend detection con fallback
```javascript
const backends = ['webgpu', 'wasm'];
for (const ep of backends) {
    try {
        this.session = await ort.InferenceSession.create(modelUrl, {
            executionProviders: [ep],
        });
        this.backend = ep;
        this.ready = true;
        break;
    } catch (e) { /* try next */ }
}
```

### 2. Tracker IoU sin dependencias
- Asigna IDs persistentes a detecciones entre frames
- Usa Intersection over Union para matching
- `maxAge = 15` frames sin match → eliminar track
- `iouThreshold = 0.25` para considerar match

### 3. Conteo bidireccional
- Línea virtual ajustable con slider
- Historial de posición X por track (60 frames)
- Detecta cruce en ambas direcciones
- Export a CSV + GPS

### 4. Performance
| Backend | FPS | Requisito |
|---------|-----|-----------|
| WebGPU | 20-40+ | Chrome/Edge 113+ |
| WASM | 5-15 | Cualquier navegador |

### 5. Modelo ONNX
- YOLOv8n (~12MB)
- Se descarga una vez y queda cacheado
- 6 de 80 clases COCO mapeadas

## Aplicabilidad

Este patrón es reutilizable para cualquier proyecto que necesite:
- Detección de objetos en navegador sin servidor
- Conteo de personas/vehículos
- Análisis de video en tiempo real
- Aplicaciones de accesibilidad (detección de gestos, objetos)
- Dashboards de monitorización

## Archivos de referencia

- `web/detector.js` — Inferencia ONNX con WebGPU/WASM
- `web/tracker.js` — Tracker IoU para tracking de objetos
- `web/counter.js` — Conteo bidireccional
- `web/yolov8n.onnx` — Modelo ONNX
- `detector.py` — Versión Python (servidor)
- `export_model.py` — Exporta YOLO a ONNX
