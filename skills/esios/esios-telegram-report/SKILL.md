---
name: esios-telegram-report
description: "Generar informe diario del mercado eléctrico español con gráficos Canvas/PNG y análisis automático vía Telegram — script esios-telegram.js."
version: 1.1.0
author: Ntizar
tags: [esios, telegram, cron, informe]

---

# Informe Diario ESIOS — Telegram con Gráficos

## Qué envía

1. **Texto resumen** con análisis automático del día (precios, demanda, renovables, CO2, interconexiones)
2. **5 gráficos PNG** generados con Canvas:
   - 💰 Precio PVPC horario
   - ⚡ Demanda real horaria
   - ☀️ Solar FV vs Demanda (comparativo)
   - 🔌 Interconexiones netas (Francia + Portugal, con negativos)
   - 🌍 CO₂ asociado a generación

## Estructura del script

`scripts/esios-telegram.js` — Node.js puro + canvas npm

### Dependencias
- `canvas` — generación de imágenes PNG
- `https` — llamadas API (sin dependencias externas)

### Variables de entorno
- `TELEGRAM_BOT_TOKEN` — token del bot
- `TELEGRAM_CHAT_ID` — chat de destino
- `ESIOS_API_TOKEN` — token ESIOS/REE

### Uso
```bash
node scripts/esios-telegram.js [YYYY-MM-DD]
# Sin fecha = ayer automáticamente
```

## Gráficos

Todos usan `drawLineChart()` con:
- Fondo oscuro `#0f172a`
- Líneas con relleno semitransparente
- Puntos en cada hora
- Ejes con valores formateados
- Leyenda inferior
- Estilo ESIOS dashboard (azul #2563eb, naranja #f97316)

### Opciones de drawLineChart
```javascript
drawLineChart(title, datasets, unit, { stacked: false, showZero: true })
```
- `stacked: true` — apilado (no se usa actualmente)
- `showZero: true` — línea de cero punteada para datos negativos

## Análisis automático

La función `analyzeDay()` calcula:
- Si precios fueron altos (>150), moderados (>100) o bajos
- Pico/valle de precios con hora
- Diferencia pico-valle
- Demanda media/máx/mín con horas
- % renovable sobre total
- Factor de emisión CO₂
- Balance neto exportación/importación
- Horas exportando de cada país

## Cron job

```yaml
job_id: 9e7570152a99
name: esios-daily-telegram
schedule: 0 9 * * *  (09:00 UTC = 11:00 Madrid verano / 10:00 invierno)
prompt: Ejecuta el script de resumen diario ESIOS: node /root/workspace/Koldo/scripts/esios-telegram.js
```

## Pitfalls

- **NUNCA usar IDs de generación medida por tecnología** (10035-10043) — devuelven null
- **Interconexiones son MWh/periodo** — dividir entre 1000 para MW
- **Solar medida (10205) es MW directo** — NO dividir
- **Valores negativos en interconexiones** = importación, mostrar línea de cero
- **El script usa `canvas` npm** — requiere instalación previa `npm install canvas`
- **Cache en /tmp/esios-telegram-cache/** — se limpia tras envío
- **Cron jobs no heredan variables del gateway** — el script lee `TELEGRAM_BOT_TOKEN` de `/proc/1/environ` y `TELEGRAM_CHAT_ID` de `/hermes-home/.env` como fallback

## Formateo de unidades de potencia

- **NUNCA usar "k MW"** (ej: "30k MW" es incorrecto).
- Valores >= 1000 MW → mostrar en **GW** (ej: "30.0 GW").
- Valores < 1000 MW → mostrar en **MW** (ej: "500 MW").
- Función `fmtMW()` en el script implementa esta lógica: convierte automáticamente a GW cuando corresponde.
- En textos y captions, la función devuelve la unidad incluida ("30.0 GW" o "500 MW"), por lo que NO añadir "MW" manualmente después.

## Archivos del proyecto

- `scripts/esios-telegram.js` — script principal
- `data/esios-reference.json` — mapeo IDs útiles
- `data/esios-indicator-index.md` — índice robusto con unidades
- `data/all-esios-indicators.json` — todos los indicadores ESIOS