# Guía Completa de Hermes — Tu Segundo Cerebro Operativo

> **Fecha:** 2026-05-25
> **Autor:** Koldo (tu agente)
> **Estado:** Referencia principal

---

## 🧠 ¿Qué es Hermes?

Hermes es un **agente de IA operativo** que funciona como tu cerebro externo. No es un chatbot pasivo — es un sistema que:

1. **Piensa** (modelo de lenguaje con razonamiento)
2. **Actúa** (terminal, navegador, archivos, APIs, cron jobs)
3. **Aprende** (memoria persistente, skills, notas en Koldo)
4. **Automatiza** (cron jobs, webhook, kanban)
5. **Habla** (TTS con voz de Álvaro, STT con faster-whisper)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   Tu cerebro                     │
│              (Tú — Ntizar)                       │
└──────────┬───────────────────────────────┬──────┘
           │                               │
           ▼                               ▼
┌─────────────────────┐        ┌─────────────────────────┐
│  Hermes Gateway     │        │  GitHub (Koldo Repo)    │
│  Puerto 8787        │        │  Backup + Skills + Notas│
│  WebUI + CLI        │        │  Auto-sync diario 09:00 │
└──────────┬──────────┘        └─────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│                    Capa de Modelos                        │
│  Principal: qwen3.6 (NaN)                                │
│  Fallback: deepseek-v4-flash (284B MoE)                  │
│  Token limit: INFINITO (NaN no tiene límites)            │
└──────────────────────────────────────────────────────────┘
           │
    ┌──────┼──────────────┬──────────────┬──────────────┐
    ▼      ▼              ▼              ▼              ▼
 Terminal  Browser       Memory        Skills        Cron
 (código) (web)        (persistente)  (reutilizables) (automatización)
