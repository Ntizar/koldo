# Sistema Eléctrico Futuro — Contexto de auditoría

> Repositorio: `Ntizar/SistemaElectricoFuturo` (rama `main`)
> Deploy: `https://ntizar.github.io/SistemaElectricoFuturo/`
> Stack: JavaScript vanilla, Vue 3 (Composition API via CDN), Plotly, HTML estático
> Versión auditada: v3.1 → v3.2 (commit `7ced976`, mayo 2026)

## Estructura del proyecto

```
SistemaElectricoFuturo/
  index.html            # Página principal con todas las UI tabs
  js/
    app.js              # UI controller, guías, labels
    charts.js           # Plotly chart rendering
    constants.js        # PRNG (SeededRNG/Mulberry32), constantes globales, funciones utilidad
    demand.js           # Demanda sectorial (VE, bombas calor, H2, etc.)
    nuclear.js          # Calendario nuclear ENRESA
    policy.js           # Políticas: CfD, tope ibérico, CO₂
    ree-data.js         # Datos de referencia REE (estáticos)
    scenarios.js        # Definición de 18+ escenarios
    simulator.js        # Motor de simulación: despacho, precios, balance
    storage.js          # Persistencia local (localStorage)
    theme.js            # Tema visual
    trajectory.js       # Trayectorias de capacidad instalada
    weather.js          # Generación climática (viento, solar, temperatura)
```

## Hallazgos corregidos en v3.2

### 🔴 S1 — Precio no era por orden de mérito
- **Antes**: fórmula heurística con números mágicos (44, 100, 28, 24, 25...)
- **Después**: despacho real por SRMC — 12 tecnologías ordenadas por coste marginal, precio = coste de última unidad necesaria
- **Archivo**: `js/simulator.js` → método `calcularPrecioMarginal` reescrito

### 🔴 S2 — Renovables sin calibrar
- **Antes**: perfiles sin normalizar, CF anual aleatorio, offshore = onshore·1.18
- **Después**: calibración a CF reales REE 2025 (solar 24%, eólica 20%), offshore con perfil propio (0.6*onshore + 0.4*ruido)
- **Archivos**: `js/simulator.js`, `js/weather.js`, `js/constants.js`

### 🔴 S3 — PRNG Math.sin defectuoso
- **Antes**: `Math.sin(this.seed * 9301 + 49297) * 49271` — no uniforme, correlaciones
- **Después**: Mulberry32 — rápido, determinista, 32 bits, bien distribuido
- **Archivo**: `js/constants.js`

### 🔴 D1 — Calendario ENRESA erróneo
- **Antes**: Ascó II 2031, Vandellós II 2032 (incorrectos), UI inconsistente con código
- **Después**: Ascó II 2032, Vandellós II 2035, UI sincronizada
- **Archivo**: `js/nuclear.js`, `js/ree-data.js`

### 🟠 S4 — Hidráulica sin presupuesto energético
- **Antes**: hidráulica gestionable sin límite anual, podía despachar siempre
- **Después**: separación fluyente (38%) / embalse (62%), embalse con presupuesto TWh anual, seguimiento `_hidroEmbalseUsadoGWh`
- **Archivo**: `js/simulator.js`

### 🟠 S6 — Meses en bloques de 30,5 días
- **Antes**: `Math.floor(dia / 30.5) % 12` — desalineación de fechas
- **Después**: Array de días acumulados `[0,31,59,90,120,151,181,212,243,273,304,334]`, función `U.mesDelDia()`
- **Archivo**: `js/constants.js`

### 🟠 D2 — "Tiempo real" estático
- **Antes**: etiquetado como "📊 Demanda en Tiempo Real" con datos estáticos
- **Después**: "📊 Referencia REE 2025", datos documentados como estáticos
- **Archivos**: `index.html`, `js/ree-data.js`

### 🟠 D3 — Tope ibérico arbitrario
- **Antes**: números mágicos 65, +6, 0.72 sin documentar
- **Después**: advertencia "no reproduce la fórmula exacta del RDL", documentado como hipotético
- **Archivo**: `js/policy.js`

### 🟠 D4 — CfD a una sola cara
- **Antes**: ajuste consumidor siempre ≥0, encarecía siempre al consumidor
- **Después**: doble cara — productor siempre recibe strike, consumidor paga/recibe la diferencia
- **Archivo**: `js/policy.js`, `js/app.js` (guía)

### 🟡 D5 — Clamp 500 contradice precioEscasez
- **Antes**: `Math.min(500, Math.max(-25, precio))`
- **Después**: `Math.min(3000, Math.max(-50, precio))` (VOLL)
- **Archivos**: `js/simulator.js`, `js/policy.js`

### 🟡 D6 — "Coste sistema" mal etiquetado
- **Antes**: etiqueta "Coste sistema" para facturación mayorista
- **Después**: "Facturación mayorista"
- **Archivo**: `js/app.js`

### 🟡 R1 — AR(1) declarado pero no implementado
- **Antes**: texto "AR(1) sobre histórico REE" pero viento se reinicializa cada año
- **Después**: texto "generador climático genera series sintéticas con correlación temporal"
- **Archivo**: `js/app.js`

### 🟡 R2 — Sin balance energético
- **Antes**: ninguna verificación de generación = demanda + vertidos
- **Después**: verificación anual con alerta si desviación >0.5 TWh
- **Archivo**: `js/simulator.js`

## Pendiente para futuras iteraciones

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| S5 | Demanda sectorial: dos fuentes de verdad sin reconciliar | 🟠 Alta |
| S7 | Nuclear baseload plano sin paradas de recarga (~30d/18meses) | 🟡 Media |
| — | Monte Carlo multi-semilla con bandas P5–P50–P95 | 🟡 Media |
| — | Escenarios ceteris paribus alrededor del cierre nuclear | 🟡 Media |
| — | Vista comparativa "cierre 2035 vs prórroga" lado a lado | 🟡 Media |
| A1-A4 | package.json + Vite + Vitest + GitHub Actions + CI | 🟡 Media |
| R3 | Magic numbers sin fuente documentada | 🟡 Media |
| R4 | Sin test de calibración contra REE 2025 | 🟡 Media |

## Comandos útiles

```bash
# Sintaxis de todos los JS
for f in js/*.js; do node --check "$f" && echo "OK: $f" || echo "ERROR: $f"; done

# Desplegar en GitHub Pages (commit + push)
git add -A && git commit -m "mensaje"
git push origin main

# Verificar deploy
curl -s -o /dev/null -w "%{http_code}" https://ntizar.github.io/SistemaElectricoFuturo/
```

## Calendario nuclear ENRESA (corregido)

| Reactor | Cierre | Fuente |
|---------|--------|--------|
| Almaraz I | 2027 | Protocolo ENRESA 2019 |
| Almaraz II | 2028 | Protocolo ENRESA 2019 |
| Ascó I | 2030 | Protocolo ENRESA 2019 |
| Cofrentes | 2030 | Protocolo ENRESA 2019 |
| Ascó II | 2032 | Protocolo ENRESA 2019 |
| Vandellós II | 2035 | Protocolo ENRESA 2019 |
| Trillo | 2035 | Protocolo ENRESA 2019 |

## CF reales REE 2025 usados

- Solar fotovoltaica: 24% (derivado de 24.7 GW → 52.5 TWh)
- Eólica terrestre: 20% (valor de referencia REE)
- Eólica marina: 43% (mayor CF, menor variabilidad diurna)
