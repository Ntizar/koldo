# Patrón de Orquestación Multi-Agente — Ntizar Mastermind v3

## Resumen

El sistema Ntizar Mastermind v3 es un framework de orquestación multi-agente que funciona sobre OpenCode + Obsidian. Es el proyecto más sofisticado de Ntizar en términos de arquitectura de IA.

## Hallazgos clave

### 1. Dos capas separadas (reducción 42% tokens)
- **Capa documental** (`agents/`) — Markdown con wikilinks, misión completa, contexto rico
- **Capa ejecutable** (`.opencode/agents/`) — YAML mínimo + instrucciones operativas
- Cada `.opencode/` referencia su archivo Obsidian, no duplica contenido

### 2. 11 Agentes especializados con degradación
Cada agente tiene un `nivel_minimo` (alto/medio-alto/medio/bajo) y es `degradable` o no.
Los agentes no degradables (orchestrator, critic) nunca se omiten.

### 3. Memoria con curva de olvido Ebbinghaus
- Fórmula: `R(t) = a / (log(t+1))^b + c`
- 4 tipos de decay: permanente, lento, normal, rápido
- Learning se carga solo si `R(t) > 0.3 AND signal matches`
- Archivado automático cuando `R(t) < 0.2` durante 60+ días

### 4. Librarian con reaprendizaje activo
- Detecta skills con `## Ciclo de reaprendizaje`
- Revisa learnings periódicamente
- Agrega patrones aprendidos directamente al skill

### 5. Decisiones colaborativas obligatorias
Formato estandarizado:
```
DECISIÓN PENDIENTE: [descripción]
Opción A: [descripción + pros/contras]
Opción B: [descripción + pros/contras]
Mi recomendación: [X] porque [1 motivo]
```

### 6. Flujo adaptativo por complejidad
- Simple (1-2): 4 agentes
- Medio (3): 7 agentes
- Complejo (4-5): 9 agentes

### 7. Regla de "PASS SIN HALLAZGOS"
Todos los agentes del flujo deben emitir output. Si no tienen trabajo, dicen explícitamente "PASS SIN HALLAZGOS" con motivo.

## Aplicabilidad a Koldo

Este patrón es directamente reutilizable para el sistema Koldo:
1. La separación documental/ejecutable puede aplicarse a los agentes de Koldo
2. El sistema de decay Ebbinghaus puede mejorar la memoria de Koldo
3. El Librarian con reaprendizaje activo es un patrón para mantener skills actualizados
4. El formato de "DECISIÓN PENDIENTE" puede usarse en Koldo para decisiones importantes
5. La regla "PASS SIN HALLAZGOS" mejora la transparencia del sistema

## Archivos de referencia

- `agents/00-orchestrator.md` — Coordinador del sistema
- `agents/07-critic.md` — Revisión adversarial
- `agents/09-archiver.md` — Destilación de aprendizaje
- `agents/10-librarian.md` — Mantenimiento del sistema
- `AGENTS.md` — Mapa operativo
- `docs/ARCHITECTURE.md` — Deep dive técnico
- `agents/learnings/` — 47+ aprendizajes con fechas
