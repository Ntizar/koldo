# TDZ Errors and Promise.all Anti-Patterns

## TDZ (Temporal Dead Zone) — La trampa silenciosa

Cuando una variable `const` o `let` se usa antes de su declaración, JavaScript lanza `ReferenceError: Cannot access 'X' before initialization`. Este error **crashea el proceso Node.js** y se traduce en un 502 instantáneo (<1s).

### Ejemplo real del dashboard

```javascript
// ❌ MAL: totalGenReal se usa en linea 1 antes de declararse en linea 2
const co2TotalEstimado = (totalGenReal && co2SpecMedia) ? ...; // linea 1
const totalGenReal = (genRenTotal || 0) + (genNoRenTotal || 0); // linea 2

// ✅ BIEN: declarar antes de usar
const totalGenReal = (genRenTotal || 0) + (genNoRenTotal || 0);
const co2TotalEstimado = (totalGenReal && co2SpecMedia) ? ...;
```

### Cómo detectar

- 502 instantáneo (<1s) → casi seguro TDZ o crash de runtime
- `curl` al endpoint devuelve "error code: 502" inmediatamente
- Endpoints individuales funcionan → el crash es en el código de aggregation
- Probar localmente: `ESIOS_API=$ESIOS_API node server.js` y hacer curl a localhost

## Promise.all sin tolerancia a fallos

```javascript
// ❌ MAL: una falla derrumba las 30
const results = await Promise.all([
  fetchIndicator(id1), fetchIndicator(id2), ... fetchIndicator(id30)
]);

// ✅ BIEN: wrapper con try/catch individual
const fetchAll = async (fn, idx) => {
  try {
    const result = await fn();
    return { ok: true, data: result?.indicator?.values || [] };
  } catch (err) {
    console.error(`[summary] Fetch ${idx} failed:`, err.message);
    return { ok: false, data: [] };
  }
};
const resultados = await Promise.all([
  fetchAll(() => fetchIndicator(id1), 0),
  fetchAll(() => fetchIndicator(id2), 1),
  // ...
]);
```

## Reglas derivadas

1. **Nunca usar `Promise.all` directo** con 10+ llamadas API — siempre envolver en try/catch individual
2. **Siempre reducir timeouts** para fallo rápido (15s → 8s)
3. **Siempre añadir cache-busting** para HTML en despliegues con frontend frecuente
4. **Siempre testear localmente** antes de culpar al deploy
