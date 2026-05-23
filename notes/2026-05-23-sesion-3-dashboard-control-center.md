# Resumen sesión 23-05-2026 (tarde-noche)

## Dashboard completado (fase 1)

**URL**: https://nantizar-ntizar.apps.nan.builders
**Pass**: $Nan603060
**Repo**: Ntizar/nan-dashboard (privado)

### Secciones actuales

| Sección | Propósito |
|---------|-----------|
| 🟢 **Barra estado** | Modelo activo, RAM, uptime, plataformas (polls 10s) |
| 📅 **Calendario** | Histórico de sesiones, navegación meses, click en día |
| ⚙️ **Sistema** | CPU, RAM, discos con barras de progreso |
| 🤖 **Agente** | Modelo, proveedor, modelos disponibles (click = cambiar) |
| 🧠 **Cerebro** | Timeline sesiones + skills de Koldo |
| 🔐 **APIs** | Tokens configurados |
| 🧠 **Skills** | Skills del repo Koldo, clickables con modal |
| 🐙 **GitHub** | Todos los repos desde API web |
| ⚡ **Servicios** | Puertos abiertos + procesos activos (via /proc/net/tcp) |
| 📂 **Gestor** | Navegador de archivos, crear/borrar con re-auth |
| 📋 **Actividad** | Audit log del dashboard |

### Bugs corregidos
- Services endpoint: usaba `ss -tlnp` que no existe → cambiado a `/proc/net/tcp`
- Skills/read devolvía HTML por servidor viejo corriendo
- Indentación en regex split

### Pendiente
- [ ] Migrar API keys a NaN Cloud Env
- [ ] Exponer NAP en `nantizar-ntizar.apps.nan.builders/nap/` vía proxy
- [ ] Multi-agente: cuando haya más microVMs
- [ ] Sección Config: cambiar modelo, TTS, STT desde dashboard
- [ ] Editor de texto en navegador