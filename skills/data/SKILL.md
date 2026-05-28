---
name: datos-gob-watch
description: "datos-gob-watch: Radar semanal de datasets interesantes de datos.gob.es con ranking heurístico y deploy en GitHub Pages."
version: "1.0.0"
category: data
---

# Datos Gob Watch

Radar semanal de datasets interesantes publicados en `datos.gob.es`.

## Arquitectura

```
datos.gob.es API
  -> scripts/fetch-weekly.mjs (fetch + normalización + ranking)
  -> data/latest.json (payload generado)
  -> index.html (frontend estático con estilo Ntizar)
  -> GitHub Pages (deploy)
```

## Flujo de Ejecución

1. **Fetch**: consultar datasets modificados en últimos 7 días
2. **Normalizar**: metadatos y formatos de distribución
3. **Ranking**: heurísticas de reutilización
4. **Generar**: `data/latest.json` + `index.html`
5. **Deploy**: GitHub Actions → GitHub Pages

## API Endpoints

```
Base: https://datos.gob.es/apidata/catalog/dataset.json

Modificados (ventana semanal):
https://datos.gob.es/apidata/catalog/dataset/modified/begin/{YYYY-MM-DDTHH:mmZ}/end/{YYYY-MM-DDTHH:mmZ}.json?_sort=-modified&_pageSize=50&_page=0
```

## Heurísticas de Ranking

Suben más en ranking los datasets que tienen:
- Formatos reutilizables: JSON, CSV, XML, GEOJSON, XLSX
- Temáticas con potencial de producto
- Varias distribuciones
- Metadatos razonablemente completos

## Stack

| Capa | Tecnología |
|------|-----------|
| Fetch/build | Node.js |
| UI | HTML plano + ntizar.css |
| Deploy | GitHub Pages |
| Automation | GitHub Actions |

## Archivos Clave

| Archivo | Rol |
|---------|-----|
| `scripts/fetch-weekly.mjs` | Fetch + normalización + ranking |
| `data/latest.json` | Payload generado del digest |
| `index.html` | Frontend estático |
| `ntizar.css` | Capa visual Ntizar |
| `.github/workflows/weekly.yml` | Refresh semanal + deploy |

## URL

https://ntizar.github.io/datos-gob-watch/

## Aplicación práctica

Reutilizar patrón para cualquier:
- Monitorización semanal de APIs de datos abiertos
- Digest automático de datasets
- Deploy estático con GitHub Actions
- Ranking heurístico de contenido
