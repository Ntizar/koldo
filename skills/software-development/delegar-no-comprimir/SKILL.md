---
name: delegar-no-comprimir
version: "1.0.0"
description: Patrón para delegar tareas en subagentes en paralelo en vez de hacer compresiones de contexto con secuencias largas de herramientas
tags: [software-development, delegation, subagents, context]

---

# Delegar, no comprimir

## Cuándo delegar
Cuando la tarea implica **3+ archivos independientes** o **3+ cambios en paralelo**:
- Optimización frontend (JS + CSS + HTML)
- Backend + frontend + tests
- Múltiples endpoints de API
- Refactor de módulo con dependencias separadas

## Cuándo NO delegar
- Cambios en 1-2 archivos relacionados
- Tareas cortas (< 5 min de ejecución)
- Depuración interactiva (requiere feedback en tiempo real)
- El usuario pide cambios directos

## Patrón correcto
1. **Explorar** (yo) → identificar archivos afectados
2. **Planificar** (yo) → dividir en subtareas independientes
3. **Delegar** (`delegate_task` con `tasks: [...]`) → 2-3 subagentes en paralelo
4. **Integrar** (yo) → unificar, verificar, commit

## Errores a evitar
- ❌ Compresión de contexto como sustituto de paralelismo
- ❌ Hacer 30+ llamadas de tool en secuencia cuando podrían ser 3 en paralelo
- ❌ Delegar tareas que requieren contexto compartido (el subagente no lo tiene)
- ❌ No delegar cuando los cambios son independientes

## Ejemplo
```
delegate_task({
  tasks: [
    { goal: "Optimizar esios.client.js con batching", toolsets: ["file"] },
    { goal: "Implementar error handling en data.js", toolsets: ["file"] },
    { goal: "Añadir skeleton screens y animaciones CSS", toolsets: ["file"] }
  ]
})
```
