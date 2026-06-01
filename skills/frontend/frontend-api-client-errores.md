---
name: frontend-api-client-errores
description: "Cliente fetch genérico para API REST con manejo de errores, query params extra y soporte para AbortController."
version: 1.0.0
author: Ntizar
---

# Cliente API Frontend con Manejo de Errores

Patrón para un cliente fetch liviano y robusto que se comunica con el backend del dashboard.

## Código

```javascript
// api.js
const BASE = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
const API_BASE = BASE + '/api/v1';

async function apiFetch(endpoint, fecha, signal, params) {
  if (!fecha) return Promise.reject(new Error('Fecha requerida'));

  const searchParams = new URLSearchParams({ fecha });

  // Parámetros extra (escenarios, filtros, etc.)
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    searchParams.set(key, value);
  });

  const url = `${API_BASE}/${endpoint}?${searchParams.toString()}`;
  const opts = signal ? { signal } : {};

  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`${endpoint} (${fecha}): ${resp.status} ${txt.slice(0, 100)}`);
  }
  return resp.json();
}
```

## Manejo de errores en el orquestador

```javascript
try {
  const data = await apiFetch('summary', fecha, signal);
  // Renderizar...
} catch (err) {
  if (err.name === 'AbortError') return;  // Cancelación intencional
  if (err.message.includes('404')) showToast('📭 Sin datos para esta fecha', 'warning');
  else if (err.message.includes('503')) showToast('⚠️ Servicio en mantenimiento', 'warning');
  else if (err.message.includes('502')) showToast('⚠️ Error del servidor', 'error');
  else showToast('❌ ' + err.message, 'error');
}
```

## Buenas prácticas

1. **Base URL dinámica** — `window.location.pathname` para que funcione en subdirectorios
2. **Query params extra** — `params` object para escenarios, filtros futuros
3. **Error con contexto** — incluir endpoint + fecha + status en el mensaje
4. **AbortController support** — pasar signal para cancelación
5. **Siempre JSON** — el backend debe devolver JSON, nunca HTML
6. **Mensajes de error en español** — coherente con el resto del proyecto

## Pitfalls

- ❌ Hardcodear URL base → no funciona en subdirectorios ni NaN.builders
- ❌ Sin signal → request sigue ejecutándose aunque el usuario ya no la necesita
- ❌ Error genérico 'Network Error' → no ayuda a diagnosticar
- ❌ No detectar AbortError → tratar la cancelación como error real

## Referencia

- Código real: `public/js/api.js` del proyecto ESIOS Dashboard
- Skills relacionadas: frontend-orquestacion-carga