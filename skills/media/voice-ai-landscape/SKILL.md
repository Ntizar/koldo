---
name: voice-ai-landscape
description: "Panorama de herramientas Voice AI — VibeVoice (Microsoft), Voicebox, y patrones de TTS/ASR para agentes IA."
version: 1.0.0
author: Koldo (auto-generated from exploration)
tags: [media, voice, tts, stt, voice-ai]

---

# Voice AI Landscape

Panorama actual de herramientas de voz AI (TTS/ASR/voice cloning) explorado desde repos con estrella de Ntizar.

## 1. VibeVoice (Microsoft) — ⭐47k

**Fuente:** [microsoft/VibeVoice](https://github.com/microsoft/VibeVoice)

### Características
- **ASR + TTS unificado:** Un solo modelo para speech-to-text y text-to-speech
- **Long-form ASR:** Soporta audio de 60 minutos en un solo paso
- **Estructurado:** Genera transcripciones con Who (speaker), When (timestamps), What (content)
- **Transformers release:** Modelo disponible en HuggingFace Transformers
- **Paper:** [TTS Report](https://openreview.net/pdf?id=FihSkzyxdv) + [ASR Report](https://arxiv.org/pdf/2601.18184)

### Uso
```python
# ASR
from transformers import AutoModelForAudioEncoding, AutoProcessor
# TTS
from transformers import AutoModelForTextToWaveform, AutoTokenizer
```

### Relevancia para Koldo
- Alternativa a TTS actual (Álvaro via edge/openai)
- Podría reemplazar o complementar el pipeline TTS de Koldo
- ASR unificado permite dictado directo a Koldo

## 2. Voicebox — ⭐28k

**Fuente:** [jamiepine/voicebox](https://github.com/jamiepine/voicebox)

### Características
- **Voice studio local:** Todo corre localmente en tu máquina
- **Voice cloning:** Clona cualquier voz con poco audio
- **Qwen3-TTS:** Usa el modelo Qwen3-TTS para generación
- **Dictado:** Dictado directo a cualquier app
- **Desktop app:** App de escritorio (macOS/Linux/Windows)
- **API:** Endpoint local para integración con agentes

### Arquitectura
```
Whisper (ASR) → Qwen3-TTS (TTS) → Voice cloning → Local API
```

### Relevancia para Koldo
- Más orientado a producto que VibeVoice
- API local fácil de integrar con Hermes
- Voice cloning para personalización avanzada

## 3. Comparativa

| Feature | VibeVoice | Voicebox | Koldo actual (Álvaro) |
|---------|-----------|----------|----------------------|
| TTS | ✅ | ✅ | ✅ (edge/openai) |
| ASR | ✅ | ✅ | ❌ |
| Voice cloning | ❌ | ✅ | ❌ |
| Long-form | 60 min | ✅ | N/A |
| Local | ✅ | ✅ | ❌ (cloud) |
| Multi-idioma | ✅ | ✅ | ✅ |
| Integración | Transformers | Local API | TTS tool |

## Recomendación

Para Koldo:
1. **Mantener TTS actual** para respuestas cortas (baja latencia, buena calidad)
2. **Evaluar VibeVoice ASR** para dictado/entrada por voz
3. **Voicebox** si se necesita voice cloning local

## Referencias
- https://github.com/microsoft/VibeVoice
- https://github.com/jamiepine/voicebox
- https://huggingface.co/collections/microsoft/vibevoice-68a2ef24a875c44be47b034f
