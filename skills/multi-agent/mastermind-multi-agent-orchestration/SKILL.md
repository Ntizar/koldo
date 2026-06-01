---
name: mastermind-multi-agent-orchestration
version: "1.0.0"
category: multi-agent
description: Framework de orquestacion multi-agente con separacion documental/ejecutable, decaimiento Ebbinghaus y model routing. Basado en Ntizar Brain Mastermind v3.
tags: [multi-agent, orchestration, mastermind]

---

# Mastermind v3 — Orquestacion Multi-Agente

## Resumen

Framework de orquestacion multi-agente con separacion documental/ejecutable, decaimiento Ebbinghaus y model routing. Basado en Ntizar Brain Mastermind v3.

## Cuando Usar

- Necesitas un sistema multi-agente con memoria persistente
- Quieres separar documentacion de ejecucion para ahorrar tokens
- Buscas un sistema de memoria con decaimiento tipo Ebbinghaus
- Necesitas routing de modelos por tipo de tarea

## Pasos

### 1. Arquitectura de Dos Capas

```
DOCUMENTAL LAYER              EJECUTABLE LAYER
agents/XX-name.md             .opencode/agents/ntizar-XX.md
|                             |
| - Mission completa          | - YAML frontmatter (model, tools)
| - Wikilinks Obsidian        | - Instrucciones operativas minimas
| - Contexto rico             | - Referencia al doc Obsidian
| - Mapa de conexiones        | - Spec de output
| - Legible por humanos       | - Ejecutable por maquina
```

### 2. Reduccion de Tokens

La separacion logro una reduccion del 42% en tokens del layer ejecutable al no duplicar contenido.

### 3. Protocolo de Sincronizacion

1. Modificar el doc Obsidian (fuente de verdad)
2. Actualizar el archivo .opencode/ solo si cambia comportamiento operativo
3. Ambos archivos se referencian entre si para trazabilidad

### 4. Agentes

**Primarios (humano elige al abrir OpenCode):**
- ntizar-build: Trabajo completo (lee + escribe)
- ntizar-plan: Solo lectura

**Subagentes (delegados por orchestrator):**
- ntizar-explorer: Analiza contexto sin modificar
- ntizar-planner: Disena estrategia
- ntizar-spec-writer: Escribe especificaciones
- ... y mas segun complejidad

### 5. Decaimiento Ebbinghaus

```
R(t) = a / (log(t+1))^b + c
```

Los learnings individuales se cargan bajo demanda filtrados por senal de relevancia Y decay R(t) > 0.3.

### 6. Flujos Adaptativos

3 niveles por complejidad:
- Nivel 1: 1-2 agentes
- Nivel 2: 3 agentes
- Nivel 3: 4-5 agentes

## Pitfalls

- No duplicar contenido entre capas documental y ejecutable
- Los wikilinks de Obsidian rompen el parsing YAML de OpenCode
- Mantener los archivos .opencode/ lo mas pequenos posible

## Archivos de Referencia

- NtizarBrainMasterMind: https://github.com/Ntizar/NtizarBrainMasterMind
- AGENTS.md: Guia de uso
- docs/ARCHITECTURE.md: Arquitectura tecnica
- Stack: OpenCode + Obsidian
- License: MIT
