---
name: pydantic-ai-basics
description: "Fundamentos de Pydantic AI: agentes básicos, tipos, validación y el patrón 'Hello World' del framework"
version: 1.0.0
author: Koldo
tags: [pydantic, ai, python, agent, validation, types]
---

# Pydantic AI — Fundamentos

## Qué es

Pydantic AI es un framework de agentes GenAI para Python que trae la ergonomía de FastAPI al desarrollo de aplicaciones con IA generativa. Se basa en Pydantic Validation y type hints modernos.

## Conceptos clave

### 1. Agentes básicos
```python
from pydantic_ai import Agent

agent = Agent(
    'openai:gpt-4o',
    system_prompt='Eres un asistente útil.',
)

result = agent.run_sync('¿Qué tiempo hace en Madrid?')
print(result.data)
```

### 2. Validación con Pydantic
```python
from pydantic import BaseModel

class Tiempo(BaseModel):
    ciudad: str
    temperatura: float
    humedad: int

agent = Agent('openai:gpt-4o', output_type=Tiempo)
result = agent.run_sync('¿Qué tiempo hace en Madrid?')
# result.data es una instancia validada de Tiempo
```

### 3. Tools (herramientas)
```python
@agent.tool
def obtener_clima(ciudad: str) -> str:
    """Obtiene el clima actual de una ciudad."""
    # Lógica para obtener clima
    return f"{ciudad}: 22°C, soleado"

result = agent.run_sync('¿Qué tiempo hace en Madrid?')
```

### 4. Dependency Injection
```python
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class DB:
    def query(self, sql: str):
        return [...]

agent = Agent('openai:gpt-4o', deps_type=DB)

@agent.tool
def buscar_datos(query: str, ctx: RunContext[DB]):
    return ctx.deps.query(query)
```

## Patrones esenciales

1. **Agent = LLM + System Prompt + Tools + Output Schema**
2. **Todo está tipado** — IDE autocomplete + type checking
3. **Validación automática** — las salidas del LLM se validan contra schemas Pydantic
4. **Model-agnostic** — funciona con OpenAI, Anthropic, Gemini, etc.

## ⚠️ Pitfalls

- **No confundir** `run_sync` (bloqueante) con `run` (async)
- **Los tools deben ser funciones síncronas o async** — el framework maneja ambos
- **Las dependencias se inyectan** — no las pases manualmente
- **El output_type es opcional** — si no se define, devuelve str

## Práctica recomendada

1. Empieza con un agente básico (str output)
2. Añade system_prompt para dar contexto
3. Añade tools para funcionalidad externa
4. Añade output_type para estructura garantizada
5. Prueba con diferentes LLMs para comparar
6. Para patrones avanzados (testing, streaming, capabilities), consulta `pydantic-ai-patterns`

## Relación con otros skills

- `pydantic-tools` — profundidad sobre tools y dependency injection
- `pydantic-ai-patterns` — patrones de producción: testing, streaming, capabilities, agent override