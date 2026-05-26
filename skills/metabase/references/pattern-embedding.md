# Patrón de Embed de Metabase en Apps

Metabase ofrece múltiples formas de embeber analytics en aplicaciones externas. La elección depende del nivel de interactividad, autenticación y personalización que necesites.

## Tipos de Embedding

### 1. Modular Embedding (Recomendado)

Embed de componentes individuales (dashboards, preguntas, query builder, AI chat, browser) en tu app.

**Habilitar:** Admin > Embedding > Toggle "Enable modular embedding"

**Autenticación:**
- **SSO** (Pro/Enterprise): Cada usuario tiene su propia cuenta Metabase. Permite drill-through, query builder, browser, Metabot AI, data permissions por usuario.
- **Guest** (Todos los planes): Sin cuenta por usuario. JWT firmado con clave secreta. View-only, sin drill-through. Ideal para casos simples o cuando no puedes provisionar cuentas.

**CORS:** Configura las URLs de los sitios donde embeberás (ej: `https://*.example.com`). `localhost` siempre incluido.

### 2. Full App Embedding

Embed de toda la app Metabase en un iframe. Integra SSO + permissions para que cada usuario vea solo sus datos.

**Requisitos:** Pro/Enterprise, SSO (JWT recomendado), grupos y permissions configurados.

**Habilitar:** Admin > Embedding > Enable Full app embedding > Authorized origins.

**Iframe src:**
```html
<!-- Dashboard por Entity ID -->
<iframe src="https://metabase.yourcompany.com/dashboard/entity/Dc_7X8N7zf4iDK9Ps1M3b"></iframe>

<!-- Con tab específico -->
<iframe src="https://metabase.yourcompany.com/dashboard/entity/Dc_7X8N7zf4iDK9Ps1M3b?tab=YLNdEYtzuSMA0lqO7u3FD"></iframe>

<!-- Redirección SSO directa -->
<iframe src="https://metabase.example.com/auth/sso?jwt=***&return_to=%2Fdashboard%2F1"></iframe>
```

**postMessage (bidireccional):**
- **Desde Metabase → App:** `location` (cambios de URL), `frame` (normal/fit con height en px).
- **Desde App → Metabase:** `location` (cambiar URL embebida).

**SameSite:** Para cross-domain, configurar `MB_SESSION_COOKIE_SAMESITE=none` (Admin > Embedding > Security).

### 3. Public Links/Embeds

Links públicos para dashboards y preguntas. Cualquiera puede verlos sin autenticación.

### 4. Modular Embedding SDK

Para apps React (18/19). Componentes React con personalización avanzada, plugins, theming granular.

```bash
npm install @metabase/embedding-sdk-react@60-stable
```

**Limitaciones:** No soporta SSR, verified content, official collections, dashboard link cards. Máximo un dashboard por página.

## Componentes Modulares

| Componente | SSO | Guest | SDK | Full App |
|---|---|---|---|---|
| Chart | ✅ | ✅ | ✅ | ✅ |
| Chart drill-through | ✅ | ❌ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Query builder | ✅ | ❌ | ✅ | ✅ |
| Browser (collections) | ✅ | ❌ | ✅ | ✅ |
| AI chat (Metabot) | ✅ | ❌ | ✅ | ✅ |
| Custom layouts/plugins | ❌ | ❌ | ✅ | ❌ |

### Componentes HTML Web Components

```html
<!-- Dashboard embebido -->
<metabase-dashboard
  dashboard-id="1"
  with-title="true"
  with-downloads="false"
  initial-parameters='{"category":["Gizmo"]}'
></metabase-dashboard>

<!-- Pregunta embebida -->
<metabase-question question-id="1"></metabase-question>

<!-- Nuevo query builder visual -->
<metabase-question question-id="new"></metabase-question>

<!-- SQL editor -->
<metabase-question question-id="new-native"></metabase-question>

<!-- Browser de colecciones (SSO solo) -->
<metabase-browser
  initial-collection="14"
  read-only="false"
  collection-entity-types="['collection', 'dashboard']"
></metabase-browser>

<!-- AI Chat (SSO solo) -->
<metabase-ai-chat></metabase-ai-chat>
```

### Atributos de Componentes

| Atributo | Descripción |
|---|---|
| `dashboard-id` / `question-id` | ID del recurso a embeber |
| `with-title` | Mostrar/ocultar título (`"true"`/`"false"`) |
| `with-downloads` | Habilitar/deshabilitar descarga de datos |
| `initial-parameters` | Valores iniciales de parámetros (JSON string, no controlado) |
| `parameters` | Valores controlados de parámetros |
| `auto-refresh-interval` | Intervalo de auto-refresh en segundos (dashboards) |
| `hidden-parameters` | Lista de parámetros ocultos |
| `custom-context` | Contexto personalizado para JWT refresh |

## Configuración Global (Page-level Config)

```html
<script defer src="https://your-metabase-url/app/embed.js"></script>

<script>
  function defineMetabaseConfig(config) {
    window.metabaseConfig = config;
  }
</script>

<script>
  defineMetabaseConfig({
    instanceUrl: "https://your-metabase-url",
    theme: {
      fontFamily: "Lato",
      fontSize: "16px",
      colors: {
        background: "#11123d",
        "text-primary": "#f9f9fc",
        brand: "#50e397",
        filter: "#7172AD",
        summarize: "#88BF4D",
      },
    },
    // Para desarrollo: usar tu sesión actual
    useExistingUserSession: true,
    // Para desarrollo: usar API key
    apiKey: "mb_YourAPIKey",
    // Custom JWT refresh
    fetchRequestToken: () => Promise.resolve({ jwt: "..." }),
    // Plugins para personalizar comportamiento
    pluginsConfig: {
      handleLink: (event) => { /* custom logic */ },
    },
  });
</script>
```

