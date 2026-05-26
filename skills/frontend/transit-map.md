---
name: transit-map
---

# Transit Map - Simulaciones de Mapas de Transporte

- **URL:** https://github.com/vasile/transit-map
- **Categoría:** Frontend / Visualización / Transporte
- **¿Qué hace?:**
  Anima vehículos (trenes, autobuses, etc.) sobre un mapa de Google Maps interpolando sus posiciones a lo largo de rutas usando datos de horarios de transporte público. Soporta dos enfoques de datos: **GTFS** (estándar de transporte público) y una **topología personalizada** basada en edges GeoJSON. Los vehículos se mueven en tiempo real (simulado con aceleración temporal) entre estaciones, calculando velocidad y posición basándose en horarios de llegada/salida.

- **Casos de uso:**
  - Visualización en tiempo real de flotas de transporte público (trenes, buses) sobre un mapa
  - Simulaciones de redes de transporte con datos GTFS reales (ej: SBB Suiza, CFR Rumanía, TL Lausana)
  - Paneles de control para centros de operación de transporte
  - Integración como iframe embebido en sitios web externos
  - Seguimiento individual de vehículos específicos con panel de timetable

- **Patrones útiles:**

  **1. Motor de simulación con pub/sub (Event Bus):**
  Patrón de suscripción/notificación para desacoplar componentes:
  ```javascript
  var listener_helpers = (function(){
      var listeners = {};

      function notify(type) {
          $.each(listeners[type], function(i, fn){ fn(); });
      }
      function subscribe(type, fn) {
          if (typeof listeners[type] === 'undefined') listeners[type] = [];
          listeners[type].push(fn);
      }
      return { notify: notify, subscribe: subscribe };
  })();

  // Uso:
  listener_helpers.notify('map_init');
  listener_helpers.subscribe('minute_changed', vehicle_helpers.load);
  ```

  **2. Interpolación de posición a lo largo de una ruta (GeoJSON polilínea):**
  Calcula posición exacta usando Google Maps Geometry Library:
  ```javascript
  function positionDataGet(route, dAC, is_detailed) {
      var dC = 0;
      for (var i=1; i<route.points.length; i++) {
          var pA = route.points[i-1];
          var pB = route.points[i];
          var d12 = google.maps.geometry.spherical.computeDistanceBetween(pA, pB);
          if ((dC + d12) > dAC) {
              var data = {
                  position: google.maps.geometry.spherical.interpolate(
                      pA, pB, (dAC - dC)/d12
                  )
              };
              if (is_detailed) {
                  data.heading = google.maps.geometry.spherical.computeHeading(pA, pB);
              }
              return data;
          }
          dC += d12;
      }
      return null;
  }
  ```

  **3. Motor de tiempo acelerado para simulación:**
  Controla el paso del tiempo simulado con multiplicador configurable:
  ```javascript
  function timeIncrement() {
      ts_now += (timer_refresh / 1000) * seconds_multiply;
      // seconds_multiply = 1, 5, 10, o 100 (x1, x5, x10, x100)
      setTimeout(timeIncrement, timer_refresh); // 100ms refresh
  }
  // Conversión hms -> timestamp:
  function getHMS2TS(hms) {
      var parts = hms.split(':');
      return ts_midnight + hours*3600 + minutes*60 + seconds;
  }
  ```

  **4. Clase Vehicle con renderizado asíncrono recursivo:**
  Cada vehículo calcula su posición y se auto-programa para el siguiente frame:
  ```javascript
  Vehicle.prototype.render = function() {
      var that = this;
      function animate() {
          var ts = timer.getTS();
          // Buscar en qué tramo está el vehículo
          for (var i=0; i<that.arrS.length; i++) {
              if (ts < that.arrS[i]) {
                  // Calcular porcentaje de progreso entre estaciones
                  route_percent = (ts - that.depS[i]) / (that.arrS[i] - that.depS[i]);
                  d_AC = routeLength * route_percent;
                  var position = linesPool.positionGet(route_id, route_percent);
                  that.marker.setPosition(position);
                  // Auto-schedule próximo frame
                  setTimeout(animate, 100);
                  break;
              }
          }
      }
      animate();
  };
  ```

  **5. Cálculo dinámico de velocidad del vehículo:**
  Basado en distancia y tiempo entre estaciones:
  ```javascript
  var trackLength = routeLength * (that.shape_percent[i+1] - that.shape_percent[i]) / 100;
  var speed = trackLength * 0.001 * 3600 / (that.arrS[i] - that.depS[i]);
  // Velocidad en km/h = metros * 0.001 * 3600 / segundos
  ```

  **6. Iconos de vehículos con orientación (heading) y zoom adaptativo:**
  ```javascript
  function getVehicleIcon(zoom, type, heading) {
      var icon_width = base_zoom_width * Math.pow(2, parseInt(zoom - base_zoom_zoom, 10));
      var icon = {
          url: base_url + '/' + type + '/' + heading + '.png',
          size: new google.maps.Size(original_width, original_width),
          scaledSize: new google.maps.Size(icon_width, icon_width),
          anchor: new google.maps.Point(icon_width/2, icon_width/2)
      };
      return icon;
  }
  ```

  **7. Configuración con override por query string:**
  Los parámetros de config.js se pueden sobrescribir vía URL:
  ```javascript
  var url_parts = window.location.href.split('?');
  if (url_parts.length === 2) {
      var qs_groups = url_parts[1].split('&');
      $.each(qs_groups, function(index, qs_group){
          var qs_parts = qs_group.split('=');
          params[qs_parts[0]] = decodeURIComponent(qs_parts[1]);
      });
  }
  // Ejemplo: ?center.x=8.7&center.y=47.18&zoom.start=11&time_multiply=10
  ```

  **8. Soporte dual GTFS vs Topología personalizada:**
  ```javascript
  // GTFS: usa shape_id y shape_percent del stops.txt
  if (that.source === 'gtfs') {
      route_id = that.shape_id;
      trackLength = routeLength * (that.shape_percent[i+1] - that.shape_percent[i]) / 100;
  }
  // Topología: usa edges del GeoJSON personalizado
  if (that.source === 'custom') {
      route_id = that.edges[i+1];
      trackLength = routeLength;
  }
  ```

  **9. Panel de timetable con resaltado de paradas pasadas:**
  ```javascript
  $('#vehicle_timetable tbody tr').each(function(){
      var row_dep_sec = $(this).attr('data-dep-sec');
      if (row_dep_sec < ts) {
          $(this).addClass('passed'); // CSS: color gris para paradas ya pasadas
      }
  });
  ```

  **10. Seguimiento de vehículo con map.bindTo():**
  ```javascript
  // Google Maps API: vincula el centro del mapa a la posición del marker
  map.bindTo('center', that.marker, 'position');
  // Se deshace al arrastrar el mapa
  google.maps.event.addListener(map, 'dragstart', function(){
      that.marker.set('follow', 'no');
      map.unbind('center');
  });
  ```

