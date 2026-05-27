#!/usr/bin/env node
/**
 * esios-telegram.js — Resumen diario del mercado eléctrico español vía Telegram
 * Genera imágenes de gráficos horarios y las envía como fotos.
 *
 * Variables de entorno:
 *   TELEGRAM_BOT_TOKEN  — Token del bot de Telegram
 *   TELEGRAM_CHAT_ID    — Chat ID de destino
 *   ESIOS_API_TOKEN     — Token API de ESIOS/REE (también acepta ESIOS_API)
 *
 * Fuentes de verdad: data/esios-reference.json + data/esios-indicator-index.md
 *
 * Uso:
 *   node esios-telegram.js [YYYY-MM-DD]
 *   Si no se pasa fecha, usa ayer.
 */

const https = require('https');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// ─── Configuración ───────────────────────────────────────────────
const ESIOS_BASE = 'https://api.esios.ree.es';
const TELEGRAM_API = 'https://api.telegram.org';
const CACHE_DIR = '/tmp/esios-telegram-cache';

function getEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Faltan ${key} o TELEGRAM_CHAT_ID`);
  return val;
}

const BOT_TOKEN = getEnv('TELEGRAM_BOT_TOKEN');
const CHAT_ID = getEnv('TELEGRAM_CHAT_ID');
const ESIOS_TOKEN = process.env.ESIOS_API_TOKEN || process.env.ESIOS_API;
if (!ESIOS_TOKEN) throw new Error('Falta ESIOS_API_TOKEN o ESIOS_API');

// ─── Fecha ───────────────────────────────────────────────────────
function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const TARGET_DATE = process.argv[2] || getYesterdayStr();

// ─── Mapa de indicadores con unidades correctas ──────────────────
const INDICATORS = [
  { name: 'precios',           id: 1001,  unit: 'price_eur_mwh' },
  { name: 'demanda',           id: 1293,  unit: 'power_mw' },
  { name: 'eolica',            id: 10037, unit: 'energy_mwh' },
  { name: 'solar',             id: 10205, unit: 'power_mw' },
  { name: 'hidrica',           id: 10035, unit: 'energy_mwh' },
  { name: 'carbon',            id: 10036, unit: 'energy_mwh' },
  { name: 'cogeneracion',      id: 10039, unit: 'energy_mwh' },
  { name: 'otrasRen',          id: 10041, unit: 'energy_mwh' },
  { name: 'genTotal',          id: 10043, unit: 'energy_mwh' },
  { name: 'genRenReal',        id: 10351, unit: 'power_mw' },
  { name: 'genNoRenReal',      id: 10352, unit: 'power_mw' },
  { name: 'co2Libre',          id: 10006, unit: 'power_mw' },
  { name: 'co2Ratio',          id: 10355, unit: 'emissions_tco2_per_h' },
  { name: 'demandaPrev',       id: 2052,  unit: 'power_mw' },
  { name: 'eolicaPrev',        id: 1777,  unit: 'power_mw' },
  { name: 'solarPrev',         id: 1779,  unit: 'power_mw' },
  { name: 'renovablePrev',     id: 10358, unit: 'power_mw' },
  { name: 'interFR',           id: 10207, unit: 'energy_mwh' },
  { name: 'interPT',           id: 10208, unit: 'energy_mwh' },
];

const TO_MW_INDICATORS = new Set(['energy_mwh']);

// ─── Helpers HTTP ────────────────────────────────────────────────
function esiosFetch(path) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      `${ESIOS_BASE}${path}`,
      { headers: { 'x-api-key': ESIOS_TOKEN } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 429) {
            setTimeout(() => resolve(esiosFetch(path)), 2000);
            return;
          }
          if (res.statusCode >= 400) {
            reject(new Error(`ESIOS ${res.statusCode}: ${data}`));
            return;
          }
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Parse error: ${data}`)); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout ESIOS')); });
    req.end();
  });
}

function fetchIndicator(id, dateStr) {
  const start = `${dateStr}T00:00:00+02:00`;
  const end = `${dateStr}T23:59:59+02:00`;
  return esiosFetch(`/indicators/${id}?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&time_trunc=hour`);
}

