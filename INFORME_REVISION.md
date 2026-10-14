# Informe de revisión — Tabla Periódica

Fecha: 14 de octubre de 2026.

Este documento conserva la revisión inicial. Las correcciones implementadas y la verificación posterior se describen en [INFORME_CIERRE.md](./INFORME_CIERRE.md).

## Dictamen

La webapp tiene una base funcional y un conjunto amplio de recursos educativos. Sin embargo, no recomiendo cerrar todavía la versión actual: hay un fallo que impide abrir una ficha y varios errores que pueden enseñar conceptos incorrectos. El cierre requiere una ronda acotada de correcciones, no añadir más funcionalidades.

La revisión fue de lectura y comprobación: no se modificó el código de la aplicación.

## Alcance y comprobaciones

- `npm test`: 13 pruebas aprobadas, sin fallos.
- `npm run build`: compilación de producción exitosa, con aviso de paquetes JavaScript grandes.
- Navegador Chrome sin interfaz, pantalla de 390 × 844: inicio, diagnóstico, laboratorio, docentes, fichas H/K, quiz y repaso. No hubo desbordamiento horizontal del documento en las rutas comprobadas.
- Quiz de los 38: se completó un intento con todas las respuestas incorrectas y luego un repaso con todas correctas. El almacenamiento permaneció idéntico después del repaso.
- Contraste de ejemplos científicos con fuentes de RSC, IUPAC y Jefferson Lab.

Esto no equivale a comprobar todas las preguntas y explicaciones ni todas las combinaciones de filtros. No se verificó el despliegue público, los enlaces de invitación, Safari/iPhone, navegadores internos de redes sociales ni el rendimiento bajo una conexión móvil lenta. Las medidas móviles corresponden al ancho del documento y no constituyen una auditoría visual completa.

## Correcciones necesarias antes del cierre

### 1. Prioridad alta: la ficha del hidrógeno falla

**Reproducción:** abrir `/elemento/h` y esperar a que termine de cargar. Aparece «Algo inesperado ocurrió».

**Causa:** `calculateQuantumJump` devuelve un objeto sin `prediction` cuando solo existe una energía de ionización. El widget intenta leer `elementJump.prediction.group` y otros campos sin comprobar su existencia.

**Ubicación:** `src/data/ionizationData.js:717`; `src/components/IonizationQuantumJumpWidget.jsx:171`.

**Corrección:** devolver un resultado explícito de datos insuficientes y mostrarlo sin intentar calcular grupo o ion. Comprobar tanto la ficha H como H seleccionado en el laboratorio de ionización.

### 2. Prioridad alta: el laboratorio enseña una distribución electrónica incorrecta

**Reproducción:** `/laboratorio?sym=K` muestra `[2, 8, 9]`. Para el átomo neutro de potasio en estado fundamental corresponde `[2, 8, 8, 1]`.

**Causa:** se llenan capas completas con capacidades 2, 8, 18, 32… como si fueran el orden de llenado energético. La capacidad máxima de una capa no determina el orden de ocupación de los subniveles.

**Ubicación:** `src/LabPage.jsx:159`.

**Corrección:** usar las distribuciones del catálogo para átomos neutros y calcular los iones a partir de sus configuraciones electrónicas, contemplando la pérdida de electrones de metales de transición. No aplicar una regla basada únicamente en el número total de electrones.

