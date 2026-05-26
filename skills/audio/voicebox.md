# VoiceBox - AI Voice Studio

- **URL**: https://github.com/jamiepine/voicebox
- **Stars**: 28,500
- **Lenguaje**: TypeScript / Python / Rust
- **Categoría**: Audio / Voz / IA
- **¿Qué hace?**: Voicebox es un estudio de voz AI local-first — una alternativa open-source a **ElevenLabs** y **WisprFlow** en una sola app. Clona voces desde segundos de audio, genera speech en 23 idiomas usando 7 motores TTS, dicta en cualquier campo de texto con un hotkey global, y da a cualquier agente MCP-aware una voz clonada. El stack completo de voice I/O corre localmente en tu máquina con privacidad total.

- **Casos de uso**:
  - **Voice cloning**: Zero-shot cloning desde una muestra de audio, o 50+ voces preset (Kokoro, Qwen CustomVoice)
  - **TTS multilingüe**: 23 idiomas con 7 motores diferentes (Qwen3-TTS, LuxTTS, Chatterbox, TADA, Kokoro, etc.)
  - **Dictación global**: Hotkey de dictado con push-to-talk y toggle modes, paste automático en macOS
  - **Agent voice output**: Un tool call (`voicebox.speak`) y cualquier agente MCP (Claude Code, Cursor, Cline) habla en tu voz clonada
  - **Speech-to-Text**: Whisper turbo para transcripción local con refinamiento LLM
  - **Post-processing**: 8 efectos de audio (pitch, reverb, delay, chorus, compressor, gain, filters) con presets
  - **Stories editor**: Timeline multi-track para conversaciones, podcasts y narrativas
  - **Personalidades de voz**: Attachar un prompt de personalidad a cualquier perfil — Compose, Rewrite, Respond in-character
  - **MCP integration**: Servidor MCP integrado con 4 herramientas (`speak`, `transcribe`, `list_captures`, `list_profiles`)
  - **GPU multi-plataforma**: MLX (Apple Silicon), CUDA (NVIDIA), ROCm (AMD), IPEX (Intel Arc), CPU

- **Patrones útiles**:
  - **FastAPI lifespan composition**: Combinar múltiples context managers asíncronos para startup/shutdown ordenado (Voicebox + MCP)
  - **Serial generation queue**: Cola serial de corutinas para evitar GPU contention con worker task + cancellation support
  - **SSE streaming**: Streaming de status de generación en tiempo real con `StreamingResponse` y `text/event-stream`
  - **MCP tool registration**: Tools de FastMCP con namespaced dotted names (`voicebox.speak`, `voicebox.transcribe`)
  - **Per-client bindings**: Resolución de perfil con precedence chain (explicit arg → per-client binding → default)
  - **Background task lifecycle**: `create_background_task` con reference tracking para prevenir GC de tasks fire-and-forget
  - **Parent watchdog**: Monitor de PID del padre con grace period y sentinel file para shutdown graceful
  - **Chunked TTS**: Auto-chunking de texto largo con crossfade para generación sin límite de longitud
  - **Model unloading**: Cleanup de modelos en shutdown (TTS, Whisper, LLM) para liberar GPU memory
  - **File upload streaming**: Chunked file upload con size limits y cleanup automático de temp files

- **Snippets reutilizables**:

```python
# FastAPI lifespan composition — combina startup/shutdown de múltiples servicios
from contextlib import asynccontextmanager, AsyncExitStack
from fastapi import FastAPI

def compose_lifespan(*lifespans):
    """Combina múltiples async context managers en un solo lifespan de FastAPI."""
    @asynccontextmanager
    async def _combined(app):
        async with AsyncExitStack() as stack:
            for cm_factory in lifespans:
                cm = cm_factory(app) if callable(cm_factory) else cm_factory
                await stack.enter_async_context(cm)
            yield
    return _combined

# Uso: lifespan = compose_lifespan(voicebox_lifespan, mcp_lifespan)
# application = FastAPI(lifespan=lifespan)
```

