import quizBank from "../banco-preguntas-quiz.json";

export const categories = [
  { id: "all", label: "Los 38", count: 38 },
  { id: "basic", label: "Básicos", count: 20 },
  { id: "variable", label: "Valencia variable", count: 7 },
  { id: "loose", label: "Sueltos", count: 11 }
];

const elements = [
  [1, "H", "Hidrógeno", "1.008", 1, 1, "basic", "No metal", "2.20", "±1", "1s1"], 
  [2, "He", "Helio", "4.003", 18, 1, "basic", "Gas noble", "—", "0", "1s2"],
  [3, "Li", "Litio", "6.941", 1, 2, "basic", "Alcalino", "0.98", "+1", "[He] 2s1"], 
  [4, "Be", "Berilio", "9.012", 2, 2, "basic", "Alcalinotérreo", "1.57", "+2", "[He] 2s2"],
  [5, "B", "Boro", "10.81", 13, 2, "basic", "Metaloide", "2.04", "+3", "[He] 2s2 2p1"], 
  [6, "C", "Carbono", "12.01", 14, 2, "basic", "No metal", "2.55", "±4, +2", "[He] 2s2 2p2"],
  [7, "N", "Nitrógeno", "14.01", 15, 2, "basic", "No metal", "3.04", "±3, +5, +4, +2", "[He] 2s2 2p3"], 
  [8, "O", "Oxígeno", "16.00", 16, 2, "basic", "No metal", "3.44", "-2, -1", "[He] 2s2 2p4"],
  [9, "F", "Flúor", "19.00", 17, 2, "basic", "Halógeno", "3.98", "-1", "[He] 2s2 2p5"], 
  [10, "Ne", "Neón", "20.18", 18, 2, "basic", "Gas noble", "—", "0", "[He] 2s2 2p6"],
  [11, "Na", "Sodio", "22.99", 1, 3, "basic", "Alcalino", "0.93", "+1", "[Ne] 3s1"], 
  [12, "Mg", "Magnesio", "24.31", 2, 3, "basic", "Alcalinotérreo", "1.31", "+2", "[Ne] 3s2"],
  [13, "Al", "Aluminio", "26.98", 13, 3, "basic", "Metal", "1.61", "+3", "[Ne] 3s2 3p1"], 
  [14, "Si", "Silicio", "28.09", 14, 3, "basic", "Metaloide", "1.90", "±4, +2", "[Ne] 3s2 3p2"],
  [15, "P", "Fósforo", "30.97", 15, 3, "basic", "No metal", "2.19", "±3, +5", "[Ne] 3s2 3p3"], 
  [16, "S", "Azufre", "32.07", 16, 3, "basic", "No metal", "2.58", "±2, +4, +6", "[Ne] 3s2 3p4"],
  [17, "Cl", "Cloro", "35.45", 17, 3, "basic", "Halógeno", "3.16", "±1, +3, +5, +7", "[Ne] 3s2 3p5"], 
  [18, "Ar", "Argón", "39.95", 18, 3, "basic", "Gas noble", "—", "0", "[Ne] 3s2 3p6"],
  [19, "K", "Potasio", "39.10", 1, 4, "basic", "Alcalino", "0.82", "+1", "[Ar] 4s1"], 
  [20, "Ca", "Calcio", "40.08", 2, 4, "basic", "Alcalinotérreo", "1.00", "+2", "[Ar] 4s2"],
  [24, "Cr", "Cromo", "52.00", 6, 4, "variable", "Transición", "1.66", "+2, +3, +6", "[Ar] 4s1 3d5"], 
  [25, "Mn", "Manganeso", "54.94", 7, 4, "variable", "Transición", "1.55", "+2, +3, +4, +6, +7", "[Ar] 4s2 3d5"],
  [26, "Fe", "Hierro", "55.85", 8, 4, "variable", "Transición", "1.83", "+2, +3", "[Ar] 4s2 3d6"], 
  [27, "Co", "Cobalto", "58.93", 9, 4, "variable", "Transición", "1.88", "+2, +3", "[Ar] 4s2 3d7"],
  [28, "Ni", "Níquel", "58.69", 10, 4, "variable", "Transición", "1.91", "+2, +3", "[Ar] 4s2 3d8"], 
  [29, "Cu", "Cobre", "63.55", 11, 4, "variable", "Transición", "1.90", "+1, +2", "[Ar] 4s1 3d10"],
  [30, "Zn", "Zinc", "65.38", 12, 4, "variable", "Transición", "1.65", "+2", "[Ar] 4s2 3d10"], 
  [34, "Se", "Selenio", "78.97", 16, 4, "loose", "No metal", "2.55", "±2, +4, +6", "[Ar] 4s2 3d10 4p4"],
  [35, "Br", "Bromo", "79.90", 17, 4, "loose", "Halógeno", "2.96", "±1, +3, +5, +7", "[Ar] 4s2 3d10 4p5"], 
  [38, "Sr", "Estroncio", "87.62", 2, 5, "loose", "Alcalinotérreo", "0.95", "+2", "[Kr] 5s2"],
  [47, "Ag", "Plata", "107.87", 11, 5, "loose", "Transición", "1.93", "+1", "[Kr] 5s1 4d10"], 
  [50, "Sn", "Estaño", "118.71", 14, 5, "loose", "Metal", "1.96", "+2, +4", "[Kr] 5s2 4d10 5p2"],
  [53, "I", "Yodo", "126.90", 17, 5, "loose", "Halógeno", "2.66", "±1, +3, +5, +7", "[Kr] 5s2 4d10 5p5"], 
  [56, "Ba", "Bario", "137.33", 2, 6, "loose", "Alcalinotérreo", "0.89", "+2", "[Xe] 6s2"],
  [78, "Pt", "Platino", "195.08", 10, 6, "loose", "Transición", "2.28", "+2, +4", "[Xe] 6s1 4f14 5d9"], 
  [79, "Au", "Oro", "196.97", 11, 6, "loose", "Transición", "2.54", "+1, +3", "[Xe] 6s1 4f14 5d10"],
  [80, "Hg", "Mercurio", "200.59", 12, 6, "loose", "Transición", "2.00", "+1, +2", "[Xe] 6s2 4f14 5d10"], 
  [82, "Pb", "Plomo", "207.2", 14, 6, "loose", "Metal", "2.33", "+2, +4", "[Xe] 6s2 4f14 5d10 6p2"]
].map(([z, symbol, name, mass, col, row, category, family, en, ox, config]) => ({ 
  z, symbol, name, mass, col, row, category, family, en, ox, config 
}));

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
  "los-38": { objective: "Construir el mapa mínimo de elementos para el examen.", points: ["Los primeros 20 elementos son la base del recorrido.", "Los 7 de transición concentran las valencias variables.", "Los 11 sueltos se estudian como un grupo de alta rentabilidad."], images: ["alkali-metals.jpg", "halogens-noble-gases.jpg"] },
  "valencias-variables": { objective: "Predecir nombres y fórmulas usando estados de oxidación.", points: ["La carga total de un compuesto debe ser cero.", "–oso indica la valencia menor y –ico la mayor.", "Fe, Cu, Mn, Cr, Co, Ni y Hg requieren atención especial."], images: ["ion-charge.jpg", "radioactivity.jpg"] },
  "nomenclatura-8-pasos": { objective: "Reconocer la familia de un compuesto antes de nombrarlo.", points: ["Metal + oxígeno produce un óxido básico.", "No metal + oxígeno produce un anhídrido.", "La cadena avanza de óxidos a hidróxidos, ácidos y sales."], images: ["atomic-models.jpg", "isotopes-scale.jpg"] },
  "iones-poliatomicos": { objective: "Identificar fórmulas y cargas de los iones más frecuentes.", points: ["Sulfato, carbonato y cromato suelen tener carga −2.", "Nitrato y bicarbonato tienen carga −1.", "Amonio, NH₄⁺, es el catión poliatómico clave."], images: ["ionic-bond.jpg"] },
  "configuracion-moller": { objective: "Escribir configuraciones siguiendo el orden energético.", points: ["4s se llena antes que 3d.", "Los subniveles s, p, d y f admiten 2, 6, 10 y 14 electrones.", "Cr y Cu son las anomalías que debes comprobar."], images: ["electron-configuration.jpg", "quantum-orbitals.jpg", "quantum-numbers.jpg"] },
  "tendencias-periodicas": { objective: "Leer las direcciones de cambio en la tabla periódica.", points: ["El radio atómico crece hacia la izquierda y hacia abajo.", "Electronegatividad y energía de ionización crecen hacia arriba y a la derecha.", "Un catión es menor y un anión es mayor que su átomo neutro."], images: ["atomic-radius-trend.jpg", "ionization-energy.jpg", "electronegativity.jpg"] },
  "estequiometria-mol": { objective: "Conectar partículas, moles, masa y volumen.", points: ["Un mol contiene 6.022 × 10²³ entidades.", "En condiciones normales, un mol de gas ocupa 22.4 L.", "Para pasar de gramos a moles, divide entre la masa molar."], images: ["stoichiometry.jpg", "equation-balancing.jpg", "limiting-reactant.jpg", "solutions-concentration.jpg", "gas-laws.jpg"] },
  "enlace-quimico": { objective: "Predecir el tipo de enlace a partir de los elementos.", points: ["Metal + no metal suele formar enlace iónico.", "Los no metales comparten electrones en enlaces covalentes.", "Los metales forman una red con electrones deslocalizados."], images: ["covalent-bond.jpg", "metallic-bond.jpg", "molecular-geometry.jpg", "intermolecular-forces.jpg", "chemical-reaction.jpg", "thermochemistry.jpg", "reaction-kinetics.jpg", "chemical-equilibrium.jpg", "electrochemistry.jpg", "ph-scale.jpg"] }
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
