# Plan: Portfolio de Apps en NaN Spaces

> **Fecha:** 2026-05-25
> **Autor:** Koldo
> **Para:** Ntizar

---

## 🎯 Visión

Crear un **portfolio de apps** en `https://ntizar-ntizar.apps.nan.builders/` que funcione como:

1. **Página pública** — Un directorio de links a tus apps (portfolio profesional)
2. **Dashboard privado** — Panel de control con contraseña (estado de Hermes, métricas, kanban)
3. **Directorio de apps** — Cada app es un Space independiente en NaN, y el portfolio las lista

Cada nueva app que crees se añade al portfolio automáticamente. Es como un "inicio" personal pero profesional.

---

## 🏗️ Arquitectura

```
https://ntizar-ntizar.apps.nan.builders/
│
├── /                    → Página pública (portfolio de apps)
├── /admin               → Dashboard privado (login + contraseña)
│   ├── /admin/status    → Estado de Hermes en tiempo real
│   ├── /admin/kanban    → Tablero de tareas
│   ├── /admin/metrics   → Métricas y gráficos
│   └── /admin/actions   → Acciones rápidas (backup, sync, etc.)
│
├── https://esios.ntizar-ntizar.apps.nan.builders/  → ESIOS Dashboard (migrado)
├── https://koldo.ntizar-ntizar.apps.nan.builders/  → Koldo visor (ya existe)
├── https://monitor.ntizar-ntizar.apps.nan.builders/ → Hermes Monitor (futuro)
└── ... (cada nueva app en su propio subdominio)
```

### Principios de diseño:

1. **Cada app es un Space independiente** — deploy automático con Kaniko
2. **El portfolio es la puerta de entrada** — lista todas las apps con iconos, descripciones y estado
3. **Página pública = portfolio profesional** — muestra tus apps al mundo
4. **Página privada = centro de control** — solo tú, con contraseña
5. **Registro de apps automático** — cada app se registra en un `apps.json` central

---

## 📋 Componentes

### 1. Portfolio App (la principal)

**Repositorio:** `Ntizar/portfolio` (nuevo Space)

**Tecnología:**
- Frontend: HTML + CSS + JS vanilla (ligero, sin dependencias)
- Backend: Python FastAPI (para API de apps y auth)
- Deploy: Docker + Kaniko en NaN Spaces
- Puerto: 8080 (estándar NaN)

**Funcionalidades:**

#### Página pública (`/`):
- **Hero section** — "Ntizar — Developer & AI Engineer"
- **Grid de apps** — Tarjetas con icono, nombre, descripción, link, estado
- **Filtros** — Por categoría (Data, AI, Tools, Monitoring)
- **Footer** — Links a GitHub, Telegram, etc.
- **Diseño** — Moderno, oscuro, profesional (estilo Linear/Vercel)

#### Página privada (`/admin`):
- **Login** — Usuario + contraseña (Basic Auth o session)
- **Dashboard** — Estado de todas las apps
- **Kanban** — Tareas pendientes
- **Métricas** — Gráficos de actividad
- **Acciones** — Backup, sync, reiniciar, etc.

#### API (`/api/`):
- `GET /api/apps` — Lista todas las apps registradas
- `GET /api/apps/:name` — Info de una app específica
- `POST /api/apps/register` — Registrar una nueva app (desde el deploy)
- `GET /api/health` — Health check (sin auth)
- `GET /api/metrics` — Métricas del sistema

### 2. ESIOS Dashboard (migrado)

**Repositorio:** `Ntizar/esios-dashboard` (nuevo Space, bifurcado de esios-work)

**Tecnología:**
- Backend: Node.js + Express (el actual server.js)
- Frontend: HTML + CSS + JS (el actual public/index.html)
- Puerto: 3500
- Deploy: Docker + Kaniko

**URL:** `https://esios.ntizar-ntizar.apps.nan.builders/`

**Cambios:**
- Añadir `.env` con ESIOS_API_TOKEN y NAN_API_KEY en el Space
- Añadir al portfolio como app "ESIOS Dashboard"
- Mover el repo actual a un nuevo repo dedicado

### 3. Koldo Visor (actual)

**Repositorio:** `Ntizar/Koldo` (ya existe)

**URL:** `https://koldo.apps.nan.builders/` (o `https://koldo.ntizar-ntizar.apps.nan.builders/`)

**Cambios:**
- Actualizar URL en el portfolio
- Mantener como está (funciona bien)

### 4. Hermes Monitor (futuro)

