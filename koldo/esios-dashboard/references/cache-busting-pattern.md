# Patrón de Cache-Busting Dinámico

**Fecha**: 2026-05-26  
**Proyecto**: esios-dashboard  
**Estado**: Implementado y probado

## Problema

Los archivos JS del frontend se sirven sin cache-busting → el navegador sirve versión antigua → errores de "is not defined" o "is not a function" tras cada deploy.

## Solución implementada

### 1. Endpoint server `/js/cache-bust.js`

```javascript
app.get('/js/cache-bust.js', (req, res) => {
  res.set({
    'Content-Type': 'application/javascript',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Expires': '0',
  });
  const ts = Date.now();
  res.send(`
    (function() {
      var ts = ${ts};
      var scripts = document.querySelectorAll('script[src^="js/"]');
      scripts.forEach(function(s) {
        var src = s.src;
        if (src.indexOf('?') === -1) src += '?v=' + ts;
        else src = src.replace(/v=\\d+/, 'v=' + ts);
        s.src = src;
      });
    })();
  `);
});
```

### 2. Orden de carga en index.html

```html
<script src="/js/cache-bust.js"></script>
<script src="js/config.js"></script>
<script src="js/state.js"></script>
<!-- ... resto de scripts ... -->
```

El script `cache-bust.js` se carga PRIMERO, inyecta timestamp en todos los demás scripts, y el navegador descarga los JS frescos.

### 3. Headers Cache-Control en server.js

```javascript
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path.endsWith('.js')) {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
  }
  next();
});
```

## ¿Por qué NO usar inline script?

El inline script en index.html tiene problemas:
- Se ejecuta al parsear el HTML, antes de que los `<script src>` se carguen
- Cambiar `s.src` dinámicamente puede causar que el navegador re-descargue el script
- En Safari iOS puede ser cacheado
- El endpoint server es más limpio y funciona consistentemente

## Verificación

```bash
curl -s http://localhost:4000/js/cache-bust.js
# Output: (function() { var ts = 1748262000000; ... })

curl -sI http://localhost:4000/js/cache-bust.js | grep -i cache
# Output: Cache-Control: no-store, no-cache, must-revalidate
```
