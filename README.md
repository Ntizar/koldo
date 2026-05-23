# Koldo

> **Mi sistema de agencia personal.** Mi segundo cerebro, mi archivo, mi asistente.
>
> Privado. Versionado. Accesible desde cualquier lado.

---

## ¿Qué es esto?

`Koldo` es el repositorio central de mi sistema de inteligencia operativa. Contiene:

- 🧠 **Mis skills** — procedimientos que he aprendido y guardado para reutilizar
- 📝 **Mis notas** — apuntes, ideas, documentación, planes
- 🔧 **Mis herramientas** — scripts, configuraciones, automatizaciones
- 🗄️ **Mi memoria** — respaldo de lo que he aprendido sobre ti y tu trabajo

Todo está versionado con Git, así que nunca pierdo nada. Cada cambio queda registrado.

## Arquitectura

```
Koldo/
├── README.md              ← Lo que estás leyendo
├── koldo/                 ← Mis skills (SKILL.md) para Hermes
│   ├── agente-principal.md
│   ├── gestor-notas.md
│   └── archivador.md
├── notes/                 ← Notas y apuntes organizados por fecha
│   ├── 2026-05-23-primer-contacto.md
│   └── proyectos/         ← Notas de proyectos activos
├── config/                ← Configuración de mi agente
├── memory/                ← Respaldo de mi memoria persistente
└── scripts/               ← Automatizaciones y herramientas
```

## Mi agente

Estoy corriendo como **Hermes Agent** en una microVM de [NaN.builders](https://nan.builders).

| Componente | Valor |
|---|---|
| Modelo principal | deepseek-v4-flash (284B MoE, 1M contexto) |
| Infraestructura | MicroVM KVM/QEMU, 1 vCPU, 2GB RAM, 20GB disco |
| Plataforma | NaN.builders (inferencia compartida) |
| Acceso | Telegram (desde cualquier lado) |
| Modelo secundarios | qwen3.6, gemma4, qwen3-embedding, kokoro (TTS), whisper (STT) |

## Modelos disponibles en el cluster

| Modelo | Tipo | Contexto | Uso principal |
|---|---|---|---|
| deepseek-v4-flash | LLM 284B MoE | 1M tokens | Razonamiento, tool calling, general |
| qwen3.6 | LLM 35B MoE | 256K tokens | Código, visión, tool calling |
| gemma4 | LLM 26B MoE | 256K tokens | Visión, reasoning |
| qwen3-embedding | Embeddings | 4096 dims | Búsqueda semántica, clasificación |
| kokoro | TTS | — | Texto a voz (67 voces) |
| whisper | STT | — | Voz a texto (~3.2% WER español) |

## Seguridad

- 🔒 Repo **privado** — solo tú y yo tenemos acceso
- 🔑 Token de GitHub guardado en `/root/.env` (no en disco público)
- 📝 Zero logs en el cluster — no guardan prompts ni respuestas
- 🇪🇺 Datos procesados en la UE

## Cómo usar

Me escribes por Telegram con lo que necesites. Yo decido:
1. Qué skill cargar
2. Qué modelo usar
3. Si necesito delegar a subagentes
4. Qué guardar en este repo

No tienes que hacer nada. Solo escribir.

## Proyectos activos

- **NtizarBrainMasterMind** — Sistema multi-agente v3 (OpenCode + Obsidian)
- **Koldo** — Sistema de agencia personal v4 (Hermes + NaN)
- **...**

## Notas

Este repo es vivo. Se actualiza cada vez que aprendemos algo nuevo o trabajamos en algo.

Última actualización: 2026-05-23
