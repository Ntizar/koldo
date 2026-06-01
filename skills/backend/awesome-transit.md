---
name: awesome-transport-datos
description: "Patrón de integración de datos de transporte público — GTFS (horarios estáticos) + GBFS (bicicletas tiempo real) + GTFS-RT (tiempo real). Fuentes, herramientas y pipelines para apps de movilidad."
version: 2.0.0
author: Ntizar + Koldo
---

# Datos de Transporte Público — GTFS + GBFS

Guía práctica para trabajar con datos de transporte público: feeds GTFS (horarios), GBFS (bicicletas compartidas) y GTFS-RT (tiempo real). Basado en el ecosistema awesome-transit (1.8K⭐).

## Arquitectura de Datos

```
Fuentes de datos                    Procesamiento                  Aplicación
─────────────────                   ─────────────                  ──────────
GTFS (horarios estáticos)     →   gtfs-to-html    →  Horarios web
.zip con rutas, paradas,       →   GTFS Validator →  Datos limpios
horarios, shapes               →   OpenTripPlanner →  Routing

GBFS (bicis tiempo real)      →   Nodo.js cache   →  Dashboard mapa
.json en tiempo real           →   Leaflet         →  Estaciones cercanas
(station_status,               →   Haversine       →  Alertas ocupación
 station_information)

GTFS-RT (tiempo real)          →   OneBusAway      →  Llegadas en vivo
Alertas, posiciones,           →   transit.land    →  Notificaciones
actualizaciones
```

## GBFS — Bicicletas Compartidas (como BiciMAD)

```javascript
// Obtener estaciones con datos en tiempo real
const GBFS_BASE = 'https://madrid.publicbikesystem.net/customer/gbfs/v2/en';

const [statusResp, infoResp] = await Promise.all([
  fetch(`${GBFS_BASE}/station_status`),
  fetch(`${GBFS_BASE}/station_information`),
]);
const status = await statusResp.json();
const info = await infoResp.json();

// Merge por station_id
const stations = status.data.stations.map(s => {
  const meta = info.data.stations.find(i => i.station_id === s.station_id);
  return {
    id: s.station_id,
    name: meta?.name || 'Unknown',
    lat: meta?.lat,
    lon: meta?.lon,
    bikes: s.num_bikes_available,
    docks: s.num_docks_available,
    status: s.status,
  };
});
```

## GTFS — Horarios Estáticos

```bash
# Convertir GTFS a horarios web con gtfs-to-html
npm install -g gtfs-to-html
gtfs-to-html --gtfsPath ./madrid-gtfs.zip --outputDir ./horarios

# Validar GTFS con el validador oficial
docker run -v $(pwd):/gtfs gtfs-validator /gtfs/madrid-gtfs.zip
```

## GTFS-RT — Tiempo Real (autobuses, metro)

```javascript
// GTFS-RT usa Protocol Buffers — parsear con gtfs-realtime-bindings
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const resp = await fetch('https://api.emtmadrid.es/gtfs-realtime/vehicle_positions');
const buffer = await resp.arrayBuffer();
const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

feed.entity.forEach(entity => {
  if (entity.vehicle) {
    console.log(`🚌 ${entity.vehicle.trip.route_id}: lat=${entity.vehicle.position.latitude}, lon=${entity.vehicle.position.longitude}`);
  }
});
```

## Herramientas del ecosistema

| Herramienta | ⭐ | Qué hace |
|-------------|---|----------|
| gtfs-to-html | 225 | Convierte GTFS a horarios web accesibles |
| static-GTFS-manager | 159 | GUI browser para crear/editar GTFS |
| OpenTripPlanner | — | Routing multimodal (bus+bici+metro) |
| OneBusAway | — | Llegadas GTFS-RT en tiempo real |
| transit.land | — | API de feeds GTFS a nivel mundial |
| OMT Router | 11 | Routing OSM 100% client-side (A*, Dijkstra) |

## Patrón: Estación más cercana (Haversine)

```javascript
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radio Tierra en metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function findNearbyStations(stations, lat, lon, radiusMeters = 500, minBikes = 1) {
  return stations
    .filter(s => s.lat && s.lon && s.bikes >= minBikes && s.status === 'IN_SERVICE')
    .map(s => ({ ...s, dist: haversine(lat, lon, s.lat, s.lon) }))
    .filter(s => s.dist <= radiusMeters)
    .sort((a, b) => a.dist - b.dist);
}
```

## Buenas prácticas

1. **GBFS cache 2 min** — el estándar GBFS recomienda no consultar más de cada 2 min
2. **Merge por station_id** — GBFS separa datos estáticos (info) de dinámicos (status)
3. **GTFS Validator primero** — siempre validar el feed antes de procesar
4. **Routing 100% client-side** — OMT Router evita backend para rutas simples
5. **Colores de estado** — verde (>3 bicis), naranja (1-3), rojo (0), gris (inactiva)

## Pitfalls

- ❌ Cache > 2 min en GBFS → datos desactualizados en dashboard
- ❌ No mapear station_id correctamente → datos mezclados entre estaciones
- ❌ GTFS corrupto → gtfs-to-html falla sin mensaje claro
- ❌ Haversine sin validar lat/lon → NaN en distancias

## Referencia

- awesome-transit: https://github.com/MobilityData/awesome-transit (1.8K⭐)
- GBFS spec: https://gbfs.org
- GTFS spec: https://gtfs.org
- Skills relacionadas: frontend-config-mapa-colores, cache-multicapa-memoria-disco