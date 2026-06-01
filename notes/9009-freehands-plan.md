# Plan 9009 — FreeHands

Pipeline de mejora continua para el proyecto [FreeHands](https://github.com/Ntizar/FreeHands).
Control del PC sin manos: mirada + gestos + voz.

|| **Inicio:** 29/05/2026 |
|| | **Última actualización:** 01/06/2026 — #37 Voice typing mode completo ✅ |

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
| 34 | Mapeo gaze con KNN en lugar de Ridge (Deer Mouse) | Gaze | baja | `gaze/calibration.py`, `profiles/store.py`, `gaze/__init__.py`, `tests/test_knn_calibration.py` | KNN como alternativa a Ridge regression, configurable por perfil, 13 tests unitarios pasando | ✅ hecha 01/06/2026 — 13 tests unitarios pasando |
| 35 | Dashboard analítico con métricas I-DT (Eyeputer) | Analytics | media | `ui/overlay.py`, `main.py`, `gaze/tracker.py`, `tests/` | Métricas de fijación (fixation count, duration, dispersion), heatmap de gaze, export CSV, 12 tests unitarios | ⏳ pendiente |
| 36 | Modo dual hand/eye con cambio por voz (GestureMouseKeyControl) | Fusión | media | `main.py`, `fusion/fusion.py`, `voice/whisper_listener.py`, `gestures/hand_tracker.py` | Cambio de modo por voz ("modo mano", "modo ojos"), pipelines independientes, 15 tests unitarios | ⏳ pendiente |
| 37 | Voice typing mode completo (GestureMouseKeyControl) | Voz | baja | `voice/continuous_dictation.py`, `main.py`, `ui/virtual_keyboard.py` | "start writing" / "stop writing", 99+ idiomas con Whisper, detección automática de idioma, indicador en overlay, 11 tests unitarios pasando (47 tests dictation totales) | ✅ hecha 01/06/2026 |
| 38 | TTS feedback para texto escrito + predictive text (AI-VisionKey) | UX | media | `ui/virtual_keyboard.py`, `voice/whisper_listener.py`, `profiles/store.py` | El sistema "lee" el texto escrito para confirmar, sugerencias de palabras, 10 tests unitarios | ⏳ pendiente |
| 39 | Meta-calibración por sesión (EMC-Gaze arXiv) | Gaze | alta | `gaze/calibration.py`, `profiles/store.py`, `tests/` | Adaptación a nueva sesión desde pequeño set de calibración, modelo equivariante E(3), 8 tests unitarios | ⏳ pendiente |
| 40 | Empaquetado pip instalable + CLI doctor (GazeControl) | Infraestructura | baja | `pyproject.toml`, `src/freehands/__main__.py`, `src/freehands/doctor.py` | `pip install freehands`, CLI con doctor mode, config por env vars, 5 tests de instalación | ⏳ pendiente |

| 41 | Detección de fatiga visual y pausas activas (Vital-Sign, MINDWAVE) | UX | baja | `ui/overlay.py`, `gaze/blink_detector.py`, `main.py` | Monitorizar tasa de parpadeo y micro-expresiones para detectar fatiga. Alerta visual/auditiva tras X min sin pausa. Basado en MINDWAVE (MediaPipe Face Mesh + BPM + micro-jitter) y Vital-Sign (blink analysis). 5 tests unitarios | ⏳ pendiente |
| 42 | Detección de estrés y estado emocional (MINDWAVE, NeuroScan) | Analytics | media | `gestures/face_tracker.py`, `ui/overlay.py`, `main.py`, `tests/` | Cuadrifactor: BPM (blink rate), micro-jitter facial, tensión muscular, bloqueos. Emociones: felicidad, tristeza, ira, miedo, neutral. Dashboard en overlay con score emocional. Inspirado en MINDWAVE y NeuroScan (Random Forest 92% accuracy). 10 tests unitarios | ⏳ pendiente |
| 43 | AAC Board con tablero de comunicación aumentativa (GazeAAC, OCULA) | UX | media | `ui/emoji_overlay.py`, `ui/radical_menu.py`, `main.py` | Tablero AAC tipo GazeAAC: grid de tiles con palabras/frases, dwell-to-click, probabilidad contextual (palabras más frecuentes primero). Inspirado en GazeAAC (LAMP method, motor-plan consistency) y OCULA (browser-only, 6-tile board). 8 tests unitarios | ⏳ pendiente |
| 44 | Detección de saccadas y fijaciones con I-DT (comarquet eye-tracking) | Analytics | media | `gaze/tracker.py`, `gaze/kalman_filter.py`, `ui/overlay.py`, `tests/` | Implementar I-DT (Identified-Dwell-Time) para detectar fijaciones reales vs. movimiento ocular. Métricas: fixation count, duration, dispersion, saccade velocity, scanpath. Export CSV. Inspirado en comarquet/eye-tracking (TypeScript library con I-DT, I-VT, HMM). 10 tests unitarios | ⏳ pendiente |
| 45 | Control por expresiones faciales completas (Archead) | Gestos | baja | `gestures/face_tracker.py`, `fusion/fusion.py`, `main.py` | Mapear expresiones faciales a acciones: boca abierta = clic, cejas arriba = scroll up, cejas abajo = scroll down, cabeza inclinada = tab switch. Inspirado en Archead (3★, head movements + facial expressions). 8 tests unitarios | ⏳ pendiente |
| 46 | Region-based cursor mapping (GestureOS) | Gaze | baja | `gaze/tracker.py`, `gaze/kalman_filter.py`, `fusion/fusion.py` | Mapear cursor solo dentro de región central (80% pantalla) para mayor precisión. Borde = zona muerta expandida. Inspirado en GestureOS (4★, region-based cursor). 5 tests unitarios | ⏳ pendiente |
| 47 | Pupil dilation measurement para detección de carga cognitiva | Analytics | media | `gaze/blink_detector.py`, `gaze/tracker.py`, `ui/overlay.py`, `tests/` | Medir dilatación pupilar como proxy de carga cognitiva y estado de atención. Usar MediaPipe Face Mesh landmarks periorbitales. Alertar cuando carga cognitiva > umbral (posible frustración). Inspirado en NeuroScan (pupil dilation como feature de estrés). 8 tests unitarios | ⏳ pendiente |
| 48 | Integración con copilot/IA assistant por voz + mirada | Voz | alta | `voice/whisper_listener.py`, `fusion/fusion.py`, `main.py` | Comando de voz "pregúntale a la IA" + mirar elemento de UI para contexto. FreeHands envía screenshot + posición de mirada al copilot. Respuesta leída por TTS. Inspirado en tendencias 2026 de IA + control sin manos. 10 tests unitarios | ⏳ pendiente |
| 49 | Soporte Wayland nativo (X11 solo actualmente) | Infraestructura | alta | `fusion/fusion.py`, `main.py`, `gestures/hand_tracker.py` | Implementar soporte Wayland con `wlr-layer-shell` o `xdg-decoration`. Scraping de pantalla con `pipewire` + `libdecor`. Detección de UI elements con `layer-shell` protocol. Inspirado en GestureOS (Windows) y Gesticulate. 10 tests unitarios | ⏳ pendiente |
| 50 | Tests de instalación + CI con pytest-github (mejora #40) | Infraestructura | baja | `tests/test_install.py`, `pyproject.toml`, `.github/workflows/` | 5 tests de instalación: pip install editable, pip install ., python -m freehands doctor, python -m freehands --help, import freehands. CI workflow con GitHub Actions. Inspirado en GazeControl (pip installable). 5 tests de instalación | ⏳ pendiente |

## Progreso

| **Completadas:** 34 / 50 (68.0%) |
| **Pendientes:** 16 |

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

### Nuevos proyectos investigados (01/06/2026)

- **OCULA** (revolutionarybukhari/ocula) — 1★, HTML — Webcam eye-controlled cursor browser-only. MediaPipe Face Mesh + dwell-to-click + AAC board demo. 6 tiles gaze-clickable. Sin hardware especial, sin instalación. Recalibración sin reload. Face-not-detected warning.
- **GazeAAC** (pheealnluot/GazeAAC) — 0★, JS/Electron — Eye-gaze AAC con LAMP method (motor-plan consistency). Grid 12x7 buttons. Decoupled hit-boxes. Offline-first. Contextual probability highlighting. Roadmap con Tobi Eye Tracker 5 integration.
- **MINDWAVE** (Maharshi-spec/MINDWAVE) — 0★, Python — Real-time biometric engine. MediaPipe Face Mesh + BPM + micro-jitter + blocking + tension. Emotion categories: happiness, sadness, anger, fear, neutral. User auth con facial biometrics. Session management.
- **NeuroScan** (prapti-rathod/NeuroScan-Stress-Detector-System) — 0★, Python — AI stress detection con MediaPipe. Pupil dilation, blink rate, fixation duration, saccade velocity. Random Forest 92% accuracy. 60-second scan con video recording.
- **Vital-Sign** (navisathish07/Vital-Sign-and-Hypothyroidism-Detection) — 8★, Python — rPPG + MediaPipe. Heart rate, breathing rate, blink analysis, eyebrow thinning. 15s analysis con GUI. Telemedicine, driver monitoring, remote health screening.
- **Archead** (prateekvellala/Archead) — 3★, None — Cross-platform head movements + facial expressions control. Click, double click, hold, scroll, speech-to-text.
- **GestureOS** (PooyaNasiri/GestureOS) — 4★, Python — Hand gesture control Windows PC. Mouse control, fist=desktop, palm=media, peace=mute, spiderman=maximize, semi-palm=alt-tab, pinch=click. Region-based cursor (80% central). Background mode.
- **Gesticulate** (CosmoUniverso/Gesticulate) — 2★, Python — Kalman Filter-based predictive engine para hand gesture cursor. Pinch gesture. Elimina jitter.
- **comarquet/eye-tracking** — 0★, TypeScript — Library eye-tracking data analysis. Fixation detection (I-DT, I-VT, HMM), heatmaps, saccade/scanpath metrics, AOI detection via DBSCAN.
- **SquareVoice** (RockChalk01/SquareVoice) — 1★, C# — AAC device software. Grid de palabras, speech synthesis, Tobii eye-x support.
- **VitalSync** (abhi-alone-420) — 0★, None — Contactless heart rate, SpO2, HRV via webcam.
- **Drowsiness Detection** (DanishTalpur) — 2★, Python — EAR + head tilt for drowsiness. Sound alerts.

### Tendencias 2026 investigadas (nuevas)

- **Detección de fatiga visual** — Monitorizar blink rate + micro-jitter facial para alertar pausas (MINDWAVE, Vital-Sign, Drowsiness Detection)
- **Salud mental y bienestar emocional** — Emotion detection en tiempo real como feature de accesibilidad (MINDWAVE, NeuroScan)
- **AAC (Augmentative and Alternative Communication)** — Tableros de comunicación aumentativa con eye-gaze (GazeAAC, OCULA, SquareVoice)
- **Fixation detection I-DT/I-VT/HMM** — Detección profesional de fijaciones oculares (comarquet eye-tracking)
- **Control por expresiones faciales completas** — No solo sonrisas/ceño, sino boca, cejas, cabeza (Archead)
- **Region-based cursor mapping** — Cursor restringido a zona central para mayor precisión (GestureOS)
- **Pupil dilation como métrica** — Dilatación pupilar para carga cognitiva y estrés (NeuroScan)
- **rPPG (remote Photoplethysmography)** — Medición no-contacto de frecuencia cardíaca vía webcam (Vital-Sign, VitalSync)
- **Soporte Wayland nativo** — Escapar de X11-only para compatibilidad con distros modernas
- **IA copilot + control sin manos** — Integrar LLM assistant con contexto de mirada (tendencia 2026)
- **Tests de instalación + CI** — Pip installable + GitHub Actions (GazeControl pattern)
- **Low-latency AAC** — Under 250ms rendering latency con offline-first (GazeAAC)
