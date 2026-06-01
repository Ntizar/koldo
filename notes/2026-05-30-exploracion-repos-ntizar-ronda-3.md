# Exploración Autónoma de GitHub — Ronda 3 (30/05/2026)

## Contexto
Tercera ronda de exploración de repositorios con estrellas del usuario Ntizar.
Rondas anteriores: 28/05 (7 skills), 29/05 (avance). Esta ronda cubre 30 repos
estrella con enfoque en document processing, engineering practices, integrations
y multi-agent orchestration.

## Repos Explorados en Profundidad

### 1. microsoft/markitdown (130k⭐) — Conversión Archivos a Markdown
**Categoría:** Document Processing / LLM Tooling
**Tecnología:** Python, CLI, Plugins

**Lo más valioso:**
- Herramienta ligera de Microsoft (AutoGen Team) para convertir cualquier archivo a Markdown
- Soporta 12+ formatos: PDF, PPTX, DOCX, XLSX, imágenes, audio, HTML, CSV, JSON, ZIP, YouTube, EPUB
- Enfoque en preservar estructura (headings, listas, tablas) para consumo por LLMs
- Sistema de plugins extensible (ej: markitdown-ocr con LLM Vision)
- Azure Content Understanding para calidad enterprise

**Patrón clave:** "Markdown es el lenguaje nativo de los LLMs" — token-efficient y universalmente entendido.

**Aplicación Koldo:** Pipeline de ingestión de documentos, conversión de attachments en agentes, preprocessing para RAG.

### 2. google/eng-practices (23k⭐) — Engineering Practices de Google
**Categoría:** Engineering Culture / Code Review
**Tecnología:** Documentación (Markdown)

**Lo más valioso:**
- Guía completa de code review con principios probados en Google
- **Principio fundamental:** Aprobar cuando MEJORA la salud del código, no cuando es perfecto
- Checklist de 14 puntos para revisiones profesionales
- Manejo de conflictos: escalar, no bloquear
- Distinción entre "Nit:" (pulido opcional) y cambios críticos

**Patrones clave:**
- "Every line" — revisar cada línea, no solo escanear
- "Context" — considerar el archivo completo, no solo el diff
- "Good things" — elogiar buenas prácticas, no solo errores
- "Technical facts over opinions" — datos sobre preferencias

**Aplicación Koldo:** Estándar de code review para PRs del sistema, guía para agentes IA que revisen código.

### 3. NangoHQ/nango (9.5k⭐) — 800+ APIs Integrations
**Categoría:** API Integration / AI Agents
**Tecnología:** TypeScript, Node.js, Python

**Lo más valioso:**
- Three primitives: Auth (OAuth managed), Proxy (authenticated requests), Functions (custom logic)
- 800+ APIs con OAuth pre-configurado
- AI Builder genera TypeScript functions desde descripción natural
- Patterns: AI tool calling, MCP, data sync, webhooks, API unification
- Runtime production con retries, rate limits, observability

**Arquitectura:**
```
Frontend (Connect UI) → OAuth → Nango → Proxy → API Externa
                                              ↓
                                       Custom Functions (TS)
                                              ↓
                                    Tu App / AI Agent
```

**Aplicación Koldo:** Integración de agentes con APIs externas, data sync para RAG, tool calling para agentes.

### 4. run-llama/liteparse (7.4k⭐) — PDF Parser en Rust
**Categoría:** Document Processing / Computer Vision
**Tecnología:** Rust, Node.js (napi-rs), Python (PyO3), WASM

**Lo más valioso:**
- Core en Rust para máximo rendimiento
- Spatial text extraction con bounding boxes precisos
- OCR selectivo (solo donde falla extracción nativa)
- Grid projection con anchor system para reconstrucción de layout
- Multi-language bindings: Node.js, Python, WASM
- OCR engines pluggables (Tesseract, HTTP server, EasyOCR, PaddleOCR)

**Arquitectura clave:**
```
Input → Conversion → PDFium → OCR(selectivo) → Grid Projection → Output
```

**Aplicación Koldo:** Procesamiento de documentos con preservación de layout, OCR pipelines, ingestión para RAG.

### 5. stablyai/orca (3.7k⭐) — IDE Multi-Agente
**Categoría:** Multi-Agent IDE / Developer Tool
**Tecnología:** TypeScript, Electron, Node.js

**Lo más valioso:**
- IDE para ejecutar múltiples agentes IA (Claude Code, Codex, Grok, etc.)
- Worktree-native: cada agente en su propio worktree aislado
- Multi-agent terminals con tabs y panes
- Source control integrado (diffs, commits, PRs)
- SSH support para agentes remotos
- AGENTS.md: archivo de metadatos con design system y rules

**Patrones clave:**
- AGENTS.md como contrato de calidad del código
- Worktree safety: nunca seguir paths absolutos de subagents
- Cross-platform: checks de plataforma para shortcuts y paths
- Type declarations en .ts, no .d.ts

**Aplicación Koldo:** Patrón AGENTS.md para documentación de skills, worktree safety para subagents.

### 6. K-Dense-AI/scientific-agent-skills (26k⭐) — 142 Skills Científicas
**Categoría:** Agent Skills / Scientific Research
**Tecnología:** Python, Agent Skills Standard

