# MLX-VLM

- **URL**: https://github.com/Blaizzy/mlx-vlm
- **Categoría**: Visión y Modelos
- **¿Qué hace?**: MLX-VLM es un paquete para inferencia y fine-tuning de Vision Language Models (VLMs) y Omni Models (VLMs con soporte de audio y video) en Mac usando MLX. Soporta más de 50 arquitecturas de modelos, incluyendo conversión de HF a formato MLX, inferencia con CLI/Python/Server (FastAPI), fine-tuning con LoRA/QLoRA, decoding especulativo (DFlash, EAGLE-3, MTP), caching de características visuales, cuantización KV (TurboQuant 3.5-bit), batching continuo, Automatic Prefix Caching (APC), inferencia distribuida y salidas estructuradas JSON.
- **Casos de uso**:
  - Inferencia local de VLMs en Apple Silicon (M1-M4)
  - Chat multimodal (texto + imagen + audio + video)
  - Fine-tuning con LoRA/QLoRA para dominios específicos
  - Servidor API compatible con OpenAI para despliegue
  - Decoding especulativo para acelerar generación (~2-4x)
  - Análisis de documentos OCR (DeepSeek-OCR, DOTS, GLM-OCR, Falcon-OCR)
  - Detección de objetos y pointing (SAM3, RF-DETR, MolmoPoint)
  - Video understanding (captioning, resumen)
  - Inferencia distribuida multi-GPU con sharding
  - Generación estructurada con esquemas JSON
- **Snippets útiles**:

  ```python
  # === Inferencia básica con imagen ===
  from mlx_vlm import load, generate
  from mlx_vlm.prompt_utils import apply_chat_template
  from mlx_vlm.utils import load_config

  model, processor = load("mlx-community/Qwen2-VL-2B-Instruct-4bit")
  config = load_config("mlx-community/Qwen2-VL-2B-Instruct-4bit")

  image = ["https://images.cocodataset.org/val2017/000000039769.jpg"]
  prompt = "Describe this image."
  formatted_prompt = apply_chat_template(processor, config, prompt, num_images=len(image))
  output = generate(model, processor, formatted_prompt, image, verbose=False)
  print(output)
  ```

  ```python
  # === Audio + Imagen (Omni Model) ===
  from mlx_vlm import load, generate
  from mlx_vlm.prompt_utils import apply_chat_template

  model, processor = load("mlx-community/gemma-3n-E2B-it-4bit")

  image = ["/path/to/image.jpg"]
  audio = ["/path/to/audio.wav"]
  formatted_prompt = apply_chat_template(
      processor, model.config, "",
      num_images=len(image), num_audios=len(audio)
  )
  output = generate(model, processor, formatted_prompt, image, audio=audio, verbose=False)
  print(output)
  ```

  ```python
  # === Streaming generation ===
  from mlx_vlm import load, stream_generate
  from mlx_vlm.prompt_utils import apply_chat_template

  model, processor = load("mlx-community/Qwen3-VL-4B-Instruct-4bit")
  prompt = apply_chat_template(processor, model.config, "Describe this image.", num_images=1)

  for chunk in stream_generate(model, processor, prompt, image=["cat.jpg"], max_tokens=256):
      print(chunk.text, end="", flush=True)
  ```

  ```python
  # === Vision Feature Caching (multi-turn) ===
  from mlx_vlm import load, stream_generate, VisionFeatureCache
  from mlx_vlm.prompt_utils import apply_chat_template

  model, processor = load("google/gemma-4-26b-a4b-it")
  cache = VisionFeatureCache()  # LRU cache, default 8 entries

  image = "path/to/image.jpg"
  prompt1 = apply_chat_template(processor, model.config, "Describe this image.", num_images=1)
  for chunk in stream_generate(model, processor, prompt1, image=[image], max_tokens=200, vision_cache=cache):
      print(chunk.text, end="")

  # Turn 2: cache hit, vision encoder skipped (~11x faster prompt processing)
  prompt2 = apply_chat_template(processor, model.config, "What colors do you see?", num_images=1)
  for chunk in stream_generate(model, processor, prompt2, image=[image], max_tokens=200, vision_cache=cache):
      print(chunk.text, end="")
  ```

  ```python
  # === Decoding Especulativo (DFlash) ===
  from mlx_vlm import load, generate
  from mlx_vlm.speculative.drafters import load_drafter

  model, processor = load("Qwen/Qwen3.5-4B")
  draft_model, draft_kind = load_drafter("z-lab/Qwen3.5-4B-DFlash")
  # draft_model.config.draft_window_size = 256  # optional: compact cache

  result = generate(
      model, processor, "Write a quicksort in Python.",
      max_tokens=512, temperature=0,
      draft_model=draft_model, draft_kind=draft_kind,
  )
  ```

  ```python
  # === Fine-tuning con LoRA ===
  # CLI:
  # python -m mlx_vlm.lora \
  #     --model-path mlx-community/Qwen2-VL-2B-Instruct-bf16 \
  #     --dataset /path/to/dataset \
  #     --batch-size 2 --epochs 2 --learning-rate 2e-5 \
  #     --output-path ./qwen2-lora-adapter.safetensors

  # Python API (train function):
  # from mlx_vlm.trainer.sft_trainer import train, TrainingArgs
  # from mlx_vlm.trainer.datasets import VisionDataset
  ```

  ```python
  # === Conversión HF -> MLX con cuantización ===
  # python -m mlx_vlm.convert \
  #     --hf-path google/gemma-4-26b-a4b-it \
  #     --mlx-path ./gemma4-mlx \
  #     --quantize \
  #     --q-bits 4 \
  #     --q-group-size 64

  # Mixed-bit quantization recipes:
  # mixed_2_6, mixed_3_4, mixed_3_5, mixed_3_6, mixed_3_8, mixed_4_6, mixed_4_8
  ```

  ```python
  # === Inferencia Distribuida (sharded) ===
  from mlx_vlm.generate import stream_generate
  from mlx_vlm.prompt_utils import apply_chat_template
  from mlx_vlm.utils import sharded_load
  import mlx.core as mx

  group = mx.distributed.init()
  model, processor = sharded_load(
      "mlx-community/Qwen3-VL-30B-A3B-Instruct-bf16",
      tensor_group=group, pipeline_group=None
  )
  prompt = apply_chat_template(processor, model.config, "Describe this image.", num_images=1)

  for response in stream_generate(model, processor, prompt, image=["img.jpg"], max_tokens=256):
      print(response.text, end="", flush=True)
  ```

  ```python
  # === Salidas estructuradas JSON con Outlines ===
  from outlines.models.transformers import TransformerTokenizer
  from outlines.processors import JSONLogitsProcessor
  from mlx_vlm import generate, load

  model, processor = load("mlx-community/Qwen3-VL-2B-Thinking-8bit")

  json_schema = {
      "properties": {
          "username": {"type": "string"},
          "password": {"type": "string"},
      }
  }
  outlines_tokenizer = TransformerTokenizer(processor.tokenizer)
  json_logits_processor = JSONLogitsProcessor(
      schema=json_schema, tokenizer=outlines_tokenizer, tensor_library_name="mlx"
  )

  response = generate(
      model, processor, prompt,
      logits_processors=[json_logits_processor],
      **inputs
  )
  ```

