---
name: seguridad-web-helmet-cors
description: "Patrón de seguridad web con Helmet (CSP, HSTS) y CORS por lista blanca. Para apps Express que cargan assets de CDNs externos."
version: 2.0.0
author: Ntizar
license: MIT
tags: [infraestructura, seguridad, helmet, cors, patrones]
metadata:
  hermes:
    related_skills: [env-validacion-estricta, health-checks-metrics]
---

# Seguridad Web con Helmet + CORS — Patrón de Cabeceras Seguras

## ¿Qué enseña este skill?

Un patrón de diseño para configurar **seguridad HTTP** en aplicaciones Express: Content Security Policy (CSP), HSTS, CORS por lista blanca y protección contra payloads grandes.

## ¿Cuándo usarlo?

- Despliegas una app web Express que sirve assets estáticos (HTML, CSS, JS)
- Tu frontend carga recursos de CDNs externos (Chart.js, Google Fonts, etc.)
- Necesitas proteger contra XSS, clickjacking y otros ataques HTTP comunes
- Tu app tiene un frontend y un backend en el mismo dominio

## ¿Cuándo NO usarlo?

- Tu app es solo una API sin frontend → no necesitas CSP ni cache-busting
- Usas un WAF (Cloudflare, AWS WAF) → muchas de estas protecciones ya las maneja el WAF
- Tu frontend está en un dominio completamente diferente → CORS es más complejo (preflight, cookies)
- Usas un framework frontend con CSP nonce/hash → la CSP se gestiona desde el frontend

## Arquitectura del patrón

```
                  ┌──────────────────────────┐
                  │     Tu Aplicación        │
                  │   Express + Helmet       │
                  └──────────┬───────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │  Helmet   │  │   CORS   │  │  Cache   │
         │   CSP    │  │  Whitelist│  │ Busting  │
         └──────────┘  └──────────┘  └──────────┘
```

## Código del patrón

```javascript
const helmet = require('helmet');

// ============================================================
// 1. Helmet con CSP mínimo
// ============================================================
// CSP: define qué recursos puede cargar el navegador.
// Regla: solo permitir lo que realmente necesitas.
//
// 'unsafe-inline' es necesario para Chart.js (genera CSS inline).
// Minimizar su uso: solo donde sea estrictamente necesario.

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],

      // Estilos: self + CDNs necesarios
      styleSrc: [
        "'self'",
        "'unsafe-inline'",       // Chart.js genera CSS inline
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
      ],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
      ],

      // Fuentes: self + CDN de Google Fonts
      fontSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://fonts.gstatic.com",
      ],

      // Scripts: self + CDN de Chart.js
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",       // Scripts inline en HTML
        "https://cdn.jsdelivr.net",
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
      ],

      // Imágenes: self + data URIs + cualquier HTTPS
      imgSrc: ["'self'", "data:", "https:"],

      // Peticiones fetch/XHR: self + CDNs
      connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  },
  hsts: {
    maxAge: 31536000,          // 1 año
    includeSubDomains: true,
    preload: true,
  },
}));

// ============================================================
// 2. CORS por lista blanca
// ============================================================
// Solo permitir orígenes explícitamente configurados.
// NUNCA usar '*' en producción.
//
// ALLOWED_ORIGINS viene de env-validacion-estricta:
// ['*'] = permitir todo (solo para dev)
// ['https://midominio.com'] = permitir solo ese dominio

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (env.ALLOWED_ORIGINS.includes('*')) {
    // Dev: permitir todo
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (origin && env.ALLOWED_ORIGINS.includes(origin)) {
    // Prod: solo orígenes permitidos
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Si no está en la lista, no se setea el header → CORS bloqueado

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// ============================================================
// 3. Cache-busting para assets dinámicos
// ============================================================
// Forzar no-cache en HTML y JS para que los usuarios
// siempre descarguen la versión más reciente.
//
// Los assets estáticos (CSS, imágenes) pueden tener
// cache largo si usas hash en el nombre del archivo.

app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path.endsWith('.js') || req.path === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// ============================================================
// 4. Protección contra payloads grandes
// ============================================================
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

## Configuración por escenario

| Escenario | CSP | CORS | HSTS |
|-----------|-----|------|------|
| Producción con HTTPS | CSP estricto (solo CDNs usados) | Lista blanca estricta | Activado |
| Producción sin HTTPS | CSP estricto | Lista blanca | No aplica |
| Desarrollo local | CSP relajado | `['*']` | No aplica |
| API solo (sin frontend) | Sin CSP | Lista blanca o restringido | No aplica |

## Mejores prácticas

1. **CSP mínimo** — solo permitir CDNs que realmente usas. Cada dominio extra es una superficie de ataque.
2. **Minimizar 'unsafe-inline'** — necesario para Chart.js y scripts inline, pero cada uno es un riesgo XSS.
3. **CORS por lista blanca** — nunca usar `'*'` en producción. Configurar desde variables de entorno.
4. **HSTS** — forzar HTTPS en producción con `maxAge: 31536000` (1 año).
5. **Limitar JSON body** — `express.json({ limit: '1mb' })` para evitar ataques DoS por payload enorme.
6. **Separar dev de prod** — en dev, CORS `['*']`. En prod, lista blanca estricta.

## Pitfalls

- ❌ CSP demasiado restrictivo → CDNs no cargan (fonts.googleapis.com, cdn.jsdelivr.net)
- ❌ CORS con `'*'` en producción → cualquiera puede llamar a tu API
- ❌ No hacer cache-busting → usuarios ven JS viejo con bugs ya corregidos
- ❌ No limitar JSON body → ataque DoS enviando payloads de GBs
- ❌ HSTS sin HTTPS real → el navegador redirige a HTTPS que no existe
- ❌ CSP con `*` en imgSrc → cualquier sitio puede inyectar imágenes (mejor usar `https:`)

## Referencias

- Código real: `server.js` (secciones helmet, cors, cache-busting) del proyecto ESIOS Dashboard
- Skills relacionadas: [env-validacion-estricta](../env-validacion-estricta/), [health-checks-metrics](../health-checks-metrics/)
