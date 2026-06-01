# Multi-Agent AI Orchestration — Ntizar Mastermind v3

## Qué es
Framework open-source de orquestación multi-agente sobre Obsidian + OpenCode. 11 agentes especializados con pipeline obligatorio, memoria persistente con decaimiento Ebbinghaus, y asignación multi-modelo.

## Arquitectura de dos capas
| Capa | Ubicación | Contenido |
|------|-----------|-----------|
| Documental | `agents/` | Definiciones con wikilinks, misión, contexto (Obsidian) |
| Ejecutable | `.opencode/agents/` | Config YAML + instrucciones mínimas (OpenCode) |

## Los 11 Agentes
| # | Agente | Rol | Modelo sugerido |
|---|--------|-----|----------------|
| 00 | Orquestador | Clasifica, diseña flujos, delega | Claude Opus / GPT-4o |
| 01 | Clasificador | Evalúa complejidad, dominio, ambigüedad | Integrado en orchestrator |
| 02 | Explorador | Lee contexto sin modificar | Gemini 2.5 Pro |
| 03 | Planificador | Estrategia, pasos, criterios | Claude Opus / Sonnet |
| 04 | Spec Writer | Plan → spec ejecutable | Claude Opus / Sonnet |
| 05 | Implementador | Ejecuta la spec | Claude Opus / Sonnet |
| 06 | Revisor | Validación PASS/FAIL | Claude Sonnet / Flash |
| 07 | Crítico | Revisión adversarial | Claude Opus (omitir si degradar) |
| 08 | Sintetizador | Resultados legibles | Claude Haiku / Flash |
| 09 | Archivador | Aprendizajes con decay | Claude Haiku / Flash |
| 10 | Bibliotecario | Salud del sistema, índices | Claude Haiku / Flash |

## Sistema de Memoria Ebbinghaus
```
R(t) = a / (log(t+1))^b + c
```
| Tipo | 30 días | 90 días | 180 días | Uso |
|------|---------|---------|----------|-----|
| Permanente | 100% | 100% | 100% | Reglas del sistema |
| Lento | 71% | 58% | 48% | Patrones técnicos |
| Normal | 52% | 37% | 29% | Soluciones específicas |
| Rápido | 30% | 18% | 12% | Fixes puntuales |

## 12 Reglas del Sistema
1. Flujo completo obligatorio — ningún agente se salta
2. Sincronización multi-archivo — propagar cambios
3. Verificar integridad binaria — magic bytes
4. Deploy consciente de la plataforma
5. README actualizado con cada versión
6. El humano decide la arquitectura — IA propone
7. Clusters dinámicos — categorías crecen orgánicamente
8. Carga bajo demanda — relevancia + decaimiento
9. Capacidad mínima documentada
10. Crítico: omitir, nunca degradar
11. Verificar en vivo antes de entregar
12. Asignación de modelos es colaborativa

## Skills de Dominio
- **software-dev:** 6 fases obligatorias, matriz de decisiones
- **dashboard-dev:** Pipeline 6 fases, reaprendizaje dinámico
- **web-deploy:** Patrón single-source, checklists deploy
- **pwa-android:** Stack PWABuilder + Netlify

## Roadmap
- **v3.1:** MCP multi-agente, presupuesto tokens, handoffs streaming, cache resultados
- **v4.0:** Multi-usuario, marketplace skills, detección patrones cross-proyecto

## Referencias
- Repo: https://github.com/Ntizar/NtizarBrainMasterMind
- Brain Academy: https://ntizar-brain-learning.vercel.app
