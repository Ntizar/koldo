# Plan 9009 — FreeHands

Pipeline de mejora continua para el proyecto [FreeHands](https://github.com/Ntizar/FreeHands).
Control del PC sin manos: mirada + gestos + voz.

| **Inicio:** 29/05/2026 |
| **Última actualización:** 30/05/2026 — ✅ #12 Overlay transparente PyQt6 sobre escritorio |

## Mejoras

| # | Mejora | Área | Dificultad | Archivos | Verificación | Estado |
|---|---|---|---|---|---|---|
| 1 | Scroll por gesto con palma abierta | Gestos | baja | `fusion/fusion.py`, `state_machine.py`, `profiles/` | Probar scroll vertical al subir/bajar palma | ✅ hecha 29/05/2026 |
|| 2 | Dead zones en bordes de pantalla | Gaze | baja | `gaze/dead_zones.py`, `main.py` | El cursor no debe ir a coordenadas extremas | ✅ hecha 29/05/2026 |
|| 3 | Feedback auditivo de confirmación | UX | baja | `ui/audio_feedback.py`, `main.py`, `profiles/store.py` | Beep alto en gesto, beep bajo en voz | ✅ hecha 29/05/2026 |
|| 4 | Comandos de sistema por voz (show desktop, screenshot, volume) | Voz | baja | `voice/whisper_listener.py`, `actions/dispatcher.py`, `main.py` | Probar "show desktop", "screenshot", "volume up" | ✅ hecha 29/05/2026 |
| 5 | Clic por guiño (guiño derecho = clic izq, guiño izq = clic der) | Gaze | baja | `gaze/blink_detector.py`, `gaze/tracker.py`, `fusion/fusion.py`, `main.py` | Probar parpadeo intencional como click | ✅ hecha 29/05/2026 |
| 6 | Configuración de gestos vía JSON externo | Perfiles | baja | `profiles/store.py`, `profiles/__init__.py`, `gesture_profiles/`, `tests/test_gesture_profiles.py` | 12 tests unitarios pasando, ejemplos gaming.json y accessibility.json | ✅ hecha 29/05/2026 |
|| 7 | Vosk offline como backend de voz alternativo | Voz | baja | `voice/whisper_listener.py`, `config.py`, `profiles/store.py` | Instalar Vosk, probar comando offline | ✅ hecha 30/05/2026 |
|| 8 | Priorización dinámica de canales (gesto vs voz) | Fusión | media | `fusion/channel_priority.py`, `fusion/__init__.py`, `main.py` | 20 tests unitarios pasando | ✅ hecha 30/05/2026 |
|| 9 | Snap-to-grid UI (pegar cursor a centro de elemento tras 300ms) | Gaze | media | `main.py`, `fusion/fusion.py` | Estabilizar cursor en elementos UI | ✅ hecha 30/05/2026 |
| 10 | Menú OSD radial con acciones (mano abierta → menú circular) | UX | media | `ui/radial_menu.py`, `ui/__init__.py`, `main.py` | Menú circular con acciones frecuentes | ✅ hecha 30/05/2026 |
| 11 | Calibración 9 puntos con regresión polinomial | Gaze | media | `gaze/calibration.py`, `gaze/tracker.py`, `config.py` | 15 tests unitarios pasando, modelo polinomial v5 con 27 features | ✅ hecha 30/05/2026 |
|| 12 | Overlay transparente PyQt6 sobre escritorio | UI | media | `ui/overlay.py`, `ui/__init__.py` | Widget transparente full-screen con halo radial, anillo de posición y soporte multi-monitor | ✅ hecha 30/05/2026 |
|| 13 | Doble parpadeo rápido = clic, prolongado = drag | Gaze | media | `gaze/tracker.py`, `main.py` | Detectar patrones de parpadeo | ⏳ pendiente |
| 14 | Fusión multimodal con operador AND (voz + mirada) | Fusión | media | `fusion/fusion.py`, `main.py` | Acción solo si voz y mirada coinciden | ⏳ pendiente |
| 15 | Filtro Kalman predictivo para suavizado de cursor | Gaze | alta | `gaze/tracker.py`, `main.py` | Reemplazar filtro exponencial por Kalman | ⏳ pendiente |
| 16 | Sistema de plugins Python (pipeline extensible) | Arquitectura | alta | `fusion/`, `main.py`, nueva carpeta `plugins/` | Pipeline Camera→Detector→Filter→Plugin→Executor | ⏳ pendiente |
| 17 | 6DoF head pose para desplazamiento grueso | Gaze | alta | `gaze/tracker.py`, `gaze/__init__.py` | Cabeza para scroll/movimiento amplio | ⏳ pendiente |
| 18 | Unidades de acción facial (sonrisa, ceño, sorpresa) | Gestos | alta | `gestures/face_tracker.py`, `fusion/` | AUs faciales como gestos adicionales | ⏳ pendiente |
| 19 | Teclado virtual con selección por mirada | UX | alta | `ui/`, nuevo módulo `ui/virtual_keyboard.py` | Escribir sin manos | ⏳ pendiente |
| 20 | Modo dictado (mirar campo + decir "escribe" + dictar) | Voz | alta | `voice/`, `ui/`, `main.py` | Dictado multimodal | ⏳ pendiente |

## Progreso

||||||||| **Completadas:** 12 / 20 (60%)
**Pendientes:** 8

## Orden de implementación

Se priorizan las de dificultad **baja** primero (victorias rápidas que dan valor inmediato).
Luego **media**, y finalmente **alta** (requieren cambios arquitectónicos).

Cada ejecución del cron 9009-FreeHands coge la siguiente mejora ⏳ con menor nº.