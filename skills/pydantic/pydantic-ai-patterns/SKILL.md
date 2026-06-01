---
name: pydantic-ai-patterns
description: "Patrones de producción con Pydantic AI: inyección de dependencias, structured outputs, testing con TestModel/FunctionModel, streaming, capabilities, agent override, tools, dynamic instructions y model-agnostic design"
version: 1.0.0
author: Koldo
tags: [pydantic, ai, python, agent, testing, streaming, patterns, production]
---

# Pydantic AI — Patrones de Producción

## Visión general

Pydantic AI es un framework de agentes GenAI para Python que lleva la ergonomía de FastAPI al desarrollo con IA generativa. Este skill cubre patrones avanzados para construir agentes robustos, testables y mantenibles.

## 1. Type-Safe by Design

Usa type hints extensivamente. Pydantic AI está diseñado para que tu IDE y AI coding agent tengan máximo contexto para auto-completado y type checking.

```python
from pydantic_ai import Agent

# Agent[DepsType, OutputType] — tipado completo
agent: Agent[SupportDependencies, SupportOutput] = Agent(
    'openai:gpt-5.2',
    deps_type=SupportDependencies,
    output_type=SupportOutput,
)
```

**Por qué importa:** Mueve errores de runtime a write-time. Si "type checks", funciona.

## 2. Dependency Injection con Dataclasses

```python
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class SupportDependencies:
    customer_id: int
    db: DatabaseConn

agent = Agent(
    'openai:gpt-5.2',
    deps_type=SupportDependencies,
)

# Acceso via RunContext como primer parámetro
@agent.tool
async def customer_balance(
    ctx: RunContext[SupportDependencies],
    include_pending: bool
) -> float:
    return await ctx.deps.db.customer_balance(
        id=ctx.deps.customer_id,
        include_pending=include_pending,
    )
```

**Reglas:**
- Usa `dataclass` para contenedores de dependencias
- `RunContext[DepsType]` siempre como primer parámetro
- `ctx.deps` para acceder a dependencias
- `ctx.agent` para acceder al agente (name, output_type, etc.)
- Preferir `async def` — las funciones síncronas se ejecutan en thread pool

## 3. Structured Outputs con BaseModel

```python
from pydantic import BaseModel, Field

class SupportOutput(BaseModel):
    support_advice: str = Field(description='Advice returned to the customer')
    block_card: bool = Field(description="Whether to block the customer's card")
    risk: int = Field(description='Risk level of query', ge=0, le=10)

agent = Agent('openai:gpt-5.2', output_type=SupportOutput)
result = agent.run_sync('I just lost my card!')
print(result.output.support_advice)  # str validado
print(result.output.risk)  # int validado (0-10)
```

**Campos de result:**
- `result.output` — dato validado (BaseModel, str, imagen, etc.)
- `result.usage` — tokens consumidos y requests
- `result.messages()` — historial de mensajes

## 4. Function Tools

Dos decoradores:
- `@agent.tool` — necesita acceso al contexto (`RunContext`)
- `@agent.tool_plain` — NO necesita contexto

```python
@agent.tool_plain  # sin contexto
def roll_dice(sides: int) -> int:
    """Lanza un dado de N caras."""
    import random
    return random.randint(1, sides)

@agent.tool  # con contexto
async def get_user_name(ctx: RunContext[Deps]) -> str:
    return await ctx.deps.db.get_user(ctx.deps.user_id)
```

**Reglas:**
- La docstring se usa como descripción del tool para el LLM
- Los tools son el "R" de RAG — permiten al LLM solicitar información
- Para llamadas que NO necesitan retorno al modelo, usa output functions

## 5. Dynamic Instructions

```python
@agent.instructions
async def add_customer_name(ctx: RunContext[SupportDependencies]) -> str:
    customer_name = await ctx.deps.db.customer_name(id=ctx.deps.customer_id)
    return f"The customer's name is {customer_name!r}"
```

