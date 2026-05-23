# 🏗️ Primer día en NaN.builders — Dashboard de control personal

**Guía paso a paso para montar tu propio centro de control**
desde cero en una microVM de NaN.builders.

---

## Índice

1. [Crear microVM en NaN](#1-crear-microvm-en-nan)
2. [Primer acceso por SSH/web](#2-primer-acceso-por-sshweb)
3. [Tu primer servidor Express](#3-tu-primer-servidor-express)
4. [Autenticación básica](#4-autenticación-básica)
5. [Aurora Liquid Glass — el diseño](#5-aurora-liquid-glass--el-diseño)
6. [Sistema de archivos en web](#6-sistema-de-archivos-en-web)
7. [Barra de estado en vivo](#7-barra-de-estado-en-vivo)
8. [Calendario de sesiones](#8-calendario-de-sesiones)
9. [Selector de modelos IA](#9-selector-de-modelos-ia)
10. [Monitor de tokens](#10-monitor-de-tokens)
11. [Visor de memoria del agente](#11-visor-de-memoria-del-agente)
12. [Tareas programadas (cron)](#12-tareas-programadas-cron)
13. [Proxy para segunda app (NAP)](#13-proxy-para-segunda-app-nap)
14. [Servicios: qué puertos están abiertos](#14-servicios-qué-puertos-están-abiertos)
15. [Git y despliegue](#15-git-y-despliegue)
16. [Buenas prácticas y pitfalls](#16-buenas-prácticas-y-pitfalls)

---

## 1. Crear microVM en NaN

1. Ve a [cloud.nan.builders](https://cloud.nan.builders)
2. Crea cuenta (si no tienes)
3. **Create MicroVM**:
   - Recursos: mínimo 1 vCPU, 2GB RAM, 20GB disco (suficiente para dashboard + agente)
   - SO: Linux (KVM/QEMU con kernel propio)
   - Nombre: el que quieras (afecta al subdominio)
4. Espera a que se despliegue (~30s)
5. Toma nota de:
   - **Subdominio**: `tunombre.apps.nan.builders`
   - **Contraseña de root** (la genera NaN)

## 2. Primer acceso por SSH/web

NaN te da acceso vía:
- **Web console** (xterm.js) en el panel de NaN
- **SSH** con clave o contraseña

También puedes conectar tu **agente Hermes** desde Telegram:

```bash
# Dentro de la microVM, si Hermes ya está instalado:
hermes pairing webui
# Escanea el QR o sigue el enlace
```

## 3. Tu primer servidor Express

Creamos el servidor que será el centro de control.

```bash
# Directorio de trabajo
mkdir -p /persist/nan-dashboard/public
cd /persist/nan-dashboard

# Inicializar proyecto
npm init -y
npm install express

# Crear servidor
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');
const os = require('os');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;
const DASH_PASSWORD = process.env.DASH_PASSWORD || 'tu-contraseña-segura';

app.use(express.json());

// ── Auth (solo /api/*) ──
app.use('/api', (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Basic ')) return res.status(401).json({ error: 'Login required' });
  const decoded = Buffer.from(auth.slice(6), 'base64').toString();
  const [, pass] = decoded.split(':');
  if (pass !== DASH_PASSWORD) return res.status(403).json({ error: 'Bad password' });
  next();
});

// ── API: System info ──
app.get('/api/system', (req, res) => {
  try {
    const cpus = os.cpus();
    const load = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const df = execSync('df -h / /persist 2>/dev/null || df -h /', { encoding: 'utf8' })
      .trim().split('\n').slice(1).map(l => { const p = l.split(/\s+/); return { fs: p[0], size: p[1], used: p[2], avail: p[3], use: p[4], mount: p[5] }; });
    res.json({
      hostname: os.hostname(), platform: os.platform(), arch: os.arch(),
      cpu: { model: cpus[0]?.model || 'unknown', cores: cpus.length, load },
      memory: { total: totalMem, free: freeMem, used: totalMem - freeMem, pct: ((totalMem - freeMem) / totalMem * 100).toFixed(1) },
      disk: df,
      uptime: os.uptime()
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Static frontend ──
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.get('*', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));

// ── Start ──
app.listen(PORT, () => console.log(`🏠 Dashboard en http://localhost:${PORT}`));
EOF
```

Pruébalo:
```bash
DASH_PASSWORD="tu-contraseña" node server.js
# En otra terminal: curl http://localhost:4000/api/system
# Con auth: curl -H "Authorization: Basic $(echo -n ':tu-contraseña' | base64)" http://localhost:4000/api/system
```

## 4. Autenticación básica

El patrón de auth más importante: **solo proteger `/api/*`**, no los archivos estáticos.

```javascript
// ❌ MAL: protege todo — el navegador muestra un popup de login feo
app.use(authMiddleware);

// ✅ BIEN: solo protege las rutas de API
app.use('/api', authMiddleware);
```

El frontend HTML se carga sin auth, muestra un formulario de login personalizado, y guarda la contraseña en `sessionStorage`:

```html
<script>
const PASS = sessionStorage.getItem('dash_pass') || '';
if (!PASS) {
  document.body.innerHTML = `<div class="login-screen">
    <h2>🔐 Dashboard</h2>
    <input type="password" id="pwInput" placeholder="Contraseña">
    <button onclick="checkPass()">Entrar</button>
  </div>`;
}
function checkPass() {
  const p = document.getElementById('pwInput').value;
  if (p) { sessionStorage.setItem('dash_pass', p); location.reload(); }
}
</script>
```

Para peticiones a la API, el frontend envía el header `Authorization: Basic ...`:

```javascript
function api(path, opts) {
  const pass = sessionStorage.getItem('dash_pass');
  return fetch(path, {
    ...opts,
    headers: { ...opts?.headers, 'Authorization': 'Basic ' + btoa(':' + pass) }
  }).then(r => {
    if (r.status === 403) { sessionStorage.removeItem('dash_pass'); location.reload(); }
    return r.json();
  });
}
```

Para operaciones destructivas (borrar archivos, cambiar modelo) se requiere **re-autenticación**:

```javascript
// Backend
if (req.headers['x-auth-confirm'] !== DASH_PASSWORD) {
  return res.status(403).json({ error: 'Re-autenticación requerida' });
}

// Frontend
const confirmPass = prompt('Confirma tu contraseña para esta operación:');
if (confirmPass) {
  api('/api/files/delete', { method: 'POST', body: JSON.stringify({ path }), headers: { 'X-Auth-Confirm': confirmPass } });
}
```

## 5. Aurora Liquid Glass — el diseño

El dashboard usa el tema **Aurora Liquid Glass** de Ntizar (CDN gratuito):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/ntizar.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="nz" data-nz-theme="dark">
  <div class="nz-container">
    <!-- Secciones aquí -->
  </div>
</div>
```

**Paleta:**
- Fondo: `#0a0e1c` (azul marino oscuro)
- Azul primario: `#2563eb`
- Naranja acento: `#f97316`
- Cards con efecto glass: `backdrop-filter: blur(20px)` + borde translúcido
- Texto: blanco para títulos, gris claro para secundario

**Secciones del dashboard (14 en total):**

1. 🔵 **Cabecera** — logo + título "NaN Dashboard"
2. 🟢 **Barra de estado** — modelo activo, RAM, uptime, plataformas
3. 📅 **Calendario** — sesiones del agente por día
4. 🖥️ **Sistema** — CPU, RAM, disco, uptime
5. 🤖 **Agente** — modelo, status, plataformas, skills
6. 🧠 **Cerebro** — sesiones + skills clickeables
7. 🔌 **APIs configuradas** — lista de APIs conectadas
8. 🔧 **Skills** — habilidades del agente
9. ⏰ **CRON** — tareas programadas (daily briefing, watchdogs)
10. 🌐 **Servicios** — puertos abiertos en el sistema
11. 💾 **Memoria** — lo que recuerda el agente entre sesiones
12. 🪙 **Tokens** — consumo por modelo, fuente y día
13. 📁 **Gestor archivos** — navegador de directorios
14. 📋 **Actividad** — log de operaciones

Cada sección es una card glass:

```html
<div class="nz-card nz-card--glass" style="margin-bottom:14px;">
  <div class="nz-flex" style="justify-content:space-between;align-items:center;margin-bottom:10px;">
    <div class="nz-flex" style="align-items:center;gap:8px;">
      <span style="font-size:20px;">🪙</span>
      <h3 class="nz-text-md" style="margin:0;color:#fff;">Título</h3>
    </div>
    <span class="nz-text-xs" style="color:var(--nz-text-soft);" id="contadorId"></span>
  </div>
  <div id="contenidoId" class="nz-text-sm">cargando...</div>
</div>
```

## 6. Sistema de archivos en web

Endpoint para navegar, crear, leer y borrar archivos desde el dashboard.

### Backend

```javascript
const ALLOWED_PREFIXES = ['/persist', '/root', '/hermes-home'];
const PROTECTED_PATHS = ['server.js', 'index.html', 'package.json', 'package-lock.json', 'node_modules'];

// Listar directorio
app.get('/api/files', (req, res) => {
  const dirPath = path.resolve(req.query.path || '/persist');
  if (!ALLOWED_PREFIXES.some(p => dirPath.startsWith(p))) return res.status(403).json({ error: 'Acceso denegado' });
  // ... leer directorio y devolver archivos con nombre, tamaño, fecha, tipo
});

// Leer archivo
app.get('/api/files/read', (req, res) => {
  const filePath = path.resolve(req.query.path || '');
  // ... validar, leer y devolver contenido
});

// Crear directorio
app.post('/api/files/mkdir', (req, res) => {
  if (req.headers['x-auth-confirm'] !== DASH_PASSWORD) return res.status(403).json({ error: 'Re-auth required' });
  // ... crear directorio
});

// Escribir archivo
app.post('/api/files/write', (req, res) => {
  if (req.headers['x-auth-confirm'] !== DASH_PASSWORD) return res.status(403).json({ error: 'Re-auth required' });
  // ... escribir archivo
});

// Borrar
app.post('/api/files/delete', (req, res) => {
  if (req.headers['x-auth-confirm'] !== DASH_PASSWORD) return res.status(403).json({ error: 'Re-auth required' });
  // ... validar que no sea protegido, borrar
});
```

### Frontend

Renderiza directorios con breadcrumbs, permisos y acciones:

```javascript
function loadFiles(dir) {
  api('/api/files?path=' + encodeURIComponent(dir)).then(files => {
    // Renderizar breadcrumbs + tabla con iconos, nombres, tamaños
    // Cada archivo/directorio clickeable
  });
}
```

## 7. Barra de estado en vivo

Una barra fina en la parte superior que se actualiza cada 10 segundos:

```html
<div id="liveBar" style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px;">
  <span id="liveDot" style="width:8px;height:8px;border-radius:50%;background:#16a34a;"></span>
  <span id="liveModel" style="color:#fff;"></span>
  <span style="color:var(--nz-text-muted);">|</span>
  <span id="liveMem" style="color:var(--nz-text-muted);"></span>
  <span style="color:var(--nz-text-muted);">|</span>
  <span id="liveUptime" style="color:var(--nz-text-muted);"></span>
  <span id="livePlatforms" style="margin-left:auto;color:var(--nz-text-muted);"></span>
</div>
```

JS:
```javascript
function updateLiveBar() {
  api('/api/agent').then(d => {
    document.getElementById('liveDot').style.background = d.status === 'activo' ? '#16a34a' : '#dc2626';
    document.getElementById('liveModel').textContent = d.model || '—';
    document.getElementById('liveMem').textContent = '💾 ' + (d.memUsed || '?') + '/' + (d.memSize || '?');
    const up = d.uptime || 0;
    document.getElementById('liveUptime').textContent = '⏱️ ' + Math.floor(up/3600) + 'h ' + Math.floor((up%3600)/60) + 'm';
    document.getElementById('livePlatforms').textContent = '📱 ' + (d.platforms || []).join(' · ');
  }).catch(() => { document.getElementById('liveDot').style.background = '#dc2626'; });
}
setInterval(updateLiveBar, 10000);
```

## 8. Calendario de sesiones

Usa el endpoint `/api/brain` que devuelve sesiones del agente con fecha y nombre:

```javascript
// Backend
app.get('/api/brain', (req, res) => {
  const sessionsDir = '/hermes-home/sessions';
  const sessions = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => {
      const stats = fs.statSync(path.join(sessionsDir, f));
      // Parsear fecha del nombre del archivo: 20260523_183102_c2d464.jsonl
      const m = f.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_/);
      return {
        id: f,
        date: m ? `${m[1]}-${m[2]}-${m[3]}` : '?',
        time: m ? `${m[4]}:${m[5]}` : '?',
        sizeKB: Math.round(stats.size / 1024)
      };
    })
    .sort((a, b) => b.id.localeCompare(a.id));
  res.json({ sessions });
});
```

El frontend renderiza un grid mensual con días coloreados según actividad.

## 9. Selector de modelos IA

Endpoint para cambiar el modelo activo del agente:

```javascript
app.post('/api/config/set-model', (req, res) => {
  const { model, provider } = req.body;
  const configPath = '/hermes-home/config.yaml';
  let cfg = fs.readFileSync(configPath, 'utf8');
  if (model) cfg = cfg.replace(/^(\s*default:\s*).+/m, `$1${model}`);
  if (provider || model) cfg = cfg.replace(/^(\s*provider:\s*).+/m, `$1${provider || 'custom'}`);
  fs.writeFileSync(configPath, cfg, 'utf8');
  res.json({ success: true, model, message: `Modelo cambiado a ${model}. Requiere reinicio del agente.` });
});
```

**⚠️ Nota importante**: Cambiar el modelo en config.yaml NO reinicia el agente automáticamente. Para que el cambio sea efectivo, hay que reiniciar Hermes manualmente.

Modelos disponibles (según tu provider):
```javascript
const MODELS = [
  { model: 'deepseek-v4-flash', label: '⚡ DeepSeek V4 Flash', default: true },
  { model: 'qwen3.6', label: '🧠 Qwen 3.6' },
  { model: 'gemma4', label: '🎨 Gemma 4' }
];
```

## 10. Monitor de tokens

Lee la SQLite de Hermes para mostrar estadísticas de consumo por sesión, modelo y fuente.

### Backend (script Python)

Guarda esto como `/persist/nan-dashboard/token-query.py`:

```python
import sqlite3, json, sys
from datetime import datetime, timedelta

db_path = '/hermes-home/state.db'
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

now = datetime.now()
day_ago = (now - timedelta(days=1)).timestamp()
week_ago = (now - timedelta(days=7)).timestamp()
month_ago = (now - timedelta(days=30)).timestamp()

rows = conn.execute(
    'SELECT started_at, input_tokens, output_tokens, estimated_cost_usd, actual_cost_usd, model, source FROM sessions WHERE started_at > ? ORDER BY started_at DESC',
    (month_ago,)
).fetchall()

def init_p(): return {'input': 0, 'output': 0, 'cost': 0, 'sessions': 0}

breakdown = {'today': init_p(), 'week': init_p(), 'month': init_p(), 'total': init_p()}
by_model = {}
by_source = {}
daily_raw = []

for r in rows:
    inp = r['input_tokens'] or 0
    out = r['output_tokens'] or 0
    cost = r['estimated_cost_usd'] or 0
    ts = r['started_at']
    model = r['model'] or 'desconocido'
    source = r['source'] or 'desconocido'
    
    for period, cond in [('today', ts > day_ago), ('week', ts > week_ago), ('month', True)]:
        if cond:
            breakdown[period]['input'] += inp
            breakdown[period]['output'] += out
            breakdown[period]['cost'] += cost
            breakdown[period]['sessions'] += 1
    
    for d in [by_model, by_source]:
        key = model if d is by_model else source
        if key not in d: d[key] = init_p()
        d[key]['input'] += inp
        d[key]['output'] += out
        d[key]['cost'] += cost
        d[key]['sessions'] += 1
    
    daily_raw.append({
        'date': datetime.fromtimestamp(ts).strftime('%Y-%m-%d'),
        'model': model, 'input': inp, 'output': out, 'cost': cost
    })

# Añadir total
breakdown['total'] = {k: breakdown['month'][k] for k in breakdown['month']}
breakdown['total']['sessions'] = breakdown['month']['sessions']

# Agrupar por día
daily_agg = {}
for d in daily_raw:
    if d['date'] not in daily_agg:
        daily_agg[d['date']] = {'date': d['date'], 'input': 0, 'output': 0, 'cost': 0, 'sessions': 0}
    daily_agg[d['date']]['input'] += d['input']
    daily_agg[d['date']]['output'] += d['output']
    daily_agg[d['date']]['cost'] += d['cost']
    daily_agg[d['date']]['sessions'] += 1

result = {
    'breakdown': breakdown,
    'by_model': by_model,
    'by_source': by_source,
    'daily': sorted(daily_agg.values(), key=lambda x: x['date'], reverse=True)[:30]
}
print(json.dumps(result))
conn.close()
```

### Endpoint en Express

```javascript
const TOKEN_SCRIPT = path.join(__dirname, 'token-query.py');
app.get('/api/tokens', (req, res) => {
  try {
    const raw = execSync(`python3 ${TOKEN_SCRIPT}`, { encoding: 'utf8', timeout: 5000 });
    res.json(JSON.parse(raw.trim()));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
```

### Frontend

Muestra:
- **3 tarjetas métricas**: Hoy in (azul), Hoy out (verde), Semana in (naranja)
- **Por modelo**: cada modelo con su input/output/sesiones
- **Por fuente**: Telegram vs WebUI
- **Últimos 7 días**: tabla día a día

## 11. Visor de memoria del agente

Lee los archivos de memoria persistente de Hermes (`/hermes-home/memories/`).

```javascript
app.get('/api/memory', (req, res) => {
  const memDir = '/hermes-home/memories';
  if (!fs.existsSync(memDir)) return res.json({ entries: [] });
  
  const entries = [];
  for (const f of fs.readdirSync(memDir)) {
    if (f.endsWith('.lock')) continue;
    const fp = path.join(memDir, f);
    if (!fs.statSync(fp).isFile()) continue;
    const content = fs.readFileSync(fp, 'utf8');
    const blocks = content.split('§').map(b => b.trim()).filter(Boolean);
    entries.push({
      target: f === 'MEMORY.md' ? 'memory' : 'user',
      content: blocks.join('\n---\n').slice(0, 300),
      chars: content.length,
      updated: (new Date(fs.statSync(fp).mtime)).toISOString().slice(0, 10)
    });
  }
  res.json({ entries, total: entries.length });
});
```

## 12. Tareas programadas (cron)

Lee los cronjobs de Hermes desde `/hermes-home/cron/jobs.json`:

```javascript
app.get('/api/cron', (req, res) => {
  const jobsFile = '/hermes-home/cron/jobs.json';
  const outDir = '/hermes-home/cron/output';
  let jobs = [];
  if (fs.existsSync(jobsFile)) {
    try {
      const raw = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
      jobs = (raw.jobs || []).map(j => ({
        id: j.id, name: j.name || j.id?.slice(0, 8) || '?',
        schedule: j.schedule?.expr || j.schedule || '',
        lastRun: null, nextRun: null
      }));
    } catch (e) {}
  }
  // Revisar outputs para timestamps
  if (fs.existsSync(outDir)) {
    for (const j of jobs) {
      const logFile = path.join(outDir, j.id + '.json');
      if (fs.existsSync(logFile)) {
        try {
          const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
          j.lastRun = log.completed_at || null;
        } catch (e) {}
      }
    }
  }
  res.json({ jobs, total: jobs.length });
});
```

Tareas típicas que puedes crear desde Telegram:

| Tarea | Horario | Función |
|-------|---------|---------|
| ☀️ Daily briefing | 8:00 AM | Estado del sistema + GitHub + skills |
| 🔍 System watchdog | cada 6h | Alerta si disco >80%, RAM >80% |
| 🪙 Token watchdog | cada 3h | Alerta si consumo excede límites |

## 13. Proxy para segunda app (NAP)

NaN.builders solo da **una exposición HTTP** por microVM. Para servir múltiples apps, usa path-based routing con proxy nativo (sin dependencias):

```javascript
// Añadir al principio de server.js
const http = require('http');

// Antes de express.static() y app.get('*')
app.use('/nap', (req, res) => {
  const targetPath = req.originalUrl.replace(/^\/nap/, '') || '/';
  const opts = {
    hostname: 'localhost',
    port: 3000,  // Puerto de la app secundaria
    path: targetPath,
    method: req.method,
    headers: { ...req.headers }
  };
  delete opts.headers['host'];
  
  const pr = http.request(opts, prRes => {
    // ⚠️ Reescritura de rutas absolutas en HTML
    const ct = (prRes.headers['content-type'] || '');
    if (ct.includes('text/html')) {
      let body = '';
      prRes.on('data', chunk => body += chunk.toString());
      prRes.on('end', () => {
        body = body.replace(/src="\//g, 'src="/nap/').replace(/href="\//g, 'href="/nap/');
        delete prRes.headers['content-length'];
        res.writeHead(prRes.statusCode, prRes.headers);
        res.end(body);
      });
      return;
    }
    res.writeHead(prRes.statusCode, prRes.headers);
    prRes.pipe(res);
  });
  pr.on('error', () => res.status(502).json({ error: 'App no disponible' }));
  req.pipe(pr);
});
```

**⚠️ Limitación**: `req.pipe()` no reenvía el body de POST si `express.json()` lo consumió antes. Para POST completos, usa `http-proxy-middleware` (npm).

## 14. Servicios: qué puertos están abiertos

Lee `/proc/net/tcp` + `/proc/net/tcp6` para detectar puertos en escucha (sin necesidad de `netstat` o `ss`):

```javascript
app.get('/api/services', (req, res) => {
  const listening = [];
  const seen = new Set();
  
  const parseProc = (file) => {
    try {
      const raw = fs.readFileSync(file, 'utf8').trim().split('\n').slice(1);
      for (const line of raw) {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 4 || parts[3] !== '0A') continue;
        const hexPort = parts[1].split(':')[1];
        const port = parseInt(hexPort, 16);
        if (!port || port === 0) continue;
        const key = '0.0.0.0:' + port;
        if (!seen.has(key)) { seen.add(key); listening.push({ port, protocol: 'tcp', local: key }); }
      }
    } catch (e) {}
  };
  
  parseProc('/proc/net/tcp');   // IPv4
  parseProc('/proc/net/tcp6');  // IPv6
  
  // Procesos
  const processes = [];
  try {
    const psRaw = execSync('ps aux --sort=-%cpu | head -15', { encoding: 'utf8' }).trim().split('\n');
    for (const l of psRaw.slice(1)) {
      const parts = l.trim().split(/\s+/);
      if (parts.length > 10) processes.push({ user: parts[0], cpu: parts[2], mem: parts[3], cmd: parts.slice(10).join(' ').slice(0, 80) });
    }
  } catch (e) {}
  
  res.json({ listening, topProcesses: processes });
});
```

**⚠️ Importante**: Node.js escucha en IPv6 por defecto. Solo leer `/proc/net/tcp` (IPv4) no detecta el puerto del dashboard ni de otras apps modernas. Siempre leer ambos: tcp + tcp6.

## 15. Git y despliegue

```bash
# Inicializar repo
cd /persist/nan-dashboard
git init
git add -A
git commit -m "init: dashboard de control personal"

# Crear repo en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/nan-dashboard.git
git push -u origin main
```

Para mantener el servidor corriendo:

```bash
# Arrancar en background
cd /persist/nan-dashboard && source /root/.env 2>/dev/null && node server.js &

# Para exponerlo:
# 1. Ve a cloud.nan.builders → tu microVM → Web/HTTP
# 2. Añade exposición: puerto 4000
# 3. Accede: https://tunombre.apps.nan.builders
```

Para actualizar tras cambios:
```bash
cd /persist/nan-dashboard && git pull && fuser -k 4000/tcp 2>/dev/null
cd /persist/nan-dashboard && source /root/.env 2>/dev/null && node server.js &
```

## 16. Buenas prácticas y pitfalls

### ✅ Haz esto

- **Auth scoped a `/api/*`** — si proteges todo el sitio, el navegador muestra un popup HTTP Basic feo antes de que tu login personalizado cargue
- **Re-auth en operaciones destructivas** — pedir contraseña otra vez antes de borrar o modificar archivos
- **Puertos IPv6** — Node.js escucha en IPv6. Siempre leer `/proc/net/tcp6` además de tcp4
- **Proxy HTML rewrite** — las SPAs con rutas absolutas (`/assets/...`) necesitan reescritura cuando se sirven detrás de un prefijo como `/nap/`
- **Token query vía Python** — `better-sqlite3` tarda 60s+ en compilar. Python tiene sqlite3 nativo
- **Kill antes de restart** — siempre `fuser -k 4000/tcp` antes de arrancar de nuevo, o el puerto se queda ocupado

### ❌ No hagas esto

- **No instales `better-sqlite3`** — tarda una eternidad en compilar y puede fallar. Usa Python
- **No protejas archivos estáticos con auth** — el navegador intercepta con popup nativo
- **No uses `netstat` o `ss`** — no están disponibles en la microVM. Usa `/proc/net/tcp`
- **No asumas que el puerto está libre** — mata el proceso anterior primero
- **No pongas claves API en el código** — usa variables de entorno (`/root/.env` o NaN Env tab)
- **No olvides la reescritura de HTML en proxies** — los assets con ruta absoluta se rompen

### Variables de entorno importantes

```bash
# En /root/.env (para uso en terminal) o en NaN Env tab (persistente)
DASH_PASSWORD="tu-contraseña-segura"
GITHUB_TOKEN="ghp_..."
NAP_API_KEY="..."
ESIOS_API_TOKEN="..."
```

### Comandos útiles

```bash
# Ver logs del agente
tail -f /hermes-home/logs/agent.log

# Ver tareas programadas
cat /hermes-home/cron/jobs.json

# Ver sesiones recientes
ls -lt /hermes-home/sessions/ | head -10

# Ver memoria del agente
cat /hermes-home/memories/MEMORY.md

# Ver configuración
cat /hermes-home/config.yaml

# Matar proceso en puerto
fuser -k 4000/tcp

# Ver consumo de disco
df -h /
```

---

**¿Algo que mejorar?** Abre un issue en [github.com/Ntizar/nan-dashboard](https://github.com/Ntizar/nan-dashboard)

**¿Te sirvió esta guía?** Compártela con quien quiera montar su propio centro de control en NaN.builders.