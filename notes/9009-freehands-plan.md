# Plan 9009 — FreeHands

Pipeline de mejora continua para el proyecto [FreeHands](https://github.com/Ntizar/FreeHands).
Control del PC sin manos: mirada + gestos + voz.

|| **Inicio:** 29/05/2026 |
|| | **Última actualización:** 01/06/2026 — #32 Zoom magnifier sobre área de mirada ✅ |

## Mejoras

|| # | Mejora | Área | Dificultad | Archivos | Verificación | Estado |
|---|---|---|---|---|---|---|
| 1 | Scroll por gesto con palma abierta | Gestos | baja | `fusion/fusion.py`, `state_machine.py`, `profiles/` | Probar scroll vertical al subir/bajar palma | ✅ hecha 29/05/2026 |
| 2 | Dead zones en bordes de pantalla | Gaze | baja | `gaze/dead_zones.py`, `main.py` | El cursor no debe ir a coordenadas extremas | ✅ hecha 29/05/2026 |
| 3 | Feedback auditivo de confirmación | UX | baja | `ui/audio_feedback.py`, `main.py`, `profiles/store.py` | Beep alto en gesto, beep bajo en voz | ✅ hecha 29/05/2026 |
| 4 | Comandos de sistema por voz (show desktop, screenshot, volume) | Voz | baja | `voice/whisper_listener.py`, `actions/dispatcher.py`, `main.py` | Probar "show desktop", "screenshot", "volume up" | ✅ hecha 29/05/2026 |
| 5 | Clic por guiño (guiño derecho = clic izq, guiño izq = clic der) | Gaze | baja | `gaze/blink_detector.py`, `gaze/tracker.py`, `fusion/fusion.py`, `main.py` | Probar parpadeo intencional como click | ✅ hecha 29/05/2026 |
| 6 | Configuración de gestos vía JSON externo | Perfiles | baja | `profiles/store.py`, `profiles/__init__.py`, `gesture_profiles/`, `tests/test_gesture_profiles.py` | 12 tests unitarios pasando, ejemplos gaming.json y accessibility.json | ✅ hecha 29/05/2026 |
| 7 | Vosk offline como backend de voz alternativo | Voz | baja | `voice/whisper_listener.py`, `config.py`, `profiles/store.py` | Instalar Vosk, probar comando offline | ✅ hecha 30/05/2026 |
| 8 | Priorización dinámica de canales (gesto vs voz) | Fusión | media | `fusion/channel_priority.py`, `fusion/__init__.py`, `main.py` | 20 tests unitarios pasando | ✅ hecha 30/05/2026 |
| 9 | Snap-to-grid UI (pegar cursor a centro de elemento tras 300ms) | Gaze | media | `main.py`, `fusion/fusion.py` | Estabilizar cursor en elementos UI | ✅ hecha 30/05/2026 |
| 10 | Menú OSD radial con acciones (mano abierta → menú circular) | UX | media | `ui/radial_menu.py`, `ui/__init__.py`, `main.py` | Menú circular con acciones frecuentes | ✅ hecha 30/05/2026 |
| 11 | Calibración 9 puntos con regresión polinomial | Gaze | media | `gaze/calibration.py`, `gaze/tracker.py`, `config.py` | 15 tests unitarios pasando, modelo polinomial v5 con 27 features | ✅ hecha 30/05/2026 |
| 12 | Overlay transparente PyQt6 sobre escritorio | UI | media | `ui/overlay.py`, `ui/__init__.py` | Widget transparente full-screen con halo radial, anillo de posición y soporte multi-monitor | ✅ hecha 30/05/2026 |
| 13 | Doble parpadeo rápido = clic, prolongado = drag | Gaze | media | `gaze/blink_detector.py`, `gaze/tracker.py`, `fusion/fusion.py`, `actions/dispatcher.py`, `main.py` | 17 tests unitarios + 6 tests fusión | ✅ hecha 30/05/2026 |
| 14 | Fusión multimodal con operador AND (voz + mirada) | Fusión | media | `fusion/fusion.py`, `main.py` | Acción solo si voz y mirada coinciden | ✅ hecha 30/05/2026 — 17 tests unitarios pasando |
| 15 | Filtro Kalman predictivo para suavizado de cursor | Gaze | alta | `gaze/kalman_filter.py`, `gaze/calibration.py`, `gaze/__init__.py` | 18 tests unitarios pasando, reemplaza EMA por Kalman 2-D con modelo de velocidad constante | ✅ hecha 30/05/2026 — 18 tests unitarios pasando, 81 tests totales |
| 16 | Sistema de plugins Python (pipeline extensible) | Arquitectura | alta | `fusion/`, `main.py`, nueva carpeta `plugins/` | Pipeline Camera→Detector→Filter→Plugin→Executor | ✅ hecha 30/05/2026 — 24 tests unitarios pasando, 105 tests totales |
| 17 | Head pose 6DoF para desplazamiento grueso | Gaze | alta | `gaze/head_pose.py`, `gaze/tracker.py`, `gaze/__init__.py`, `fusion/fusion.py`, `main.py` | 15 tests unitarios pasando, 131 tests totales | ✅ hecha 30/05/2026 |
| 18 | Unidades de acción facial (sonrisa, ceño, sorpresa) | Gestos | alta | `gestures/face_tracker.py`, `fusion/fusion.py`, `main.py`, `ui/overlay.py`, `profiles/store.py` | Integración completa: FaceTracker instanciado en main.py, detect() en loop tick(), stabilizer facial, UI face_info, GESTURE_LABELS extendidos | ✅ hecha 31/05/2026 |
| 19 | Teclado virtual con selección por mirada | UX | alta | `ui/virtual_keyboard.py`, `main.py`, `actions/dispatcher.py`, `voice/whisper_listener.py` | Widget PyQt6 translúcido con layout QWERTy, dwell en teclas, shift/espacio/enter/backspace, apertura/cierre por voz | ✅ hecha 31/05/2026 |
| 20 | Modo dictado (mirar campo + decir "escribe" + dictar) | Voz | alta | `voice/dictation_intent.py`, `voice/__init__.py`, `ui/overlay.py`, `main.py` | Detector de intención multimodal (mirada en región de texto + comando voz), indicador pulsante en overlay, 15 tests unitarios pasando | ✅ hecha 31/05/2026 |
| 21 | OCR integrado + gaze typing (talon-gaze-ocr) | Nuevos | media | `ocr/`, `ui/gaze_text_selector.py`, `main.py`, `voice/whisper_listener.py` | Detector de regiones de texto con OpenCV, widget overlay con dwell/blink selection, 18 tests unitarios pasando | ✅ hecha 31/05/2026 |
| 22 | Teclado virtual dual layout por ojos (Keyboard-Typing-with-Eyes) | UX | baja | `ui/virtual_keyboard.py`, `main.py` | Layout izq/der dinámico, audio feedback, blink para seleccionar | ✅ hecha 31/05/2026 |
| 23 | Calibración con Gaussian Process (auto-calibración continua) | Gaze | alta | `gaze/calibration.py`, `profiles/store.py`, `main.py`, `tests/` | GPGazeModel serializable, GPGazeRegressor con Kalman, auto-calibración continua (muestras implícitas cada 30 frames), ventana deslizante 200 samples, guardado cada 5 min, 10 tests unitarios pasando | ✅ hecha 31/05/2026 — 10 tests unitarios pasando, 26 tests calibración totales, 359 tests totales |
| 24 | Control bimanual (mano derecha cursor, izquierda scroll/zoom) | Gestos | media | `gestures/hand_fusion.py`, `main.py`, `tests/` | Dos manos independientes: cursor+clic + scroll+zoom | ✅ hecha 31/05/2026 |
| 25 | Air scroll vertical con mano (gesto de barrido) | Gestos | baja | `gestures/hand_tracker.py`, `fusion/fusion.py`, `profiles/store.py`, `tests/` | 11 tests unitarios pasando, scroll con cualquier pose de mano | ✅ hecha 30/05/2026 |
| 26 | Control de volumen con posición Y de mano | Gestos | baja | `gestures/volume_control.py`, `main.py`, `profiles/store.py` | Mano arriba → volumen sube, mano abajo → baja | ✅ hecha 31/05/2026 |
| 27 | Dictado continuo con Whisper/Vosk (no solo comandos discretos) | Voz | media | `voice/continuous_dictation.py`, `main.py`, `voice/whisper_listener.py`, `profiles/store.py` | Motor de dictado libre con detección de silencio, puntuación automática (coma, punto, nueva linea), buffers de texto, 25 tests unitarios pasando | ✅ hecha 31/05/2026 |
| 28 | Overlay de emojis navegables con gaze + voz | UX | baja | `ui/emoji_overlay.py`, `voice/` | Navegar emojis con mirada, confirmar con voz o blink | ✅ hecha 31/05/2026 |
| 29 | App switcher con gaze dwell + pinch para cerrar | UX | alta | `ui/app_switcher.py`, `actions/dispatcher.py` | Dwell en iconos taskbar, pinch para cerrar, swipe para cambiar | ✅ hecha 31/05/2026 |
| 30 | Fusión multimodal con modo OR + intención prioritaria | Fusión | media | `fusion/fusion.py`, `fusion/channel_priority.py`, `tests/test_or_fusion.py` | 26 tests unitarios pasando, 157 tests totales | ✅ hecha 31/05/2026 — 26 tests unitarios pasando |
| 31 | Calibración EAR personalizada por usuario (Eye2cursor) | Gaze | baja | `gaze/blink_detector.py`, `gaze/__init__.py`, `tests/test_ear_calibration.py` | 14 tests unitarios pasando, umbral adaptativo por usuario | ✅ hecha 01/06/2026 |
| 32 | Zoom magnifier sobre área de mirada (VocalIris-OS) | UX | baja | `ui/overlay.py`, `ui/__init__.py`, `main.py` | Ventana de aumento sobre el punto de mira para texto pequeño, 5 tests unitarios | ✅ hecha 01/06/2026 — 12 tests unitarios pasando |
| 33 | Punto sticky con UI element detection (VocalIris-OS) | Gaze | media | `gaze/snap_to_grid.py`, `fusion/fusion.py`, `main.py` | Mejorar snap-to-grid con detección real de elementos UI (ventanas, botones) usando X11/Wayland, 10 tests unitarios | ⏳ pendiente |
| 34 | Mapeo gaze con KNN en lugar de Ridge (Deer Mouse) | Gaze | baja | `gaze/calibration.py`, `tests/` | KNN como alternativa a Ridge regression, configurable por perfil, 6 tests unitarios | ⏳ pendiente |
| 35 | Dashboard analítico con métricas I-DT (Eyeputer) | Analytics | media | `ui/overlay.py`, `main.py`, `gaze/tracker.py`, `tests/` | Métricas de fijación (fixation count, duration, dispersion), heatmap de gaze, export CSV, 12 tests unitarios | ⏳ pendiente |
| 36 | Modo dual hand/eye con cambio por voz (GestureMouseKeyControl) | Fusión | media | `main.py`, `fusion/fusion.py`, `voice/whisper_listener.py`, `gestures/hand_tracker.py` | Cambio de modo por voz ("modo mano", "modo ojos"), pipelines independientes, 15 tests unitarios | ⏳ pendiente |
| 37 | Voice typing mode completo (GestureMouseKeyControl) | Voz | baja | `voice/continuous_dictation.py`, `main.py`, `ui/virtual_keyboard.py` | "start typing" / "stop typing", 99+ idiomas con Whisper, integración con teclado virtual, 12 tests unitarios | ⏳ pendiente |
| 38 | TTS feedback para texto escrito + predictive text (AI-VisionKey) | UX | media | `ui/virtual_keyboard.py`, `voice/whisper_listener.py`, `profiles/store.py` | El sistema "lee" el texto escrito para confirmar, sugerencias de palabras, 10 tests unitarios | ⏳ pendiente |
| 39 | Meta-calibración por sesión (EMC-Gaze arXiv) | Gaze | alta | `gaze/calibration.py`, `profiles/store.py`, `tests/` | Adaptación a nueva sesión desde pequeño set de calibración, modelo equivariante E(3), 8 tests unitarios | ⏳ pendiente |
| 40 | Empaquetado pip instalable + CLI doctor (GazeControl) | Infraestructura | baja | `pyproject.toml`, `src/freehands/__main__.py`, `src/freehands/doctor.py` | `pip install freehands`, CLI con doctor mode, config por env vars, 5 tests de instalación | ⏳ pendiente |

## Progreso

|| **Completadas:** 32 / 40 (80%) |
|| **Pendientes:** 8 |

## Orden de implementación

Se priorizan las de dificultad **baja** primero (victorias rápidas que dan valor inmediato).
Luego **media**, y finalmente **alta** (requieren cambios arquitectónicos).

Cada ejecución del cron 9009-FreeHands coge la siguiente mejora ⏳ con menor nº de dificultad baja.

## Fuentes de investigación FASE 4 (01/06/2026)

Proyectos investigados en reaprendizaje semanal:
- Eyeputer (canakbs) — Blink commands diferenciadas por ojo + dashboard analítico I-DT
- VocalIris OS (IttehadZumar) — Point & Command (mirar + voz para confirmar)
- Smart-Assistive-Cursor (venkat1845) — YOLO + ResNet18 head pose
- Deer Mouse (jlopez) — KNN mapping gaze → screen coordinates
- BlinkDrive (moyososvbL) — Chrome extension + WCAG + Gemini IA
- GestureMouseKeyControl (Junhui20) — Dual-mode hand/eye + voice typing
- Eye2cursor (Fatcatcreate) — EAR calibration + velocity adaptation
- AI-VisionKey (simran-14) — Híbrido eye+voice + TTS + predictive text
- EMC-Gaze (arXiv 2603.12388) — Meta-calibración + equivariant encoder
- GazeControl (TheDarkHoleYT) — Pip installable + pinch gestures

Tendencias 2026 investigadas:
- Meta-calibración por sesión (EMC-Gaze)
- Blink commands diferenciadas por ojo (Eyeputer, VocalIris-OS)
- Point & Command: mirar + voz para confirmar (VocalIris-OS)
- I-DT Fixation Detection para analytics (Eyeputer)
- Voice typing mode completo (GestureMouseKeyControl)
- Head pose + gaze fusion para cursor estable (Smart-Assistive-Cursor)
- Predictive text + TTS feedback (AI-VisionKey)
- WCAG compliance para accesibilidad (BlinkDrive)
- Equivariant neural encoders (EMC-Gaze)
- Online-first con offline fallback (VocalIris-OS)
- Zoom magnifier sobre área de mirada (VocalIris-OS)
- Mapeo KNN como alternativa a Ridge regression (Deer Mouse)
- Empaquetado pip profesional + CLI doctor (GazeControl)
