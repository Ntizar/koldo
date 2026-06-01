# Exploración de Repositorios con Estrellas de Ntizar

**Fecha**: 2026-06-01 04:15
**Fuente**: GitHub API - repositorios con estrella del usuario Ntizar
**Total explorados**: 62 repos con estrellas

---

## Resumen Ejecutivo

Se han explorado 62 repositorios con estrella del usuario Ntizar. De estos, se ha analizado en profundidad los 30 más relevantes para el ecosistema Koldo.

## Categorías Identificadas

### 1. 🚇 Transporte Público y GTFS (8 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| gabrielAHN/gtfs-viz | 49★ | TypeScript | Visualización GTFS en navegador con DuckDB WASM |
| MobilityData/awesome-transit | 1762★ | - | Catálogo comunitario de APIs y herramientas de transporte |
| WRI-Cities/static-GTFS-manager | 159★ | JavaScript | Editor web de feeds GTFS estáticos |
| WRI-Cities/payanam | 17★ | JavaScript | Mapeo de transporte público a GTFS |
| OneBusAway/onebusaway-gtfs-realtime-visualizer | 68★ | Java | Visualizador GTFS-realtime |
| nagix/mini-tokyo-3d | 4081★ | JavaScript | Mapa 3D en tiempo real del transporte de Tokio |
| vasile/transit-map | 372★ | JavaScript | Simulación de transporte público en mapas |
| BlinkTagInc/gtfs-to-html | 225★ | TypeScript | Generación de horarios HTML/PDF desde GTFS |

**Hallazgos clave**:
- **gtfs-viz** usa DuckDB WASM para procesamiento 100% client-side - patrón reutilizable
- **city2graph** (también relevante) convierte datos geoespaciales a grafos para GNNs
- **mini-tokyo-3d** y **transit-map** son referencias para visualización 3D de transporte

### 2. 🤖 Agentes IA y Orquestación (6 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| stablyai/orca | 3818★ | TypeScript | IDE multi-agente con worktrees aislados |
| NVIDIA/SkillSpector | 766★ | Python | Escáner de seguridad para skills de agentes |
| XMihura/Kanvas | 170★ | JavaScript | Canvas de proyectos en Obsidian para humanos+agentes |
| google/eng-practices | 23047★ | - | Documentación de prácticas de ingeniería de Google |
| K-Dense-AI/scientific-agent-skills | 26769★ | Python | Biblioteca de skills científicas para agentes |
| NousResearch/hermes-agent | 174906★ | Python | El propio Hermes Agent |

**Hallazgos clave**:
- **SkillSpector** tiene 64 patrones de vulnerabilidad en 16 categorías - referencia crítica para seguridad
- **Orca** usa worktrees git aislados para agentes paralelos - patrón de orquestación
- **Kanvas** propone un flujo Canvas→JSON→CLI para coordinación humano-agente

### 3. 🎙️ Voz y Audio (3 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| microsoft/VibeVoice | 47605★ | Python | Voice AI de frontera open-source (TTS + ASR) |
| jamiepine/voicebox | 28996★ | TypeScript | Estudio de voz local completo (clonación, dictado) |

**Hallazgos clave**:
- **VibeVoice** de Microsoft es el modelo de referencia en TTS/ASR open-source 2026
- **Voicebox** es el stack completo de voz local: clonación + dictado + agentes

### 4. 📄 Procesamiento de Documentos (3 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| run-llama/liteparse | 8406★ | Rust | Parser PDF rápido y ligero con OCR |
| microsoft/markitdown | 135464★ | Python | Conversor universal de archivos a Markdown |
| shebinleo/pdf2html | 206★ | JavaScript | PDF a HTML con Apache Tika |

**Hallazgos clave**:
- **LiteParse** usa PDFium para parsing espacial rápido - alternativa a LlamaParse
- **MarkItDown** soporta PDF, PPT, Word, Excel, imágenes, audio, ZIP, YouTube, EPUB

### 5. 🛰️ Satélite y Geoespacial (5 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| sparkyniner/DRISH-X | 233★ | Python | Inteligencia de carga desde Sentinel-2 |
| Aouei/remote-sensing-satellite-downloader | 4★ | Python | Descarga de Sentinel-2/Landsat |
| orcunkok/AWS-Dem-Downloader | 8★ | Python | Descarga de DEM de elevación AWS |
| c2g-dev/city2graph | 1219★ | Python | GeoAI con Graph Neural Networks |
| maptalks/maptalks.three | 645★ | HTML | Capa maptalks con Three.js |

**Hallazgos clave**:
- **DRISH-X** explota el parpadeo de Sentinel-2 para detectar vehículos en movimiento
- **city2graph** integra GeoPandas + NetworkX + PyTorch Geometric para GeoAI

