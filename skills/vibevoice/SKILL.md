# VibeVoice — Open-Source Frontier Voice AI

**Author:** Microsoft Research  
**Repo:** [microsoft/VibeVoice](https://github.com/microsoft/VibeVoice) (~47k ⭐)  
**Hugging Face Collection:** [microsoft/vibevoice](https://huggingface.co/collections/microsoft/vibevoice-68a2ef24a875c44be47b034f)

## Qué es

VibeVoice es una familia de modelos de voz AI de código abierto que incluye **Text-to-Speech (TTS)** y **Automatic Speech Recognition (ASR)**. Su innovación central es el uso de **tokenizadores de speech continuos** (Acoustic y Semantic) a **7.5 Hz**, combinados con un framework **next-token diffusion** que usa un LLM para contexto textual y una diffusion head para detalles acústicos.

## Modelos disponibles

| Modelo | Tipo | Params | Longitud | Idiomas | Link |
|---|---|---|---|---|---|
| **VibeVoice-ASR-7B** | ASR | 7B | 60 min audio | 50+ idiomas | [HF](https://huggingface.co/microsoft/VibeVoice-ASR) |
| **VibeVoice-TTS-1.5B** | TTS | 1.5B | 90 min audio | EN, ZH, cross-lingual | [HF](https://huggingface.co/microsoft/VibeVoice-1.5B) |
| **VibeVoice-Realtime-0.5B** | TTS Streaming | 0.5B | ~10 min audio | EN + 9 idiomas | [HF](https://huggingface.co/microsoft/VibeVoice-Realtime-0.5B) |

### Notas por modelo

- **ASR-7B**: Transcripción estructurada (Who/When/What), hotwords personalizados, diarización + timestamping nativos, soporte code-switching, vLLM disponible.
- **TTS-1.5B**: Multi-speaker (hasta 4), speech expresivo con matices emocionales, singing emergente, cross-lingual transfer. **Código TTS deshabilitado** por el equipo Microsoft (uso indebido detectado); los weights están disponibles en HF.
- **Realtime-0.5B**: Latencia ~200-300ms primer chunk, streaming text input, single speaker, 11 estilos experimentales EN + voces multilingües experimentales.

## Instalación

```bash
# Clonar repo
git clone https://github.com/microsoft/VibeVoice.git
cd VibeVoice

# Instalar dependencias
pip install -e .

# Para streaming TTS (extras)
pip install -e .[streamingtts]
```

**Requisitos:** Python >= 3.10, PyTorch, CUDA (NVIDIA GPU recomendada).  
**Opcional:** `flash-attn` para mejor rendimiento, vLLM para ASR serving de alto throughput.

## Dependencias principales

`torch`, `transformers>=4.51.3,<5.0.0`, `accelerate`, `llvmlite>=0.40.0`, `numba>=0.57.0`, `diffusers`, `librosa`, `gradio`, `fastapi`, `uvicorn`, `pydub`, `aiortc`, `av`

## Cuándo usar cada modelo

| Escenario | Modelo recomendado |
|---|---|
| Transcribir reuniones/podcasts largos (hasta 60 min) | **VibeVoice-ASR** |
| Generar podcasts/conversaciones multi-speaker (hasta 90 min) | **VibeVoice-TTS** |
| TTS en tiempo real para asistentes/LLMs streaming | **VibeVoice-Realtime** |
| ASR con hotwords personalizados / dominio específico | **VibeVoice-ASR** (con finetuning LoRA) |
| Servir ASR a alta throughput con API OpenAI-compatible | **VibeVoice-ASR** + vLLM |

## Patrones de uso

Consulta los archivos en `references/` para guías detalladas:
- `references/pattern-asr.md` — Patrón de uso de VibeVoice-ASR
- `references/pattern-tts.md` — Patrón de uso de VibeVoice-TTS
- `references/pattern-realtime.md` — Patrón de uso de VibeVoice-Realtime

## Riesgos y limitaciones

- **Deepfakes:** El speech sintético de alta calidad puede usarse para suplantación. Usar responsablemente y revelar contenido AI generado.
- **TTS:** Código de generación deshabilitado por el equipo Microsoft. Solo weights disponibles en HF.
- **Idiomas:** ASR soporta 50+ idiomas. TTS principal es EN/ZH. Realtime es principalmente EN (9 idiomas experimentales).
- **Investigación:** No recomendado para producción comercial sin pruebas adicionales.
