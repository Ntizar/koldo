# Scientific Agent Skills - Skills para Agentes de Investigación

- **URL**: https://github.com/K-Dense-AI/scientific-agent-skills
- **Categoría**: IA / Agentes de Investigación
- **Stars**: 26,143+
- **¿Qué es?**: Colección de **138 skills (habilidades) listas para usar** creadas por [K-Dense](https://k-dense.ai) para transformar cualquier agente de IA (Cursor, Claude Code, Codex, Gemini CLI) en un asistente científico completo. Sigue el estándar abierto [Agent Skills](https://agentskills.io/). Cubre genómica, descubrimiento de fármacos, biología molecular, ciencia de materiales, análisis clínico, visualización científica, automatización de laboratorio, bases de datos científicas y más. Cada skill incluye documentación completa, ejemplos de código, casos de uso y mejores prácticas. El repositorio está bajo licencia MIT.

## Skills Disponibles (138 en total)

### 🧬 Bioinformática y Genómica (21+ skills)
| Skill | Descripción |
|-------|-------------|
| **Scanpy** | Análisis completo de scRNA-seq: QC, normalización, PCA, UMAP, clustering Leiden/Louvain, inferencia de trayectorias (PAGA), visualización |
| **AnnData** | Manejo de matrices de datos anotados para genómica single-cell (formato h5ad, integración con Scanpy) |
| **scvi-tools** | Modelos probabilísticos deep learning para single-cell: scVI, scANVI, totalVI, MultiVI, VeloVI, spatial deconvolution |
| **scVelo** | Análisis de RNA velocity: estimación de transiciones celulares a partir de mRNA no empalmado/empalmado |
| **Arboreto** | Inferencia de redes regulatorias génicas (GRN) con GRNBoost2 y GENIE3 optimizado para single-cell |
| **BioPython** | Biblioteca completa: secuencias (Seq, SeqRecord), parsers (FASTA, FASTQ, GenBank, PDB, SAM/BAM, VCF), acceso NCBI Entrez, BLAST, alineamientos, filogenia |
| **BioServices** | Acceso unificado a 40+ servicios biológicos web (KEGG, UniProt, ChEBI, ChEMBL, Reactome, IntAct, etc.) |
| **pysam** | Lectura/escritura de archivos genómicos: SAM/BAM/CRAM, VCF/BCF, FASTA/FASTQ, análisis de pileup |
| **PyDESeq2** | Análisis de expresión diferencial (DESeq2) para bulk RNA-seq con GLM binomial negativo |
| **Cellxgene Census** | Acceso a 50M+ células single-cell del CZ CELLxGENE Discover con filtrado por metadatos |
| **gget** | Consultas rápidas a bases genómicas (Ensembl, UniProt, NCBI, PDB, COSMIC) con interfaz unificada |
| **geniml** | ML para intervalos genómicos: Region2Vec, BEDspace, scEmbed para scATAC-seq |
| **gtars** | Análisis de intervalos genómicos en Rust: tokenización, detección de solapamientos, tokenizers para ML |
| **scikit-bio** | Análisis de secuencias biológicas: alineamientos, filogenia, diversidad, métricas de comunidad |
| **deepTools** | Visualización NGS (ChIP-seq, RNA-seq, ATAC-seq): fingerprint, coverage, heatmaps, PCA |
| **FlowIO** | Lectura y manipulación de archivos FCS (flow cytometry) |
| **Polars-Bio** | Operaciones genómicas de alto rendimiento en Polars: overlap, nearest, coverage, merge |
| **TileDB-VCF** | Almacenamiento eficiente de datos de variantes genómicas (VCF/BCF) con consultas a escala poblacional |
| **Zarr** | Arrays N-dimensionales chunked/comprimidos para datos científicos grandes (genómica, imaging) |
| **ETE Toolkit** | Manipulación y visualización de árboles filogenéticos (Newick, Nexus, PhyloXML) |
| **Phylogenetics** | Construcción de árboles filogenéticos con MAFFT, IQ-TREE 2, FastTree |

### 🧪 Quimioinformática y Descubrimiento de Fármacos (10+ skills)
| Skill | Descripción |
|-------|-------------|
| **RDKit** | Quimioinformática: descriptores moleculares, fingerprints (Morgan, MACCS), SMARTS, alineamiento 3D, visualización |
| **Datamol** | Manipulación molecular mejorada sobre RDKit: estandarización, transformaciones, featurización, procesamiento paralelo |
| **Molfeat** | 100+ featurizadores moleculares: fingerprints, descriptores, embeddings pre-entrenados (MolBERT, ChemBERTa) |
| **DeepChem** | Deep learning para descubrimiento de fármacos: GNNs (GCN, GAT, MPNN), MoleculeNet (50+ datasets) |
| **DiffDock** | Docking molecular basado en difusión: predicción de poses de unión proteína-ligando |
| **MedChem** | Análisis de quimiofarmacia: reglas de Lipinski, ADMET, drug-likeness, accesibilidad sintética |
| **Rowan** | Plataforma cloud de química cuántica: pKa, docking, cofolding, DFT, GFN-xTB, AIMNet2 |
| **TorchDrug** | ML para descubrimiento de fármacos: 40+ datasets, 20+ GNNs, generación molecular |
| **PyTDC** | Benchmarks de Therapeutics Data Commons: ADMET, interacciones fármaco-diana, generación molecular |
| **OpenMM + MDAnalysis** | Dinámica molecular: setup de sistemas, force fields, minimización, producción MD, análisis de trayectorias |

### 🔬 Proteómica y Espectrometría de Masas (2 skills)
| Skill | Descripción |
|-------|-------------|
| **matchms** | Procesamiento y matching espectral: 40+ filtros, matching de bibliotecas (Cosine, Modified Cosine), fingerprints |
| **pyOpenMS** | Análisis completo de datos de espectrometría de masas: LC-MS/MS, identificación de péptidos, detección de features |

### 🏥 Investigación Clínica y Medicina de Precisión (8+ skills)
| Skill | Descripción |
|-------|-------------|
| **DepMap** | Cancer Dependency Map: scores de dependencia génica (CRISPR Chronos), sensibilidad a fármacos en líneas celulares |
| **Imaging Data Commons** | Datos de imagen de cáncer del NCI (radiología y patología) vía idc-index |
| **PyHealth** | AI para datos clínicos: EHR, señales fisiológicas, imágenes médicas (33+ modelos, 10+ datasets) |
| **NeuroKit2** | Procesamiento de biosignales: ECG, EEG, EDA, RSP, PPG, EMG, EOG, HRV, complejidad |
| **Clinical Decision Support** | Generación de documentos de soporte a decisiones clínicas con GRADE, análisis de cohortes |
| **Clinical Reports** | Reportes clínicos completos (CARE, ICH-E3, SOAP, H&P) con compliance HIPAA/FDA |
| **Treatment Plans** | Planes de tratamiento individualizados en LaTeX/PDF con objetivos SMART |
| **Database Lookup** | Acceso unificado a 78+ bases de datos científicas (PubChem, ChEMBL, UniProt, ClinVar, COSMIC, ClinicalTrials.gov, FDA, etc.) |

### 🖼️ Imagen Médica y Patología Digital (3 skills)
| Skill | Descripción |
|-------|-------------|
| **pydicom** | Lectura/escritura/manipulación de archivos DICOM: metadatos, pixel data, anonimización, reconstrucción 3D |
| **histolab** | Análisis de imágenes de patología (WSI): detección de tejido, extracción de tiles, scoring de celularidad |
| **PathML** | Toolkit completo para análisis computacional de patología digital |

### 🧠 Neurociencia y Electrofisiología (1 skill)
| Skill | Descripción |
|-------|-------------|
| **Neuropixels-Analysis** | Análisis completo de grabaciones Neuropixels: preprocessing, spike sorting (Kilosort4, SpykingCircus2), curación automática con IA |

### 🤖 Machine Learning e IA (16+ skills)
| Skill | Descripción |
|-------|-------------|
| **PyTorch Lightning** | Deep learning con PyTorch sin boilerplate: Trainer, LightningModule, multi-GPU/TPU, callbacks |
| **scikit-learn** | ML clásico: clasificación, regresión, clustering, reducción dimensional, pipelines, 30+ métricas |
| **Transformers** | 1M+ modelos pre-entrenados (Hugging Face): NLP, CV, audio, multimodal, pipelines automáticas |
| **Stable Baselines3** | RL: PPO, SAC, DQN, TD3, DDPG, A2C, HER con Gymnasium |
| **PufferLib** | RL de alto rendimiento: 1M-4M steps/seg, multi-agente nativo, PPO optimizado |
| **PyMC** | Modelado bayesiano: MCMC (NUTS), inferencia variacional, GP, modelos jerárquicos |
| **PyMOO** | Optimización multi-objetivo: NSGA-II, NSGA-III, MOEA/D, SPEA2, Pareto |
| **Torch Geometric** | Graph Neural Networks para datos moleculares y geométricos |
| **UMAP-learn** | Reducción dimensional no lineal (UMAP) para visualización y feature extraction |
| **statsmodels** | Modelado estadístico y econometría: OLS, GLM, ARIMA, series temporales |
| **SHAP** | Interpretabilidad de modelos con valores de Shapley: TreeExplainer, DeepExplainer, KernelExplainer |
| **scikit-survival** | Análisis de supervivencia: Cox PH, Random Survival Forests, SVM de supervivencia |
| **aeon** | ML para series temporales: clasificación, regresión, clustering, forecasting, anomalías (40+ métricas, 20+ DL) |
| **TimesFM** | Forecasting zero-shot con el modelo foundation de Google para series temporales univariantes |
| **Cirq** | Framework cuántico de Google: circuitos, simulación, hardware Quantum AI |
| **PennyLane** | Quantum ML y química cuántica: VQE, QAOA, circuits con autodiff, integración PyTorch/JAX |
| **Qiskit** | Framework cuántico IBM: 13M+ downloads, transpilación, error mitigation, QAOA, VQE, Nature |
| **QuTiP** | Simulación de sistemas cuánticos: evolución temporal, ecuación de Lindblad, óptica cuántica |

### 🔮 Ciencia de Materiales, Química y Física (7 skills)
| Skill | Descripción |
|-------|-------------|
| **Pymatgen** | Ciencia de materiales: estructuras cristalinas, diagramas de fase, análisis electrónico, integración Materials Project |
| **COBRApy** | Modelado metabólico basado en restricciones (FBA, FVA, knockouts) |
| **Astropy** | Astronomía y astrofísica: coordenadas, cosmología, FITS, unidades, tiempos |

### ⚙️ Ingeniería y Simulación (4 skills)
| Skill | Descripción |
|-------|-------------|
| **MATLAB/Octave** | Cálculo numérico: matrices, EDOs, FFT, visualización, procesamiento de señales |
| **FluidSim** | Dinámica de fluidos computacional (CFD) pseudospectral: Navier-Stokes, ecuaciones de shallow water |
| **SimPy** | Simulación de eventos discretos: procesos, colas, recursos, logística |
| **SymPy** | Matemáticas simbólicas: álgebra, cálculo, EDOs, matrices, física, generación de código |

### 📊 Análisis de Datos y Visualización (16+ skills)
| Skill | Descripción |
|-------|-------------|
| **Matplotlib** | Visualización científica de alta calidad: estática, animada, interactiva, LaTeX, multi-panel |
| **Seaborn** | Visualización estadística: intervalos de confianza, paletas colorblind-safe, matrices de correlación |
| **Plotly** | Visualización interactiva: 40+ tipos de gráficos, hover, zoom, animaciones, Dash |
| **GeoPandas** | Datos geoespaciales vectoriales: shapefiles, GeoJSON, operaciones espaciales, CRS, mapas coropléticos |
| **GeoMaster** | Ciencia geoespacial completa: teledetección, GIS, ML espacial, 500+ ejemplos, 8 lenguajes |
| **Dask** | Computación paralela para datasets grandes: DataFrames, Arrays, Bags distribuidos |
| **Polars** | DataFrame de alto rendimiento en Rust: evaluación lazy, paralelo, 5-30x más rápido que pandas |
| **Vaex** | DataFrames out-of-core: billones de filas con memory-mapped files, ML integrado |
| **NetworkX** | Análisis de grafos: 100+ algoritmos (shortest paths, centrality, community detection), 50+ generadores |
| **Document Skills** | Procesamiento de documentos: PDF, DOCX, PPTX, XLSX, OCR, extracción de tablas |
| **Infographics** | Creación de infografías profesionales con IA (10 tipos, 8 estilos, paletas colorblind-safe) |
| **Markdown & Mermaid Writing** | Diagramas textuales como estándar de documentación (24 tipos de diagramas) |
| **Exploratory Data Analysis** | EDA automatizado: estadísticas, visualizaciones e insights para datasets tabulares |
| **Scientific Visualization** | Prácticas y templates para figuras científicas de publicación (matplotlib/seaborn) |
| **Statistical Analysis** | Pruebas estadísticas, análisis de potencia y diseño experimental |

### 🌍 Automatización de Laboratorio (4 skills)
| Skill | Descripción |
|-------|-------------|
| **PyLabRobot** | SDK hardware-agnostic para laboratorios automatizados: robots de líquidos, lectores de placas, incubadoras |
| **Ginkgo Cloud Lab** | Ejecución de protocolos en la nube (Ginkgo Bioworks): expresión proteica, optimización DoE |
| **Protocols.io Integration** | Gestión de protocolos científicos: búsqueda, creación, publicación con DOI, tracking de experimentos |
| **Benchling Integration** | Plataforma R&D: secuencias, inventario, notebooks electrónicos, workflows |

### 🔬 Multi-ómica y Biología de Sistemas (4+ skills)
| Skill | Descripción |
|-------|-------------|
| **HypoGeniC** | Generación automática de hipótesis con LLMs: data-driven, literature-driven, union methods |
| **PrimeKG** | Knowledge graph de medicina de precisión: genes, fármacos, enfermedades, fenotipos |
| **LaminDB** | Framework de datos biológicos: lakehouse, lineage tracking, ontologías, FAIR data |
| **Database Lookup** | 78+ bases de datos unificadas: química, genómica, clínica, patentes, economía |

### 🧬 Ingeniería y Diseño de Proteínas (3 skills)
| Skill | Descripción |
|-------|-------------|
| **ESM (Evolutionary Scale Modeling)** | Modelos de lenguaje de proteínas: ESM3 (generativo multimodal), ESM C (embeddings eficientes) |
| **Glycoengineering** | Análisis de glicosilación de proteínas: N/O-glicosilación, optimización de anticuerpos terapéuticos |
| **Adaptyv** | Plataforma cloud para validación experimental de proteínas: binding, expresión, estabilidad, actividad enzimática |

### 📚 Comunicación Científica (20+ skills)
| Skill | Descripción |
|-------|-------------|
| **Paper Lookup** | Búsqueda en 10 bases académicas: PubMed, PMC, bioRxiv, arXiv, OpenAlex, Semantic Scholar, CORE, Unpaywall |
| **BGPT Paper Search** | Búsqueda de papers con 25+ campos estructurados extraídos del texto completo |
| **Literature Review** | Revisión sistemática: búsqueda, gestión de citas (APA, AMA, Vancouver, Chicago, IEEE, Nature), PRISMA |
| **Peer Review** | Evaluación estructurada de papers: metodología, estadística, reproducibilidad, ética |
| **Scientific Writing** | Redacción científica IMRAD: formatos, reporting guidelines (CONSORT, STROBE, PRISMA) |
| **Scientific Slides** | Presentaciones de investigación con PowerPoint y LaTeX Beamer |
| **LaTeX Posters** | Pósters de investigación en LaTeX (beamerposter, tikzposter, baposter) |
| **PPTX Posters** | Pósters profesionales en PowerPoint para quienes prefieren WYSIWYG |
| **Venue Templates** | Templates LaTeX y guías de formato para Nature, Science, IEEE, NeurIPS, ICML, etc. |
| **Citation Management** | Gestión de citas: BibTeX, CrossRef, PubMed, Google Scholar, deduplicación |
| **pyzotero** | Cliente Zotero API: gestión programática de bibliotecas, export BibTeX/CSL |
| **Generate Image** | Generación de imágenes científicas con FLUX.2 Pro y Gemini 3 Pro (Nano Banana Pro) |
| **Scientific Schematics** | Diagramas científicos de publicación con IA (arquitecturas, pathways, flowcharts) |
| **Paper-2-Web** | Pipeline autónomo para convertir papers en web, video y póster |
| **Open Notebook** | Alternativa open-source a NotebookLM: PDFs, videos, audio, podcasts multi-hablante |
| **Market Research Reports** | Reportes de mercado estilo McKinsey/BCG con análisis estratégico (Porter, PESTLE, SWOT) |
| **Parallel Web** | Búsqueda web con resúmenes sintetizados y citas (Parallel Chat API) |
| **Exa Search** | Búsqueda web científica de alta calidad con filtrado académico |
| **DOCX** | Creación y manipulación de documentos Word con formato profesional |
| **MarkItDown** | Conversión de 20+ formatos a Markdown para LLMs (PDF, DOCX, PPTX, XLSX, imágenes, audio) |
| **PDF** | Manipulación de PDFs: lectura, creación, OCR, extracción de tablas |
| **PPTX** | Creación y edición de presentaciones PowerPoint |
| **XLSX** | Análisis y creación de hojas de cálculo con fórmulas y visualización |

### 🔧 Infraestructura y Plataformas (7+ skills)
| Skill | Descripción |
|-------|-------------|
| **Modal** | Cloud serverless para Python/AI: GPUs (T4-H200), autoscaling, Volumes, scheduled jobs |
| **Optimize for GPU** | Aceleración GPU con RAPIDS: CuPy, cuDF, cuML, cuGraph, cuCIM, cuVS, cuSpatial, Warp |
| **DNAnexus Integration** | Plataforma cloud genómica: apps/applets, datos, pipelines bioinformáticos |
| **LatchBio Integration** | Pipelines bioinformáticas serverless: RNA-seq, AlphaFold, DESeq2, single-cell |
| **OMERO Integration** | Gestión de datos de microscopía: datasets, screening, ROIs, batch processing |
| **LabArchives Integration** | Electronic Lab Notebook API: notebooks, entries, authentication, analytics |
| **Get Available Resources** | Detección de recursos computacionales (CPU, GPU, RAM, disco) con recomendaciones |

### 🎓 Metodología de Investigación (12+ skills)
| Skill | Descripción |
|-------|-------------|
| **Hypothesis Generation** | Frameworks estructurados para generar y evaluar hipótesis científicas |
| **Scientific Brainstorming** | Partner conversacional para generar ideas de investigación y explorar conexiones |
| **Scientific Critical Thinking** | Herramientas para razonamiento científico riguroso y evaluación |
| **Scholar Evaluation** | Evaluación sistemática de trabajo académico con criterios peer-reviewed |
| **Research Grants** | Propuestas competitivas para NSF, NIH, DOE, DARPA con formatting específico |
| **Research Lookup** | Búsqueda de investigación actual con Perplexity Sonar Pro (OpenRouter) |
| **Consciousness Council** | Deliberación multi-perspectiva con viewpoints diversos y devil's advocate |
| **DHDNA Profiler** | Extracción de patrones cognitivos y fingerprints de pensamiento de cualquier texto |
| **What-If Oracle** | Análisis de escenarios multi-rama: planificación, riesgo, opciones estratégicas |
| **Paperzilla** | Chat sobre proyectos Paperzilla: recomendaciones, papers canónicos, resúmenes |
| **Denario** | Sistema multi-agente AG2/LangGraph para automatización completa de investigación |
| **Parallel Web** | Búsqueda web y deep research con resúmenes sintetizados |

### ⚖️ Regulación y Estándares (1 skill)
| Skill | Descripción |
|-------|-------------|
| **ISO 13485 Certification** | Documentación para certificación ISO 13485:2016 de dispositivos médicos (31 procedimientos) |

## Patrones de Uso

### Combinación de Skills para Workflows Complejos

Los workflows más potentes combinan múltiples skills en secuencias coordinadas:

1. **Pipeline de Descubrimiento de Fármacos**:
   ```
   Database Lookup → RDKit → DiffDock → DeepChem → PubChem → USPTO → MedChem
   ```
   Buscar compuestos → filtrar propiedades → dockear → predecir actividad → verificar proveedores → buscar patentes → optimizar leads

2. **Análisis scRNA-seq**:
   ```
   Scanpy → AnnData → scVelo → Arboreto → PyDESeq2 → Database Lookup (KEGG/Reactome)
   ```
   Cargar datos → QC → velocity → redes regulatorias → expresión diferencial → enrichment

3. **Interpretación de Variantes Clínicas**:
   ```
   pysam → Database Lookup (ClinVar/COSMIC/NCBI Gene) → UniProt → PubMed → Clinical Reports
   ```
   Parsear VCF → anotar variantes → verificar patogenicidad → impacto proteico → generar reporte clínico

4. **Análisis Multi-ómica**:
   ```
   PyDESeq2 → pyOpenMS → Database Lookup (HMDB/KEGG/STRING) → scikit-learn → ClinicalTrials.gov
   ```
   RNA-seq → proteómica → metabolómica → integrar vías → correlacionar → modelo predictivo

5. **Revisión Sistemática de Literatura**:
   ```
   Paper Lookup → BGPT Paper Search → Literature Review → Scientific Writing → Citation Management
   ```
   Buscar papers → extraer datos estructurados → revisar sistemáticamente → escribir → gestionar citas

6. **Análisis de Redes Biológicas**:
   ```
   Database Lookup (STRING/KEGG/Reactome) → NetworkX → Torch Geometric → PyMC
   ```
   Obtener interacciones → analizar topología → GNN → modelado bayesiano

## Snippets Útiles

### Instalación de Skills

```bash
# Opción 1: npx (estándar Agent Skills, todas las plataformas)
npx skills add K-Dense-AI/scientific-agent-skills

# Opción 2: GitHub CLI (v2.90.0+)
gh skill install K-Dense-AI/scientific-agent-skills
gh skill install K-Dense-AI/scientific-agent-skills scanpy    # skill específica

# Version pinning
gh skill install K-Dense-AI/scientific-agent-skills --pin v1.0.0
gh skill install K-Dense-AI/scientific-agent-skills --pin abc123def

# Actualizar skills
gh skill update
gh skill update --all
```

### Ejemplos de Prompts para Workflows

```
# Descubrimiento de EGFR inhibitors
"Query ChEMBL for EGFR inhibitors (IC50 < 50nM), analyze SAR with RDKit,
generate analogs with datamol, virtual screen with DiffDock against
AlphaFold EGFR, search PubMed for resistance mechanisms, check COSMIC
for mutations, create visualizations and a comprehensive report."

# Análisis scRNA-seq con integración pública
"Load 10X dataset with Scanpy, perform QC and doublet removal, integrate
with Cellxgene Census, identify cell types using NCBI Gene markers, run
differential expression with PyDESeq2, infer GRNs with Arboreto, enrich
pathways via Reactome/KEGG, identify targets with Open Targets."

# Interpretación clínica de variantes
"Parse VCF with pysam, annotate with Ensembl VEP, query ClinVar for
pathogenicity, check COSMIC for cancer mutations, retrieve gene info from
NCBI Gene, analyze protein impact with UniProt, search PubMed for case
reports, check ClinPGx for pharmacogenomics, generate clinical report,
find matching trials on ClinicalTrials.gov."

# Virtual screening de moduladores alostéricos
"Retrieve AlphaFold structures, identify interface with BioPython, search
ZINC for candidates (MW 300-500, logP 2-4), filter with RDKit, dock with
DiffDock, rank with DeepChem, check PubChem suppliers, search USPTO
patents, optimize leads with MedChem/molfeat."
```

### Uso del Database Lookup

```python
# El Database Lookup unifica acceso a 78+ bases de datos:
# Química/Drogas: PubChem, ChEMBL, DrugBank, FDA, KEGG, DailyMed, ZINC, BindingDB
# Biología/Genómica: UniProt, STRING, Ensembl, NCBI Gene, GEO, GTEx, PDB, AlphaFold
# Clínica: ClinVar, COSMIC, ClinPGx, ClinicalTrials.gov, OMIM, cBioPortal, GWAS Catalog
# Economía: FRED, BEA, BLS, Federal Reserve, World Bank, US Treasury, Alpha Vantage
# Astronomía: NASA, NIST, SDSS, SIMBAD, Exoplanet Archive
# Tierra/Ambiente: USGS, NOAA, EPA, OpenWeatherMap
```

### Instalación de Dependencias

```bash
# Las skills usan uv como package manager
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar dependencias de una skill específica
uv pip install rdkit scanpy pydeseq2 diffdock
```

## Cómo Integrarlo en Proyectos

### Paso 1: Instalar las Skills

```bash
# Instalar todas las skills
npx skills add K-Dense-AI/scientific-agent-skills

# O con gh skill
gh skill install K-Dense-AI/scientific-agent-skills
```

### Paso 2: Instalar Dependencias Python

```bash
# Instalar uv si no lo tienes
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar paquetes necesarios según tu workflow
uv pip install rdkit scanpy pydeseq2 deepchem diffdock
uv pip install biopython pysam networkx matplotlib seaborn
uv pip install torch pytorch-lightning scikit-learn transformers
```

### Paso 3: Configurar el Agente

- **Cursor**: Las skills se descubren automáticamente. Verifica en Settings → Rules.
- **Claude Code**: Las skills se cargan automáticamente al detectar archivos `SKILL.md`.
- **Codex**: Compatible con el estándar Agent Skills.
- **Gemini CLI**: Compatible con el estándar Agent Skills.

### Paso 4: Invocar Skills en Prompts

```
"Use available skills you have access to whenever possible. [tu instrucción científica]"
```

El agente detectará automáticamente qué skills son relevantes y las invocará.

### Paso 5: Escalar con Cloud (Opcional)

Para workflows que requieren GPU o mucho cómputo:
- **Modal**: Serverless cloud con GPUs (T4 a H200)
- **K-Dense Web**: Plataforma completa con 200+ skills, GPUs cloud, outputs listos para publicación

## Seguridad

- ⚠️ Las skills pueden ejecutar código y modificar archivos. Revisa cada `SKILL.md` antes de instalar.
- 🔒 Se ejecutan escaneos de seguridad con [Cisco AI Defense Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner).
- 📋 Cada skill tiene su propia licencia (puede diferir del MIT del repositorio). Revisa el campo `license` en cada `SKILL.md`.
- 🔍 Skills de K-Dense-AI han pasado revisión interna; las contribuciones comunitarias tienen revisión limitada.

## Citación

```bibtex
@software{scientific_agent_skills_2026,
  author = {{K-Dense Inc.}},
  title = {Scientific Agent Skills: A Comprehensive Collection of Scientific Tools for AI Agents},
  year = {2026},
  url = {https://github.com/K-Dense-AI/scientific-agent-skills},
  note = {138 skills covering databases, packages, integrations, and analysis tools}
}
```

## Licencia

**MIT License** © 2026 K-Dense Inc. (k-dense.ai)
- ✅ Libre para uso comercial y no comercial
- ✅ Open source: modificar, distribuir, usar libremente
- ⚠️ Sin garantía - proporcionado "tal cual"
- ⚠️ Cada skill puede tener su propia licencia (revisar `SKILL.md` individual)

## Fecha de aprendizaje: 2026-05-27
