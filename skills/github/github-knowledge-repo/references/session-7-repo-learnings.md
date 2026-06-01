# Session 7 Repo Learnings (2026-05-27)

## microsoft/markitdown (★125k)
- **Purpose:** Python tool to convert files and office documents to Markdown
- **Key insight:** Uses `magika` (ML-based) for file type detection, not extension-based
- **Plugin system:** Entry points pattern — custom converters register via `markitdown.converters`
- **Azure integration:** Optional `Document Intelligence` and `Content Understanding` backends
- **4 conversion methods:** `convert()`, `convert_local()`, `convert_stream()`, `convert_response()`
- **Dependencies:** python-docx, openpyxl, python-pptx, pdfminer.six, beautifulsoup4, mutagen, yt-dlp
- **Entry points:** `markitdown.plugins` for custom converters

## Blaizzy/mlx-vlm (★4.8k)
- **Purpose:** Vision Language Model inference and fine-tuning on Apple Silicon via MLX
- **Key insight:** 60+ models across 75+ directories in `mlx_vlm/models/`
- **Advanced features:**
  - Speculative decoding: 2-3.9x speedup
  - TurboQuant KV cache: up to 76% memory reduction
  - Vision Feature Caching: 11x faster multi-turn
  - Continuous batching
  - FastAPI OpenAI-compatible server
- **Fine-tuning:** LoRA support documented in LORA.MD
- **Models supported:** Qwen-VL, LLaVA, Llama, Gemma, DeepSeek, Phi-4, and many more

## NangoHQ/nango (★9k)
- **Purpose:** Open-source platform for product integrations with 800+ APIs
- **Three primitives:** Auth (OAuth/API keys), Proxy (authenticated requests), Functions (custom logic)
- **Key insight:** AI-generated but human-controlled code — readable TypeScript you can version control
- **Production scale:** Handles billions of API requests, per-tenant isolation
- **Compliance:** SOC 2 Type II, HIPAA, GDPR
- **SDKs:** `@nangohq/node` (backend), `@nangohq/frontend` (auth embed)
- **AI integration:** Tool calling for OpenAI, MCP server support

## crystaldba/postgres-mcp (★2.8k)
- **Purpose:** PostgreSQL MCP server with deterministic index tuning
- **Key differentiator:** Uses Microsoft's Anytime Algorithm (not LLM guesses) for index recommendations
- **HypoPG integration:** Simulate index impact without modifying the DB
- **SQL validation:** pglast parser in restricted mode (blocks COMMIT, ROLLBACK, DDL, DML)
- **7 health checks:** Adapted from PgHero
- **3 transport modes:** stdio, SSE, streamable-http
- **Dependencies:** pglast, psycopg2, fastapi, uvicorn

## antoinelame/GazeTracking (★2.6k)
- **Purpose:** Eye tracking library using webcam + dlib facial landmarks
- **Architecture:** 4 clean classes — `GazeTracking` (public API), `Eye` (eye isolation), `Pupil` (iris detection), `Calibration` (auto-threshold)
- **Auto-calibration:** First 20 frames
- **Dependencies:** dlib, opencv-python, numpy — only 3 deps
- **Output:** Pupil center coordinates, gaze direction ratios, blink detection
