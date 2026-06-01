---
name: auditoria-simulacion-energetica
description: "Auditoría técnica de simuladores/sistemas de modelado eléctrico — validación cuantitativa, calidad de dato, rigor del motor, alineamiento producto-pregunta."
version: 1.0.0
author: Ntizar
tags: [auditoria, simulacion, electricidad, modelo, validacion, calidad-dato, energia]
related_skills: [requesting-code-review, dogfood, forecast-montecarlo-escenarios]
---

# Auditoría de sistemas de simulación eléctrica

Patrón sistemático para auditar herramientas de modelado del sector eléctrico español. Combina revisión del núcleo de simulación, verificación de datos de referencia, calidad de la interfaz y alineamiento estratégico del producto.

## Cuándo usarlo

- El usuario pide una revisión técnica de un simulador/modelo eléctrico
- Se quiere evaluar la credibilidad cuantitativa de una herramienta de análisis energético
- Hay que diagnosticar por qué un modelo no da resultados defendibles
- Se necesita un plan de mejora priorizado para un proyecto de simulación

## No es para

- Code review estándar (usar `requesting-code-review`)
- QA funcional de web apps (usar `dogfood`)
- Análisis de datos históricos de REE/ESIOS

## Metodología de auditoría en 4 capas

### Capa 1 — Núcleo de simulación (¿el motor hace lo que promete?)

Cada hallazgo se clasifica con esta taxonomía:

| ID | Severidad | Significado |
|----|-----------|-------------|
| 🔴 S1-S9 | Crítico | El motor no hace lo que la interfaz afirma. Datos de salida no defendibles. |
| 🟠 S10+ | Alto | Submodelo incompleto o con supuestos no documentados que sesgan resultados. |
| 🟡 | Medio | Precisión/calibración mejorable. No bloquea pero limita confianza. |

**Patrones críticos a buscar (SIEMPRE):**

1. **¿El precio se forma por orden de mérito real o por heurística?**
   - Señal de alarma: fórmulas con constantes mágicas sin justificación (44, 100, 28, 24...)
   - Un despacho real ordena tecnologías por SRMC → precio = coste de la última unidad necesaria
   - Si hay `if/else` con números sin fuente, es heurístico

2. **¿La generación renovable está calibrada?**
   - Factores de capacidad (CF) deben venir de datos reales REE/OMIE
   - La serie horaria debe normalizarse al CF objetivo, no ser "lo que salga"
   - Offshore y onshore deben modelarse por separado (distinto régimen de viento)

3. **¿El generador de números aleatorios es correcto?**
   - `Math.sin`-based PRNG es conocido por no ser uniforme ni tener periodo largo
   - Sustituir por mulberry32, xorshift128 o PCG (deterministas, bien distribuidos)

4. **¿Hay balance energético verificable?**
   - `generación = demanda + vertidos + exportación - importación` debe cumplirse cada hora
   - Sin esto, un bug de despacho pasa desapercibido

**Submodelos a verificar:**

| Componente | Qué mirar |
|------------|-----------|
| Hidráulica | ¿Tiene presupuesto energético anual (embalse) o puede generar infinito? |
| Nuclear | ¿Baseload plano o modela paradas de recarga? El calendario ENRESA debe ser exacto |
| Almacenamiento | ¿Degrada? ¿Estado persistente entre años? ¿Eficiencia dependiente de C-rate? |
| Demanda sectorial | ¿Una única fuente de verdad o hay reescalados que distorsionan? |
| Clima | ¿AR(1) real con persistencia interanual o se reinicia cada año? |
| Política | Tope ibérico, CfD, peajes: ¿fórmulas reales o estimaciones? CfD debe ser de doble cara |

### Capa 2 — Calidad del dato (¿los números de entrada son correctos?)

Buscar sistemáticamente:

1. **Calendario nuclear ENRESA oficial** (protocolo 2019):
   | Reactor | Cierre |
   |---------|--------|
   | Almaraz I | nov 2027 |
   | Almaraz II | oct 2028 |
   | Ascó I | oct 2030 |
   | Cofrentes | nov 2030 |
   | Ascó II | sep 2032 |
   | Vandellós II | feb 2035 |
   | Trillo | may 2035 |

   Verificar que código Y texto de interfaz coinciden con esto.