**Repositorio:** `Ntizar/hermes-monitor` (nuevo)

**Tecnología:**
- Python + FastAPI
- Puerto: 8080
- Deploy: Docker + Kaniko

**URL:** `https://monitor.ntizar-ntizar.apps.nan.builders/`

**Funcionalidades:**
- Estado de Hermes en tiempo real
- Alertas por Telegram
- Historial de actividad
- Gráficos de métricas

---

## 🎨 Diseño del Portfolio Público

### Inspiración:
- **Linear.app** — Diseño limpio, oscuro, profesional
- **Vercel.com** — Grid de productos, animaciones sutiles
- **Stripe.com** — Secciones claras, CTAs prominentes

### Estructura:

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] Ntizar                    [GitHub] [Telegram]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Developer & AI Engineer                                │
│  Construyendo herramientas con IA y datos               │
│                                                         │
│  [Ver portfolio] [Contactar]                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📦 Apps                                                │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ ⚡ ESIOS     │ │ 🧠 Koldo     │ │ 📊 Monitor   │    │
│  │ Dashboard    │ │ Visor        │ │ Hermes       │    │
│  │ Energía España│ │ Notas + Skills│ │ Monitoring  │    │
│  │ [Abrir →]   │ │ [Abrir →]   │ │ [Abrir →]   │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🛠️ Herramientas                                        │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐                     │
│  │ 🔍 Search    │ │ 📝 Blog      │                     │
│  │ Code         │ │ Posts       │                     │
│  │ [Abrir →]   │ │ [Abrir →]   │                     │
│  └──────────────┘ └──────────────┘                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  © 2026 Ntizar · Hecho con 🤖 y ☕                      │
└─────────────────────────────────────────────────────────┘
```

### Colores:
- **Fondo:** #0a0e14 (casi negro)
- **Cards:** #161b22 (gris oscuro)
- **Bordes:** #21262d (gris medio)
- **Acento:** #58a6ff (azul)
- **Éxito:** #3fb950 (verde)
- **Alerta:** #d29922 (amarillo)
- **Error:** #f85149 (rojo)
- **Texto:** #c9d1d9 (gris claro)
- **Secundario:** #8b949e (gris medio)

---

## 🔐 Sistema de Autenticación

### Opción A: Basic Auth (simple, rápido)
- Usuario: `admin`
- Password: variable de entorno en el Space
- Se solicita al acceder a `/admin`
- **Ventaja:** Implementación en 5 minutos
- **Desventaja:** Menos flexible

### Opción B: Session-based (más profesional)
- Formulario de login en `/admin/login`
- Cookie de sesión con token seguro
- Password hash con bcrypt
- **Ventaja:** Más seguro, más control
- **Desventaja:** Un poco más de código

**Recomendación:** Empezar con **Opción A** (Basic Auth) y migrar a B si hace falta.

---

## 📦 Registro de Apps

Cada app se registra en un archivo `apps.json` central que el portfolio lee:

```json
{
  "apps": [
    {
      "name": "esios",
      "title": "ESIOS Dashboard",
      "description": "Datos energéticos de España en tiempo real",
      "url": "https://esios.ntizar-ntizar.apps.nan.builders/",
      "icon": "⚡",
      "category": "data",
      "status": "active",
      "color": "#3fb950",
      "featured": true
    },
    {
      "name": "koldo",
      "title": "Koldo Visor",
      "description": "Notas, skills y memoria de Koldo",
      "url": "https://koldo.apps.nan.builders/",
      "icon": "🧠",
      "category": "tools",
      "status": "active",
      "color": "#58a6ff",
      "featured": true
    },
    {
      "name": "monitor",
      "title": "Hermes Monitor",
      "description": "Estado y métricas de Hermes en tiempo real",
      "url": "https://monitor.ntizar-ntizar.apps.nan.builders/",
      "icon": "📊",
      "category": "monitoring",
      "status": "planned",
      "color": "#d29922",
      "featured": false
    }
  ]
}
```

**Registro automático:** Cuando se deploya una nueva app, puede hacer un POST a `/api/apps/register` para añadirse automáticamente al portfolio.

---

## 🚀 Plan de Implementación

### Fase 1: Portfolio Base (Día 1)

**Objetivo:** Tener el portfolio público funcionando

1. Crear repo `Ntizar/portfolio`
2. Crear frontend HTML/CSS/JS (página pública)
3. Crear backend FastAPI (API de apps + auth)
4. Crear Dockerfile (nginx + python)
5. Deploy en NaN Spaces
6. Configurar URL: `https://ntizar-ntizar.apps.nan.builders/`

