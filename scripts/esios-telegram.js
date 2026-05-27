#!/usr/bin/env node
/**
 * esios-telegram.js — Resumen diario del mercado eléctrico español vía Telegram
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

// ─── Mapa de indicadores con unidades correctas ──────────────────
// Fuente: data/esios-reference.json + data/esios-indicator-index.md
//
// Reglas de conversión:
//   MWh/periodo → MW: dividir entre 1000
//   MWh → MW: dividir entre 1000
//   MW: usar directo
//   €/MWh: usar directo
//   tCO2/h: usar directo
//   %: usar directo
//
// IDs CORRECTOS (verificados contra índice robusto):
const INDICATORS = [
  // Precios
  { name: 'precios',           id: 1001,  unit: 'price_eur_mwh' },
  // Demanda
  { name: 'demanda',           id: 1293,  unit: 'power_mw' },
  // Generación medida (MWh → MW: /1000)
  { name: 'eolica',            id: 10037, unit: 'energy_mwh' },
  { name: 'solar',             id: 10205, unit: 'power_mw' },       // MW directo
  { name: 'hidrica',           id: 10035, unit: 'energy_mwh' },
  { name: 'carbon',            id: 10036, unit: 'energy_mwh' },
  { name: 'cogeneracion',      id: 10039, unit: 'energy_mwh' },
  { name: 'otrasRen',          id: 10041, unit: 'energy_mwh' },
  { name: 'genTotal',          id: 10043, unit: 'energy_mwh' },
  // Generación real tiempo (MW directo)
  { name: 'genRenReal',        id: 10351, unit: 'power_mw' },
  { name: 'genNoRenReal',      id: 10352, unit: 'power_mw' },
  // CO2
  { name: 'co2Libre',          id: 10006, unit: 'power_mw' },       // MW gen limpia
  { name: 'co2Ratio',          id: 10355, unit: 'emissions_tco2_per_h' },
  // Previsión D+1 (MW directo)
  { name: 'demandaPrev',       id: 2052,  unit: 'power_mw' },
  { name: 'eolicaPrev',        id: 1777,  unit: 'power_mw' },
  { name: 'solarPrev',         id: 1779,  unit: 'power_mw' },
  { name: 'renovablePrev',     id: 10358, unit: 'power_mw' },
  // Interconexiones (MWh → MW: /1000)
  { name: 'interFR',           id: 10207, unit: 'energy_mwh' },
  { name: 'interPT',           id: 10208, unit: 'energy_mwh' },
];

// Indicadores que necesitan conversión MWh → MW (/1000)
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

  // Generación medida (promedio MW)
  msg += `🏭 *Generación medida (media)*\n`;
  msg += `  Eólica: ${fmt(eAvg)} MW\n`;
  msg += `  Solar FV: ${fmt(sAvg)} MW\n`;
  msg += `  Hidráulica: ${fmt(hAvg)} MW\n`;
  msg += `  Carbón: ${fmt(cAvg)} MW\n`;
  msg += `  Cogeneración: ${fmt(cogAvg)} MW\n`;
  msg += `  Otras renov.: ${fmt(oRenAvg)} MW\n`;
  msg += `  Total medida: ${fmt(gTotAvg)} MW\n\n`;

  // Generación real tiempo
  msg += `🌿 *Generación real tiempo*\n`;
  msg += `  Renovables: ${fmt(gRenAvg)} MW\n`;
  msg += `  No renovables: ${fmt(gNoRenAvg)} MW\n\n`;

  // CO2
  msg += `🌍 *CO2*\n`;
  msg += `  Gen limpia (CO2 libre): ${fmt(cLibreAvg)} MW\n`;
  msg += `  CO2 asociado gen real: ${fmt(cRatioAvg)} tCO₂/h\n\n`;

  // Previsión D+1
  msg += `🔮 *Previsión D+1 (media)*\n`;
  msg += `  Demanda: ${fmt(dPrevAvg)} MW\n`;
  msg += `  Eólica: ${fmt(ePrevAvg)} MW\n`;
  msg += `  Solar FV: ${fmt(sPrevAvg)} MW\n`;
  msg += `  Renovable total: ${fmt(rPrevAvg)} MW\n\n`;

  // Interconexiones
  msg += `🔌 *Interconexiones netas (media)*\n`;
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
