# Microsoft Markitdown

- **URL**: https://github.com/microsoft/markitdown
- **Categoría**: Herramientas Dev
- **¿Qué hace?**: MarkItDown es una herramienta Python ligera desarrollada por Microsoft (equipo AutoGen) para convertir diversos formatos de archivos a Markdown. Está diseñada específicamente para pipelines de análisis de texto con LLMs, preservando la estructura del documento (títulos, listas, tablas, enlaces) mientras produce texto Markdown token-efficient. A diferencia de herramientas como textract, su foco es la calidad del Markdown para consumo por LLMs, no la fidelidad visual para humanos.

- **Casos de uso**:
  - Convertir documentos (PDF, Word, PowerPoint, Excel) a Markdown para RAG pipelines
  - Extraer texto de imágenes con OCR via LLM Vision (plugin markitdown-ocr)
  - Transcribir audio y extraer metadata EXIF
  - Convertir páginas web, RSS feeds, Wikipedia y YouTube a Markdown
  - Procesar archivos ZIP (itera sobre contenidos internos)
  - Integrar como servidor MCP para herramientas de IA (markitdown-mcp)
  - Usar Azure Document Intelligence o Azure Content Understanding para conversión cloud de alta calidad
  - Crear plugins personalizados para formatos de archivo soportados
  - Procesar archivos desde stdin, archivos locales, URLs, o streams binarios

- **Snippets útiles**:

  **Instalación**:
  ```bash
  pip install 'markitdown[all]'
  # O instalar solo dependencias necesarias:
  pip install 'markitdown[pdf, docx, pptx]'
  ```

  **Uso básico en Python**:
  ```python
  from markitdown import MarkItDown

  md = MarkItDown()
  result = md.convert("document.pdf")
  print(result.text_content)  # o result.markdown
  ```

  **Convertir desde URL**:
  ```python
  result = md.convert("https://example.com/article.html")
  print(result.text_content)
  ```

  **Convertir desde stream binario**:
  ```python
  import requests
  response = requests.get("https://example.com/file.pdf")
  result = md.convert(response)
  ```

  **Con LLM para descripciones de imágenes**:
  ```python
  from markitdown import MarkItDown
  from openai import OpenAI

  client = OpenAI()
  md = MarkItDown(
      llm_client=client,
      llm_model="gpt-4o",
      llm_prompt="Describe this image in detail"
  )
  result = md.convert("slide_with_images.pptx")
  print(result.text_content)
  ```

  **Con Azure Document Intelligence**:
  ```python
  md = MarkItDown(docintel_endpoint="https://<resource>.cognitiveservices.azure.com/")
  result = md.convert("scanned.pdf")
  ```

  **Con Azure Content Understanding**:
  ```python
  md = MarkItDown(
      cu_endpoint="https://<resource>.cognitiveservices.azure.com/",
      cu_analyzer_id="my-invoice-analyzer"
  )
  result = md.convert("invoice.pdf")
  # Output incluye YAML front matter con campos extraídos
  ```

  **CLI - Archivo local**:
  ```bash
  markitdown path-to-file.pdf > output.md
  markitdown path-to-file.pdf -o output.md
  ```

  **CLI - Desde stdin**:
  ```bash
  cat file.pdf | markitdown
  markitdown -x pdf < file.pdf
  ```

  **CLI - Con Document Intelligence**:
  ```bash
  markitdown file.pdf -d -e "https://<resource>.cognitiveservices.azure.com/"
  ```

  **Docker**:
  ```bash
  docker build -t markitdown:latest .
  docker run --rm -i markitdown:latest < ~/file.pdf > output.md
  ```

  **Crear plugin personalizado**:
  ```python
  # markitdown_sample_plugin/__init__.py
  from markitdown import MarkItDown, DocumentConverter, DocumentConverterResult, StreamInfo
  from typing import BinaryIO, Any

  __plugin_interface_version__ = 1

  class RtfConverter(DocumentConverter):
      def accepts(self, file_stream: BinaryIO, stream_info: StreamInfo, **kwargs: Any) -> bool:
          # Check if this is an RTF file
          return stream_info.extension == ".rtf"

      def convert(self, file_stream: BinaryIO, stream_info: StreamInfo, **kwargs: Any) -> DocumentConverterResult:
          # Convert RTF to Markdown
          # ...
          return DocumentConverterResult(markdown="# Converted content")

  def register_converters(markitdown: MarkItDown, **kwargs):
      markitdown.register_converter(RtfConverter())
  ```

  **pyproject.toml para plugin**:
  ```toml
  [project.entry-points."markitdown.plugin"]
  rtf_plugin = "markitdown_sample_plugin"
  ```

  **Usar plugin**:
  ```python
  md = MarkItDown(enable_plugins=True)
  result = md.convert("document.rtf")
  ```

