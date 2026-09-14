// groupPeriodData.js: Información exhaustiva de los 18 grupos, 7 períodos y tendencias periódicas

export const groupsData = [
  {
    number: 1,
    iupac: "1",
    cas: "IA",
    name: "Metales alcalinos",
    nameShort: "Alcalinos",
    valenceTerminal: "ns¹",
    valenceElectrons: 1,
    commonOx: "+1",
    subshell: "s",
    description: "Metales blandos muy reactivos, de baja densidad y bajo punto de fusión. Reaccionan vigorosamente con agua produciendo hidróxidos y gas H₂.",
    elements: [1, 3, 11, 19, 37, 55, 87]
  },
  {
    number: 2,
    iupac: "2",
    cas: "IIA",
    name: "Metales alcalinotérreos",
    nameShort: "Alcalinotérreos",
    valenceTerminal: "ns²",
    valenceElectrons: 2,
    commonOx: "+2",
    subshell: "s",
    description: "Metales reactivos más duros y densos que los alcalinos. Forman óxidos básicos alcalinos (tierras) y cationes divalentes M²⁺ estables.",
    elements: [4, 12, 20, 38, 56, 88]
  },
  {
    number: 3,
    iupac: "3",
    cas: "IIIB",
    name: "Familia del Escandio",
    nameShort: "Fam. Escandio",
    valenceTerminal: "(n-1)d¹ ns²",
    valenceElectrons: 3,
    commonOx: "+3",
    subshell: "d / f",
    description: "Inicio del bloque d de metales de transición. Incluye el Escandio, Itrio y las series f de Lantánidos y Actínidos.",
    elements: [21, 39, 57, 89]
  },
  {
    number: 4,
    iupac: "4",
    cas: "IVB",
    name: "Familia del Titanio",
    nameShort: "Fam. Titanio",
    valenceTerminal: "(n-1)d² ns²",
    valenceElectrons: 4,
    commonOx: "+4, +3, +2",
    subshell: "d",
    description: "Metales refractarios de alta resistencia mecánica, tenacidad y excepcional resistencia a la corrosión pasivada por capa de óxido.",
    elements: [22, 40, 72, 104]
  },
  {
    number: 5,
    iupac: "5",
    cas: "VB",
    name: "Familia del Vanadio",
    nameShort: "Fam. Vanadio",
    valenceTerminal: "(n-1)d³ ns²",
    valenceElectrons: 5,
    commonOx: "+5, +4, +3, +2",
    subshell: "d",
    description: "Presentan múltiples estados de oxidación con ricos colores de complejos en disolución acuosa. Empleados en aceros de alta resistencia.",
    elements: [23, 41, 73, 105]
  },
  {
    number: 6,
    iupac: "6",
    cas: "VIB",
    name: "Familia del Cromo",
    nameShort: "Fam. Cromo",
    valenceTerminal: "(n-1)d⁵ ns¹",
    valenceElectrons: 6,
    commonOx: "+6, +3, +2",
    subshell: "d",
    description: "Anomalía de configuración cuántica por semillenado de orbitales d (d⁵ s¹). Puntos de fusión sumamente elevados (Wolframio: 3695 K).",
    elements: [24, 42, 74, 106]
  },
  {
    number: 7,
    iupac: "7",
    cas: "VIIB",
    name: "Familia del Manganeso",
    nameShort: "Fam. Manganeso",
    valenceTerminal: "(n-1)d⁵ ns²",
    valenceElectrons: 7,
    commonOx: "+7, +6, +4, +2",
    subshell: "d",
    description: "El mayor rango de números de oxidación de los metales 3d (desde -3 hasta +7 en el anión permanganato MnO₄⁻).",
    elements: [25, 43, 75, 107]
  },
  {
    number: 8,
    iupac: "8",
    cas: "VIIIB",
    name: "Tríada del Hierro",
    nameShort: "Tríada Fe",
    valenceTerminal: "(n-1)d⁶ ns²",
    valenceElectrons: 8,
    commonOx: "+2, +3",
    subshell: "d",
    description: "Metales ferromagnéticos y pilares estructurales del cosmos y la industria siderúrgica mundial. Centro catalítico de la hemoglobina.",
    elements: [26, 44, 76, 108]
  },
  {
    number: 9,
    iupac: "9",
    cas: "VIIIB",
    name: "Tríada del Cobalto",
    nameShort: "Tríada Co",
    valenceTerminal: "(n-1)d⁷ ns²",
    valenceElectrons: 9,
    commonOx: "+2, +3, +4",
    subshell: "d",
    description: "Metales de transición densos, duros y resistentes. El Rodio y el Iridio figuran entre los elementos más densos e inertes químicamente.",
    elements: [27, 45, 77, 109]
  },
  {
    number: 10,
    iupac: "10",
    cas: "VIIIB",
    name: "Tríada del Níquel",
    nameShort: "Tríada Ni",
    valenceTerminal: "(n-1)d⁸ ns²",
    valenceElectrons: 10,
    commonOx: "+2, +4",
    subshell: "d",
    description: "Excelentes catalizadores de hidrogenación y metales nobles (Platino). Resistentes a la oxidación a alta temperatura.",
    elements: [28, 46, 78, 110]
  },
  {
    number: 11,
    iupac: "11",
    cas: "IB",
    name: "Metales de acuñación",
    nameShort: "Fam. Cobre",
    valenceTerminal: "(n-1)d¹⁰ ns¹",
    valenceElectrons: 11,
    commonOx: "+1, +2, +3",
    subshell: "d",
    description: "Cobre, Plata y Oro. Conductividades eléctricas y térmicas supremas. Capa d completa (d¹⁰ s¹) que otorga nobleza química.",
    elements: [29, 47, 79, 111]
  },
  {
    number: 12,
    iupac: "12",
    cas: "IIB",
    name: "Familia del Cinc (Volátiles)",
    nameShort: "Fam. Cinc",
    valenceTerminal: "(n-1)d¹⁰ ns²",
    valenceElectrons: 12,
    commonOx: "+2",
    subshell: "d",
    description: "Subcapa d llena (d¹⁰ s²); químicamente se comportan similar a los representativos. Mercurio es el único metal líquido a 293 K.",
    elements: [30, 48, 80, 112]
  },
  {
    number: 13,
    iupac: "13",
    cas: "IIIA",
    name: "Térreos o Boroides",
    nameShort: "Térreos / Boro",
    valenceTerminal: "ns² np¹",
    valenceElectrons: 3,
    commonOx: "+3, +1",
    subshell: "p",
    description: "Inicio del bloque p. Boro es metaloide semiconductor; Aluminio es el metal más abundante en la corteza terrestre.",
    elements: [5, 13, 31, 49, 81, 113]
  },
  {
    number: 14,
    iupac: "14",
    cas: "IVA",
    name: "Carbonoides",
    nameShort: "Carbonoides",
    valenceTerminal: "ns² np²",
    valenceElectrons: 4,
    commonOx: "±4, +2",
    subshell: "p",
    description: "Eje de la química orgánica (Carbono), la electrónica moderna (Silicio, Germanio) y metales pesados clásicos (Estaño, Plomo).",
    elements: [6, 14, 32, 50, 82, 114]
  },
  {
    number: 15,
    iupac: "15",
    cas: "VA",
    name: "Nitrogenoides",
    nameShort: "Nitrogenoides",
    valenceTerminal: "ns² np³",
    valenceElectrons: 5,
    commonOx: "-3, +3, +5",
    subshell: "p",
    description: "Configuración semillena p³ con notable estabilidad. Desde el gas inerte diatómico N₂ hasta fósforo y metales pesados como el bismuto.",
    elements: [7, 15, 33, 51, 83, 115]
  },
  {
    number: 16,
    iupac: "16",
    cas: "VIA",
    name: "Anfígenos o Calcógenos",
    nameShort: "Calcógenos / Anfígenos",
    valenceTerminal: "ns² np⁴",
    valenceElectrons: 6,
    commonOx: "-2, +2, +4, +6",
    subshell: "p",
    description: "'Formadores de minerales y cobres'. Oxígeno y Azufre forman enlaces covalentes dobles y múltiples alótropos vitales para la biosfera.",
    elements: [8, 16, 34, 52, 84, 116]
  },
  {
    number: 17,
    iupac: "17",
    cas: "VIIA",
    name: "Halógenos",
    nameShort: "Halógenos",
    valenceTerminal: "ns² np⁵",
    valenceElectrons: 7,
    commonOx: "-1, +1, +3, +5, +7",
    subshell: "p",
    description: "'Formadores de sales'. No metales muy reactivos con 7 e⁻ de valencia. Ganan fácilmente 1 e⁻ para completar el octeto con alta afinidad.",
    elements: [9, 17, 35, 53, 85, 117]
  },
  {
    number: 18,
    iupac: "18",
    cas: "VIIIA",
    name: "Gases nobles",
    nameShort: "Gases nobles",
    valenceTerminal: "ns² np⁶",
    valenceElectrons: 8,
    commonOx: "0 (inertes)",
    subshell: "p",
    description: "Capa de valencia completa con octeto estable (Helio con dueto 1s²). Monoatómicos, incoloros, con las energías de ionización más altas.",
    elements: [2, 10, 18, 36, 54, 86, 118]
  }
];

