# Análisis de Indicadores ESIOS — Estado Final

**Fecha:** 2026-05-25  
**Estado:** ✅ Implementado y verificado

## Resumen

Se han añadido **25+ nuevos indicadores ESIOS** al dashboard, pasando de 9 a más de 30 indicadores clave. Todo verificado con datos reales de 2026-05-24.

## Indicadores implementados

### Pricing (5)
- PVPC (1001) — Precio horario
- Spot Diario Energía (602) — Precio spot diario
- Spot Intradiario sesión 1 (605) — Precio intradiario
- Coste restricciones técnicas (709) — Restricciones
- Mecanismo ajuste RD-L 10/2022 (10403)

### Demanda (3)
- Demanda real/prevista (1293)
- Demanda prevista (2052)
- Demanda medida disc. horaria (10267)

### Generación programada (4)
- Nuclear (4), Ciclo combinado (9), Solar FV (14), Solar térmica (15)

### Generación real — Telemedida (3)
- Generación T.Real renovable (10351)
- Generación T.Real no renovable (10352)
- Generación medida solar (10205)

### Interconexiones (5)
- Saldo neto Francia (10207), Portugal (10208), Marruecos (10209)
- ATC Francia import (10241), export (10242)

### Previsión D+1/H+3 (7)
- Previsión demanda diaria (460)
- Previsión eólica peninsular (541)
- Previsión eólica D+1 (1777), H+3 (1778)
- Previsión fotovoltaica D+1 (1779), H+3 (1780)
- Previsión renovable D+1 (10358), H+3 (10359)

### CO2 (3)
- Generación libre CO2 % (10006)
- CO2 t/h (10355)
- CO2 Asociado Gen Real SNP (10356)

### Capacidad (5)
- Potencia disponible total (10232)
- Potencia instalada total (10300), no renovable (10301), renovable (10302), autoconsumo (10413)

### Almacenamiento y Balance (5)
- Índice llenado hidráulico (623)
- Energía balance subir (10323), bajar (10324)
- Necesidades cubiertas balance RR (10251)
- Energías mFRR (10250), Regulación secundaria (10252)

## Verificación

- ✅ Todos los endpoints funcionan con datos reales
- ✅ Summary endpoint devuelve 24h de datos combinados
- ✅ Frontend con 10 tabs renderiza correctamente
- ✅ Server arranca en puerto 3500
- ✅ Token ESIOS detectado correctamente

## Pendiente

- [ ] Integrar APIs externas (OpenWeatherMap para clima, TTF para gas)
- [ ] Generación de PDF diario con gráficos
- [ ] Envío automático por Telegram
- [ ] Cron job diario
- [ ] Análisis predictivo avanzado (Monte Carlo mejorado)
