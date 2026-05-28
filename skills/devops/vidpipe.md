---
name: vidpipe-pipeline-video
description: "Patrón de pipeline de procesamiento de vídeo con IA — transcripción, subtítulos karaoke, shorts, y publicación multi-plataforma. Arquitectura de 7 capas con agentes modulares."
version: 2.0.0
author: Ntizar + Koldo
---

# VidPipe — Pipeline de Vídeo con IA

CLI agéntica que convierte grabaciones crudas en contenido listo para redes sociales: shorts, subtítulos karaoke, posts para TikTok/YouTube/Instagram/LinkedIn/X.

## Arquitectura en 7 capas

```
L0: RAW ──── Grabación original (vídeo/audio/pantalla)
L1: TEXT ─── Transcripción (Whisper) + speaker diarization
L2: NER ──── Named Entity Recognition + topics
L3: SHORTS ─ Cortes automáticos por tema
L4: SUBS ─── Subtítulos karaoke (word-level timing)
L5: MEDIA ── Exportación video + thumbnail + captions
L6: POST ─── Publicación multi-plataforma
L7: ANALYTICS — Métricas de rendimiento
```

## Instalación

```bash
npm install -g vidpipe

# Verificar requisitos
vidpipe --doctor
```

## Patrón: Pipeline Completo (de raw a post)

```bash
# Un solo comando
vidpipe compile grabacion.mp4 \
  --output-dir ./contenido \
  --platforms tiktok,youtube,instagram,linkedin,x \
  --shorts-format karaoke \
  --auto-publish

# Layers ejecutados:
# L1 → L2 → L3 → L4 → L5 → L6
```

## Patrón: Extraer solo transcripción

```bash
vidpipe compile grabacion.mp4 --layers L1 --output-format srt,json,txt
# → grabacion.srt (subtítulos)
# → grabacion.json (transcripción palabra por palabra con timestamps)
# → grabacion.txt (texto plano)
```

## Patrón: Crear Shorts automáticos

```bash
# Detecta temas clave y genera shorts independientes
vidpipe compile grabacion.mp4 --layers L3,L4,L5 \
  --shorts-format karaoke \
  --max-shorts 5 \
  --shorts-duration 60 \
  --output-dir ./shorts
```

## Patrón: Publicación programada

```bash
# Publicar en todas las plataformas configuradas
vidpipe publish ./shorts/short-01.mp4 \
  --platforms tiktok,youtube,instagram \
  --title "Mi mejor truco de productividad" \
  --description "Aprende este truco en 60 segundos" \
  --tags productividad,tips,IA \
  --schedule "2026-06-01T10:00:00Z"
```

## Compatibilidad con Hermes

```javascript
// Cron job en Hermes: procesar grabación nueva cada noche
// Script: vidpipe compile /data/raw/$(date +%Y-%m-%d).mp4 --output-dir /data/processed/$(date +%Y-%m-%d)
// Schedule: 0 2 * * * (03:00 Madrid)
// Prompt: "Ejecuta vidpipe en la grabación de ayer y reporta los shorts generados"
```

## Herramientas que usa VidPipe

| Herramienta | Capa | Función |
|-------------|------|---------|
| Whisper (OpenAI) | L1 | Transcripción |
| Gemini (Google) | L2 | NER, topics, resumen |
| FFmpeg | L3-L5 | Corte, renderizado |
| Copilot SDK | L0-L7 | Agentes modulares |

## Buenas prácticas

1. **--doctor primero** — verificar que FFmpeg, Whisper, Gemini están configurados
2. **Shorts de 60s máximo** — TikTok/Reels/Shorts tienen límite
3. **Karaoke format** — subtítulos word-level mejoran retención 40%
4. **Layers por separado** — si L2 falla, L1 ya tiene transcripción útil
5. **Output-dir limpio** — cada ejecución en su propia carpeta

## Pitfalls

- ❌ Sin FFmpeg → falla en L3+ (no detectable hasta ejecución)
- ❌ Audio largo sin diarization → transcripción sin identificar quién habla
- ❌ Publicar sin revisar → contenido crudo con errores
- ❌ Shorts duration > 60s → plataformas rechazan el video

## Referencia

- Repo: https://github.com/htekdev/vidpipe (166⭐)
- Dependencias: FFmpeg, Node.js 18+, claves API (OpenAI, Gemini)
- Skills relacionadas: frontend-tabs-navegacion, testing-jest-mocks-api