2. **Objetivos PNIEC 2030** actualizados (2024):
   - Solar: 81 GW
   - Eólica: 62 GW terrestre + 3 GW offshore
   - Almacenamiento: 22 GW
   - Renovable en generación: 81%
   - Emisiones máx: 20 Mt
   - Demanda: ~295 TWh

3. **Factores de capacidad REE 2025** (derivar de generación/potencia real):
   - Solar: ~0.24 (52.5 TWh / 24.7 GW / 8760h)
   - Eólica terrestre: ~0.20 (55.6 TWh / 31.6 GW / 8760h)
   - Nuclear: ~0.85
   - Hidráulica: ~0.25

4. **Incoherencias comunes:**
   - "Datos en tiempo real" que son estáticos
   - Clamps que contradicen parámetros de escenario (p.ej. clamp 500 con `precioEscasez: 600`)
   - Etiquetas engañosas ("Coste del sistema" cuando es facturación pool)

### Capa 3 — Reproducibilidad y rigor metodológico

Checklist:

- [ ] ¿PRNG determinista y documentado?
- [ ] ¿Hay test de calibración contra año de referencia (2025)?
- [ ] ¿Las constantes tienen fuente/cita o son magic numbers?
- [ ] ¿Se puede ejecutar headless en Node para tests?
- [ ] ¿Los meses se calculan con calendario real o bloques de 30.5 días?
- [ ] ¿Hay verificación de balance energético?

### Capa 4 — Producto y foco (¿responde a la pregunta original?)

Si el proyecto nació con una pregunta concreta (p.ej. "¿qué pasa con el cierre nuclear?"):

1. ¿Los escenarios permiten aislar esa variable (ceteris paribus) o cambian todo a la vez?
2. ¿Hay una vista comparativa directa (escenario A vs B lado a lado)?
3. ¿Hay diagnóstico automático que interprete los resultados?
4. ¿La legislación tiene enlaces a BOE/fuentes reales o es texto plano?
5. ¿Las métricas de seguridad de suministro (ENS, LOLE, horas déficit) son KPIs de primera línea?

## Estructura del informe de auditoría

```
# Auditoría: [Nombre del proyecto]

## 0. Resumen ejecutivo
- Pregunta original del proyecto
- Hallazgo principal (1 párrafo)
- Nota global (X/10)

## 1. Diagnóstico de calidad de simulación
- S1-S9 (críticos) con:
  - Código problemático
  - Consecuencia
  - Corrección propuesta
- S10+ (altos) mismo formato

## 2. Errores de dato verificables
- D1, D2, D3... con fuentes de contraste

## 3. Problemas de reproducibilidad y rigor
- R1, R2, R3...

## 4. Arquitectura, código y mantenibilidad
- A1, A2, A3...

## 5. Foco del producto
- ¿Responde a la pregunta original?

## 6. Plan de acción priorizado
- Fase 0: Sinceridad y foco (1-2 días)
- Fase 1: Núcleo correcto (1-2 semanas)
- Fase 2: Calibración y validación (1 semana)
- Fase 3: Producto enfocado (1 semana)
- Fase 4: Ingeniería (continuo)

## 7. Tabla resumen de hallazgos
| ID | Severidad | Área | Problema | Acción |

## 8. Conclusión
```

## Pitfalls

- ❌ **No confundir interfaz bonita con motor correcto** — una UI cuidada puede ocultar un modelo heurístico
- ❌ **No asumir que 17 escenarios = producto completo** — pueden diluir el foco si no son comparables
- ❌ **No asumir que los datos de referencia son correctos** — verificar calendario ENRESA, PNIEC, CF contra fuentes oficiales
- ❌ **No etiquetar como "tiempo real" datos que son estáticos** — daña la credibilidad del proyecto
- ❌ **No recomendar reescribir de cero** — la mayoría de proyectos tienen base modular buena; el problema es el núcleo
