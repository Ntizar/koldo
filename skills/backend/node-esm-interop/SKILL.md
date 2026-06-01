---
name: node-esm-interop
description: "Patrones de interoperabilidad entre ESM y CommonJS/IIFE en Node.js — cargar módulos legacy en ESM, CLI headless, new Function vs eval, y exportación de APIs."
version: 1.0.0
author: Ntizar
tags: [backend, nodejs, ESM, CommonJS, modules]

---

# Node.js ESM Interoperabilidad

Patrones para hacer que módulos escritos en estilo CommonJS/IIFE funcionen en un entorno ESM (Node.js con `"type": "module"`).

## Problema

Los módulos SEF (SistemaEléctricoFuturo) usan el patrón IIFE:
```javascript
(function() {
    const SEF = window.SEF || {};
    window.SEF = SEF;
    SEF.Utils = { ... };
    SEF.SimuladorElectrico = class { ... };
})();
```

Esto funciona en el navegador porque `window` existe. En Node.js ESM:
- `window` no existe
- `eval()` en ESM no tiene acceso al scope léxico del módulo llamante
- `import` no puede cargar archivos `.js` con `window` references

## Solución: `new Function()` + `globalThis`

### Patrón base

```javascript
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function cargarModuloSEF(ruta) {
    const codigo = readFileSync(ruta, 'utf-8');
    const SEF = globalThis.SEF || {};
    globalThis.SEF = SEF;
    if (!globalThis.window) {
        globalThis.window = { SEF: SEF };
    }
    // new Function() evita problemas de scope en ESM
    // eval() en ESM no tiene acceso al scope léxico del módulo
    const fn = new Function(codigo);
    fn();
}
```

### ¿Por qué `new Function()` y no `eval()`?

En Node.js ESM, `eval()` ejecuta en el scope léxico del módulo, lo que significa que **no tiene acceso a `globalThis`** como esperamos. `new Function()` crea una función cuyo scope es el scope global, por lo que `globalThis.SEF` es accesible.

### Carga en orden

Los módulos deben cargarse en orden de dependencia:

```javascript
const modulos = [
    'js/constants.js',     // SEF.Utils, SEF.MODEL, SEF.PARAMS_DEFAULT
    'js/weather.js',       // SEF.Weather (usa SEF.Utils, SEF.MODEL)
    'js/demand.js',        // SEF.Demand (usa SEF.Utils, SEF.MODEL)
    'js/storage.js',       // SEF.Storage (usa SEF.Utils)
    'js/policy.js',        // SEF.Policy
    'js/nuclear.js',       // SEF.Nuclear
    'js/simulator.js',     // SEF.SimuladorElectrico (usa todos los anteriores)
    'js/trajectory.js',    // SEF.Trajectory (usa SEF.SimuladorElectrico)
    'js/montecarlo.js',    // SEF.MonteCarlo (usa SEF.SimuladorElectrico)
    'js/scenarios.js',     // SEF.ESCENARIOS (usa SEF.PARAMS_DEFAULT)
];
```

## Patrón: CLI Headless

Crear un ejecutable Node.js ESM (`motor.mjs`) que:

1. Carga módulos SEF en orden con `cargarModuloSEF()`
2. Expone una CLI con parser de argumentos
3. Ejecuta simulaciones y devuelve JSON

### Parser de argumentos robusto

```javascript
function parseArgs(argv) {
    const args = {};
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg.startsWith('--')) {
            const eq = arg.indexOf('=');
            if (eq !== -1) {
                const key = arg.slice(2, eq);
                args[key] = arg.slice(eq + 1);
            } else {
                // Soporta --flag valor (sin =) y --flag (sin valor)
                if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
                    args[arg.slice(2)] = argv[++i];
                } else {
                    args[arg.slice(2)] = true;
                }
            }
        }
    }
    return args;
}
```

**Pitfall:** El parser debe soportar `--param valor` (sin `=`) además de `--param=valor`. Si solo soporta `=`, los flags con valor en posición se pierden.

### Salida JSON

- stdout: resultado JSON (para pipe/redirect)
- stderr: resumen legible (para terminal)
- `--output archivo.json`: guardar en archivo

## Verificación

```bash
# Sintaxis
node --check motor.mjs

# Ejecutar escenario
node motor.mjs --scenario=1 --compacto

# Ejecutar con parámetros
node motor.mjs --params params.json --output resultado.json

# Trayectoria
node motor.mjs --scenario=1 --trayectoria

# Monte Carlo
node motor.mjs --scenario=1 --montecarlo
```

## Pitfalls

1. **`eval()` en ESM no funciona para módulos que usan `globalThis`** — usar `new Function()` en su lugar. `eval()` ejecuta en el scope léxico del módulo, no en el scope global.
2. **Orden de carga importa** — los módulos se cargan secuencialmente y cada uno asume que los anteriores ya están en `globalThis.SEF`.
3. **Parser de argumentos soporta `--flag valor`** — no solo `--flag=valor`. Si se pasa `--params archivo.json`, el parser debe leer `archivo.json` como valor del flag `params`.
4. **`globalThis.window` es necesario** — los módulos SEF hacen `window.SEF = SEF`. En Node.js hay que crear `globalThis.window = { SEF }` antes de cargar.
5. **No modificar los módulos originales** — el motor headless es un adaptador, no un refactor. Los módulos del navegador siguen funcionando igual.