**Tiempo estimado:** 2-3 horas

### Fase 2: Dashboard Privado (Día 1-2)

**Objetivo:** Añadir panel de control con contraseña

1. Añadir página `/admin` con login
2. Integrar métricas de Hermes (gateway_state.json, logs)
3. Añadir kanban board
4. Añadir acciones rápidas
5. Añadir gráficos de actividad

**Tiempo estimado:** 3-4 horas

### Fase 3: Migrar ESIOS (Día 2)

**Objetivo:** Mover ESIOS a su propio Space

1. Crear repo `Ntizar/esios-dashboard`
2. Crear Dockerfile para ESIOS
3. Configurar env vars (ESIOS_API_TOKEN, NAN_API_KEY)
4. Deploy en NaN Spaces
5. Añadir al portfolio

**Tiempo estimado:** 1-2 horas

### Fase 4: Pulir y Expandir (Día 3+)

**Objetivo:** Mejorar diseño y añadir más apps

1. Animaciones y transiciones
2. Modo responsive completo
3. Añadir más apps (monitor, blog, etc.)
4. SEO y metadatos
5. Analytics básico

**Tiempo estimado:** 2-3 horas

---

## 📁 Estructura del Repo Portfolio

```
portfolio/
├── Dockerfile                    ← Build para NaN Spaces
├── apps.json                     ← Registro de apps (generado/actualizado)
├── public/                       ← Frontend estático
│   ├── index.html                ← Página principal
│   ├── admin.html                ← Dashboard privado
│   ├── css/
│   │   ├── main.css              ← Estilos globales
│   │   ├── portfolio.css         ← Estilos página pública
│   │   ├── admin.css             ← Estilos dashboard
│   │   └── cards.css             ← Estilos tarjetas de apps
│   └── js/
│       ├── main.js               ← Lógica principal
│       ├── portfolio.js          ← Lógica página pública
│       ├── admin.js              ← Lógica dashboard
│       └── chart.js              ← Gráficos (Chart.js CDN)
├── api/                          ← Backend FastAPI
│   ├── main.py                   ← FastAPI app
│   ├── apps.py                   ← Endpoints de apps
│   ├── auth.py                   ← Autenticación
│   ├── metrics.py                ← Métricas de Hermes
│   └── kanban.py                 ← Kanban integration
├── .deploy/                      ← Config de deploy
│   ├── nginx.conf                ← Nginx config
│   ├── docker-entrypoint.sh      ← Entrypoint
│   └── healthcheck.sh            ← Health check
└── README.md
```

---

## 🔗 URLs Finales Esperadas

| App | URL | Estado |
|-----|-----|--------|
| **Portfolio** | `https://ntizar-ntizar.apps.nan.builders/` | 🟢 Planificado |
| **ESIOS** | `https://esios.ntizar-ntizar.apps.nan.builders/` | 🔴 Migrar |
| **Koldo** | `https://koldo.ntizar-ntizar.apps.nan.builders/` | 🟢 Ya existe |
| **Monitor** | `https://monitor.ntizar-ntizar.apps.nan.builders/` | ⚪ Futuro |

---

## 💡 Ideas Extra

### 1. **App de la semana**
Destacar una app diferente cada semana en la página principal.

### 2. **Changelog**
Un `/changelog` que muestre las últimas actualizaciones de todas las apps.

### 3. **Dark/Light mode**
Toggle para cambiar entre tema oscuro y claro.

### 4. **API pública**
Exponer un `/api/public/apps` que cualquier persona pueda consultar (para mostrar tus apps en otros sitios).

### 5. **Estadísticas de uso**
Contador de visitas por app (con privacy-first, sin cookies).

### 6. **Temas personalizables**
Permitir cambiar el color de acento (azul, verde, púrpura, etc.).

---

## ✅ Checklist

- [ ] Crear repo `Ntizar/portfolio`
- [ ] Diseñar frontend (HTML/CSS/JS)
- [ ] Crear backend FastAPI
- [ ] Implementar página pública
- [ ] Implementar página privada (/admin)
- [ ] Crear Dockerfile
- [ ] Deploy en NaN Spaces
- [ ] Configurar URL principal
- [ ] Registrar ESIOS en el portfolio
- [ ] Migrar ESIOS a su propio Space
- [ ] Pulir diseño y responsive
- [ ] Añadir más apps

---

*Plan creado por Koldo — 2026-05-25*
