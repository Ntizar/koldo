# searchcraft-mcp-server

- **URL:** https://github.com/searchcraft-inc/searchcraft-mcp-server
- **Categoría:** DevOps / MCP / Search
- **¿Qué hace?:** Es un servidor MCP (Model Context Protocol) que expone herramientas para gestionar un clúster de Searchcraft, el motor de búsqueda vertical para desarrolladores. Proporciona herramientas para administrar documentos, índices, federaciones, claves de autenticación, stopwords, sinónimos y operaciones de búsqueda/analytics. También incluye herramientas de importación automática de JSON a índices y generación de aplicaciones Vite+React con búsqueda integrada.
- **Casos de uso:**
  - Conectar Claude Desktop o Claude Code a un clúster Searchcraft para gestionar índices con lenguaje natural
  - Crear índices de búsqueda automáticamente a partir de datasets JSON (desde URL o archivos locales)
  - Generar aplicaciones web completas (Vite + React) con búsqueda integrada en un solo paso
  - Gestionar federaciones de búsqueda multi-índice
  - Administrar claves de autenticación (crear, listar, actualizar, eliminar)
  - Realizar búsquedas con soporte para fuzzy matching, exact matching, filtros por fecha y facetas
  - Importar datos JSON con análisis automático de estructura y generación de esquemas
  - Desplegar el servidor MCP vía HTTP, stdio o Docker
- **Snippets útiles:**

**Configuración de Claude Desktop (stdio):**
```json
{
  "mcpServers": {
    "searchcraft": {
      "command": "node",
      "args": ["/path/to/searchcraft-mcp-server/dist/stdio-server.js"]
    }
  }
}
```

**Configuración de Claude Code:**
```bash
claude mcp add searchcraft -- node /path/to/searchcraft-mcp-server/dist/stdio-server.js
# Con variables de entorno:
claude mcp add searchcraft \
  --env ENDPOINT_URL=https://your-cluster.searchcraft.io \
  --env CORE_API_KEY=YOUR_API_KEY \
  -- node /path/to/searchcraft-mcp-server/dist/stdio-server.js
```

**Variables de entorno (.env):**
```
ENDPOINT_URL=https://your-cluster.searchcraft.io
CORE_API_KEY=tu_api_key
PORT=3100
DEBUG=true
LOG_LEVEL=LOG
```

**Ejemplo: Crear índice desde JSON (URL):**
```json
{
  "source": "url",
  "path": "https://dummyjson.com/products",
  "index_name": "products",
  "sample_size": 50,
  "search_fields": ["title", "description", "category"],
  "weight_multipliers": { "title": 2.0, "description": 1.0, "category": 1.5 },
  "language": "en"
}
```

**Patrón de herramienta MCP con Zod:**
```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const registerMyTool = (server: McpServer) => {
    server.tool(
        "my_tool_name",
        "Descripción de lo que hace la herramienta",
        {
            param1: z.string().describe("Descripción del parámetro 1"),
            param2: z.number().optional().describe("Parámetro opcional"),
        },
        async ({ param1, param2 }) => {
            // Validación automática con Zod
            try {
                // Lógica de la herramienta
                return {
                    content: [{ type: "text", text: "Resultado" }],
                };
            } catch (error) {
                return {
                    content: [{ type: "text", text: `❌ Error: ${error}` }],
                    isError: true,
                };
            }
        },
    );
};
```

**Patrón de helpers reutilizables:**
```typescript
// Obtener config de Searchcraft
export const getSearchcraftConfig = () => {
    const endpointUrl = process.env.ENDPOINT_URL;
    const apiKey = process.env.CORE_API_KEY;
    if (!endpointUrl || !apiKey) {
        return { error: createErrorResponse("Missing env vars") };
    }
    return { endpointUrl, apiKey };
};

// Request genérico a la API de Searchcraft
export const makeSearchcraftRequest = async (
    endpoint: string,
    method: string,
    authKey: string,
    body?: any,
) => {
    const response = await fetch(endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: authKey,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

// Debug logging seguro (stderr para no interferir con MCP JSON-RPC)
export function debugLog(message: string, level: "LOG" | "INFO" | "WARN" | "ERROR" = "LOG") {
    if (process.env.DEBUG?.toLowerCase() !== "true") return;
    const timestamp = new Date().toISOString();
    process.stderr.write(`[${timestamp}] [${level}] ${message}\n`);
}
```

**Análisis automático de JSON para generar esquemas:**
```typescript
// El json-analyzer detecta tipos, sugiere configuraciones y genera esquemas
// Mapeo automático: string → text, boolean → bool, number → f64/u64
// Detecta campos de fecha por nombre y patrón de valor
// Detecta facetas jerárquicas (campos tipo "category" con valores "/path/to/item")
// Soporta objetos anidados (los aplanando con notación de punto)
```

**Docker deployment:**
```bash
docker build --load -t searchcraft-mcp-server .
docker run -it -p 3100:3100 \
  -e ENDPOINT_URL="https://your-cluster.searchcraft.io" \
  -e CORE_API_KEY="your_api_key" \
  searchcraft-mcp-server
# Health check:
curl http://localhost:3100/health
```

- **Cómo integrarlo en proyectos:**
  1. **Clonar e instalar:** `git clone https://github.com/searchcraft-inc/searchcraft-mcp-server.git && cd searchcraft-mcp-server && nvm use && yarn`
  2. **Configurar variables:** Crear `.env` con `ENDPOINT_URL` y `CORE_API_KEY` apuntando al clúster Searchcraft
  3. **Construir:** `yarn build` → genera `dist/server.js` (HTTP) y `dist/stdio-server.js` (stdio)
  4. **Conectar a Claude Desktop:** Añadir la configuración stdio en `claude_desktop_config.json`
  5. **Conectar a Claude Code:** `claude mcp add searchcraft -- node dist/stdio-server.js`
  6. **Para producción:** Usar Docker con variables de entorno, o el servidor HTTP en un contenedor
  7. **Seguridad:** Si se usa con una write key, asegurar que el MCP server no sea expuesto públicamente. Para acceso de solo lectura, usar write keys con permisos limitados.
  8. **Arquitectura de herramientas:** Las herramientas se organizan en 3 categorías (`src/tools/engine-api/`, `src/tools/import/`, `src/tools/apps/`) y se registran dinámicamente en `create-mcp-server.ts` iterando sobre los exports de `src/tools/index.ts`. Cada herramienta sigue el patrón: función de registro que recibe `McpServer`, llama a `server.tool(nombre, descripción, schemaZod, handler)`.
  9. **Extender:** Para añadir nuevas herramientas, crear un archivo en `src/tools/engine-api/` con la función `registerMiHerramienta(server: McpServer)` y exportarla desde `src/tools/index.ts`.
- **Fecha de aprendizaje:** 2026-05-26
