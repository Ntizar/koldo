# Patrón de Dashboards en Metabase

Los dashboards agrupan preguntas en tabs dentro de una sola página. Son reports compartibles que muestran datos relacionados con filtros, interactividad y suscripciones.

## Estructura de un Dashboard

Un dashboard contiene **cards** organizadas en una grid:
- **Questions** (charts) — desde collections o guardadas directamente
- **Text/Header cards** — Markdown formateado
- **Iframe cards** — embeber páginas externas (videos, spreadsheets)
- **Link cards** — links a otros items de Metabase o URLs externas

### Dashboard Tabs

Múltiples tabs para organizar cards. Se pueden duplicar tabs, mover cards entre tabs.

### Dashboard Width

- **Fixed width** (default): layout centrado consistente entre pantallas
- **Full width**: expande al ancho completo de la pantalla

### Dashboard Sections

Templates pre-organizados para acelerar el layout:
- **KPI Grid** — múltiples KPIs en grid
- **Large chart with KPIs to the right** — chart grande + KPIs
- **KPIs with large chart below** — KPIs arriba, chart abajo

## Dashboard Filters

En lugar de crear dashboards duplicados para cada corte de datos, usar widgets de filtro.

### Tipos de Widgets

#### Filter Widgets (qué datos mostrar)

| Tipo | Descripción |
|---|---|
| Date picker | Single date, date range, relative date, month/year, quarter/year |
| Location | City, State, ZIP/Postal, Country |
| ID | Input box para ID de usuario, orden, etc. |
| Number | Equal, not equal, between, >=, <= |
| Text/Category | Dropdown, search box, input box. Operators: is, is not, contains, etc. |
| Boolean | True/false filter |

#### Parameter Widgets (cómo mostrar los datos)

| Tipo | Descripción |
|---|---|
| Time grouping | Cambia granularidad temporal (month, week, day, quarter, year) sin filtrar datos |

### Niveles de Widgets

| Nivel | Alcance |
|---|---|
| **Dashboard** | Conectable a cards en TODOS los tabs |
| **Header** | Solo cards del mismo tab |
| **Card** | Solo su card individual |

**Default:** preferir widgets a nivel dashboard.

### Auto-connect Filters

Metabase auto-conecta filtros a cards con campos relevantes (incluyendo otros tabs). Se puede deshacer con la notificación o desconectar manualmente.

### Configurar Filtros

- **Rename** widget (label display)
- **Change type** (disconecta todas las cards)
- **Change operator** (depende del tipo)
- **Input type**: dropdown list, search box, plain input box
- **Multi-select**: checkboxes para múltiples valores
- **Selectable values**: from connected fields, from another model/question, custom list
- **Default value**: valor por defecto al cargar
- **Required**: siempre requiere un valor (previene queries masivas)

### Auto-apply Filters

Por defecto, cada cambio en un filtro refresca el dashboard. Se puede desactivar para aplicar manualmente con el botón **Apply**.

```
Dashboard → ⋮ → Edit settings → Toggle "Auto-apply filters"
```

### Linking Filters

Filtros que se filtran entre sí (ej: City filter se actualiza según State filter seleccionado).

## Dashboard Interactivity

### Custom Click Behavior

Configurar qué pasa al hacer click en una card:

| Opción | Descripción |
|---|---|
| Drill-through menu | Menú de drill-through (query builder only) |
| Custom destination | Ir a dashboard, pregunta guardada, o URL externa |
| Update dashboard filter | Usar el chart como "navigation question" para filtrar el dashboard |

### Custom Destinations

- Internos: dashboards y preguntas guardadas (mismo tab/ventana)
- Externos: URLs (nueva pestaña/ventana)
- **Passing values:** pasar valores de la card al destination (filters, SSO user attributes)
- **URL variables:** usar `{{ColumnName}}` en URLs externas

```
https://www.metabase.com/search.html?query={{Category}}
```

### Cross-filtering (Chart como Filtro)

Usar un chart como "navigation question" que actualiza un filtro del dashboard:

1. Dejar la navigation question **desconectada** del filtro
2. Conectar TODAS las demás preguntas al filtro
3. Configurar click behavior de la navigation para "Update a dashboard filter"
4. Mapear la columna del chart al filtro

## Fullscreen Mode

Para poner dashboards en pantallas/TVs:

```
Dashboard → ícono de fullscreen (flechas opuestas)
```

