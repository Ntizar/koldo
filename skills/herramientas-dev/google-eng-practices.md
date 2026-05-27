# Google Engineering Practices

- **URL**: https://github.com/google/eng-practices
- **Categoría**: Herramientas Dev / Mejores Prácticas
- **Stars**: 22,761
- **¿Qué es?**: Colección de documentación de ingeniería de Google que documenta prácticas generalizadas de desarrollo de software aplicables a todos los lenguajes y proyectos. Incluye guías completas sobre code review (revisión de código), redacción de descripciones de cambios (CLs), tamaño de cambios y manejo de emergencias. Licencia CC-By 3.0.
- **Documentos principales**:
  - **`review/index.md`** — Introducción al proceso de code review en Google: qué buscan los revisores (diseño, funcionalidad, complejidad, tests, naming, comentarios, estilo, documentación), cómo elegir mejores revisores y revisiones in-person/pair programming.
  - **`review/reviewer/standard.md`** — El estándar de code review: principio de "mejora continua del código" sobre la perfección. Principios: hechos técnicos > opiniones, el style guide es autoridad absoluta, los aspectos de diseño se basan en principios no gustos personales. Resuelve conflictos mediante consenso, luego escalada.
  - **`review/reviewer/looking-for.md`** — Qué buscar en una revisión: Design, Functionality, Complexity (evitar over-engineering), Tests (unit/integration/e2e), Naming, Comments (explican por qué, no qué), Style, Consistency, Documentation. Revisar cada línea, mirar el contexto, elogiar buenas prácticas.
  - **`review/reviewer/comments.md`** — Cómo escribir comentarios de review: ser amable, explicar el porqué, balancear guía con autonomía del autor, etiquetar severidad (Nit/Optional/FYI), aceptar explicaciones pero preferir código auto-explicativo.
  - **`review/reviewer/speed.md`** — Velocidad de code reviews: optimizar la velocidad del equipo, no del individuo. Máximo 1 día laboral para responder. Usar "LGTM con comentarios" para desbloquear autores en diferentes zonas horarias. Pedir splitting de CLs grandes.
  - **`review/reviewer/pushback.md`** — Manejar objeciones del desarrollador: considerar si tienen razón (están más cerca del código), explicar el porqué, no dejar "limpiezas para después" (es la forma más común de degradación del código), convertir protestas en apoyo mediante velocidad de respuesta.
  - **`review/reviewer/navigate.md`** — Cómo navegar una CL en revisión: 1) Ver vista general y descripción, 2) Examinar las partes principales primero (enviar feedback de diseño grande inmediatamente), 3) Revisar el resto en secuencia lógica (tests primero, luego código).
  - **`review/developer/cl-descriptions.md`** — Cómo escribir buenas descripciones de CL: primera línea como orden imperativo corto y descriptivo, cuerpo informativo con contexto y motivación, ejemplos de buenos/malos descriptions, uso de tags.
  - **`review/developer/small-cls.md`** — Por qué y cómo escribir CLs pequeñas: una CL = un cambio autocontenido (~100 líneas razonable, ~1000 excesivo). Estrategias de splitting: stacking, por archivos, horizontal (por capas), vertical (por features), grid. Separar refactorings de features. Mantener tests relacionados en la misma CL. No romper el build entre CLs apilados.
  - **`review/developer/handling-comments.md`** — Cómo manejar comentarios de revisores: no tomarlo personalmente, fixear el código (no solo explicar en el tool), pensar colaborativamente (no defensivamente), resolver conflictos mediante consenso.
  - **`review/emergencies.md`** — Cuándo es una emergencia real: bug crítico en producción, issue legal urgente, hole de seguridad. Cuándo NO es emergencia: deadlines soft, fin de semana, feature long-awaited.
