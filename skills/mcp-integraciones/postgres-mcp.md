# Postgres MCP Pro

- **URL**: https://github.com/crystaldba/postgres-mcp
- **Categoría**: MCP e Integraciones
- **¿Qué hace?**: Postgres MCP Pro es un servidor MCP (Model Context Protocol) de código abierto creado por Crystal DBA que permite a agentes de IA interactuar con bases de datos PostgreSQL de forma inteligente y segura. Va mucho más allá de un simple wrapper de conexión: proporciona herramientas deterministas para análisis de salud de la base de datos, optimización de índices usando algoritmos industriales (basados en el Anytime Algorithm de Microsoft SQL Server), planes EXPLAIN con índices hipotéticos (vía extensión hypopg), generación de SQL contextual basada en el esquema, y ejecución segura de SQL con modos de acceso configurables. Usa psycopg3 para conexión asíncrona y soporta transportes stdio, SSE y streamable-http.
- **Casos de uso**:
  - Diagnóstico automático de salud de base de datos (índices, buffer cache, conexiones, vacuum, replicación, secuencias, constraints)
  - Recomendación inteligente de índices basada en la carga de trabajo (workload analysis)
  - Optimización de consultas individuales con planes EXPLAIN y simulación de índices hipotéticos
  - Identificación de consultas lentas mediante pg_stat_statements
  - Generación de SQL contextual y correcto basado en el esquema de la base de datos
  - Ejecución segura de SQL en producción con modo read-only (Restricted mode)
  - Integración con editores/IDEs con IA (Cursor, Claude Desktop, Windsurf, Cline)
  - Ajuste de índices por LLM (experimental, requiere OpenAI API key)
- **Snippets útiles**:
  ```json
  // Configuración para Claude Desktop (Docker)
  {
    "mcpServers": {
      "postgres": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "-e", "DATABASE_URI", "crystaldba/postgres-mcp", "--access-mode=unrestricted"],
        "env": {
          "DATABASE_URI": "postgresql://user:pass@localhost:5432/dbname"
        }
      }
    }
  }
  ```

  ```json
  // Configuración para Claude Desktop (uvx)
  {
    "mcpServers": {
      "postgres": {
        "command": "uvx",
        "args": ["postgres-mcp", "--access-mode=unrestricted"],
        "env": {
          "DATABASE_URI": "postgresql://user:pass@localhost:5432/dbname"
        }
      }
    }
  }
  ```

  ```json
  // Configuración SSE para Cursor
  {
    "mcpServers": {
      "postgres": {
        "type": "sse",
        "url": "http://localhost:8000/sse"
      }
    }
  }
  ```

  ```bash
  # Instalar desde PyPI
  pipx install postgres-mcp
  # o con uv
  uv pip install postgres-mcp

  # Ejecutar directamente
  postgres-mcp "postgresql://user:pass@localhost:5432/dbname" --access-mode=unrestricted

  # Ejecutar con SSE (para clientes remotos)
  postgres-mcp "postgresql://user:pass@localhost:5432/dbname" --access-mode=unrestricted --transport=sse --sse-port=8000

  # Pull de Docker
  docker pull crystaldba/postgres-mcp
  ```

  ```sql
  -- Extensiones requeridas para index tuning y análisis completo
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  CREATE EXTENSION IF NOT EXISTS hypopg;
  ```

  ```python
  # Estructura del código fuente (src/postgres_mcp/)
  # server.py          - Servidor MCP principal con todas las herramientas
  # __init__.py        - Entry point (main())
  # artifacts.py       - Artefactos de respuesta (ExplainPlanArtifact, ErrorResult)
  # database_health/   - Health checks: buffer, connection, constraint, index, replication, sequence, vacuum
  # explain/           - Herramienta de EXPLAIN con soporte para índices hipotéticos
  # index/             - Index tuning: DTA (Database Tuning Advisor), LLM optimizer
  # sql/               - Drivers SQL: SqlDriver, SafeSqlDriver (parser con pglast), connection pool
  # top_queries/       - Cálculo de consultas más lentas desde pg_stat_statements
  ```
- **Cómo integrarlo en proyectos**:
  1. **Instalar**: `pipx install postgres-mcp` o `docker pull crystaldba/postgres-mcp`
  2. **Configurar extensiones**: Ejecutar `CREATE EXTENSION IF NOT EXISTS pg_stat_statements; CREATE EXTENSION IF NOT EXISTS hypopg;` en la base de datos objetivo
  3. **Configurar el cliente MCP**: Editar el archivo de configuración del cliente (Claude Desktop, Cursor, Windsurf, etc.) añadiendo la sección `mcpServers` con la configuración adecuada (ver snippets)
  4. **Modos de acceso**:
     - `--access-mode=unrestricted`: Modo desarrollo, permite cualquier SQL (escritura, DDL, etc.)
     - `--access-mode=restricted`: Modo producción, solo SELECT mediante transacciones read-only + parser pglast que rechaza COMMIT/ROLLBACK
  5. **Variables de entorno**: `DATABASE_URI` para la cadena de conexión, `OPENAI_API_KEY` para el modo experimental de index tuning por LLM
  6. **Transportes**: stdio (por defecto, para MCP clients locales), SSE (puerto 8000, para clientes remotos), streamable-http (para HTTP clients)
  7. **Docker**: El entrypoint automáticamente remapea `localhost` a `host.docker.internal` (macOS/Windows) o `172.17.0.1` (Linux)
  8. **Requisitos**: Python 3.12+, PostgreSQL 15/16/17 (soporte planificado para 13-17)
- **Herramientas MCP disponibles**:
  | Herramienta | Descripción |
  |---|---|
  | `list_schemas` | Lista todos los schemas de la base de datos |
  | `list_objects` | Lista objetos (tablas, vistas, secuencias, extensiones) en un schema |
  | `get_object_details` | Detalles de un objeto: columnas, constraints, índices |
  | `execute_sql` | Ejecuta SQL (read-only en restricted mode, libre en unrestricted) |
  | `explain_query` | Plan de ejecución con soporte para índices hipotéticos (hypopg) |
  | `get_top_queries` | Consultas más lentas/recursos desde pg_stat_statements |
  | `analyze_workload_indexes` | Analiza la carga de trabajo y recomienda índices óptimos |
  | `analyze_query_indexes` | Analiza hasta 10 queries específicas y recomienda índices |
  | `analyze_db_health` | Checks: index, connection, vacuum, sequence, replication, buffer, constraint |
- **Arquitectura técnica**:
  - **Framework MCP**: Usa `mcp[cli]` con FastMCP (MCP Python SDK)
  - **Driver Postgres**: psycopg3 con I/O asíncrono (vs asyncpg)
  - **Seguridad SQL**: pglast para parseo AST y validación de sentencias en restricted mode
  - **Index Tuning**: Algoritmo greedy (Anytime Algorithm de Microsoft) + hypopg para simulación de planes
  - **LLM Index Tuning** (experimental): Optimización iterativa por LLM vía instructor + OpenAI
  - **Health Checks**: Adaptados de PgHero
  - **Pool de conexiones**: psycopg-pool para conexiones reutilizables
- **Fecha de aprendizaje**: 2026-05-27
