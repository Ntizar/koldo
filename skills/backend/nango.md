# Nango - Product Integrations Platform

- **URL**: https://github.com/NangoHQ/nango
- **Stars**: 8,542
- **Lenguaje**: TypeScript
- **Categoría**: Backend / Integraciones / API
- **¿Qué hace?**: Plataforma open-source para construir integraciones de productos con 800+ APIs pre-configuradas. Maneja OAuth, API keys, token refresh, proxy de requests, y ejecución de funciones de integración. Funciona con cualquier backend language, AI coding tool y agent SDK. Usado en producción por Replit, Ramp, Mercor.

## Casos de uso
1. **AI Tool Calling & MCP**: Dar a agentes IA la capacidad de actuar sobre APIs externas (Gmail, GitHub, Slack, etc.)
2. **Data Syncing**: Sincronización unidireccional o bidireccional para pipelines RAG, indexación y triggers
3. **Webhook Processing**: Recibir y procesar webhooks de APIs externas de forma fiable
4. **API Unification**: Normalizar múltiples APIs a un esquema universal propio
5. **Actions**: Escribir datos y ejecutar operaciones en nombre de usuarios
6. **Per-customer config**: Personalizar comportamiento de integración por cliente
7. **Embed auth flow**: Integrar flujo de autenticación white-label en tu app

## Patrones útiles

### 1. Tres primitivas fundamentales
Nango ofrece exactamente 3 operaciones que cubren TODOS los patrones de integración:

```
Auth → Proxy → Functions
```

- **Auth**: Managed OAuth/API keys/token refresh para 800+ APIs
- **Proxy**: Requests autenticados con retry, rate limits, credential injection
- **Functions**: Lógica de integración como funciones TypeScript

### 2. Función de integración pattern
```typescript
export default async function run(nango: Nango) {
    const { owner, repo, title, body } = nango.input;
    
    const response = await nango.post({
        endpoint: `/repos/${owner}/${repo}/issues`,
        data: { title, body }
    });
    
    return response.data;
}
```

### 3. SDK Node.js pattern
```typescript
import { Nango } from '@nangohq/node';

const nango = new Nango({ secretKey: '<NANGO-SECRET-KEY>' });

// Hacer request autenticado
const response = await nango.get({
    endpoint: '/v3/contacts',
    providerConfigKey: '<INTEGRATION-ID>',
    connectionId: '<CONNECTION-ID>'
});

// Obtener credenciales
const connection = await nango.getConnection('<INTEGRATION-ID>', '<CONNECTION-ID>');
console.log(connection.credentials);
```

### 4. Auth embed pattern
```typescript
// Frontend: embed auth flow
nango.openConnectUI({ onEvent: (event) => { /* handle completion */ } });
```

## Snippets reutilizables

### Setup Nango en proyecto Node.js
```bash
# Instalar SDK
npm install @nangohq/node

# O usar CLI para generar integración
npx @nangohq/cli init gmail-integration
```

### Template de función de integración
```typescript
// integration.ts
import { Nango } from '@nangohq/node';

export default async function run(nango: Nango) {
    // 1. Obtener input del usuario/agent
    const { searchQuery, limit } = nango.input;
    
    // 2. Hacer request autenticado al provider
    const response = await nango.get({
        endpoint: '/search',
        providerConfigKey: 'gmail',
        connectionId: 'user-123',
        params: { q: searchQuery, maxResults: limit }
    });
    
    // 3. Transformar a esquema unificado
    return {
        items: response.data.map(item => ({
            id: item.id,
            subject: item.snippet,
            from: item.sender,
            date: item.date
        }))
    };
}
```

### Proxy genérico para cualquier API
```typescript
// Proxy genérico - resuelve provider + credentials automáticamente
async function proxyRequest(nango: Nango, provider: string, connectionId: string, method: string, endpoint: string, data?: any) {
    const config = {
        method: method.toLowerCase(),
        headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) config.data = data;
    
    const response = await nango.request({
        providerConfigKey: provider,
        connectionId,
        endpoint,
        ...config
    });
    
    return response.data;
}
```

## Cómo integrarlo en proyectos

1. **Signup**: Crear cuenta en app.nango.dev (gratis)
2. **Configurar integración**: En Integrations tab, añadir proveedor (Gmail, GitHub, Slack...)
3. **Autenticar**: Crear conexión en Connections tab, completar flujo OAuth
4. **Integrar SDK**: `npm install @nangohq/node`
5. **Usar proxy**: `nango.get/post/put/delete()` con providerConfigKey + connectionId
6. **Embed auth**: `nango.openConnectUI()` en frontend
7. **Deploy functions**: Escribir lógica en TypeScript, deploy a Nango runtime
8. **AI integration**: Exponer como herramientas para agentes (MCP/tool calling)

## Relevancia para Koldo
- **Herramientas de agente**: Nango puede dar a Koldo acceso a APIs externas (Gmail, Google Calendar, etc.)
- **Integraciones product**: Si Koldo se expande a plataforma SaaS, Nango es la capa de integraciones
- **AI tool calling**: Patrones útiles para dar a agentes IA acceso a APIs reales
- **Webhook processing**: Patrón para recibir eventos de APIs externas

## Archivos clave del repo
- `packages/node-client/` - SDK Node.js
- `packages/server/` - Server principal
- `packages/webapp/` - Frontend dashboard
- `snippets/` - Ejemplos de integraciones
- `docker-compose.yaml` - Deploy local

- **Fecha de aprendizaje**: 2026-05-26
