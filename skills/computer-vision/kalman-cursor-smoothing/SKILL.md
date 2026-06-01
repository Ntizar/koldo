---
name: kalman-cursor-smoothing
description: "Kalman filter for gaze/gesture cursor smoothing — replaces EMA with 2-D constant-velocity model for better latency-smoothness tradeoff"
version: 1.0.0
author: Koldo
tags: [kalman, cursor, smoothing, gaze, signal-processing, numpy]
---

# Kalman Cursor Smoothing

Reemplaza suavizado exponencial (EMA) por filtro de Kalman 2-D con modelo de velocidad constante para tracking de cursor (gaze, gestos, etc.).

## ¿Cuándo usarlo

- Cursor de gaze/joystick/gestos con jitter perceptible
- EMA no es suficiente: produce latencia alta o suavizado excesivo
- Se necesita estimación de velocidad (para scroll, zoom, etc.)
- El sistema tiene un FPS conocido y constante

## Diseño recomendado

### Estado: [x, y, vx, vy] (4 elementos)

Modelo de velocidad constante — asume que el cursor se mueve a velocidad constante entre frames.

### Matrices

| Matriz | Dimensión | Propósito |
|--------|-----------|-----------|
| F | 4×4 | Transición de estado (constante velocidad) |
| H | 2×4 | Observación (solo x, y visibles) |
| Q | 4×4 | Ruido de proceso (cuánto esperamos que se mueva) |
| R | 2×2 | Ruido de medición (cuánto confiamos en el sensor) |
| P | 4×4 | Covarianza del estado |

### Parámetros configurables

```python
@dataclass(frozen=True)
class KalmanParams:
    process_noise: float = 25.0          # Mayor = más reactivo, más jitter
    measurement_noise: float = 400.0     # Mayor = más suave, más latencia
    initial_uncertainty: float = 1000.0  # Incertidumbre inicial del estado
```

**Regla de sintonía:**
- `process_noise` bajo (0.01–1.0) → cursor muy suave, latencia alta
- `process_noise` medio (10–50) → equilibrio recomendado
- `process_noise` alto (100+) → muy reactivo, posible jitter
- `measurement_noise` bajo (100–200) → confía más en el sensor
- `measurement_noise` alto (1000+) → confía más en el modelo (suavizado)

## Implementación

### Paso 1: Crear el filtro

Archivo: `src/.../kalman_filter.py`

```python
import numpy as np
from dataclasses import dataclass

@dataclass(frozen=True)
class KalmanParams:
    process_noise: float = 25.0
    measurement_noise: float = 400.0
    initial_uncertainty: float = 1000.0

class KalmanCursorFilter:
    def __init__(self, params: KalmanParams | None = None) -> None:
        self._params = params or KalmanParams()
        self._initialized = False
        self._x = np.zeros(4, dtype=float)  # [x, y, vx, vy]
        self._P = self._params.initial_uncertainty * np.eye(4)
        self._dt = 1.0
        self._F = self._build_F()
        self._H = np.array([[1,0,0,0],[0,1,0,0]], dtype=float)
        self._Q = self._build_Q()
        self._R = np.array([[self._params.measurement_noise, 0],
                            [0, self._params.measurement_noise]])

    def _build_F(self) -> np.ndarray:
        dt = self._dt
        return np.array([[1,0,dt,0],[0,1,0,dt],[0,0,1,0],[0,0,0,1]], dtype=float)

    def _build_Q(self) -> np.ndarray:
        q = self._params.process_noise
        dt = self._dt
        return np.array([
            [dt**4/4*q, 0, dt**3/2*q, 0],
            [0, dt**4/4*q, 0, dt**3/2*q],
            [dt**3/2*q, 0, dt**2*q, 0],
            [0, dt**3/2*q, 0, dt**2*q],
        ])

    def update(self, measurement: tuple[float, float]) -> tuple[float, float]:
        if not self._initialized:
            self._x = np.array([measurement[0], measurement[1], 0.0, 0.0])
            self._P = self._params.initial_uncertainty * np.eye(4)
            self._initialized = True
            return measurement

        # Predict
        self._x = self._F @ self._x
        self._P = self._F @ self._P @ self._F.T + self._Q

        # Update
        z = np.array(measurement, dtype=float)
        y = z - self._H @ self._x
        S = self._H @ self._P @ self._H.T + self._R
        K = self._P @ self._H.T @ np.linalg.inv(S)
        self._x = self._x + K @ y
        self._P = (np.eye(4) - K @ self._H) @ self._P

        return float(self._x[0]), float(self._x[1])

    def reset(self) -> None:
        self._initialized = False
        self._x = np.zeros(4, dtype=float)
        self._P = self._params.initial_uncertainty * np.eye(4)

    @property
    def velocity(self) -> tuple[float, float]:
        return float(self._x[2]), float(self._x[3])
```