```python
# Serial generation queue — evita GPU contention
import asyncio
from dataclasses import dataclass
from typing import Coroutine

_background_tasks: set = set()
_generation_queue: asyncio.Queue = None
_running_generation_tasks: dict = {}
_cancelled_generation_ids: set = set()

@dataclass
class GenerationJob:
    generation_id: str
    coro: Coroutine

def create_background_task(coro) -> asyncio.Task:
    """Crea un background task y previene que sea garbage collected."""
    task = asyncio.create_task(coro)
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)
    return task

async def _generation_worker():
    """Worker que procesa tareas de generación una a la vez."""
    while True:
        job = await _generation_queue.get()
        try:
            if job.generation_id in _cancelled_generation_ids:
                _cancelled_generation_ids.discard(job.generation_id)
                job.coro.close()
                continue
            task = asyncio.create_task(job.coro)
            _running_generation_tasks[job.generation_id] = task
            try:
                await task
            except asyncio.CancelledError:
                if not task.cancelled():
                    raise
        finally:
            _running_generation_tasks.pop(job.generation_id, None)
            _generation_queue.task_done()

def enqueue_generation(generation_id: str, coro):
    """Agrega una corutina a la cola serial de generación."""
    _generation_queue.put_nowait(GenerationJob(generation_id=generation_id, coro=coro))

def cancel_generation(generation_id: str):
    """Cancela una generación en cola o en ejecución."""
    running_task = _running_generation_tasks.get(generation_id)
    if running_task is not None:
        running_task.cancel()
        return "running"
    if generation_id in _cancelled_generation_ids:
        _cancelled_generation_ids.discard(generation_id)
        return "queued"
    return None
```

```python
# SSE streaming endpoint — status updates en tiempo real
import json
import asyncio
from fastapi.responses import StreamingResponse

async def event_stream():
    try:
        while True:
            gen = db.query(DBGeneration).filter_by(id=generation_id).first()
            payload = {
                "id": gen.id,
                "status": gen.status or "completed",
                "duration": gen.duration,
                "error": gen.error,
            }
            yield f"data: {json.dumps(payload)}\n\n"
            if gen.status in ("completed", "failed"):
                return
            await asyncio.sleep(1)
    except (BrokenPipeError, ConnectionResetError, asyncio.CancelledError):
        pass

return StreamingResponse(
    event_stream(),
    media_type="text/event-stream",
    headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
)
```

```python
# MCP tool registration — tools namespaced para agentes
from fastmcp import FastMCP

mcp = FastMCP(
    name="voicebox",
    instructions="Voicebox is a local voice I/O layer. Use voicebox.speak, voicebox.transcribe, etc.",
)

@mcp.tool(name="voicebox.speak", description="Speak text in a Voicebox voice profile.")
async def voicebox_speak(
    text: str,
    profile: str | None = None,
    engine: str | None = None,
    personality: bool | None = None,
    language: str | None = None,
) -> dict:
    """Speak text in a voice profile. Returns generation ID for polling."""
    db = next(get_db())
    try:
        client_id = current_client_id.get()
        vp = resolve_profile(profile, client_id, db)
        # Resolve per-client personality default
        binding = db.query(MCPClientBinding).filter_by(client_id=client_id).first()
        resolved_personality = personality if personality is not None else bool(binding.default_personality) if binding else False
        generation = await generate_speech(
            GenerationRequest(profile_id=vp.id, text=text, language=language or "en",
                            engine=engine or binding.default_engine if binding else None,
                            personality=resolved_personality),
            db,
        )
        return {"generation_id": generation.id, "status": generation.status, "profile": vp.name}
    finally:
        db.close()
```