```

---

## 🎯 Lo que puedes hacer con Hermes

### 1. 💻 Programación y desarrollo

**Escribe código directamente:**
- Python, JavaScript, TypeScript, Bash, Go, Rust, etc.
- Crea scripts, APIs, dashboards, herramientas CLI
- Usa `execute_code` para ejecutar Python con lógica compleja
- Usa `terminal` para cualquier comando de shell

**Gestiona repositorios:**
- Git completo: clone, commit, push, branch, merge
- GitHub CLI (`gh`): PRs, issues, reviews, releases
- El repo Koldo (`/root/workspace/Koldo`) es tu repositorio personal

**Delega en subagentes:**
- `delegate_task` para tareas complejas en paralelo
- Cada subagente tiene su propio terminal y contexto
- Máximo 3 en paralelo, profundidad 1

### 2. 🌐 Navegación web

**Navega y extrae información:**
- `browser_navigate` → abre cualquier URL
- `browser_snapshot` → lee el contenido de la página
- `browser_click` → interactúa con botones y enlaces
- `browser_type` → rellena formularios
- `browser_vision` → ve capturas de pantalla con IA visual
- `browser_console` → lee errores JS y estado de la página

**Casos de uso:**
- Ver dashboards (como el nan dashboard en puerto 3500)
- Monitorizar APIs y servicios
- Extraer datos de páginas web
- Automatizar tareas web repetitivas

### 3. 📁 Gestión de archivos

**Lee y escribe archivos:**
- `read_file` → lee con numeración de líneas
- `write_file` → escribe archivos nuevos o sobreescribe
- `patch` → ediciones targetizadas (find & replace inteligente)
- `search_files` → busca contenido con regex o encuentra archivos

**Ejemplos:**
```
"Koldo, lee mi config de Hermes" → read_file /hermes-home/config.yaml
"Koldo, crea un script que..." → write_file + terminal
"Koldo, busca todas las referencias a X" → search_files
```

### 4. 🧠 Memoria y aprendizaje

**Tienes 3 capas de conocimiento:**

| Capa | Dónde | Qué contiene |
|------|-------|-------------|
| **Memoria Hermes** | En tu sesión | Preferencias, datos de entorno, lecciones |
| **Skills** | `/hermes-home/skills/` + Koldo/koldo/ | Procedimientos reutilizables |
| **Repo Koldo** | GitHub → `/root/workspace/Koldo` | Notas, skills personales, config, scripts |

**Cómo funciona la memoria:**
- Se guarda automáticamente en sesiones largas
- Se inyecta en cada nueva sesión (hasta ~2200 chars)
- Guarda preferencias, datos de entorno, lecciones aprendidas
- NO guarda: progreso de tareas, PRs, commits (se estropean)

**Skills instalados (tu biblioteca de procedimientos):**
- `hermes-agent` — Configurar y usar Hermes
- `koldo-setup` — Gestionar tu sistema Koldo
- `github-pr-workflow` — PRs, commits, CI/CD
- `github-issues` — Issues de GitHub
- `subagent-driven-development` — Desarrollo con subagentes
- `writing-plans` — Planes de implementación
- `systematic-debugging` — Debugging metódico
- `test-driven-development` — TDD
- `jupyter-live-kernel` — Python interactivo
- `huggingface-hub` — Modelos ML
- `llama-cpp` — Inferencia local GGUF
- `spotify` — Control de Spotify
- `tts-setup` — Configuración de voz
- Y muchos más...

### 5. ⏰ Automatización con Cron

**Cron jobs** = tareas programadas que se ejecutan solas:

```
Job actual: cf21b05773aa (koldo-autoconfig)
- Se ejecuta: diario a 09:00 UTC
- Qué hace: git pull + copia skills + push
- Modelo: usa tu modelo por defecto
```

**Crear un cron job:**
```
"Koldo, crea un cron que cada 6h revise el estado de mis servicios"
"Koldo, programa un reporte diario a las 08:00 UTC"
"Koldo, cada día a las 20:00 haz un resumen de lo que hicimos"
```

**Tipos de cron:**
- **Agent-driven** (default): Un agente piensa y ejecuta cada tick
- **Script-only** (no_agent=true): Ejecuta un script y entrega su output directamente
- **One-shot**: Se ejecuta una vez
- **Recurring**: Se repite indefinidamente o N veces

### 6. 🗣️ Voz (TTS/STT)

**Text-to-Speech (TTS):**
- Provider: Edge TTS
- Voz: es-ES-AlvaroNeural (Álvaro)
- Se usa con `text_to_speech`
- El audio se entrega como attachment nativo

**Speech-to-Text (STT):**
- Provider: local (faster-whisper)
- Modelo: base
- Habilitado en config

**Casos de uso:**
- "Koldo, léelo en voz alta" → text_to_speech
- Resúmenes auditivos
- Notificaciones por voz

### 7. 📊 Kanban

**Gestión de tareas con tablero kanban:**
- `kanban.db` almacena el estado
- Los subagentes pueden actualizar el kanban
- Ideal para proyectos multi-tarea

### 8. 🔌 Mensajería

Conectado a múltiples plataformas:
- **Telegram** — chats y grupos
- **Discord** — canales, hilos, DMs
- **Slack** — canales
- **Signal** — contactos
- **Matrix** — rooms
- **WhatsApp** — chats
- **Yuanbao** — grupos y DMs

Cada plataforma tiene su propio canal por defecto y permite targeting específico.

---

## 🚀 Cómo sacarle partido con tokens infinitos

### Ventaja principal: NO te preocupes por el contexto

Con NaN no hay límite de tokens. Esto cambia todo:

#### 1. **Análisis profundo de código**
```
"Koldo, lee TODO mi proyecto y dime la arquitectura completa"
"Koldo, analiza cada archivo de /root/workspace/mi-proyecto"
"Koldo, haz un code review completo del PR #42"
```
Puedes pedir que lea **todos** los archivos, no solo los relevantes.

#### 2. **Investigación exhaustiva**
```
"Koldo, investiga X y dame un informe de 10 páginas"
"Koldo, busca en TODAS mis sesiones pasadas sobre Y"
"Koldo, compara las 5 mejores soluciones para Z"
```

#### 3. **Generación de documentación completa**
```
"Koldo, genera la documentación completa de este proyecto"
"Koldo, crea un README.md profesional con arquitectura, API, deploy"
"Koldo, genera todos los diagramas de arquitectura en Excalidraw"
```

#### 4. **Desarrollo a gran escala**
```
"Koldo, crea un dashboard completo con React + Express + base de datos"
"Koldo, migra este proyecto de JS a TypeScript con tests"
"Koldo, implementa autenticación OAuth2 con Google y GitHub"
```

#### 5. **Múltiples subagentes en paralelo**
```
"Koldo, haz 3 cosas en paralelo:
  1. Analiza el código del backend
  2. Revisa la documentación
  3. Crea los tests"
