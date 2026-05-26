# Patrón de Preguntas y Queries en Metabase

Las **preguntas** (questions) son los bloques fundamentales de Metabase: una consulta + su visualización. Se pueden crear con el query builder gráfico o con SQL nativo.

## Query Builder (No-code)

El editor visual de consultas permite explorar datos sin escribir SQL.

### Editor de Consultas

1. Ir a **New > Question**
2. Seleccionar una tabla o modelo
3. Filtrar, agrupar, sumarizar, hacer joins
4. Elegir visualización (tabla, gráfico de barras, línea, mapa, etc.)
5. Guardar en una colección o dashboard

### Expresiones Personalizadas

Fórmulas tipo spreadsheet para cálculos avanzados:
- Agregaciones: `sum`, `count`, `avg`, `min`, `max`, `median`, `stddev`
- Condicionales: `if`, `case`, `coalesce`
- Fecha/hora: `date`, `month`, `year`, `datediff`, `datetrunc`
- Texto: `concat`, `substring`, `lower`, `upper`, `replace`
- Regex: `regexextract`, `regexmatch`
- Lógicas: `and`, `or`, `not`, `equals`, `gt`, `lt`

### Joins

Combinar datos con otra tabla o incluso con una pregunta guardada.

## SQL Editor (Native Queries)

Para consultas complejas con SQL nativo. Soporta múltiples databases (no solo SQL: MongoDB, etc.).

### Parámetros SQL

```sql
-- Variable básica
SELECT * FROM orders WHERE status = {{status}}

-- Variable con múltiples valores
SELECT * FROM orders WHERE category IN {{category}}

-- Date range variable
SELECT * FROM orders WHERE created_at BETWEEN {{start_date}} AND {{end_date}}

-- Field filter (recomendado para filtros de dashboard)
SELECT * FROM orders WHERE {{#category}}
```

### Field Filters

```sql
-- Crea un widget de filtro inteligente conectado a un campo de la DB
SELECT * FROM orders WHERE {{#category}}
-- Metabase reemplaza {{#category}} con: category IN ('Gadget', 'Doohickey')
```

### Variables Opcionales

Usar corchetes para variables que pueden quedar vacías:
```sql
SELECT * FROM orders
WHERE {{#status}}
  AND {{#category}}
```

### Time Grouping Parameters

```sql
-- Agrupar datos por períodos de tiempo
SELECT {{#time_group}} AS time, count(*) AS total
FROM orders
GROUP BY {{#time_group}}
```

### Snippets

Reutilizar y compartir fragmentos de SQL. Crear carpetas de snippets con permisos.

### Referenciar Preguntas Guardadas y Models

```sql
SELECT * FROM {{#my_saved_question}}
-- o referenciar un model
SELECT * FROM {{#my_model}}
```

## Metabot AI

Metabot es el asistente AI de Metabase. Puede:

### Generar Queries desde Lenguaje Natural

1. Abrir chat con `Cmd+E` / `Ctrl+E`
2. Escribir: "mostrar ventas por categoría los últimos 3 meses"
3. Metabot crea la query en el query builder automáticamente

### Generar SQL desde Natural Language

1. Abrir SQL editor
2. `Cmd+E` / `Ctrl+E` para abrir chat
3. Escribir: "Write a SQL query that shows revenue by product category for the last quarter"
4. Metabot genera el SQL (no lo ejecuta — puedes revisarlo primero)

### Editar SQL Inline

1. En SQL editor, `Cmd+Shift+I` / `Ctrl+Shift+I`
2. Ingresar tabla(s)
3. Describir el query deseado
4. Click en **Generate** → aceptar o rechazar cambios

### Fix de Errores SQL

Cuando una query falla, click en **"Have Metabot fix it"** para que corrija el error.

### Analizar Charts

En cualquier pregunta, click en el ícono de Metabot para analizar la visualización. En tablas de resultados, Metabot produce un [X-ray](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays) de los datos.

### AI Exploration

`+ New → AI exploration` para iniciar una conversación nueva sin un chart existente. Admins pueden escopar a una colección específica.

### Limitaciones de Metabot

