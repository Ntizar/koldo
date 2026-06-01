# Mapeo de IDs correctos para scripts ESIOS

Generado: 2026-05-27
Fuentes: esios-reference.json + esios-indicator-index.md

## Script esios-telegram.js — IDs y unidades

Este es el mapeo exacto usado en scripts de resumen ESIOS (telegram, daily report, etc.).

| Variable | ID | Nombre ESIOS | Unidad | Conversión |
|---|---|---|---|---|
| precios | 1001 | Término de facturación energía PVPC | €/MWh | Ninguna |
| demanda | 1293 | Demanda real | MW | /10 |
| eolica | 10037 | Gen medida Eólica | MWh | /1000 → MW |
| solar | 10205 | Gen medida solar | MW | /10 (fallback genérico) |
| hidrica | 10035 | Gen medida Hidráulica | MWh | /1000 → MW |
| carbon | 10036 | Gen medida Carbón | MWh | /1000 → MW |
| cogeneracion | 10039 | Gen medida cogeneración | MWh | /1000 → MW |
| otrasRen | 10041 | Gen medida otras renovables | MWh | /1000 → MW |
| genTotal | 10043 | Generación medida total | MWh | /1000 → MW |
| genRenReal | 10351 | Gen T.Real renovable | MW | /10 |
| genNoRenReal | 10352 | Gen T.Real no renovable | MW | /10 |
| co2Libre | 10006 | Generación libre CO2 | MW | /10 |
| co2Ratio | 10355 | CO2 asociado gen real | tCO2/MWh | Ninguna |
| demandaPrev | 2052 | Demanda prevista nacional | MW | /10 |
| eolicaPrev | 1777 | Previsión D+1 eólica | MW | Ninguna |
| solarPrev | 1779 | Previsión D+1 fotovoltaica | MW | Ninguna |
| renovablePrev | 10358 | Previsión D+1 renovable total | MW | Ninguna |
| interFR | 10207 | Saldo interconexión Francia | MW | DIRECTO |
| interPT | 10208 | Saldo interconexión Portugal | MW | DIRECTO |

> ⚠️ **CORRECCIÓN 2026-05-28**: IDs 10207/10208 son MW DIRECTOS, NO MWh. La versión anterior de este archivo decía `/1000 → MW` — eso era incorrecto. Verificar siempre contra `esios-units.js` (DIRECT_IDS incluye 10207, 10208, 10209).

## IDs que ya NO existen o son incorrectos

| ID incorrecto | Por qué está mal | ID correcto |
|---|---|---|
| 460 | previsionDemanda — no existe en índice | 2052 |
| 541 | previsionEolica — no existe en índice | 1777 |
| 14 | solar FV PBF programada (no D+1) | 1779 |
| 10350 | demanda medida gen SNP (no previsión) | 10358 |
| 10014 | P48 saldo Portugal (no telemedida) | 10208 |
| 10015 | P48 saldo Francia (no telemedida) | 10207 |

## IDs de interconexión completa

| ID | Nombre | Unidad |
|---|---|---|
| 10207 | Saldo interconexión Francia (telemedida) | MW (DIRECTO) |
| 10208 | Saldo interconexión Portugal (telemedida) | MW (DIRECTO) |
| 10209 | Saldo interconexión Marruecos (telemedida) | MW (DIRECTO) |
| 10044 | Gen medida Saldo Portugal | MWh |
| 10045 | Gen medida Saldo Francia | MWh |
| 10046 | Gen medida Saldo Marruecos | MWh |
| 10047 | Gen medida Saldo Andorra | MWh |
| 10048 | Saldo total interconexiones medidas | MWh |
| 10049 | Total Gen + Interconexiones medidas | MWh |

> ⚠️ **Distinción clave**: IDs 10207-10209 son **telemedida** (MW directo). IDs 10044-10049 son **medida por tecnología** (MWh, requieren /1000). No confundirlos.

## Regla de conversión universal

```
MWh/periodo → MW: dividir entre 1000
MWh (por hora) → MW: dividir entre 1000
MW → MW: usar directo
€/MWh → €/MWh: usar directo
tCO2/MWh → tCO2/MWh: usar directo (NO tCO2/h — es ratio)
% → %: usar directo
```

### ⚠️ Regla de verificación antes de confiar en una tabla de conversiones

NUNCA confiar en una tabla de IDs sin verificarla contra `esios-units.js` (fuente de verdad) o `esios-units-verification.md` (verificación empírica). La tabla de este archivo se desactualizó con IDs 10207/10208 — el error pasó desapercibido porque la tabla interna y la referencia externa contradecían entre sí.

**Patrón de verificación**: siempre cruzar la tabla de conversiones con `DIRECT_IDS`, `DIV10_IDS` y el rango `2000-2099` en `esios-units.js`. Si hay discrepancia, la tabla es incorrecta.