# Calculadora IRPF España — IRPFdibujitos

## Qué es
Web interactiva para calcular IRPF y salario neto en España (2012-2026). Divulgativa, open source, auditable.

## Stack
- **Motor:** Python (parámetros normativos, cálculo fiscal)
- **Web:** HTML + CSS + JS vanilla, GitHub Pages
- **Datos:** JSON precalculados
- **Tests:** 47 tests pytest

## Estructura
```
IRPFdibujitos/
├── python/
│   ├── irpfdibujitos/     # Motor fiscal
│   ├── generar_datos.py   # Exporta JSON para web
│   ├── generar_excel.py   # Reproduce Excel auditoría
│   ├── tests/             # pytest (47 tests)
│   └── original/          # Script original de David
├── data/                  # JSON precalculados
├── web/                   # HTML+CSS+JS vanilla
├── docs/                  # Manual divulgativo
└── .github/               # CI + issue templates
```

## Motor Fiscal
Modela:
- IRPF estatal + autonómico de referencia
- Cotizaciones SS régimen general
- Reducción art.20, gastos fijos art.19, MEI, cuota solidaridad, deducción SMI
- Límite 43% art.85.3 RIRPF

NO modela (abierto a PR):
- Hijos, ascendientes, discapacidad
- Diferencias por CCAA
- Retribuciones en especie
- Pagadores múltiples
- Aportaciones a planes de pensiones

## Funcionalidades Web
1. Introducir bruto anual (0-1,000,000€)
2. Elegir año normativo (2012-2026)
3. Ver neto, IRPF, cotización, coste empresa
4. Gráfica de progresividad en frío (tipo efectivo 2012-2026)
5. Sección "Lo que la inflación te ha robado"

## Concepto Clave: Progresividad en Frío
Los tramos del IRPF no se actualizan con IPC. Cuando te suben el sueldo "lo que la inflación", te metes en un tramo más alto → pagas más IRPF → te quedas igual o peor. Impuesto silencioso sin responsable político.

## Licencias
- **Código:** MIT
- **Contenido (manual, datos, JSON):** CC0 1.0

## Cómo Reproducir
```bash
cd python
pip install -r requirements.txt
python generar_datos.py
pytest
cd ../web
python -m http.server 8000
```

## Referencias
- Web: https://ntizar.github.io/IRPFdibujitos/
- Repo: https://github.com/Ntizar/IRPFdibujitos