```

#### 6. **Automatización compleja con cron**
```
"Koldo, cada hora revisa mis métricas de GitHub y avísame"
"Koldo, cada día a las 09:00 genera un resumen de mi productividad"
"Koldo, cada 30 min monitoriza el estado de mis servicios"
```

---

## 📋 Comandos útiles de Hermes

### En la WebUI (puerto 8787)
- `/reset` — Nueva sesión (limpia contexto)
- `/status` — Estado del sistema
- `/help` — Ayuda

### En el terminal
- `hermes config get` — Ver configuración
- `hermes config set` — Modificar configuración
- `hermes tools` — Listar herramientas disponibles
- `hermes skills list` — Listar skills
- `hermes sessions list` — Ver sesiones

### Comandos que puedes pedirme directamente
- "Koldo, guarda esto" → crea nota + push a GitHub
- "Koldo, qué proyectos tengo" → lista notas de proyectos
- "Koldo, date un repaso" → lee README + skills + notas recientes
- "Koldo, haz un backup" → commit + push a Koldo repo
- "Koldo, qué skills tengo" → lista skills instalados
- "Koldo, busca en mis sesiones pasadas sobre X" → session_search

---

## 🎮 Ejemplos prácticos de uso

### Ejemplo 1: Crear un proyecto completo
```
"Koldo, crea un dashboard de control para mis servicios:
 - Frontend en React con tema oscuro
 - Backend en Express con API REST
 - Monitoriza los puertos 3000, 3500, 8787
 - Muestra estado de cada servicio
 - Despliega en NaN"
```

### Ejemplo 2: Analizar tu infraestructura
```
"Koldo, haz un inventario completo de:
 - Todos los servicios corriendo (ps aux, netstat)
 - Configuraciones en /hermes-home/
 - Skills instalados
 - Cron jobs activos
 - Estado del repo Koldo"
```

### Ejemplo 3: Automatización diaria
```
"Koldo, crea un cron job que cada mañana a las 09:00:
 1. Haga git pull del Koldo repo
 2. Revise si hay nuevos skills en GitHub
 3. Genere un resumen de lo que pasó ayer
 4. Me lo entregue por Telegram"
```

### Ejemplo 4: Investigación con subagentes
```
"Koldo, investiga 3 opciones para mejorar mi infraestructura:
 1. Subagente A: Analiza opciones de monitoring
 2. Subagente B: Analiza opciones de CI/CD
 3. Subagente C: Analiza opciones de deployment
 Luego sintetiza los resultados en un informe"
```

### Ejemplo 5: Gestión del repo Koldo
```
"Koldo, haz commit de todas las notas nuevas y push a GitHub"
"Koldo, crea una carpeta para el proyecto X en notes/proyectos/"
"Koldo, busca todas las notas que hablan de 'dashboard'"
```

---

## 🔧 Configuración actual

| Componente | Valor |
|-----------|-------|
| **Modelo principal** | qwen3.6 (custom provider, NaN) |
| **Fallback** | deepseek-v4-flash (284B MoE) |
| **API Base** | https://api.nan.builders/v1 |
| **Infraestructura** | MicroVM KVM/QEMU, 1 vCPU, 2GB RAM, 20GB disco |
| **Hermes** | /hermes-home/ (config.yaml, state.db) |
| **WebUI** | Puerto 8787 |
| **TTS** | Edge TTS, es-ES-AlvaroNeural (Álvaro) |
| **STT** | faster-whisper (local, base) |
| **GitHub** | gh CLI autenticado como Ntizar |
| **Repo Koldo** | /root/workspace/Koldo (sync diario 09:00 UTC) |
| **Skills externos** | /root/workspace/Koldo/koldo |
| **Cron autoconfig** | cf21b05773aa (diario 09:00 UTC) |

---

## ⚠️ Limitaciones y precauciones

1. **Nunca borres repos** — solo crea y modifica archivos
2. **No guardes secretos en notas** — usa variables de entorno
3. **El nan dashboard está caído** (502) — puede ser temporal
4. **Hermes no detecta cambios de config mid-session** — usa `/reset`
5. **Los subagentes no tienen contexto de la conversación** — pasa toda la info necesaria
6. **Cron jobs corren sin contexto del chat** — el prompt debe ser autocontenido

---

## 📚 Recursos adicionales

- **Docs de Hermes:** https://hermes-agent.nousresearch.com/docs
- **Model Catalog:** https://hermes-agent.nousresearch.com/docs/api/model-catalog.json
- **Repo Koldo:** https://github.com/Ntizar/Koldo
- **Skills disponibles:** Lista completa en el skill list

---

*Esta guía se actualiza automáticamente. Cada sesión importante genera una nota en Koldo/notes/*.
