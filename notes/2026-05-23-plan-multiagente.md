# 🧠 Sistema Multi-Agente — Plan de Implementación

## Visión General
Un ecosistema de agentes de IA independientes, cada uno con un modelo diferente, 
que coexisten en el mismo microVM (o en varias) y son gestionados desde un 
único dashboard central.

Estado actual: 1 agente Hermes + 1 microVM. 
Objetivo: múltiples agentes coordinados desde el dashboard.

---

## Fase 1: Arquitectura base (microVM única)

### 1.1 Clonar Hermes para cada agente
Cada agente necesita:
- Una **instancia separada de Hermes** con su propio `config.yaml`
- Puerto único (ej: 5001, 5002, 5003...)
- Skills, memoria y sesiones aisladas

```
/hermes-home/
├── agent-principal/     → deepseek-v4-flash (puerto 4001)
├── agent-rapido/        → qwen3.6 (puerto 4002)
├── agent-creativo/      → gemma4 (puerto 4003)
└── agent-aux/           → claude-sonnet (puerto 4004)
```

### 1.2 Lanzar agentes como procesos independientes
- Cada agente se ejecuta con `hermes agent start --port <puerto> --config <ruta>`
- Monitorizar con PM2 o systemd para auto-reinicio
- El dashboard hace health checks periódicos a cada puerto

### 1.3 Dashboard como orquestador
El dashboard central (puerto 4000) ya tiene:
- Selector multi-agente en la barra de estado ✅
- Endpoint `/api/agents` ✅

Mejoras necesarias:
- Botón "lanzar/parar agente" desde el dashboard
- LEDs de estado por agente
- Logs en tiempo real de cada agente
- Memoria compartida vs aislada

### 1.4 Comunicación entre agentes
- **Modelo Pub/Sub**: un agente publica resultados, otros se suscriben
- **Pipeline de tareas**: agente A investiga → pasa a B que escribe → C revisa
- Implementación vía HTTP interno (localhost) + cola de mensajes ligera

---

## Fase 2: Asignación de modelos

### Mapa de agentes propuesto
| Agente | Modelo | Rol | Puerto |
|--------|--------|-----|--------|
| ⚡ Flash | deepseek-v4-flash | Rápido, táctico, respuestas cortas | 4001 |
| 🧠 Analítico | qwen3.6 | Razonamiento, análisis profundo | 4002 |
| 🎨 Creativo | gemma4 | Escritura, ideas, lluvia | 4003 |
| 📋 Auxiliar | claude-sonnet | Revisión, código, documentación | 4004 |
| 🗣️ Voz | whisper + kokoro | Entrada/salida por voz | 4005 |

### Cómo configurar cada modelo
- Cada agente tiene su propio `config.yaml`
- Provider: `custom` con `base_url: https://api.nan.builders/v1`
- Cada uno puede tener distintos `toolsets` habilitados

---

## Fase 3: Orquestación y rutinas

### 3.1 Delegación inteligente
El agente principal recibe el mensaje y decide:
- ¿Es una pregunta rápida? → Flash (deepseek)
- ¿Es un problema complejo? → Analítico (qwen)
- ¿Es creativo? → Creativo (gemma)
- ¿Es código/docs? → Auxiliar (claude)

### 3.2 Pipeline de tareas
Ejemplo: "Analiza el mercado y escribe un informe"
1. Analítico investiga datos → genera raw findings
2. Creativo estructura el informe en markdown
3. Auxiliar revisa gramática y formato
4. Principal entrega el resultado

### 3.3 Tareas programadas multi-agente
- Briefing matutino: 1 agente recopila, otro resume, otro entrega
- Watchdog: cada agente monitoriza un aspecto distinto
- Backup colaborativo: un agente empaqueta, otro sube a GitHub

---

## Fase 4: Dashboard avanzado

### 4.1 Panel de control multi-agente
- **Grid de agentes** con cards individuales (modelo, estado, uptime, tokens)
- Botones: start / stop / restart por agente
- Log viewer en vivo (streaming de logs)
- Asignación dinámica de tareas

### 4.2 Métricas comparativas
- Tokens por agente (input/output por modelo)
- Coste estimado real (cada modelo tiene precio distinto)
- Tiempo de respuesta promedio
- Tasa de éxito/error por agente

### 4.3 Mensajería entre agentes
- Panel "Pizarra compartida" (memoria común visible en dashboard)
- Historial de delegaciones: qué agente pidió qué a quién
- Reasignación manual de tareas desde UI

---

## Fase 5: Escalado a múltiples microVMs

### 5.1 Cuándo migrar
Cuando una microVM no dé abasto (CPU/RAM al límite) o queramos 
agentes con GPUs/recursos dedicados.

### 5.2 Comunicación entre microVMs
- NaN.builders permite una URL por microVM
- Comunicación vía HTTP entre las URLs públicas
- O vía tunnels internos si NaN ofrece red privada

### 5.3 Dashboard central como hub
- Un dashboard por microVM, pero uno principal como hub
- Los dashboards secundarios reportan al principal
- Vista unificada con enlaces a cada sub-dashboard

---

## Roadmap temporal

| Paso | Descripción | Dependencias |
|------|-------------|--------------|
| **P1** | Clonar Hermes para 2º agente en mismo microVM | Hermes soporte multi-instancia |
| **P2** | Proxy multi-agente en Express (agentes en /agent-1/, /agent-2/) | P1 |
| **P3** | Selector funcional en dashboard (cambia entre agentes reales) | P2 |
| **P4** | Delegación de tareas entre agentes vía API | P3 |
| **P5** | Pipeline multi-agente (A→B→C) | P4 |
| **P6** | Pizarra compartida + memoria común | P3 |
| **P7** | LEDs de estado + logs en vivo | P2 |
| **P8** | Escalado a 2ª microVM | NaN soporte |

---

## Riesgos y consideraciones
- **Recursos**: 1 VM con 2GB RAM puede tener 2-3 agentes ligeros máximo
- **Latencia**: delegar entre agentes añade latencia (cada llamada = roundtrip API)
- **Coste**: más agentes = más tokens (cada agente tiene su propio contexto)
- **Complejidad**: debuggear un pipeline multi-agente es más difícil que un agente solo

---

## Primera tarea concreta (mañana)
1. Crear 2º agente Hermes con config propio (qwen3.6 en puerto 5001)
2. Añadir proxy en Express: `/agent-2/*` → `localhost:5001`
3. Dashboard: conmutar entre agente 1 y agente 2
4. Probar: mismo mensaje en ambos, comparar respuestas