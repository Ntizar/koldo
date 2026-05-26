# VidPipe

- **URL:** https://github.com/htekdev/vidpipe
- **Categoría:** DevOps / IA / Procesamiento de Video
- **¿Qué hace?:** Plataforma CLI agéntica de edición de video y creación de contenido. Convierte grabaciones crudas en contenido listo para redes sociales: shorts, reels, subtítulos karaoke, posts para TikTok/YouTube/Instagram/LinkedIn/X, blogs, y más. Usa GitHub Copilot SDK, OpenAI Whisper, Google Gemini y FFmpeg. Arquitectura en 7 capas (L0-L7) con agents modulares.
- **Casos de uso:**
  - Automatizar la creación de shorts de podcasts y videos largos
  - Pipeline de contenido multi-plataforma (TikTok, YouTube, LinkedIn, X)
  - Generación automática de subtítulos karaoke
  - Detección de capítulos y extracción de los mejores clips
  - Eliminación inteligente de silencios
  - Programación automática de publicaciones (Late API)
  - Generación de posts de blog a partir de videos
  - Ideas de contenido con IA (ID8)
- **Snippets útiles:**
  ```bash
  # Instalación
  npm install -g vidpipe
  
  # Setup inicial
  vidpipe init
  
  # Procesar un video
  vidpipe /path/to/video.mp4
  
  # Watch folder para procesamiento automático
  vidpipe --watch-dir ~/Videos/Recordings
  
  # Generar ideas de contenido
  vidpipe ideate --topics "AI, TypeScript, DevOps" --count 4
  
  # Ver y aprobar contenido generado
  vidpipe review
  
  # Programar publicaciones
  vidpipe schedule
  ```
  ```json
  // brand.json - Personalizar tono de marca
  {
    "tone": "professional",
    "hashtags": ["#tech", "#ai", "#devops"],
    "intro": "¡Hola a todos! Hoy vamos a...",
    "outro": "Si te gustó, suscríbete."
  }
  ```
  ```typescript
  // Pipeline specs - Configurar etapas de procesamiento
  // pipeline-specs/full.yaml: ideation → transcription → silence-removal → 
  // shorts → medium-clips → captions → social-posts → blog
  // pipeline-specs/minimal.yaml: solo transcription + captions
  ```
- **Cómo integrarlo en proyectos:**
  1. Instalar: `npm install -g vidpipe` (Node.js 20+)
  2. FFmpeg auto-bundled, pero en arquitecturas raras: instalar system FFmpeg
  3. Copiar `.env.example` a `.env` y añadir `OPENAI_API_KEY`
  4. Suscripción GitHub Copilot necesaria para features de IA
  5. Crear `brand.json` para personalizar tono y hashtags
  6. Usar `vidpipe --watch-dir` para pipeline automático continuo
  7. Pipeline specs en `pipeline-specs/` para configurar etapas
  8. Architecture en 7 capas: L0-pure (utilidades) → L7-app (CLI)
  9. Cada agente es un módulo independiente (`src/L4-agents/`) — extensible
  10. Review UI web para aprobar contenido antes de publicar
  11. Late API para programación automática de posts
- **Fecha de aprendizaje:** 2026-05-26
- **Stars:** 165
- **Licencia:** ISC
