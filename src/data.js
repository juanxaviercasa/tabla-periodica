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

export const topics = [
  { id: "los-38", number: 1, title: "Los 38 elementos que sí caen", tag: "Abre la tabla de arriba", description: "Reconoce los elementos prioritarios y su ubicación.", questions: [{ q: "¿Cuántos elementos prioriza esta tabla?", options: ["20", "38", "80", "118"], answer: 1, explain: "El enfoque reúne 38 elementos de los 118 conocidos." }] },
  { id: "valencias-variables", number: 2, title: "Las 7 valencias variables", tag: "Fe · Cu · Mn · Cr · Pb · Sn · Hg", description: "Identifica estados de oxidación frecuentes.", questions: [{ q: "¿Qué elemento aparece con valencias +1 y +2?", options: ["Cobre", "Sodio", "Cloro", "Calcio"], answer: 0, explain: "El cobre trabaja con frecuencia en +1 y +2." }] },
  { id: "nomenclatura-8-pasos", number: 3, title: "La cadena de nomenclatura en 8 pasos", tag: "De óxido básico a hidruro", description: "Ordena el procedimiento para nombrar compuestos.", questions: [{ q: "¿Qué debes identificar primero en un compuesto?", options: ["La masa", "La función química", "El color", "La temperatura"], answer: 1, explain: "Reconocer la función química orienta toda la nomenclatura." }] },
  { id: "iones-poliatomicos", number: 4, title: "Los 16 iones poliatómicos frecuentes", tag: "Agrupados por familia", description: "Memoriza nombres, fórmulas y cargas.", questions: [{ q: "¿Qué caracteriza a un ion poliatómico?", options: ["Un solo átomo", "Varios átomos con carga", "Solo metales", "Carga siempre neutra"], answer: 1, explain: "Es un grupo de átomos que conserva una carga neta." }] },
  { id: "configuracion-moller", number: 5, title: "Configuración electrónica y regla de Möller", tag: "Con los anómalos de Cr y Cu", description: "Construye configuraciones sin perder el orden energético.", questions: [{ q: "¿Qué regla ordena el llenado de orbitales?", options: ["Möller", "Avogadro", "Boyle", "Dalton"], answer: 0, explain: "La regla de Möller ayuda a seguir el orden de energía de los orbitales." }] },
  { id: "tendencias-periodicas", number: 6, title: "Tendencias periódicas", tag: "Solo dos direcciones opuestas", description: "Compara radio, energía e2 ionización y electronegatividad.", questions: [{ q: "¿Qué aumenta generalmente hacia la derecha?", options: ["Radio atómico", "Electronegatividad", "Número de capas", "Masa siempre"], answer: 1, explain: "La electronegatividad suele aumentar hacia la derecha y hacia arriba." }] },
  { id: "estequiometria-mol", number: 7, title: "Estequiometría y el mol", tag: "El puente entre gramos y partículas", description: "Resuelve conversiones y proporciones químicas.", questions: [{ q: "¿Qué representa un mol?", options: ["Una unidad de volumen", "6.022 × 10²³ partículas", "Un gramo exacto", "Una temperatura"], answer: 1, explain: "El mol representa el número de Avogadro de entidades." }] },
  { id: "enlace-quimico", number: 8, title: "Enlace químico", tag: "Iónico · covalente · metálico", description: "Distingue cómo se unen los átomos.", questions: [{ q: "¿Qué enlace implica transferencia de electrones?", options: ["Iónico", "Covalente", "Metálico", "Puente de hidrógeno"], answer: 0, explain: "El enlace iónico se forma por transferencia de electrones entre especies." }] }
];

export { elements };
