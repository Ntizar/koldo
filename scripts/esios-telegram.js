#!/usr/bin/env node
/**
 * esios-telegram.js — Informe diario del mercado eléctrico español
 * Con gráficos PNG y análisis del día.
 *
 * Variables de entorno:
 *   TELEGRAM_BOT_TOKEN  — Token del bot de Telegram
 *   TELEGRAM_CHAT_ID    — Chat ID de destino
 *   ESIOS_API_TOKEN     — Token API de ESIOS/REE (también acepta ESIOS_API)
 *
 * Fuentes de verdad: data/esios-reference.json + data/esios-indicator-index.md
 */

const https = require('https');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// ─── Configuración ───────────────────────────────────────────────
const ESIOS_BASE = 'https://api.esios.ree.es';
const TELEGRAM_API = 'https://api.telegram.org';
const CACHE_DIR = '/tmp/esios-telegram-cache';

// ─── Carga de variables de entorno ──────────────────────────────
// Soporta .env en el directorio del script (para cron jobs sin env)
function loadEnvFile(filePath) {
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      // Remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch (e) {
    // .env no existe o no se puede leer — OK
  }
}

// Cargar .env desde el directorio del script
loadEnvFile(path.join(__dirname, '.env'));
// También intentar desde el directorio del proyecto (padre)
loadEnvFile(path.join(__dirname, '..', '.env'));

// Fallback: leer TELEGRAM_BOT_TOKEN de /proc/1/environ (gateway process)
// Las variables del gateway no se heredan en sesiones cron
if (!process.env.TELEGRAM_BOT_TOKEN) {
  try {
    const procEnv = fs.readFileSync('/proc/1/environ', 'utf8').split('\0');
    for (const entry of procEnv) {
      const m = entry.match(/^TELEGRAM_BOT_TOKEN=(.+)$/);
      if (m) { process.env.TELEGRAM_BOT_TOKEN = m[1]; break; }
    }
  } catch (e) { /* no se puede leer */ }
}

// Fallback: TELEGRAM_CHAT_ID desde TELEGRAM_HOME_CHANNEL en .env
if (!process.env.TELEGRAM_CHAT_ID) {
  const homeEnv = '/hermes-home/.env';
  try {
    const lines = fs.readFileSync(homeEnv, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.trim().match(/^TELEGRAM_HOME_CHANNEL=(.+)$/);
      if (m) { process.env.TELEGRAM_CHAT_ID = m[1]; break; }
    }
  } catch (e) { /* no se puede leer */ }
}

function getEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Faltan ${key} o TELEGRAM_CHAT_ID`);
  return val;
}

const BOT_TOKEN = getEnv('TELEGRAM_BOT_TOKEN');
const CHAT_ID = getEnv('TELEGRAM_CHAT_ID');
const ESIOS_TOKEN = process.env.ESIOS_API_TOKEN || process.env.ESIOS_API;
if (!ESIOS_TOKEN) throw new Error('Falta ESIOS_API_TOKEN o ESIOS_API');

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const TARGET_DATE = process.argv[2] || getYesterdayStr();

// ─── Indicadores que SÍ funcionan (verificados contra debug) ─────
// Solo usamos los que devuelven datos reales
const INDICATORS = [
  { name: 'precios',           id: 1001,  label: 'PVPC' },
  { name: 'demanda',           id: 1293,  label: 'Demanda real' },
  { name: 'demandaPrev',       id: 2052,  label: 'Demanda prevista' },
  { name: 'solar',             id: 10206, label: 'Solar real' },
  { name: 'genRenReal',        id: 10351, label: 'Gen real renovable' },
  { name: 'genNoRenReal',      id: 10352, label: 'Gen real no renovable' },
  { name: 'co2Libre',          id: 10006, label: 'Gen limpia CO2' },
  { name: 'co2Ratio',          id: 10355, label: 'CO2 asociado' },
  { name: 'interFR',           id: 10207, label: 'Interconexión Francia' },
  { name: 'interPT',           id: 10208, label: 'Interconexión Portugal' },
];

// ─── Conversión de unidades — MISMA LÓGICA que el dashboard ─────
// Fuente: /root/workspace/esios-dashboard/src/shared/esios-units.js
const DIRECT_IDS = new Set([
  1001,       // PVPC €/MWh
  1777, 1778, 1779, 1780,  // Previsión D+1
  10358, 10359,  // Previsión renovable D+1
  10355, 10356,  // CO2 ratio
  10207, 10208, 10209,  // Interconexiones MW DIRECTOS
]);

const DIV10_IDS = new Set([
  10206, 10006, 1293, 2052, 10232, 10351, 10352, 2198, 2199,
]);

function convertEsiosValue(indicatorId, rawValue) {
  if (rawValue === null || rawValue === undefined) return null;
  const num = Number(rawValue);
  if (!Number.isFinite(num)) return null;

  if (DIRECT_IDS.has(indicatorId)) return Math.round(num * 100) / 100;
  if (indicatorId >= 1 && indicatorId <= 462) return Math.round(num / 1000 * 100) / 100;
  if (indicatorId === 623) return Math.round(num / 1000 * 100) / 100;
  if (indicatorId >= 2000 && indicatorId <= 2099) return Math.round(num / 10 * 100) / 100;
  if (DIV10_IDS.has(indicatorId)) return Math.round(num / 10 * 100) / 100;
  return Math.round(num / 10 * 100) / 100;
}

// ─── Helpers HTTP ────────────────────────────────────────────────
function esiosFetch(p) {
  return new Promise((resolve, reject) => {
    const req = https.request(ESIOS_BASE + p, {
      headers: { 'x-api-key': ESIOS_TOKEN },
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        if (res.statusCode === 429) {
          setTimeout(() => resolve(esiosFetch(p)), 2000);
          return;
        }
        if (res.statusCode >= 400) {
          reject(new Error(`ESIOS ${res.statusCode}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Parse error`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function fetchIndicator(id, dateStr) {
  const start = `${dateStr}T00:00:00+02:00`;
  const end = `${dateStr}T23:59:59+02:00`;
  return esiosFetch(`/indicators/${id}?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&time_trunc=hour`);
}

function parseValues(resp, indicatorId) {
  if (!resp || !resp.indicator || !resp.indicator.values) return [];
  return resp.indicator.values.map(v => {
    const val = convertEsiosValue(indicatorId, v.value);
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

function fmtK(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toFixed(0);
}

function pct(n, d) {
  if (n == null || d == null || d === 0) return '—';
  return ((n / d) * 100).toFixed(1);
}

// ─── Canvas Charts ───────────────────────────────────────────────
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

function drawLineChart(title, datasets, unit, opts = {}) {
  const { stacked = false, showZero = true } = opts;
  const W = 900;
  const H = 360;
  const PAD = { top: 50, right: 30, bottom: 50, left: 80 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Título
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, PAD.left, 30);

  // Calcular rango Y
  let allValues = [];
  datasets.forEach(ds => {
    if (stacked) {
      for (let h = 0; h < 24; h++) {
        let total = 0;
        for (let di = 0; di <= ds.index; di++) {
          const d = datasets[di].data.find(v => v.hora === h);
          if (d && d.valor != null) total += d.valor;
        }
        if (total !== 0) allValues.push(total);
      }
    } else {
      ds.data.forEach(d => { if (d.valor != null) allValues.push(d.valor); });
    }
  });

  // Si hay valores negativos, incluir 0 en el rango
  if (showZero && allValues.some(v => v < 0)) allValues.push(0);

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

  // Margen 10%
  const range = yMax - yMin || 1;
  yMin = yMin - range * 0.1;
  yMax = yMax + range * 0.1;

  // Grid lines
  const yTicks = 6;
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
    ctx.fillText(fmtK(val), PAD.left - 8, y + 4);
  }

  // Línea cero si hay negativos
  if (yMin < 0 && yMax > 0) {
    const zeroY = PAD.top + chartH * (1 - (0 - yMin) / (yMax - yMin));
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(PAD.left, zeroY);
    ctx.lineTo(W - PAD.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.fillText('0', PAD.left - 8, zeroY + 4);
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
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(x, PAD.top);
    ctx.lineTo(x, PAD.top + chartH);
    ctx.stroke();
  }

  // Dibujar datasets
  const colors = ['#2563eb', '#f97316', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#ec4899', '#06b6d4'];

  datasets.forEach((ds, di) => {
    ds.index = di;
    const color = ds.color || colors[di % colors.length];

    // Área bajo la línea
    ctx.beginPath();
    let started = false;
    for (let h = 0; h < 24; h++) {
      const x = PAD.left + (h / 23) * chartW;
      let y;
      if (stacked) {
        let total = 0;
        for (let di2 = 0; di2 <= di; di2++) {
          const d2 = datasets[di2].data.find(v => v.hora === h);
          if (d2 && d2.valor != null) total += d2.valor;
        }
        y = PAD.top + chartH * (1 - (total - yMin) / (yMax - yMin));
      } else {
        const d = ds.data.find(v => v.hora === h);
        if (d && d.valor != null) {
          y = PAD.top + chartH * (1 - (d.valor - yMin) / (yMax - yMin));
        } else {
          y = null;
        }
      }
      if (y != null) {
        if (!started) { ctx.moveTo(x, y); started = true; }
        else { ctx.lineTo(x, y); }
      } else {
        started = false;
      }
    }
    ctx.lineTo(PAD.left + chartW, PAD.top + chartH);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.closePath();
    ctx.fillStyle = color + '18';
    ctx.fill();

    // Línea
    ctx.beginPath();
    started = false;
    for (let h = 0; h < 24; h++) {
      const x = PAD.left + (h / 23) * chartW;
      let y;
      if (stacked) {
        let total = 0;
        for (let di2 = 0; di2 <= di; di2++) {
          const d2 = datasets[di2].data.find(v => v.hora === h);
          if (d2 && d2.valor != null) total += d2.valor;
        }
        y = PAD.top + chartH * (1 - (total - yMin) / (yMax - yMin));
      } else {
        const d = ds.data.find(v => v.hora === h);
        if (d && d.valor != null) {
          y = PAD.top + chartH * (1 - (d.valor - yMin) / (yMax - yMin));
        } else {
          y = null;
        }
      }
      if (y != null) {
        if (!started) { ctx.moveTo(x, y); started = true; }
        else { ctx.lineTo(x, y); }
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
        let total = 0;
        for (let di2 = 0; di2 <= di; di2++) {
          const d2 = datasets[di2].data.find(v => v.hora === h);
          if (d2 && d2.valor != null) total += d2.valor;
        }
        y = PAD.top + chartH * (1 - (total - yMin) / (yMax - yMin));
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

// ─── Telegram ────────────────────────────────────────────────────
function sendTelegramText(text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown',
    });
    const req = https.request(TELEGRAM_API + '/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        if (res.statusCode >= 400) { reject(new Error(`Telegram ${res.statusCode}`)); return; }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse error')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(payload);
    req.end();
  });
}

function sendTelegramPhoto(filePath, caption) {
  return new Promise((resolve, reject) => {
    const formData = Buffer.from(
      `--boundary\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n--boundary\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption || ''}\r\n--boundary\r\nContent-Disposition: form-data; name="photo"; filename="chart.png"\r\nContent-Type: image/png\r\n\r\n`
    );
    const fileContent = fs.readFileSync(filePath);
    const boundaryEnd = Buffer.from(`\r\n--boundary--\r\n`);

    const req = https.request(TELEGRAM_API + '/bot' + BOT_TOKEN + '/sendPhoto', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=boundary' },
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        if (res.statusCode >= 400) { reject(new Error(`Telegram ${res.statusCode}`)); return; }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse error')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(formData);
    req.write(fileContent);
    req.write(boundaryEnd);
    req.end();
  });
}

// ─── Fetch ───────────────────────────────────────────────────────
async function fetchAll() {
  console.error(`📅 Fetching datos para ${TARGET_DATE}...`);
  const results = await Promise.allSettled(
    INDICATORS.map(ind => fetchIndicator(ind.id, TARGET_DATE))
  );
  const data = {};
  INDICATORS.forEach((ind, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      data[ind.name] = parseValues(result.value, ind.id);
    } else {
      console.error(`  ⚠️ ${ind.name} (ID ${ind.id}): ${result.reason.message}`);
      data[ind.name] = [];
    }
  });
  return data;
}

// ─── Análisis del día ────────────────────────────────────────────
function analyzeDay(data) {
  const pAvg = avg(data.precios);
  const pMax = max(data.precios);
  const pMin = min(data.precios);
  const pMaxHora = data.precios.find(v => v.valor === pMax)?.hora;
  const pMinHora = data.precios.find(v => v.valor === pMin)?.hora;

  const dAvg = avg(data.demanda);
  const dMax = max(data.demanda);
  const dMin = min(data.demanda);
  const dMaxHora = data.demanda.find(v => v.valor === dMax)?.hora;
  const dMinHora = data.demanda.find(v => v.valor === dMin)?.hora;

  const gRenAvg = avg(data.genRenReal);
  const gNoRenAvg = avg(data.genNoRenReal);
  const gTotalAvg = gRenAvg + gNoRenAvg;
  const pctRenovable = pct(gRenAvg, gTotalAvg);

  const solarAvg = avg(data.solar);
  const solarMax = max(data.solar);
  const solarMaxHora = data.solar.find(v => v.valor === solarMax)?.hora;

  const co2Avg = avg(data.co2Ratio);
  const co2Min = min(data.co2Ratio);
  const co2Max = max(data.co2Ratio);

  // Interconexiones: positivo = exportación, negativo = importación
  const iFRNet = avg(data.interFR);
  const iPTNet = avg(data.interPT);
  const iTotalNet = iFRNet + iPTNet;
  const iFRExport = data.interFR.filter(v => v.valor > 0).length;
  const iPTExport = data.interPT.filter(v => v.valor > 0).length;

  // Horas más caras vs más baratas
  const sortedPrecios = [...data.precios].sort((a, b) => b.valor - a.valor);
  const top3 = sortedPrecios.slice(0, 3);
  const bottom3 = sortedPrecios.slice(-3).reverse();

  // Horas más demanda
  const sortedDemanda = [...data.demanda].sort((a, b) => b.valor - a.valor);
  const topDemanda = sortedDemanda.slice(0, 3);

  // Descripción del día
  let analisis = '';

  // Contexto de precios
  if (pAvg > 150) {
    analisis += `🔴 Día de precios elevados. El precio medio fue de ${fmt(pAvg)} €/MWh, por encima de los 150 €/MWh.`;
  } else if (pAvg > 100) {
    analisis += `🟡 Día de precios moderados-alto. El precio medio fue de ${fmt(pAvg)} €/MWh.`;
  } else {
    analisis += `🟢 Día de precios contenidos. El precio medio fue de ${fmt(pAvg)} €/MWh.`;
  }

  // Pico y valle
  analisis += `\n\n`;
  analisis += `El precio alcanzó su máximo de ${fmt(pMax)} €/MWh a las ${pMaxHora}:00 y su mínimo de ${fmt(pMin)} €/MWh a las ${pMinHora}:00. `;
  analisis += `La diferencia entre pico y valle fue de ${fmt(pMax - pMin)} €/MWh.`;

  // Demanda
  analisis += `\n\n`;
  analisis += `La demanda media fue de ${fmtK(dAvg)} MW, con un máximo de ${fmtK(dMax)} MW a las ${dMaxHora}:00 y mínimo de ${fmtK(dMin)} MW a las ${dMinHora}:00.`;

  // Renovables
  analisis += `\n\n`;
  analisis += `La generación renovable media fue de ${fmtK(gRenAvg)} MW, un ${pctRenovable}% sobre la generación total (${fmtK(gTotalAvg)} MW).`;

  if (pctRenovable > 60) {
    analisis += ` ¡Alta penetración renovable!`;
  } else if (pctRenovable > 40) {
    analisis += ` Penetración renovable moderada.`;
  } else {
    analisis += ` Baja penetración renovable.`;
  }

  // Solar
  if (solarAvg > 0) {
    analisis += `\nLa solar FV media fue de ${fmtK(solarAvg)} MW, con un pico de ${fmtK(solarMax)} MW a las ${solarMaxHora}:00.`;
  }

  // CO2
  analisis += `\nEl factor de emisión medio fue de ${fmt(co2Avg)} tCO₂/MWh (mín: ${fmt(co2Min)}, máx: ${fmt(co2Max)}).`;

  // Interconexiones
  analisis += `\n\n`;
  if (iTotalNet > 0) {
    analisis += `España fue exportador neto con ${fmtK(iTotalNet)} MW. `;
  } else {
    analisis += `España fue importador neto con ${fmtK(Math.abs(iTotalNet))} MW. `;
  }
  analisis += `Francia: ${iFRExport}/24h exportando. Portugal: ${iPTExport}/24h exportando.`;

  return {
    analisis,
    stats: {
      pAvg, pMax, pMin, pMaxHora, pMinHora,
      dAvg, dMax, dMin, dMaxHora, dMinHora,
      gRenAvg, gNoRenAvg, gTotalAvg, pctRenovable,
      solarAvg, solarMax, solarMaxHora,
      co2Avg, co2Min, co2Max,
      iFRNet, iPTNet, iTotalNet, iFRExport, iPTExport,
    }
  };
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  ensureCacheDir();
  console.error(`🚀 Informe ESIOS para ${TARGET_DATE}`);

  const data = await fetchAll();
  const { analisis, stats } = analyzeDay(data);

  // ── Texto resumen ──
  const textSummary = `📊 *Informe ESIOS — ${TARGET_DATE}*\n\n` +
    `💰 PVPC: ${fmt(stats.pAvg)} €/MWh\n` +
    `  Pico: ${fmt(stats.pMax)} a las ${stats.pMaxHora}:00\n` +
    `  Valle: ${fmt(stats.pMin)} a las ${stats.pMinHora}:00\n` +
    `  Diferencia pico-valle: ${fmt(stats.pMax - stats.pMin)} €/MWh\n\n` +
    `⚡ Demanda: ${fmtK(stats.dAvg)} MW media\n` +
    `  Máx: ${fmtK(stats.dMax)} a las ${stats.dMaxHora}:00\n` +
    `  Mín: ${fmtK(stats.dMin)} a las ${stats.dMinHora}:00\n\n` +
    `🌿 Renovables: ${fmtK(stats.gRenAvg)} MW (${stats.pctRenovable}%)\n` +
    `  No renovables: ${fmtK(stats.gNoRenAvg)} MW\n` +
    `  Solar FV: ${fmtK(stats.solarAvg)} MW media\n\n` +
    `🌍 CO₂: ${fmt(stats.co2Avg)} tCO₂/MWh\n\n` +
    `🔌 Exportación neta: ${fmtK(stats.iTotalNet)} MW\n` +
    `  Francia: ${stats.iFRExport}/24h exportando\n` +
    `  Portugal: ${stats.iPTExport}/24h exportando\n\n` +
    `📝 *Análisis:*\n${analisis}\n\n` +
    `👇 Gráficos horarios abajo`;

  console.error('📝 Enviando texto...');
  await sendTelegramText(textSummary);

  // ── Gráfico 1: Precios ──
  console.error('🎨 Gráfico precios...');
  const preciosImg = drawLineChart(
    `💰 Precio PVPC — ${TARGET_DATE}`,
    [{ name: 'PVPC (€/MWh)', color: '#2563eb', data: data.precios }],
    '€/MWh'
  );
  const preciosPath = path.join(CACHE_DIR, `chart-precios-${TARGET_DATE}.png`);
  fs.writeFileSync(preciosPath, preciosImg);
  await sendTelegramPhoto(preciosPath, `💰 Precio PVPC — ${TARGET_DATE}\nMedia: ${fmt(stats.pAvg)} €/MWh · Pico: ${fmt(stats.pMax)} a las ${stats.pMaxHora}:00 · Valle: ${fmt(stats.pMin)} a las ${stats.pMinHora}:00`);

  // ── Gráfico 2: Demanda ──
  console.error('🎨 Gráfico demanda...');
  const demandaImg = drawLineChart(
    `⚡ Demanda Real — ${TARGET_DATE}`,
    [{ name: 'Demanda real (MW)', color: '#f97316', data: data.demanda }],
    'MW'
  );
  const demandaPath = path.join(CACHE_DIR, `chart-demanda-${TARGET_DATE}.png`);
  fs.writeFileSync(demandaPath, demandaImg);
  await sendTelegramPhoto(demandaPath, `⚡ Demanda Real — ${TARGET_DATE}\nMedia: ${fmtK(stats.dAvg)} MW · Máx: ${fmtK(stats.dMax)} a las ${stats.dMaxHora}:00`);

  // ── Gráfico 3: Solar + Demanda (comparativo) ──
  console.error('🎨 Gráfico solar vs demanda...');
  const solarImg = drawLineChart(
    `☀️ Solar FV vs Demanda — ${TARGET_DATE}`,
    [
      { name: 'Demanda (MW)', color: '#f97316', data: data.demanda },
      { name: 'Solar FV (MW)', color: '#eab308', data: data.solar },
    ],
    'MW', { showZero: true }
  );
  const solarPath = path.join(CACHE_DIR, `chart-solar-${TARGET_DATE}.png`);
  fs.writeFileSync(solarPath, solarImg);
  await sendTelegramPhoto(solarPath, `☀️ Solar FV vs Demanda — ${TARGET_DATE}\nSolar media: ${fmtK(stats.solarAvg)} MW · Pico: ${fmtK(stats.solarMax)} a las ${stats.solarMaxHora}:00`);

  // ── Gráfico 4: Interconexiones (con negativos) ──
  console.error('🎨 Gráfico interconexiones...');
  const interImg = drawLineChart(
    `🔌 Interconexiones Netas — ${TARGET_DATE}`,
    [
      { name: 'Francia', color: '#3b82f6', data: data.interFR },
      { name: 'Portugal', color: '#f97316', data: data.interPT },
    ],
    'MW', { showZero: true }
  );
  const interPath = path.join(CACHE_DIR, `chart-inter-${TARGET_DATE}.png`);
  fs.writeFileSync(interPath, interImg);
  await sendTelegramPhoto(interPath, `🔌 Interconexiones — ${TARGET_DATE}\nNeta: ${fmtK(stats.iTotalNet)} MW · FR: ${stats.iFRExport}/24h export · PT: ${stats.iPTExport}/24h export`);

  // ── Gráfico 5: CO2 ──
  console.error('🎨 Gráfico CO2...');
  const co2Img = drawLineChart(
    `🌍 CO₂ Asociado a Generación — ${TARGET_DATE}`,
    [{ name: 'tCO₂/MWh', color: '#8b5cf6', data: data.co2Ratio }],
    'tCO₂/MWh'
  );
  const co2Path = path.join(CACHE_DIR, `chart-co2-${TARGET_DATE}.png`);
  fs.writeFileSync(co2Path, co2Img);
  await sendTelegramPhoto(co2Path, `🌍 Factor de emisión CO₂ — ${TARGET_DATE}\nMedia: ${fmt(stats.co2Avg)} tCO₂/MWh · Mín: ${fmt(stats.co2Min)} · Máx: ${fmt(stats.co2Max)}`);

  cleanCache();
  console.log('✅ Informe ESIOS enviado correctamente');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