## Guest Embedding (JWT)

### Generación del Token (Server-side)

```javascript
const jwt = require("jsonwebtoken");
const METABASE_SECRET_KEY = "YOUR_SECRET";

const payload = {
  resource: { dashboard: 10 },  // o { question: 5 }
  params: { category: ["Gadget"] },  // locked parameters
  exp: Math.round(Date.now() / 1000) + 10 * 60,  // expira en 10 min
};

const token = jwt.sign(payload, METABASE_SECRET_KEY);
```

### Parámetros Locked

Permiten filtrar datos sin exponer el filtro al usuario final. Útil para multi-tenant (cada cliente ve solo sus datos).

```javascript
// Server: incluir parámetros locked en JWT
const payload = {
  resource: { dashboard: 10 },
  params: { category: ["Gadget"] },  // hidden from user
  exp: Math.round(Date.now() / 1000) + 10 * 60,
};

// Client: el parámetro no se ve en el HTML
<metabase-dashboard token="YOUR_JWT_TOKEN"></metabase-dashboard>
```

- Múltiples locked params se combinan con `AND`.
- Pasar `[]` desactiva un locked param para ese token.
- Los locked params limitan los valores disponibles en otros filtros editables.

### Refresh de JWT

```javascript
// Endpoint en tu server para renovar tokens
app.post("/api/metabase-guest-token", (req, res) => {
  const { entityType, entityId, customContext } = req.body;
  const payload = {
    resource: { [entityType]: entityId },
    params: paramsFor(req.session?.user, customContext),
    exp: Math.round(Date.now() / 1000) + 10 * 60,
  };
  res.json({ jwt: jwt.sign(payload, METABASE_SECRET_KEY) });
});
```

Configurar en el client:
```html
<script>
  window.metabaseConfig = {
    isGuest: true,
    instanceUrl: "YOUR_METABASE_URL",
    guestEmbedProviderUri: "/api/metabase-guest-token",
  };
</script>
```

## Theming y Personalización

### Embedding Themes (Pro/Enterprise)

Crear temas en Admin > Embedding > Themes. Aplicar en el embed:

```javascript
defineMetabaseConfig({
  instanceUrl: "https://your-metabase-url",
  theme: {
    name: "mi-tema-personalizado",
    fontFamily: "Inter",
    fontSize: "14px",
    colors: {
      background: "#ffffff",
      "text-primary": "#333333",
      brand: "#0066cc",
      filter: "#4488cc",
      summarize: "#22aa44",
    },
    cardLayout: "fit",  // fit o fixed
  },
});
```

### Traducción

```javascript
window.metabaseConfig = {
  instanceUrl: "YOUR_METABASE_URL",
  locale: "es",  // traduce UI
};
```

Para traducir contenido (títulos, labels), subir un [translation dictionary](https://www.metabase.com/docs/latest/embedding/translations).

## Comparación de Tipos

| Acción | SDK | Modular SSO | Modular Guest | Full App | Public |
|---|---|---|---|---|---|
| Charts/dashboards | ✅ | ✅ | ✅ | ✅ | ✅ |
| Filter widgets | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export results | ✅ | ✅ | ✅ | ✅ | ✅ |
| Locked filters | ❌ | ❌ | ✅ | ❌ | ❌ |
| Data segregation | ✅ | ✅ | ❌ | ✅ | ❌ |
| Drill-through | ✅ | ✅ | ❌ | ✅ | ❌ |
| Query builder | ✅ | ✅ | ❌ | ✅ | ❌ |
| Advanced theming | ✅ | ✅ | ❌ | ❌ | ❌ |
| Plugins | ✅ | ❌ | ❌ | ❌ | ❌ |
| AI chat | ✅ | ✅ | ❌ | ✅ | ❌ |
| Usage analytics | ✅ | ✅ | ❌ | ✅ | ❌ |
| Custom layouts | ✅ | ❌ | ❌ | ❌ | ❌ |

## Recursos de Referencia

- [Modular Embedding](https://www.metabase.com/docs/latest/embedding/modular-embedding)
- [Full App Embedding](https://www.metabase.com/docs/latest/embedding/full-app-embedding)
- [Modular Embedding SDK](https://www.metabase.com/docs/latest/embedding/sdk/introduction)
- [Guest Embedding](https://www.metabase.com/docs/latest/embedding/guest-embedding)
- [Embedding Components](https://www.metabase.com/docs/latest/embedding/components)
- [Securing Embeds](https://www.metabase.com/docs/latest/embedding/securing-embeds)
- [Appearance/Theming](https://www.metabase.com/docs/latest/embedding/appearance)
- [AI Agent Resources](https://www.metabase.com/docs/latest/embedding/ai-agent-resources)
- [Reference Apps](https://github.com/metabase/embedding-reference-apps)
- [Node.js Express Sample](https://github.com/metabase/metabase-nodejs-express-interactive-embedding-sample)
