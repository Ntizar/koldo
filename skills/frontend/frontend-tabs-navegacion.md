---
name: frontend-tabs-navegacion
description: "Sistema de pestañas con navegación por teclado y redibujado de charts al cambiar de sección. Patrón para dashboards con múltiples vistas."
version: 1.0.0
author: Ntizar
---

# Sistema de Pestañas + Atajos de Teclado

Patrón para dashboards con múltiples secciones (tabs), navegación por teclado y redibujado automático de charts.

## Tabs

```javascript
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.bound === 'true') return;  // Evitar doble binding
    btn.dataset.bound = 'true';
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      AppState.activeTab = tab;
      saveState();

      // Actualizar UI
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-section').forEach(s => {
        s.classList.toggle('active', s.id === 'section-' + tab);
      });

      // Redibujar charts (necesario porque Chart.js no auto-redimensiona en hidden)
      setTimeout(() => {
        Object.values(charts).forEach(c => {
          if (c && c.resize) c.resize();
        });
      }, 50);
    });
  });
}
```

## Atajos de teclado

```javascript
function setupKeyboardShortcuts() {
  if (window.__shortcutsBound) return;
  window.__shortcutsBound = true;

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    const currentDate = AppState.fecha || getTodayStr();

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        AppState.fecha = shiftDate(currentDate, -1);
        cargarDatos();
        break;
      case 'ArrowRight':
        e.preventDefault();
        AppState.fecha = shiftDate(currentDate, 1);
        cargarDatos();
        break;
      case 't':
      case 'T':
        e.preventDefault();
        AppState.fecha = getTodayStr();
        cargarDatos();
        break;
      case 'y':
      case 'Y':
        e.preventDefault();
        AppState.fecha = shiftDate(getTodayStr(), -1);
        cargarDatos();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        cargarDatos();
        break;
    }
  });
}
```

## HTML mínimo

```html
<div class="tabs">
  <button class="tab-btn active" data-tab="resumen">📊 Resumen</button>
  <button class="tab-btn" data-tab="precio">💰 Precio</button>
  <button class="tab-btn" data-tab="demanda">📈 Demanda</button>
</div>

<div class="tab-section active" id="section-resumen">...</div>
<div class="tab-section" id="section-precio">...</div>
<div class="tab-section" id="section-demanda">...</div>
```

## Buenas prácticas

1. **Dataset binding guard** — `btn.dataset.bound` para evitar listeners duplicados
2. **Redibujar charts al cambiar** — Chart.js no se redimensiona en display:none
3. **setTimeout para resize** — esperar a que el DOM actualice el tamaño
4. **Atajos no intrusivos** — no capturar teclas si el foco está en un input
5. **Guard de inicialización** — `window.__shortcutsBound` para no duplicar shortcuts

## Pitfalls

- ❌ No redibujar charts al cambiar tab → gráficos con tamaño incorrecto
- ❌ Listeners duplicados → múltiples eventos por click
- ❌ Atajos capturan teclas en inputs → imposible escribir en date input

## Referencia

- Código real: `public/js/ui.js` del proyecto ESIOS Dashboard
- Skills relacionadas: frontend-estado-persistencia, frontend-orquestacion-carga