- **Cómo integrarlo en proyectos:**
  1. **Requisitos mínimos:** Servidor web (Apache/Nginx) + navegador moderno + Google Maps API Key (v3.20+ con librerías geometry,places).
  2. **Datos requeridos:**
     - Para GTFS: `shapes.json` (FeatureCollection de rutas), `stops.json` (FeatureCollection de paradas), y un endpoint API `/api/getTrips/[hhmm]` que devuelva la lista de vehículos activos a esa hora.
     - Para topología custom: `edges.geojson` (aristas del grafo de red), `stations.geojson` (estaciones), y el mismo endpoint API de trips.
  3. **Configuración:** Editar `static/js/config.js` con coordenadas del centro, zoom, paths de API y GeoJSON. Todos los parámetros pueden sobrescribirse vía query string.
  4. **Formato de datos de vehículos (trips.json):**
     ```json
     {
       "id": "ICE_3_8503000_0900",
       "name": "ICE 3",
       "type": "ice",
       "sts": ["8500090", "8500010", "8503000"],
       "deps": ["07:41:00", "08:07:00"],
       "arrs": ["07:47:00", "09:00:00"],
       "edges": ["", "197,404,584", "-584,-404,..."],
       "service_type": "ice"
     }
     ```
     Los edges usan IDs separados por coma (prefijo `-` indica dirección inversa).
  5. **Modo iframe:** Usar `?view_mode=iframe` para eliminar el panel lateral y embeber el mapa limpio.
  6. **Aceleración temporal:** `?time_multiply=100` hace que la simulación avance 100x más rápido.
  7. **Limitaciones a considerar:** Depende de Google Maps API (ya no soportada para nuevas claves), usa Fusion Tables (deprecado), jQuery 1.9.0 (obsoleto), y no tiene soporte para mapas offline. Para proyectos nuevos, se recomienda migrar a Leaflet/Mapbox GL con datos GTFS via `gtfs-viz`.
  8. **Proyecto complementario:** [GTFS-viz](https://github.com/vasile/GTFS-viz) convierte archivos GTFS estándar (stops.txt, shapes.txt, trips.txt, stop_times.txt) al formato GeoJSON y JSON que necesita transit-map.

- **Fecha de aprendizaje:** 2026-05-26
