# Microsoft MarkItDown

- **URL:** https://github.com/microsoft/markitdown
- **Categoría:** Herramientas / Documentación / LLM
- **¿Qué hace?:** MarkItDown es una utilidad Python ligera de Microsoft para convertir diversos formatos de archivo a Markdown. Está diseñado específicamente para preparar documentos para LLMs y pipelines de análisis de texto. Convierte PDF, PowerPoint, Word, Excel, imágenes (EXIF + OCR), audio (EXIF + transcripción), HTML, CSV, JSON, XML, ZIP, YouTube URLs, EPUBs y más a Markdown preservando la estructura (headings, listas, tablas, links).
- **Casos de uso:**
  - Pipeline RAG: convertir documentos locales a Markdown antes de embedding
  - Procesamiento de documentos empresariales (PDFs, DOCX, XLSX) para análisis con LLM
  - Extracción de texto de imágenes y documentos escaneados
  - Conversión de presentaciones y hojas de cálculo a texto estructurado
  - Pre-procesamiento de archivos ZIP (itera sobre contenidos internos)
  - Transcripción automática de archivos de audio
  - Extracción de transcripciones de YouTube
- **Snippets útiles:**

```python
# Instalación
pip install 'markitdown[all]'

# Uso básico - convertir un archivo
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("document.pdf")
print(result.text_content)  # Markdown como string
result.metadata  # Metadatos del documento

# Convertir desde stream
with open("report.docx", "rb") as f:
    result = md.convert_stream(f, file_name="report.docx")

# Convertir desde URL
result = md.convert("https://example.com/page.html")

# Convertir desde bytes
with open("image.png", "rb") as f:
    data = f.read()
result = md.convert_bytes(data, file_name="image.png")

# Usar converters específicos (más seguro y eficiente)
from markitdown import MarkItDown
md = MarkItDown()

# Solo PDF
result = md.convert_local("report.pdf")

# Solo DOCX
result = md.convert_local("document.docx")

# Piping en CLI
# markitdown path-to-file.pdf > document.md
# markitdown path-to-file.pdf -o document.md
# cat path-to-file.pdf | markitdown
```

```python
# Conversión con plugins
md = MarkItDown(enable_plugins=True)
# Listar plugins: markitdown --list-plugins
# Usar plugins: markitdown --use-plugins file.pdf

# Instalación de plugin OCR
pip install markitdown-ocr
```

```python
# Conversión de múltiples archivos
import glob
from markitdown import MarkItDown

md = MarkItDown()
for filepath in glob.glob("documents/*"):
    result = md.convert(filepath)
    output_name = filepath.rsplit(".", 1)[0] + ".md"
    with open(output_name, "w") as f:
        f.write(result.text_content)
    print(f"Converted: {filepath} -> {output_name}")
```

```python
# Integración con LangChain / LLM
from markitdown import MarkItDown
from langchain.text_splitter import RecursiveCharacterTextSplitter

md = MarkItDown()
result = md.convert("presentation.pptx")

# Split para embedding
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_text(result.text_content)

# Cada chunk listo para embedding
for i, chunk in enumerate(chunks):
    print(f"Chunk {i}: {chunk[:200]}...")
```

- **Cómo integrarlo en proyectos:**
  1. Instalar con `pip install 'markitdown[all]'`
  2. Crear instancia `MarkItDown()` con o sin plugins
  3. Usar `convert_local()`, `convert_stream()`, `convert_bytes()`, o `convert()` según el input
  4. Acceder a `result.text_content` para el markdown y `result.metadata` para metadatos
  5. Para entornos no confiables, usar la función más específica posible (`convert_stream`, `convert_local`)
  6. Instalar solo los extras necesarios: `pip install 'markitdown[pdf, docx]'`
- **Fecha de aprendizaje:** 2026-05-26
- **Autores:** Adam Fourney (Microsoft AutoGen Team)
- **Stars:** 125,190
- **Licencia:** MIT
