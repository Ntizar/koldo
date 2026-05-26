# Scientific Agent Skills

- **URL:** https://github.com/K-Dense-AI/scientific-agent-skills
- **Categoría:** IA / Agent Skills
- **¿Qué hace?:** Colección de **138 skills (habilidades) listas para usar** para transformar agentes de IA en asistentes científicos. Cubre genómica, descubrimiento de fármacos, biología molecular, ciencia de materiales, análisis clínico, visualización científica, automatización de laboratorio y más. Cada skill incluye documentación, ejemplos de código, casos de uso y mejores prácticas. Sigue el estándar abierto [Agent Skills](https://agentskills.io/) y funciona con Cursor, Claude Code, Codex y más.
- **Casos de uso:**
  - **Descubrimiento de fármacos:** Screening virtual, optimización de leads, predicción ADMET, docking molecular con DiffDock
  - **Bioinformática y genómica:** Análisis scRNA-seq con Scanpy, anotación de variantes, análisis de secuencias con BioPython
  - **Investigación clínica:** Interpretación de variantes clínicas, búsqueda de ensayos clínicos, soporte de decisiones clínicas
  - **Multi-ómica:** Integración de RNA-seq, proteómica y metabolómica, análisis de vías (KEGG, Reactome)
  - **Química computacional:** Manipulación molecular con RDKit, predicción de propiedades, búsqueda de subestructuras
  - **Machine Learning científico:** PyTorch Lightning, scikit-learn, modelos de series temporales (TimesFM), grafos (Torch Geometric)
  - **Visualización científica:** Figuras para publicación (Nature, Science, Cell), paletas seguras para daltónicos
  - **Bases de datos científicas:** Acceso unificado a 78+ bases (PubChem, ChEMBL, UniProt, ClinVar, COSMIC, ClinicalTrials.gov, etc.)
  - **Automatización de laboratorio:** Protocolos de líquidos con PyLabRobot, integración con Benchling y LabArchives
  - **Comunicación científica:** Redacción, revisión por pares, pósters LaTeX, diapositivas, infografías
- **Snippets útiles:**
  - **Instalación con npx (estándar Agent Skills):**
    ```bash
    npx skills add K-Dense-AI/scientific-agent-skills
    ```
  - **Instalación con GitHub CLI (gh skill v2.90+):**
    ```bash
    gh skill install K-Dense-AI/scientific-agent-skills
    gh skill install K-Dense-AI/scientific-agent-skills scanpy
    gh skill install K-Dense-AI/scientific-agent-skills --agent cursor
    gh skill install K-Dense-AI/scientific-agent-skills --pin v2.39.0
    ```
  - **Pipeline EGFR inhibitors (prompt para agente):**
    ```
    Use available skills you have access to whenever possible. Query ChEMBL for EGFR inhibitors (IC50 < 50nM), analyze structure-activity relationships with RDKit, generate improved analogs with datamol, perform virtual screening with DiffDock against AlphaFold EGFR structure, search PubMed for resistance mechanisms, check COSMIC for mutations, and create visualizations and a comprehensive report.
    ```
  - **Análisis scRNA-seq con Scanpy:**
    ```python
    import scanpy as sc
    adata = sc.read_10x_mtx("path/to/data/")
    adata.X          # Matriz de expresión (células × genes)
    adata.obs        # Metadatos de células
    adata.var        # Metadatos de genes
    adata.obsm       # Datos multidimensionales (PCA, UMAP)
    ```
  - **Visualización para publicación:**
    ```python
    import matplotlib.pyplot as plt
    from style_presets import apply_publication_style
    apply_publication_style("default")
    fig, ax = plt.subplots(figsize=(3.5, 2.5))
    ax.plot(x, y, label="data")
    from figure_export import save_publication_figure
    save_publication_figure(fig, "figure1", formats=["pdf", "png"], dpi=300)
    ```
  - **Escaneo de seguridad:**
    ```bash
    uv pip install cisco-ai-skill-scanner
    skill-scanner scan /path/to/skill --use-behavioral
    ```
- **Cómo integrarlo en proyectos:**
  1. **Instalar:** `npx skills add K-Dense-AI/scientific-agent-skills` o `gh skill install K-Dense-AI/scientific-agent-skills`. Las skills se copian al directorio de skills del agente.
  2. **Prerequisitos:** Python 3.13+, `uv` como gestor de paquetes. Cada skill especifica dependencias en su `SKILL.md`.
  3. **Estructura:** `scientific-skills/` con 139 directorios (cada uno con `SKILL.md`), `docs/examples.md` con workflows completos, `docs/scientific-skills.md` con listado completo.
  4. **Formato SKILL.md:** Frontmatter YAML (`name`, `description`, `license`, `metadata.skill-author`) + markdown con Overview, Core Capabilities, Quick Start, ejemplos de código.
  5. **Activación:** El agente descubre skills automáticamente. Incluir "Use available skills you have access to whenever possible" en los prompts.
  6. **Seguridad:** Revisar cada `SKILL.md` antes de instalar. Usar `skill-scanner` en skills de terceros. Instalar solo las necesarias.
  7. **Compatibilidad:** Cursor, Claude Code, Codex, Gemini CLI, cualquier agente con soporte Agent Skills (agentskills.io).
  8. **Licencia:** Repo MIT, pero cada skill puede tener su propia licencia (ver campo `license` en el frontmatter).
- **Fecha de aprendizaje:** 2026-05-26

