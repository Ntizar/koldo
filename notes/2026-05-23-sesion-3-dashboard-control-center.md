---
nombre: Sesión Dashboard Control Center
tipo: nota
fecha: 2026-05-23
tags: [dashboard, aurora, file-manager, seguridad, liquid-glass]
---

# Sesión 3 — Dashboard Control Center con Aurora Liquid Glass

## Logros

1. **Añadido gestor de archivos completo** al dashboard
   - Navegación por carpetas con breadcrumbs
   - Crear carpetas y archivos desde el navegador
   - Borrar con re-autenticación y confirmación
   - Rutas seguras: solo /persist, /root, /hermes-home

2. **Seguridad mejorada**
   - Auth middleware ahora solo protege `/api/*` (la página HTML carga sin auth)
   - Re-autenticación (X-Auth-Confirm) para operaciones destructivas
   - Path traversal protection
   - No se puede borrar proyectos principales ni sobreescribir el dashboard
   - Audit log de todas las acciones

3. **Enlaces a GitHub** en cada repo (clickable)

4. **Skills interactivas** — click para ver contenido en modal + ayuda contextual

5. **Integración Ntizar-Aurora Liquid Glass**
   - CDN: `ntizar.css` desde jsdelivr
   - Tema oscuro con fondo `#0a0e1c` (azul marino, no negro)
   - Tarjetas glass con backdrop-filter blur
   - Gradientes azul+naranja (brand + accent)
   - Botones con gradientes `nz-btn--primary` (azul) y `nz-btn--accent` (naranja)
   - Diseño responsive

6. **Creada skill Koldo**: `dashboard-control-center.md` con documentación completa

## Problemas encontrados y soluciones

- **Bad password tras cambiar contraseña**: el auth middleware bloqueaba el HTML de login. Solución: middleware solo en `/api/*`
- **EADDRINUSE**: al matar procesos, fallaba porque `lsof` no estaba instalado. Solución: `fuser -k 4000/tcp`
- **Skills/read devolvía HTML**: el servidor anterior (sin el endpoint) seguía corriendo. Solución: matar proceso explícitamente

## Pendiente

- [ ] Migrar API keys de /root/.env a NaN Cloud Env tab
- [ ] Exponer NAP Dashboard en `ntizar.apps.nan.builders/nap/` via reverse proxy
- [ ] Sección Config: modelo activo, proveedor, TTS/STT
- [ ] Sección Cron: tareas programadas
- [ ] Editor de texto en el navegador
- [ ] Subida de archivos drag&drop
- [ ] X/Twitter OAuth (pospuesto)

## Contraseñas activas

- NaN Dashboard: `$Nan603060`
- Admin dashboard login: `admin` + pass (campo único)