# Adaptive EAR Calibration for Blink Detection

**Patrón:** Calibración por usuario del umbral de detección de parpadeos usando Eye Aspect Ratio (inspirado en Eye2cursor, Fatcatcreate).

## Problema

El umbral fijo de EAR (`ear_close_threshold=0.25`) no funciona bien para todos los usuarios porque:
- Diferentes formas de ojo producen diferentes valores de EAR cuando están abiertos
- Iluminación, distancia a cámara y ángulo afectan el EAR medido
- Un umbral fijo genera falsos positivos o negativos para algunos usuarios

## Solución: EARCalibration

Clase de estado que aprende el EAR "normal" de ojos abiertos de cada usuario y ajusta el umbral dinámicamente.

### Algoritmo

1. **Muestreo:** Cada frame con EAR > threshold se registra como muestra de "ojo abierto"
2. **Promedio móvil exponencial:** `alpha=0.3`, actualiza `open_ear_avg` suavemente
3. **Umbral adaptativo:** `threshold = open_ear_avg - (open_ear_avg * calibration_margin)`
   - Con `margin=0.15`, threshold = 85% del promedio de ojos abiertos
4. **Clamping:** Umbral se limita a `[calibration_min_threshold, calibration_max_threshold]` (0.10–0.40)
5. **Calibración completa:** Tras `calibration_required_frames` (30 frames ≈ 1s), el umbral adaptativo se activa

### Implementación

```python
from freehands.gaze.blink_detector import BlinkDetector, EARCalibration

# El detector usa calibración adaptativa por defecto
detector = BlinkDetector(
    ear_close_threshold=0.25,  # fallback mientras calibra
    use_adaptive_ear=True,      # activar modo adaptativo
)

# Durante el uso normal, el detector aprende automáticamente:
# detector.update(left_ear, right_ear, now=now())

# Verificar estado:
info = detector.get_calibration_info()
# {calibration_complete: True, confidence: 1.0, 
#  open_ear_avg: 0.45, adaptive_threshold: 0.38, ...}

# Umbral efectivo actual:
threshold = detector.current_threshold  # adaptativo o base

# Desactivar para debugging:
detector.use_adaptive_ear = False
```

### Integración en GazeTracker

El `GazeTracker` en `tracker.py` ya llama a `self._blink_detector.update(left_ear_norm, right_ear_norm)` en cada frame. La calibración adaptativa funciona automáticamente sin cambios en el tracker — solo necesita que el detector se instancione con `use_adaptive_ear=True` (valor por defecto).

### Testing

En tests, usar `detector.force_calibration_complete()` para saltar el período de calibración:
```python
detector = BlinkDetector(use_adaptive_ear=True)
# ... simular frames de ojos abiertos ...
detector.force_calibration_complete()
# Ahora el umbral adaptativo está activo
```

### Configuración por defecto

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `calibration_required_frames` | 30 | Frames necesarios para calibración completa |
| `calibration_margin` | 0.15 | Margen como fracción del open_ear_avg |
| `calibration_min_threshold` | 0.10 | Umbral mínimo absoluto |
| `calibration_max_threshold` | 0.40 | Umbral máximo absoluto |
| `alpha` (EMA) | 0.3 | Factor de suavizado del promedio |

### Pitfalls

- **Smoothing deque diluye el primer frame cerrado:** El `_left_ear_history` tiene `maxlen=2`. El primer frame tras calibración con EAR bajo se diluye con el último frame de calibración. En tests, usar 4 frames cerrados en lugar de 3 para `min_blink_frames=3`.
- **La calibración NO se resetea en `_reset()`:** El estado de calibración persiste entre parpadeos. Solo se resetea con `calibration.reset()`.
- **Threshold puede ser MAYOR que el base:** Si un usuario tiene EAR de ojos abiertos bajo (ej: 0.45), el umbral adaptativo será `0.45 - 0.0675 = 0.3825`, que es mayor que el fallback de 0.25. Esto es correcto — el umbral se adapta a la anatomía del usuario.
