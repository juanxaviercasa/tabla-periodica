import quizBank from "../banco-preguntas-quiz.json";
import {
  elements118,
  preuniCategories,
  preuniZList,
  iupacFamilies,
  quantumBlocks,
  aggregationPhases,
  periodicTablePlaceholders
} from "./elementsData.js";

export const categories = preuniCategories;
export const elements = elements118;

export {
  elements118,
  preuniCategories,
  preuniZList,
  iupacFamilies,
  quantumBlocks,
  aggregationPhases,
  periodicTablePlaceholders
};

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
  "los-38": {
    objective: "Construir el mapa mínimo de elementos para el examen.",
    points: [
      "Los primeros 20 elementos son la base del recorrido.",
      "Los 7 de transición concentran las valencias variables.",
      "Los 11 sueltos se estudian como un grupo de alta rentabilidad."
    ],
    images: ["alkali-metals.jpg", "halogens-noble-gases.jpg"]
  },
  "valencias-variables": {
    objective: "Predecir nombres y fórmulas usando estados de oxidación.",
    points: [
      "La carga total de un compuesto debe ser cero.",
      "–oso indica la valencia menor y –ico la mayor.",
      "Fe, Cu, Mn, Cr, Co, Ni y Hg requieren atención especial."
    ],
    images: ["ion-charge.jpg", "radioactivity.jpg"]
  },
  "nomenclatura-8-pasos": {
    objective: "Reconocer la familia de un compuesto antes de nombrarlo.",
    points: [
      "Metal + oxígeno produce un óxido básico.",
      "No metal + oxígeno produce un anhídrido.",
      "La cadena avanza de óxidos a hidróxidos, ácidos y sales."
    ],
    images: ["atomic-models.jpg", "isotopes-scale.jpg"]
  },
  "iones-poliatomicos": {
    objective: "Identificar fórmulas y cargas de los iones más frecuentes.",
    points: [
      "Sulfato, carbonato y cromato suelen tener carga −2.",
      "Nitrato y bicarbonato tienen carga −1.",
      "Amonio, NH₄⁺, es el catión poliatómico clave."
    ],
    images: ["ionic-bond.jpg"]
  },
  "configuracion-moller": {
    objective: "Escribir configuraciones siguiendo el orden energético.",
    points: [
      "4s se llena antes que 3d.",
      "Los subniveles s, p, d y f admiten 2, 6, 10 y 14 electrones.",
      "Cr y Cu son las anomalías que debes comprobar."
    ],
    images: ["electron-configuration.jpg", "quantum-orbitals.jpg", "quantum-numbers.jpg"]
  },
  "tendencias-periodicas": {
    objective: "Leer las direcciones de cambio en la tabla periódica.",
    points: [
      "El radio atómico crece hacia la izquierda y hacia abajo.",
      "Electronegatividad y energía de ionización crecen hacia arriba y a la derecha.",
      "Un catión es menor y un anión es mayor que su átomo neutro."
    ],
    images: ["atomic-radius-trend.jpg", "ionization-energy.jpg", "electronegativity.jpg"]
  },
  "estequiometria-mol": {
    objective: "Conectar partículas, moles, masa y volumen.",
    points: [
      "Un mol contiene 6.022 × 10²³ entidades.",
      "En condiciones normales, un mol de gas ocupa 22.4 L.",
      "Para pasar de gramos a moles, divide entre la masa molar."
    ],
    images: ["stoichiometry.jpg", "equation-balancing.jpg", "limiting-reactant.jpg", "solutions-concentration.jpg", "gas-laws.jpg"]
  },
  "enlace-quimico": {
    objective: "Predecir el tipo de enlace a partir de los elementos.",
    points: [
      "Metal + no metal suele formar enlace iónico.",
      "Los no metales comparten electrones en enlaces covalentes.",
      "Los metales forman una red con electrones deslocalizados."
    ],
    images: ["covalent-bond.jpg", "metallic-bond.jpg", "molecular-geometry.jpg", "intermolecular-forces.jpg", "chemical-reaction.jpg", "thermochemistry.jpg", "reaction-kinetics.jpg", "chemical-equilibrium.jpg", "electrochemistry.jpg", "ph-scale.jpg"]
  }
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