Las instrucciones dinámicas se ejecutan en tiempo de ejecución, inyectando contexto externo.

## 6. Composable Capabilities

```python
from pydantic_ai.capabilities import Thinking, WebSearch

agent = Agent(
    'anthropic:claude-sonnet-4-6',
    capabilities=[Thinking(), WebSearch(local='duckduckgo')],
)
```

Built-in: `Thinking()`, `WebSearch()`, MCP, YAML/JSON agent specs.
Terceros: Pydantic AI Harness capability library.

## 7. Testing con TestModel y FunctionModel

**Estrategia recomendada:**
1. Usa `pytest` como test harness
2. Usa `inline-snapshot` para assertions largas
3. Usa `dirty-equals` para comparar estructuras grandes
4. Usa `TestModel` o `FunctionModel` en lugar del modelo real
5. Usa `Agent.override()` para reemplazar modelo/deps en tests
6. Set `ALLOW_MODEL_REQUESTS=False` globalmente

```python
from pydantic_ai import TestModel

def test_weather_forecast():
    with weather_agent.override(model=TestModel()):
        result = get_weather_forecast("Madrid", date.today())
        assert result.output.temperature == 22

# Para tests más sofisticados
from pydantic_ai import FunctionModel

def my_model_fn(ctx, messages):
    return AgentResponse(user_prompt="Custom response")

agent = Agent('openai:gpt-4o', model=FunctionModel(my_model_fn))
```

**TestModel vs FunctionModel:**
- `TestModel`: Llama todas las tools automáticamente, genera datos basados en schema JSON. Sin ML, código procedural.
- `FunctionModel`: Escribe tu propia lógica de generación de datos.

## 8. Agent Override

```python
# En tests
with agent.override(model=TestModel(), deps=TestDeps()):
    result = agent.run_sync("test")

# En producción (cambiar modelo según entorno)
with agent.override(model='openai:gpt-5.2' if prod else 'ollama:llama3'):
    result = await agent.run("query")
```

Permite reemplazar modelo, dependencias o toolsets sin modificar el agente.

## 9. Streaming con Validación en Tiempo Real

```python
async with agent.run_stream('query') as result:
    print(result.output)  # output parcial en tiempo real
    async for message in result.messages_stream():
        print(message)

# Iteración manual sobre el graph
async for event in agent.iter('query'):
    print(event)
```

Tipos de streaming:
- `run_stream()` — stream de eventos + output final
- `run_stream_events()` — stream de todos los eventos
- `iter()` — iteración manual sobre el graph del agente

## 10. Model-Agnostic Design

```python
agent = Agent('anthropic:claude-sonnet-4-6')
agent = Agent('openai:gpt-5.2')
agent = Agent('google:gemini-3-flash-preview')
agent = Agent('ollama:llama3')
```

Soporta 20+ proveedores: OpenAI, Anthropic, Gemini, DeepSeek, Grok, Cohere, Mistral, Perplexity, Azure AI, Amazon Bedrock, Ollama, LiteLLM, Groq, OpenRouter, Together AI, Fireworks AI, Cerebras, Hugging Face, GitHub, y más.

Formato: `'provider:model-name'`. Si tu proveedor no está listado, implementa un `Model` custom.

## ⚠️ Pitfalls

- **No confundir** `run_sync` (bloqueante) con `run` (async)
- **TestModel no emula native tools** — si tu agente usa native tools, sobrescribe con `Agent.override()` en tests
- **Las funciones síncronas en tools/instructions** se ejecutan en thread pool via `run_in_executor` — preferir `async def`
- **`ALLOW_MODEL_REQUESTS=False`** es global — úsalo en tests para bloquear requests accidentales a LLMs reales
- **Las dependencias son dataclasses** — no objetos arbitrarios sin tipado, para mantener type safety

## Referencias

- `references/pydantic-ai-docs-summary.md` — Resumen completo de 10 skills extraído de la documentación oficial
- `pydantic-ai-basics` — Skill hermano para fundamentos (agentes básicos, tipos, validación)