function parseValues(resp, unit) {
  if (!resp || !resp.indicator || !resp.indicator.values) return [];
  const toMw = TO_MW_INDICATORS.has(unit);
  return resp.indicator.values.map(v => {
    let val = v.value == null ? null : Number(v.value);
    if (val != null && toMw) val = val / 1000;
    const dt = new Date(v.datetime || v.datetime_local || v.tz_time);
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', hourCycle: 'h23',
    }).formatToParts(dt);
    const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));
    return { hora: parseInt(obj.hour), valor: val };
  }).sort((a, b) => a.hora - b.hora);
}

function avg(values) {
  const nums = values.map(v => v.valor).filter(v => v != null);
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function max(values) {
  const nums = values.map(v => v.valor).filter(v => v != null);
  if (!nums.length) return null;
  return Math.max(...nums);
}

function min(values) {
  const nums = values.map(v => v.valor).filter(v => v != null);
  if (!nums.length) return null;
  return Math.min(...nums);
}

function fmt(n) {
  if (n == null) return '—';
  return n.toFixed(2);
}

function fmtShort(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toFixed(0);
}

// ─── Generación de gráficos con Canvas ───────────────────────────
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function cleanCache() {
  if (fs.existsSync(CACHE_DIR)) {
    fs.readdirSync(CACHE_DIR).forEach(f => {
      if (f.startsWith('chart-')) fs.unlinkSync(path.join(CACHE_DIR, f));
    });
  }
}

/**
 * Dibuja un gráfico de líneas estilo ESIOS dashboard
 * @param {string} title - Título del gráfico
 * @param {Array<{name: string, color: string, data: Array<{hora: number, valor: number|null}>}>} datasets - Datasets
 * @param {string} unit - Unidad (MW, €/MWh, tCO2/h)
 * @param {boolean} stacked - Si es apilado
 */
function drawChart(title, datasets, unit, stacked = false) {
  const W = 800;
  const H = 380;
  const PAD = { top: 50, right: 30, bottom: 50, left: 70 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Título
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, PAD.left, 30);

  // Calcular rango Y
  let allValues = [];
  datasets.forEach(ds => {
    ds.data.forEach(d => {
      if (d.valor != null) {
        if (stacked) {
          // Para apilado, acumular
        } else {
          allValues.push(d.valor);
        }
      }
    });
  });

  if (stacked) {
    // Calcular totales apilados por hora
    for (let h = 0; h < 24; h++) {
      let total = 0;
      datasets.forEach(ds => {
        const d = ds.data.find(v => v.hora === h);
        if (d && d.valor != null) total += d.valor;
      });
      if (total > 0) allValues.push(total);
    }
  }

  const valid = allValues.filter(v => v != null && isFinite(v));
  if (!valid.length) {
    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sin datos disponibles', W / 2, H / 2);
    return canvas.toBuffer('image/png');
  }

  let yMin = Math.min(...valid);
  let yMax = Math.max(...valid);

  // Margen del 10%
  const range = yMax - yMin || 1;
  yMin = Math.max(0, yMin - range * 0.1);
  yMax = yMax + range * 0.1;

  // Grid lines
  const yTicks = 5;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';

  for (let i = 0; i <= yTicks; i++) {
    const y = PAD.top + (chartH * i / yTicks);
    const val = yMax - ((yMax - yMin) * i / yTicks);
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(W - PAD.right, y);
    ctx.stroke();
    ctx.fillText(fmtShort(val), PAD.left - 8, y + 4);
  }

  // Eje Y label
  ctx.save();
  ctx.translate(15, PAD.top + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(unit, 0, 0);
  ctx.restore();

  // Eje X
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  for (let h = 0; h < 24; h += 3) {
    const x = PAD.left + (h / 23) * chartW;
    ctx.fillText(`${h}:00`, x, H - PAD.bottom + 20);
    // Grid vertical
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(x, PAD.top);
    ctx.lineTo(x, PAD.top + chartH);
    ctx.stroke();
  }

  // Dibujar datasets
  const colors = ['#2563eb', '#f97316', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#ec4899', '#06b6d4'];

  datasets.forEach((ds, di) => {
    const color = ds.color || colors[di % colors.length];

    // Dibujar área bajo la línea
    ctx.beginPath();
    let started = false;
    let prevY = null;

    for (let h = 0; h < 24; h++) {
      const d = ds.data.find(v => v.hora === h);
      const x = PAD.left + (h / 23) * chartW;

      let y;
      if (stacked) {
        // Calcular valor apilado
        let stackedVal = 0;
        for (let di2 = 0; di2 <= di; di2++) {
          const ds2 = datasets[di2];
          const d2 = ds2.data.find(v => v.hora === h);
          if (d2 && d2.valor != null) stackedVal += d2.valor;
        }
        y = PAD.top + chartH * (1 - (stackedVal - yMin) / (yMax - yMin));
      } else {
        if (d && d.valor != null) {
          y = PAD.top + chartH * (1 - (d.valor - yMin) / (yMax - yMin));
        } else {
          y = null;
        }
      }

      if (y != null) {
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      } else {
        started = false;
      }
    }

    // Área fill
    ctx.lineTo(PAD.left + chartW, PAD.top + chartH);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.closePath();
    ctx.fillStyle = color + '15';
    ctx.fill();

    // Línea
    ctx.beginPath();
    started = false;
    for (let h = 0; h < 24; h++) {
      const d = ds.data.find(v => v.hora === h);
      const x = PAD.left + (h / 23) * chartW;

      let y;
      if (stacked) {
        let stackedVal = 0;
        for (let di2 = 0; di2 <= di; di2++) {
          const ds2 = datasets[di2];
          const d2 = ds2.data.find(v => v.hora === h);
          if (d2 && d2.valor != null) stackedVal += d2.valor;
        }
        y = PAD.top + chartH * (1 - (stackedVal - yMin) / (yMax - yMin));
      } else {
        if (d && d.valor != null) {
          y = PAD.top + chartH * (1 - (d.valor - yMin) / (yMax - yMin));
        } else {
          y = null;
        }
      }

      if (y != null) {
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      } else {
        started = false;
      }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Puntos
    for (let h = 0; h < 24; h++) {
      const d = ds.data.find(v => v.hora === h);
      if (!d || d.valor == null) continue;
      const x = PAD.left + (h / 23) * chartW;
      let y;
      if (stacked) {
        let stackedVal = 0;
        for (let di2 = 0; di2 <= di; di2++) {
          const ds2 = datasets[di2];
          const d2 = ds2.data.find(v => v.hora === h);
          if (d2 && d2.valor != null) stackedVal += d2.valor;
        }
        y = PAD.top + chartH * (1 - (stackedVal - yMin) / (yMax - yMin));
      } else {
        y = PAD.top + chartH * (1 - (d.valor - yMin) / (yMax - yMin));
      }

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });

  // Leyenda
  let legendX = PAD.left;
  ctx.font = '12px sans-serif';
  datasets.forEach((ds, di) => {
    const color = ds.color || colors[di % colors.length];
    ctx.fillStyle = color;
    ctx.fillRect(legendX, H - 15, 12, 12);
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'left';
    ctx.fillText(ds.name, legendX + 16, H - 5);
    legendX += ctx.measureText(ds.name).width + 36;
  });

  return canvas.toBuffer('image/png');
}

// ─── Enviar a Telegram ───────────────────────────────────────────
function sendTelegramText(text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown',
    });

    const req = https.request(
      `${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Telegram ${res.statusCode}: ${data}`));
            return;
          }
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Parse error: ${data}`)); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout Telegram')); });
    req.write(payload);
    req.end();
  });
}

function sendTelegramPhoto(filePath, caption) {
  return new Promise((resolve, reject) => {
    const formData = Buffer.from(
      `--boundary\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n--boundary\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption || ''}\r\n--boundary\r\nContent-Disposition: form-data; name="photo"; filename="${path.basename(filePath)}"\r\nContent-Type: image/png\r\n\r\n`
    );

    const fileContent = fs.readFileSync(filePath);
    const boundaryEnd = Buffer.from(`\r\n--boundary--\r\n`);

    const req = https.request(
      `${TELEGRAM_API}/bot${BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=boundary',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Telegram ${res.statusCode}: ${data}`));
            return;
          }
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Parse error: ${data}`)); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout Telegram')); });
    req.write(formData);
    req.write(fileContent);
    req.write(boundaryEnd);
    req.end();
  });
}

// ─── Fetch de datos ──────────────────────────────────────────────
async function fetchAll() {
  console.error(`📅 Fetching datos para ${TARGET_DATE}...`);

  const results = await Promise.allSettled(
    INDICATORS.map(ind => fetchIndicator(ind.id, TARGET_DATE))
  );

  const data = {};
  INDICATORS.forEach((ind, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      data[ind.name] = parseValues(result.value, ind.unit);
    } else {
      console.error(`  ⚠️ ${ind.name} (ID ${ind.id}): ${result.reason.message}`);
      data[ind.name] = [];
    }
  });

  return data;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  ensureCacheDir();
  console.error(`🚀 Iniciando resumen ESIOS para ${TARGET_DATE}`);

  const data = await fetchAll();

  // Resumen texto
  const pAvg = avg(data.precios);
  const pMax = max(data.precios);
  const pMin = min(data.precios);
  const dAvg = avg(data.demanda);
  const dMax = max(data.demanda);
  const dMin = min(data.demanda);
  const eAvg = avg(data.eolica);
  const sAvg = avg(data.solar);
  const hAvg = avg(data.hidrica);
  const cAvg = avg(data.carbon);
  const cogAvg = avg(data.cogeneracion);
  const oRenAvg = avg(data.otrasRen);
  const gTotAvg = avg(data.genTotal);
  const gRenAvg = avg(data.genRenReal);
  const gNoRenAvg = avg(data.genNoRenReal);
  const cLibreAvg = avg(data.co2Libre);
  const cRatioAvg = avg(data.co2Ratio);
  const dPrevAvg = avg(data.demandaPrev);
  const ePrevAvg = avg(data.eolicaPrev);
  const sPrevAvg = avg(data.solarPrev);
  const rPrevAvg = avg(data.renovablePrev);
  const iFRNet = avg(data.interFR);
  const iPTNet = avg(data.interPT);

  // Texto resumen
  const textSummary = `📊 *Resumen ESIOS — ${TARGET_DATE}*\n\n` +
    `💰 PVPC: ${fmt(pAvg)} €/MWh (máx ${fmt(pMax)} · mín ${fmt(pMin)})\n` +
    `⚡ Demanda: ${fmt(dAvg)} MW (máx ${fmt(dMax)} · mín ${fmt(dMin)})\n` +
    `🏭 Gen medida: ${fmt(gTotAvg)} MW total\n` +
    `  Eólica ${fmt(eAvg)} · Solar ${fmt(sAvg)} · Hídrica ${fmt(hAvg)} · Carbón ${fmt(cAvg)}\n` +
    `🌿 Gen real: ${fmt(gRenAvg)} MW renov / ${fmt(gNoRenAvg)} MW no renov\n` +
    `🌍 CO2: ${fmt(cRatioAvg)} tCO₂/h\n` +
    `🔮 Prev D+1: ${fmt(ePrevAvg)} MW eólica · ${fmt(sPrevAvg)} MW solar\n` +
    `🔌 Intercon: FR ${fmt(iFRNet)} · PT ${fmt(iPTNet)}\n\n` +
    `👇 Gráficos abajo`;

  // Enviar texto primero
  console.error('📝 Enviando texto resumen...');
  await sendTelegramText(textSummary);

  // Gráfico 1: Precios
  console.error('🎨 Generando gráfico de precios...');
  const preciosImg = drawChart(
    `💰 Precios PVPC — ${TARGET_DATE}`,
    [{ name: 'PVPC (€/MWh)', color: '#2563eb', data: data.precios }],
    '€/MWh'
  );
  const preciosPath = path.join(CACHE_DIR, `chart-precios-${TARGET_DATE}.png`);
  fs.writeFileSync(preciosPath, preciosImg);
  await sendTelegramPhoto(preciosPath, `💰 Precios PVPC — ${TARGET_DATE}\nMedia: ${fmt(pAvg)} €/MWh · Máx: ${fmt(pMax)} · Mín: ${fmt(pMin)}`);

  // Gráfico 2: Demanda
  console.error('🎨 Generando gráfico de demanda...');
  const demandaImg = drawChart(
    `⚡ Demanda Real — ${TARGET_DATE}`,
    [{ name: 'Demanda real (MW)', color: '#f97316', data: data.demanda }],
    'MW'
  );
  const demandaPath = path.join(CACHE_DIR, `chart-demanda-${TARGET_DATE}.png`);
  fs.writeFileSync(demandaPath, demandaImg);
  await sendTelegramPhoto(demandaPath, `⚡ Demanda Real — ${TARGET_DATE}\nMedia: ${fmt(dAvg)} MW · Máx: ${fmt(dMax)} · Mín: ${fmt(dMin)}`);

  // Gráfico 3: Generación medida (apilado)
  console.error('🎨 Generando gráfico de generación medida...');
  const genImg = drawChart(
    `🏭 Generación Medida — ${TARGET_DATE}`,
    [
      { name: 'Eólica', color: '#22c55e', data: data.eolica },
      { name: 'Solar FV', color: '#eab308', data: data.solar },
      { name: 'Hidráulica', color: '#3b82f6', data: data.hidrica },
      { name: 'Carbón', color: '#6b7280', data: data.carbon },
      { name: 'Cogeneración', color: '#a855f7', data: data.cogeneracion },
      { name: 'Otras renov.', color: '#ec4899', data: data.otrasRen },
    ],
    'MW', true
  );
  const genPath = path.join(CACHE_DIR, `chart-gen-${TARGET_DATE}.png`);
  fs.writeFileSync(genPath, genImg);
  await sendTelegramPhoto(genPath, `🏭 Generación Medida — ${TARGET_DATE}\nTotal: ${fmt(gTotAvg)} MW`);

  // Gráfico 4: Generación real tiempo (apilado)
  console.error('🎨 Generando gráfico de generación real...');
  const realImg = drawChart(
    `🌿 Generación Real Tiempo — ${TARGET_DATE}`,
    [
      { name: 'Renovable', color: '#22c55e', data: data.genRenReal },
      { name: 'No renovable', color: '#ef4444', data: data.genNoRenReal },
    ],
    'MW', true
  );
  const realPath = path.join(CACHE_DIR, `chart-real-${TARGET_DATE}.png`);
  fs.writeFileSync(realPath, realImg);
  await sendTelegramPhoto(realPath, `🌿 Generación Real Tiempo — ${TARGET_DATE}\nRen: ${fmt(gRenAvg)} MW · No ren: ${fmt(gNoRenAvg)} MW`);

  // Gráfico 5: Previsión D+1 (apilado)
  console.error('🎨 Generando gráfico de previsión...');
  const prevImg = drawChart(
    `🔮 Previsión D+1 — ${TARGET_DATE}`,
    [
      { name: 'Eólica prevista', color: '#22c55e', data: data.eolicaPrev },
      { name: 'Solar prevista', color: '#eab308', data: data.solarPrev },
    ],
    'MW', true
  );
  const prevPath = path.join(CACHE_DIR, `chart-prev-${TARGET_DATE}.png`);
  fs.writeFileSync(prevPath, prevImg);
  await sendTelegramPhoto(prevPath, `🔮 Previsión D+1 — ${TARGET_DATE}\nEólica: ${fmt(ePrevAvg)} MW · Solar: ${fmt(sPrevAvg)} MW`);

  // Gráfico 6: Interconexiones (apilado)
  console.error('🎨 Generando gráfico de interconexiones...');
  const interImg = drawChart(
    `🔌 Interconexiones Netas — ${TARGET_DATE}`,
    [
      { name: 'Francia', color: '#3b82f6', data: data.interFR },
      { name: 'Portugal', color: '#f97316', data: data.interPT },
    ],
    'MW', false
  );
  const interPath = path.join(CACHE_DIR, `chart-inter-${TARGET_DATE}.png`);
  fs.writeFileSync(interPath, interImg);
  await sendTelegramPhoto(interPath, `🔌 Interconexiones Netas — ${TARGET_DATE}\nFrancia: ${fmt(iFRNet)} MW · Portugal: ${fmt(iPTNet)} MW`);

  // Limpiar cache
  cleanCache();

  console.log('✅ Resumen ESIOS enviado correctamente con gráficos');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
