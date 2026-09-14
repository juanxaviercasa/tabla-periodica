// misconceptionsData.js - Errores Frecuentes de Examen y Didáctica Antialucinación
// Basado en el marco 'Chemical Misconceptions' de la Royal Society of Chemistry (RSC) y exámenes de admisión UNI / UNMSM

export const misconceptionsData = [
  {
    id: "radio-atomico-zeff",
    title: "La Trampa del Radio Atómico y Carga Nuclear Efectiva (Zeff)",
    tag: "Tendencias Periódicas",
    trapDescription: "Pensar que hacia la derecha en un período el átomo es más grande porque tiene más partículas (más protones y más electrones).",
    scientificReality: "En un mismo período, los electrones entran al mismo nivel de energía cuántico (n), mientras que el núcleo suma protones (+1 por cada elemento sucesivo). La carga nuclear efectiva Zeff = Z − S aumenta de izquierda a derecha, atrayendo la nube electrónica con mayor fuerza hacia el centro y contrayendo el radio atómico.",
    keyComparison: "Radio Atómico: Na (186 pm) > Mg (160 pm) > Al (143 pm) > Si (118 pm) > P (110 pm) > S (102 pm) > Cl (99 pm)",
    admissionTip: "Pregunta fija UNI: En un período el átomo con MENOR radio es el halógeno o gas noble (extremo derecho), y el de MAYOR radio es el metal alcalino (extremo izquierdo).",
    examQuestion: {
      prompt: "¿Por qué el átomo de Cloro (Z=17) tiene menor radio atómico que el átomo de Sodio (Z=11) si tiene 6 protones y 6 electrones más?",
      answer: "Porque ambos tienen 3 niveles cuánticos ocupados, pero el Cloro tiene 17 protones en su núcleo atrayendo a la nube electrónica con mayor carga nuclear efectiva (Zeff ≈ +7) que el Sodio (Zeff ≈ +1), contrayendo el radio."
    }
  },
  {
    id: "valencia-vs-oxidacion",
    title: "Confundir Valencia con Estado de Oxidación (E.O.)",
    tag: "Nomenclatura Inorgánica",
    trapDescription: "Decir que el oxígeno tiene valencia '−2' o que la valencia siempre lleva signo algebraico (+ o −).",
    scientificReality: "La Valencia es un número entero puro sin signo que mide la capacidad de combinación (enlaces formados) de un átomo (ej. el oxígeno tiene valencia 2; el nitrógeno valencias 3 y 5). El Estado de Oxidación (E.O.) es la carga eléctrica hipotética que adquiere el átomo al asignar todos los pares de enlace al elemento más electronegativo, y SIEMPRE lleva signo (+2, −2, +1, etc.) o es cero.",
    keyComparison: "En H₂O: Valencia del O = 2 (forma 2 enlaces). E.O. del O = −2. En H₂O₂ (agua oxigenada): Valencia del O = 2. E.O. del O = −1.",
    admissionTip: "Trampa San Marcos: Si te preguntan 'valencia del carbono en el metano (CH₄)', la respuesta es 4 (sin signo). Si te preguntan 'estado de oxidación', la respuesta es −4.",
    examQuestion: {
      prompt: "¿Cuál es la valencia y el estado de oxidación del oxígeno en el difluoruro de oxígeno (OF₂)?",
      answer: "Valencia = 2 (forma 2 enlaces covalentes con los átomos de flúor). Estado de oxidación = +2 (porque el flúor es más electronegativo que el oxígeno y atrae los electrones del enlace)."
    }
  },
  {
    id: "perdida-electrones-transicion",
    title: "El Orden de Pérdida de Electrones en Metales de Transición",
    tag: "Estructura Cuántica",
    trapDescription: "Al formar un catión de metal de transición (como Fe²⁺ o Cu⁺), quitar los electrones del subnivel (n-1)d porque 'fue el último en llenarse al aplicar el serrucho'.",
    scientificReality: "Al ionizarse un átomo, los electrones que se desprenden primero son SIEMPRE los del nivel cuántico principal más externo (mayor n). En metales de transición del 4° período, los electrones 4s se pierden antes que los 3d.",
    keyComparison: "Hierro neutro: [Ar] 4s² 3d⁶ → Catión ferroso Fe²⁺: [Ar] 3d⁶ (NO [Ar] 4s² 3d⁴) → Catión férrico Fe³⁺: [Ar] 3d⁵.",
    admissionTip: "Pregunta clásica UNI: Al ionizar Fe neutro a Fe³⁺, se expulsan 2 electrones del orbital 4s y luego 1 electrón del subnivel 3d, dejando un subnivel 3d⁵ de máxima estabilidad (5 electrones desapareados).",
    examQuestion: {
      prompt: "¿Cuál es la configuración electrónica y el número de electrones desapareados del catión Ni²⁺ (Z=28)?",
      answer: "La configuración es [Ar] 3d⁸ (se pierden los dos electrones del 4s). Posee 2 electrones desapareados en los orbitales d según la regla de Hund."
    }
  },
  {
    id: "anomalias-antiserrucho",
    title: "Las Excepciones Antiserrucho (Cr, Cu, Mo, Ag, Au)",
    tag: "Configuración Electrónica",
    trapDescription: "Aplicar mecánicamente la regla de Möller y escribir terminaciones d⁴ o d⁹ como 4s² 3d⁴ (Cromo) o 4s² 3d⁹ (Cobre).",
    scientificReality: "La naturaleza busca la mínima energía y la máxima simetría de intercambio cuántico. Los subniveles semillenos (d⁵) y completamente llenos (d¹⁰) tienen una estabilidad excepcional. Por ello, un electrón del subnivel s salta al subnivel d para formar configuraciones s¹ d⁵ o s¹ d¹⁰.",
    keyComparison: "Cromo (Z=24): [Ar] 4s¹ 3d⁵ (6 electrones desapareados). Cobre (Z=29): [Ar] 4s¹ 3d¹⁰ (1 electrón desapareado). Plata (Z=47): [Kr] 5s¹ 4d¹⁰.",
    admissionTip: "En exámenes UNI y San Marcos, el Cromo y el Cobre son las dos preguntas trampa por excelencia en temas de configuración electrónica y magnetismo (el Cr es fuertemente paramagnético con 6 espines paralelos).",
    examQuestion: {
      prompt: "¿Cuántos orbitales desapareados tiene el átomo de Cromo (Z=24) en su estado fundamental?",
      answer: "Tiene 6 orbitales desapareados (1 en el orbital 4s y 5 en los orbitales 3d), debido a la configuración anómala [Ar] 4s¹ 3d⁵."
    }
  },
  {
    id: "bohr-vs-reempe",
    title: "El Modelo Atómico: Bohr vs Nube Cuántica (REEMPE)",
    tag: "Modelos Atómicos",
    trapDescription: "Creer que los electrones orbitan como pequeños planetas rígidos sobre caminos circulares predecibles alrededor del núcleo.",
    scientificReality: "El modelo de Bohr (1913) es un modelo didáctico simplificado que solo funciona rigurosamente para átomos hidrogenoides (1 solo electrón). En la mecánica cuántica moderna (Schrödinger, Heisenberg), es imposible conocer simultáneamente la posición y la velocidad del electrón (Principio de Incertidumbre). El electrón se describe como una nube de probabilidad llamada REEMPE (Región de Espacio Energético de Mayor Probabilidad Electrónica u orbital).",
    keyComparison: "Órbita de Bohr: Trayectoria fija 2D. Orbital (REEMPE): Región tridimensional 3D donde la probabilidad de hallar al electrón es superior al 90%.",
    admissionTip: "Pregunta San Marcos: Un orbital atómico puede albergar como máximo 2 electrones con espines opuestos o antiparalelos (Principio de Exclusión de Pauli).",
    examQuestion: {
      prompt: "¿Qué principio de la física cuántica refuta definitivamente la existencia de órbitas circulares definidas en los átomos?",
      answer: "El Principio de Incertidumbre de Heisenberg (Δx · Δp ≥ h / 4π), que establece que no se puede determinar simultáneamente y con precisión la posición y el momento lineal del electrón."
    }
  },
  {
    id: "masa-decimal-vs-numero-masa",
    title: "Masa Atómica Decimal vs Número de Masa Entero",
    tag: "Estructura Nuclear",
    trapDescription: "Creer que los protones o neutrones se 'rompen en fracciones' para dar masas con decimales como 35.45 u en el Cloro o 63.55 u en el Cobre.",
    scientificReality: "Todo núcleo atómico individual tiene un número entero exacto de protones y neutrones; su número de masa A = Z + N es SIEMPRE un entero positivo. El valor decimal que aparece en las casillas de la tabla periódica es la Masa Atómica Estándar, que es el promedio ponderado de todos los isótopos naturales estables según su porcentaje de abundancia en la Tierra.",
    keyComparison: "Cloro: Isótopo ³⁵Cl (A=35, 18 neutrones, 75.77%) + Isótopo ³⁷Cl (A=37, 20 neutrones, 24.23%) → Masa promedio = 35.45 u.",
    admissionTip: "Fórmula de admisión UNI / San Marcos: Ā = (A₁·%₁ + A₂·%₂ + ... + An·%n) / 100%.",
    examQuestion: {
      prompt: "¿Por qué ningún átomo de Cloro en la naturaleza pesa exactamente 35.45 u?",
      answer: "Porque el 35.45 u es un promedio estadístico ponderado. Cada átomo de cloro individual es un isótopo específico: o es un átomo de Cloro-35 (masa ~34.97 u) o es un átomo de Cloro-37 (masa ~36.97 u)."
    }
  }
];

export function getMisconception(id) {
  if (!id) return null;
  return misconceptionsData.find(m => m.id === id) || null;
}