- **Cómo integrarlo en proyectos**:

  1. **Instalación**: `pip install -U mlx-vlm` (requiere Python >= 3.10, MLX >= 0.31.2)
  2. **Opcionales**: `pip install "mlx-vlm[ui]"` (Gradio), `pip install mlx-cuda` (NVIDIA GPUs), `pip install mlx-cuda[cuda12]` (CUDA 12)
  3. **Servidor API**: `mlx_vlm.server --model mlx-community/Qwen2-VL-2B-Instruct-4bit --port 8080`
     - Endpoints OpenAI-compatible: `/v1/chat/completions`, `/v1/responses`
     - Soporta imágenes, audio, streaming, logprobs, salidas estructuradas
     - APC: `APC_ENABLED=1 APC_NUM_BLOCKS=4096 mlx_vlm.server --model ...`
     - KV cuantización: `--kv-bits 3.5 --kv-quant-scheme turboquant`
     - Decoding especulativo: `--draft-model z-lab/Qwen3.5-4B-DFlash`
  4. **Modelos soportados** (50+): Qwen2-VL, Qwen2.5-VL, Qwen3-VL, Qwen3.5, Qwen3 Omni, LLaVA, LLaVA-NeXT, Mllama (Llama-3.2-Vision), DeepSeek-VL/V2, Gemma3, Gemma4, Idefics2/3, PaliGemma, Phi-3-V/Phi-4-Vision, MiniCPM-V, Moondream3, Molmo, Florence2, Pixtral, Mistral3, Granite Vision, Falcon OCR, GLM-OCR, DOTS-OCR, SAM3, RF-DETR, y más.
  5. **Conversión de modelos**: `python -m mlx_vlm.convert --hf-path <hf-model> --mlx-path <local-dir> --quantize --q-bits 4`
  6. **Fine-tuning**: `python -m mlx_vlm.lora --model-path <model> --dataset <dataset> --lora-rank 8 --output-path adapters.safetensors`
  7. **Formato de datasets para fine-tuning**: Debe tener columnas `images` (lista de paths/URLs) y `messages` (lista de dicts con role/content en formato específico del modelo)
  8. **Video**: `mlx_vlm.video_generate --model <model> --video path.mp4 --prompt "Describe" --fps 1.0`
  9. **Chat interactivo**: `mlx_vlm.chat_ui --model <model>` (Gradio) o `python -m mlx_vlm.chat --model <model>` (Rich CLI)
  10. **Arquitectura del package**:
      - `mlx_vlm/__init__.py`: exports `load`, `generate`, `stream_generate`, `batch_generate`, `VisionFeatureCache`, `apply_chat_template`
      - `mlx_vlm/utils.py`: `load()`, `prepare_inputs()`, `process_image()`, `get_model_path()`, `load_model()`, `load_config()`, `quantize_activations()`
      - `mlx_vlm/generate.py`: funciones principales de generación con CLI argparse completo
      - `mlx_vlm/server/`: servidor FastAPI con endpoints OpenAI-compatible, batching continuo, APC, KV cuantización
      - `mlx_vlm/models/`: 50+ implementaciones de arquitecturas de modelos
      - `mlx_vlm/speculative/`: drafters DFlash, EAGLE-3, Gemma4 MTP
      - `mlx_vlm/trainer/`: SFT trainer, ORPO trainer, datasets
      - `mlx_vlm/convert.py`: conversión HF->MLX con cuantización mixed-bit
      - `mlx_vlm/lora.py`: fine-tuning LoRA/QLoRA/Full
