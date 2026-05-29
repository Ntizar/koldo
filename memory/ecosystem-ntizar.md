# Ntizar Ecosystem — System Memory

## Ecosistema Ntizar (actualizado 2026-05-29)

### Design System Unificador
- **Ntizar Aurora v5.1 "Constellation"**: CSS-only, .nz namespace, blue+orange
- CDN: jsdelivr (cdn.jsdelivr.net/gh/Ntizar/Ntizar-Aurora@master/)
- 6 skins: aurora, sunset, midnight, ocean, citrus, contrast
- 11 packs modulares (core + themes + data + charts + maps + viz + motion + forms + ui + patterns + next)
- Agent-ready: AGENTS.md + INDEX.md (~20KB contexto)

### Proyectos Principales
| Repo | Stars | Stack | Descripción |
|------|-------|-------|-------------|
| solmad | 3★ | Vite+React+TS+Leaflet | Buscador terrazas con sol Madrid |
| NtizarBrainMasterMind | 2★ | Obsidian+OpenCode | Multi-agent v3, Ebbinghaus decay |
| IRPFdibujitos | 1★ | Python+vanilla | Calculadora IRPF 2012-2026 |
| OrbitMixer | 1★ | Vanilla+Vercel SF | Comparador satelital Sentinel-2 |
| SistemaElectricoFuturo | 1★ | Vanilla+Aurora v4 | Simulador eléctrico 2026-2035 |
| esios-dashboard | 0★ | Node+Express+Chart.js | Dashboard energético ESIOS |
| Ntizar-Aurora | 0★ | CSS puro | Design system v5.1 |

### Patrones de Arquitectura
1. **Vanilla-first**: HTML/CSS/JS vanilla como base
2. **Dominios separados**: domains/infra/shared
3. **Cache multicapa**: Memory + Disk con TTL y métricas
4. **APIs con fallback**: Siempre graceful degradation
5. **Aurora visual**: Design system unificador
6. **Deploy variado**: Vercel, GitHub Pages, Docker, NaN.builders

### Patrones de Datos
1. Conversión de unidades centralizada (esios-units.js)
2. Timezone Europe/Madrid nativo
3. Datos precalculados JSON para web estática
4. Manejo DST (23h/25h days)

### Patrones de Licenciamiento
1. Código: MIT (universal)
2. Contenido: CC0 1.0 (IRPFdibujitos)
3. Dual licensing: Código + Contenido separado
