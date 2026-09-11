import quizBank from "../banco-preguntas-quiz.json";

export const categories = [
  { id: "all", label: "Los 38", count: 38 },
  { id: "basic", label: "Básicos", count: 20 },
  { id: "variable", label: "Valencia variable", count: 7 },
  { id: "loose", label: "Sueltos", count: 11 }
];

const elements = [
  [1, "H", "Hidrógeno", "1.008", 1, 1, "basic", "No metal"], [2, "He", "Helio", "4.003", 18, 1, "basic", "Gas noble"],
  [3, "Li", "Litio", "6.941", 1, 2, "basic", "Alcalino"], [4, "Be", "Berilio", "9.012", 2, 2, "basic", "Alcalinotérreo"],
  [5, "B", "Boro", "10.81", 13, 2, "basic", "Metaloide"], [6, "C", "Carbono", "12.01", 14, 2, "basic", "No metal"],
  [7, "N", "Nitrógeno", "14.01", 15, 2, "basic", "No metal"], [8, "O", "Oxígeno", "16.00", 16, 2, "basic", "No metal"],
  [9, "F", "Flúor", "19.00", 17, 2, "basic", "Halógeno"], [10, "Ne", "Neón", "20.18", 18, 2, "basic", "Gas noble"],
  [11, "Na", "Sodio", "22.99", 1, 3, "basic", "Alcalino"], [12, "Mg", "Magnesio", "24.31", 2, 3, "basic", "Alcalinotérreo"],
  [13, "Al", "Aluminio", "26.98", 13, 3, "basic", "Metal"], [14, "Si", "Silicio", "28.09", 14, 3, "basic", "Metaloide"],
  [15, "P", "Fósforo", "30.97", 15, 3, "basic", "No metal"], [16, "S", "Azufre", "32.07", 16, 3, "basic", "No metal"],
  [17, "Cl", "Cloro", "35.45", 17, 3, "basic", "Halógeno"], [18, "Ar", "Argón", "39.95", 18, 3, "basic", "Gas noble"],
  [19, "K", "Potasio", "39.10", 1, 4, "basic", "Alcalino"], [20, "Ca", "Calcio", "40.08", 2, 4, "basic", "Alcalinotérreo"],
  [24, "Cr", "Cromo", "52.00", 6, 4, "variable", "Transición"], [25, "Mn", "Manganeso", "54.94", 7, 4, "variable", "Transición"],
  [26, "Fe", "Hierro", "55.85", 8, 4, "variable", "Transición"], [27, "Co", "Cobalto", "58.93", 9, 4, "variable", "Transición"],
  [28, "Ni", "Níquel", "58.69", 10, 4, "variable", "Transición"], [29, "Cu", "Cobre", "63.55", 11, 4, "variable", "Transición"],
  [30, "Zn", "Zinc", "65.38", 12, 4, "variable", "Transición"], [34, "Se", "Selenio", "78.97", 16, 4, "loose", "No metal"],
  [35, "Br", "Bromo", "79.90", 17, 4, "loose", "Halógeno"], [38, "Sr", "Estroncio", "87.62", 2, 5, "loose", "Alcalinotérreo"],
  [47, "Ag", "Plata", "107.87", 11, 5, "loose", "Transición"], [50, "Sn", "Estaño", "118.71", 14, 5, "loose", "Metal"],
  [53, "I", "Yodo", "126.90", 17, 5, "loose", "Halógeno"], [56, "Ba", "Bario", "137.33", 2, 6, "loose", "Alcalinotérreo"],
  [78, "Pt", "Platino", "195.08", 10, 6, "loose", "Transición"], [79, "Au", "Oro", "196.97", 11, 6, "loose", "Transición"],
  [80, "Hg", "Mercurio", "200.59", 12, 6, "loose", "Transición"], [82, "Pb", "Plomo", "207.2", 14, 6, "loose", "Metal"]
].map(([z, symbol, name, mass, col, row, category, family]) => ({ z, symbol, name, mass, col, row, category, family }));

