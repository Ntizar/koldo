# Fusion Multimodal — Modos AND, OR y Priorización por Confianza

## Resumen

FreeHands soporta dos modos de fusión multimodal que controlan cómo interactúan los canales (gaze, gesture, voice):

- **AND** (por defecto): las acciones de voz para operaciones de puntero (click, zoom, scroll) solo se disparan cuando el gaze también está presente Y estable. Requiere que el usuario mire al objetivo.
- **OR**: cualquier canal puede activar una acción. Si la voz propone una acción de puntero y el gaze está presente (incluso inestable), la acción se dispara. Cuando ambos canales proponen acciones diferentes, la de mayor confianza gana (priorización por intención).

## Implementación

### FusionMode enum

```python
class FusionMode(Enum):
    AND = auto()   # voz necesita gaze estable para disparar
    OR = auto()    # cualquier canal activa; confianza rompe empates
```

### decide_channel_priority()

```python
def decide_channel_priority(
    gesture_action: str | None,
    voice_action: str | None,
    *,
    gesture_confidence: float = 1.0,
    voice_confidence: float = 1.0,
    mode: FusionMode = FusionMode.AND,
) -> ChannelDecision:
```

Reglas aplicadas en orden:
1. Si solo un canal propone acción → ese gana
2. Si ambos proponen la misma acción → gesture gana (modality primaria)
3. Si voice propone un sistema (volume, screenshot) → voice gana siempre
4. Si ambos proponen acciones diferentes:
   - **AND**: gesture gana (tiene contexto espacial)
   - **OR**: la de mayor confianza gana (priorización por intención)

### decide_or_fusion()

Función convenience que invoca `decide_channel_priority(mode=FusionMode.OR)`:

```python
def decide_or_fusion(
    gesture_action: str | None,
    voice_action: str | None,
    *,
    gesture_confidence: float = 1.0,
    voice_confidence: float = 1.0,
) -> ChannelDecision:
```

### MultimodalFusion

```python
class MultimodalFusion:
    def __init__(
        self,
        profile: Profile,
        *,
        fusion_mode: str = "AND",  # "AND" o "OR"
        gesture_confidence: float = 1.0,
        voice_confidence: float = 1.0,
    ) -> None:
```

En modo OR (`step_and_voice`):
- Si `voice_action in AND_FUSION_ACTIONS` y `cursor_xy is not None` y `state != IDLE` → se dispara sin requerir estabilidad de gaze
- En modo AND → se requiere `gaze_stable.peek() == True`

### Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/freehands/fusion/channel_priority.py` | FusionMode enum, parámetro mode, decide_or_fusion() |
| `src/freehands/fusion/fusion.py` | fusion_mode en constructor, lógica OR en step_and_voice |
| `src/freehands/fusion/__init__.py` | Exporta FusionMode y decide_or_fusion |
| `tests/test_or_fusion.py` | 26 tests unitarios |

## Usos típicos

### AND (modo estricto, por defecto)
Ideal para entornos donde se quiere evitar activación accidental. El usuario debe mirar ESTABLE al objetivo Y decir el comando.

### OR (modo flexible)
Ideal para entornos donde la velocidad importa más que la precisión. El usuario mira al objetivo (aunque el gaze sea inestable) y dice el comando → se dispara.

### Priorización por confianza
Cuando ambos canales proponen acciones diferentes en modo OR:
- `voice_confidence > gesture_confidence` → voice gana
- `gesture_confidence >= voice_confidence` → gesture gana

Esto permite al usuario expresar intención: un comando de voz con alta confianza (ej: "haz screenshot") puede prevalecer sobre un gesto accidental.

## Tests

26 tests unitarios en `tests/test_or_fusion.py`:
- FusionMode enum (3 tests)
- decide_channel_priority con modo (6 tests)
- decide_or_fusion convenience (3 tests)
- MultimodalFusion con OR (8 tests)
- Intention prioritisation (3 tests)
- Backward compatibility (1 test)

## Referencias

- Mejora #30 del pipeline 9009
- Plan maestro: `/root/workspace/Koldo/notes/9009-freehands-plan.md`
- Commit: `c40975d` en Ntizar/FreeHands