### 6. 👁️ Visión y Gaze (2 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| antoinelame/GazeTracking | 2576★ | Python | Eye tracking por webcam |
| Blaizzy/mlx-vlm | 4800★ | Python | Inference de Vision Language Models en Mac |

### 7. 🎨 Diseño y CSS (2 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| Z1Code/glass-refraction | 35★ | TypeScript | Liquid Glass CSS con SVG refraction |
| alexpate/awesome-design-systems | 24599★ | - | Colección de sistemas de diseño |

### 8. 📊 BI y Datos (2 repos)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| metabase/metabase | 47523★ | Clojure | BI open-source |
| crystaldba/postgres-mcp | 2830★ | Python | Postgres MCP Pro para agentes |

### 9. 🎬 Video Pipeline (1 repo)
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| htekdev/vidpipe | 167★ | TypeScript | Pipeline AI de edición de video |

### 10. ⚡ Otros
| Repo | Estrellas | Lenguaje | Descripción |
|------|-----------|----------|-------------|
| microsoft/qlib | 43849★ | Python | Plataforma cuant con IA de Microsoft |
| PINTO0309/PINTO_model_zoo | 4402★ | Python | Zoo de modelos ML convertidos |
| PabloCastellano/libreborme | 134★ | Python | Plataforma BOEMEs |
| cristobal-GC/electriciPy_market | 31★ | Python | Mercado eléctrico español |
| fitomad/bicimad | 4★ | Swift | Cliente API BiciMad |
| twentyhq/twenty | 48840★ | TypeScript | CRM open-source para IA |
| NangoHQ/nango | 9609★ | TypeScript | Integraciones de productos con IA |

---

## Patrones y Aprendizajes Clave

### Patrón 1: DuckDB WASM para procesamiento client-side
- **gtfs-viz** demuestra que DuckDB puede correr 100% en navegador con WASM
- Permite importar, consultar y exportar GTFS sin backend
- Extensión nativa de DuckDB con macros SQL embebidas

### Patrón 2: Pipeline de video agéntico
- **vidpipe** usa YAML para especificar pipelines de procesamiento
- 3 niveles: minimal (solo limpieza), clean (subtítulos), full (producción completa)
- Integración con GitHub Copilot SDK para agentes de edición

### Patrón 3: Seguridad de skills de agentes
- **SkillSpector** de NVIDIA identifica 26.1% de skills con vulnerabilidades
- 64 patrones de vulnerabilidad en 16 categorías
- Análisis estático + evaluación semántica con LLM

### Patrón 4: GeoAI con Graph Neural Networks
- **city2graph** unifica GeoPandas, NetworkX y PyTorch Geometric
- Convierte datos geoespaciales a grafos para análisis urbano
- Soporta GTFS, Overture Maps, OpenStreetMap

### Patrón 5: Satellite-powered intelligence
- **DRISH-X** detecta tráfico de camiones desde Sentinel-2
- Aprovecha el parpadeo RGB del sensor (1.01s entre canales)
- API FastAPI + detección con YOLO

---

## Repositorios Propios de Ntizar (26 repos)

Los proyectos propios del usuario Ntizar cubren:
- **Ntizar-Aurora**: Sistema de diseño Liquid Glass CSS
- **koldo**: Repositorio de conocimiento y extracción de skills
- **FreeHands**: Control sin manos (gaze + gestures + voice)
- **SistemaElectricoFuturo**: Simulador del sistema eléctrico español
- **solmad**: Buscador 3D de terrazas con sol en tiempo real
- **datos-gob-watch**: Digest semanal de datos.gob.es
- **nap-dashboard**: Dashboard React para datos NAP
- **Voynich_Solving**: Desciframiento del Manuscrito Voynich
- **NtizarBrainMasterMind**: Orquestación multi-agente
- **IRPFdibujitos**: Calculadora visual del IRPF español

---

## Acciones Generadas

### Skills creadas:
1. `gtfs-viz-client-side` - Patrón de visualización GTFS 100% client-side con DuckDB WASM
2. `satellite-traffic-detection` - Detección de tráfico desde satélite Sentinel-2
3. `agent-skill-security` - Escaneo de seguridad para skills de agentes IA
4. `geoai-city2graph-pattern` - Conversión de datos geoespaciales a grafos GNN
5. `agentic-video-pipeline` - Pipeline de video agéntico con especificaciones YAML

### Notas creadas:
1. `notes/2026-06-01-exploracion-repositorios-ntizar-starred.md` - Este documento

### Memoria del sistema actualizada:
- Preferencias de exploración de repositorios
- Patrones tecnológicos identificados
- Referencias a herramientas clave del ecosistema
