---
name: skill-audit-pattern
description: "Auditoría sistemática del ecosistema de skills — detecta duplicados, project-readmes, CLI wrappers, skills sin tags, y genera plan de limpieza. Para mantener el ecosistema limpio al escalar."
version: "1.0.0"
author: Koldo
tags: [audit, maintenance, skills, quality, cleanup]
---

# Skill Audit Pattern

Auditoría sistemática del ecosistema de skills de Hermes Agent. Detecta problemas de calidad, ruido y redundancia.

## Cuándo usarlo

- Cada mes como mantenimiento rutinario
- Antes de añadir más de 10 skills nuevos
- Cuando el usuario reporta que el agente va lento o confunde skills
- Cuando el sistema crece a más de 300 skills

## Pasos de la auditoría

### 1. Inventario

```bash
# Contar total de skills
find /hermes-home/skills -name "SKILL.md" | wc -l

# Tamaño por skill
find /hermes-home/skills -name "SKILL.md" -exec sh -c 'wc -c "$1" | cut -d" " -f1 | tr -d "\n"; echo " $1"' _ {} \; | sort -rn | head -20

# Skills sin frontmatter
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  if ! head -1 "$1" | grep -q "^---"; then
    echo "MISSING FRONTMATTER: $1"
  fi
' _ {} \;

# Skills sin versión
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  if head -1 "$1" | grep -q "^---"; then
    if ! head -10 "$1" | grep -q "^version:"; then
      echo "NO VERSION: $1"
    fi
  fi
' _ {} \;

# Skills sin descripción
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  if head -1 "$1" | grep -q "^---"; then
    if ! head -10 "$1" | grep -q "^description:"; then
      echo "NO DESCRIPTION: $1"
    fi
  fi
' _ _ {} \;

# Skills sin tags
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  if head -1 "$1" | grep -q "^---"; then
    if ! head -10 "$1" | grep -q "^tags:"; then
      echo "NO TAGS: $1"
    fi
  fi
' _ {} \;
```

### 2. Detectar Project-Readmes

Skills que son READMEs de proyectos específicos en lugar de patrones reutilizables:

```bash
# Buscar skills con rutas de proyecto hardcodeadas
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  if grep -q "/persist/nan-dashboard/\|/persist/nap-dashboard/\|/root/workspace/esios-work\|/root/workspace/nan-dashboard\|Ntizar/SistemaElectricoFuturo\|Ntizar/Madrid3Pixel\|esios-work/\|nan-dashboard/\|nap-dashboard/" "$1"; then
    echo "PROJECT PATH: $1"
  fi
' _ {} \;
```

**Criterio:** Si un skill contiene más de 5 rutas absolutas de proyecto o más de 10 referencias a repos específicos de Ntizar → es un project-readme, no un skill.

### 3. Detectar CLI Wrappers

Skills que solo documentan cómo usar una CLI con curl:

```bash
# Buscar skills con muchos comandos curl y poco contenido de patrón
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  curl_count=$(grep -c "curl " "$1" 2>/dev/null || echo 0)
  size=$(wc -c < "$1")
  if [ "$curl_count" -gt 3 ] && [ "$size" -lt 5000 ]; then
    echo "CLI WRAPPER ($curl_count curl, $size bytes): $1"
  fi
' _ {} \;
```

**Criterio:** Si un skill tiene más de 3 comandos `curl` y menos de 5KB → es un CLI wrapper, no un skill.

### 4. Detectar Duplicados

```bash
# Duplicados de nombre
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  name=$(grep "^name:" "$1" | head -1 | sed "s/name: *//;s/^\"//;s/\"$//")
  echo "$name|$1"
' _ {} \; | cut -d'|' -f1 | sort | uniq -d

# Duplicados de descripción
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  desc=$(grep "^description:" "$1" | head -1 | sed "s/description: *//;s/^\"//;s/\"$//")
  echo "$desc|$1"
' _ {} \; | cut -d'|' -f1 | sort | uniq -d
```

### 5. Detectar Skills Demasiado Grandes

```bash
# Skills >30KB (deberían usar refs pattern)
find /hermes-home/skills -name "SKILL.md" -exec sh -c '
  size=$(wc -c < "$1")
  if [ "$size" -gt 30000 ]; then
    echo "TOO LARGE ($size bytes): $1"
  fi
' _ {} \;
```

## Criterios de Limpieza

### Eliminar directamente (sin migrar):
- **Project-readmes** → mover contenido a `notes/` si es útil
- **CLI wrappers** → eliminar, el agente ya sabe usar curl
- **Skills duplicados** → eliminar el menos completo
- **Skills sin tags** → añadir tags o eliminar si no aportan

### Fusionar:
- **Skills que cubren lo mismo** → unir en uno solo
- **Skills de un mismo dominio fragmentados** → consolidar

### Refactorizar:
- **Skills >30KB** → usar patrón de refs (SKILL.md corto + references/)
- **Skills con rutas hardcodeadas** → reemplazar por variables genéricas

## Criterio Fundamental (CORREGIDO 2026-06-01)

Un skill debe ser un **patrón reutilizable con valor educativo**. No debe ser la documentación de un proyecto específico.

**Lección clave de la auditoría 2026-06-01:** No todos los project-readmes son malos. Los que contienen patrones de diseño, frontend, WebGPU, Web Workers, etc. tienen valor educativo y se deben mantener. Solo los project-readmes "puros" (READMEs de proyecto sin valor como patrón) se eliminan.

### Filtro de 5 preguntas
1. **¿Es un patrón reutilizable?** → Si es específico de un proyecto → ❌ NO es skill
2. **¿Aporta conocimiento educativo?** → Si solo documenta un CLI tool → ❌ NO es skill
3. **¿Es compacto?** → Si es >5KB → ⚠️ usar refs pattern (SKILL.md corto + references/)
4. **¿Tiene tags?** → Mínimo 3 tags descriptivos
5. **¿Es necesario?** → Si ya existe un skill similar → ⚠️ fusionar

## Reporte de Auditoría

Después de cada auditoría, generar un informe con:

```
# Auditoría de Skills — [fecha]

## Resumen
- Total skills: X
- Eliminados: Y
- Fusionados: Z
- Refactorizados: W

## Hallazgos
### 🔴 Críticos
- [Lista de project-readmes eliminados]

### ⚠️ Advertencias
- [Lista de skills sin tags]
- [Lista de skills duplicados]

### ✅ Positivos
- [Skills de alta calidad]

## Estado Final
- Skills restantes: X
- Tamaño total: Y bytes
- Skills sin tags: Z
```

## Frecuencia Recomendada

- **Mensual:** Auditoría completa (todos los pasos)
- **Semanal:** Solo detectar project-readmes nuevos y CLI wrappers
- **Antes de añadir:** Verificar que el nuevo skill no es duplicado ni project-readme

## Criterios de Eliminación Detallados

Para los criterios detallados de qué eliminar, fusionar o refactorizar, ver `references/elimination-criteria.md`.

## Regla de Oro

> Un skill debe ser un **patrón reutilizable con valor educativo**, no la documentación de un proyecto específico. Si el contenido solo sirve para un proyecto concreto, no es un skill — es una nota.
