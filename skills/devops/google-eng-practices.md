# Google Engineering Practices

- **URL**: https://github.com/google/eng-practices
- **Stars**: 22,559
- **Lenguaje**: Documentation
- **Categoría**: DevOps / Ingeniería de Software
- **¿Qué hace?**: Documenta las prácticas de ingeniería generalizadas de Google que cubren todos los lenguajes y proyectos. Contiene dos guías fundamentales de code review: (1) **The Code Reviewer's Guide** — guía detallada para quienes revisan código, cubriendo estándares, qué buscar, velocidad, cómo escribir comentarios y manejar objeciones; (2) **The CL Author's Guide** — guía para desarrolladores que envían cambios (CLs), cubriendo descripciones de CL, escritura de CLs pequeños y manejo de comentarios de revisión. Incluye también una guía de emergencias para CLs que deben aprobarse rápidamente. Todo licenciado bajo CC-BY 3.0.
- **Casos de uso**:
  - Establecer un proceso de code review profesional en equipos de desarrollo
  - Capacitar nuevos desarrolladores en buenas prácticas de revisión de código
  - Definir estándares de calidad de código para equipos distribuidos
  - Implementar cultura de mejora continua de código (code health)
  - Gestionar revisiones de código en equipos multi-zona horaria
  - Crear guías de code review personalizadas basadas en las de Google
  - Formar code reviewers y developers en metodología de revisión
  - Resolver conflictos en code reviews con principios definidos
  - Gestionar CLs de emergencia (seguridad, bugs críticos en producción)
- **Patrones útiles**:
  - **Estándar de Code Review**: Aprobar un CL una vez que definitivamente mejora la code health del sistema, incluso si no es perfecto. Buscar *mejora continua*, no perfección.
  - **CLs Pequeños y Autocontenidos**: Un CL debe ser un cambio autocontenido que aborda *una sola cosa*. ~100 líneas es razonable, ~1000 es demasiado. Mejor pequeño que grande.
  - **Revisión por capas (Stacking)**: Escribir un CL pequeño, enviarlo para revisión, y empezar inmediatamente el siguiente CL *basado* en el primero. Esto evita bloqueos.
  - **Splitting Horizontal**: Crear código compartido/stubs que aislen cambios entre capas del stack (proto definitions, API stubs, service interfaces).
  - **Splitting Vertical**: Descomponer funcionalidad en características full-stack independientes que pueden implementarse en paralelo.
  - **Separar Refactorings**: Los refactorings grandes deben ir en CLs separados de los cambios de funcionalidad o bug fixes.
  - **Tests en el mismo CL**: Incluir código de prueba relacionado en el mismo CL que el código de producción (excepto en emergencias).
  - **No romper el build**: Si varios CLs dependen entre sí, asegurar que el sistema siga funcionando después de cada submission.
  - **Descripciones de CL**: Primera línea = resumen corto en imperativo + línea en blanco + cuerpo informativo con contexto y motivación.
  - **Velocidad de respuesta máxima 1 día**: El tiempo máximo para responder a una review es un día de negocio. Las respuestas rápidas individuales importan más que la velocidad total del proceso.
  - **LGTM con comentarios**: Dar LGTM/Approval aunque queden comentarios no críticos (typos, imports, sugerencias menores) para desbloquear al developer.
  - **Etiquetar severidad de comentarios**: Usar prefijos como `Nit:`, `Optional (or Consider):`, `FYI:` para diferenciar cambios requeridos de sugerencias.
  - **Revisar TODA la línea de código**: Revisar cada línea del código asignado, no escanear clases o funciones asumiendo que están bien.
  - **Buscar over-engineering**: Ser vigilante contra código más genérico de lo necesario o funcionalidad no requerida actualmente.
  - **Contexto del sistema**: Evaluar si el CL mejora la code health del sistema completo, no solo el código aislado.
