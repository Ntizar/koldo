---
name: pydantic-ai
description: "10 Skills de programación fundamentales extraídas de Pydantic AI docs — type-safe, dependency injection, structured outputs, tools, testing, streaming, model-agnostic. Aplicables a cualquier proyecto Python."
version: 1.0.0
author: Koldo
tags: [pydantic, ai, python, typing, testing, structured-output, tools, streaming]
---

# Pydantic AI — 10 Skills de Programación Fundamentales

Skills de programación extraídas de la documentación oficial de Pydantic AI (https://pydantic.dev/docs/ai/overview/) aplicables a cualquier proyecto Python.

---

## 1. Type-Safe by Design

Usa type hints de Python extensivamente. Mueve errores de runtime a write-time. Si "compila" (type checks), funciona.

## 2. Dependency Injection con Dataclasses

Usa `dataclass` para contenedores de dependencias y `RunContext[DepsType]` como primer parámetro en tools e instructions.

## 3. Structured Outputs con BaseModel

Fuerza al LLM a devolver datos estructurados usando `pydantic.BaseModel` como `output_type`. Cada campo con `Field(description=...)` y validaciones.

## 4. Function Tools

El "R" de RAG. `@agent.tool` (con contexto) y `@agent.tool_plain` (sin contexto). La docstring se usa como descripción para el LLM.

## 5. Dynamic Instructions

`@agent.instructions` como decorador para inyectar contexto dinámico en tiempo de ejecución (BD, API, etc.).

## 6. Composable Capabilities

Bundles reutilizables de tools, hooks, instructions y model settings. `Thinking()`, `WebSearch()`, MCP, etc.

## 7. TestModel/FunctionModel

Tests sin llamadas LLM reales. `TestModel` genera datos automáticos basados en el schema. `FunctionModel` para lógica custom.

## 8. Agent Override

`agent.override(model=TestModel(), deps=TestDeps())` para inyectar dependencias y modelos en runtime sin modificar el agente.

## 9. Streaming con Validación en Tiempo Real

`run_stream()` para outputs estructurados con validación inmediata. Acceso en tiempo real a datos generados.

## 10. Model-Agnostic

20+ proveedores soportados (OpenAI, Anthropic, Gemini, Ollama...). Solo cambias la cadena `'provider:model-name'`.

---

## Referencias

- `references/pydantic-10-skills.md` — Referencia rápida con ejemplos de código
- `/root/workspace/nan-dashboard/pydantic-ai-skills.md` — Documento completo con explicaciones detalladas