export const periodsData = [
  {
    number: 1,
    n: 1,
    shellLetter: "K",
    elementCount: 2,
    subshells: "1s",
    elementsRange: "H (1) - He (2)",
    description: "Primer nivel cuántico (n=1). Contiene solo el orbital 1s con capacidad máxima para 2 electrones."
  },
  {
    number: 2,
    n: 2,
    shellLetter: "L",
    elementCount: 8,
    subshells: "2s, 2p",
    elementsRange: "Li (3) - Ne (10)",
    description: "Segundo nivel cuántico (n=2). Llenado de orbitales 2s (2 e⁻) y 2p (6 e⁻). Rige la regla del octeto de Lewis."
  },
  {
    number: 3,
    n: 3,
    shellLetter: "M",
    elementCount: 8,
    subshells: "3s, 3p",
    elementsRange: "Na (11) - Ar (18)",
    description: "Tercer nivel cuántico (n=3). Llenado de 3s y 3p. Capacidad para expandir el octeto usando orbitales 3d vacíos en enlaces."
  },
  {
    number: 4,
    n: 4,
    shellLetter: "N",
    elementCount: 18,
    subshells: "4s, 3d, 4p",
    elementsRange: "K (19) - Kr (36)",
    description: "Cuarto nivel cuántico (n=4). Incorpora la primera serie de metales de transición con llenado de la subcapa 3d (10 e⁻)."
  },
  {
    number: 5,
    n: 5,
    shellLetter: "O",
    elementCount: 18,
    subshells: "5s, 4d, 5p",
    elementsRange: "Rb (37) - Xe (54)",
    description: "Quinto nivel cuántico (n=5). Llenado de 5s, 4d y 5p. Presenta metales preciosos e importantes catalizadores industriales."
  },
  {
    number: 6,
    n: 6,
    shellLetter: "P",
    elementCount: 32,
    subshells: "6s, 4f, 5d, 6p",
    elementsRange: "Cs (55) - Rn (86)",
    description: "Sexto nivel cuántico (n=6). Incluye los 14 Lantánidos (bloque 4f). Fenómeno de contracción lantánida y efectos relativistas."
  },
  {
    number: 7,
    n: 7,
    shellLetter: "Q",
    elementCount: 32,
    subshells: "7s, 5f, 6d, 7p",
    elementsRange: "Fr (87) - Og (118)",
    description: "Séptimo nivel cuántico (n=7). Incluye los Actínidos radioactivos (5f) y los elementos transuránicos superpesados sintetizados."
  }
];

