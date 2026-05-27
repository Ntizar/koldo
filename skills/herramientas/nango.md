# Nango - Integraciones de Producto con IA
- **URL**: https://github.com/NangoHQ/nango
- **Categoría**: Herramientas / Integraciones
- **Stars**: 9,010
- **¿Qué hace?**: Nango es una plataforma open-source para construir **product integrations** con 800+ APIs externas. Permite conectar tu producto con APIs de terceros escribiendo la lógica de integración como funciones TypeScript que se despliegan en un runtime de producción. Nango maneja automáticamente: autenticación (OAuth, API keys, token refresh), proxy de requests con retry y rate limits, ejecución de funciones, escalado, observabilidad y multi-tenant. Usado en producción por Replit, Ramp, Mercor y cientos de empresas más.
- **Arquitectura**:
  - **Monorepo TypeScript** con packages separados:
    - `packages/server`: API server principal (Express/Node.js)
    - `packages/frontend`: Web UI del dashboard
    - `packages/connect-ui`: UI embebible para auth flow
    - `packages/node-client`: SDK de Node.js (`@nangohq/node`)
    - `packages/runner`: Runtime de ejecución de funciones
    - `packages/lambda-runner`: Ejecución en AWS Lambda
    - `packages/providers`: 800+ configuraciones de proveedores (YAML-based)
    - `packages/database`: Capa de acceso a datos
    - `packages/orchestrator`: Orquestación de jobs y syncs
    - `packages/scheduler`: Programación de syncs y acciones
    - `packages/keystore`: Almacenamiento seguro de credentials
    - `packages/kvstore`: Cache en memoria
    - `packages/records`: Almacenamiento de registros sincronizados
    - `packages/persist`: Persistencia de datos de sync
    - `packages/logs`: Logs y observabilidad (Elasticsearch opcional)
    - `packages/jobs`: Gestión de trabajos en cola
    - `packages/webapp`: Aplicación web principal
    - `packages/cli`: CLI de línea de comandos (`nango`)
    - `packages/types`: Tipos TypeScript compartidos
    - `packages/shared`: Utilidades compartidas
    - `packages/authz`: Autorización y permisos
    - `packages/billing`: Gestión de billing
    - `packages/metering`: Medición de uso
    - `packages/data-ingestion`: Ingesta de datos
    - `packages/fleet`: Gestión de flotas
    - `packages/pubsub`: Mensajería pub/sub
    - `packages/email`: Notificaciones por email
    - `packages/design-system`: Componentes UI compartidos
    - `packages/nango-yaml`: Parser de configuración YAML
    - `packages/runner-sdk`: SDK para funciones del runner
    - `packages/utils`: Utilidades generales
  - **Infraestructura** (docker-compose.yaml):
    - PostgreSQL 16 (base de datos principal)
    - Redis 7 (cache y colas)
    - Elasticsearch 8 (logs opcionales)
    - Nango Server (API + Connect UI)
  - **3 primitivas fundamentales**: Auth → Proxy → Functions
- **Casos de uso**:
  - **AI tool calling & MCP**: Dar a agentes de IA acceso controlado a APIs externas
  - **Data syncing**: Sincronización bidireccional para RAG pipelines, indexación y triggers
  - **Webhook processing**: Recibir y procesar webhooks de APIs externas de forma fiable
  - **API unification**: Normalizar múltiples APIs externas bajo un esquema universal propio
  - **Actions**: Escribir datos y ejecutar operaciones en nombre de los usuarios
  - **Per-customer configuration**: Personalizar el comportamiento de integración por cliente
  - **Event handlers**: Reaccionar a eventos del ciclo de vida de conexiones (creación, validación, borrado)
  - **Customer onboarding**: Automatizar el flujo de conexión de nuevos clientes a APIs externas
