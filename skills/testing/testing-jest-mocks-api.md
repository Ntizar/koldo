---
name: testing-jest-mocks-api
description: "Tests con Jest para servicios que consumen APIs externas. Mocks de HTTP, fixtures de datos, degradación de indicadores opcionales."
version: 1.0.0
author: Ntizar
---

# Testing con Jest + Mocks de API

Patrón para testear servicios que dependen de APIs HTTP externas usando Jest con mocks.

## Mock del cliente HTTP

```javascript
// tests/summary.test.js
const { beforeEach, describe, expect, it } = require('@jest/globals');

const mockFetchIndicator = jest.fn();

jest.mock('../src/infra/clients/esios.client', () => ({
  fetchIndicator: (...args) => mockFetchIndicator(...args),
}));

const { buildSummary } = require('../src/domains/energy/summary.service');
```

## Fixtures de datos

```javascript
const SAMPLE_DATETIME = '2026-05-25T00:00:00+02:00';

function indicatorValue(value) {
  return {
    indicator: {
      values: [{ datetime: SAMPLE_DATETIME, value }],
    },
  };
}

function createBaseResponses() {
  return new Map([
    [1001, indicatorValue(52.4)],        // Precio
    [1293, indicatorValue(30000)],       // Demanda
    [2039, indicatorValue(72000)],       // Nuclear (raw, /10 = 7200 MW)
    [2038, indicatorValue(25600)],       // Eólica (raw, /10 = 2560 MW)
    [10355, indicatorValue(0.18)],       // CO2 (directo)
    // ... más indicadores
  ]);
}
```

## Test de integración del servicio

```javascript
describe('buildSummary', () => {
  beforeEach(() => {
    const responses = createBaseResponses();
    mockFetchIndicator.mockReset();
    mockFetchIndicator.mockImplementation(async (indicatorId) => {
      return responses.get(indicatorId) || { indicator: { values: [] } };
    });
  });

  it('should compute hourly prices correctly', async () => {
    const summary = await buildSummary('2026-05-25', 'fake-token');
    expect(summary.valores.find(v => v.hora === '00').precio).toBe(52.4);
    expect(summary.resumen.precio_medio).toBe(52);
  });

  it('should handle optional indicator failures gracefully', async () => {
    mockFetchIndicator.mockImplementation(async (indicatorId) => {
      if ([2198, 2199, 2065, 2066].includes(indicatorId)) {
        throw new Error('unavailable');
      }
      return createBaseResponses().get(indicatorId) || { indicator: { values: [] } };
    });

    const summary = await buildSummary('2026-05-25', 'fake-token');
    expect(summary.valores).toHaveLength(24);
    expect(summary.valores[0].bateriaEntrega).toBeNull();
    expect(summary.resumen.bateria_entrega_total).toBeNull();
  });
});
```

## Test de timezone

```javascript
describe('Madrid timezone', () => {
  it('should map UTC datetimes to Madrid hours on DST start', () => {
    expect(madridDateHourFromDatetime('2026-03-29T00:00:00Z'))
      .toEqual({ dateStr: '2026-03-29', hora: '01' });
  });

  it('should collapse repeated DST end hours', () => {
    const values = normalizeHourlyValues([
      { datetime: '2026-10-25T00:00:00Z', value: 10 },
      { datetime: '2026-10-25T01:00:00Z', value: 20 },
    ], '2026-10-25');
    expect(values).toHaveLength(24);
    expect(values.find(r => r.hora === '02')?.valor).toBe(20);
  });
});
```

## Smoke tests de API

```javascript
describe('API smoke tests', () => {
  const app = require('../server');
  const request = require('supertest');

  it('GET /healthz returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET / returns HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('ESIOS');
  });
});
```

## Buenas prácticas

1. **Mock del cliente HTTP** — no llamar a la API real en tests unitarios
2. **Mapa de respuestas** — fixture centralizado, fácil de extender
3. **Valores crudos** — testear que la conversión de unidades funciona
4. **Degradación graceful** — probar que indicadores opcionales fallan sin romper
5. **DST edge cases** — probar cambios de hora de verano e invierno
6. **Smoke tests** — verificar que las rutas HTTP responden

## Pitfalls

- ❌ Tests que llaman a API real → lentos, frágiles, dependen de token
- ❌ No testear valores convertidos → la conversión puede estar mal
- ❌ Mock demasiado simple → no captura errores reales (null, undefined)
- ❌ No testear DST → en marzo/octubre el dashboard muestra datos desplazados

## Referencia

- Código real: `tests/time.test.js`, `tests/summary.test.js`, `tests/api.test.js`
- Skills relacionadas: frontend-fechas-timezone-local, conversion-unidades-api-externa