```python
# Per-client binding resolution con precedence chain
def resolve_profile(profile_arg: str | None, client_id: str | None, db) -> VoiceProfile | None:
    """Resuelve un voice profile con precedence: explicit → per-client → default."""
    if profile_arg:
        # 1. Intentar por nombre (case-insensitive)
        profile = db.query(VoiceProfile).filter(
            func.lower(VoiceProfile.name) == func.lower(profile_arg)
        ).first()
        if profile:
            return profile
        # 2. Intentar por ID
        profile = db.query(VoiceProfile).get(profile_arg)
        if profile:
            return profile
    if client_id:
        # 3. Per-client binding
        binding = db.query(MCPClientBinding).filter_by(client_id=client_id).first()
        if binding and binding.profile_id:
            return db.query(VoiceProfile).get(binding.profile_id)
    # 4. Default voice
    settings = db.query(CaptureSettings).first()
    if settings and settings.default_playback_voice_id:
        return db.query(VoiceProfile).get(settings.default_playback_voice_id)
    return None
```

```python
# Chunked TTS con crossfade para texto ilimitado
async def generate_chunked(tts_model, text, voice_prompt, language, seed,
                           instruct, max_chunk_chars=800, crossfade_ms=50, trim_fn=None):
    """Split text at sentence boundaries, generate each chunk, crossfade together."""
    chunks = split_text_at_sentences(text, max_chunk_chars)
    all_audio = []
    overlap_samples = int(crossfade_ms * tts_model.sample_rate / 1000)

    for i, chunk in enumerate(chunks):
        chunk_audio, sr = await tts_model.synthesize(
            chunk, voice_prompt, language=language, seed=seed, instruct=instruct
        )
        if i > 0 and overlap_samples > 0:
            # Crossfade entre chunks
            prev = all_audio[-1]
            fade_out = prev[-overlap_samples:] * np.linspace(1, 0, overlap_samples)
            fade_in = chunk_audio[:overlap_samples] * np.linspace(0, 1, overlap_samples)
            prev[-overlap_samples:] = fade_out + fade_in
            chunk_audio = chunk_audio[overlap_samples:]
        all_audio.append(chunk_audio)

    result = np.concatenate(all_audio)
    if trim_fn:
        result = trim_fn(result)
    return result, tts_model.sample_rate
```

```python
# Parent watchdog — monitor de proceso padre con graceful shutdown
import signal
import threading
import time

def _start_parent_watchdog(parent_pid, data_dir=None):
    """Monitora el proceso padre y hace shutdown graceful cuando muere."""
    def _is_pid_alive(pid):
        try:
            if sys.platform == "win32":
                import ctypes
                handle = ctypes.windll.kernel32.OpenProcess(0x1000, False, pid)
                if handle:
                    exit_code = ctypes.c_ulong()
                    ctypes.windll.kernel32.GetExitCodeProcess(handle, ctypes.byref(exit_code))
                    ctypes.windll.kernel32.CloseHandle(handle)
                    return exit_code.value == 259  # STILL_ACTIVE
            else:
                os.kill(pid, 0)
                return True
        except (OSError, PermissionError):
            return False

    def _watch():
        while True:
            if not _is_pid_alive(parent_pid):
                time.sleep(1)  # Grace period para disable request
                if not _is_pid_alive(parent_pid):
                    sentinel = os.path.join(data_dir, ".keep-running")
                    if os.path.exists(sentinel):
                        os.remove(sentinel)
                        return  # Keep running
                    os.kill(os.getpid(), signal.SIGTERM)  # Graceful shutdown
                    return
            time.sleep(2)

    t = threading.Thread(target=_watch, daemon=True)
    t.start()
```

```python
# Pydantic models pattern — request/response validation con FastAPI
from pydantic import BaseModel, Field
from typing import Optional, List

class GenerationRequest(BaseModel):
    """Request model para generación de voz."""
    profile_id: str
    text: str = Field(..., min_length=1, max_length=50000)
    language: str = Field(default="en", pattern="^(zh|en|ja|ko|de|fr|ru|pt|es|it|he|ar|...)$")
    seed: Optional[int] = Field(None, ge=0)
    engine: Optional[str] = Field(default="qwen", pattern="^(qwen|luxtts|chatterbox|...)$")
    personality: bool = Field(default=False)
    max_chunk_chars: int = Field(default=800, ge=100, le=5000)
    crossfade_ms: int = Field(default=50, ge=0, le=500)
    effects_chain: Optional[List["EffectConfig"]] = None

class GenerationResponse(BaseModel):
    """Response model para generación de voz."""
    id: str
    profile_id: str
    text: str
    status: str = "completed"
    audio_path: Optional[str] = None
    duration: Optional[float] = None
    error: Optional[str] = None
    source: str = "manual"
```

