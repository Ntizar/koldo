# Análisis de Indicadores ESIOS para Mercado Eléctrico

**Fecha:** 2026-05-25
**Estado:** Investigación completada

## Resumen

La API ESIOS tiene **2018 indicadores**. De estos, **24 son funcionales** y relevantes para el análisis del mercado eléctrico español.

## Indicadores actuales en dashboard (9)

| ID | Nombre | Unidad |
|----|--------|--------|
| 1001 | Precio PVPC 2.0TD | €/MWh |
| 1293 | Demanda real | MW |
| 2052 | Demanda prevista | MW |
| 4 | Generación Nuclear | MW |
| 9 | Generación Ciclo Combinado | MW |
| 14 | Generación Solar FV | MW |
| 15 | Generación Solar Térmica | MW |
| 10006 | Generación libre de CO2 | % |
| 10355 | CO2 Asociado Generación T.Real | t/h |

## Indicadores nuevos funcionales (24)

### Interconexiones
- **10207** Saldo horario neto interconexión Francia (MW)
- **10208** Saldo horario neto interconexión Portugal (MW)
- **10209** Saldo horario neto interconexión Marruecos (MW)
- **10241** ATC Francia importación (MW)
- **10242** ATC Francia exportación (MW)

### Previsión renovable (clave para análisis semanal)
- **1777** Previsión eólica D+1 (MW)
- **1778** Previsión eólica H+3 (MW)
- **1779** Previsión fotovoltaica D+1 (MW)
- **1780** Previsión fotovoltaica H+3 (MW)
- **10358** Previsión eólica+fotovoltaica D+1 (MW)
- **10359** Previsión eólica+fotovoltaica H+3 (MW)
- **541** Previsión producción eólica peninsular

### Generación real completa
- **10351** Generación T.Real renovable (MW)
- **10352** Generación T.Real no renovable (MW)
- **10205** Generación medida solar (MW)

### Mercado y restricciones
- **602** Spot Diario Energía (MWh)
- **605** Spot Intradiario sesión 1 (MWh)
- **709** Coste restricciones técnicas (€)

### Capacidad
- **10232** Potencia disponible generación total (MW)
- **10300** Potencia instalada total (MW)
- **10301** Potencia instalada no renovable (MW)
- **10302** Potencia instalada renovable (MW)
- **10413** Potencia instalada autoconsumo (MW)

### Demanda
- **460** Previsión demanda eléctrica peninsular

## Indicadores NO funcionales (para esa fecha)

Algunos indicadores no devolvieron datos para 2026-05-24:
- 10195, 10360, 10361, 10403, 623, 10413 (datos no disponibles)
- Posiblemente son datos diarios/semanales o con retardo

## Fuentes externas complementarias

1. **Clima (AEMET / OpenWeatherMap)** → temperatura, viento, nubosidad
2. **Gas TTF** → precio gas natural europeo
3. **Carbón (Newcastle)** → precio combustible térmico
4. **CO2 EU ETS** → precio derechos de emisión
5. **RTE (Francia)** → demanda y precio en Francia
6. **REN (Portugal)** → demanda y precio en Portugal

## Prioridad de implementación

### P1: ESIOS funcionales
- Interconexiones Francia + Portugal
- Previsión eólica + fotovoltaica D+1
- Generación T.Real renovable + no renovable
- Coste restricciones técnicas
- Spot Diario Energía
- ATC Francia

### P2: ESIOS a probar
- Llenado hidráulico
- Mecanismo ajuste

### P3: Externas
- Gas TTF
- Clima
- CO2 EU ETS
