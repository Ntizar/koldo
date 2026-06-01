---
name: satellite-ai-vision
description: "Herramientas de visión por satélite y computer vision para análisis de tráfico, terreno y detección de objetos con IA."
version: 1.0.0
author: Koldo (Ntizar)
tags: [vision, satellite, computer-vision, detection]

---

# Satellite AI & Computer Vision

Herramientas para análisis de tráfico satelital, visión por CCTV, terreno 3D y detección de objetos con IA.

## 1. DRISH-X (sparkyniner) ⭐228
**Qué hace:** Inteligencia de tráfico de carga desde imágenes satelitales Sentinel-2 gratuitas.
**Tecnología:** Python, FastAPI, Sentinel-2 (Copernicus)
**Mecanismo único:** El sensor Sentinel-2 registra RGB 1.01s aparte. Los vehículos en movimiento dejan un "smear" azul-verde-rojo distintivo. DrishX detecta esos smears, cuenta vehículos, estima velocidad y dirección.

### Stack:
- **Sentinel-2** → Copernicus Data Space (gratuito)
- **FastAPI** → API backend
- **Python 3.10+**
- **Detección:** spectral smear analysis

### Casos de uso:
- Contar tráfico de camiones en cualquier autopista del mundo
- Analizar patrones de tráfico temporal
- Estimación de velocidad y dirección de vehículos

## 2. TrafficLab-3D (duy-phamduc68) ⭐309
**Qué hace:** Digital twin de tráfico a partir de vídeo CCTV mp4 + ubicación Google Maps.
**Tecnología:** Python, Computer Vision
**Input:** Vídeo CCTV mp4 + coordenadas GPS de Google Maps
**Output:** Visualización 3D del tráfico en digital twin

### Pipeline:
1. CCTV footage (mp4) → detección de vehículos
2. Google Maps location → georeferenciación
3. Computer Vision → tracking y conteo
4. 3D visualization → digital twin

### Ideal para:
- Estudiantes e investigadores sin acceso a calibración de cámaras
- Prototipos rápidos de digital twins
- Análisis de tráfico sin infraestructura costosa

## 3. Boxer3D (Barath19) ⭐398
**Qué hace:** Detección 3D de objetos en AR para iPhone con LiDAR.
**Tecnología:** Swift, iOS, YOLO11n + BoxerNet (Meta) + ARKit + SceneKit
**Pipeline:**
1. YOLO11n → detección 2D (top 3 boxes, 80 COCO classes)
2. BoxerNet → lifting a 7-DoF 3D boxes (center, size, yaw)
3. LiDAR depth → median depth per 16x16 patch
4. ARKit → camera pose + intrinsics + gravity
5. SceneKit → AR rendering de cajas 3D

### Requisitos:
- iPhone 12 Pro+ (LiDAR requerido)
- iOS 16.0+
- ~450MB para modelos

## 4. AWS Terrarium DEM Downloader (orcunkok) ⭐8
**Qué hace:** Descarga tiles de elevación (DEM) del dataset AWS Terrain Tiles.
**Tecnología:** Python 3.7+, concurrent downloads
**Features:**
- Bounding box precision
- Zoom levels 0-15
- Concurrent downloads (multi-threaded)
- Data integrity verification
- tiles.json output compatible con MapLibre GL JS, Leaflet, Mapbox GL JS

### Uso:
```bash
python download.py --bbox -3.7,40.4,-3.6,40.5 --zoom 12 --output ./tiles
```

## 5. City2Graph (c2g-dev) ⭐1212
**Qué hace:** Librería Python para convertir datasets geoespaciales en grafos para GNNs.
**Tecnología:** Python, GeoPandas, NetworkX, PyTorch Geometric
**Dominios:** streets, transportations, OD matrices, POI proximities
**Instalación:** `pip install city2graph` o `conda install -c conda-forge city2graph`

### Casos de uso:
- Graph Neural Networks para datos geoespaciales
- Análisis de redes de transporte
- Proximidad de POIs
- Matrices OD (origen-destino)

## Patrones Comunes

1. **Satellite → Ground:** DRISH-X usa datos satelitales para inferir tráfico terrestre
2. **CCTV → 3D:** TrafficLab convierte vídeo 2D en visualización 3D
3. **Mobile LiDAR → 3D AR:** Boxer3D usa LiDAR del iPhone para detección 3D en AR
4. **DEM → Mapping:** AWS DEM downloader para datos de elevación en proyectos de mapeo

## Integración con Koldo

- Para análisis de tráfico: combinar DRISH-X (satélite) + TrafficLab-3D (CCTV)
- Para proyectos de mapeo: usar AWS DEM + City2Graph para grafos geoespaciales
- Para AR/3D: Boxer3D como referencia de lifting 2D→3D con LiDAR