**Lo más valioso:**
- 142 skills científicas listas para usar
- 100+ bases de datos científicas (PubChem, ChEMBL, UniProt, etc.)
- 70+ packages Python con skills optimizadas (RDKit, Scanpy, PyTorch, etc.)
- 9 integraciones de laboratorio (Benchling, DNAnexus, etc.)
- Compatible con cualquier agente que soporte Agent Skills standard

**Ejemplo de skill (database-lookup):**
- 78 bases de datos con selección guiada por categoría
- Workflow: entender query → seleccionar DB → leer referencia → API call → retornar JSON
- Cobertura: física, earth science, chemistry, biology, clinical, economics

### 7. cporter202/API-mega-list (5.5k⭐) — 10,498 APIs
**Categoría:** API Catalog / Developer Resource
**Tecnología:** Markdown, Apify

**Lo más valioso:**
- 10,498 APIs en 18 categorías
- Mayoría son Apify actors (scraping/automation)
- Categorías: AI (1,208), Automation (4,825), Social Media (3,268), Lead Gen (3,452)
- MCP Servers (131), Developer Tools (2,652)

**Aplicación Koldo:** Referencia para descubrir APIs nuevas, categorización de APIs por dominio.

### 8. PINTO0309/PINTO_model_zoo (4.4k⭐) — Model Zoo ML
**Categoría:** Machine Learning / Model Conversion
**Tecnología:** Python, Model conversion scripts

**Lo más valioso:**
- Modelos inter-convertidos entre 9 frameworks: TF, PyTorch, ONNX, OpenVINO, TFJS, TFLite, EdgeTPU, CoreML
- +200 modelos pre-cuantizados (FP32, FP16, INT8, DQ, TPU, WQ)
- Image classification, face recognition, person re-ID, deep sort
- Herramientas propias: onnx2tf, tflite2tensorflow, scs4onnx, snd4onnx

### 9. MobilityData/awesome-transit (1.7k⭐) — Transit Open Tech
**Categoría:** Open Data / Public Transit
**Tecnología:** Markdown (awesome list)

**Lo más valioso:**
- Lista comunitaria de estándares, APIs, apps, herramientas de tránsito abierto
- GTFS (static + realtime), SIRI, GTFS-RT
- GTFS libraries, validators, converters, analysis tools
- Consumer apps, SDKs, visualizations
- Referencia clave para el ecosistema Bicimad de Koldo

## Patrones Transversales Detectados

### 1. Document Processing Pipeline
```
Archivos binarios → MarkItDown/LiteParse → Markdown → Vectorización → RAG
```
Tres herramientas clave: markitdown (general), liteparse (PDF+layout), markitdown-ocr (imágenes).

### 2. AI Agent Integration Pattern
```
Agent → Nango (Auth/Proxy/Functions) → 800+ APIs
        ↓
    MCP Tool Calling
```
Nango como capa de abstracción para que agentes IA actúen sobre APIs externas.

### 3. Multi-Agent Orchestration
```
IDE (Orca) → Worktree per agent → Agent CLI (Claude/Codex/etc)
             ↓
        Source Control + PRs + Notifications
```
Worktree isolation como patrón de seguridad para agentes paralelos.

### 4. Engineering Quality Standards
```
Google Practices → Code Review Checklist → Continuous Improvement
```
Aprobar mejoras, no perfección. Nit: para no-críticos. Escalar conflictos.

### 5. Agent Skills Ecosystem
```
Agent Skills Standard → 142 scientific skills → Any compatible agent
```
Skills como documentos Markdown con YAML frontmatter, ejecutables por cualquier agente.

## Skills Creadas Esta Ronda

| Skill | Fuente | Descripción |
|-------|--------|-------------|
| markitdown-file-to-markdown | microsoft/markitdown | Conversión archivos a Markdown para LLMs |
| google-engineering-practices-code-review | google/eng-practices | Guía de code review profesional |
| nango-800-apis-integrations | NangoHQ/nango | Integraciones con 800+ APIs |
| liteparse-rust-pdf-ocr | run-llama/liteparse | PDF parser rápido con OCR |

## Repos No Explorados en Profundidad

- twentyhq/twenty (48k⭐) — CRM open-source (TypeScript, Nx, NestJS, GraphQL)
- nocobase/nocobase (22k⭐) — AI + no-code platform
- hcengineering/platform (26k⭐) — Huly project management
- SuiteCRM/SuiteCRM (5.5k⭐) — CRM PHP
- espocrm/espocrm (3k⭐) — CRM PHP
- fitomad/bicimad (4⭐) — Cliente Swift de Bicimad
- AbelVM/omt-router (12⭐) — Client-side routing con OpenMapTiles
- gabrielAHN/gtfs-viz (49⭐) — GTFS visualization

## Próximas Exploraciones Sugeridas

1. twentyhq/twenty — Arquitectura Nx monorepo con GraphQL + NestJS
2. hcengineering/platform — Plataforma de project management all-in-one
3. nocobase/nocobase — AI + no-code para business systems
4. Esquema de base de datos de Twenty (PostgreSQL + TypeORM + GraphQL)
5. Arquitectura de Huly (monorepo TypeScript/Node.js)
