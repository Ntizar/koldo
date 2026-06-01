// ============================================================
// API Config — Proxy a backend externo
// Copiar este archivo como js/api-config.js en tu proyecto
// ============================================================

// URL del backend (cambiar según despliegue)
const BACKEND_URL = 'https://tu-backend.nan.builders';

// Override global fetch para reencaminar /api/* al backend
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = BACKEND_URL + url;
  }
  return originalFetch.call(this, url, options);
};

console.log('[API] Proxy activo:', BACKEND_URL);
