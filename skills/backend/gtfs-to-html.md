# gtfs-to-html

- **URL:** https://github.com/BlinkTagInc/gtfs-to-html
- **Categoría:** Backend / Transporte / GTFS
- **¿Qué hace?:** Genera horarios de transporte público (timetables) legibles para humanos en formato HTML, PDF o CSV directamente desde datos GTFS. Utiliza SQLite para almacenar los datos importados del GTFS, templates Pug para renderizado, y Puppeteer para conversión a PDF. Soporta mapas interactivos con MapLibre GL, datos GTFS-Realtime (alertas, trip updates, vehicle positions), múltiples orientaciones de tabla (vertical, horizontal, hourly), y es accesible WCAG 2.0. Es una herramienta de Node.js (ESM, TypeScript) que requiere Node >= 22.
- **Casos de uso:**
  - Generar páginas web de horarios para agencias de transporte público
  - Exportar horarios en PDF para impresión
  - Exportar horarios en CSV para procesamiento adicional
  - Servir horarios dinámicamente vía servidor Express
  - Integrar mapas de rutas con datos en tiempo real
  - Crear vistas de horarios previsualizadas antes de cambios de calendario
  - Usar como biblioteca programática en aplicaciones Node.js
  - Dockerizar el proceso de generación de horarios
- **Snippets útiles:**

  **Configuración mínima (config.json):**
  ```json
  {
    "agencies": [
      {
        "agencyKey": "miagencia",
        "url": "https://ejemplo.com/gtfs.zip"
      }
    ],
    "outputFormat": "html",
    "showMap": true,
    "verbose": true
  }
  ```

  **Uso programático (Node.js ESM):**
  ```javascript
  import gtfsToHtml from 'gtfs-to-html';

  const config = {
    agencies: [{
      agencyKey: 'marintransit',
      url: 'https://marintransit.gov/data/google_transit.zip'
    }],
    outputFormat: 'html',
    showMap: true,
    sqlitePath: '/tmp/gtfs.sqlite'
  };

  const outputPath = await gtfsToHtml(config);
  console.log('Timetables generated at:', outputPath);
  ```

  **Uso desde CLI:**
  ```bash
  # Instalar globalmente
  npm install -g gtfs-to-html

  # Ejecutar con config.json en el directorio actual
  gtfs-to-html --configPath ./config.json

  # Saltar la importación GTFS (usar DB existente)
  gtfs-to-html --configPath ./config.json --skipImport

  # Solo mostrar stops con timepoint
  gtfs-to-html --configPath ./config.json --showOnlyTimepoint
  ```

  **Configuración avanzada con GTFS-Realtime:**
  ```json
  {
    "agencies": [
      {
        "agencyKey": "marintransit",
        "url": "https://marintransit.gov/data/google_transit.zip",
        "realtimeAlerts": { "url": "https://api.mjt.gov/alerts" },
        "realtimeTripUpdates": { "url": "https://api.mjt.gov/tripupdates" },
        "realtimeVehiclePositions": { "url": "https://api.mjt.gov/vehiclepositions" }
      }
    ],
    "outputFormat": "pdf",
    "showMap": true,
    "templatePath": "views/custom",
    "groupTimetablesIntoPages": true,
    "menuType": "radio",
    "dateFormat": "MMM D, YYYY",
    "timeFormat": "h:mma",
    "zipOutput": true
  }
  ```

  **Servidor Express para servir horarios dinámicamente:**
  ```javascript
  // src/app/index.ts - servidor Express integrado
  // Uso: node ./dist/app --configPath ./config.json
  // Sirve en http://localhost:3000/ (overview) y /timetables/:id
  ```

  **Docker:**
  ```dockerfile
  FROM node:22
  RUN apt update && apt install -y chromium
  COPY config.json ./
  ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
  ENV NODE_OPTIONS=--max-old-space-size=8192
  RUN npm install -g gtfs-to-html
  CMD ["gtfs-to-html"]
  ```

- **Cómo integrarlo en proyectos:**
  1. **Instalación:** `npm install gtfs-to-html` o `npm install -g gtfs-to-html` para uso CLI.
  2. **Configurar GTFS:** Descarga o referencia un feed GTFS (zip) y crea un `config.json` con la lista de agencias.
  3. **Importar datos:** La primera ejecución importa automáticamente el GTFS a una base de datos SQLite. Usa `skipImport: true` en ejecuciones posteriores.
  4. **Personalizar templates:** Copia `views/default` a un directorio propio y modifica los templates Pug. Configura `templatePath` en el config.
  5. **Generar salida:** Ejecuta `gtfs-to-html --configPath ./config.json`. Los archivos se generan en `./html/<agencyKey>/`.
  6. **Programáticamente:** Importa `gtfsToHtml` como función asíncrona y pasa un objeto `Config`. Retorna la ruta de salida.
  7. **Modo servidor:** Usa `node ./dist/app --configPath ./config.json` para un servidor Express que sirve horarios dinámicamente.
  8. **Docker:** Usa el Dockerfile en `docker/` para containerizar el proceso.
  9. **Desarrollo:** `pnpm install && pnpm run build` (compila TypeScript y vendoriza librerías de navegador).
  10. **Estructura de salida:** Los timetables se organizan en carpetas por fecha (`<start_date>-<end_date>/`) con `index.html` como overview.
- **Fecha de aprendizaje:** 2026-05-26
