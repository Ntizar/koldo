# Patrón: API Proxy en GitHub Pages

Cuando un frontend estático en GitHub Pages necesita llamar a una API externa que requiere autenticación (token secreto), el frontend NO puede contener el token. Solución: proxy via backend externo.

## Problema

```
Frontend (GitHub Pages) → API externa (requiere token)
```

El token quedaría expuesto en el código fuente del navegador.

## Solución: Proxy via Backend

```
Frontend (GitHub Pages) → Tu Backend (NaN/Vercel) → API Externa
```

El backend tiene el token en variables de entorno. El frontend solo conoce la URL del backend.

## Implementación

### 1. Backend Express (ejemplo NaN)

```javascript
// server.js — endpoint que llama a API externa
const ESIOS_TOKEN = process.env.ESIOS_API_TOKEN;

app.get('/api/esios/summary', async (req, res) => {
  const fecha = req.query.fecha;
  const resp = await fetch(
    `https://api.esios.ree.es/analisis/indicadores/${fecha}`,
    { headers: { 'Authorization': `Bearer ${ESIOS_TOKEN}` } }
  );
  const data = await resp.json();
  res.json(data);
});
```

### 2. Frontend — api-config.js

```javascript
// api-config.js — cargar ANTES que cualquier otro JS
const BACKEND_URL = 'https://tu-app.nan.builders';

// Override global fetch para reencaminar /api/* al backend
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = BACKEND_URL + url;
  }
  return originalFetch.call(this, url, options);
};

console.log('[API] Proxy activo:', BACKEND_URL);
```

### 3. HTML — orden de scripts

```html
<!-- api-config SIEMPRE primero -->
<script src="js/api-config.js"></script>
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/visor.js"></script>
```

### 4. Código existente sin cambios

El código del frontend sigue usando paths relativos:
```javascript
// visor.js — NO necesita cambios
const resp = await fetch('/api/esios/indicators');
```

El override de `fetch()` intercepta automáticamente.

## Consideraciones CORS

El backend debe permitir CORS desde GitHub Pages:

```javascript
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## Casos de uso

- **ESIOS Dashboard**: frontend en GitHub Pages, backend en NaN
- **Dashboard personal**: datos de APIs privadas, frontend en GitHub Pages
- **Portfolio con datos**: charts que consumen APIs con auth
