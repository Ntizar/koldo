# VoiceBox

- **URL**: https://github.com/jamiepine/voicebox
- **Categoría**: Audio y Voz
- **¿Qué hace?**: VoiceBox es un estudio de voz con IA de código abierto y de ejecución local, alternativa a ElevenLabs y WisprFlow. Permite clonar voces a partir de muestras de audio, generar habla en 23 idiomas usando 7 motores TTS diferentes, transcribir dictado a texto con Whisper, y dar voz a agentes de IA (MCP) con voces clonadas. Todo funciona localmente en tu máquina, garantizando privacidad total. Construido con Tauri (Rust), React/TypeScript y FastAPI (Python).
- **Casos de uso**:
  - Clonación de voces (zero-shot) a partir de muestras de audio
  - Generación de habla (TTS) en 23 idiomas con 7 motores diferentes
  - Dictado global con hotkey (push-to-talk / toggle) con auto-pegado en macOS
  - Transcripción de audio a texto con Whisper (base/small/medium/large/turbo)
  - Dar voz a agentes de IA (Claude Code, Cursor, Cline) mediante MCP
  - Edición multi-pista de historias, podcasts y narrativas
  - Personalidades de voz con LLM local (Qwen3 0.6B/1.7B/4B) para composición y reescritura
  - Post-procesamiento de audio: pitch shift, reverb, delay, chorus, compresión, filtros
  - Generación de longitud ilimitada con auto-chunking y crossfade
  - Integración API REST para scripts y aplicaciones personalizadas
- **Snippets útiles**:

  ```bash
  # Generar habla via REST API
  curl -X POST http://127.0.0.1:17493/generate \
    -H "Content-Type: application/json" \
    -d {"text": "Hola mundo", "profile_id": "abc123", "language": "es"}

  # Voz para agentes
  curl -X POST http://127.0.0.1:17493/speak \
    -H "Content-Type: application/json" \
    -H "X-Voicebox-Client-Id: my-script" \
    -d {"text": "Despliegue completo.", "profile": "Morgan"}

  # Transcribir un archivo de audio
  curl -X POST http://127.0.0.1:17493/transcribe \
    -F "audio=@grabacion.wav" \
    -F "model=whisper-turbo"

  # Listar perfiles de voz
  curl http://127.0.0.1:17493/profiles
  ```

  ```ts
  // En cualquier agente MCP-aware (ej: Claude Code)
  await voicebox.speak({
    text: "Tests pasando. Listo para merge.",
    profile: "Morgan",       // opcional
    personality: true,       // opcional
  });
  ```

  ```bash
  # Configurar MCP server en Claude Code
  claude mcp add voicebox \
    --transport http \
    --url http://127.0.0.1:17493/mcp \
    --header "X-Voicebox-Client-Id: claude-code"
  ```

  ```json
  {
    "mcpServers": {
      "voicebox": {
        "url": "http://127.0.0.1:17493/mcp",
        "headers": { "X-Voicebox-Client-Id": "cursor" }
      }
    }
  }
  ```
- **Cómo integrarlo en proyectos**:
  1. **Instalar**: Descargar desde https://voicebox.sh/download (macOS/Windows) o docker compose up para Docker. En Linux, compilar desde fuente siguiendo https://voicebox.sh/linux-install.
  2. **API REST**: El servidor backend FastAPI se ejecuta en el puerto 17493 (localhost). Documentación interactiva en /docs. Endpoints principales: POST /generate (TTS), POST /speak (voz para agentes), POST /transcribe (STT), GET /profiles.
  3. **MCP Server**: Integrar con agentes MCP (Claude Code, Cursor, Cline, VS Code) añadiendo el servidor Voicebox. Se soporta transporte HTTP y stdio. Las 4 herramientas disponibles son: voicebox.speak, voicebox.transcribe, voicebox.list_captures, voicebox.list_profiles.
  4. **Desarrollo local**: git clone https://github.com/jamiepine/voicebox.git && cd voicebox && just setup && just dev. Requiere Bun, Rust, Python 3.12+, Tauri prerequisites.
  5. **Motores TTS disponibles**: Qwen3-TTS (10 idiomas), Qwen CustomVoice (10 idiomas), LuxTTS (inglés, ligero), Chatterbox Multilingual (23 idiomas), Chatterbox Turbo (inglés, con tags emocionales), HumeAI TADA (10 idiomas), Kokoro (8 idiomas, modelo tiny).
  6. **GPU**: MLX/Metal en Apple Silicon, PyTorch/CUDA en NVIDIA, PyTorch/ROCm en AMD, IPEX/XPU en Intel Arc, o CPU como fallback.
  7. **Paquete Python**: voicebox-backend v0.2.3, requiere Python >=3.12, usa Ruff para linting/formatting y pytest para tests.
- **Fecha de aprendizaje**: 2026-05-27
