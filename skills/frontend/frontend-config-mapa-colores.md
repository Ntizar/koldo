---
name: frontend-config-mapa-colores
description: "Mapas de configuración centralizados con colores, etiquetas y órdenes para tecnologías/indicadores. Patrón para dashboards con múltiples series visuales."
version: 1.0.0
author: Ntizar
---

# Mapas de Configuración para Dashboards

Patrón para centralizar la configuración visual de todas las series/indicadores de un dashboard en un solo lugar.

## techMap — Mapa de tecnologías

```javascript
const techMap = {
  hidraulica:      { label:'Hidráulica',      color:'#06b6d4', bg:'rgba(6,182,212,0.7)', order:0 },
  eolica:          { label:'Eólica',           color:'#22c55e', bg:'rgba(34,197,94,0.7)', order:1 },
  solarFV:         { label:'Solar FV',         color:'#fbbf24', bg:'rgba(251,191,36,0.7)', order:2 },
  nuclear:         { label:'Nuclear',          color:'#8b5cf6', bg:'rgba(139,92,246,0.7)', order:3 },
  cc:              { label:'C.Combinado',      color:'#f59e0b', bg:'rgba(245,158,11,0.7)', order:4 },
  carbon:          { label:'Carbón',           color:'#6b7280', bg:'rgba(107,114,128,0.7)', order:5 },
  cogeneracion:    { label:'Cogeneración',     color:'#0ea5e9', bg:'rgba(14,165,233,0.7)', order:6 },
  bateriaEntrega:  { label:'Bat. descarga',    color:'#a855f7', bg:'rgba(168,85,247,0.7)', order:14 },
  bombeoConsumo:   { label:'Bombeo carga',     color:'#0f766e', bg:'rgba(15,118,110,0.65)', order:15 },
  bateriaCarga:    { label:'Bat. carga',       color:'#6d28d9', bg:'rgba(109,40,217,0.65)', order:16 },
};
const techKeys = Object.keys(techMap);
```

## INDICATORS_CONFIG — Mapa de indicadores (tabla)

```javascript
const INDICATORS_CONFIG = {
  precio:          { key:'precio',           label:'Precio',          unit:'€/MWh', color:'#2563eb', tableVisible:true },
  demanda:         { key:'demanda',          label:'Demanda',         unit:'MW',   color:'#6366f1', tableVisible:true },
  demanda_prevista:{ key:'demanda_prevista', label:'Dem. Prevista',   unit:'MW',   color:'#f97316', tableVisible:true },
  eolica:          { key:'eolica',           label:'Eólica',          unit:'MW',   color:'#22c55e', tableVisible:true },
  solarFV:         { key:'solarFV',          label:'Solar FV',        unit:'MW',   color:'#fbbf24', tableVisible:true },
  nuclear:         { key:'nuclear',          label:'Nuclear',         unit:'MW',   color:'#8b5cf6', tableVisible:true },
  // ...
};
```

## Filtro de datos activos

```javascript
function activeTechKeys(s) {
  const valores = s?.valores || [];
  if (!valores.length) return [];
  return Object.keys(techMap).filter(key => {
    return valores.some(v => {
      const val = Number(v[key]);
      return Number.isFinite(val) && val > 0;
    });
  });
}
```

## Buenas prácticas

1. **Un solo lugar** — toda la configuración visual en config.js
2. **Colores con bg** — color para bordes/texto, bg (rgba) para rellenos de chart
3. **Campo order** — controlar el orden de apilamiento en stacked charts
4. **Filtro activo** — `activeTechKeys()` solo muestra tecnologías con datos
5. **tableVisible** — controlar qué columnas se muestran en la tabla horaria
6. **Exportable** — si se necesita en Node (tests), exportar con module.exports

## Pitfalls

- ❌ Colores hardcodeados en cada render → inconsistencia visual
- ❌ Sin campo order → Chart.js apila por orden alfabético
- ❌ Mostrar tecnologías sin datos → columnas vacías en la tabla
- ❌ bg y color iguales → series ilegibles en el chart

## Referencia

- Código real: `public/js/config.js` del proyecto ESIOS Dashboard
- Skills relacionadas: servicio-resumen-consolidado, frontend-tabs-navegacion