export const periodicTrendsData = [
  {
    id: "radius",
    label: "Radio Atómico",
    shortDesc: "Distancia núcleo-electrón de valencia",
    unit: "pm",
    dirH: "left", // increases to left
    dirV: "down", // increases downwards
    increaseArrowLabelH: "Aumenta hacia la Izquierda (menor Z_eff)",
    increaseArrowLabelV: "Aumenta hacia Abajo (+ capas cuánticas n)",
    rationale: "Hacia abajo aumenta el número de niveles cuánticos (n), expandiendo la nube electrónica. En un período, hacia la izquierda disminuye la carga nuclear efectiva (Z_eff), por lo que el núcleo atrae con menor fuerza a los electrones de valencia.",
    keyProperty: "radius",
    min: 30,
    max: 298
  },
  {
    id: "ionization",
    label: "Energía de Ionización",
    shortDesc: "Energía para arrancar el 1er electrón",
    unit: "kJ/mol",
    dirH: "right", // increases to right
    dirV: "up", // increases upwards
    increaseArrowLabelH: "Aumenta hacia la Derecha (+ Z_eff y menor radio)",
    increaseArrowLabelV: "Aumenta hacia Arriba (menor apantallamiento)",
    rationale: "Hacia la derecha en un período aumenta la carga nuclear efectiva (Z_eff) y disminuye el radio atómico, sujetando fuertemente a los electrones y requiriendo mayor energía para ionizar el átomo. Hacia arriba disminuyen las capas de apantallamiento.",
    keyProperty: "ionization",
    min: 375,
    max: 2372
  },
  {
    id: "electronegativity",
    label: "Electronegatividad (Pauling)",
    shortDesc: "Fuerza atractora de electrones en enlace",
    unit: "Pauling",
    dirH: "right",
    dirV: "up",
    increaseArrowLabelH: "Aumenta hacia la Derecha (Flúor = 3.98)",
    increaseArrowLabelV: "Aumenta hacia Arriba (menor radio atómico)",
    rationale: "Capacidad de un átomo para atraer hacia sí el par de electrones en un enlace químico covalente. Máximo en el Flúor (3.98) y mínimo en el Cesio/Francio (0.7). Nota: Los gases nobles estándar no participan en esta escala.",
    keyProperty: "en",
    min: 0.79,
    max: 3.98
  },
  {
    id: "electron_affinity",
    label: "Afinidad Electrónica",
    shortDesc: "Energía liberada al captar un electrón",
    unit: "kJ/mol",
    dirH: "right",
    dirV: "up",
    increaseArrowLabelH: "Aumenta hacia la Derecha (Halógenos máx)",
    increaseArrowLabelV: "Aumenta hacia Arriba (alta avidez)",
    rationale: "Variación de energía que acompaña a la ganancia de un electrón por un átomo gaseoso para formar un anión (X + e⁻ → X⁻). Los halógenos tienen la mayor afinidad; el Cloro libera la mayor energía (349 kJ/mol).",
    keyProperty: "electron_affinity",
    min: -50,
    max: 349
  },
  {
    id: "metallic_character",
    label: "Carácter Metálico / Electropositividad",
    shortDesc: "Tendencia a ceder electrones y oxidarse",
    unit: "Relativo",
    dirH: "left",
    dirV: "down",
    increaseArrowLabelH: "Aumenta hacia la Izquierda (baja E.I.)",
    increaseArrowLabelV: "Aumenta hacia Abajo (mayor facilidad de pérdida)",
    rationale: "Mide la facilidad con que un elemento cede sus electrones de valencia para formar cationes. Es máximo en los metales alcalinos inferiores (Fr, Cs) y mínimo en los no metales de la esquina superior derecha (He, F, O).",
    keyProperty: "metallic_character",
    min: 0,
    max: 100
  },
  {
    id: "melt",
    label: "Punto de Fusión",
    shortDesc: "Temperatura de transición sólido → líquido",
    unit: "K",
    dirH: "none",
    dirV: "none",
    rationale: "Indica la fuerza de las fuerzas intermoleculares o del enlace metálico/covalente en red. Máximo en el Wolframio (3695 K) y Carbono (3823 K). Mínimo en el Helio (0.95 K).",
    keyProperty: "melt",
    min: 0.95,
    max: 3915
  },
  {
    id: "boil",
    label: "Punto de Ebullición",
    shortDesc: "Temperatura de transición líquido → gas",
    unit: "K",
    dirH: "none",
    dirV: "none",
    rationale: "Energía térmica necesaria para vencer completamente la cohesión molecular o atómica. Máximo en Wolframio (5828 K) y Renio (5869 K). Mínimo en Helio (4.2 K).",
    keyProperty: "boil",
    min: 4.2,
    max: 5869
  },
  {
    id: "density",
    label: "Densidad",
    shortDesc: "Masa por unidad de volumen a 293 K",
    unit: "g/cm³",
    dirH: "none",
    dirV: "none",
    rationale: "Los metales del centro del período 6 (Osmio: 22.59 g/cm³, Iridio: 22.56 g/cm³, Platino: 21.45 g/cm³) poseen las mayores densidades debido a la contracción lantánida y masa atómica elevada.",
    keyProperty: "density",
    min: 0.000089,
    max: 22.59
  }
];
