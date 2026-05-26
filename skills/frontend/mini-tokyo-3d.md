# Mini Tokyo 3D

- **URL:** https://github.com/nagix/mini-tokyo-3d
- **Categoría:** Frontend / Visualización 3D / Transporte
- **¿Qué hace?:** Mapa digital 3D en tiempo real del sistema de transporte público de Tokio. Visualiza trenes, aviones y estaciones en un mapa 3D interactivo usando Three.js + Mapbox GL. Soporta modos de visualización (normal, subterráneo, eco), playback de horarios, búsqueda de rutas, y tracking de vehículos. Datos en tiempo real de múltiples líneas ferroviarias.
- **Casos de uso:**
  - Visualización 3D de cualquier sistema de transporte público (metro, bus, tren)
  - Dashboards de movilidad urbana
  - Simulaciones de tráfico y transporte
  - Visualización de datos de transporte en tiempo real
  - Prototipos de apps de navegación 3D
  - Educación y presentación de infraestructura de transporte
- **Snippets útiles:**
  ```javascript
  // Inicialización básica
  map = new mt3d.Map({
      container: 'map',
      center: [139.767, 35.681], // Tokio
      zoom: 11,
      pitch: 60,
      maxPitch: 85,
      accessToken: 'TU_MAPBOX_TOKEN',
      secrets: { odpt: 'TU_ODPT_TOKEN' }
  });
  ```
  ```javascript
  // API de plugins para extender
  map.use(new mt3d.Plugin({
      name: 'mi-plugin',
      onAdd: function(map) {
          // Crear controles o layers personalizados
      },
      render: function(gl, matrix) {
          // Renderizado en cada frame
      }
  }));
  ```
  ```javascript
  // Integrar datos GTFS propios
  // El proyecto usa data-classes para modelar:
  // - Station, Railway, Train, TrainTimetable
  // - Bus, Flight, Airport, POI
  // Adaptar los JSONs de data/ a tu sistema de transporte
  ```
  ```html
  <!-- Estructura HTML mínima -->
  <div id="map"></div>
  <script src="mini-tokyo-3d.min.js"></script>
  <script>
    var map = new mt3d.Map({ container: 'map' });
  </script>
  ```
- **Cómo integrarlo en proyectos:**
  1. Clonar el repo y ejecutar `npm install && npm run build-all`
  2. Obtener tokens: Mapbox (mapas) + ODPT (datos de transporte)
  3. Configurar `accessToken` y `secrets` en el constructor `Map`
  4. Para datos propios: reemplazar JSONs en `/data/` con tu sistema de transporte
  5. Los data-classes (`src/data-classes/`) son reutilizables para cualquier sistema
  6. Personalizar con `assets/style.json` (estilo de Mapbox)
  7. El proyecto soporta GTFS nativamente — cargar feeds GTFS directamente
  8. Modos de visualización: underground (capas), playback (horarios), eco (rendimiento)
  9. Documentación completa en: https://minitokyo3d.com/docs/master/
- **Fecha de aprendizaje:** 2026-05-26
- **Stars:** 4077
- **Licencia:** MIT