- **Mejores prácticas clave**:
  - **Mejora continua > perfección**: Aprobar CLs que mejoran la salud del código aunque no sean perfectas. Usar "Nit:" para puntos de pulido no críticos.
  - **CLs pequeñas y autocontenidas**: Un cambio conceptual por CL. El reviewer puede rechazar CLs por ser demasiado grandes.
  - **Velocidad del equipo > velocidad individual**: Responder en máximo 1 día laboral. El feedback rápido reduce quejas más que la estrictitud.
  - **Descripciones de CL informativas**: Primera línea = resumen imperativo corto. Cuerpo = contexto, motivación, tradeoffs. Nunca "fix bug" o "add patch".
  - **Over-engineering es un riesgo**: Resolver el problema que se necesita AHORA, no el que podría necesitarse en el futuro.
  - **Revisar cada línea**: No asumir que código dentro de funciones/classes está bien solo por escaneo. Si no lo entiendes, pide aclaración.
  - **Tests son código que mantener**: Aceptar solo tests simples, correctos y útiles. No aceptar complejidad en tests.
  - **Comentarios explican el "por qué"**: No el "qué" (el código debe ser auto-explicativo). Los comentarios en el tool de review no ayudan a lectores futuros.
  - **Refactorings separados de features**: Mover/renombrar clases en CLs independientes de cambios funcionales.
  - **No dejar "limpiezas para después"**: La experiencia muestra que las limpiezas prometidas "luego" raramente ocurren. Es la principal causa de degradación del código.
  - **LGTM con comentarios**: Dar aprobación aunque queden comentarios menores para desbloquear flujo de trabajo, especialmente entre zonas horarias.
- **Checklists útiles**:
  - **Checklist del Revisor** (extraído de `looking-for.md`):
    - [ ] El código está bien diseñado e integrado en el sistema
    - [ ] La funcionalidad es correcta y buena para los usuarios
    - [ ] Los cambios de UI son sensatos y se ven bien
    - [ ] La programación paralela es segura (deadlocks/race conditions)
    - [ ] El código no es más complejo de lo necesario
    - [ ] No hay over-engineering ni features "por si acaso"
    - [ ] Hay tests unitarios apropiados y bien diseñados
    - [ ] Se usaron nombres claros para todo
    - [ ] Los comentarios explican el "por qué" no el "qué"
    - [ ] La documentación está actualizada
    - [ ] El código sigue los style guides
    - [ ] Se revisó cada línea de código asignado
    - [ ] Se miró el contexto del archivo completo
    - [ ] Se elogiaron las buenas prácticas encontradas
  - **Checklist del Autor** (extraído de `small-cls.md` y `cl-descriptions.md`):
    - [ ] La CL es un cambio autocontenido (no más de ~100-500 líneas)
    - [ ] La primera línea de la descripción es un resumen imperativo claro
    - [ ] El cuerpo incluye contexto, motivación y tradeoffs
    - [ ] Los tests están incluidos en la misma CL
    - [ ] El sistema funciona después de aplicar cada CL apilada
    - [ ] Los refactorings están en CLs separadas de los cambios funcionales
    - [ ] No se incluyen cambios mayores de estilo junto con cambios funcionales
    - [ ] Se eligió al reviewer más calificado para cada parte del código
  - **Checklist de Emergencia** (extraído de `emergencies.md`):
    - [ ] Es un cambio PEQUEÑO (no feature grande)
    - [ ] Resuelve un problema crítico en producción / legal / seguridad
    - [ ] No es un deadline soft ni una preferencia de timing
    - [ ] El reviewer prioriza velocidad y corrección sobre perfección
    - [ ] Se hará revisión exhaustiva posterior a la resolución
- **Cómo usarlo**:
  1. **Como desarrollador enviando código**: Antes de abrir un PR/MR, lee `review/developer/small-cls.md` y `review/developer/cl-descriptions.md`. Asegúrate de que tu cambio sea pequeño, autocontenido, con buena descripción y tests incluidos.
  2. **Como desarrollador recibiendo feedback**: Lee `review/developer/handling-comments.md` para manejar comentarios de forma constructiva y colaborativa, no defensiva.
  3. **Como revisor de código**: Lee la secuencia completa del lado del reviewer: `standard.md` → `looking-for.md` → `navigate.md` → `speed.md` → `comments.md` → `pushback.md`. Este orden te da los principios, qué buscar, cómo navegar, velocidad, cómo escribir comentarios y manejar objeciones.
  4. **Para establecer cultura de equipo**: Comparte el `standard.md` como base de acuerdos del equipo sobre qué constituye un cambio aceptable. Usa las etiquetas Nit/Optional/FYI para calibrar severidad de comentarios.
  5. **Para code review en PRs/MRs**: Aplica los criterios de `looking-for.md` (Design, Functionality, Complexity, Tests, Naming, Comments, Style, Documentation) como checklist en tu template de PR.
  6. **Para onboarding de nuevos desarrolladores**: Asigna la lectura completa del lado del developer (`cl-descriptions.md`, `small-cls.md`, `handling-comments.md`) como parte del onboarding.
  7. **Para medir madurez del equipo**: Si tu equipo tiene CLs grandes, descripciones pobres, o "limpiezas prometidas pero no hechas", estos documentos identifican exactamente los patrones problemáticos y sus soluciones.
- **Fecha de aprendizaje**: 2026-05-27
