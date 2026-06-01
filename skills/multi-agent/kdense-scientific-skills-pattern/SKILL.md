---
name: kdense-scientific-skills-pattern
description: "Patrón de skills científicos de K-Dense (142 skills, 100+ bases de datos científicas, 160k+ usuarios). Estructura SKILL.md con frontmatter, composición multi-skill, y patrón de referencia externa para mantener contextos compactos."
version: "1.0.0"
category: multi-agent
tags: [multi-agent, skills, scientific, kdense]

---

# K-Dense Scientific Skills Pattern

Patrón de creación de skills científicos adoptado por K-Dense AI (26.6k⭐). 142 skills listos para usar con 100+ bases de datos científicas, compatible con cualquier agente que soporte el Agent Skills Standard.

**Referencia:** https://github.com/K-Dense-AI/scientific-agent-skills

## Estructura de un Skill Científico

```
skills/markitdown/
├── SKILL.md              # Descripción, instalación, uso
├── references/           # Docs de referencia (formatos, APIs)
│   ├── chemistry_molecular_formats.md
│   └── bioinformatics_formats.md
└── scripts/              # Scripts de utilidad
    └── generate_schematic.py
```

## Composición de Skills Científicos

Los skills científicos se componen en cascada:

```
markitdown → liteparse → exploratory-data-analysis → scientific-writing → scientific-visualization
```

1. **markitdown:** Convierte archivos a Markdown (15+ formatos)
2. **liteparse:** Parsing espacial con bounding boxes para RAG
3. **exploratory-data-analysis:** Análisis automático de 200+ formatos científicos
4. **scientific-writing:** Escritura IMRAD con citas y reporting guidelines
5. **scientific-visualization:** Diagramas de publicación automática
6. **scientific-visualization:** Gráficos y visualizaciones

## Bases de Datos Científicas (100+)

Las skills de K-Dense integran acceso a:
- **Biología:** BioPython, Biopython, EMBL, UniProt
- **Química:** RDKit, PubChem, ChEMBL, ZINC
- **Genómica:** NCBI, Ensembl, GTEx, TCGA
- **Proteómica:** PDB, AlphaFold DB, UniProt
- **Medicina:** ClinicalTrials.gov, PubMed, MIMIC-IV
- **Astronomía:** SIMBAD, VizieR, NASA ADS
- **Materiales:** Materials Project, OQMD, AFLOW

## Patrones de Implementación

### Patrón: Tool Wrapper
```yaml
---
name: markitdown
description: Convert files and office documents to Markdown. Supports PDF, DOCX, PPTX, XLSX, images (with OCR), audio (with transcription), HTML, CSV, JSON, XML, ZIP, YouTube URLs, EPubs and more.
allowed-tools: Read Write Edit Bash
license: MIT license
---
```

### Patrón: Domain Knowledge
```yaml
---
name: hugging-science
description: Use when the user is doing AI/ML work in a scientific domain such as biology, chemistry, physics, astronomy, climate, genomics, materials, medicine, ecology, energy, engineering, math, drug discovery, protein design, weather modeling, theorem proving, single-cell, or PDE solving.
---
```

### Patrón: Workflow Protocol
```yaml
---
name: scientific-writing
description: Core skill for the deep research and writing tool. Write scientific manuscripts in full paragraphs (never bullet points). Use two-stage process with (1) section outlines with key points using research-lookup then (2) convert to flowing prose. IMRAD structure, citations (APA/AMA/Vancouver), figures/tables, reporting guidelines (CONSORT/STROBE/PRISMA).
---
```

## Lecciones Clave

1. **142 skills, 160k usuarios:** La adopción masiva demuestra que los skills bien diseñados tienen valor real
2. **Compatibilidad multi-agente:** El estándar funciona con Claude Code, Cursor, Codex, Gemini CLI, y Hermes
3. **Referencias externas:** Los archivos en `references/` mantienen el SKILL.md compacto
4. **Versionado semántico:** Version 2.43.0 con changelog y compatibilidad
5. **Seguridad integrada:** Security scan en CI/CD para validar skills
6. **Licencia MIT:** Permite uso comercial y modificaciones

## Aplicación a Hermes

Este patrón puede adaptarse para:
- Skills de análisis energético (SistemaEléctricoFuturo)
- Skills de transporte (GTFS, Bicimad)
- Skills de visión por computadora (FreeHands)
- Skills de diseño (Ntizar Aurora)