```python
# REST API wrapper para agent voice output (no-MCP)
# curl -X POST http://127.0.0.1:17493/speak \
#   -H "Content-Type: application/json" \
#   -H "X-Voicebox-Client-Id: my-script" \
#   -d '{"text": "Deploy complete.", "profile": "Morgan"}'

# Endpoint mirror de voicebox.speak — cualquier script puede hablar en voz clonada
@router.post("/speak", response_model=GenerationResponse)
async def speak(
    data: SpeakRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    client_id = request.headers.get("X-Voicebox-Client-Id")
    profile = resolve_profile(data.profile, client_id, db)
    if profile is None:
        raise HTTPException(status_code=404, detail="Voice profile not found")
    generation = await generate_speech(
        GenerationRequest(
            profile_id=profile.id, text=data.text,
            language=data.language or "en",
            engine=data.engine, personality=bool(data.personality),
        ), db,
    )
    return generation
```

```python
# Docker multi-stage build para TTS server
# Stage 1: Build frontend (Bun)
FROM oven/bun:1 AS frontend
WORKDIR /build
COPY package.json bun.lock ./
COPY app/ ./app/
COPY web/ ./web/
RUN bun install --no-save && cd web && bunx --bun vite build

# Stage 2: Build Python deps
FROM python:3.11-slim AS backend-builder
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt
RUN pip install --no-cache-dir --prefix=/install --no-deps chatterbox-tts hume-tada
RUN pip install --no-cache-dir --prefix=/install git+https://github.com/QwenLM/Qwen3-TTS.git

# Stage 3: Runtime
FROM python:3.11-slim
RUN apt-get update && apt-get install -y ffmpeg curl
COPY --from=backend-builder /install /usr/local
COPY backend/ /app/backend/
COPY --from=frontend /build/web/dist /app/frontend/
EXPOSE 17493
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "17493"]
```

- **Cómo integrarlo en proyectos**:
  1. **Docker (recomendado)**: `docker compose up` — levanta el servidor API + web UI en `http://localhost:17493`
  2. **API REST**: `curl -X POST http://127.0.0.1:17493/generate -d '{"text": "Hello", "profile_id": "abc"}'`
  3. **MCP Integration**: `claude mcp add voicebox --transport http --url http://127.0.0.1:17493/mcp --header "X-Voicebox-Client-Id: claude-code"`
  4. **Python SDK**: Importar servicios directamente: `from backend.services import tts, transcribe, llm`
  5. **Desktop app**: `just setup && just dev` — requiere Bun, Rust, Python 3.11+, Tauri prerequisites
  6. **GPU**: Auto-detecta MLX (Apple Silicon), CUDA (NVIDIA), ROCm (AMD), IPEX (Intel Arc)
  7. **Perfiles de voz**: Crear con `POST /profiles`, clonar con `POST /profiles/{id}/samples`
  8. **Transcripción**: `curl -X POST http://127.0.0.1:17493/transcribe -F "audio=@file.wav" -F "model=whisper-turbo"`
  9. **Streaming audio**: `POST /generate/stream` devuelve WAV directamente sin guardar en disco
  10. **Personalidades**: Attachar prompts de personalidad a perfiles, usar `personality=true` para rewrite in-character

- **Fecha de aprendizaje**: 2026-05-26
- **Arquitectura**: Tauri (Rust desktop) + FastAPI (Python backend) + React/TypeScript (frontend)
- **Licencia**: MIT
- **Tech stack clave**: FastAPI, PyTorch, MLX, Whisper, Qwen3-TTS, Kokoro, FastMCP, SQLite, Zustand, Tailwind CSS