- No genera SQL con variables/parameters
- No puede agregar goal lines a charts
- No puede cambiar formatting de charts (colores, axis labels)
- No puede crear/modificar alerts existentes (solo crearlos desde Slack)
- Solo puede buscar tables, metrics, questions, models, dashboards

### Metabot en Slack

@mention a Metabot en un canal de Slack para preguntar sobre datos. Puede crear alerts y subscriptions desde Slack.

### Tips para Metabot

- Definir términos de dominio en el [glossary](https://www.metabase.com/docs/latest/exploration-and-organization/data-model-reference#glossary)
- Dar contexto específico (tablas, campos) en el prompt
- Usar prompts en inglés para mejores resultados
- Resetear la conversación para cambios de tema

## Documents

Para análisis de largo formato combinando texto, charts y AI.

### Crear un Document

1. `+ New → Document`
2. Escribir texto en Markdown
3. Insertar charts con `/Chart`
4. Crear nuevas preguntas directamente en el document
5. Mencionar items con `@`

### Comandos en Documents

| Comando | Descripción |
|---|---|
| `/Ask Metabot` | Chat con Metabot en el document |
| `/Chart` | Insertar chart de pregunta/modelo existente o crear nuevo |
| `/Link` | Mencionar otros items de Metabase |

### Características

- Charts copiados del collection son independientes del original
- Charts creados en el document se pierden si se borra el document (no van a trash)
- Soporte para Markdown (headings, images, blockquotes, code blocks)
- Supporting text blocks junto a charts
- Comentar en secciones de texto y charts
- Imprimir document
- Compartir con public links

## Visualizaciones

Metabase soporta múltiples tipos de visualización:

| Tipo | Uso |
|---|---|
| Table | Datos tabulares, detalle |
| Line/Bar/Area | Series temporales, comparaciones |
| Pie/Donut | Proporciones |
| Map | Datos geográficos |
| Funnel | Pipeline, conversiones |
| Waterfall | Impacto acumulativo |
| Gauge | KPIs, objetivos |
| Number | Métricas simples |
| Pivot Table | Datos multidimensionales |
| Combo Chart | Múltiples series con diferentes ejes |
| Box Plot | Distribución, outliers |
| Scatter/Bubble | Correlaciones |
| Detail | Registros individuales |
| Trend | Indicador de dirección |
| Progress Bar | Progreso, completitud |

## Exportar Resultados

- CSV, XLSX, PDF
- Exportar individual (pregunta) o completo (dashboard)
- Remover branding Metabase (Pro/Enterprise)
- Límite de filas: 1,048,575 (Excel)

## Alerts

Configurar alertas en preguntas para recibir notificaciones por email o Slack:
- **Schedule:** basado en horario
- **Threshold:** cuando algo interesante pasa (ej: ventas bajan de umbral)

## Referencias

- [Questions Overview](https://www.metabase.com/docs/latest/questions/start)
- [Query Builder Editor](https://www.metabase.com/docs/latest/questions/query-builder/editor)
- [Custom Expressions](https://www.metabase.com/docs/latest/questions/query-builder/expressions)
- [SQL Editor](https://www.metabase.com/docs/latest/questions/native-editor/writing-sql)
- [SQL Parameters](https://www.metabase.com/docs/latest/questions/native-editor/sql-parameters)
- [Field Filters](https://www.metabase.com/docs/latest/questions/native-editor/field-filters)
- [Table Variables](https://www.metabase.com/docs/latest/questions/native-editor/table-variables)
- [Snippets](https://www.metabase.com/docs/latest/questions/native-editor/snippets)
- [Metabot](https://www.metabase.com/docs/latest/ai/metabot)
- [Agent API](https://www.metabase.com/docs/latest/ai/agent-api)
- [Documents](https://www.metabase.com/docs/latest/documents/introduction)
- [Visualizations](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)
- [Alerts](https://www.metabase.com/docs/latest/questions/alerts)
- [Exporting Results](https://www.metabase.com/docs/latest/questions/exporting-results)
- [Metrics Explorer](https://www.metabase.com/docs/latest/questions/metrics-explorer)
- [X-rays](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays)
