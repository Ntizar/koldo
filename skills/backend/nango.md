---
name: nango-integracion-apis
description: "Patrón de integración de APIs externas con OAuth automático, sync de datos y proxy. 800+ APIs soportadas, compatible con MCP nativo. Ideal para dashboards que consumen múltiples fuentes."
version: 2.0.0
author: Ntizar + Koldo
---

# Integración de APIs con Nango

Plataforma para integrar APIs externas (Slack, Notion, GitHub, Google, etc.) sin gestionar OAuth manualmente. Ofrece sync programado, proxy autenticado y MCP.

## Arquitectura

```
Tu App
  │
  ├── [Nango SDK] → Proxy autenticado → API externa
  │     ├── Managed OAuth (refresh automático)
  │     ├── Rate limiting
  │     └── Error handling
  │
  ├── [Nango Sync] → Polling programado
  │     ├── JSONata transforms
  │     ├── Incremental syncs
  │     └── Webhook alerts
  │
  └── [Nango MCP] → LLM Agent access
        └── Herramientas MCP para agentes
```

## Instalación

```bash
# Server (autohosted)
docker run -p 3003:3003 nangohq/nango-server

# O usar Nango Cloud (gratuito hasta 100 conexiones)

# SDK Node.js
npm install @nangohq/node
```

## Patrón: Proxy Autenticado

El patrón más común: llamar a una API externa sin gestionar tokens.

```javascript
const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY });

// Configurar conexión (una vez)
await nango.createConnection('notion', {
  connectionId: 'ntizar-workspace',
  params: { code: oauthCode }, // Primer OAuth
});

// Llamar API con proxy
const response = await nango.proxy({
  provider: 'notion',
  endpoint: '/v1/databases/xxxxx/query',
  connectionId: 'ntizar-workspace',
  method: 'POST',
  data: { filter: { property: 'Status', select: { equals: 'Done' } } },
});
// Nango gestiona: OAuth, refresh token, rate limit, retries
```

## Patrón: Sync Programado

Para mantener datos locales actualizados sin llamar a la API cada vez.

```javascript
// Definir sync (YAML)
syncs:
  github-issues:
    runs: every hour
    track: github_issue.updated_at
    endpoint: GET /repos/Ntizar/Koldo/issues
    transform: |
      results.*.jsonata({
        "id": id,
        "title": title,
        "state": state,
        "updated_at": updated_at,
        "labels": labels.label
      })

// En Node.js: obtener datos sincronizados
const { records } = await nango.listRecords({
  provider: 'github',
  syncName: 'github-issues',
  connectionId: 'ntizar-workspace',
});
```

## Patrón: Acciones Personalizadas

Para operaciones complejas (crear/actualizar en APIs externas).

```javascript
// Definir acción
actions:
  create-notion-task:
    endpoint: POST /v1/pages
    request: |
      {
        "parent": { "database_id": "{{context.databaseId}}" },
        "properties": {
          "Name": { "title": [{ "text": { "content": "{{input.title}}" } }] },
          "Status": { "select": { "name": "{{input.status}}" } }
        }
      }

// Llamar desde Node.js
await nango.triggerAction({
  provider: 'notion',
  actionName: 'create-notion-task',
  connectionId: 'ntizar-workspace',
  input: { title: 'Revisar PR #42', status: 'In Progress' },
});
```

## Patrón: MCP Nativo

Para que agentes AI (Koldo, Claude Code, Codex) consuman APIs externas directamente.

```bash
# Iniciar servidor MCP de Nango
npx @nangohq/mcp-server --secret-key $NANGO_SECRET_KEY

# En config.yaml de Hermes
tools:
  mcp:
    nango:
      command: npx
      args: ["@nangohq/mcp-server", "--secret-key", "$NANGO_SECRET_KEY"]
```

El agente puede entonces: listar conexiones, llamar APIs via proxy, ejecutar syncs, todo desde lenguaje natural.

## Compatibilidad con Hermes/Koldo

```yaml
# config.yaml de Hermes
skills:
  external_dirs:
    - /root/workspace/Koldo/skills
  
tools:
  mcp_servers:
    nango:
      transport: stdio
      command: npx
      args: ["@nangohq/mcp-server", "--secret-key", "${NANGO_SECRET_KEY}"]
```

## Proveedores principales (de 800+)

| Proveedor | Auth | Sync disponible | Proxy |
|-----------|------|----------------|-------|
| GitHub | OAuth | ✅ Issues, PRs, repos | ✅ |
| Notion | OAuth | ✅ Databases, pages | ✅ |
| Slack | OAuth | ✅ Messages, channels | ✅ |
| Google Drive | OAuth | ✅ Files, folders | ✅ |
| Google Calendar | OAuth | ✅ Events | ✅ |
| Linear | OAuth | ✅ Issues, projects | ✅ |
| Gmail | OAuth | ✅ Messages | ✅ |
| Jira | OAuth | ✅ Issues, projects | ✅ |
| Salesforce | OAuth | ✅ Objects, queries | ✅ |
| Stripe | OAuth | ✅ Charges, customers | ✅ |

## Buenas prácticas

1. **ConnectionId único** — cada usuario/proyecto tiene su propio ID (ej: `ntizar-workspace`)
2. **Usar proxy antes que sync** — el proxy es más rápido, el sync es para datos que necesitas offline
3. **JSONata en transforms** — más potente que JS para transformar datos
4. **Webhooks en sync** — Nango dispara webhooks cuando hay cambios
5. **MCP para agentes** — exponer solo las APIs que el agente necesita
6. **SecretKey en .env** — NUNCA hardcodear NANGO_SECRET_KEY

## Pitfalls

- ❌ ConnectionId no único → tokens mezclados entre usuarios
- ❌ Llamar API directamente en vez de proxy → pierdes OAuth managed, refresh automático
- ❌ Rate limit sin manejar → Nango lo hace automático con proxy
- ❌ No usar MCP para agentes → el agente tendría que saber OAuth manualmente

## Referencia

- Web: https://nango.dev
- Repo: https://github.com/NangoHQ/nango (9.3K⭐)
- Docs: https://docs.nango.dev
- Skills relacionadas: servicio-resumen-consolidado, frontend-api-client-errores