- **Snippets reutilizables**:
  - **Plantilla de descripción de CL (Google Style)**:
    ```
    [Componente]: Acción imperativa corta de lo que hace el CL.

    Explicar el problema que se resuelve y por qué este es el mejor enfoque.
    Incluir contexto, números de bug, benchmarks, links a design docs.
    Mencionar any shortcomings del enfoque si los hay.
    ```
    Ejemplo funcional:
    ```
    RPC: Remove size limit on RPC server message freelist.

    Servers like FizzBuzz have very large messages and would benefit from reuse.
    Make the freelist larger, and add a goroutine that frees the freelist entries
    slowly over time, so that idle servers eventually release all freelist entries.
    ```
  - **Estructura de CLs pequeños apilados (Stacking)**:
    ```
    CL 1: [Base] Add shared proto definition for new API
    CL 2: [API] Add new endpoint using the proto (depends on CL 1)
    CL 3: [Service] Implement service logic (depends on CL 2)
    CL 4: [Client] Add client-side integration (depends on CL 3)
    ```
  - **Matriz de Splitting Horizontal & Vertical**:
    ```
    | Layer   | Feature: A          | Feature: B          |
    | ------- | ------------------- | ------------------- |
    | Client  | Add button A        | Add button B        |
    | API     | Add endpoint A      | Add endpoint B      |
    | Service | Implement A         | Share logic with A  |
    | Model   | Add proto A         | Add proto B         |
    ```
  - **Etiquetas de severidad para comentarios de review**:
    ```
    Nit: Cambios menores de estilo, no críticos pero recomendados.
    Optional (or Consider): Sugerencia que puede ser buena idea, no obligatoria.
    FYI: Informativo, no se espera acción en este CL, útil para futuro.
    [CRÍTICO]: Cambio requerido que bloquea la aprobación del CL.
    ```
  - **Checklist de Code Review (para reviewers)**:
    ```
    □ Design: ¿El código está bien diseñado y es apropiado para el sistema?
    □ Functionality: ¿Se comporta como se pretendía? ¿Es bueno para los usuarios?
    □ Complejidad: ¿Se puede simplificar? ¿Otro developer lo entenderá?
    □ Tests: ¿Tiene tests correctos y bien diseñados?
    □ Naming: ¿Nombres claros para variables, clases, métodos?
    □ Comments: ¿Comentarios claros? ¿Explican WHY, no WHAT?
    □ Style: ¿Sigue las style guides?
    □ Documentation: ¿Se actualizó la documentación relevante?
    □ Every line: ¿Revisé CADA línea del código asignado?
    □ Contexto: ¿El CL mejora la code health del sistema completo?
    □ Good things: ¿Comenté lo que está bien?
    ```
  - **Guía de respuesta rápida a reviews (cross-timezone)**:
    ```
    1. Si no puedes revisar completamente ahora → responde rápido indicando cuándo lo harás
    2. Si estás en medio de una tarea enfocada → NO interrumpas, espera un breakpoint
    3. Si hay problemas de diseño mayores → comenta inmediatamente (no esperes)
    4. Si quedan comentarios no críticos → da LGTM con comentarios para desbloquear
    5. Si hay diferencia de zona horaria → responde antes de que termine el día del author
    ```
  - **Script de verificación de CLs pequeños (checklist)**:
    ```
    ¿El CL aborda UNA sola cosa?
    ¿El CL es autocontenido?
    ¿Incluye tests relacionados?
    ¿El sistema sigue funcionando después de cada submission?
    ¿Es menor a ~500 líneas? (ideal: ~100)
    ¿La descripción tiene primera línea en imperativo + cuerpo informativo?
    ¿Los refactorings están separados de los cambios de funcionalidad?
    ```
  - **Protocolo de emergencia (Emergency CL)**:
    ```
    Un CL de emergencia es PEQUEÑO y:
    - Permite continuar un lanzamiento mayor en vez de rollback
    - Arregla un bug que afecta significativamente a usuarios en producción
    - Maneja un problema legal urgente
    - Cierra una vulnerabilidad de seguridad importante

    En emergencias:
    1. Priorizar velocidad y corrección sobre todo lo demás
    2. La revisión debe priorizarse sobre todas las demás reviews
    3. Después de la emergencia, hacer revisión más exhaustiva del CL
    ```
  - **Plantilla de respuesta colaborativa a comentarios (cuando se discrepa)**:
    ```
    "I went with [X] because of [these pros/cons] with [these tradeoffs].
    My understanding is that using [Y] would be worse because of [these reasons].
    Are you suggesting that Y better serves the original tradeoffs,
    that we should weigh the tradeoffs differently, or something else?"
    ```
  - **Definición de Hard Deadline vs Soft Deadline**:
    ```
    HARD DEADLINE: Algo desastroso pasa si se pierde.
    - Obligación contractual
    - El producto falla completamente en el mercado
    - Hardware manufacturers solo ship una vez al año

    SOFT DEADLINE: Es deseable pero no catastrófico.
    - Lanzar esta semana en vez de la próxima
    - Conferencia importante (a menudo no es desastroso)
    - Retrasar una semana NO es desastroso
    ```
- **Cómo integrarlo en proyectos**:
  1. **Adoptar el estándar de code review**: Establecer como política que los reviewers aprueben CLs que mejoren la code health, incluso si no son perfectos. La mejora continua > perfección.
  2. **Implementar CLs pequeños**: Configurar el proceso de desarrollo para que cada CL sea autocontenido y aborde una sola cosa. Los reviewers tienen derecho a rechazar CLs por ser demasiado grandes.
  3. **Establecer SLA de respuesta**: Máximo 1 día de negocio para responder a cualquier request de code review. Las respuestas rápidas individuales son más importantes que la velocidad total del proceso.
  4. **Crear guías de equipo**: Adaptar las guías de reviewer y developer a las necesidades específicas del proyecto, manteniendo los principios fundamentales.
  5. **Etiquetar comentarios**: Adoptar el sistema de etiquetas (`Nit:`, `Optional:`, `FYI:`) para clarificar la severidad de los comentarios de review.
  6. **LGTM con comentarios**: Permitir dar LGTM/Approval con comentarios pendientes no críticos para evitar bloqueos innecesarios.
  7. **Formación de reviewers**: Asegurar que cada reviewer revise CADA línea del código asignado, no solo escanee.
  8. **Separar refactorings**: Establecer convención de que los refactorings grandes van en CLs separados.
  9. **Testing en el mismo CL**: Requerir que tests vayan en el mismo CL que el código de producción.
  10. **Descripciones de CL**: Adoptar la plantilla Google (primera línea imperativa + cuerpo informativo) para todas las descripciones de PR/CL.
  11. **Proceso de emergencias**: Definir claramente qué califica como emergencia (seguridad, bugs críticos, legales) y qué NO lo califica (soft deadlines, frustration del developer).
  12. **Resolución de conflictos**: Establecer que el primer paso siempre es llegar a consenso, luego meeting face-to-face, luego escalar a Technical Lead/Manager.
- **Fecha de aprendizaje**: 2026-05-26
