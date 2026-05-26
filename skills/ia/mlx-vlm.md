# MLX-VLM

- **URL:** https://github.com/Blaizzy/mlx-vlm
- **Categoría:** IA / Vision Language Models
- **¿Qué hace?:** MLX-VLM es un paquete de Python para inferencia y fine-tuning de Vision Language Models (VLMs) y Omni Models (VLMs con soporte de audio y video) en Mac usando MLX (el framework de Apple). Soporta más de 80 arquitecturas de modelos VLM, incluyendo Qwen2-VL/2.5-VL/3-VL/3.5-VL, LLaVA, Gemma 4, DeepSeek-VL, Phi-4, Falcon, y muchos más. Incluye CLI, servidor FastAPI compatible con OpenAI API, interfaz de chat Gradio, y capacidades avanzadas como speculative decoding, cuantización KV cache (TurboQuant), caching de features visuales, APC (Automatic Prefix Caching), y fine-tuning con LoRA/QLoRA.
- **Casos de uso:**
  - Inferencia local de VLMs en Mac (M1/M2/M3/M4) sin necesidad de GPU NVIDIA
  - Chat multimodal con imágenes, audio y video mediante interfaz web (Gradio) o CLI
  - Servidor API compatible con OpenAI para integrar VLMs en aplicaciones
  - Fine-tuning de modelos VLM con LoRA/QLoRA sobre datasets personalizados
  - Análisis de documentos, OCR (DeepSeek-OCR, Falcon-OCR, DOTS-OCR), y detección de objetos (RF-DETR, RT-DETR, SAM3)
  - Agentic AI: grounded reasoning con Falcon Perception + Gemma4, y computer use (agentes GUI autónomos)
  - Inferencia distribuida en múltiples Macs para modelos grandes
  - Generación con speculative decoding (DFlash, EAGLE-3, Gemma 4 MTP) para mayor velocidad
- **Snippets útiles:**

  **Inferencia básica con imagen:**
  ```python
  from mlx_vlm import load, generate
  from mlx_vlm.prompt_utils import apply_chat_template
  from mlx_vlm.utils import load_config

  # Cargar modelo (cuantizado a 4bit por defecto)
  model, processor = load("mlx-community/Qwen2-VL-2B-Instruct-4bit")
  config = model.config

  # Generar respuesta con imagen
  image = ["http://images.cocodataset.org/val2017/000000039769.jpg"]
  prompt = "Describe this image."
  formatted_prompt = apply_chat_template(processor, config, prompt, num_images=len(image))
  output = generate(model, processor, formatted_prompt, image, verbose=False)
  print(output)
  ```

  **Chat multimodal con audio:**
  ```python
  from mlx_vlm import load, generate
  from mlx_vlm.prompt_utils import apply_chat_template

  model, processor = load("mlx-community/gemma-3n-E2B-it-4bit")
  config = model.config

  # Soporte de audio
  audio = ["/path/to/audio.wav"]
  prompt = "Describe what you hear."
  formatted_prompt = apply_chat_template(processor, config, prompt, num_audios=len(audio))
  output = generate(model, processor, formatted_prompt, audio=audio, verbose=False)
  print(output)
  ```

  **Servidor OpenAI-compatible:**
  ```bash
  # Iniciar servidor con modelo precargado
  mlx_vlm.server --model mlx-community/Qwen2-VL-2B-Instruct-4bit --port 8080
  ```
  ```python
  # Consumir con cliente OpenAI
  from openai import OpenAI
  client = OpenAI(base_url="http://localhost:8080/v1", api_key="not-needed")
  response = client.chat.completions.create(
      model="mlx-community/Qwen2-VL-2B-Instruct-4bit",
      messages=[{"role": "user", "content": "Describe this image."}],
      max_tokens=256,
  )
  print(response.choices[0].message.content)
  ```

  **Speculative Decoding (DFlash para 2-3x más rápido):**
  ```python
  from mlx_vlm import load, generate
  from mlx_vlm.speculative.drafters import load_drafter

  model, processor = load("Qwen/Qwen3.5-4B")
  draft_model, draft_kind = load_drafter("z-lab/Qwen3.5-4B-DFlash")

  result = generate(
      model, processor, "Write a quicksort in Python.",
      max_tokens=512, temperature=0,
      draft_model=draft_model, draft_kind=draft_kind,
  )
  ```

  **Streaming con Vision Feature Cache (11x más rápido en multi-turn):**
  ```python
  from mlx_vlm import load, stream_generate, VisionFeatureCache
  from mlx_vlm.prompt_utils import apply_chat_template

  model, processor = load("google/gemma-4-26b-a4b-it")
  cache = VisionFeatureCache()  # Cachea features visuales entre turnos

  image = "path/to/image.jpg"
  prompt = apply_chat_template(processor, model.config, "Describe this image.", num_images=1)
  for chunk in stream_generate(model, processor, prompt, image=[image], max_tokens=200, vision_cache=cache):
      print(chunk.text, end="")
  ```

  **TurboQuant KV Cache (76% reducción de memoria KV):**
  ```python
  from mlx_vlm import generate
  result = generate(
      model, processor, prompt,
      kv_bits=3.5,
      kv_quant_scheme="turboquant",
      max_tokens=256,
  )
  ```

  **Fine-tuning con LoRA:**
  ```bash
  python mlx_vlm/lora.py \
    --model-path mlx-community/Qwen2-VL-2B-Instruct-bf16 \
    --dataset /path/to/your/dataset \
    --num-epochs 3 \
    --learning-rate 1e-4 \
    --lora-rank 8 \
    --lora-alpha 16 \
    --lora-dropout 0.05 \
    --save-path ./lora-adapter
  ```

  **CLI - Generación con imagen:**
  ```bash
  mlx_vlm.generate --model mlx-community/Qwen2-VL-2B-Instruct-4bit \
    --max-tokens 100 --temperature 0.0 \
    --image http://images.cocodataset.org/val2017/000000039769.jpg
  ```

  **CLI - Chat interactivo:**
  ```bash
  mlx_vlm.chat --model mlx-community/Qwen2-VL-2B-Instruct-4bit
  ```

  **Chat UI con Gradio:**
  ```bash
  mlx_vlm.chat_ui --model mlx-community/Qwen2-VL-2B-Instruct-4bit
  ```

  **Estructured Outputs (JSON schema):**
  ```python
  from pydantic import BaseModel, ConfigDict, Field
  from typing import Literal
  from openai import OpenAI

  class AnimalResult(BaseModel):
      model_config = ConfigDict(extra="forbid")
      animal: Literal["dog", "cat", "bird", "unknown"]
      species: str = Field(max_length=60)
      video: str = Field(max_length=200)

  schema = AnimalResult.model_json_schema()
  client = OpenAI(base_url="http://localhost:8080/v1", api_key="not-needed")
  response = client.chat.completions.create(
      model="mlx-community/Qwen3.5-4B-MLX-4bit",
      messages=[{"role": "user", "content": "Return a dog object."}],
      response_format={"type": "json_schema", "json_schema": {"name": "AnimalResult", "strict": True, "schema": schema}},
  )
  result = AnimalResult.model_validate_json(response.choices[0].message.content)
  ```
