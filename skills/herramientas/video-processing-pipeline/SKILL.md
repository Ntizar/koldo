---
name: video-processing-pipeline
description: "Pipeline de procesamiento de vídeo con IA — vidpipe: transcripción, edición automática, captions, shorts y posts para redes sociales."
version: 1.0.0
author: Koldo (Ntizar)
tags: [herramientas, video, AI, vidpipe]

---

# Video Processing Pipeline

Pipeline agéntico para procesar grabaciones de vídeo y convertirlos en contenido listo para redes sociales.

## vidpipe (htekdev) ⭐166
**URL:** https://github.com/htekdev/vidpipe
**Tecnología:** TypeScript, Node.js 20+, GitHub Copilot SDK, OpenAI Whisper, Google Gemini

### Qué hace:
Editor de vídeo agéntico + motor de ideación de contenido. Convierte grabaciones raw en:
- Shorts/reels para redes sociales
- Captions con karaoke word-by-word
- Posts para plataformas
- Blog posts

### Pipeline completo:
```
Input (grabación raw)
  → ID8: Ideación de contenido (AI, trend-backed)
  → Whisper: Transcripción con timestamps a nivel de palabra
  → AI Silence Removal: Context-aware, max 20% silencio
  → Split-Screen: Portrait, square, feed layouts
  → Karaoke Captions: Highlighting palabra por palabra
  → Short Clips: Mejores momentos 15-60s, orden hook-first
  → Output: Shorts, reels, captions, blog posts, social posts
```

### Instalación:
```bash
npm install -g vidpipe
```

### Arquitectura:
- **GitHub Copilot SDK** → agentes AI para procesamiento
- **OpenAI Whisper** → transcripción con word-level timestamps
- **Google Gemini** → generación de contenido y captions
- **Node.js 20+** → runtime

### Features clave:
- **Content Ideation (ID8):** Ideas de vídeo respaldadas por trends
- **Silence Removal:** Context-aware, no elimina pausas significativas
- **Karaoke Captions:** Highlighting palabra por palabra
- **Best Moments:** Detección automática de los mejores clips 15-60s
- **Hook-first ordering:** Los clips más impactantes primero
- **Platform-tailored:** Posts adaptados a cada plataforma

## Integración con Koldo

### Para procesar grabaciones:
1. Instalar vidpipe: `npm install -g vidpipe`
2. Configurar API keys (Whisper + Gemini)
3. Pipeline: input → transcripción → edición → output

### Para TTS (alternativa):
- **VibeVoice** (microsoft) ⭐47464: TTS frontier, multilingual, 90 min long-form
- **Voicebox** (jamiepine) ⭐28651: AI voice studio, clone/dictate/create

### Para conversión de archivos:
- **markitdown** (microsoft) ⭐125610: Convertir cualquier archivo a Markdown
