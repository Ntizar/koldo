---
name: markitdown
description: Convert various file formats to Markdown for LLM consumption. Supports PDF, DOCX, PPTX, XLSX, images, audio, HTML, CSV, JSON, XML, ZIP, EPUB, YouTube URLs, and more via a plugin-based converter architecture.
version: 0.1.0
author: Adam Fourney (Microsoft)
homepage: https://github.com/microsoft/markitdown
---

# markitdown

Convert almost any file to Markdown for use with LLMs and text-analysis pipelines. Built by Microsoft's AutoGen team.

## What It Does

MarkItDown reads common file types and converts them into clean Markdown, preserving document structure (headings, lists, tables, links). The output is optimized for LLM consumption — not human readability — making it token-efficient while retaining semantic structure.

## Installation

```bash
# Full installation (all optional dependencies)
pip install 'markitdown[all]'

# Minimal (core only: text, HTML, JSON, XML, ZIP)
pip install markitdown

# Specific format extras
pip install 'markitdown[pdf, docx, pptx, xlsx, audio-transcription, youtube-transcription]'
```

**Core dependencies:** `beautifulsoup4`, `requests`, `markdownify`, `magika` (MIME detection), `charset-normalizer`, `defusedxml`

## Basic Usage

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("document.pdf")
print(result.markdown)        # or result.text_content (deprecated alias)
print(result.title)           # optional title if detected
```

```bash
# CLI
markitdown path-to-file.pdf > output.md
cat file.pdf | markitdown
```

Supported sources: local paths, URLs, `requests.Response` objects, binary streams, data URIs, file URIs.

## When to Use

- **RAG pipelines** — convert uploaded documents (PDF, DOCX, PPTX, images) into Markdown before embedding
- **LLM context building** — prepare multi-format document collections for chat/completion APIs
- **Content extraction** — bulk convert files to a uniform text format for analysis
- **Plugin extensibility** — register custom converters via `markitdown.plugin` entry points

## Architecture Highlights

- **Plugin-based converters:** Each file type has its own `DocumentConverter` subclass with `accepts()` and `convert()` methods
- **MIME detection:** Uses `magika` (Google's ML-based file type detector) plus `mimetypes` for layered detection
- **Priority system:** Converters are sorted by priority; more specific formats win over generic ones
- **Optional cloud integrations:** Azure Document Intelligence and Azure Content Understanding for higher-quality extraction

## Security Note

MarkItDown performs I/O with the privileges of the current process. Sanitize inputs in untrusted environments and prefer the narrowest conversion API (`convert_local()`, `convert_stream()`, `convert_response()`) for your use case.
