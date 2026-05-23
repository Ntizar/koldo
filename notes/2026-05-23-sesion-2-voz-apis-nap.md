# Sesión 2 — Voz, APIs, NAP y seguridad

**Fecha:** 2026-05-23  
**Duración:** ~3h  
**Modelo:** deepseek-v4-flash  
**Tags:** `audio`, `stt`, `tts`, `seguridad`, `nap`, `apis`, `despliegue`

---

## 🎤 Audio bidireccional (STT + TTS)

### STT (escucharte)
- Proveedor: **faster-whisper** (local, gratis, sin API key)
- Modelo: **tiny** (39MB, int8, carga en 2.6s)
- Configurado en `config.yaml` → `stt.provider: local`

### TTS (responderte)
- Proveedor: **Edge TTS** (gratis, sin API key)
- Voz actual: **es-ES-AlvaroNeural** (masculino, España)
- Voces probadas: Elvira (femenina) → Jorge (MX) → Álvaro (ES)
- Solo responde en audio cuando se pide explícitamente

### Lecciones aprendidas
- El gateway (PID 1) cachea módulos Python al arranque → instalar `faster-whisper` ANTES de iniciar
- `_HAS_FASTER_WHISPER` se evalúa UNA vez en `transcription_tools.py:73`
- Para cambios: reiniciar gateway con `kill -TERM 1` (Kubernetes lo revive)
- El reinicio resetea `config.yaml` a valores mínimos → restaurar secciones STT/TTS

---

## 🔐 Seguridad y APIs

### APIs guardadas en `/root/.env`
```env
GITHUB_TOKEN=***          # scope repo, clásico PAT
ESIOS_API_TOKEN=***       # Red Eléctrica España
```

### Pendiente
- Migrar ambas a NaN Cloud Env tab (persistente entre reinicios)
- El usuario debe entrar en cloud.nan.builders > microVM > Env

### API ESIOS
- Para proyectos de datos eléctricos (precios, demanda, generación)
- Documentación: https://api.esios.ree.es/

---

## 🗺️ NAP Dashboard

### Estado actual
- Repo: `Ntizar/nap-dashboard` (público)
- Stack: React + Vite + TypeScript + Tailwind + Leaflet + Recharts
- API proxy a `https://nap.transportes.gob.es/api` con `NAP_API_KEY`
- Hoy en Vercel (Edge Functions)
- Clonado en `/persist/nap-dashboard/`

### Despliegue NaN
- Servidor Express creado: `server.cjs` (puerto 3000)
  - Sirve frontend estático (`dist/`)
  - Proxy `/api/nap/*` → `nap.transportes.gob.es/api`
  - Inyecta `NAP_API_KEY` del environment
- Build completado (`npm run build` en 12s)
- Pendiente: configurar HTTP Exposure en NaN dashboard

### Pasos que debe dar el usuario
1. Entrar en cloud.nan.builders
2. Pestaña HTTP Exposure → puerto 3000 → `nap.apps.nan.builders`
3. Pestaña Env → añadir `NAP_API_KEY`
4. Arrancar el servidor

---

## 🧠 Hermes — cómo funciona y dónde están los datos

### Arquitectura
- **Gateway** (PID 1) → gestiona plataformas (Telegram, etc.)
- **Agente** → sesión por conversación con contexto comprimido
- **Herramientas** → terminal, archivos, web, delegación, cron
- **Memoria** → SQLite (`state.db`) + archivos markdown
- **Skills** → procedimientos reutilizables en `/hermes-home/skills/`

### Flujo de datos
```
Usuario → Telegram → Gateway → LLM (deepseek-v4-flash en NaN cluster) → Gateway → Usuario
                              ↕
                        Herramientas (terminal, archivos, etc.)
```

### Dónde vive todo
| Dato | Ubicación | Acceso |
|------|-----------|--------|
| Conversaciones | `/hermes-home/sessions/` | Solo root |
| Memoria persistente | `state.db` (SQLite) | Solo root |
| Config | `/hermes-home/config.yaml` | Solo root |
| Skills | `/hermes-home/skills/` | Solo root |
| APIs | `/root/.env` (+ NaN Env) | Solo root |
| Repo Koldo | `/root/koldo-repo/` (y GitHub privado) | Root + usuario GitHub |
| NAP Dashboard | `/persist/nap-dashboard/` | Solo root |

### Privacidad
- NaN.builders: **zero logs policy** — no guardan prompts ni respuestas
- Datos procesados en **UE**
- faster-whisper es **100% local** — tus audios nunca salen del servidor
- Edge TTS llama a servidores Microsoft solo para generar el audio (sin enviar tu identidad)

---

## ⚙️ Skills creadas (en Koldo repo)

| Skill | Descripción |
|-------|-------------|
| `koldo/voice-setup` | Configuración STT/TTS para audio bidireccional |
| `koldo/secure-api-storage` | Gestión segura de API keys |
| `koldo/nap-deploy` | Despliegue de web apps en NaN.builders |

---

## 📋 Pendiente para próxima sesión
1. Usuario entra en NaN Cloud Env y migra las 3 API keys (GITHUB_TOKEN, ESIOS_API_TOKEN, NAP_API_KEY)
2. Configurar HTTP Exposure para NAP
3. Arrancar el servidor NAP de forma persistente
4. Plan Semana 1: Git básico
5. Migrar skills del mastermind antiguo a Hermes