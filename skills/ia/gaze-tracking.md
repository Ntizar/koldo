# GazeTracking

- **URL:** https://github.com/antoinelame/GazeTracking
- **Categoría:** IA / Computer Vision / Eye Tracking
- **¿Qué hace?:** Biblioteca Python que proporciona un sistema de seguimiento de mirada basado en webcam. Detecta la posición exacta de las pupilas y la dirección de la mirada en tiempo real, usando dlib con modelos de landmarks faciales entrenados (68 landmarks). No requiere hardware especial — solo una webcam estándar.
- **Casos de uso:**
  - Control de interfaces por mirada (accesibilidad)
  - Detección de atención/distracción en usuarios
  - Análisis de engagement en presentaciones
  - Juegos y experiencias interactivas
  - Detección de parpadeo y somnolencia
  - Investigación en UX y HCI
- **Snippets útiles:**
  ```python
  # Setup básico
  import cv2
  from gaze_tracking import GazeTracking

  gaze = GazeTracking()
  webcam = cv2.VideoCapture(0)

  while True:
      _, frame = webcam.read()
      gaze.refresh(frame)

      # Direcciones de mirada
      if gaze.is_right():
          print("Mirando derecha")
      elif gaze.is_left():
          print("Mirando izquierda")
      elif gaze.is_center():
          print("Mirando centro")

      # Coordenadas de pupilas
      left_pupil = gaze.pupil_left_coords()
      right_pupil = gaze.pupil_right_coords()

      # Parpadeo
      if gaze.is_blinking():
          print("Parpadeo detectado")

      # Ratio horizontal (0.0 = derecha extrema, 0.5 = centro, 1.0 = izquierda extrema)
      h_ratio = gaze.horizontal_ratio()
      v_ratio = gaze.vertical_ratio()

      # Frame anotado con círculos en ojos
      annotated = gaze.annotated_frame()
      cv2.imshow("Gaze", annotated)
      if cv2.waitKey(1) == 27:
          break
  ```
  ```python
  # Instalación
  pip install gaze-tracking
  # O desde source:
  pip install -e .
  ```
- **Cómo integrarlo en proyectos:**
  1. Instalar: `pip install gaze-tracking` (requiere Python 3.10+)
  2. Si dlib falla en compilación: `sudo apt install cmake build-essential`
  3. Crear instancia `GazeTracking()`
  4. En loop de webcam: `gaze.refresh(frame)` → leer propiedades
  5. Usar métodos `is_left()`, `is_right()`, `is_center()`, `is_blinking()` para lógica
  6. Para calibración personalizada: `gaze.calibration` (Clase Calibration)
  7. Docker: `./build_and_run.sh` (Linux solo)
- **Fecha de aprendizaje:** 2026-05-26
- **Stars:** 2571
- **Licencia:** MIT
