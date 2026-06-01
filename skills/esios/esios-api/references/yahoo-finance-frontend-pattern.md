# Yahoo Finance para frontend — Patrón de integración

**Fecha:** 2026-05-31  
**Proyecto ejemplo:** SistemaElectricoFuturo (mejora 9009 #12)  
**Contexto:** Proyecto frontend puro (sin backend Node.js) que necesita datos de mercado en tiempo real.

## Problema

La API de ESIOS/REE requiere autenticación (`x-api-key`) y no soporta CORS desde el navegador. Los proyectos frontend puros no pueden llamar directamente a ESIOS sin un backend proxy.

## Solución

Usar Yahoo Finance query1 API como alternativa para datos de mercado:
- Sin API key
- Soporta CORS (funciona desde navegador)
- JSON parseable
- Datos actualizados diariamente

## Implementación completa

### 1. Módulo `ree-data.js` — Caché + Fetch

```javascript
// Caché en localStorage con TTL de 1 hora
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_KEY = 'sef_ree_api_cache';

function cacheGet(key) {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cache = JSON.parse(raw);
        if (cache[key] && (Date.now() - cache[key].ts < CACHE_TTL_MS)) {
            return cache[key].data;
        }
        return null;
    } catch (e) { return null; }
}

function cacheSet(key, data) {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        let cache = raw ? JSON.parse(raw) : {};
        cache[key] = { data, ts: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* localStorage lleno */ }
}
```

### 2. Fetch Yahoo Finance

```javascript
function fetchYahooFinance(ticker) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`;
    return fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(data => {
            const result = data.chart?.result?.[0];
            if (!result) return null;
            const quotes = result.indicators?.quote?.[0];
            const meta = result.meta;
            if (!quotes || !meta) return null;
            return { precio: quotes.close[0], meta };
        })
        .catch(() => null);
}
```

### 3. Construcción de datos combinados

```javascript
function construirDatosTiempoReal() {
    const cache = cacheGet('ree:tiempoReal');
    if (cache) return Promise.resolve(cache);

    // Fetch paralelo de Yahoo Finance
    const pGas = fetchYahooFinance('TTF=F');
    const pCO2 = fetchYahooFinance('EURO0=DXX');

    return Promise.all([pGas, pCO2]).then(([gasData, co2Data]) => {
        const ahora = new Date();
        const timestamp = ahora.toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        return {
            ultimaActualizacion: timestamp,
            fuente: 'API',
            demandaActual: { ...REE_DATA.demandaActual },
            mercado: {
                ...REE_DATA.mercado,
                precioTTF: gasData ? Math.round(gasData.precio) : REE_DATA.mercado.precioTTF,
                precioCO2: co2Data ? Math.round(co2Data.precio * 100) / 100 : REE_DATA.mercado.precioCO2,
            },
            yahoo: { gasTTF: gasData, co2: co2Data },
        };
    }).then(datos => {
        cacheSet('ree:tiempoReal', datos);
        return datos;
    }).catch(() => {
        // Fallback a datos estáticos
        return {
            ultimaActualizacion: REE_DATA.demandaActual.ultimaActualizacion,
            fuente: 'referencia',
            demandaActual: { ...REE_DATA.demandaActual },
            mercado: { ...REE_DATA.mercado },
            yahoo: { gasTTF: null, co2: null },
        };
    });
}
```

### 4. Integración en Vue app.js

```javascript
// Estado de carga
const reeCargandoAPI = ref(false);

// En onMounted:
reeCargandoAPI.value = true;
SEF.REEData.cargarDatosTiempoReal().then(apiData => {
    if (apiData?.mercado) reeMercado.value = { ...reeMercado.value, ...apiData.mercado };
    if (apiData?.ultimaActualizacion) reeData.value = { ...reeData.value, ultimaActualizacion: apiData.ultimaActualizacion };
    reeCargandoAPI.value = false;
}).catch(() => { reeCargandoAPI.value = false; });

// Actualización manual:
async function reeActualizarDatos() {
    reeCargandoAPI.value = true;
    try {
        const apiData = await SEF.REEData.cargarDatosTiempoReal(true); // forceRefresh
        if (apiData?.mercado) reeMercado.value = { ...reeMercado.value, ...apiData.mercado };
    } catch (e) { console.warn('[SEF/REE] Error:', e); }
    reeCargandoAPI.value = false;
}
```

### 5. UI — Badge + Botón

```html
<!-- Badge de estado -->
<span class="nz-badge" :class="reeCargandoAPI ? 'nz-badge--warning' : 'nz-badge--success'">
    <span v-if="reeCargandoAPI">⟳ Actualizando...</span>
    <span v-else>● En vivo</span>
</span>

<!-- Botón de actualización -->
<button class="nz-btn nz-btn--sm" :disabled="reeCargandoAPI" @click="reeActualizarDatos">
    <span v-if="reeCargandoAPI">⟳</span>
    <span v-else>↻ Actualizar</span>
</button>
```

## Reglas de oro

1. **Siempre tener fallback:** Yahoo Finance puede fallar (rate limit, CORS, ticker no encontrado). Mantener datos estáticos de REE como respaldo.
2. **Caché con TTL:** 1 hora es un buen balance entre frescura y evitar llamadas excesivas.
3. **No confundir unidades:** Yahoo devuelve precios en la moneda del ticker (EUR para TTF, USD para CO2). Convertir si es necesario.
4. **No es datos en tiempo real puro:** Yahoo Finance actualiza una vez al día (cierre de mercado). Para datos intradiarios reales, se necesita backend con API key de ESIOS.
5. **No usar para generación/demanda:** Yahoo Finance solo tiene datos de mercado (precios). Para generación y demanda, usar ESIOS con backend proxy o datos estáticos de REE.

## Tickers de energía útiles

| Ticker | Nombre | Moneda | Uso |
|--------|--------|--------|-----|
| `TTF=F` | Gas Natural TTF | EUR | Precio gas natural Europa |
| `EURO0=DXX` | EU ETS CO2 | EUR | Precio carbono UE |
| `CL=F` | Crude Oil WTI | USD | Petróleo crudo USA |
| `BZ=F` | Crude Oil Brent | USD | Petróleo crudo Europa |
| `NG=F` | Natural Gas (NYMEX) | USD | Gas natural USA |
| `GC=F` | Gold | USD | Refugio seguro |
