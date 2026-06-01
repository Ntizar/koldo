# Índice de indicadores ESIOS — Referencia rápida

Fuente: `data/esios-indicator-index.json` (2018 indicadores en total)
Generado: 2026-05-26

## Reglas obligatorias

1. **Seleccionar SIEMPRE por ID exacto**, no por nombre parcial.
2. **Revisar unit_type, unit_label, unit_confidence** antes de usar un indicador.
3. **MW = potencia**, **MWh = energía**. Para convertir MW a MWh hay que integrar por duración del intervalo.
4. **MWh/periodo ≠ MW** — son energía asignada por periodo horario.
5. Si `unit_confidence` es `medium`, `low` o `unknown`, validar contra la API viva antes de automatizar.

## IDs críticos verificados

| Clave | ID | Unidad | Tipo | Nota |
|---|---:|---|---|---|
| hidraulica_medida | 10035 | MWh | energy_mwh | Generación medida |
| carbon_medida | 10036 | MWh | energy_mwh | Generación medida |
| eolica_medida | 10037 | MWh | energy_mwh | Generación medida |
| fuelgas_medida | 10038 | MWh | energy_mwh | Generación medida |
| cogeneracion_medida | 10039 | MWh | energy_mwh | Generación medida |
| residuos_no_ren_medida | 10040 | MWh | energy_mwh | Generación medida |
| **otras_renovable_medida** | **10041** | **MWh** | **energy_mwh** | **⚠️ NO 10042** |
| generacion_medida_total | 10043 | MWh | energy_mwh | Total medida |
| gen_renovable_real | 10351 | MW | power_mw | Tiempo real |
| gen_no_renovable_real | 10352 | MW | power_mw | Tiempo real |
| gen_solar_medida | 10205 | MW | power_mw | Tiempo real |
| nuclear_prog | 4 | MWh/periodo | energy_mwh_per_period | PBF |
| ciclo_combinado_prog | 9 | MWh/periodo | energy_mwh_per_period | PBF (1 valor/día) |
| solar_fv_prog | 14 | MWh/periodo | energy_mwh_per_period | PBF |
| hidraulica_prog | 1 | MWh/periodo | energy_mwh_per_period | PBF |
| eolica_prog | 12 | MWh/periodo | energy_mwh_per_period | PBF |
| precios (PVPC) | 1001 | €/MWh | price_eur_mwh | PVPC |
| demanda_real | 1293 | MW | power_mw | Tiempo real |
| demanda_prevista | 2052 | MW | power_mw | Previsión |
| co2_libre | 10006 | MW | power_mw | NO es porcentaje |
| co2_libre_pct | 10033 | % | percentage | Porcentaje |
| co2_real | 10355 | tCO2/h | emissions_tco2_per_h | Ratio |
| intercon_francia | 10207 | MWh | energy_mwh | Saldo neto |
| intercon_portugal | 10208 | MWh | energy_mwh | Saldo neto |
| intercon_marruecos | 10209 | MWh | energy_mwh | Saldo neto |
| prevision_eolica_d1 | 1777 | MW | power_mw | Previsión |
| prevision_foto_d1 | 1779 | MW | power_mw | Previsión |
| potencia_disponible | 10232 | MW | power_mw | Horizonte año móvil |
| llenado_hidraulico | 623 | MWh | energy_mwh | Índice semanal |

## Taxonomía de unidades

| unit_type | Unidad | Count | Uso |
|---|---|---:|---|
| power_mw | MW | 450 | Potencia instantánea/media/capacidad |
| energy_mwh | MWh | 37 | Energía/consumo medido/acumulado |
| energy_mwh_per_period | MWh/periodo | 883 | Energía asignada/programada por periodo |
| price_eur_mwh | €/MWh | 465 | Precio unitario de energía |
| money_eur | € | 65 | Importe/coste/renta total |
| percentage | % | 28 | Porcentaje/cuota/ratio |
| emissions_tco2 | tCO2 | 13 | Toneladas CO2 acumuladas |
| emissions_tco2_per_h | tCO2/h | 2 | Tasa horaria de emisiones |
| count | número | 17 | Conteo de clientes/sesiones |
| unknown | desconocida | 58 | Fuente no permite inferir unidad |

## Referencia completa

El archivo completo con los 2018 indicadores está en:
- `data/esios-indicator-index.json` (JSON, para consumo automático)
- `data/esios-indicator-index.md` (Markdown, para lectura humana)