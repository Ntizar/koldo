---
name: esios-dashboard-troubleshooting
description: "Diagnóstico y resolución de problemas del dashboard ESIOS en NaN — caché, CSP, token API, timeouts, carga progresiva frontend."
version: "1.0.0"
category: frontend
tags: [esios, troubleshooting, nan, 502]

---

# ESIOS Dashboard Troubleshooting

Procedimiento para diagnosticar y arreglar el dashboard ESIOS (`esios-dashboard`) cuando no carga datos en NaN.builders.

## Problemas Comunes y Soluciones

### 1. Dashboard se queda en "Cargando..." para siempre

**Causa:** Error JS no capturado que no oculta el loading overlay.

**Diagnóstico:**
- Verificar que `showLoading` existe en `utils.js` (NO en `ui.js`)
- Verificar que `utils.js` se carga ANTES que `data.js` en el HTML
- Verificar que `AppState` está definido en `state.js`
- Verificar que `shouldFetchPrediccion` existe en `utils.js`
- **CRÍTICO:** Verificar que `setupDateNavigation` y `updateDateControls` están DEFINIDAS en `data.js`:
  ```bash
  grep -c "function setupDateNavigation" public/js/data.js  # debe ser 1
  grep -c "function updateDateControls" public/js/data.js   # debe ser 1
  ```

**Solución:**
- Añadir timeout en `cargarDatos()` para evitar espera eterna
- Mostrar toasts de error claros en catch blocks
- Asegurar que `showLoading(false)` se llama en el `finally`
- Si las funciones están perdidas, restaurarlas desde git o añadirlas a `data.js`

### 2. Token ESIOS 403 Forbidden

**Causa:** `.env` tiene token de prueba (`test`) en vez del real.

**Diagnóstico:**
```bash
grep ESIOS_API_TOKEN /root/workspace/esios-dashboard/.env
# Si dice "test" o "***", verificar variable de entorno:
env | grep ESIOS_API
```

**Solución:**
- El token real está en la variable `ESIOS_API` del entorno Hermes
- Copiar a `.env`: `ESIOS_API_TOKEN=<valor_real>`
- O usar fallback en `src/config/env.js`: `process.env.ESIOS_API_TOKEN || process.env.ESIOS_API`

### 3. API responde 5.2s+ en NaN pero 0.5s local

**Causa:** Disk cache se pierde entre reinicios en NaN (container efímero).

**Soluciones:**
- Memory cache en `server.js` para persistir entre requests
- Batching paralelo: `fetchIndicatorBatch` con 5 por batch × 3 concurrentes
- Timeout individual: 15s (no 5s)
- 2 reintentos con backoff exponencial

### 4. Frontend tarda 10s+ en mostrar datos

**Causa:** `Promise.allSettled` espera a summary + prediccion juntos.

**Solución — Carga progresiva:**
```javascript
// 1. Esperar solo al summary para mostrar rápido
const summary = await summaryPromise;
renderAllTabs(summary, null);

// 2. Prediccion en segundo plano
const prediccion = await prediccionPromise;
renderAllTabs(summary, prediccion); // re-render con prediccion
```

### 5. CDN/NaN cachea versión vieja del HTML

**Causa:** El HTML se sirve con cache y el navegador no recarga los JS nuevos.

**Solución:**
- Añadir meta tags en `<head>`:
  ```html
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  ```
- `cache-bust.js` añade `?v=timestamp` a todos los scripts `js/`
- Deploy vacío (`git commit --allow-empty`) fuerza redeploy en NaN

### 6. CSP bloquea fetches

**Causa:** `connect-src` en CSP no incluye el dominio de la API externa.

**Verificación:**
```bash
curl -sI https://esios-dashboard-ntizar-ntizar.apps.nan.builders | grep content-security-policy
```

**Nota:** Los fetches a `/api/esios/` van a `self` (mismo origen), así que el CSP no los bloquea directamente. Pero verificar siempre si hay problemas de CORS.

### 7. NaN sirve versión antigua de archivos JS (página en blanco)

**Causa:** NaN.builders cachea el contenedor Docker y no reconstruye automáticamente tras los pushes. Los archivos locales y en GitHub están correctos, pero NaN sirve una versión anterior corrupta o incompleta.

