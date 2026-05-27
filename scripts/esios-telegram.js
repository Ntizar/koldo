#!/usr/bin/env node
/**
 * esios-telegram.js — Resumen diario del mercado eléctrico español vía Telegram
 *
 * Variables de entorno:
 *   TELEGRAM_BOT_TOKEN  — Token del bot de Telegram
 *   TELEGRAM_CHAT_ID    — Chat ID de destino
 *   ESIOS_API_TOKEN     — Token API de ESIOS/REE (también acepta ESIOS_API)
 *
 * Uso:
 *   node esios-telegram.js [YYYY-MM-DD]
 *   Si no se pasa fecha, usa ayer.
 */

const https = require('https');

// ─── Configuración ───────────────────────────────────────────────
const ESIOS_BASE = 'https://api.esios.ree.es';
const TELEGRAM_API = 'https://api.telegram.org';

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

function parseValues(resp) {
  if (!resp || !resp.indicator || !resp.indicator.values) return [];
  return resp.indicator.values.map(v => {
    const val = v.value == null ? null : Number(v.value);
    const dt = new Date(v.datetime || v.datetime_local || v.tz_time);
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', hourCycle: 'h23',
    }).formatToParts(dt);
    const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));
    return { hora: `${obj.hour}:00`, valor: val };
  });
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

// ─── Fetch de datos ──────────────────────────────────────────────
async function fetchAll() {
  console.error(`📅 Fetching datos para ${TARGET_DATE}...`);

  const results = await Promise.allSettled([
    fetchIndicator(1001, TARGET_DATE),    // PVPC
    fetchIndicator(1293, TARGET_DATE),    // Demanda real
    fetchIndicator(4, TARGET_DATE),       // Nuclear
    fetchIndicator(10037, TARGET_DATE),   // Eólica medida
    fetchIndicator(10205, TARGET_DATE),   // Solar FV medida
    fetchIndicator(10035, TARGET_DATE),   // Hidráulica medida
    fetchIndicator(10036, TARGET_DATE),   // Carbón medida
    fetchIndicator(10039, TARGET_DATE),   // Cogeneración medida
    fetchIndicator(10041, TARGET_DATE),   // Otras renovables medida
    fetchIndicator(10043, TARGET_DATE),   // Gen total medida
    fetchIndicator(10351, TARGET_DATE),   // Gen real renovable
    fetchIndicator(10352, TARGET_DATE),   // Gen real no renovable
    fetchIndicator(10006, TARGET_DATE),   // CO2 libre
    fetchIndicator(10355, TARGET_DATE),   // CO2 específico
    fetchIndicator(460, TARGET_DATE),     // Demanda prevista
    fetchIndicator(541, TARGET_DATE),     // Eólica prevista
    fetchIndicator(14, TARGET_DATE),      // Solar FV prevista
    fetchIndicator(10350, TARGET_DATE),   // Renovable prevista
    fetchIndicator(10014, TARGET_DATE),   // Interconexión Francia
    fetchIndicator(10015, TARGET_DATE),   // Interconexión Portugal
  ]);

  const labels = [
    'precios', 'demanda', 'nuclear', 'eolica', 'solar',
    'hidrica', 'carbon', 'cogeneracion', 'otrasRen', 'genTotal',
    'genRenReal', 'genNoRenReal',
    'co2Libre', 'co2Ratio',
    'demandaPrev', 'eolicaPrev', 'solarPrev', 'renovablePrev',
    'interFR', 'interPT',
  ];

  const data = {};
  labels.forEach((label, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      data[label] = parseValues(result.value);
    } else {
      console.error(`  ⚠️ ${label}: ${result.reason.message}`);
      data[label] = [];
    }
  });

  return data;
}

// ─── Generar resumen ─────────────────────────────────────────────
function buildSummary(data) {
  const pAvg = avg(data.precios);
  const pMax = max(data.precios);
  const pMin = min(data.precios);

  const dAvg = avg(data.demanda);
  const dMax = max(data.demanda);
  const dMin = min(data.demanda);

  const eAvg = avg(data.eolica);
  const sAvg = avg(data.solar);
  const hAvg = avg(data.hidrica);
  const nAvg = avg(data.nuclear);
  const cAvg = avg(data.carbon);
  const cogAvg = avg(data.cogeneracion);
  const oRenAvg = avg(data.otrasRen);
  const gTotAvg = avg(data.genTotal);

  const cLibreAvg = avg(data.co2Libre);
  const cRatioAvg = avg(data.co2Ratio);

  const iFRNet = avg(data.interFR);
  const iPTNet = avg(data.interPT);

  let msg = `📊 *Resumen ESIOS — ${TARGET_DATE}*\n\n`;

  // Precios
  msg += `💰 *Precios (PVPC)*\n`;
  msg += `  Media: ${fmt(pAvg)} €/MWh\n`;
  msg += `  Máx: ${fmt(pMax)} €/MWh\n`;
  msg += `  Mín: ${fmt(pMin)} €/MWh\n\n`;

  // Demanda
  msg += `⚡ *Demanda real*\n`;
  msg += `  Media: ${fmt(dAvg)} MW\n`;
  msg += `  Máx: ${fmt(dMax)} MW\n`;
  msg += `  Mín: ${fmt(dMin)} MW\n\n`;

  // Generación
  msg += `🏭 *Generación media*\n`;
  msg += `  Eólica: ${fmt(eAvg)} MW\n`;
  msg += `  Solar FV: ${fmt(sAvg)} MW\n`;
  msg += `  Hidráulica: ${fmt(hAvg)} MW\n`;
  msg += `  Nuclear: ${fmt(nAvg)} MW\n`;
  msg += `  Carbón: ${fmt(cAvg)} MW\n`;
  msg += `  Cogeneración: ${fmt(cogAvg)} MW\n`;
  msg += `  Otras renov.: ${fmt(oRenAvg)} MW\n`;
  msg += `  Total medida: ${fmt(gTotAvg)} MW\n\n`;

  // Renovables vs no renovables
  msg += `🌿 *Generación real*\n`;
  msg += `  Renovables: ${fmt(avg(data.genRenReal))} MW\n`;
  msg += `  No renovables: ${fmt(avg(data.genNoRenReal))} MW\n\n`;

  // CO2
  msg += `🌍 *CO2*\n`;
  msg += `  Gen limpia (CO2 libre): ${fmt(cLibreAvg)} MW\n`;
  msg += `  Ratio CO2 específico: ${fmt(cRatioAvg)} tCO₂/MWh\n\n`;

  // Interconexiones
  msg += `🔌 *Interconexiones netas*\n`;
  msg += `  Francia: ${fmt(iFRNet)} MW\n`;
  msg += `  Portugal: ${fmt(iPTNet)} MW\n`;
  msg += `  *Nota:* positivo = exportación, negativo = importación\n`;

  return msg;
}

// ─── Enviar a Telegram ───────────────────────────────────────────
function sendTelegram(text) {
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

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.error(`🚀 Iniciando resumen ESIOS para ${TARGET_DATE}`);

  const data = await fetchAll();
  const summary = buildSummary(data);

  console.error('📝 Enviando a Telegram...');
  const result = await sendTelegram(summary);

  if (result.ok) {
    console.log('✅ Resumen ESIOS diario enviado correctamente');
  } else {
    console.error('❌ Error enviando:', result);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
