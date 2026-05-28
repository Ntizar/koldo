---
name: nan-deploy-guide
description: "Guía completa de inicio en NaN.builders: crear agente, conectar Telegram, configurar STT/TTS, variables de entorno, y mejores prácticas."
version: "1.0.0"
category: devops
---

# NaN.builders Deployment Guide

Guía paso a paso de Ntizar para configurar un agente IA con voz y conexión a Telegram.

## Arquitectura

```
NaN.builders MicroVM (1vCPU/2GB/20GB)
  -> Hermes Agent (Python CLI)
  -> Telegram Bot (frontend móvil)
  -> STT (faster-whisper local)
  -> TTS (Edge AI / ElevenLabs)
  -> API keys (env vars)
```

## Paso a Paso

### 1. Registro y Plan

1. Ir a `nan.builders` → Plans/Pricing
2. Elegir plan **NaN Member** (incluye agente)
3. Pagar con tarjeta → email con enlace al dashboard
4. Dashboard: `cloud.nan.builders/dashboard`

### 2. Crear Agente

1. Botón **New Agent** / **Create**
2. Nombre: `mi-asistente`
3. Región: **EU** (datos en Europa)
4. Deploy → esperar a **Running** (círculo verde)

### 3. Consola

- Pestaña **Console** en el panel del agente
- Terminal Linux con acceso root
- Si se congela: cerrar pestaña y reabrir

### 4. Telegram Bot

1. Telegram → buscar **@BotFather**
2. `/newbot` → nombre → username (debe terminar en `bot`)
3. Copiar el **token** (cadena larga)
4. En NaN: pestaña **Env** → `TELEGRAM_BOT_TOKEN` → pegar token
5. **Restart** del agente
6. Probar: escribir `Hola` en Telegram

### 5. Voz (STT + TTS)

```bash
source /opt/hermes/.venv/bin/activate
uv pip install faster-whisper
```

- STT: faster-whisper (local, sin API)
- TTS: Edge AI / ElevenLabs (configurable en config.yaml)

### 6. Variables de Entorno

NUNCA en código. Siempre en pestaña **Env**:

| Variable | Uso |
|----------|-----|
| `TELEGRAM_BOT_TOKEN` | Token de BotFather |
| `MI_API_KEY` | APIs externas |
| `ESIOS_TOKEN` | API ESIOS/REE |
| `OPENROUTER_API_KEY` | OpenRouter models |

### 7. Seguridad

- ❌ No compartir token del bot
- ❌ No meter claves en código
- ❌ No poner passwords en repos públicos
- ❌ No hacer `rm -rf /`

## Stack Típico

| Componente | Tecnología |
|------------|-----------|
| Runtime | Linux MicroVM (1vCPU/2GB) |
| Agent | Hermes Agent (Python) |
| Frontend | Telegram Bot |
| STT | faster-whisper (local) |
| TTS | Edge AI / ElevenLabs |
| Modelos | qwen3.6 vía NaN.builders |
| Base URL | `api.nan.builders/v1` |

## URLs

- Dashboard: `cloud.nan.builders/dashboard`
- API: `api.nan.builders/v1`
- Web: `nan.builders`

## Aplicación práctica

Para cualquier nuevo agente en NaN:
1. Seguir estos pasos como checklist
2. Configurar Telegram primero (frontend principal)
3. Añadir STT local para voz
4. Variables de entorno SIEMPRE en pestaña Env
5. Reiniciar después de cada cambio de config