const quizTopicMap = [
  ["los-38", "elementos-38", 1, "Abre la tabla de arriba", "Reconoce los elementos prioritarios y su ubicación.", "Base", "8 min", "Empieza aquí: te da el mapa del curso."],
  ["valencias-variables", "valencias", 2, "Fe · Cu · Mn · Cr · Pb · Sn · Hg", "Identifica estados de oxidación frecuentes.", "Base", "10 min", "Después de ubicar los 38 elementos."],
  ["nomenclatura-8-pasos", "nomenclatura", 3, "De óxido básico a hidruro", "Ordena el procedimiento para nombrar compuestos.", "Intermedio", "12 min", "Usa las valencias variables como apoyo."],
  ["iones-poliatomicos", "iones", 4, "Agrupados por familia", "Memoriza nombres, fórmulas y cargas.", "Intermedio", "10 min", "Conviene dominar nomenclatura primero."],
  ["configuracion-moller", "configuracion", 5, "Con los anómalos de Cr y Cu", "Construye configuraciones sin perder el orden energético.", "Intermedio", "12 min", "Requiere reconocer símbolos y números atómicos."],
  ["tendencias-periodicas", "tendencias", 6, "Solo dos direcciones opuestas", "Compara radio, energía de ionización y electronegatividad.", "Intermedio", "10 min", "Lee la tabla antes de memorizar direcciones."],
  ["estequiometria-mol", "estequiometria", 7, "El puente entre gramos y partículas", "Resuelve conversiones y proporciones químicas.", "Aplicación", "14 min", "Apóyate en masa atómica y número de Avogadro."],
  ["enlace-quimico", "enlace", 8, "Iónico · covalente · metálico", "Distingue cómo se unen los átomos.", "Aplicación", "10 min", "Cierra la ruta conectando estructura y propiedades."]
];

const answerIndex = { a: 0, b: 1, c: 2, d: 3 };
const microLessons = {
  "los-38": { objective: "Construir el mapa mínimo de elementos para el examen.", points: ["Los primeros 20 elementos son la base del recorrido.", "Los 7 de transición concentran las valencias variables.", "Los 11 sueltos se estudian como un grupo de alta rentabilidad."] },
  "valencias-variables": { objective: "Predecir nombres y fórmulas usando estados de oxidación.", points: ["La carga total de un compuesto debe ser cero.", "–oso indica la valencia menor y –ico la mayor.", "Fe, Cu, Mn, Cr, Co, Ni y Hg requieren atención especial."] },
  "nomenclatura-8-pasos": { objective: "Reconocer la familia de un compuesto antes de nombrarlo.", points: ["Metal + oxígeno produce un óxido básico.", "No metal + oxígeno produce un anhídrido.", "La cadena avanza de óxidos a hidróxidos, ácidos y sales."] },
  "iones-poliatomicos": { objective: "Identificar fórmulas y cargas de los iones más frecuentes.", points: ["Sulfato, carbonato y cromato suelen tener carga −2.", "Nitrato y bicarbonato tienen carga −1.", "Amonio, NH₄⁺, es el catión poliatómico clave."] },
  "configuracion-moller": { objective: "Escribir configuraciones siguiendo el orden energético.", points: ["4s se llena antes que 3d.", "Los subniveles s, p, d y f admiten 2, 6, 10 y 14 electrones.", "Cr y Cu son las anomalías que debes comprobar."] },
  "tendencias-periodicas": { objective: "Leer las direcciones de cambio en la tabla periódica.", points: ["El radio atómico crece hacia la izquierda y hacia abajo.", "Electronegatividad y energía de ionización crecen hacia arriba y a la derecha.", "Un catión es menor y un anión es mayor que su átomo neutro."] },
  "estequiometria-mol": { objective: "Conectar partículas, moles, masa y volumen.", points: ["Un mol contiene 6.022 × 10²³ entidades.", "En condiciones normales, un mol de gas ocupa 22.4 L.", "Para pasar de gramos a moles, divide entre la masa molar."] },
  "enlace-quimico": { objective: "Predecir el tipo de enlace a partir de los elementos.", points: ["Metal + no metal suele formar enlace iónico.", "Los no metales comparten electrones en enlaces covalentes.", "Los metales forman una red con electrones deslocalizados."] }
};
const normalizeQuestions = (questions) => questions.map((question) => ({
  id: question.id,
  q: question.prompt,
  options: question.opciones.map((option) => option.texto),
  answer: answerIndex[question.correcta],
  explain: question.explicacion
}));

export const topics = quizTopicMap.map(([id, bankId, number, tag, description, level, duration, prerequisite]) => ({
  id,
  number,
  title: quizBank[bankId].titulo,
  tag,
  description,
  level,
  duration,
  prerequisite,
  microLesson: microLessons[id],
  questions: normalizeQuestions(quizBank[bankId].preguntas)
}));

export { elements };
