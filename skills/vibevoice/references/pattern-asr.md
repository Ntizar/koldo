# Patrón de uso: VibeVoice-ASR

## Resumen

VibeVoice-ASR es un modelo **speech-to-text unificado** que procesa **hasta 60 minutos de audio continuo** en un solo paso, produciendo una **transcripción estructurada** con:

- **Who** — Identificación del hablante (diarización)
- **When** — Marcas de tiempo precisas
- **What** — Contenido transcrito del speech

Soporta **50+ idiomas**, **code-switching** nativo, y **hotwords personalizados** para mejorar la precisión en dominios específicos.

## Características clave

| Característica | Detalle |
|---|---|
| Modelo | VibeVoice-ASR-7B |
| Longitud máxima | 60 min de audio (64K tokens) |
| Idiomas | 50+ (sin configuración explícita) |
| Code-switching | Nativo dentro y entre utterances |
| Hotwords | Personalizables (nombres, términos técnicos) |
| Output | Estructurado: Who + When + What |
| Serving | vLLM con API OpenAI-compatible |
| Finetuning | Soporte LoRA disponible |

## Instalación

```bash
git clone https://github.com/microsoft/VibeVoice.git
cd VibeVoice
pip install -e .

# Opcional: flash attention para mejor rendimiento
pip install flash-attn --no-build-isolation
```

## Uso básico

### 1. Demo Gradio

```bash
apt update && apt install ffmpeg -y
python demo/vibevoice_asr_gradio_demo.py \
  --model_path microsoft/VibeVoice-ASR \
  --share
```

### 2. Inferencia directa desde archivos

```bash
python demo/vibevoice_asr_inference_from_file.py \
  --model_path microsoft/VibeVoice-ASR \
  --audio_files /path/to/audio.wav
```

### 3. Serving con vLLM (alto throughput)

```bash
docker run -d --gpus all --name vibevoice-vllm \
  --ipc=host \
  -p 8000:8000 \
  -e VIBEVOICE_FFMPEG_MAX_CONCURRENCY=64 \
  -e PYTORCH_ALLOC_CONF=expandable_segments:True \
  -v $(pwd):/app \
  -w /app \
  --entrypoint bash \
  vllm/vllm-openai:v0.14.1 \
  -c "python3 /app/vllm_plugin/scripts/start_server.py"
```

Esto expone un endpoint `/v1/chat/completions` compatible con OpenAI con streaming support.

## Patrón: Transcripción de audio largo

```python
# Procesar hasta 60 minutos en un solo paso
# A diferencia de ASR convencionales que dividen en chunks
audio_path = "/path/to/long_recording.wav"

# La salida es una lista de segmentos estructurados:
# [
#   {"speaker": "Speaker_1", "start": 0.0, "end": 15.3, "text": "Hola a todos..."},
#   {"speaker": "Speaker_2", "start": 15.8, "end": 32.1, "text": "Buenos días..."},
#   ...
# ]
```

**Ventaja clave:** A diferencia de modelos que dividen el audio en segmentos cortos (perdiendo contexto global), VibeVoice-ASR mantiene consistencia en el tracking de hablantes y coherencia semántica durante toda la hora de audio.

## Patrón: Hotwords personalizados

```python
# Proveer hotwords para mejorar precisión en contenido específico
hotwords = [
    "NVIDIA Deep Learning Container",
    "PyTorch",
    "transformers",
    "Dr. García-Martínez",
    "VibeVoice"
]

# Los hotwords guían el proceso de reconocimiento
# mejorando precisión en términos de dominio específico
```

## Patrón: Multilingüe y code-switching

```python
# No requiere configuración explícita de idioma
# Soporta 50+ idiomas nativamente
# Maneja code-switching dentro y entre utterances

# Ejemplo: audio con mezcla español-inglés
# El modelo detecta y transcribe automáticamente ambos idiomas
audio_multilingue = "/path/to/es_en_mix.wav"
# Output: transcripción correcta en ambos idiomas con speaker tracking
```

### Idiomas soportados (ejemplos)

Inglés, Francés, Alemán, Italiano, Japonés, Coreano, Portugués, Ruso, Español, Tailandés, Vietnamita, Chino, y muchos más (50+ total).

## Evaluación (DER / WER)

| Dataset | Language | DER | cpWER | tcpWER | WER |
|---|---|---|---|---|---|
| MLC-Challenge | English | 4.28 | 11.48 | 13.02 | 7.99 |
| MLC-Challenge | Spanish | 2.67 | 10.51 | 11.71 | 8.04 |
| MLC-Challenge | French | 3.80 | 18.80 | 19.64 | 15.21 |
| MLC-Challenge | German | 1.04 | 17.10 | 17.26 | 16.30 |
| AISHELL-4 | Chinese | 6.77 | 24.99 | 25.35 | 21.40 |
| AMI-IHM | English | 11.92 | 20.41 | 20.82 | 18.81 |

## Finetuning LoRA

El modelo soporta fine-tuning con LoRA para dominios específicos. Ver [finetuning-asr/README.md](https://github.com/microsoft/VibeVoice/tree/main/finetuning-asr) para guía completa.

## Links

- **Modelo:** [HF VibeVoice-ASR](https://huggingface.co/microsoft/VibeVoice-ASR)
- **Transformers:** [HF VibeVoice-ASR-HF](https://huggingface.co/microsoft/VibeVoice-ASR-HF) (integración directa con HuggingFace Transformers)
- **Playground:** [aka.ms/vibevoice-asr](https://aka.ms/vibevoice-asr)
- **Paper:** [arXiv 2601.18184](https://arxiv.org/pdf/2601.18184)
- **vLLM:** [docs/vibevoice-vllm-asr.md](https://github.com/microsoft/VibeVoice/tree/main/docs/vibevoice-vllm-asr.md)
- **Finetuning:** [finetuning-asr/README.md](https://github.com/microsoft/VibeVoice/tree/main/finetuning-asr)
