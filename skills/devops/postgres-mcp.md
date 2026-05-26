# Postgres MCP

- **URL:** https://github.com/crystaldba/postgres-mcp
- **Categoría:** DevOps / Database / MCP
- **¿Qué hace?:** Postgres MCP Pro es un servidor MCP (Model Context Protocol) de código abierto que proporciona a agentes de IA acceso configurable de lectura/escritura y capacidades de análisis de rendimiento para PostgreSQL. Incluye herramientas deterministas para health checks de base de datos, tuning de índices con algoritmos industriales (basados en el Anytime Algorithm de Microsoft), planes EXPLAIN con índices hipotéticos (vía hypopg), generación de SQL context-aware, y ejecución segura de SQL con modo read-only. Soporta transports stdio y SSE.
- **Casos de uso:**
  - Diagnóstico de salud de base de datos (índices inválidos/duplicados/hinchados, buffer cache hit rate, conexión, vacuum, replicación, secuencias, constraints)
  - Tuning automático de índices basado en workload analysis (pg_stat_statements) y simulación con hypopg
  - Análisis de planes de ejecución (EXPLAIN/EXPLAIN ANALYZE) con simulación de índices hipotéticos
  - Identificación de queries lentos y recomendaciones de optimización
  - Generación de SQL segura para agentes de IA con validación AST vía pglast
  - Integración de PostgreSQL con herramientas de IA (Cursor, Claude Desktop, Windsurf, Cline)
  - Entornos de desarrollo (modo unrestricted) y producción (modo restricted read-only)
- **Snippets útiles:**
  - **Instalación con Docker:**
    ```bash
    docker pull crystaldba/postgres-mcp
    docker run -it --rm -e DATABASE_URI="postgresql://user:pass@localhost:5432/dbname" crystaldba/postgres-mcp --access-mode=unrestricted
    ```
  - **Instalación con uvx:**
    ```bash
    uvx postgres-mcp --access-mode=unrestricted
    ```
  - **Configuración Claude Desktop (Docker):**
    ```json
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
  - **Configuración SSE (para Cursor/Windsurf):**
    ```bash
    # Iniciar servidor SSE
    postgres-mcp postgres://user:pass@localhost:5432/dbname --access-mode=unrestricted --transport=sse
    ```
    ```json
    {
      "mcpServers": {
        "postgres": {
          "type": "sse",
          "url": "http://localhost:8000/sse"
        }
      }
    }
    ```
  - **Instalar extensiones requeridas:**
    ```sql
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
    CREATE EXTENSION IF NOT EXISTS hypopg;
    ```
  - **Herramientas MCP disponibles:**
    - `list_schemas` — Lista todos los schemas
    - `list_objects` — Lista objetos (tablas, vistas, secuencias, extensiones)
    - `get_object_details` — Detalles de un objeto (columnas, constraints, índices)
    - `execute_sql` — Ejecuta SQL (con protección read-only en modo restricted)
    - `explain_query` — Plan de ejecución con soporte para índices hipotéticos
    - `get_top_queries` — Queries más lentos desde pg_stat_statements
    - `analyze_workload_indexes` — Tuning de índices automático basado en workload
    - `analyze_query_indexes` — Tuning de índices para queries específicos (hasta 10)
    - `analyze_db_health` — Health checks completos (index, buffer, connection, vacuum, replication, sequence, constraint)
- **Cómo integrarlo en proyectos:**
  1. **Prerrequisitos:** PostgreSQL 13-17, Docker o Python 3.12+, extensiones `pg_stat_statements` y `hypopg` instaladas.
  2. **Instalación:** Usar `docker pull crystaldba/postgres-mcp` o `pipx install postgres-mcp` / `uvx postgres-mcp`.
  3. **Configurar el MCP client:** Agregar la configuración de mcpServers en el archivo de configuración del cliente de IA (Claude Desktop, Cursor, Windsurf, Cline).
  4. **Modos de acceso:** Usar `--access-mode=unrestricted` para desarrollo y `--access-mode=restricted` para producción. El modo restricted usa pglast para parsear y validar cada query antes de ejecutarlo, permitiendo solo SELECT, EXPLAIN, SHOW, VACUUM, ANALYZE y CREATE EXTENSION de extensiones whitelist.
  5. **Transportes:** stdio (por defecto, para Claude Desktop), SSE (puerto 8000, para Cursor/Windsurf), o streamable-http.
  6. **Pipeline de optimización:** Para tuning de índices, el servidor usa un algoritmo greedy (Anytime Algorithm) que: (a) identifica queries candidatos de pg_stat_statements, (b) genera índices candidatos analizando filtros/joins/groupby/sort, (c) busca la configuración óptima usando hypopg para simular planes, (d) aplica análisis costo-beneficio (Pareto front). También soporta tuning experimental vía LLM con `method=llm` y OPENAI_API_KEY.
  7. **Seguridad:** El SafeSqlDriver usa pglast para validación AST profunda, whitelist de funciones permitidas (~400+ funciones), whitelist de extensiones, y timeout configurable. Previene inyección SQL a nivel de parseo, no solo a nivel de string.
- **Fecha de aprendizaje:** 2026-05-26
