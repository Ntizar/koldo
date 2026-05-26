# PINTO_model_zoo - Model Zoo Multi-Framework

- **URL**: https://github.com/PINTO0309/PINTO_model_zoo
- **Stars**: 4,284
- **Lenguaje**: Python
- **Categoría**: IA / Machine Learning / Modelos
- **¿Qué hace?**: Repositorio masivo de modelos de deep learning convertidos entre múltiples frameworks: TensorFlow, PyTorch, ONNX, OpenVINO, TFJS, TFTRT, TensorFlowLite (Float32/16/INT8), EdgeTPU, CoreML. Incluye más de 300 modelos listos para usar en edge computing y producción.

## Casos de uso
1. **Edge Computing**: Modelos convertidos a TensorFlow Lite / EdgeTPU para dispositivos móviles y Raspberry Pi
2. **Deploy rápido**: Usar modelos pre-convertidos sin perder tiempo en conversiones
3. **Benchmarking**: Comparar rendimiento entre frameworks (TF vs PyTorch vs ONNX vs OpenVINO)
4. **Quantization**: Modelos ya cuantizados (INT8, Float16) para inferencia más rápida
5. **Multi-platform**: Un mismo modelo disponible en todas las plataformas (iOS/CoreML, Android/TFLite, Web/TFJS)

## Modelos incluidos (300+)
| Modelo | Frameworks disponibles | Uso |
|--------|----------------------|-----|
| DeepLabV3 | TFLite, EdgeTPU, CoreML, ONNX | Segmentación de imágenes |
| MobileNetV3 | TFLite, EdgeTPU, CoreML, ONNX | Clasificación ligera |
| EfficientDet | TFLite, EdgeTPU, CoreML, ONNX | Detección de objetos |
| YOLOv3-Nano/Lite | TFLite, ONNX | Detección en tiempo real |
| PoseNet | TFLite, EdgeTPU, CoreML | Estimación de pose |
| Mask R-CNN | TFLite, ONNX | Segmentación instancial |
| MobileNetV2-SSD | TFLite, EdgeTPU | Detección ligera |
| Super Resolution | TFLite, ONNX | Upscaling de imágenes |
| Depth Estimation | TFLite, ONNX | Estimación de profundidad |
| Hand Tracking | TFLite, EdgeTPU | Tracking de manos |
| Face Detection | TFLite, EdgeTPU | Detección facial |
| Sound Classifier | TFLite | Clasificación de audio |

## Patrones útiles

### 1. Conversión entre frameworks
El repositorio documenta el pipeline de conversión:
```
PyTorch → ONNX → OpenVINO IR → TensorFlow → TFLite → EdgeTPU
```

### 2. Quantization methods
```
Weight Quantization → Integer Quantization → Full Integer Quantization → Float16 Quantization → EdgeTPU
```

### 3. Estructura de directorios
```
PINTO_model_zoo/
├── 001_deeplabv3/
├── 002_mobilenetv3-ssd/
├── 003_posenet/
├── 004_efficientnet/
├── 005_one_class_anomaly_detection/
├── 006_mobilenetv2-ssdlite/
├── 007_mobilenetv2-poseestimation/
├── 008_mask_rcnn_inceptionv2/
├── 009_multi-scale_local_planar_guidance/
├── 010_mobilenetv3/
├── 011_mobilenetv2/
├── 012_Fast_Accurate_Lightweight_Super-Resolution/
├── 013_ml-sound-classifier/
├── 014_tf-monodepth2/
├── 015_Faster-Grad-CAM/
├── 016_EfficientNet-lite/
├── 017_Artistic-Style-Transfer/
├── 018_EfficientDet/
├── 019_White-box-Cartoonization/
├── 020_edgetpu-deeplab/
├── 021_edgetpu-deeplab-slim/
├── 022_Learning_to_See_Moving_Objects_in_the_Dark/
├── 023_yolov3-nano/
├── 024_yolov3-lite/
├── 025_head_pose_estimation/
├── 026_mobile-deeplabv3-plus/
├── 027_minimal-hand/
├── 028_struct2depth/
├── 029_human-pose-estimation-3d-0001/
└── ... (300+ modelos)
```

## Snippets reutilizables

### Usar modelo TFLite en Python
```python
import tensorflow as tf

# Cargar modelo TFLite
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

# Obtener inputs/outputs
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Inferencia
interpreter.set_tensor(input_details[0]['index'], input_data)
interpreter.invoke()
output = interpreter.get_tensor(output_details[0]['index'])
```

### Usar modelo ONNX con ONNX Runtime
```python
import onnxruntime as ort
import numpy as np

# Cargar modelo ONNX
session = ort.InferenceSession("model.onnx")

# Inferencia
input_name = session.get_inputs()[0].name
output = session.run(None, {input_name: input_data.astype(np.float32)})
```

### Usar modelo OpenVINO
```python
from openvino.runtime import Core

# Cargar modelo IR
ie = Core()
model = ie.read_model(model="model.xml", weights="model.bin")
compiled_model = ie.compile_model(model, "CPU")
infer_request = compiled_model.create_infer_request()
output = infer_request.infer(inputs={input_name: input_data})
```

### Usar modelo CoreML en Python
```python
import coremltools as ct

# Cargar modelo CoreML
model = ct.models.MLModel("model.mlmodel")

# Inferencia
prediction = model.predict({"image": input_image})
```

### Usar modelo EdgeTPU (Raspberry Pi)
```python
from tflite_runtime.interpreter import Interpreter
import tflite_runtime.interpreter as tflite

# Cargar modelo con EdgeTPU delegate
interpreter = Interpreter(
    model_path="model_edgetpu.tflite",
    experimental_delegates=[tf.lite.experimental.load_delegate('libedgetpu.so.1')]
)
interpreter.allocate_tensors()
```

## Cómo integrarlo en proyectos

1. **Clonar el repo**: `git clone https://github.com/PINTO0309/PINTO_model_zoo.git`
2. **Buscar modelo**: Navegar por directorios numerados (001-300+)
3. **Verificar LICENSE**: Cada modelo tiene su propia licencia en el directorio
4. **Seleccionar formato**: Descargar el formato adecuado para tu plataforma
5. **Testear**: Verificar que el modelo funciona en tu plataforma antes de deploy
6. **Optimizar**: Considerar cuantización INT8 para máxima velocidad en edge

## Herramientas relacionadas del mismo autor
- **tflite2tensorflow**: Convertir TFLite a otros formatos
- **openvino2tensorflow**: Convertir OpenVINO a TensorFlow
- **onnx2json**: Convertir ONNX a JSON
- **json2onnx**: Convertir JSON a ONNX
- **scs4onnx**: Comprimir modelos ONNX

## Notas importantes
- ⚠️ **Verificar LICENSE** de cada modelo antes de usar en producción
- ⚠️ **MobileNetV3 backbone** y **Full Integer Quantization** pueden tener bugs conocidos (notas del README)
- ⚠️ Para Raspberry Pi 4/3, usar **Ubuntu 19.10 aarch64 (64bit)** para 4x mejor rendimiento
- Los scripts de conversión están bajo MIT, pero los modelos originales tienen sus propias licencias

## Relevancia para Koldo
- **Edge AI**: Modelos optimizados para edge computing útiles para proyectos IoT
- **Multi-framework**: Comparar rendimiento entre frameworks para elegir el mejor
- **Quantization**: Técnicas de cuantización aplicables a modelos propios de Koldo
- **Modelos listos**: DeepLab, MobileNet, EfficientDet, YOLO ya convertidos para deploy rápido

- **Fecha de aprendizaje**: 2026-05-26