- **Cómo integrarlo en proyectos**:

  **1. Instalación en proyecto Python**:
  ```bash
  pip install 'markitdown[all]'
  ```
  O con dependencias mínimas:
  ```bash
  pip install 'markitdown[pdf,docx,xlsx]'
  ```

  **2. Patrón de integración con RAG**:
  ```python
  from markitdown import MarkItDown

  def file_to_markdown(file_path: str) -> str:
      md = MarkItDown()
      result = md.convert(file_path)
      return result.text_content

  # Uso en pipeline RAG
  markdown_text = file_to_markdown("report.pdf")
  # Enviar a vector DB, chunkear, etc.
  ```

  **3. Conversión segura (input no confiable)**:
  ```python
  # Usar convert_local() en lugar de convert() para solo archivos locales
  md = MarkItDown()
  result = md.convert_local("/safe/path/document.pdf")
  ```

  **4. Integración con LangChain**:
  ```python
  from langchain.document_loaders import BaseLoader
  from markitdown import MarkItDown

  class MarkItDownLoader(BaseLoader):
      def __init__(self, file_path: str):
          self.file_path = file_path

      def load(self):
          md = MarkItDown()
          result = md.convert(self.file_path)
          from langchain.docstore.document import Document
          return [Document(page_content=result.text_content)]
  ```

  **5. Integración con MCP (Model Context Protocol)**:
  ```bash
  pip install markitdown-mcp
  markitdown-mcp  # Inicia servidor STDIO
  # O con HTTP:
  markitdown-mcp --http --host 127.0.0.1 --port 3001
  ```

  **6. Plugin OCR con LLM**:
  ```bash
  pip install markitdown-ocr openai
  ```
  ```python
  from markitdown import MarkItDown
  from openai import OpenAI

  md = MarkItDown(
      enable_plugins=True,
      llm_client=OpenAI(),
      llm_model="gpt-4o"
  )
  result = md.convert("scanned_document.pdf")
  ```

  **7. Estructura de convertidores**:
  - Cada converter implementa `accepts()` y `convert()` de `DocumentConverter`
  - Se registran con `md.register_converter(converter, priority=0.0)`
  - Prioridades: `PRIORITY_SPECIFIC_FILE_FORMAT=0.0` (específicos), `PRIORITY_GENERIC_FILE_FORMAT=10.0` (genéricos)
  - Menor prioridad = se prueba primero

  **8. Archivos soportados (built-in)**:
  - PDF, DOCX, XLSX, XLS, PPTX
  - Imágenes (EXIF + OCR con plugin)
  - Audio (transcripción con SpeechRecognition)
  - HTML, RSS, Wikipedia, YouTube, Bing SERP
  - CSV, JSON, XML (text-based)
  - ZIP (itera contenidos)
  - EPUB
  - Outlook MSG
  - Jupyter Notebooks (.ipynb)

  **9. Arquitectura clave**:
  - `MarkItDown` clase principal con métodos: `convert()`, `convert_local()`, `convert_stream()`, `convert_uri()`, `convert_response()`
  - `StreamInfo` dataclass con: mimetype, extension, charset, filename, local_path, url
  - `DocumentConverterResult` con: markdown (str), title (str)
  - Conversión usa `magika` para detección automática de MIME type desde el contenido del stream
  - Los plugins se cargan vía entry points de Python (`markitdown.plugin`)

  **10. Consideraciones de seguridad**:
  - MarkItDown realiza I/O con los privilegios del proceso actual
  - Sanitizar inputs en entornos no confiables
  - Usar `convert_local()` para solo archivos locales
  - Usar `convert_stream()` con streams controlados para máximo control
  - El servidor MCP se enlaza a localhost por defecto

- **Fecha de aprendizaje**: 2026-05-27