### Paso 2: Integrar en el componente existente

Reemplaza el suavizado existente (EMA) en el método `predict`:

```python
# Antes (EMA):
self._smoothed = self._alpha * raw + (1 - self._alpha) * self._smoothed
return int(self._smoothed[0]), int(self._smoothed[1])

# Después (Kalman):
smoothed = self._kalman.update((x, y))
return int(round(smoothed[0])), int(round(smoothed[1]))
```

### Paso 3: Exportar en `__init__.py`

```python
from .kalman_filter import KalmanCursorFilter, KalmanParams
__all__ = [..., "KalmanCursorFilter", "KalmanParams", ...]
```

## Testing

### Tests mínimos requeridos

1. **First update returns measurement** — el primer frame no se suaviza
2. **Second frame is smoothed** — el segundo frame está entre la medición y la estimación previa
3. **Rapid movement tracks** — saltos grandes se rastrean con latencia (no instantáneo)
4. **Reset clears state** — reset vuelve a estado no inicializado
5. **Velocity estimation** — la velocidad se construye con movimiento consistente
6. **Parameter tuning** — alta process_noise = más reactivo, baja = más suave
7. **Convergence** — mediciones idénticas convergen al valor
8. **Integration** — el componente que usa el filtro produce resultados correctos

### Patrón de test

```python
def test_second_frame_is_smoothed() -> None:
    kf = KalmanCursorFilter()
    kf.update((100.0, 200.0))
    result = kf.update((102.0, 201.0))
    assert 100.0 < result[0] < 102.0  # entre medición y estimación previa
```

## Comparación EMA vs Kalman

| Propiedad | EMA (alpha=0.5) | Kalman (default) |
|-----------|-----------------|------------------|
| Estado | 1 valor (x, y) | 4 valores (x, y, vx, vy) |
| Latencia | Alta (alpha bajo) | Media (ajustable) |
| Jitter | Medio | Bajo |
| Velocidad | No disponible | Disponible |
| Parámetros | 1 (alpha) | 2 (process_noise, measurement_noise) |
| Rendimiento | O(1) simple | O(1) con inversión de matriz 2×2 |

**Ventaja principal de Kalman:** estimación de velocidad + mejor tradeoff latencia-suavizado.

## Pitfalls

1. **Clamping fuera del filtro** — el Kalman NO hace clamping. Hacerlo en el componente que llama (ej. `GazeRegressor.predict` antes de pasar al Kalman).
2. **First frame** — el primer update retorna la medición cruda. Esto es correcto (no hay estimación previa).
3. **Reset** — siempre llamar `reset()` cuando el tracker se desconecta/reconecta para evitar transiciones bruscas.
4. **FPS variable** — el filtro asume dt=1 (un frame). Si el FPS varía, ajustar `_dt` dinámicamente.
5. **No usar para tracking de objetos** — este filtro es para cursor en pantalla, no para tracking de objetos en imagen (ahí se necesita modelo de movimiento más complejo).

## Referencias

- `references/kalman-cursor-freehands.md` — Implementación específica en FreeHands (reemplazo de EMA en GazeRegressor)
