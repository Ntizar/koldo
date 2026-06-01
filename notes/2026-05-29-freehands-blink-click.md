# FreeHands — Mejora #5: Clic por guiño (blink detection via EAR)

**Fecha:** 29/05/2026  
**Estado:** ✅ Implementada y puesta en producción

## Resumen

Implementé detección de parpadeo (blink) como gesto de clic. El usuario puede hacer clic en cualquier elemento de la UI simplemente parpadeando — sin necesidad de gestos con las manos.

## Arquitectura

### BlinkDetector (`gaze/blink_detector.py`)
- **Algoritmo:** Eye Aspect Ratio (EAR) de Kotsia & Pitas (2006)
- **EAR** = altura vertical del ojo / anchura horizontal del ojo
- Cuando ambos ojos se cierran simultáneamente, EAR cae por debajo del umbral
- **Detección:** mínimo 3 frames cerrados + 2 frames de recuperación
- **Debounce:** 300ms entre parpadeos para evitar falsos positivos
- **Suavizado:** moving average de 2 frames por ojo (evita jitter sin retardar la detección)
- **Protección:** si el ojo se mantiene cerrado >15 frames, se descarta (no es un parpadeo)

### Integración en GazeTracker
- Se calcula EAR en `extract()` usando landmarks de párpado superior/inferior (159/145, 386/374)
- Se normaliza el EAR respecto a un máximo esperado (0.5)
- Se pasa el resultado a `BlinkDetector.update(left_ear, right_ear)`
- El resultado (`True`/`False`) se expone en `GazeFeatures.blink`

### Integración en Fusion
- `MultimodalFusion.step()` acepta parámetro `blink: bool = False`
- Si `blink=True`, se dispara `click` **inmediatamente**, sin dwell y sin state machine
- Es el gesto más rápido del sistema (más rápido que pointing_up)

### Integración en main.py
- `feats.blink` se extrae del tracker y se pasa a `fusion.step()`
- El overlay muestra "click" en el flash de acción

## Archivos modificados
1. `src/freehands/gaze/blink_detector.py` — **nuevo** — Detector de parpadeo
2. `src/freehands/gaze/tracker.py` — Integración EAR + blink en GazeFeatures
3. `src/freehands/fusion/fusion.py` — Blink bypass en FusionResult
4. `src/freehands/main.py` — Pipeline blink → fusion → dispatch
5. `tests/test_blink_detector.py` — **nuevo** — 8 tests unitarios

## Tests
- 8 tests unitarios para BlinkDetector (pasan todos)
- 56 tests totales pasan (2 fallos pre-existentes no relacionados)

## Notas técnicas
- El suavizado con deque maxlen=2 es clave: maxlen=5 hacía que el EAR promedio se mantuviera alto durante el parpadeo
- `reset()` debe limpiar los deques para evitar contaminación entre sesiones de prueba
- El blink es el gesto más rápido: bypass total del state machine y dwell
