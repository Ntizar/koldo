# 9009 — Investigación FreeHands

Proyectos similares analizados para enriquecer FreeHands.

## Investigación inicial (29/05/2026)

| # | Proyecto | Stack | URL |
|---|---|---|---|
| 1 | GazePointer | Python, OpenCV, dlib | github.com/alirezashahram/GazePointer |
| 2 | HandGestureControl | Python, MediaPipe, PyAutoGUI | github.com/Kazuhito00/HandGestureControl |
| 3 | VocalEyes | Python, speech_recognition, PyQt5 | github.com/BenJetson/VocalEyes |
| 4 | Envision | TypeScript, Electron, MediaPipe | github.com/andykras/envision |
| 5 | OpenFace | C++, Python bindings | github.com/TadasBaltrusaitis/OpenFace |
| 6 | Handsfree.js | JavaScript, TensorFlow.js | github.com/midiblocks/handsfree |
| 7 | Kinesic Mouse | Python, OpenCV, Dlib, PyAutoGUI | github.com/GuillaumeHeusch/KinesicMouse |
| 8 | GVS | Python, Vosk, MediaPipe, PyQt5 | github.com/adityabhagwat18/GVS |

## Investigación reaprendizaje (30/05/2026) — FASE 4

### 15 proyectos/ideas nuevas encontradas

| # | Proyecto/Recurso | Stack | URL | Ideas clave para FreeHands | Dificultad |
|---|---|---|---|---|---|
| 1 | **Talon Gaze OCR** | Python, Talon, OCR | github.com/wolfmanstout/talon-gaze-ocr | OCR integrado + gaze typing — detectar texto en pantalla y seleccionar con mirada | Media |
| 2 | **Keyboard-Typing-with-Eyes** | Python, OpenCV, dlib, MediaPipe | github.com/kbhujbal/Keyboard-Typing-with-Eyes | Teclado virtual por ojos con dual layout, audio feedback, blink para seleccionar | Baja |
| 3 | **Real-time-GesRec** | PyTorch, 3D CNNs, EgoGesture, NvGesture | github.com/ahmetgunduz/Real-time-GesRec | 27+ gestos de Jester dataset, modelos 3D CNN — reemplazar MediaPipe gestures | Alta |
| 4 | **OptiKey** | C#, .NET, eye tracking, speech | github.com/OptiKey/OptiKey | Teclado virtual con predicción de palabras, autocorrector, dwell clicking, multi-eyetracker | Media |
| 5 | **Pupil Labs** | Python, C++, OpenCV, OpenGL | github.com/pupil-labs/pupil | Plugin system extensible, gaze hotspot visualization, calibración multi-punto | Media |
| 6 | **Gesture-pdf** | OpenCV, MediaPipe | github.com/Abhirajbhat/Gesture-pdf | Air scroll vertical, pinch-to-zoom, head pose para swipe páginas | Baja |
| 7 | **AirMouse (bimanual)** | Python, MediaPipe, OpenCV | github.com/Rcidshacker/airmouse | Control bimanual: mano derecha cursor/clic, izquierda scroll/zoom | Media |
| 8 | **Virtual Hand Keyboard** | Python, MediaPipe, OpenCV, ML | github.com/MohamedAlaouiMhamdi/virtual_keyboard | Hand-typing: teclado virtual controlado por dedo índice | Media |
| 9 | **Multimodal Fusion** | MediaPipe, Python, OpenCV | github.com/Manav57/Multimodal-HCI-Eye-Voice | Fusión intención prioritaria + modo OR (cualquier canal activa) | Media |
| 10 | **Spotify Controller YOLO** | YOLO, Python, OpenCV | github.com/DazielNguyen/Real-time-Spotify-Controller | Control de apps específicas con gestos dedicados | Baja |
| 11 | **Volume Control Gestures** | YOLO, Python, OpenCV | github.com/LeadingIndiaAI/Volume-Control | Control volumen con movimiento vertical de mano | Baja |
| 12 | **HandMouse (dictado continuo)** | MediaPipe, OpenCV, CustomTkinter | github.com/KBatuhanB/HandMouse | Dictado continuo (no solo comandos discretos) con GUI | Media |
| 13 | **Emoji Control Voice** | Tendencia iOS 18/macOS 15 | — | Overlay emojis navegables con gaze + voz | Baja |
| 14 | **App Switcher Gaze+Gesture** | Tendencia visionOS | — | Switch apps con gaze dwell en iconos + pinch para cerrar | Alta |
| 15 | **Gaussian Process Calibration** | MediaPipe, MobileNetV3, GP | github.com/charbelmezeraani0-star/gaze-controlled-interface | Calibración GP adaptativa, auto-calibración continua | Alta |

### Tendencias UX 2025-2026

| Tendencia | Descripción | Dificultad |
|-----------|-------------|------------|
| Predictive Cursor | Cursor que predice destino con ML | Alta |
| Adaptive Dwell Time | Tiempo de dwell que se adapta al usuario | Media |
| Haptic Feedback | Vibración como feedback | Media |
| Auto-Calibration | Calibración continua sin intervención | Alta |
| Overlay UI Minimalista | Estilo visionOS | Media |
| Context-Aware Gestures | Gestos cambian según app activa | Alta |
| Micro-Gestures | Gestos mínimos (cabeza) para acciones frecuentes | Media |

### Arquitectura sugerida para nuevos módulos

1. `ocr` — OCR para gaze typing y detección de elementos
2. `prediction` — LM para predicción de palabras en eye typing
3. `calibration_gp` — Gaussian Process para mapeo gaze→screen
4. `bimanual` — Control con dos manos
5. `media` — Control de apps específicas
6. `dictation` — Dictado continuo
7. `emoji` — Overlay de emojis
8. `appswitcher` — Switch de apps con gaze dwell
