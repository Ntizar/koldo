---
name: github-pages-static
description: "Desplegar frontend estático en GitHub Pages — estructura, rutas, .nojekyll, proxy API a backend externo, y troubleshooting."
version: 1.0.0
author: Koldo
tags: [github, pages, static, deployment]

---

# GitHub Pages — Frontend Estático

Desplegar un frontend HTML/CSS/JS estático en GitHub Pages, con routing de API a un backend externo (NaN, Vercel, etc.).

## Estructura del repo

```
repo/
├── .nojekyll          ← OBLIGATORIO: desactiva Jekyll para servir HTML/JS/CSS puro
├── index.html         ← EN LA RAÍZ (GitHub Pages busca index.html aquí)
├── css/styles.css
├── js/
│   ├── api-config.js  ← Proxy de API a backend externo
│   ├── config.js
│   ├── ...
└── README.md          ← Opcional (si existe, Jekyll lo procesa a menos que haya .nojekyll)
```

## Pasos de deploy

1. **Crear repo** (si no existe): `curl -X POST https://api.github.com/user/repos -H "Authorization: Bearer $TOKEN" -d '{"name":"xxx","private":false}'`
2. **`.nojekyll` en la raíz** — desactiva Jekyll para servir archivos tal cual
3. **`index.html` en la raíz** — GitHub Pages NO busca en subdirectorios
4. **Push a `main`** — GitHub Pages detecta automáticamente
5. **Activar GitHub Pages**: `curl -X POST https://api.github.com/repos/OWNER/REPO/pages -H "Authorization: Bearer $TOKEN" -d '{"source":{"branch":"main","path":"/"}}'`
6. **Esperar 1-2 min** — GitHub Pages tarda en activarse

## URL de GitHub Pages

- Formato: `https://<usuario>.github.io/<repo>/`
- HTTPS forzado automáticamente

## ⚠️ Pitfalls críticos

### Jekyll captura el sitio
- Si hay `README.md` en la raíz → GitHub Pages sirve una página Jekyll en vez del HTML
- **Fix**: `.nojekyll` en la raíz (archivo vacío vale)
- **Otra fix**: Renombrar README a `README.txt` o moverlo a `docs/`

### Rutas de archivos
- `index.html` debe estar en la **raíz del repo**, no en `public/` o `src/`
- Si el frontend viene de otro proyecto (ej. Express con `public/`), mover todo a la raíz
- Las rutas en HTML: `src="js/..."`, `href="css/..."` (sin `public/` prefix)

### Cache-busting
- GitHub Pages cachea agresivamente
- Para forzar recarga: añadir timestamp al query string en el HTML
- O mejor: renombrar archivos con hash (ej. `app.a1b2c3.js`)

### API proxy desde frontend
- Los archivos JS en GitHub Pages son estáticos — NO pueden tener `process.env`
- Usar un archivo `api-config.js` que se carga primero y reescribe `fetch()`
- Patrón: interceptar `/api/*` y redirigir al backend externo

## Patrón: API proxy en el navegador

```javascript
// api-config.js — cargar ANTES que cualquier otro JS
const BACKEND_URL = 'https://tu-backend.nan.builders';

// Override global fetch para reencaminar /api/* al backend
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = BACKEND_URL + url;
  }
  return originalFetch.call(this, url, options);
};
```

Inyectar en HTML **antes** de los otros scripts:
```html
<script src="js/api-config.js"></script>
<script src="js/config.js"></script>
```

## Token en frontend estático

**NUNCA** exponer tokens API en el frontend de GitHub Pages (visible en DevTools).

Si se necesita un token:
1. **Proxy via backend** (recomendado): frontend → tu backend → API externa
2. **GitHub personal access token** con scope mínimo (solo lectura, expirable)
3. **Backend como servicio** (NaN, Vercel) con el token en variables de entorno

## Troubleshooting

| Síntoma | Causa | Fix |
|---|---|---|
| 404 en `/` | Jekyll procesando en vez de HTML | `.nojekyll` en raíz |
| 404 en `/` | `index.html` no en raíz | Mover `index.html` a raíz del repo |
| HTML se ve pero CSS/JS no | Rutas relativas mal | Verificar `href="css/..."` y `src="js/..."` |
| API calls fallan CORS | Backend no permite CORS | Configurar `Access-Control-Allow-Origin` en backend |
| API calls van a localhost | `api-config.js` no se carga | Verificar orden de scripts en HTML |
| Página Jekyll en vez del app | `README.md` en raíz | `.nojekyll` + eliminar README de raíz |
| Cambios no se ven | Cache de GitHub Pages | Esperar 1-2 min, o hard refresh |

## Verificación post-deploy

```bash
# 1. HTML se sirve
curl -s https://usuario.github.io/repo/ | head -5

# 2. CSS/JS cargan
curl -s -o /dev/null -w "%{http_code}" https://usuario.github.io/repo/css/styles.css
curl -s -o /dev/null -w "%{http_code}" https://usuario.github.io/repo/js/config.js

# 3. API proxy funciona (si aplica)
# Verificar en DevTools Network que /api/* se redirige al backend
```

## Referencias

- `references/github-pages-api-proxy.md` — patrón API proxy con ejemplos
- `templates/github-pages-starter/` — template mínimo para copiar