**Referencia:** [RSC: potasio y configuración [Ar] 4s¹](https://periodic-table.rsc.org/element/19/Potassium).

### 3. Prioridad alta: se presenta una estimación nuclear como diagnóstico cierto

**Reproducción:** en `/laboratorio?sym=C`, añadir un neutrón al carbono-12. La app etiqueta al carbono-13 como «Núcleo radiactivo / inestable» y predice emisión β⁻. El carbono-13 es estable.

**Causa:** el umbral N/Z de 0,95 a 1,15 para núcleos ligeros sustituye una consulta real de estabilidad isotópica. Otros valores también quedan mal clasificados: no es suficiente estar dentro de una banda para garantizar estabilidad.

**Ubicación:** `src/LabPage.jsx:76`, presentación en `src/LabPage.jsx:407`.

**Corrección:** consultar isótopos conocidos en una base de datos. Si no existen datos, mostrar «estabilidad no determinada» o una estimación claramente identificada; no afirmar modos de desintegración a partir de la proporción N/Z.

**Referencia:** [Jefferson Lab: isótopos de carbono](https://stem-tools.jlab.org/itselemental/iso006).

### 4. Prioridad alta: el análisis de ionización asigna grupos incorrectos

**Ejemplos comprobados por ejecución del cálculo:** He → grupo 1 y X⁺; Ne → grupo 1 y X⁺ pese a no detectar salto significativo; Fe → grupo 1 y X⁺.

**Causa:** se interpreta el cociente máximo entre ionizaciones como cantidad de electrones de valencia y se asigna grupo incluso sin evidencia suficiente. Se aplica además a gases nobles y metales de transición sin limitar su validez.

**Ubicación:** `src/data/ionizationData.js:751`; `src/components/IonizationQuantumJumpWidget.jsx:156`.

**Corrección:** restringir la inferencia a ejercicios donde sea válida y se conozca el salto entre electrones externos e internos. Para elementos conocidos, utilizar su grupo real. No presentar una carga formal como un «catión estable típico» de todos los elementos.

**Referencia:** [RSC: helio, grupo 18 y configuración 1s²](https://periodic-table.rsc.org/element/2/Helium).

### 5. Prioridad media: aprobar el repaso no elimina los errores pendientes

**Reproducción:** terminar un quiz con errores; entrar al repaso y responder todo correctamente. Los errores y el dominio guardados no cambian.

**Causa:** `saveQuizResult` solo se ejecuta cuando `reviewMode` es falso. Además, entrar al repaso sin pendientes ofrece el cuestionario completo mientras afirma que contiene solamente preguntas falladas.

**Ubicación:** `src/QuizPage.jsx:97` y `src/QuizPage.jsx:116`.

**Corrección:** guardar los resultados de cada pregunta repasada y retirar los errores superados, conservando los de preguntas que no se repasaron. Separar este registro de la mejor nota del examen completo. Mostrar un estado vacío cuando no hay pendientes y distinguir errores de repasos programados.

### 6. Prioridad media: el acceso a ionización desde la guía deja el laboratorio vacío

**Reproducción:** abrir `/laboratorio?tab=jump`. Se muestran el encabezado y las tres pestañas, pero ningún panel.

**Causa:** la guía navega con `tab=jump` y emite el estado `jump`, mientras los botones y el renderizado del laboratorio esperan `ionization`.

**Ubicación:** `src/App.jsx:2448`; `src/LabPage.jsx:115`, `src/LabPage.jsx:788`.

**Corrección:** utilizar un identificador único y normalizar los parámetros existentes. Comprobar el acceso desde la guía y también mediante enlace directo.

### 7. Prioridad media: una pregunta penaliza una clasificación química inadecuada

La pregunta `e4` cuenta al Zn entre siete «metales de transición con valencia variable». Para este nivel educativo el zinc se enseña con estado de oxidación habitual +2; no corresponde presentarlo como ejemplo de valencia variable.

**Ubicación:** `banco-preguntas-quiz.json:8`, categoría `variable` del catálogo.

**Corrección:** conservarlo dentro de una agrupación mnemotécnica si resulta útil, pero cambiar el nombre de esa agrupación y la pregunta. Diferenciar la agrupación didáctica de una clasificación química formal.

**Referencias:** [RSC: zinc, estado de oxidación común +2](https://periodic-table.rsc.org/element/30/); [definición de elemento de transición de IUPAC](https://goldbook.iupac.org/terms/view/T06456).

## Mejoras recomendadas, sin ampliar el proyecto

1. **Carga desde redes sociales:** varias imágenes pesan aproximadamente entre 800 KB y 1 MB; el JavaScript inicial compilado pesa 573 KB sin comprimir y 166 KB con gzip. El visor 3D agrega 928 KB sin comprimir cuando se solicita. Optimizar imágenes a WebP/AVIF con tamaños adaptados y medir la carga con red móvil antes de decidir cambios de arquitectura. No se midieron tiempos reales de carga.
2. **Vista previa al compartir:** faltan `og:image` y metadatos de tarjeta social en `index.html`. Añadir una imagen representativa y comprobar una publicación compartida en las redes usadas para atraer alumnos.
3. **Teclado y accesibilidad:** los modales manejan Escape, pero no encontré gestión sistemática del foco al abrir, confinamiento del foco ni devolución al botón de origen. Revisar estos comportamientos y etiquetar correctamente el modal de elemento.
4. **Almacenamiento resistente:** las escrituras de progreso y las lecturas/escrituras de tema no manejan fallos de `localStorage`. Conviene permitir estudiar aunque el navegador bloquee o no pueda guardar datos. Este escenario no se reprodujo en el navegador de la revisión.
5. **Textos científicos y promesas:** corregir «STP 25°C», evitar afirmar que los otros 105 elementos son todos sólidos cuando algunos estados son desconocidos o predichos, y retirar afirmaciones absolutas como «dominio total demostrado» por ocho respuestas correctas. El carrusel también llama al francio el más escaso y al astato el segundo, mientras sus propias cantidades indican lo contrario.
6. **Pruebas de cierre:** las pruebas actuales validan principalmente estructura de datos. Añadir casos de regresión para H, distribución de K, C-13, He/Ne/Fe, repaso y acceso a ionización. Que las 13 pruebas pasen no garantiza exactitud científica ni funcionamiento de todos los flujos.

## Criterio práctico para cerrar

Corregir los siete hallazgos principales, repetir esos casos y verificar la versión publicada en un teléfono real desde un enlace de la red social utilizada. Con esa ronda completada, no veo justificación para seguir agregando funciones como requisito de cierre. La optimización y los detalles secundarios pueden resolverse sin rediseñar la webapp.
