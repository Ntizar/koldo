# Resumen de Pydantic AI Docs — Extraído 2026-05-29

Fuente: https://pydantic.dev/docs/ai/overview/ y subpáginas

## Arquitectura del Framework

Pydantic AI = FastAPI para GenAI. Diseñado por el equipo de Pydantic Validation (la capa de validación de OpenAI SDK, Google ADK, Anthropic SDK, LangChain, LlamaIndex, CrewAI, etc.).

### Filosofía
- **Type-safe by design**: type hints extensivos → errores en write-time, no runtime
- **No es magia**: usa Python estándar (dataclasses, type hints), no "magic" esotérico
- **Model-agnostic**: 20+ proveedores, cambia con una cadena
- **Extensible por diseño**: capabilities composable, toolsets, MCP, Agent2Agent

## Componentes del Agente

| Componente | Descripción |
|---|---|
| Instructions | Instrucciones para el LLM (estáticas o dinámicas) |
| Function tools / toolsets | Funciones que el LLM puede llamar |
| Structured output type | Tipo de dato estructurado que debe devolver |
| Dependency type constraint | Tipado de dependencias para inyección |
| LLM model | Modelo por defecto (cambiable en runtime) |
| Model Settings | Configuración fina del modelo |
| Capabilities | Bundles reutilizables de tools, hooks, instructions |

## Testing Strategy

1. `pytest` como test harness
2. `inline-snapshot` para assertions largas
3. `dirty-equals` para comparar estructuras grandes
4. `TestModel` o `FunctionModel` en lugar del modelo real
5. `Agent.override()` para reemplazar modelo/deps en tests
6. `ALLOW_MODEL_REQUESTS=False` global para bloquear requests accidentales

**TestModel**: procedural Python que genera datos basados en schema JSON. No tiene ML. Llama todas las tools automáticamente.
**FunctionModel**: escribe tu propia lógica de generación de datos.

**Importante**: TestModel NO emula native tools. Si tu agente usa native tools, sobrescribe con `Agent.override()` en tests.

## Streaming

- `run_stream()` → stream de eventos + output final con validación inmediata
- `run_stream_events()` → stream de todos los eventos
- `iter()` → iteración manual sobre el graph del agente

## Model-Agnostic

Formato: `'provider:model-name'`
Proveedores: OpenAI, Anthropic, Gemini, DeepSeek, Grok, Cohere, Mistral, Perplexity, Azure AI Foundry, Amazon Bedrock, Google Cloud, Ollama, LiteLLM, Groq, OpenRouter, Together AI, Fireworks AI, Cerebras, Hugging Face, GitHub, Heroku, Vercel, Nebius, OVHcloud, Alibaba Cloud, SambaNova.

Custom model: implementa un `Model` si tu proveedor no está listado.

## Observabilidad

Integración nativa con Pydantic Logfire (OpenTelemetry). También compatible con cualquier plataforma OTel.
