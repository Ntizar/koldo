---
name: postgres-mcp-servidor
description: "Patrón para exponer PostgreSQL como servidor MCP (Model Context Protocol) para agentes AI. Health checks, index tuning con DTA, EXPLAIN plans, y queries seguras desde LLMs como Koldo."
version: 2.0.0
author: Ntizar + Koldo
---

# PostgreSQL como Servidor MCP

Expone una base de datos PostgreSQL como servidor MCP para que agentes AI (Koldo, Claude Code, Codex, etc.) puedan consultarla, tunear índices, y hacer health checks sin SQL directo.

## Arquitectura

```
Agente AI (Koldo)
    │
    ▼  MCP Protocol (stdio/HTTP)
    ┌─────────────────────┐
    │  postgres-mcp       │  ← Python server
    │  ───────────        │
    │  • health_check     │
    │  • list_tables      │
    │  • run_query        │
    │  • explain_query    │
    │  • suggest_index    │  ← DTA algorithm
    │  • table_size       │
    │  • index_usage      │
    │  • connections      │
    │  • vacuum_info      │
    └─────────┬───────────┘
              │
              ▼
        PostgreSQL DB
```

## Instalación

```bash
# Con pip (Python 3.12+)
pip install postgres-mcp

# Con Docker (recomendado para aislar)
docker run -i --rm \
  -e DATABASE_URI="postgresql://user:pass@host:5432/db" \
  crystaldba/postgres-mcp --access-mode=restricted
```

## Dos modos de acceso

| Modo | Lectura | Escritura | DDL | Uso |
|------|---------|-----------|-----|-----|
| `restricted` | ✅ | ❌ | ❌ | Agentes autónomos (seguro) |
| `unrestricted` | ✅ | ✅ | ✅ | DBA asistido, migraciones |

## Patrón: Integración con Hermes/Koldo

```yaml
# config.yaml de Hermes
tools:
  mcp_servers:
    postgres:
      transport: stdio
      command: npx
      args: ["postgres-mcp", "--access-mode=restricted"]
      env:
        DATABASE_URI: "${POSTGRES_URI}"
```

Desde Koldo, ahora puedes:

```javascript
// El agente puede:
// • "Analiza el estado de la base de datos" → health_check
// • "Lista las tablas del esquema público" → list_tables 
// • "Qué consulta es más lenta?" → explain_query
// • "Sugiere índices para mejorar" → suggest_index
// • "Ejecuta SELECT * FROM usuarios LIMIT 5" → run_query
```

## Patrón: Index Tuning con DTA (Database Tuning Advisor)

```sql
-- El agente ejecuta:
SELECT * FROM pedidos WHERE fecha > '2026-01-01' AND estado = 'pendiente';

-- postgres-mcp analiza el plan y sugiere:
/*
📊 Sugerencias de índices (DTA):
1. CREATE INDEX idx_pedidos_fecha_estado ON pedidos(fecha, estado);
   → Costo estimado: 100x -> 1.5x (reducción del 98%)

2. CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
   → Costo estimado: 50x -> 2x (reducción del 96%)
*/
```

## Herramientas MCP disponibles

| Herramienta | Descripción | Modo |
|-------------|-------------|------|
| `health_check` | Conexión, tamaño DB, conexiones activas, última analítica | ambos |
| `list_tables` | Tablas con nº filas, tamaño, estimación | ambos |
| `run_query` | Ejecuta SQL (SELECT en restricted) | ambos |
| `explain_query` | EXPLAIN ANALYZE del plan | ambos |
| `suggest_index` | Recomienda índices basado en queries recientes | ambos |
| `table_size` | Tamaño total de tabla + índices + TOAST | ambos |
| `index_usage` | Estadísticas de uso de índices | ambos |
| `table_summary` | Esquema, filas, columnas de una tabla | ambos |
| `connections` | Conexiones activas, idle, waiting | ambos |
| `vacuum_info` | Estado de VACUUM y dead tuples | ambos |

## Patrón: Monitoreo programado vía cron

```javascript
// En Hermes cron job:
// - Prompt: "Ejecuta health_check en postgres-mcp y reporta estado"
// - Skills: postgres-mcp-servidor
// - Schedule: 0 6 * * * (07:00 Madrid)

// Salida esperada:
// ✅ PostgreSQL OK | DB: 2.3GB | Conexiones: 4/100 | Última analítica: hoy
// 📊 Tablas: 42 | Registros: 1.2M | Dead tuples: bajo
// ⚠️ Índices sin usar: 3 → idx_pedidos_viejo, idx_usuarios_nombre
```

## Buenas prácticas

1. **Modo restricted para agentes autónomos** — solo SELECT, sin riesgo de escritura
2. **Docker para aislar** — no instalar dependencias Python en el server principal
3. **Variables de entorno** — DATABASE_URI en config.yaml, no hardcodeada
4. **suggest_index con uso real** — basado en pg_stat_statements, no adivinando
5. **Health checks automáticos** — cron diario + alerta si algo va mal
6. **HypoPG opcional** — probar índices hipotéticos sin crearlos realmente

## Requisitos

- Python 3.12+
- PostgreSQL 14+ (con pg_stat_statements para index tuning)
- Opcional: hypopg (para hypothetical indexes)

## Pitfalls

- ❌ **Modo unrestricted en agente autónomo** — riesgo de DELETE/DROP
- ❌ **sin pg_stat_statements** → DTA no tiene datos para recomendar índices
- ❌ **Conexión pool excedido** — el MCP server abre conexiones extra
- ❌ **Credenciales en command** — pasar DATABASE_URI por env, no por args
- ❌ **Timeout en queries largas** — configurar statement_timeout en Postgres

## Referencia

- Repo: https://github.com/crystaldba/postgres-mcp (2.8K⭐)
- PyPI: https://pypi.org/project/postgres-mcp/
- Skills relacionadas: env-validacion-estricta, docker-multistage-produccion
