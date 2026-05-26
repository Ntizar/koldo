# Metabase

Metabase is the easy, open-source way for everyone in your company to ask questions and learn from data. It's a business intelligence (BI) platform that lets teams explore, visualize, and share data without requiring SQL knowledge — though SQL is fully supported for advanced users.

**Stack:** Clojure (backend) + React (frontend)
**License:** AGPL (open-source edition) + Commercial licenses for Pro/Enterprise
**Repo:** [metabase/metabase](https://github.com/metabase/metabase) (~47k ⭐)

## Key Features

- **No-code questions:** Ask questions using the graphical query builder — no SQL required.
- **SQL editor:** Full native SQL editor with parameters, field filters, snippets, and table variables.
- **Metabot AI:** AI assistant that generates queries from natural language, writes SQL, fixes errors, and analyzes charts. Also available in Slack.
- **Interactive dashboards:** Group questions into tabs with filters, auto-refresh, fullscreen mode, and custom click behavior (drill-through, cross-filtering, custom destinations).
- **Documents:** Long-form data analysis combining text (Markdown), charts, and AI — with commenting.
- **Data Studio:** Create transforms, canonical metrics, and models; track dependencies.
- **Embedding:** Modular embedding (charts, dashboards, query builder, AI chat, browser) with SSO or guest auth. Full app embedding via iframe. Modular embedding SDK for React.
- **Permissions:** Granular row and column security, collection permissions, database routing, connection impersonation.
- **Alerts & Subscriptions:** Schedule dashboard results via email or Slack, with per-subscriber filter customization.
- **Git versioning:** Serialize and version your Metabase content with Git (remote sync).
- **Library & Collections:** Organize and curate content.

## Installation

1. **Metabase Cloud (recommended):** Sign up at [store.metabase.com](https://store.metabase.com/checkout) for managed hosting with backups, SSL, SMTP, and SoC2 Type 2.
2. **Docker (self-hosted, recommended):** `docker run -d -p 3000:3000 --name metabase metabase/metabase:latest`
3. **JAR file:** Download from [releases](https://github.com/metabase/metabase/releases) and run `java -jar metabase.jar`
4. **Other:** Podman, Azure Web Apps, systemd service, or build from source.

## When to Use This Skill

- Setting up and configuring a Metabase instance
- Building questions with the query builder or SQL editor
- Creating interactive dashboards with filters and auto-refresh
- Embedding Metabase in applications (modular, full app, SDK, guest)
- Configuring Metabot AI and the Agent API
- Setting up permissions, row/column security, and SSO
- Managing subscriptions, alerts, and exports
- Data modeling with models, metrics, and transforms

## Sub-Skills

- `references/pattern-embedding.md` — Embedding patterns (modular, full app, SDK, guest, AI chat)
- `references/pattern-questions-queries.md` — Questions, SQL editor, Metabot AI, documents
- `references/pattern-dashboard-filters.md` — Dashboards, filters, interactivity, subscriptions
