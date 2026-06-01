---
name: freehands-multimodal-control
description: FreeHands - Multimodal hands-free PC control using webcam for gaze tracking, gesture recognition, and voice commands. No headset or special hardware needed.
version: 1.0
created: 2026-05-30
updated: 2026-05-30
source: https://github.com/Ntizar/FreeHands
tags: [computer-vision, freehands, gaze, gestures, voice]

---

# FreeHands - Multimodal Hands-Free Control

## Overview

FreeHands is a local pipeline that controls your PC using:
- **Gaze** - moves the Windows cursor
- **Gestures** - clicks (index=index, middle=right, both=double)
- **Voice** - optional commands via faster-whisper

No headset. No special hardware. Just a webcam.

## Architecture

```
Camera frame
  +-- GazeTracker   -> personal GazeRegressor -> screen x, y
  +-- HandTracker   -> GestureStabilizer      -> confirmed gesture
  +-- VoiceListener -> command parser         -> optional action
                       |
                       v
              MultimodalFusion
        IDLE -> ACTIVE -> CONFIRMING -> COOLDOWN
                       |
                       v
        ActionDispatcher (PyAutoGUI)
                       |
                       v
   Real Windows pointer, clicks, zoom, scroll, undo

## Plugin System (mejora #16)

Extensible pipeline para inyectar lógica custom:
```
Camera → [on_frame] → Gaze → [on_gaze] → Filter → [on_filter]
→ Gesture → [on_gesture] → Fusion → [on_fusion] → Action → [on_action]
→ Overlay → [on_overlay]
```
- `FreeHandsPlugin` — base class con 7 hooks (todos opcionales)
- `PluginLoader` — discovery automático, priority ordering, lifecycle
- `PluginContext` — dataclass compartido con metadata dict
- Ver `freehands-architecture` skill para API completa y patrón de creación.
```

## Gesture-Action Mapping

| Gesture | Action |
|---------|--------|
| Index finger up | Left click |
| Middle finger up | Right click |
| Index + Middle up | Double click |
| Both hands together | Zoom in |
| Both hands apart | Zoom out |
| Left open palm | Configurable (default: unassigned) |
| Right open palm held 2s | Toggle ACTIVE/PAUSED (kill switch) |

## Key Components

| Path | Purpose |
|------|---------|
| src/freehands/main.py | Runtime loop, pointer movement, overlay, action dispatch |
| src/freehands/gaze/ | Eye/face features and personal regression model |
| src/freehands/gestures/ | MediaPipe hands, side-aware ids, multi-frame stabilizer |
| src/freehands/fusion/ | State machine, side fallback bindings, safety logic |
| src/freehands/profiles/ | Pydantic profile, dedupe + migration of bindings |
| src/freehands/ui/ | PyQt6 overlay, control panel and calibration |

## Quick Start (Windows)
```bat
git clone https://github.com/Ntizar/FreeHands.git
cd FreeHands
FreeHands.bat
```

### Useful Commands
```bat
FreeHands.bat run           :: run with default profile
FreeHands.bat run Ntizar    :: run specific user
FreeHands.bat calibrate     :: full calibration wizard
FreeHands.bat gaze          :: re-run gaze calibration only
FreeHands.bat gestures      :: re-run gesture calibration only
FreeHands.bat camera        :: pick different webcam
FreeHands.bat doctor        :: environment + dependency check
FreeHands.bat repair        :: rebuild the venv
```

## Duck Test (End-to-End Verification)

A public test page at `ntizar.github.io/FreeHands/` that does NOT use browser camera:
1. Run `FreeHands.bat run Ntizar` locally
2. Activate FreeHands
3. Open the Pages link
4. Look at a duck and raise index finger
5. If you score, the full pipeline works: gaze -> gesture -> click -> OS event

## Voice Commands
```
FreeHands click
Ntizar right click
FreeHands double click
pause / resume
```
Spanish phrases also recognized: `clic`, `clic derecho`, `pausa`, `reanudar`

## Safety Design
- Right open palm held 2s = kill switch (ACTIVE/PAUSED toggle)
- Side jitter from MediaPipe folded back to same click
- Stabilizer rearms in one frame on gesture release
- All processing is local - no cloud

