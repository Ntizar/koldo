# 9009 — Análisis FreeHands

**Fecha:** 29/05/2026
**Repo:** github.com/Ntizar/FreeHands

## Estructura

```
FreeHands/
├── src/freehands/
│   ├── main.py              ← Orquestador runtime (430 lines)
│   ├── config.py            ← Constantes (TARGET_FPS, thresholds...)
│   ├── doctor.py            ← Diagnóstico
│   ├── __main__.py          ← Entry point CLI
│   ├── capture/
│   │   └── camera.py        ← Webcam wrapper
│   ├── gaze/
│   │   ├── tracker.py       ← GazeTracker (MediaPipe face mesh)
│   │   └── calibration.py   ← GazeRegressor + calibración
│   ├── gestures/
│   │   ├── hand_tracker.py  ← HandTracker (MediaPipe hands)
│   │   ├── stabilizer.py    ← GestureStabilizer (multiframe)
│   │   └── face_tracker.py  ← FaceTracker (no se usa en main?)
│   ├── fusion/
│   │   ├── fusion.py        ← MultimodalFusion (gaze+gesture)
│   │   └── state_machine.py ← StateMachine (IDLE/ACTIVE/CONFIRMING/COOLDOWN)
│   ├── voice/
│   │   └── whisper_listener.py ← faster-whisper listener
│   ├── actions/
│   │   └── dispatcher.py    ← PyAutoGUI actions
│   ├── profiles/
│   │   ├── __init__.py      ← Profile Pydantic model
│   │   └── store.py         ← Carga/guarda perfiles
│   └── ui/
│       ├── overlay.py       ← FreeHandsControlPanel + GazeOverlay (PyQt6)
│       ├── calibration_game.py ← Calibración visual
│       ├── camera_selector.py  ← Selección de cámara
│       └── theme.py         ← Colores Ntizar (azul #1E5BFF + naranja #FF7A1A)
├── tests/                   ← Tests pytest (10 archivos)
│   ├── test_stabilizer.py
│   ├── test_fusion.py
│   ├── test_profiles.py
│   ├── test_hand_tracker.py
│   ├── test_state_machine.py
│   ├── test_pause_hold.py
│   ├── test_voice_commands.py
│   ├── test_gesture_calibration_contract.py
│   ├── test_gaze_tracker.py
│   └── test_gaze_calibration.py
├── docs/                    ← GitHub Pages
│   ├── index.html
│   ├── duck-hunt.html
│   └── assets/              ← JS, CSS, WebGazer
├── pyproject.toml           ← Setuptools + ruff config
├── requirements.txt         ← 10 dependencias
├── FreeHands.bat            ← Windows launcher
└── schema/
    └── profile.schema.json
```

## Stack técnico

| Capa | Tecnología |
|---|---|
| Lenguaje | Python 3.11+ |
| UI Desktop | PyQt6 |
| Visión | MediaPipe Tasks Vision (hands + face mesh) |
| Gaze | Regresión Ridge propia (scikit-learn) |
| Voz | faster-whisper (local, GPU opcional) |
| Acciones SO | PyAutoGUI + pynput |
| Tests | pytest |
| Lint | ruff (line-length=100) |
| Perfiles | Pydantic v2 |
| Web | GitHub Pages (vanilla JS) |

## Dependencias clave (requirements.txt)

- opencv-python>=4.9.0
- mediapipe>=0.10.9
- numpy>=1.26.0
- scikit-learn>=1.4.0
- PyQt6>=6.6.0
- pyautogui>=0.9.54
- pynput>=1.7.6
- faster-whisper>=1.0.0
- sounddevice>=0.4.6
- pydantic>=2.6.0
- platformdirs>=4.2.0

## Arquitectura (pipeline)

```
Camera Frame
  ├─ GazeTracker → GazeRegressor → screen x,y → FineAimPointer
  ├─ HandTracker → GestureStabilizer → gesto confirmado
  └─ VoiceListener → parser → comando
       │
       ▼
  MultimodalFusion (StateMachine)
  IDLE → ACTIVE → CONFIRMING → COOLDOWN
       │
       ▼
  ActionDispatcher (PyAutoGUI)
  → click, right_click, double_click, zoom_in, zoom_out,
    scroll_up, scroll_down, toggle_pause, undo
```

## Tests

- 10 archivos de test
- Cubren: stabilizer, fusion, profiles, hand_tracker, state_machine,
  pause_hold, voice_commands, gesture_calibration, gaze_tracker, gaze_calibration

## Deuda técnica observada

- `face_tracker.py` existe pero no se usa en `main.py` (código huérfano)
- Scroll por gesto de mano no implementado (solo por mouse)
- Sin dead zones en bordes de pantalla
- Sin feedback auditivo
- Sin overlay transparente full-screen
- Sin configuración JSON externa de gestos
- Voz solo con faster-whisper (podría tener Vosk como alternativa)