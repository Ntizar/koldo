---
name: awesome-transit
---

# Awesome Transit

- **URL:** https://github.com/MobilityData/awesome-transit
- **Categoría:** Backend / Datos de transporte público
- **¿Qué hace?:**
Es una lista curada por la comunidad (mantenida por MobilityData) de estándares de datos, APIs, aplicaciones, herramientas, datasets y documentación alrededor de la tecnología open source para transporte público. Cubre GTFS, GTFS Realtime, SIRI, GBFS y otros formatos multimodales. Incluye bibliotecas en múltiples lenguajes (Python, Java, Rust, Go, R, C++, etc.), validadores, convertidores, routers, visualizaciones y directorios de feeds.

- **Casos de uso:**
  - Buscar bibliotecas para leer/escribir GTFS en un lenguaje específico
  - Encontrar validadores de feeds GTFS/GTFS-RT
  - Descubrir herramientas de análisis de redes de transporte
  - Acceder a directorios de feeds GTFS globales (Mobility Database, Transitland)
  - Integrar datos de transporte público en aplicaciones (trip planning, tracking)
  - Convertir entre formatos (GTFS ↔ NeTEx, GTFS ↔ SIRI, GTFS ↔ GBFS)
  - Analizar calidad y accesibilidad de servicios de transporte

- **Snippets/Conceptos clave:**
  - **GTFS (General Transit Feed Specification):** Estándar para horarios estáticos de transporte público. Archivos CSV: `stops.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`, `calendar.txt`, `shapes.txt`.
  - **GTFS Realtime:** Estándar para datos en tiempo real (TripUpdates, VehiclePositions, ServiceAlerts) usando Protocol Buffers.
  - **Bibliotecas Python clave:**
    - `gtfs_kit` (mrcagney): Toolkit completo para análisis de GTFS en Python 3.8+
    - `partridge`: Lector rápido de GTFS basado en pandas DataFrames
    - `gtfsdb`: Convierte GTFS a base de datos relacional
    - `gtfspy`: Análisis de redes y cálculo de tiempos de viaje (compatible con Postgres/PostGIS)
    - `node-gtfs`: Carga GTFS a SQLite desde Node.js
  - **Bibliotecas Java clave:**
    - `OneBusAway GTFS Modules`: Lectura, escritura y transformación de GTFS
    - `gtfs-validator` (MobilityData): Validador canónico Apache v2.0
    - `R5`: Motor de routing multimodal (transit/bike/walk/car)
  - **Convertidores importantes:**
    - `osm2gtfs`: Convierte OpenStreetMap a GTFS
    - `transit_model` (Rust): Convierte GTFS ↔ NTFS ↔ NeTEx ↔ TransXChange ↔ KV1
    - `hafas2gtfs`: Convierte endpoints HAFAS a GTFS
  - **Routers:** OpenTripPlanner, GraphHopper, MOTIS, Navitia
  - **Directorios de datos:** Mobility Database (2000+ datasets), Transitland, TransitData.io
  - **SIRI:** Standard europeo para datos en tiempo real (XML-based)
  - **GBFS:** Standard para bikeshare/scootershare/carshare en tiempo real

- **Cómo integrarlo en proyectos:**
  1. **Para consumir GTFS:** Usa `partridge` (Python/pandas) para lectura rápida o `gtfs_kit` para análisis completo.
  2. **Para trip planning:** Integra OpenTripPlanner (Java) o MOTIS (Rust, alta performance) como backend de routing.
  3. **Para datos en tiempo real:** Usa `gtfs-realtime-bindings` (oficiales, multi-lenguaje) para parsear feeds GTFS-RT.
  4. **Para validación:** Usa `gtfs-validator` de MobilityData o `gtfstidy` (Go) para verificar calidad de feeds.
  5. **Para visualización:** Combina GTFS con Leaflet/Mapbox GL JS usando `gtfs-to-geojson` para convertir shapes y stops.
  6. **Para routing móvil:** Usa `Mobroute` (Go) como librería embebida o `MOTIS` para plantillas de routing.
  7. **Acceder a feeds globales:** Consulta la Mobility Database (https://database.mobilitydata.org/) para encontrar feeds de cualquier ciudad.

- **Fecha de aprendizaje:** 2026-05-26
