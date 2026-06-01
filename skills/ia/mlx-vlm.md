---
name: mlx-vlm-vision-local
description: "Patrón de visión por computadora local en Mac con MLX — LLaVA, Pixtral, Florence-2, Molmo. Fine-tuning, inferencia batch y extracción de estructuras (JSON, tablas) desde imágenes."
version: 2.0.0
author: Ntizar + Koldo
---

# Visión Local con MLX-VLM

Ejecuta modelos de visión-lenguaje (VLM) localmente en Mac con Apple Silicon: LLaVA, Pixtral, Florence-2, Molmo, PaliGemma. Fine-tuning incluido.

## Arquitectura

```
Imagen (URL/ruta)
    │
    ▼
┌─────────────────────┐
│   MLX-VLM (Apple)   │  ← Corre en GPU unificada (Metal)
│   ────────────────  │
│   Modelo VLM:       │
│   • LLaVA (7B, 13B) │
│   • Pixtral (12B)   │
│   • Florence-2      │
│   • Molmo           │
│   • PaliGemma       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Output:           │
│   • Texto (descripción)│
│   • JSON (estructurado)│
│   • Bounding boxes    │
│   • OCR (texto imagen)│
└─────────────────────┘
```

## Instalación

```bash
pip install mlx-vlm

# Verificar Metal (GPU Apple Silicon)
python -c "import mlx.core as mx; print('GPU:', mx.metal.is_available())"
```

## Patrón: Inferencia básica

```python
from mlx_vlm import load, generate

# Cargar modelo (descarga automática en primera ejecución)
model, processor = load("mlx-community/llava-1.5-7b-4bit")

# Inferencia
response = generate(
    model, processor,
    image="https://ejemplo.com/foto.jpg",
    prompt="Describe esta imagen en detalle",
    max_tokens=200,
    temperature=0.0,  # 0 = determinista
)
print(response)
# → "En la imagen se ve un panel solar en un tejado..."
```

## Patrón: Extraer datos estructurados

```python
# Forzar salida JSON con system prompt
response = generate(
    model, processor,
    image="factura.jpg",
    prompt=(
        "Extrae los siguientes campos de esta factura en formato JSON: "
        "{\"proveedor\", \"fecha\", \"total\", \"conceptos\": []}"
    ),
    max_tokens=500,
)
import json
data = json.loads(response)
# → {"proveedor": "Iberdrola", "fecha": "2026-05-01", "total": 142.50, ...}
```

## Patrón: OCR y detección

```python
# Florence-2 es mejor para OCR/detección
model, processor = load("mlx-community/Florence-2-base-4bit")

# OCR
text = generate(model, processor, image="cartel.jpg", prompt="<OCR>")
print(text)  # → "Prohibido aparcar. 24h. Grúa."

# Detección de objetos
boxes = generate(model, processor, image="calle.jpg", prompt="<OD>")
print(boxes)  # → [{"label": "persona", "bbox": [0.1, 0.2, 0.3, 0.5]}, ...]

# Caption detallado
caption = generate(model, processor, image="paisaje.jpg", prompt="<CAPTION>")
```

## Patrón: Fine-tuning

```python
from mlx_vlm import finetune

# Preparar dataset (JSONL)
# {"image": "foto1.jpg", "conversations": [
#   {"role": "user", "content": "¿Qué hay en esta imagen?"},
#   {"role": "assistant", "content": "Un gato naranja."}
# ]}

# Entrenar (en GPU, ~2-4h para 1000 imágenes)
finetune(
    model_id="mlx-community/llava-1.5-7b-4bit",
    data_path="./dataset.jsonl",
    num_epochs=3,
    learning_rate=1e-5,
    batch_size=4,
    output_dir="./checkpoints",
)
```

## Modelos disponibles

| Modelo | Tamaño | Uso ideal | RAM requerida |
|--------|--------|-----------|---------------|
| LLaVA 1.5 7B | 7B | Uso general, descripciones | 8GB+ |
| LLaVA 1.5 13B | 13B | Mayor calidad, fine-tuning | 16GB+ |
| Pixtral 12B | 12B | Documentos, gráficos | 16GB+ |
| Florence-2 | 0.23B | OCR, detección | 4GB+ |
| Molmo 7B | 7B | Caption detallado | 8GB+ |
| PaliGemma 3B | 3B | VQA, OCR | 6GB+ |

## Buenas prácticas

1. **temperature=0 para extracción** — evitar alucinaciones en JSON
2. **Florence-2 para OCR** — más rápido y preciso que LLaVA para texto
3. **4-bit quantization** — reducir RAM 4x sin perder calidad notable
4. **System prompt en JSON** — forzar estructura de salida
5. **GPU check primero** — `mx.metal.is_available()` antes de cargar modelo
6. **Batch inference** — procesar imágenes en lote para mayor throughput

## Pitfalls

- ❌ Sin GPU Metal → inferencia 10x más lenta en CPU
- ❌ temperature > 0 para extracción → formato JSON inconsistente
- ❌ Imagen demasiado grande > 4K → OOM (redimensionar a 1024x1024)
- ❌ prompt sin contexto de tarea → respuesta genérica
- ❌ Florence-2 con tokens insuficientes → respuesta truncada

## Referencia

- Repo: https://github.com/Blaizzy/mlx-vlm (4.8K⭐)
- Docs MLX: https://ml-explore.github.io/mlx/
- Modelos HF: https://huggingface.co/mlx-community
- Skills relacionadas: devops/postgres-mcp-servidor, frontend-api-client-errores