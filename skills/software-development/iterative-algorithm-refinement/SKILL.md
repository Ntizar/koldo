---
name: iterative-algorithm-refinement
description: "Patrón iterativo para refinar algoritmos de estimación geométrica/sensorial: prototipar → testear con datos realista → diagnosticar fallos → corregir geometría → retestear. Captura el ciclo de debugging de algoritmos de visión por computadora donde los datos de entrada son simulados pero deben reproducir comportamientos reales."
version: 1.0.0
author: Ntizar
tags: [software-development, algorithm, refinement, iterative]

---

# Patrón: Refinamiento Iterativo de Algoritmos de Estimación

Ciclo de desarrollo para algoritmos de estimación geométrica, sensorial o de visión por computadora donde los datos de entrada son simulados pero deben reproducir comportamientos del mundo real.

## Cuándo aplicar

- Estimación de pose (cabeza, cuerpo, manos) desde landmarks
- Cálculo de ángulos/rotaciones desde coordenadas 3D
- Estimación de distancia/profundidad
- Cualquier algoritmo que transforme coordenadas de landmarks a métricas físicas

## Ciclo iterativo (4 pasos)

### Paso 1: Prototipar versión inicial

Crear la implementación más simple que "suene" correcta:
- Identificar vectores/geométrica relevante
- Implementar fórmula directa (cross-product, atan2, etc.)
- No preocuparse por edge cases inicialmente

### Paso 2: Testear con datos realista

Crear tests con datos simulados que reproduzcan comportamientos reales:
- **Rostro neutral** (el caso más importante — suele fallar)
- Rotaciones extremas (máximo yaw, pitch, roll)
- Posiciones intermedias

```python
# Ejemplo: crear landmarks simulados para yaw = 30°
def test_yaw_30_degrees():
    landmarks = build_simulated_landmarks(yaw=30)
    result = estimate_head_pose(landmarks)
    assert abs(result.yaw - 30) < tolerance
```

### Paso 3: Diagnosticar fallos

Cuando un test falla, analizar **por qué** la geometría falla:
- ¿El denominador se acerca a cero? → usar `arctan2` en lugar de división directa
- ¿El vector usado tiene offset anatómico? → cambiar referencia (ej: nariz-mentón → frente-mentón)
- ¿Hay ambigüedad de cuadrante? → `arctan2` en lugar de `arccos`

**Pitfall común**: Los datos "neutrales" o "de reposo" son los que más fallan porque las suposiciones geométricas simplificadas se rompen en configuraciones simétricas.

### Paso 4: Corregir y retestear

Aplicar corrección específica al fallo diagnosticado:
- Cambiar vectores de referencia
- Añadir dead zones para rangos donde el algoritmo es inestable
- Añadir clamping para prevenir valores extremos
- Re-ejecutar TODOS los tests (no solo el que falló)

## Reglas de oro

1. **Neutral primero**: El caso neutral (rostro recto, sin rotación) debe pasar SIEMPRE. Si falla, el algoritmo tiene un bug fundamental.
2. **Testear simetrías**: Si yaw +30° funciona, yaw -30° también debería. Si no, hay un problema de signo.
3. **No optimizar prematuramente**: Si la versión simple funciona para todos los casos, no añadir complejidad.
4. **Los tests son la verdad**: Si un test falla, el algoritmo es incorrecto — no ajustar el test.
5. **Documentar por qué se eligió cada fórmula**: En comentarios del código, explicar por qué `arctan2` sobre `arccos`, por qué frente-mentón sobre nariz-mentón, etc.

## Ejemplo real: Head Pose de FreeHands

1. **V1**: Cross-product nariz-ojo → pitch. **Falló**: neutral face daba pitch = 20° (falso positivo).
2. **Diagnóstico**: La nariz está anatómicamente por debajo de los ojos → el vector nariz-mentón no pasa por el centro de rotación.
3. **V2**: Eje frente-mentón relativo a línea horizontal ojo. **Pasó**: neutral face → pitch ≈ 0°.
4. **V1 yaw**: División directa dx/dz. **Falló**: denominador cerca de cero en neutral.
5. **Diagnóstico**: Pérdida de información de cuadrante + singularidad.
6. **V2 yaw**: `arctan2(dx, dz)`. **Pasó**: estable en todos los cuadrantes.

## Verificación post-refinamiento

```bash
# Ejecutar TODOS los tests del módulo
python -m pytest tests/test_{modulo}.py -v

# Verificar que el caso neutral pasa
# Verificar que rotaciones extremas no crash

# Si el módulo se integra en un pipeline más grande:
python -m pytest tests/ -v  # todos los tests
```
