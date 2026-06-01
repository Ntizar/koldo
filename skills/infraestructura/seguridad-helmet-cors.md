---
name: seguridad-helmet-cors
description: "Configuración de Helmet con Content Security Policy (CSP) y CORS para apps Express con CDNs externos (Chart.js, Google Fonts)."
version: 1.0.0
author: Ntizar
---

# Seguridad con Helmet + CORS

Configuración de seguridad para dashboards Express que cargan assets de CDNs externos (Chart.js, Google Fonts, etc.).

## Helmet con CSP

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

## CORS

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (env.ALLOWED_ORIGINS.includes('*') || (origin && env.ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
```

## Cache-busting para assets estáticos

```javascript
// Forzar no-cache en HTML y JS
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path.endsWith('.js') || req.path === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});
```

## Buenas prácticas

1. **CSP mínimo** — solo permitir CDNs que uses realmente
2. **'unsafe-inline'** — necesario para Chart.js y scripts inline, minimizar su uso
3. **CORS por lista blanca** — `ALLOWED_ORIGINS` configurable via env
4. **HSTS** — forzar HTTPS en producción
5. **Cache-busting** — evitar que el navegador sirva JS viejo
6. **Sanitizar JSON** — `express.json({ limit: '1mb' })` para evitar payloads grandes

## Pitfalls

- ❌ CSP demasiado restrictivo → CDNs no cargan (fonts.googleapis.com, cdn.jsdelivr.net)
- ❌ CORS en * en producción → cualquiera puede llamar a la API
- ❌ No hacer cache-busting → usuarios ven datos antiguos
- ❌ No limitar JSON body → ataque DoS por payload enorme

## Referencia

- Código real: `server.js` (secciones helmet, cors, cache-busting)
- Skills relacionadas: endpoints-dashboard-rest, env-validacion-estricta