# Patrón de uso: VibeVoice-Realtime

## Resumen

VibeVoice-Realtime es un modelo **Text-to-Speech en tiempo real** liviano (0.5B params) que soporta **streaming de texto de entrada** y generación robusta de speech de largo formato. Produce el **primer chunk audible en ~200-300ms** (depende del hardware), lo que lo hace ideal para integrar con LLMs en tiempo real.

## Características clave

| Característica | Detalle |
|---|---|
| Modelo | VibeVoice-Realtime-0.5B |
| Params | 500M (deployment-friendly) |
| Latencia primera audio | ~200-300 ms |
| Contexto | 8K tokens (~10 min de audio) |
| Speakers | Single speaker |
| Idiomas | Inglés (principal) + 9 experimentales |
| Estilos EN | 11 estilos experimentales |
| Input | Streaming text input (tokens en flujo) |

## Arquitectura

```
VibeVoice-Realtime = LLM (Qwen2.5 0.5B) + Acoustic Tokenizer (7.5 Hz) + Diffusion Head

Diseño interleaved y windowed:
1. Codifica incrementalmente chunks de texto entrantes
2. En paralelo, continúa generación de latentes acústicos por difusión
3. Sin semantic tokenizer (solo acoustic tokenizer a 7.5 Hz)
```

## Instalación

```bash
git clone https://github.com/microsoft/VibeVoice.git
cd VibeVoice
pip install -e .[streamingtts]

# Opcional: flash attention
pip install flash-attn --no-build-isolation
```

## Uso básico

### 1. Demo websocket en tiempo real

```bash
python demo/vibevoice_realtime_demo.py \
  --model_path microsoft/VibeVoice-Realtime-0.5B
```

NVIDIA T4 / Mac M4 Pro logran rendimiento en tiempo real en las pruebas.

### 2. Inferencia directa desde archivos

```bash
python demo/realtime_model_inference_from_file.py \
  --model_path microsoft/VibeVoice-Realtime-0.5B \
  --txt_path demo/text_examples/1p_vibevoice.txt \
  --speaker_name Carter
```

### 3. Colab

[![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/microsoft/VibeVoice/blob/main/demo/vibevoice_realtime_colab.ipynb)

## Patrón: Streaming TTS con LLMs

```python
# Patrón principal: alimentar texto mientras se genera audio
# El LLM puede empezar a hablar desde sus primeros tokens,
# mucho antes de generar la respuesta completa

# Ejemplo conceptual:
llm_stream = generate_llm_response("Tell me about AI...")
for text_chunk in llm_stream:
    realtime_tts.speak(text_chunk)  # Audio audible en ~200ms
```

**Ventaja clave:** El modelo permite que diferentes LLMs empiecen a hablar desde sus primeros tokens, sin esperar a que se genere la respuesta completa. Ideal para asistentes de voz y servicios TTS en tiempo real.

## Patrón: Multi-speaker experimental

```bash
# Descargar voces experimentales multilingües
bash demo/download_experimental_voices.sh
```

### Voces experimentales disponibles

| Idioma | Estilos |
|---|---|
| Alemán (DE) | Voces multilingües |
| Francés (FR) | Voces multilingües |
| Italiano (IT) | Voces multilingües |
| Japonés (JP) | Voces multilingües |
| Coreano (KR) | Voces multilingües |
| Neerlandés (NL) | Voces multilingües |
| Polaco (PL) | Voces multilingües |
| Portugués (PT) | Voces multilingües |
| Español (ES) | Voces multilingües |
| Inglés (EN) | 11 estilos distintos |

## Evaluación

### LibriSpeech test-clean

| Modelo | WER (%) ↓ | Speaker Similarity ↑ |
|---|---|---|
| VALL-E 2 | 2.40 | 0.643 |
| Voicebox | 1.90 | 0.662 |
| MELLE | 2.10 | 0.625 |
| **VibeVoice-Realtime-0.5B** | **2.00** | **0.695** |

### SEED test-en

| Modelo | WER (%) ↓ | Speaker Similarity ↑ |
|---|---|---|
| MaskGCT | 2.62 | 0.714 |
| Seed-TTS | 2.25 | 0.762 |
| FireRedTTS | 3.82 | 0.460 |
| SparkTTS | 1.98 | 0.584 |
| CosyVoice2 | 2.57 | 0.652 |
| **VibeVoice-Realtime-0.5B** | **2.05** | **0.633** |

## Limitaciones conocidas

- **Single speaker:** No soporta multi-speaker (usar VibeVoice-TTS para eso)
- **Idioma:** Principalmente inglés. Otros idiomas pueden dar resultados impredecibles
- **Código/fórmulas:** No soporta lectura de código, fórmulas matemáticas o símbolos especiales
- **Inputs muy cortos:** Con 3 palabras o menos, la estabilidad puede degradarse
- **Voice prompts:** Proporcionados en formato embedded para mitigar riesgos de deepfake. Para customización de voz, contactar al equipo
- **Latencia de red:** El tiempo de playback puede exceder los ~300ms por latencia de red

## Comparación de modelos VibeVoice

| Característica | ASR-7B | TTS-1.5B | Realtime-0.5B |
|---|---|---|---|
| Tipo | Speech-to-Text | Text-to-Speech | Text-to-Speech (streaming) |
| Params | 7B | 1.5B | 0.5B |
| Longitud | 60 min | 90 min | ~10 min |
| Speakers | N/A | Hasta 4 | 1 |
| Latencia | N/A | Batch | ~200-300ms |
| Streaming | N/A | No | Sí |
| Idiomas | 50+ | EN, ZH | EN + 9 exp. |

## Links

- **Modelo:** [HF VibeVoice-Realtime-0.5B](https://huggingface.co/microsoft/VibeVoice-Realtime-0.5B)
- **Colab:** [demo notebook](https://colab.research.google.com/github/microsoft/VibeVoice/blob/main/demo/vibevoice_realtime_colab.ipynb)
- **Project Page:** [microsoft.github.io/VibeVoice](https://microsoft.github.io/VibeVoice)