### URL Parameters para Fullscreen y Auto-refresh

```
https://metabase.mydomain.com/dash/2#refresh=60&fullscreen&night
```

| Parámetro | Descripción |
|---|---|
| `fullscreen` | Modo fullscreen |
| `refresh=60` | Auto-refresh cada 60 segundos |
| `night` | Modo oscuro |

**Nota:** Algunos navegadores requieren interacción del usuario para fullscreen real. Usar `fullscreen` + kiosk mode del navegador para cubrir toda la pantalla.

## Auto Refresh

Refrescar automáticamente el dashboard:

```
Dashboard → ícono de reloj → seleccionar intervalo
```

Intervalos: 1, 5, 10, 15, 30, 60 minutos. Re-ejecuta todas las queries — considerar tamaño y complejidad del dashboard.

## Dashboard Subscriptions

Enviar resultados de un dashboard por email o Slack, incluso a personas sin cuenta en Metabase.

### Configuración

1. `⋮ → Subscriptions`
2. Configurar **recipients** (email o Slack)
3. Configurar **frequency** (hourly, daily, weekly, monthly)
4. Opcional: filter values, attachment settings

### Recipients

- **Email:** nombres de usuarios Metabase o emails externos
- **Slack:** canales (#general) o usuarios individuales (username, no display name)
- Soporte para canales privados

### Frecuencia

| Frecuencia | Opciones |
|---|---|
| Hourly | Hora específica |
| Daily | Hora específica |
| Weekly | Día + hora |
| Monthly | Día del mes + hora |

### Email Attachments

- Formatos: `.csv`, `.xlsx`
- Límite: 1,048,575 filas (configurable con `MB_ATTACHMENT_ROW_LIMIT`)
- Opción: "Send only attachments (no charts)"
- Opción: "Use unformatted values" (datos crudos sin formateo)
- Seleccionar qué preguntas incluir

### Filter Customization (Pro/Enterprise)

Cada subscription puede tener sus propios valores de filtro. Un solo dashboard puede enviar vistas diferentes a diferentes personas:

```
Subscription → Set filter values for when this gets sent
  State: "VT"
  Date: "This quarter"
```

### Test Subscription

`Send email/Slack now` para probar sin esperar el schedule.

### Don't Send If No Results

Skip sending si las queries no retornan resultados (útil para dashboards de eventos temporales o raros).

### Embedded Dashboards

Las subscriptions de dashboards embebidos omiten links a items de Metabase (para evitar links rotos).

## Sharing

### Public Links

Admins pueden crear public links para preguntas y dashboards. Cualquiera puede verlos.

### Duplicar Dashboard

`⋮ → Duplicate` — copia el dashboard, layout de cards, filtros, y preguntas. No copia: subscriptions, actions, settings de sharing/embedding.

## Version History

Metabase mantiene historial de las 15 versiones anteriores de cada pregunta, dashboard y modelo.

## Caching

Configurar caching por dashboard para optimizar performance (Pro/Enterprise).

## Export

- Dashboard completo como PDF
- Resultados individuales de preguntas

## Tips para Dashboards Efectivos

- **Enfatizar lo importante:** KPIs principales arriba y más grandes
- **Mantener foco:** máximo ~10 cards por dashboard, un tema por dashboard
- **Agregar filtros:** hacer dashboards más generales con filtros dinámicos
- **Hacer interactivos:** configurar click behavior y cross-filtering
- **Text cards:** usar Markdown para contexto y explicaciones
- **Sections:** usar templates pre-organizados para layout rápido

## Referencias

- [Introduction to Dashboards](https://www.metabase.com/docs/latest/dashboards/introduction)
- [Dashboard Filters](https://www.metabase.com/docs/latest/dashboards/filters)
- [Interactive Dashboards](https://www.metabase.com/docs/latest/dashboards/interactive)
- [Dashboard Subscriptions](https://www.metabase.com/docs/latest/dashboards/subscriptions)
- [Multiple Series](https://www.metabase.com/docs/latest/dashboards/multiple-series)
- [Actions on Dashboards](https://www.metabase.com/docs/latest/dashboards/actions)
- [Linked Filters](https://www.metabase.com/docs/latest/dashboards/linked-filters)
- [Making Dashboards Faster](https://www.metabase.com/learn/metabase-basics/administration/administration-and-operation/making-dashboards-faster)
