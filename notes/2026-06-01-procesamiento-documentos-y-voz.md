# Procesamiento de Documentos y Voz — Referencias Clave

**Fecha**: 2026-06-01
**Fuente**: Exploración de repositorios con estrellas de Ntizar

---

## Procesamiento de Documentos

### MarkItDown (microsoft/markitdown — 135464★)

Convertidor universal de archivos a Markdown para LLMs.

**Soporte**: PDF, PPT, Word, Excel, imágenes (EXIF+OCR), audio (EXIF+transcripción), HTML, CSV, JSON, XML, ZIP, YouTube URLs, EPUBs

**Patrón clave**: `convert_local()`, `convert_stream()`, `convert_url()` — funciones narrow para seguridad

**Seguridad**: Realiza I/O con privilegios del proceso actual. Sanitizar inputs en entornos no confiables.

### LiteParse (run-llama/liteparse — 8406★)

Parser PDF rápido y ligero con OCR integrado.

**Tecnología**: PDFium para parsing espacial con bounding boxes
**Multi-lingua**: Rust (crate), Python (pip), TypeScript (npm), WASM
**OCR**: Built-in Tesseract + opciones de cloud (LlamaParse para documentos complejos)

**Diferencia con MarkItDown**:
- MarkItDown: multi-formato (PDF, PPT, Word, Excel, imágenes, audio, ZIP...)
- LiteParse: especializado en PDF con parsing espacial de alta calidad

### pdf2html (shebinleo/pdf2html — 206★)

Conversión PDF a HTML usando Apache Tika.

**Uso**: Cuando se necesita HTML renderizable en lugar de Markdown

---

## Procesamiento de Voz

### VibeVoice (microsoft/VibeVoice — 47605★)

Voice AI de frontera open-source de Microsoft.

**Modelos**: TTS (Text-to-Speech) + ASR (Automatic Speech Recognition)
**Papers**: TTS Report (OpenReview) + ASR Report (arXiv)
**Integración**: ASR en Transformers de HuggingFace

**Estado 2026**: Modelo de referencia en TTS/ASR open-source
**URL**: https://microsoft.github.io/VibeVoice

### Voicebox (jamiepine/voicebox — 28996★)

Estudio de voz local completo.

**Funcionalidades**:
- Clonación de voz (voice cloning)
- Generación de speech (TTS)
- Dictado en cualquier app
- Voz para agentes (agent voice)

**Diferencia con VibeVoice**:
- VibeVoice: modelo de referencia cloud/open-source (TTS+ASR)
- Voicebox: stack completo LOCAL (clonación + dictado + agentes)

---

## Gaze Tracking

### GazeTracking (antoinelame/GazeTracking — 2576★)

Librería Python de eye tracking por webcam.

**Características**:
- Python 3.10+
- Posición exacta de pupilas y dirección de mirada en tiempo real
- Instalación: pip, uv, conda, Docker
- Referencia para FreeHands

### MLX-VLM (Blaizzy/mlx-vlm — 4800★)

Inference y fine-tuning de Vision Language Models en Mac con MLX.

**Modelos soportados**: VLMs + Omni Models (VLMs con audio y video)
**Features**: Speculative decoding, chat UI Gradio, FastAPI server, continuous batching, KV cache quantization
**Fine-tuning**: Soporte de fine-tuning incluido

---

## Diseño CSS

### Glass Refraction (Z1Code/glass-refraction — 35★)

Sistema de diseño Liquid Glass con SVG refraction filters.

**Inspiración**: Apple Liquid Glass (WWDC 2025) + kube.io SVG refraction research

**CSS-only usage**:
```css
@import 'glass-refraction/css';
```

**Components**: `.glass` (navbar), `.glass-card`, `.glass-pill`

**Efectos**: Frosted glass, animated shimmer sweep, specular breathing highlight, chromatic edge dispersion

---

## BI y Bases de Datos

### Metabase (metabase/metabase — 47523★)

BI open-source fácil de usar.

**Features**: Setup en 5 minutos, preguntas en lenguaje natural, embedded analytics

### Postgres MCP Pro (crystaldba/postgres-mcp — 2830★)

PostgreSQL MCP Pro — acceso read/write configurable y análisis de performance para agentes IA.

**Features**: Index tuning, EXPLAIN, query optimization, MCP protocol
