# Error: `eval()` en ESM no tiene acceso a globalThis

## Síntoma

Al intentar cargar módulos IIFE (estilo `window.SEF = SEF`) en un archivo ESM (`"type": "module"` en package.json), `eval(codigo)` falla o no accede correctamente a `globalThis.SEF`.

```
Error cargando true: The "paths[0]" argument must be of type string.
```

El error "Error cargando true" ocurre porque `eval()` en ESM ejecuta en el scope léxico del módulo, no en el scope global. Cuando el código SEF intenta acceder a `globalThis.SEF`, el scope no es el esperado y se producen errores de tipo.

## Causa

En Node.js ESM, `eval()` ejecuta en el scope léxico del módulo. Esto significa:
- No puede acceder a variables locales del módulo
- `globalThis` puede no estar accesible como se espera
- Los módulos que hacen `window.SEF = SEF` fallan porque `window` no existe en el scope correcto

## Solución

Usar `new Function(codigo)` en lugar de `eval(codigo)`:

```javascript
function cargarModuloSEF(ruta) {
    const codigo = readFileSync(ruta, 'utf-8');
    const SEF = globalThis.SEF || {};
    globalThis.SEF = SEF;
    if (!globalThis.window) {
        globalThis.window = { SEF: SEF };
    }
    const fn = new Function(codigo);  // ← new Function, NO eval
    fn();
}
```

`new Function()` crea una función cuyo scope es el scope global, por lo que `globalThis.SEF` es accesible y los módulos IIFE funcionan correctamente.

## Verificación

```bash
node --check motor.mjs          # Sintaxis OK
node motor.mjs --scenario=1     # Produce JSON
node motor.mjs --scenario=1 --compacto  # Resumen legible
```
