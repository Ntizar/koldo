# PVPC — 5 Zonas Geográficas (Verificado 2026-05-28)

## El problema

El indicador **PVPC 2.0TD (ID 1001)** con `time_trunc=hour` devuelve **120 valores** (24h × 5 geo_ids).
La mayoría de scripts y el propio dashboard NO filtran por zona, lo que produce datos incorrectos.

## Mapeo de zonas

| geo_id | Zona | Típicamente igual a Península |
|--------|------|:---:|
| 8741 | **Península** | — (referencia) |
| 8742 | Canarias | Mayoría horas sí |
| 8743 | Baleares | Mayoría horas sí |
| 8744 | Ceuta | Mayoría horas sí |
| 8745 | Melilla | Mayoría horas sí |

## Precios hora a hora (2026-05-27) — Península vs otras zonas

| Hora | Península (8741) | Canarias (8742) | Baleares (8743) | Ceuta (8744) | Melilla (8745) | ¿Iguales? |
|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| 00 | 168.20 | 168.20 | 168.20 | 168.20 | 168.20 | ✅ |
| 01 | 152.61 | 152.61 | 152.61 | 152.61 | 152.61 | ✅ |
| 02 | 139.52 | 139.52 | 139.52 | 139.52 | 139.52 | ✅ |
| 03 | 135.21 | 135.21 | 135.21 | 135.21 | 135.21 | ✅ |
| 04 | 134.24 | 134.24 | 134.24 | 134.24 | 134.24 | ✅ |
| 05 | 138.32 | 138.32 | 138.32 | 138.32 | 138.32 | ✅ |
| 06 | 161.22 | 161.22 | 161.22 | 161.22 | 161.22 | ✅ |
| 07 | 166.62 | 166.62 | 166.62 | 166.62 | 166.62 | ✅ |
| 08 | 166.15 | 166.15 | 166.15 | 166.15 | 166.15 | ✅ |
| 09 | 88.17 | 88.17 | 88.17 | 88.17 | 88.17 | ✅ |
| 10 | **119.62** | **50.50** | **50.50** | **50.50** | **50.50** | ❌ |
| 11 | 114.02 | 114.02 | 114.02 | 114.02 | 114.02 | ✅ |
| 12 | 114.63 | 114.63 | 114.63 | 114.63 | 114.63 | ✅ |
| 13 | 114.05 | 114.05 | 114.05 | 114.05 | 114.05 | ✅ |
| 14 | **45.77** | **45.77** | **114.90** | **114.90** | **114.90** | ❌ |
| 15 | 48.43 | 48.43 | 48.43 | 48.43 | 48.43 | ✅ |
| 16 | 49.73 | 49.73 | 49.73 | 49.73 | 49.73 | ✅ |
| 17 | 52.85 | 52.85 | 52.85 | 52.85 | 52.85 | ✅ |
| 18 | **146.50** | **77.26** | **77.26** | **77.26** | **77.26** | ❌ |
| 19 | 193.03 | 193.03 | 193.03 | 193.03 | 193.03 | ✅ |
| 20 | 260.44 | 260.44 | 260.44 | 260.44 | 260.44 | ✅ |
| 21 | 287.89 | 287.89 | 287.89 | 287.89 | 287.89 | ✅ |
| 22 | **212.65** | **282.51** | **282.51** | **282.51** | **282.51** | ❌ |
| 23 | 193.06 | 193.06 | 193.06 | 193.06 | 193.06 | ✅ |

**Horas con divergencia:** 10, 14, 18, 22. En esas horas, el precio de Península difiere significativamente de las islas y ciudades autónomas.

## Impacto en scripts

### Script `esios-telegram.js` (sin filtrar)
Procesa los 120 valores sin filtrar, promediando todas las zonas. El impacto es pequeño en la media (~0.01 €/MWh de desviación en este día), pero los valores pico/valle pueden ser de zonas no peninsulares.

### Dashboard (`normalizeHourlyValues`)
Itera sobre los 120 valores y sobrescribe cada hora con el último geo_id procesado. Como la API ordena por geo_id ascendente (8741→8745), **Melilla (8745) gana siempre**. Esto causa:
- Hora 10: muestra 50.50 en vez de 119.62
- Hora 14: muestra 114.90 en vez de 45.77
- Hora 18: muestra 77.26 en vez de 146.50
- Hora 22: muestra 282.51 en vez de 212.65

### Solución para ambos
Filtrar explícitamente por `geo_id=8741` (Península):

```javascript
const filtered = data.indicator.values.filter(v => v.geo_id === 8741);
// filtered tiene 24 valores, solo Península
```