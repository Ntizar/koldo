---
name: frontend-estado-persistencia
description: "Patrón AppState con persistencia en URL hash + localStorage para dashboards vanilla JS. Estado centralizado con sincronización automática."
version: 1.0.0
author: Ntizar
---

# Estado y Persistencia en Frontend Vanilla JS

Patrón para gestionar estado de dashboard con tres fuentes sincronizadas: memoria (AppState), URL hash (compartible) y localStorage (persistente).

## AppState global

```javascript
const AppState = {
  fecha: '',
  activeTab: 'resumen',
  data: { summary: null, prediccion: null },
  ui: { loading: false, lastUpdated: null },
};
```

## Persistencia en URL hash

```javascript
function syncHashFromState() {
  const params = new URLSearchParams();
  if (AppState.fecha) params.set('fecha', AppState.fecha);
  if (AppState.activeTab) params.set('tab', AppState.activeTab);
  const nextHash = params.toString();
  const currentHash = window.location.hash.replace(/^#/, '');
  if (currentHash !== nextHash) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash ? '#' + nextHash : ''}`);
  }
}
```

## Persistencia en localStorage

```javascript
function saveState() {
  try {
    localStorage.setItem('dashboardState', JSON.stringify({
      fecha: AppState.fecha,
      activeTab: AppState.activeTab,
    }));
  } catch(e) {}
  syncHashFromState();
}

function loadState() {
  // 1. Restaurar desde URL hash (prioridad)
  try {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const hashFecha = hash.get('fecha');
    const hashTab = hash.get('tab');
    if (hashFecha) AppState.fecha = hashFecha;
    if (VALID_TABS.has(hashTab)) AppState.activeTab = hashTab;
  } catch(e) {}

  // 2. Restaurar desde localStorage (fallback)
  const saved = localStorage.getItem('dashboardState');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.fecha && !AppState.fecha) AppState.fecha = parsed.fecha;
      if (VALID_TABS.has(parsed.activeTab) && !hashOverride) AppState.activeTab = parsed.activeTab;
    } catch(e) {}
  }
}
```

## Jerarquía de fuentes

```
1. URL hash    → prioridad máxima (compartir enlace)
2. localStorage → si no hay hash (vuelta al dashboard)
3. Default     → fecha de hoy, tab 'resumen'
```

## Buenas prácticas

1. **Hash = estado visible** — el enlace se puede compartir y funciona
2. **localStorage = preferencias** — persiste sin ensuciar la URL
3. **replaceState** — no crear entradas en el historial del navegador
4. **Guardar solo lo necesario** — no guardar datos completos en localStorage
5. **Validación al cargar** — comprobar que la fecha/tab siguen siendo válidos

## Pitfalls

- ❌ Hash y localStorage en conflicto → uno debe tener prioridad (el hash)
- ❌ Guardar datos API en localStorage → tamaño excesivo
- ❌ No validar al cargar → fecha de ayer guardada pero hoy es otro día
- ❌ pushState en vez de replaceState → historial del navegador saturado

## Referencia

- Código real: `public/js/state.js` del proyecto ESIOS Dashboard
- Skills relacionadas: frontend-orquestacion-carga, frontend-tabs-navegacion