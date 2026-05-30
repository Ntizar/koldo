# Plan 9009 — FreeHands

Pipeline de mejora continua para el proyecto [FreeHands](https://github.com/Ntizar/FreeHands).
Control del PC sin manos: mirada + gestos + voz.

| **Inicio:** 29/05/2026 |
| **Última actualización:** 30/05/2026 — #17 Head pose 6DoF para desplazamiento grueso |

## Mejoras

| # | Mejora | Área | Dificultad | Archivos | Verificación | Estado |
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
| 18 | Unidades de acción facial (sonrisa, ceño, sorpresa) | Gestos | alta | `gestures/face_tracker.py`, `fusion/` | AUs faciales como gestos adicionales | ⏳ pendiente |
| 19 | Teclado virtual con selección por mirada | UX | alta | `ui/`, nuevo módulo `ui/virtual_keyboard.py` | Escribir sin manos | ⏳ pendiente |
| 20 | Modo dictado (mirar campo + decir "escribe" + dictar) | Voz | alta | `voice/`, `ui/`, `main.py` | Dictado multimodal | ⏳ pendiente |
| 21 | OCR integrado + gaze typing (talon-gaze-ocr) | Nuevos | media | `ocr/`, `gaze/`, `ui/virtual_keyboard.py` | Detectar texto en pantalla, seleccionar palabras con mirada | ⏳ pendiente |
| 22 | Teclado virtual dual layout por ojos (Keyboard-Typing-with-Eyes) | UX | baja | `ui/virtual_keyboard.py` | Layout izq/der dinámico, audio feedback, blink para seleccionar | ⏳ pendiente |
| 23 | Calibración con Gaussian Process (auto-calibración continua) | Gaze | alta | `gaze/calibration.py`, `gaze/tracker.py` | Reemplazar regresión polinomial por GP, auto-ajuste durante uso | ⏳ pendiente |
| 24 | Control bimanual (mano derecha cursor, izquierda scroll/zoom) | Gestos | media | `gestures/hand_fusion.py`, `main.py` | Dos manos independientes: cursor+clic + scroll+zoom | ⏳ pendiente |
| 25 | Air scroll vertical con mano (gesto de barrido) | Gestos | baja | `gestures/hand_tracker.py`, `fusion/fusion.py`, `profiles/store.py`, `tests/` | 11 tests unitarios pasando, scroll con cualquier pose de mano | ✅ hecha 30/05/2026 |
| 26 | Control de volumen con posición Y de mano | Gestos | baja | `gestures/volume_control.py`, `actions/dispatcher.py` | Mano arriba → volumen sube, abajo → baja | ⏳ pendiente |
| 27 | Dictado continuo con Whisper/Vosk (no solo comandos discretos) | Voz | media | `voice/continuous_dictation.py`, `main.py` | Dictado libre que escribe en campo de texto enfocado | ⏳ pendiente |
| 28 | Overlay de emojis navegables con gaze + voz | UX | baja | `ui/emoji_overlay.py`, `voice/` | Navegar emojis con mirada, confirmar con voz o blink | ⏳ pendiente |
| 29 | App switcher con gaze dwell + pinch para cerrar | UX | alta | `ui/app_switcher.py`, `actions/dispatcher.py` | Dwell en iconos taskbar, pinch para cerrar, swipe para cambiar | ⏳ pendiente |
| 30 | Fusión multimodal con modo OR + intención prioritaria | Fusión | media | `fusion/fusion.py`, `fusion/channel_priority.py` | Añadir modo OR (cualquier canal activa) + priorización por confianza | ⏳ pendiente |

## Progreso

| **Completadas:** 18 / 30 (60%) |
| **Pendientes:** 12 |

## Orden de implementación

Se priorizan las de dificultad **baja** primero (victorias rápidas que dan valor inmediato).
Luego **media**, y finalmente **alta** (requieren cambios arquitectónicos).

Cada ejecución del cron 9009-FreeHands coge la siguiente mejora ⏳ con menor nº.

## Fuentes de investigación FASE 4 (30/05/2026)

Proyectos investigados en reaprendizaje semanal:
- talon-gaze-ocr (wolfmanstout) — OCR + eye tracking
- Keyboard-Typing-with-Eyes (kbhujbal) — teclado virtual por ojos
- Real-time-GesRec (ahmetgunduz) — 3D CNN gesture recognition
- OptiKey — teclado virtual accesibilidad
- Pupil Labs — plugin system eye tracking
- Gesture-pdf (Abhirajbhat) — air scroll + pinch
- AirMouse bimanual (Rcidshacker) — dos manos independientes
- Virtual Hand Keyboard (MohamedAlaouiMhamdi) — typing con dedo
- Multimodal Fusion (Manav57) — fusión intención prioritaria
- Spotify Controller YOLO — control apps con gestos
- HandMouse dictado continuo (KBatuhanB) — dictado libre
- Gaussian Process Calibration — calibración adaptativa

Tendencias 2025-2026 investigadas:
- Predictive cursor con ML
- Adaptive dwell time
- Auto-calibración continua
- Overlay UI minimalista (visionOS)
- Context-aware gestures
- Micro-gestures (cabeza)
