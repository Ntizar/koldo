---
name: serializable-ml-models
description: "Serializar modelos ML instance-based (KNN, etc.) en schemas Pydantic con tipos Union para compatibilidad con modelos paramétricos (Ridge, polinomiales)."
version: 1.0.0
author: Ntizar
tags: [mlops, ML, serialization, Pydantic]

---

# serializable-ml-models

Serializar modelos ML instance-based (KNN, etc.) en schemas Pydantic con tipos Union para compatibilidad con modelos paramétricos (Ridge, polinomiales).

## Problema

Los modelos paramétricos (Ridge, GP, linear regression) guardan pesos planos `list[float]`. Los modelos instance-based (KNN) necesitan guardar matrices completas `list[list[float]]`. Un mismo Pydantic model no puede tener `weights_x: list[float]` y aceptar matrices 2D.

## Patrón

### 1. Schema Pydantic con tipos Union

```python
class GazeModel(BaseModel):
    type: str = "parametric_model"
    feature_version: int = 1
    # Accept BOTH flat (parametric) and 2D (instance-based)
    weights_x: list[float] | list[list[float]] = Field(default_factory=list)
    weights_y: list[float] = Field(default_factory=list)
    bias_x: list[float] | float = Field(default=0.0)
    bias_y: float | int = 0
    # Extra fields for instance-based models
    training_features: list[list[float]] = Field(default_factory=list)
    training_targets_x: list[float] = Field(default_factory=list)
    training_targets_y: list[float] = Field(default_factory=list)
    k: int = 0  # for KNN
```

**Regla clave:** `weights_x` debe ser `list[float] | list[list[float]]` (Union), NO `list[float]`. Pydantic v2 valida estrictamente — pasar una lista de listas a `list[float]` produce `ValidationError: Input should be a valid number`.

### 2. Función de entrenamiento que devuelve el modelo serializable

```python
def fit_knn_model(samples: list[CalibrationSample], n_neighbors: int = 5,
                  weights: str = "distance") -> GazeModel:
    X = np.stack([build_design(s.features) for s in samples])
    y = np.array([s.target for s in samples])

    knn_x = KNeighborsRegressor(n_neighbors=n_neighbors, weights=weights)
    knn_y = KNeighborsRegressor(n_neighbors=n_neighbors, weights=weights)
    knn_x.fit(X, y[:, 0])
    knn_y.fit(X, y[:, 1])

    # Store in fields that the regressor's __init__ expects
    return GazeModel(
        type="knn_regression",
        feature_version=CURRENT_VERSION,
        weights_x=X.tolist(),        # 2D matrix
        weights_y=y[:, 0].tolist(),  # 1D vector
        bias_x=y[:, 1].tolist(),     # 1D vector
        bias_y=float(n_neighbors),   # k as float
    )
```

**Regla clave:** Los datos de entrenamiento se almacenan en `weights_x` (X matrix), `weights_y` (y_x), `bias_x` (y_y), `bias_y` (k). El `__init__` del regresor lee directamente de estos campos. No usar campos `training_*` separados porque el regresor no los conoce.

### 3. Regresor con detección de tipo

```python
class GazeRegressor:
    def __init__(self, model: GazeModel, screen_size: tuple[int, int], ...):
        self._wx = np.array(model.weights_x) if model.weights_x else None
        self._wy = np.array(model.weights_y) if model.weights_y else None
        self._bx = model.bias_x
        self._by = model.bias_y
        self._model_type = model.type

        if self._model_type == "knn_regression":
            self._build_knn_models()

    def _build_knn_models(self) -> None:
        if self._model_type != "knn_regression":
            return
        if self._wx is None or self._wy is None:
            return
        X = np.array(self._wx)    # 2D array
        yx = np.array(self._wy)   # 1D array
        yy = np.array(self._bx)   # 1D array
        k = self._knn_k if self._knn_k else DEFAULT_K
        self._knn_x = KNeighborsRegressor(n_neighbors=k, weights="distance")
        self._knn_y = KNeighborsRegressor(n_neighbors=k, weights="distance")
        self._knn_x.fit(X, yx)
        self._knn_y.fit(X, yy)

    def trained(self) -> bool:
        if self._model_type == "knn_regression":
            return self._knn_x is not None and self._knn_y is not None
        return self._wx is not None and self._wy is not None

    def predict(self, features: np.ndarray) -> tuple[int, int] | None:
        if not self.trained:
            return None
        if self._model_type == "knn_regression":
            return self._predict_knn(features)
        # ... parametric path ...

    def _predict_knn(self, features: np.ndarray) -> tuple[int, int] | None:
        design = self._design_vector(features).reshape(1, -1)
        x = float(self._knn_x.predict(design)[0])
        y = float(self._knn_y.predict(design)[0])
        # clamp + Kalman smoothing ...
```

### 4. Tests

Crear tests separados para cada tipo de modelo:
- `test_fit_*_model_requires_minimum_samples`
- `test_fit_*_model_returns_serialisable_model`
- `test_*_regressor_predicts_with_*_model`
- `test_*_regressor_returns_none_when_untrained_*`
- `test_*_regressor_still_works` (regresión: verificar que el otro tipo sigue funcionando)

## Pitfalls

- **Pydantic strict validation:** `list[float]` NO acepta `list[list[float]]`. Siempre usar `list[float] | list[list[float]]` para campos que pueden ser matrices.
- **np.array() con listas de listas:** `np.array([[1,2],[3,4]])` crea un array 2D correctamente. Pero `np.array([1,2,3])` crea 1D. El código debe manejar ambos casos.
- **bias_x/bias_y como Union:** Para Ridge, `bias_x` es un float escalar. Para KNN, es un vector. Usar `list[float] | float` y `float | int`.
- **No mezclar tipos:** Un modelo KNN NUNCA debe pasar por el camino paramétrico y viceversa. La detección por `model.type` es la fuente de verdad.
- **Serialización JSON:** `model.model_dump()` funciona con Union types. `model.model_validate(data)` también. Verificar round-trip en tests.

## Referencias

- `references/knn-gaze-implementation.md` — Implementación concreta de KNN en FreeHands (mejora #34)