## Calibration Tips
| Symptom | Fix |
|---------|-----|
| Gaze pulls to corners | Re-run gaze calibration |
| Wrong webcam opens | `FreeHands.bat camera` |
| Left/right swapped | Press `Swap L/R` in panel |
| Eyes not detected | Front lighting, no backlight, clean lens |
| Clicks off target | Recalibrate in same lighting you will use |

## Tech Stack
- Python 3.11+
- MediaPipe Tasks Vision (hand/face landmarks)
- faster-whisper (local voice)
- PyAutoGUI (OS control)
- PyQt6 (UI overlay)
- Pydantic (profiles)

## Facial Expression Detection (mejora #18)

FreeHands soporta gestos faciales además de gestos de mano y mirada:
- **Sonrisa** (smile): ratio mouth corner Y < threshold
- **Ceño** (frown): ratio mouth corner Y > threshold  
- **Sorpresa** (surprise): mouth_open_ratio > threshold
- **Cejas arriba** (raised_eyebrows): eyebrow Y < threshold
- **Cejas fruncidas** (furrowed_brows): eyebrow Y > threshold
- **Boca abierta** (mouth_open): mouth_open_ratio > threshold

Implementación en `src/freehands/gestures/face_tracker.py`. Integración en fusion.py como acción instantánea (sin dwell/state machine), igual que palm-scroll y air-scroll.

## Patrones de Audio Feedback

```python
# src/freehands/ui/audio_feedback.py
# winsound.Beep(frecuencia, duracion_ms)
# Debounce: max 1 beep cada 80ms
AudioFeedback:
  play_gesture_confirmation() -> 1200Hz, 40ms  (high beep = gesture)
  play_voice_confirmation()   -> 800Hz, 50ms   (low beep = voice)
  play_error()                -> 400Hz, 60ms x2 (double = error)
```

## Configuracion de Constantes Runtime

```python
# src/freehands/config.py
TARGET_FPS = 30
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
POINTER_MOVE_INTERVAL_MS = 35
POINTER_MOVE_MIN_DELTA_PX = 3
POINTER_FINE_AIM_HOLD_MS = 1000
POINTER_FINE_AIM_RADIUS_PX = 70
POINTER_FINE_AIM_RELEASE_PX = 135
POINTER_FINE_AIM_ALPHA = 0.22
DEFAULT_DWELL_MS = 600
DEFAULT_STABILITY_FRAMES = 8           # ≈ 270 ms @ 30 fps
DEFAULT_GESTURE_CONFIDENCE = 0.85
COOLDOWN_MS_AFTER_ACTION = 500
PAUSE_GESTURE_HOLD_MS = 1000
```

## Patrones de UI

- **Radial menu:** MENU_RADIUS=140px, MENU_ITEM_RADIUS=36px, MENU_DWELL_MS=400, MENU_OPEN_DURATION_MS=1500
- **Virtual keyboard:** KEYBOARD_WIDTH=680, KEYBOARD_HEIGHT=280, KEY_RADIUS=22, KEYBOARD_DWELL_MS=800
- **Overlay:** Gaze cursor + dwell ring + state badge con emojis para cada gesture

## Ntizar Palette (dataclass frozen)

```python
@dataclass(frozen=True)
class NtizarPalette:
    blue: str = "#1E5BFF"
    blue_soft: str = "#5B85FF"
    blue_dark: str = "#0E3FCC"
    orange: str = "#FF7A1A"
    orange_soft: str = "#FFA365"
    orange_dark: str = "#CC5C0E"
    glass_base: str = "rgba(255, 255, 255, 0.55)"
    glass_strong: str = "rgba(255, 255, 255, 0.78)"
    glass_border: str = "rgba(255, 255, 255, 0.85)"
    glass_shadow: str = "rgba(30, 91, 255, 0.18)"
```