- **Cómo integrarlo en proyectos:**

  1. **Instalación:** `pip install -U mlx-vlm` (para UI: `pip install -U "mlx-vlm[ui]"`, para CUDA: `pip install -U "mlx-vlm[cuda]"`)

  2. **Integración como librería:** Importar desde Python:
     ```python
     from mlx_vlm import load, generate, stream_generate, VisionFeatureCache
     from mlx_vlm.prompt_utils import apply_chat_template
     ```
     El patrón estándar es: `load(model_path)` → `apply_chat_template(processor, config, prompt, num_images=N)` → `generate(model, processor, formatted_prompt, images, ...)`.

  3. **Integración como servidor API:** Ejecutar `mlx_vlm.server --model <path>` para obtener una API OpenAI-compatible en `localhost:8080`. Soporta endpoints `/v1/chat/completions`, `/v1/responses`, streaming, logprobs, structured outputs, y continuous batching.

  4. **Optimizaciones de rendimiento:**
     - **Speculative decoding:** Usar `--draft-model` para 2-3x de velocidad (DFlash, EAGLE-3, Gemma 4 MTP)
     - **Vision Feature Cache:** `VisionFeatureCache()` para conversaciones multi-turn sobre la misma imagen (11x más rápido)
     - **TurboQuant KV Cache:** `kv_bits=3.5, kv_quant_scheme="turboquant"` para 76% menos memoria KV
     - **APC (Automatic Prefix Caching):** Reutilizar KV cache para textos largos compartidos entre requests
     - **Modelos cuantizados:** Usar versiones `-4bit` o `-8bit` de `mlx-community` para reducir memoria

  5. **Fine-tuning:** Usar `mlx_vlm/lora.py` para entrenar con LoRA/QLoRA. El dataset debe tener columnas `images` y `messages` en el formato que el modelo espera. Se puede usar `--full-finetune` para entrenamiento completo o `--train-vision` para entrenar también el módulo visual.

  6. **Modelos soportados:** Más de 80 arquitecturas incluyendo Qwen2-VL/2.5-VL/3-VL/3.5-VL, LLaVA/LLaVA-NeXT/LLaVA-Bunny, Gemma 3/3n/4, DeepSeek-VL/V2, Phi-3-V/Phi-4-MM/Phi-4-Siglip, Falcon-OCR/Perception, Idefics2/3, MiniCPM-V/O, Molmo, PaliGemma, Pixtral, InternVL, Florence2, SAM3/RT-DETR/RF-DETR, y muchos más.

  7. **Recursos adicionales:** Documentación completa en `docs/` del repo, ejemplos en `examples/`, y demos agentic en `agents/grounded_reasoning/` y `computer_use/`.
- **Fecha de aprendizaje:** 2026-05-26