**Diagnóstico:**
1. La página responde 200 y carga todo el HTML, pero se ve **en blanco total** (fondo blanco sin nada).
2. Verificar que los archivos remotos coinciden con los locales:
   ```bash
   # Comparar hash de cada archivo remoto vs local
   for file in js/app.js js/nuclear.js js/simulator.js js/charts.js css/app.css css/ntizar.css; do
     local_hash=$(md5sum "$file" | cut -d' ' -f1)
     remote_hash=$(curl -s "https://PROYECTO-ntizar-ntizar.apps.nan.builders/$file" | md5sum | cut -d' ' -f1)
     [ "$local_hash" = "$remote_hash" ] && echo "✅ $file" || echo "❌ $file - DIFFERENT"
   done
   ```
3. Los archivos que muestran `❌` son los que están desactualizados en NaN.

**Causa raíz típica:** Un commit 9009 añadió código nuevo a `js/app.js`, `js/nuclear.js` o `js/simulator.js`, se hizo push a GitHub, pero NaN no reconstruyó el contenedor. El código nuevo referencia funciones/objetos que no existen en la versión antigua → error JS silencioso → Vue no monta → página en blanco.

**Solución:**
1. Hacer push de un commit trigger:
   ```bash
   git commit --allow-empty -m "chore: trigger redeploy NaN.builders"
   git push origin main
   ```
2. Esperar 2-3 minutos (NaN tarda en reconstruir).
3. Si después de 3 minutos sigue igual, hacer un segundo commit con cambio real:
   ```bash
   echo "# Deployed: $(date -u)" >> README.md
   git add README.md && git commit -m "chore: trigger redeploy #2" && git push origin main
   ```
4. Verificar que los archivos remotos ya coinciden.
5. Si NaN sigue sin reconstruir tras 5+ minutos: **reconstrucción manual** en https://nan.builders → tu espacio → "Rebuild"/"Redeploy".

## Verificación Rápida

```bash
# 1. HTML se sirve
curl -s -o /dev/null -w "HTML: %{http_code} %{size_download}\n" URL

# 2. API summary responde
curl -s -w "SUMMARY: %{http_code} %{time_total}s\n" \
  URL/api/esios/summary?fecha=2026-05-30

# 3. Datos correctos
curl -s URL/api/esios/summary?fecha=2026-05-30 | \
  python3 -c "import sys,json; d=json.load(sys.stdin); 
  r=d['resumen']; print(f'Precio: {r[\"precio_medio\"]}')"

# 4. JS existen
curl -s -o /dev/null -w "data.js: %{http_code}\n" URL/js/data.js

# 5. Cache-bust actual
curl -s URL/js/cache-bust.js
```

## Estructura de Archivos Clave

```
  public/
    index.html          -> HTML principal (meta no-cache, scripts order)
    js/
      cache-bust.js     -> Añade ?v=timestamp a scripts js/
      config.js         -> Configuración
      state.js          -> AppState + localStorage
      utils.js          -> showLoading, showToast, shouldFetchPrediccion
      api.js            -> apiFetch con BASE dinámico
      data.js           -> cargarDatos() con carga progresiva
      ui.js             -> setupTabs, setupKeyboardShortcuts
      render.js         -> renderMetrics, renderTechCards...
  css/
    styles.css        -> Estilos del dashboard

server.js             -> Express + routing + withTimeout + memory cache
src/
  config/env.js       -> Carga variables (ESIOS_API_TOKEN || ESIOS_API)
  infra/clients/esios.client.js -> fetchIndicatorBatch con batching paralelo
  domains/energy/summary.service.js -> buildSummary con 4 batches
```

## Scripts

- `scripts/verify-nan-deploy.sh <base-url>` — **DEPRECATED**: ahora en `nan-deploy/scripts/verify-nan-deploy.sh`. Compara hashes MD5 de todos los archivos estáticos locales vs remotos.

## Comandos Útiles

```bash
# Trigger redeploy NaN
cd /root/workspace/esios-dashboard
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main

# Verificar token ESIOS
env | grep ESIOS_API

# Reiniciar servidor local
pkill -f "node server.js"
cd /root/workspace/esios-dashboard && node server.js
```