## Pitfalls
- **Windows first**: macOS/Linux support is on the roadmap but not yet available
- **Lighting critical**: Front lighting required, no backlight
- **Calibration per-user**: Each user needs their own calibration profile
- **Profile storage**: Lives in `%LOCALAPPDATA%\\Ntizar\\FreeHands\\profiles`
- **Landmark index collisions**: MediaPipe FaceMesh landmarks can share indices. `RIGHT_EYEBROW_CENTER = 291` collides with `MOUTH_OUTER_RIGHT = 291`. Always verify landmark indices against the official MediaPipe FaceMesh documentation.
- **cv2 import conflicts**: The Hermes venv cv2 conflicts with system python3-opencv. For tests that call `detect()`, mock cv2 inside the test using `patch.dict(sys.modules, {"cv2": mock_cv2, "cv2.dnn": MagicMock()})`. Do NOT use `@patch('cv2')` — cv2 is imported inside the method, not at module level.
- **FaceTracker.__new__() bypasses __init__**: When creating test instances with `__new__()`, manually initialize all tracking dicts (`_air_centroid_x = {}`, etc.) and face tracking state.
- **Facial gestures fire instantly**: No dwell state machine. They fire immediately upon detection, integrated into fusion.py after air-scroll handling.
- **cv2 mocking in tests**: See `references/cv2-mocking-tests.md` for the full pattern of mocking cv2 with `patch.dict(sys.modules, ...)` to avoid venv/system conflicts.
- **OCR text region detection**: See `references/ocr-text-region-detection.md` for the OCR-free text region detection pipeline using OpenCV contour analysis (no Tesseract required).
- **Continuous dictation engine**: See `references/continuous-dictation-architecture.md` for the full architecture of the ContinuousDictationEngine, COMMAND_PHRASES collision rules, and main.py integration pattern.
- **Adding a new overlay widget to FreeHands**: When adding a new overlay widget (e.g., virtual keyboard, emoji overlay, gaze text selector, app switcher), follow this pattern:
  1. Create widget class in `src/freehands/ui/{widget_name}.py` — subclass `QtWidgets.QWidget` with `FramelessWindowHint | WindowStaysOnTopHint | Tool`, translucent background, transparent for mouse. Include: state enum (HIDDEN/OPENING/VISIBLE/CLOSING), `_state` dataclass, `open_at(x,y)` to position, `close()`, `visible` property, `update_dwell(cursor_xy)` per frame, `process_blink(blink)` for blink-to-select, `paintEvent()` for glass rendering.
  2. Export in `src/freehands/ui/__init__.py` (import + `__all__`).
  3. In `main.py`: import widget, instantiate before `run_system()`, connect signals (e.g., `widget.action_selected.connect(handler)`), add hold-frame counters to `nonlocal` in `tick()`.
  4. In `tick()` loop: handle voice commands for open/close (check `voice_actions_this_frame`), call `widget.update_dwell(cursor_xy)` when visible, call `widget.process_blink(blink_detected)` for blink-to-select, dismiss on `State.IDLE` or Escape. Also add gesture-based open (e.g., open-palm hold) and gesture-based close (e.g., pinch_close).
  5. Add voice command phrases in `src/freehands/voice/whisper_listener.py` under `COMMAND_PHRASES` — put stop commands BEFORE start commands to avoid collision.
  6. Add actions to `actions/dispatcher.py` ACTIONS set if the widget needs dispatcher actions.
  7. Add unit tests in `tests/test_{module_name}.py`.
  8. Commit with `9009: mejora #N - {nombre}` and push for auto-deploy.
  9. Update plan in `/root/workspace/Koldo/notes/9009-freehands-plan.md`.
  - **No subagents for code changes**: For direct code improvements in FreeHands, use `patch`/`write_file` directly. Subagents fail with timeout on extensive code tasks.
  - **Hold frame counters must be nonlocal**: When adding gesture-based open/close for a new overlay widget, the hold-frame counter variables (e.g., `widget_open_hold_frames`, `widget_open_gesture`) must be declared in the `nonlocal` statement at the top of `tick()`, otherwise the closure won't update them across frames.
  - **App switcher specific pattern**: The app switcher shows a horizontal row of app tiles. It opens via voice ("switcher"/"conmutador"), closes via voice ("cerrar switcher"), Escape, or pinch_close gesture. It uses 3-second open-palm hold for gesture-based open (longer than emoji's 2s). The `on_app_selected` handler uses `pyautogui.hotkey("alt", "tab")` to focus the selected app.

- **Magnifier overlay pattern (cursor-following widget)**: Unlike gesture-open widgets (radial menu, keyboard, emoji), a magnifier follows the gaze cursor continuously. Pattern: create widget with internal refresh timer (~80ms), intercept voice commands like "zoom_in"/"zoom_out" in `handle_voice_action()` BEFORE they reach the dispatcher, toggle a `magnifier_visible` bool declared `nonlocal` in `tick()`, call `magnifier.update_cursor(cursor_xy)` in the tick loop, close on `State.IDLE`. Use `overlay.flash_action()` for feedback, NOT `magnifier.flash_action()`. See `freehands-architecture` skill `references/magnifier-overlay-pattern.md` for full pattern.

- **Continuous dictation engine pattern**: FreeHands soporta dictado libre (no solo comandos discretos) con `ContinuousDictationEngine`. Patrón de implementación:
  1. Crear módulo en `src/freehands/voice/continuous_dictation.py` con: `ContinuousDictationEngine` (motor principal), `DictationConfig` (configuración), `DictationState` (enum: IDLE/ACTIVE/COMMITTING).
  2. El motor usa detección de silencio (RMS < threshold), buffers de texto con auto-commit por timeout/límite, y mapeo de palabras clave a puntuación (coma, punto, nueva linea, etc.).
  3. Soporta ambos backends: faster_whisper y Vosk, reutilizando el stream de audio de sounddevice.
  4. Callback `on_text` para escribir texto transcriton al OS vía `pyautogui.write()`.
  5. Integrar en `main.py`: instanciar antes del loop tick(), detectar comandos start/stop en `voice_actions_this_frame`, llamar `engine.start()`/`engine.stop()`, cerrar en `cleanup()`.
  6. Añadir comandos en `whisper_listener.py` COMMAND_PHRASES con frases en ES/EN.
  7. Añadir campo de config al Profile en `profiles/store.py` (ej: `voice_model_size`).
  8. Añadir acciones al dispatcher en `actions/dispatcher.py` ACTIONS set.
  9. Exportar en `voice/__init__.py` + tests unitarios.
  - **Dictation commands require wake word**: Dictation start/stop are NOT safety commands, so they require a wake word. Use Spanish phrases that don't collide with existing commands.

- **Voice command collision avoidance**: When adding new voice command phrases to COMMAND_PHRASES, ALWAYS check for collisions with existing commands. The dict is iterated in definition order, first match wins. Critical collision points:
  - "stop" matches toggle_pause (pause/stop/continue/start)
  - "escape"/"cancelar"/"cancel" match escape command
  - "escribir texto" matches gaze_typing
  - "dictado" matches start_dictation before stop_dictation if order is wrong
  - **Rule**: put stop commands BEFORE start commands in COMMAND_PHRASES dict. Avoid generic English words (stop, start, cancel, escape) — use Spanish equivalents (parar, empezar, cancelar, escapar).
  - **Rule**: test with `parse_voice_command("FreeHands <phrase>")` to verify the correct action is returned.
  - **Rule: remove ambiguous substrings from generic commands**: When a new command phrase contains a substring that matches an existing generic command (e.g., "start writing" contains "start" which matched `resume`, "empezar a escribir" contains "esc" which matched `escape`), you MUST remove that ambiguous substring from the generic command's phrase list. Example: change `resume` from `["start", ...]` to `["empezar", ...]`, change `escape` from `["esc", ...]` to `["escapar", ...]`. This prevents the new command from being shadowed by the old generic match.

- **Adding fields to Pydantic Profile**: When adding new configuration fields to the Profile model in `profiles/store.py`:
  1. Add field with default value in the Profile class body (between existing fields).
  2. The default value must be a simple literal (str, int, float, bool) — not a callable or complex default.
  3. No migration code needed: Profile uses `model_validate()` which will use the default for missing keys in existing profiles.
  4. Update any code that reads the new field to use `profile.new_field` directly (no hasattr checks needed since the field has a default).

- **Fusión multimodal OR + intención prioritaria**: FreeHands soporta dos modos de fusión: AND (por defecto, voz necesita gaze estable) y OR (cualquier canal activa, confianza rompe empates). Ver `references/or-fusion-pattern.md` para arquitectura completa, FusionMode enum, decide_channel_priority() con parámetro mode, decide_or_fusion(), y configuración de confianza en MultimodalFusion.

- **Circular import fusion.py ↔ channel_priority.py**: Cuando dos módulos del mismo paquete se referencian mutuamente, usar strings en lugar de enums para configuración cruzada y evitar imports directos entre ellos. Ver `references/circular-import-pitfall.md`.
- **Calibración EAR adaptativa por usuario (Eye2cursor)**: El `BlinkDetector` soporta calibración automática del umbral de parpadeo. Ver `references/adaptive-ear-calibration.md` para el patrón completo: `EARCalibration` con EMA, umbral dinámico, clamping, y `force_calibration_complete()` para tests.
