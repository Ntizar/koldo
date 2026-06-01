# cv2 mocking en tests de FreeHands

## Problema
El venv de Hermes (`/opt/hermes/.venv`) tiene una versión de `cv2` que colisiona con `python3-opencv` del sistema. Esto causa `ModuleNotFoundError` o `AttributeError` en tests que importan `cv2` indirectamente (vía MediaPipe).

## Solución

### Para tests estructurales (sin detect()):
No se necesita mock de cv2 — solo mock de MediaPipe.

```python
from unittest.mock import MagicMock, patch
import sys

mock_cv2 = MagicMock()
with patch.dict(sys.modules, {"cv2": mock_cv2, "cv2.dnn": MagicMock()}):
    from freehands.gestures.face_tracker import FaceTracker
```

### Para tests de detección (con detect()):
Mock cv2 dentro del test, no al nivel del módulo:

```python
def test_smile_detection():
    mock_cv2 = MagicMock()
    mock_cv2.CascadeClassifier.return_value = MagicMock(
        detectMultiScale=MagicMock(return_value=[])
    )
    with patch.dict(sys.modules, {"cv2": mock_cv2, "cv2.dnn": MagicMock()}):
        tracker = FaceTracker()
        # ... setup landmarks mock ...
        result = tracker.detect(mock_frame)
        assert result.gestures == ["smile"]
```

### Para tests de detección de rostro con cara mock:
```python
def test_face_detection_with_mock_face():
    mock_cv2 = MagicMock()
    mock_face = np.array([[[128, 128, 128]]], dtype=np.uint8)
    mock_cv2.CascadeClassifier.return_value = MagicMock(
        detectMultiScale=MagicMock(return_value=[[0, 0, 100, 100]])
    )
    mock_cv2.resize.return_value = mock_face
    with patch.dict(sys.modules, {"cv2": mock_cv2, "cv2.dnn": MagicMock()}):
        tracker = FaceTracker()
        # ... setup ...
```

## Pitfalls
- **No usar `@patch('cv2')`** — no funciona porque cv2 no está en el namespace del módulo, está importado como `import cv2` dentro del método `detect()`.
- **No usar `sys.modules['cv2'] = mock` sin `with`** — contamina otros tests.
- **MediaPipe importa cv2 internamente** — si el mock no tiene los atributos correctos (`dnn`, `CascadeClassifier`, `resize`, `cvtColor`), MediaPipe crashará antes de llegar al código.
