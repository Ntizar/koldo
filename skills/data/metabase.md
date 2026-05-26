# Metabase

- **URL:** https://github.com/metabase/metabase
- **Categoría:** Data / Business Intelligence
- **¿Qué hace?:** Metabase es una herramienta de código abierto de Business Intelligence (BI) y análisis embebido que permite a cualquier persona en tu empresa hacer preguntas y aprender de los datos sin necesidad de saber SQL. Soporta más de 25 bases de datos (PostgreSQL, MySQL, SQLite, BigQuery, Snowflake, MongoDB, etc.), ofrece un editor SQL para consultas complejas, un constructor de consultas visual, dashboards interactivos con filtros, Metabot (IA para generar respuestas y queries), Data Studio para transformar datos, alertas programadas, y un sistema de permisos granular. Se puede autoalojar o usar en la nube.
- **Casos de uso:**
  - Dashboards de negocio para equipos no técnicos
  - Análisis auto-servicio (self-service analytics) con constructor visual
  - Análisis embebido en aplicaciones SaaS (embedded analytics)
  - Generación de reportes automatizados por email/Slack/webhook
  - Query builder SQL para analistas técnicos
  - Data studio: transformar datos crudos en tablas listas para análisis
  - Multi-tenant analytics para SaaS con aislamiento de datos por cliente
  - Integración con Slack mediante Metabot
  - Documentación analítica con documentos colaborativos
- **Snippets útiles:**
  - *Instalar con Docker (Open Source):*
    ```bash
    docker pull metabase/metabase:latest
    docker run -d -p 3000:3000 --name metabase metabase/metabase
    # Acceder en http://localhost:3000
    ```
  - *Instalar con Docker (Enterprise/Pro):*
    ```bash
    docker pull metabase/metabase-enterprise:latest
    docker run -d -p 3000:3000 --name metabase metabase/metabase-enterprise
    ```
  - *Ejecutar el JAR directamente:*
    ```bash
    java -jar metabase.jar
    ```
  - *Instalar SDK de embebido (React):*
    ```bash
    npm install @metabase/embedding-sdk-react@60-stable
    ```
  - *Generar JWT para Guest Embed (Node.js):*
    ```javascript
    const jwt = require("jsonwebtoken");
    const METABASE_SECRET_KEY = "TU_CLAVE_SECRETA";
    const payload = {
      resource: { dashboard: 10 },  // o { question: 5 }
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60,
    };
    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    ```
  - *Configurar JWT SSO para Modular Embed (Express.js):*
    ```javascript
    const jwt = require("jsonwebtoken");
    const METABASE_SECRET = "TU_CLAVE_SECRETA";
    app.get("/sso/metabase", (req, res) => {
      const payload = {
        resource: { "param/dashboard": req.query.dashboard_id },
        params: {},
        "exp": Math.round(Date.now() / 1000) + (60 * 60 * 24 * 365),
        "email": req.user.email,
        "first_name": req.user.first_name,
        "last_name": req.user.last_name,
        "external_id": req.user.id,
      };
      const token = jwt.sign(payload, METABASE_SECRET);
      res.json({ jwt: token });
    });
    ```
  - *Petición API con clave (curl):*
    ```bash
    curl -H 'X-API-Key: TU_API_KEY' \
      https://tu-metabase.com/api/dashboard
    ```
  - *Variables de entorno esenciales para Docker:*
    ```bash
    docker run -d -p 3000:3000 --name metabase \
      -e MB_DB_TYPE=postgres \
      -e MB_DB_DBNAME=metabase \
      -e MB_DB_PORT=5432 \
      -e MB_DB_USER=mbuser \
      -e MB_DB_PASS=secret \
      -e MB_DB_HOST=postgres \
      metabase/metabase
    ```
- **Cómo integrarlo en proyectos:**
  - **Embebido modular (SDK React):** Instala `@metabase/embedding-sdk-react`, configura CORS en Metabase (Admin > Embedding), y usa componentes como `<MetabaseDashboard />` o `<MetabaseQuestion />`. Ideal para apps React que necesitan dashboards embebidos con control fino.
  - **Embebido SSO con JWT:** Configura JWT SSO en Metabase (requiere Pro/Enterprise). Tu backend genera tokens JWT firmados con la clave secreta de Metabase. El frontend usa `defineMetabaseAuthConfig` para autenticar al usuario. Permite permisos granulares por usuario y data segregation multi-tenant.
  - **Guest Embed:** Para embeber sin autenticación de usuarios. Genera JWT simples con `jsonwebtoken` en tu backend. Los componentes web `<metabase-dashboard>` y `<metabase-question>` se cargan vía el script `app/embed.js` de Metabase. Ideal para dashboards públicos.
  - **API REST:** Autentica con `X-API-Key` header. Los endpoints cubren dashboards (`/api/dashboard`), preguntas/cards (`/api/card`), bases de datos (`/api/database`), usuarios/grupos (`/api/user`, `/api/group`), colecciones, etc. Documentación completa en `docs/api.html` del repo.
  - **Embebido de app completa:** Embed todo Metabase en un iframe con SSO. Tu backend maneja la autenticación y redirige al usuario con el JWT. Ideal para portales de clientes.
  - **CI/CD y despliegue:** Docker image oficial en `metabase/metabase` y `metabase/metabase-enterprise`. Soporta PostgreSQL/MySQL como DB de aplicación. Se puede desplegar en AWS Elastic Beanstalk, Azure, Kubernetes (sin chart oficial), o como servicio systemd.
  - **Data Studio y transforms:** Para pipelines de datos, usa Metabase Data Studio para crear transforms (similar a dbt) que conviertan datos crudos en tablas analíticas.
  - **Referencias:** Repo de ejemplo de embebido: https://github.com/metabase/shoppy, docs de SDK: https://www.metabase.com/docs/latest/embedding/sdk/introduction
- **Fecha de aprendizaje:** 2026-05-26
