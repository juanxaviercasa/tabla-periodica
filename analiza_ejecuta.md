Para que la plataforma tenga un impacto pedagógico real y la inteligencia artificial no genere textos genéricos ni sufra de alucinaciones, la solución consiste en **anclar el conocimiento en repositorios educativos formales y datasets científicos estructurados (grounding/RAG)**.

A continuación tienes los repositorios y fuentes de código abierto clave clasificados por su aporte metodológico, junto con un esquema para que el agente de Antigravity los ingeste de manera automática.

---

### 1. Repositorios de Didáctica Activa y Simulaciones Educativas

Estos proyectos provienen de investigaciones en educación científica y evitan la memorización pasiva a través de dinámicas de aprendizaje por indagación:

* [phetsims/build-an-atom de PhET Interactive Simulations (Univ. de Colorado Boulder)](https://github.com/phetsims/build-an-atom):
* **Aporte pedagógico**: Es el estándar de oro en didáctica química. En lugar de limitarse a mostrar el átomo, desglosa el aprendizaje en retos: cómo cambia la carga neta al añadir electrones (iones), cómo cambia la masa atómica al variar neutrones (isótopos) y la estabilidad nuclear.
* **Cómo aprovecharlo**: Puedes extraer sus reglas de modelado y lógica de retroalimentación inmediata para que el alumno interactúe modificando el átomo de cada elemento.


* [phetsims/isotopes-and-atomic-mass](https://github.com/phetsims/isotopes-and-atomic-mass):
* **Aporte pedagógico**: Resuelve una de las dudas más frecuentes en química: *¿Por qué la masa atómica del Cobalto es 58.93 y no un entero?* Explica la abundancia isotópica de forma visual y experimental.


* [calebephrem/periodic-table](https://github.com/calebephrem/periodic-table):
* **Aporte pedagógico**: Implementa módulos de evaluación formativa (quizzes), tablas auxiliares de electronegatividad y métodos de autoevaluación activa.



---

### 2. Fuentes de Datos Científicos Rigurosos (Antialucinación)

Para que la IA cuente con una fuente de verdad (*ground truth*) exacta de donde extraer explicaciones comprobadas:

* [mendeleev de lmmentel](https://github.com/lmmentel/mendeleev):
* **Aporte pedagógico**: Base de datos científica completa disponible en JSON, SQL y Markdown. Contiene energías de ionización sucesivas ($1^{\text{ra}}, 2^{\text{da}}, 3^{\text{ra}}$), radios covalentes y de Van der Waals, afinidad electrónica real y configuraciones electrónicas por subniveles de energía ($s, p, d, f$).


* [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON):
* **Aporte pedagógico**: Incluye resúmenes históricos, origen etimológico de los nombres, estado de la materia en condiciones estándar, apariencia visual y contexto de descubrimiento.



---

### 3. Didáctica de Errores Frecuentes (*Chemical Misconceptions*)

Los especialistas en educación química (como la [Royal Society of Chemistry - Chemical Misconceptions](https://edu.rsc.org/resources/chemical-misconceptions-ii-revising-the-periodic-table/1090.article)) destacan que el aprendizaje profundo ocurre cuando se confrontan los conceptos erróneos clásicos de los estudiantes. Por ejemplo:

1. **La trampa del radio atómico**: Pensar que hacia la derecha en un período el átomo es más grande porque tiene más partículas (cuando en realidad disminuye debido a la atracción de la carga nuclear efectiva $Z_{\text{eff}}$).
2. **Confundir valencia con estado de oxidación**: Clave en exámenes de nomenclatura (como la advertencia de sufijos *-oso / -ico* que ya tienes en el Cobalto).
3. **El modelo atómico como realidad física**: Aclarar que el modelo de Bohr es un modelo pedagógico simplificado y cómo se conecta con la nube cuántica de probabilidad.

---

### 4. Estructura de Datos Pedagógicos para tu Proyecto

Para que Antigravity genere o cargue información sin inventar nada, pídele organizar el contenido de cada elemento en un esquema estructurado (por ejemplo, en archivos JSON dentro de `src/data/pedagogy/`):

```json
{
  "symbol": "Co",
  "name": "Cobalto",
  "pedagogy": {
    "everyday_context": "¿Dónde está en mi vida? Es el núcleo activo de la vitamina B12 (vital para la formación de glóbulos rojos) y clave en imanes de alta potencia y baterías de litio.",
    "exam_pitfall": "Trampa clásica de examen: Presenta valencias fijas variables (+2 y +3). En nomenclatura tradicional genera 'cobaltoso' y 'cobáltico'. No confundir su estado de oxidación más estable en soluciones acuosas (+2).",
    "quantum_breakdown": {
      "level_explanation": "Posee 4 capas ocupadas, pero su capa de valencia no es la 3d, sino la 4s. Al oxidarse, pierde primero los electrones 4s².",
      "anomalies_or_rules": "Sigue el principio de Aufbau estándar: [Ar] 4s² 3d⁷ (7 electrones en subnivel d, de los cuales 3 están desapareados según la regla de Hund)."
    },
    "self_check_quiz": [
      {
        "question": "¿Por qué el Cobalto (Z=27) tiene menor radio atómico que el Calcio (Z=20) si tiene más electrones?",
        "answer": "Porque tiene 7 protones más en su núcleo ejerciendo mayor atracción nuclear efectiva sobre las capas electrónicas.",
        "concept_tested": "Carga nuclear efectiva y radio atómico"
      }
    ]
  }
}

```

---

### 5. Megaprompt para Antigravity CLI (Ingesta e Integración Didáctica)

Puedes enviar el siguiente prompt a Antigravity para que cree esta capa de enseñanza estructurada:

```markdown
# AGENT DIRECTIVE: Integración de Motor Pedagógico y Grounding Científico

Actúa como diseñador instruccional de ciencias y desarrollador web. El objetivo es dotar a la plataforma de una sólida base didáctica de química basada en los estándares educativos de PhET (Universidad de Colorado) y la Royal Society of Chemistry, evitando que la IA produzca explicaciones genéricas.

---

## 1. FUENTES DE DATOS CIENTÍFICOS Y EDUCATIVOS
Conéctate o clona las definiciones estructuradas de:
1. `https://github.com/lmmentel/mendeleev` (propiedades periódicas avanzadas, radios y energías).
2. `https://github.com/Bowserinator/Periodic-Table-JSON` (datos base y contexto).
3. Principios de diseño instruccional de `https://github.com/phetsims/build-an-atom` (aprendizaje activo por retroalimentación inmediata).

---

## 2. COMPONENTES PEDAGÓGICOS A INTEGRAR

### A. Módulo "Aprende el Concepto (Sin Rodeos)"
En la pantalla de detalle de cada elemento, sustituye los textos genéricos por 4 tarjetas didácticas puntuales basadas en datos reales:
1. **Aplicación Real y Biomédica**: Para qué sirve el elemento en la vida diaria, el cuerpo humano o la industria médica/tecnológica.
2. **Trampa Típica de Examen**: Alertas específicas sobre nomenclatura, excepciones de configuración electrónica o confusión común de valencias.
3. **Desglose Cuántico Intuitivo**: Explicación paso a paso de por qué sus electrones se distribuyen en esa configuración (capa de valencia vs. subnivel más energético, electrones desapareados).
4. **Relación con su Familia**: Por qué comparte propiedades con los elementos de su mismo grupo.

### B. Módulo de Autoevaluación Activa ("Ponte a Prueba")
- Añade una pestaña o sección desplegable con 2 preguntas de respuesta rápida tipo flashcard para cada elemento:
  - Una pregunta conceptual (ej. tendencias periódicas o radio atómico).
  - Una pregunta aplicada de nomenclatura o valencias.
- El usuario puede hacer clic para revelar la respuesta explicada paso a paso.

---

## 3. IMPLEMENTACIÓN TÉCNICA
1. Crea un archivo centralizado `pedagogyData.json` o esquemas TypeScript estructurados en `src/data/pedagogy/`.
2. Para los 38 elementos clave (modo memorización), prioriza mnemotecnias de nomenclatura y reglas de estados de oxidación.
3. Para los 118 elementos (modo completo), asegura que los datos provengan estrictamente de las fuentes verificadas anteriores, sin texto simulado ni conjeturas.
4. Mantén la interfaz reactiva, limpia y optimizada para dispositivos móviles.

```