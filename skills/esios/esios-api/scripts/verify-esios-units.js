#!/usr/bin/env node
/**
 * verify-esios-units.js — Verifica unidades de indicadores ESIOS
 * 
 * Uso: node verify-esios-units.js [fecha]
 * Ejemplo: node verify-esios-units.js 2026-05-27
 * 
 * Compara los valores raw de cada indicador con la regla esperada
 * según convertEsiosValue() del dashboard.
 */

const https = require('https');

const ESIOS_BASE = 'https://api.esios.ree.es';

const DIRECT_IDS = new Set([
  1001, 1777, 1778, 1779, 1780, 10358, 10359, 10355, 10356, 10207, 10208, 10209,
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

function fetchIndicator(id, dateStr, token) {
  return new Promise((resolve, reject) => {
    const start = `${dateStr}T00:00:00+02:00`;
    const end = `${dateStr}T23:59:59+02:00`;
    const req = https.get(
      `${ESIOS_BASE}/indicators/${id}?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&time_trunc=hour`,
      { headers: { 'x-api-key': token } },
      (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error('Parse error')); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function getRule(id) {
  if (DIRECT_IDS.has(id)) return 'DIRECTO';
  if (id >= 1 && id <= 462) return '/1000';
  if (id === 623) return '/1000';
  if (id >= 2000 && id <= 2099) return '/10';
  if (DIV10_IDS.has(id)) return '/10';
  return '/10 (fallback)';
}

async function main() {
  const token = process.env.ESIOS_API_TOKEN || process.env.ESIOS_API;
  if (!token) { console.error('Falta ESIOS_API_TOKEN o ESIOS_API'); process.exit(1); }

  const dateStr = process.argv[2] || new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // IDs a verificar
  const ids = [1001, 1293, 2052, 10205, 10206, 10351, 10352, 10006, 10355, 10207, 10208, 10209];
  
  console.log(`\n🔍 Verificando unidades para ${dateStr}\n`);
  console.log('═'.repeat(90));
  console.log(`${'ID'.padEnd(6)} ${'Regla'.padEnd(10)} ${'Raw (h9)'.padEnd(12)} ${'Convertido'.padEnd(12)} ${'Media'.padEnd(12)} ${'Non-null'}`);
  console.log('═'.repeat(90));

  const results = await Promise.all(ids.map(id => fetchIndicator(id, dateStr, token)));

  results.forEach((resp, i) => {
    const id = ids[i];
    const rule = getRule(id);
    const vals = resp.indicator?.values || [];
    const nonNull = vals.filter(v => v.value != null);
    
    if (!vals.length) {
      console.log(`${String(id).padEnd(6)} ${rule.padEnd(10)} ${'SIN DATOS'.padEnd(12)} ${'—'.padEnd(12)} ${'—'.padEnd(12)} 0`);
      return;
    }

    const rawSample = vals[9]?.value;
    const converted = convertEsiosValue(id, rawSample);
    const convertedVals = vals.map(v => convertEsiosValue(id, v.value)).filter(v => v !== null);
    const avg = convertedVals.length > 0 ? (convertedVals.reduce((a, b) => a + b, 0) / convertedVals.length).toFixed(2) : 'NaN';

    console.log(
      `${String(id).padEnd(6)} ${rule.padEnd(10)} ${String(rawSample ?? '—').padEnd(12)} ${String(converted ?? 'null').padEnd(12)} ${String(avg).padEnd(12)} ${nonNull.length}`
    );
  });

  console.log('═'.repeat(90) + '\n');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
