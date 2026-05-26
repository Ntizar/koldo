# Patrón de uso: VibeVoice-TTS

## Resumen

VibeVoice-TTS es un modelo **Text-to-Speech** de largo formato que genera **speech conversacional expresivo** (podcasts, diálogos multi-speaker) a partir de texto. Puede sintetizar hasta **90 minutos de speech** en un solo paso con hasta **4 hablantes distintos**.

> **⚠️ Nota importante:** El código de generación TTS fue **deshabilitado** por Microsoft debido a uso indebido. Los weights están disponibles en Hugging Face pero el código de inferencia no se distribuye públicamente. Este patrón documenta el diseño y capacidades del modelo para referencia.

## Características clave

| Característica | Detalle |
|---|---|
| Modelo | VibeVoice-1.5B (base Qwen2.5) |
| Longitud máxima | 90 min de audio |
| Contexto | 64K tokens |
| Speakers | Hasta 4 distintos en conversación |
| Idiomas | Inglés, Chino, cross-lingual |
| Arquitectura | LLM + tokenizadores continuos 7.5 Hz + diffusion head |
| Framework | Next-token diffusion |

## Arquitectura

```
VibeVoice-TTS = LLM (Qwen2.5) + Continuous Speech Tokenizers + Diffusion Head

1. LLM entiende contexto textual y flujo de diálogo
2. Tokenizadores continuos (Acoustic + Semantic) a 7.5 Hz
3. Diffusion head genera detalles acústicos de alta fidelidad
```

## Uso (cuando el código esté disponible)

### Configuración de speakers

```python
# Patrón de uso con múltiples hablantes
# Cada speaker tiene un label único y se mantiene consistente
# durante toda la generación

speakers = ["Alice", "Bob", "Charlie", "Diana"]

# Input: texto con etiquetas de speaker
script = """
[Alice] Welcome to our podcast today we're discussing AI.
[Bob] Great topic! I think the most exciting part is the speed improvements.
[Charlie] And the quality has really improved too.
[Alice] Let's dive in then.
"""

# Output: audio conversacional de hasta 90 minutos
# con transiciones naturales entre speakers
```

### Patrón: Generación de speech largo

```python
# El modelo mantiene consistencia del speaker
# y coherencia semántica durante todo el audio
# de hasta 90 minutos en un solo paso

# A diferencia de modelos que se limitan a 1-2 speakers,
# VibeVoice-TTS soporta 4 hablantes con turn-taking natural
```

### Patrón: Voice cloning / prompts de voz

```python
# Se usan voice prompts para definir el timbre del hablante
# El prompt de voz determina características acústicas
# del speech generado

# Cada speaker se asocia con un voice prompt único
# que define su timbre, tono y estilo
```

## Capacidades especiales

### Speech expresivo
- Captura dinámicas conversacionales y matices emocionales
- Genera speech natural con entonación realista

### Cross-lingual transfer
- Preserva acentos al transferir entre idiomas
- Soporta transfer cross-lingual con mantenimiento de identidad del speaker

### Singing emergente
- Capacidad de cantar no entrenada explícitamente (emergent)
- Puede generar música de fondo espontánea (easter egg del modelo)

### Multi-speaker conversation
- Soporta hasta 4 hablantes con turn-taking natural
- Consistencia del speaker a través de diálogos largos

## Tips y mejores prácticas

### Para speech en chino:
- Usar puntuación en inglés incluso para texto chino (solo comas y puntos)
- Usar el modelo Large (más estable)
- Si el speech va muy rápido, dividir el texto en múltiples turns con el mismo speaker label

### Para control de emociones:
- Ver [discussion12](https://huggingface.co/microsoft/VibeVoice-1.5B/discussions/12) para técnicas de PsiPi

### Limitaciones conocidas:
- **No modela speech superpuesto** — los hablantes no se solapan
- **Text normalization no se aplica** — el LLM maneja inputs complejos por sí solo
- **Chinese pronunciation** — menos datos de entrenamiento en chino puede causar errores
- **Cross-lingual inestable** — puede requerir múltiples muestreos para resultados satisfactorios

## Evaluación

El modelo alcanza rendimiento state-of-the-art en tareas de speech generation de largo formato multi-speaker. Ver [paper](https://arxiv.org/pdf/2508.19205) para resultados detallados.

## Links

- **Modelo:** [HF VibeVoice-1.5B](https://huggingface.co/microsoft/VibeVoice-1.5B)
- **Paper:** [arXiv 2508.19205](https://arxiv.org/pdf/2508.19205) (ICLR 2026 Oral)
- **Project Page:** [microsoft.github.io/VibeVoice](https://microsoft.github.io/VibeVoice)
