# Circular Import Pitfall — fusion.py ↔ channel_priority.py

## Problema

`fusion.py` importa de `channel_priority.py` y `channel_priority.py` es importado por `__init__.py` que también importa de `fusion.py`. Esto crea un ciclo de importación:

```
fusion.py → channel_priority.py → __init__.py → fusion.py → ...
```

Resultado: `ImportError: cannot import name 'AIR_SCROLL_ACTIONS' from 'freehands.fusion.fusion'`

## Solución

**No importar `channel_priority` en `fusion.py`.** En su lugar:

1. Usar strings en lugar de enums en las firmas públicas:
   ```python
   def __init__(self, profile, *, fusion_mode: str = "AND", ...):
   ```
2. Comparar con strings en runtime:
   ```python
   if self.fusion_mode == "OR":
   ```
3. El enum `FusionMode` vive solo en `channel_priority.py` y se exporta vía `__init__.py`
4. Los tests cargan los módulos manualmente con `importlib.util.spec_from_file_location` para evitar el ciclo

## Patrón general

Cuando dos módulos del mismo paquete se referencian mutuamente:
- Mantener las importaciones cruzadas al mínimo
- Usar type hints como strings (`"HeadPose | None"`) para evitar import en runtime
- Usar strings en lugar de enums para configuración que cruza módulos
- El `__init__.py` es el punto de exportación, no de importación cruzada
