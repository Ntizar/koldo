---
name: pydantic-tools
description: "Sistema de herramientas (tools) en Pydantic AI: definición, inyección de dependencias, y composición de herramientas para agentes"
version: 1.0.0
author: Koldo
tags: [pydantic, ai, tools, dependency-injection, python]
---

# Pydantic AI — Tools y Dependency Injection

## Qué son los Tools

Los tools son funciones que el agente puede llamar para realizar acciones externas (APIs, bases de datos, búsqueda web, etc.). El LLM decide cuándo llamarlos y con qué argumentos.

## Definición de Tools

### Tool básico
```python
from pydantic_ai import Agent

agent = Agent('openai:gpt-4o')

@agent.tool
def sumar(a: int, b: int) -> int:
    """Suma dos números."""
    return a + b

result = agent.run_sync('¿Cuánto es 5 + 3?')
```

### Tool con descripción rica
```python
@agent.tool(
    description='Busca información en la base de datos de usuarios',
    retries=3  # Reintenta hasta 3 veces si falla
)
def buscar_usuario(nombre: str) -> dict:
    """Busca un usuario por nombre."""
    # Lógica de búsqueda
    return {'id': 1, 'nombre': nombre, 'email': f'{nombre}@ejemplo.com'}
```

### Tool async
```python
@agent.tool
async def obtener_datos_api(url: str) -> dict:
    """Obtiene datos de una API externa."""
    import httpx
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()
```

## Dependency Injection

### Deps con dataclass + RunContext (patrón recomendado)
```python
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class AppDeps:
    db: Database
    redis: RedisClient
    config: AppConfig

agent = Agent('openai:gpt-4o', deps_type=AppDeps)

@agent.tool
def buscar_registros(busqueda: str, ctx: RunContext[AppDeps]) -> list:
    """Busca registros en la base de datos."""
    return ctx.deps.db.query(busqueda)

result = agent.run_sync('Busca...', deps=AppDeps(db=Database(...), redis=RedisClient(...), config=AppConfig(...)))
```

**Acceso a deps:** `ctx.deps` (no `Depends()`)
**Acceso al agente:** `ctx.agent` (name, output_type, etc.)
**Preferir async:** las funciones síncronas se ejecutan en thread pool via `run_in_executor`

## Patrones avanzados

### Tools condicionales
```python
@agent.tool(requires_approval=True)
def eliminar_usuario(usuario_id: int):
    """Elimina un usuario (requiere aprobación)."""
    # Esta llamada requerirá aprobación humana
    pass
```

### Tools con validación extra
```python
from pydantic import BaseModel, Field

class BusquedaParams(BaseModel):
    termino: str = Field(min_length=1, max_length=100)
    limite: int = Field(default=10, le=50)

@agent.tool
def buscar(params: BusquedaParams) -> list:
    """Busca con parámetros validados."""
    return [...]
```

## ⚠️ Pitfalls

- **Los tools deben tener type hints** — sin ellos, Pydantic no puede validar argumentos
- **Los nombres de tools se generan** — usa `__name__` o especifica nombre explícito
- **Accede a deps via `ctx.deps`** — no uses `Depends()` en tools de Pydantic AI
- **Preferir `async def`** — las funciones síncronas se ejecutan en thread pool
- **TestModel NO emula native tools** — sobrescribe con `Agent.override()` en tests
- **La docstring del tool** es lo que el LLM ve como descripción — hazla clara y completa

## Práctica recomendada

1. Define tools con descripciones claras y completas
2. Usa type hints en todos los parámetros
3. Inyecta dependencias con `Depends()`
4. Usa `deps_type` para definir el esquema de dependencias
5. Prueba tools individualmente antes de integrarlos en el agente