- **Snippets útiles**:
  - **Instalación del SDK Node.js**:
    ```bash
    npm i @nangohq/node
    ```
  - **Proxy - Hacer requests autenticados**:
    ```typescript
    import { Nango } from '@nangohq/node';

    const nango = new Nango({ secretKey: '<NANGO-SECRET-KEY>' });

    // GET request autenticado
    const response = await nango.get({
        endpoint: '/v3/contacts',
        providerConfigKey: '<INTEGRATION-ID>',
        connectionId: '<CONNECTION-ID>'
    });

    // POST request autenticado
    const created = await nango.post({
        endpoint: '/v3/contacts',
        providerConfigKey: 'salesforce',
        connectionId: 'conn-123',
        data: { name: 'Acme Corp' }
    });
    ```
  - **Auth - Embed white-label auth flow**:
    ```typescript
    // Frontend: embeber el Connect UI
    nango.openConnectUI({ onEvent: (event) => { /* handle completion */ } });

    // Backend: obtener conexión y credentials
    const connection = await nango.getConnection('github', 'conn-123');
    console.log(connection.credentials); // OAuth tokens, API keys, etc.
    ```
  - **Actions - Ejecutar operaciones en nombre del usuario**:
    ```typescript
    // frontend/github-create-issue.ts
    export default async function run(nango: Nango) {
        const { owner, repo, title, body } = nango.input;

        const response = await nango.post({
            endpoint: `/repos/${owner}/${repo}/issues`,
            data: { title, body }
        });

        return response.data;
    }
    ```
  - **Trigger action desde tu backend**:
    ```typescript
    import { Nango } from '@nangohq/node';

    const nango = new Nango({ secretKey: process.env.NANGO_API_KEY! });

    const result = await nango.triggerAction(
        'github',              // providerConfigKey
        'conn-123',            // connectionId
        'create-issue',        // action name
        { owner: 'NangoHQ', repo: 'nango', title: 'Bug', body: 'Fix it' }
    );
    console.log(result);
    ```
  - **Sync - Sincronizar datos externos**:
    ```typescript
    // syncs/github-repos.ts
    export default nango.sync(async function getRepos({ nango, lastSyncDate }) {
        const response = await nango.get({
            endpoint: '/user/repos',
            paginate: { type: 'cursor', opts: { cursor_key: 'cursor' } }
        });

        for (const repo of response.data) {
            await nango.create({
                model: 'Repository',
                record: {
                    id: String(repo.id),
                    name: repo.name,
                    updated_at: repo.updated_at,
                    owner: repo.owner.login
                }
            });
        }
    });
    ```
  - **Webhook function**:
    ```typescript
    // webhooks/github-pull-request.ts
    export default async function handler(nango: Nango) {
        const { action, pull_request, repository } = nango.webhook.payload;
        // Procesar webhook de GitHub
        await nango.log(`PR ${action}: ${pull_request.title}`);
    }
    ```
  - **CLI - Crear y desplegar integraciones**:
    ```bash
    # Inicializar proyecto
    nango init

    # Crear una sync o action
    nango create --sync <integration> <name>
    nango create --action <integration> <name>

    # Compilar y typecheck
    nango compile

    # Deploy a producción
    nango deploy prod

    # Dry run para debugging local
    nango dryrun <action-name> <connection-id>

    # Listar conexiones
    nango connection list
    ```
  - **cURL - Trigger action vía HTTP API**:
    ```bash
    curl --request POST \
      --url https://api.nango.dev/action/trigger \
      --header 'Authorization: Bearer <SECRET-KEY>' \
      --header 'Connection-Id: <CONNECTION-ID>' \
      --header 'Provider-Config-Key: github' \
      --header 'Content-Type: application/json' \
      --data '{
        "action_name": "create-issue",
        "input": { "owner": "NangoHQ", "repo": "nango" }
      }'
    ```
  - **cURL - Crear connect session programáticamente**:
    ```bash
    curl --request POST \
      --url https://api.nango.dev/connect/sessions \
      --header 'Authorization: Bearer <SECRET-KEY>' \
      --header 'Content-Type: application/json' \
      --data '{
        "tags": { "end_user_id": "user-123" },
        "allowed_integrations": ["github"]
      }'
    ```
  - **Tool Calling para Agentes de IA**:
    ```typescript
    // Exponer actions como tools para agentes
    // Compatible con LangChain, MCP, y cualquier LLM SDK
    const tools = nango.getMcpTools({
        providerConfigKey: 'github',
        connectionId: 'conn-123'
    });
    // Los tools se pueden pasar directamente a un agente de IA
    ```
- **Cómo integrarlo en proyectos**:
  1. **Setup inicial**:
     - Crear cuenta en [Nango Cloud](https://app.nango.dev/signup) (gratis) o self-hostear con `docker-compose up`
     - Instalar SDK: `npm i @nangohq/node`
     - Configurar variable de entorno: `NANGO_SECRET_KEY=sk_xxxx`
  2. **Configurar integración**:
     - En el dashboard, ir a Integrations > New Integration > seleccionar API (800+ disponibles)
     - Para OAuth: registrar developer app en el provider y pegar Client ID/Secret
     - Para API Key: pegar la clave en la configuración
  3. **Embed auth en tu producto**:
     - Frontend: usar `nango.openConnectUI()` para flujo white-label
     - Backend: crear connect sessions vía API para autenticación programática
  4. **Escribir funciones de integración**:
     - Crear Actions para operaciones (crear, actualizar, eliminar)
     - Crear Syncs para sincronización de datos (polling, incremental, webhooks)
     - Crear Webhook functions para procesar eventos entrantes
     - Las funciones se escriben en TypeScript y se typecheck con `nango compile`
  5. **Desplegar**:
     - `nango deploy prod` para producción
     - `nango deploy dev` para desarrollo
     - Integrar en CI/CD con `nango deploy` en pipelines
  6. **Consumir desde tu backend**:
     - Usar el SDK Node.js: `nango.get()`, `nango.post()`, `nango.triggerAction()`
     - O llamar directamente a la HTTP API con curl/axios
  7. **Para agentes de IA**:
     - Exponer actions como tools MCP o schemas para LangChain
     - Los agentes pueden ejecutar operaciones sin conocer credentials
  8. **Self-hosting** (opcional):
     ```bash
     # Desplegar con docker-compose
     docker-compose up -d
     # Variables: NANGO_ENCRYPTION_KEY, NANGO_DB_USER, NANGO_DB_PASSWORD, etc.
     ```
  9. **Mejores prácticas**:
     - Usar `nango dryrun` para testing local antes de deploy
     - Implementar checkpoints para syncs resistentes a fallos
     - Usar metadata de conexión para almacenar configuración por cliente
     - Versionar funciones de integración en Git
     - Monitorear con las observabilidad integrada (logs, métricas, alertas)
- **Fecha de aprendizaje**: 2026-05-27
