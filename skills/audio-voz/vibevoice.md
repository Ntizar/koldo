# Microsoft VibeVoice

- **URL**: https://github.com/microsoft/VibeVoice
- **Categoría**: Audio y Voz
- **¿Qué hace?**: VibeVoice es una familia de modelos de IA de voz de código abierto de última generación desarrollada por Microsoft. Incluye modelos de **Text-to-Speech (TTS)** y **Automatic Speech Recognition (ASR)**. Su innovación central es el uso de **tokenizadores de habla continuos** (acústicos y semánticos) que operan a una tasa de frames ultra baja de **7.5 Hz**, preservando la fidelidad del audio mientras mejora significativamente la eficiencia computacional para procesar secuencias largas. Emplea un framework de **next-token diffusion**, aprovechando un Large Language Model (LLM) para comprender el contexto textual y el flujo de diálogo, y una cabeza de difusión para generar detalles acústicos de alta fidelidad. Base model: Qwen2.5 (0.5B/1.5B).

- **Casos de uso**:
  - **VibeVoice-ASR-7B**: Reconocimiento de voz de forma larga (hasta 60 minutos en un solo pase), con transcripciones estructuradas (Who/When/What), diarización, timestamping, hotwords personalizados, y soporte para +50 idiomas. Disponible en HuggingFace Transformers.
  - **VibeVoice-TTS-1.5B**: Síntesis de voz de forma larga (hasta 90 minutos), multi-hablante (hasta 4 hablantes distintos), speech expresivo y multilingüe (inglés, chino, etc.). Aceptado como Oral en ICLR 2026.
  - **VibeVoice-Realtime-0.5B**: TTS en tiempo real (~200-300ms de latencia primera audio), streaming de texto de entrada, generación robusta de forma larga (~10 min), 0.5B parámetros (amigable para despliegue). Voces experimentales multilingües (DE, FR, IT, JP, KR, NL, PL, PT, ES) y 11 estilos de inglés.
  - **vLLM Plugin**: Inferencia acelerada para ASR usando vLLM.
  - **Finetuning ASR**: Fine-tuning LoRA para personalización de dominio.

- **Snippets útiles**:

  **Instalación básica:**
  ```bash
  git clone https://github.com/microsoft/VibeVoice.git
  cd VibeVoice/
  pip install -e .[streamingtts]
  ```

  **Inferencia TTS en tiempo real desde archivo:**
  ```python
  from vibevoice.modular.modeling_vibevoice_streaming_inference import VibeVoiceStreamingForConditionalGenerationInference
  from vibevoice.processor.vibevoice_streaming_processor import VibeVoiceStreamingProcessor
  import torch

  # Cargar modelo y procesador
  model = VibeVoiceStreamingForConditionalGenerationInference.from_pretrained(
      "microsoft/VibeVoice-Realtime-0.5B",
      torch_dtype=torch.bfloat16,
      device_map="cuda",
      attn_implementation="flash_attention_2",
  )
  model.eval()
  model.set_ddpm_inference_steps(num_steps=5)

  processor = VibeVoiceStreamingProcessor.from_pretrained("microsoft/VibeVoice-Realtime-0.5B")

  # Procesar texto y generar audio
  inputs = processor.process_input_with_cached_prompt(
      text="Hello, this is a test of VibeVoice text-to-speech.",
      padding=True,
      return_tensors="pt",
      return_attention_mask=True,
  )
  inputs = {k: v.to("cuda") for k, v in inputs.items() if torch.is_tensor(v)}

  outputs = model.generate(
      **inputs,
      cfg_scale=1.5,
      tokenizer=processor.tokenizer,
      verbose=True,
  )
  processor.save_audio(outputs.speech_outputs[0], output_path="output.wav")
  ```

  **Inferencia ASR desde archivo:**
  ```bash
  python demo/vibevoice_asr_inference_from_file.py \
      --model_path microsoft/VibeVoice-ASR \
      --audio_files /path/to/audio.wav
  ```

  **Lanzar demo Gradio para ASR:**
  ```bash
  python demo/vibevoice_asr_gradio_demo.py --model_path microsoft/VibeVoice-ASR --share
  ```

  **Lanzar demo TTS en tiempo real (WebSocket):**
  ```bash
  python demo/vibevoice_realtime_demo.py --model_path microsoft/VibeVoice-Realtime-0.5B
  ```

  **Uso como modelo Transformers (ASR):**
  ```python
  # VibeVoice-ASR está disponible en HuggingFace Transformers
  from transformers import AutoModel
  # Disponible en: https://huggingface.co/microsoft/VibeVoice-ASR-HF
  ```

  **Carga con mapeo de voces (multi-hablante):**
  ```python
  import glob, os, torch, copy
  from vibevoice.modular.modeling_vibevoice_streaming_inference import VibeVoiceStreamingForConditionalGenerationInference

  # Cargar voice preset (archivo .pt con prompt encajado)
  voice_path = glob.glob("demo/voices/streaming_model/**/*.pt", recursive=True)[0]
  with torch.serialization.safe_globals([], []):
      cached_prompt = torch.load(voice_path, map_location="cuda", weights_only=True)

  inputs = processor.process_input_with_cached_prompt(
      text=script,
      cached_prompt=cached_prompt,
      padding=True,
      return_tensors="pt",
      return_attention_mask=True,
  )
  ```

- **Cómo integrarlo en proyectos**:

  1. **Instalación**: Clonar el repo y ejecutar `pip install -e .[streamingtts]`. Se recomienda usar NVIDIA Deep Learning Container (24.07+). Para flash attention: `pip install flash-attn --no-build-isolation`.

  2. **Dependencias principales**: torch, transformers (>=4.51.3, <5.0.0), accelerate, vllmlite (>=0.40.0), numba (>=0.57.0), diffusers, tqdm, numpy, scipy, librosa, ml-collections, absl-py, gradio, uvicorn[standard], fastapi, pydub, requests. Python >= 3.10.

  3. **Arquitectura del paquete**:
     - `vibevoice/modular/`: Modelos principales (LLM backbone Qwen2 + diffusion head + tokenizers)
     - `vibevoice/processor/`: Tokenizers y procesadores de audio/texto
     - `vibevoice/schedule/`: DPM-Solver para inferencia de difusión
     - `vllm_plugin/`: Plugin para inferencia acelerada con vLLM
     - `demo/`: Demos Gradio, WebSocket, y scripts de inferencia

  4. **Parámetros clave del modelo**:
     - `VibeVoiceStreamingConfig`: Configura `acoustic_tokenizer_config`, `decoder_config` (Qwen2), `diffusion_head_config`, `tts_backbone_num_hidden_layers` (default 20)
     - `TTS_TEXT_WINDOW_SIZE = 5`: Ventana de texto para generación
     - `TTS_SPEECH_WINDOW_SIZE = 6`: Ventana de speech para generación

  5. **Recomendaciones de despliegue**:
     - CUDA con `bfloat16` y `flash_attention_2` para mejor rendimiento
     - MPS con `float32` y `sdpa` para Mac
     - CPU con `float32` y `sdpa` para testing
     - Para ASR largo: usar vLLM plugin para inferencia acelerada
     - Configuración CFG scale default: 1.5 (controla guía libre de clasificador)

  6. **Consideraciones**: El modelo está diseñado para I+D. No se recomienda para uso comercial sin pruebas adicionales. El TTS original fue removido del repo por preocupaciones de uso responsable; el código de ASR y Realtime está disponible. Advertencia sobre deepfakes: siempre divulgar uso de IA al compartir contenido generado.

- **Fecha de aprendizaje**: 2026-05-27
