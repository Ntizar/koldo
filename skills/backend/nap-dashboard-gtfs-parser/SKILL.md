---
name: nap-dashboard-gtfs-parser
description: NAP Dashboard - Parser GTFS completo en browser con React, fflate, React Query y Leaflet. Dashboard de transportes publicos de Espana.
source: https://github.com/Ntizar/nap-dashboard
version: 1.0
updated: 2026-05-31
tags: [backend, GTFS, transport, parser]

---

# NAP Dashboard - GTFS Parser en Browser

## Descripcion

Dashboard interactivo del transporte publico de Espana. Explora el catalogo de 2,594 operadores, 10,000+ datasets GTFS/NeTEx y visor GTFS completo en el browser.

**Stack:** React 19 + TypeScript + Vite + React Query + Leaflet + Recharts + fflate
**URL:** https://ntizar.github.io/nap-dashboard/

## Arquitectura

```
React 19 + TypeScript
  |
  +-- BrowserRouter + React Query + Leaflet
  |
  +-- Pages (Lazy Loaded)
  |     +-- Overview -> KPIs + Charts (Recharts)
  |     +-- Datasets -> Tabla con filtros
  |     +-- Operadores -> Directorio ~2,594
  |     +-- Mapa -> Cobertura geografica
  |     +-- GTFS Viewer -> Rutas, paradas, horarios
  |
  +-- Data Layer
        +-- napClient.ts -> API proxy (/api/nap/*)
        +-- gtfsParser.ts -> fflate unzip + CSV parse
        +-- useNap.ts -> React Query hooks
        +-- types.ts -> Tipos reales de API NAP
```

## GTFS Parser Completo

Parser de archivos GTFS (14+ archivos CSV) ejecutado 100% en el browser:

**Archivos soportados:**
- Requeridos: stops.txt, routes.txt, trips.txt, stop_times.txt
- Opcionales: agency.txt, calendar.txt, calendar_dates.txt, shapes.txt, frequencies.txt, transfers.txt, feed_info.txt, fare_attributes.txt, fare_rules.txt, pathways.txt, levels.txt, attributions.txt

**Implementacion:**
```typescript
// Descompresion en memoria con fflate
import { unzipSync } from 'fflate'
const { data } = unzipSync(zipBuffer)

// Parseo CSV -> objetos tipados
// Calendar logic: calendar.txt + calendar_dates.txt -> isServiceActive(date)
// Headway calculation: frequencies.txt -> headwayLabel()
```

## Selector de Semana GTFS

Feature estrella: implementa la logica completa del estandar GTFS para saber que servicios operan en cada dia concreto:

- Navega entre dias de la semana con selector visual compacto
- Los viajes mostrados son SOLO los que realmente circulan ese dia
- Si un servicio esta cancelado -> banner rojo
- Si hay un servicio extraordinario -> banner verde
- "Proximas salidas" cuando es hoy, "Salidas del dia" cuando es otro dia

## API Proxy Pattern

```
Cliente -> /api/nap/* -> Vercel edge function -> API NAP
```

La ApiKey NUNCA esta en el bundle del cliente:
- Produccion (Vercel): edge function lee NAP_API_KEY del entorno
- Desarrollo local: proxy de Vite lee NAP_API_KEY de .env.local
- Sin variable: cliente envia key via header X-Api-Key (leida de localStorage)

## React Query Hooks

```typescript
const STALE = 5 * 60 * 1000 // 5 minutos

export function useDatasets() {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: getDatasets,
    staleTime: STALE,
  })
}
```

Lazy loading de paginas para rendimiento optimo.

## Tipos de Datos

Interfaces TypeScript reales de la API NAP:
- TipoTransporte, TipoFichero, Region, Organizacion
- Operador, FicheroDto, ConjuntoDatos
- GetListResponse, FilterBody

## Patrones Clave

1. **API key en localStorage:** Inyectada en headers en runtime (nunca en codigo)
2. **fflate para ZIP:** Descompresion en memoria (GTFS files)
3. **Calendar logic:** calendar.txt + calendar_dates.txt -> isServiceActive(date)
4. **Lazy loading:** Cada pagina se carga solo al navegar
5. **Vite middleware:** /api/nap/gtfs-proxy en dev
6. **React Query caching:** 5 min stale, 10 min gcTime

## Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en dev
npm run dev

# Build de produccion
npm run build

# Preview
npm run preview
```

## Pitfalls

- La API NAP requiere API key para acceso
- El parser GTFS puede ser lento con feeds grandes (>100MB)
- fflate descomprime en memoria -> cuidado con memoria en mobiles
- El proxy /api/nap/* requiere configuracion de Vercel en produccion

## Aplicaciones

- Exploracion de datos de transporte publico espanol
- Visualizacion de rutas GTFS en mapa interactivo
- Consulta de horarios por dia y ruta
- Analisis de cobertura de transporte
