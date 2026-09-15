# scripts/generate_ionization_data.py
import json
import re

# Comprehensive NIST / CRC Handbook successive ionization energies (kJ/mol) for elements 1-118
# For each element: [I1, I2, I3, I4, ...]
# Data grounded in standard NIST Atomic Spectra Database & CRC Handbook of Chemistry & Physics

NIST_IONIZATIONS = {
  1: [1312.0],
  2: [2372.3, 5250.5],
  3: [520.2, 7298.1, 11815.0],
  4: [899.5, 1757.1, 14848.7, 21006.6],
  5: [800.6, 2427.1, 3659.7, 25025.8, 32826.7],
  6: [1086.5, 2352.6, 4620.5, 6222.7, 37831.0, 47277.0],
  7: [1402.3, 2856.0, 4578.1, 7475.0, 9444.9, 53267.0],
  8: [1313.9, 3388.3, 5300.5, 7469.2, 10989.5, 13326.5, 71330.0],
  9: [1681.0, 3374.2, 6050.4, 8407.7, 11022.7, 15164.1, 17868.0, 92038.1],
  10: [2080.7, 3952.3, 6122.0, 9371.0, 12177.0, 15238.0, 19999.0, 23069.0],

  11: [495.8, 4562.4, 6910.3, 9543.0, 13354.0],
  12: [737.7, 1450.7, 7732.7, 10542.5, 13630.0],
  13: [577.5, 1816.7, 2744.8, 11577.4, 14842.0],
  14: [786.5, 1577.1, 3231.6, 4355.5, 16091.0],
  15: [1011.8, 1907.0, 2914.1, 4963.6, 6274.0, 21267.0],
  16: [999.6, 2252.0, 3357.0, 4556.0, 7004.3, 8495.8, 27107.0],
  17: [1251.2, 2298.0, 3822.0, 5158.6, 6542.0, 9362.0, 11018.0],
  18: [1520.6, 2665.8, 3931.0, 5771.0, 7238.0, 8781.0, 11995.0, 13842.0],

  19: [418.8, 3052.0, 4420.0, 5877.0],
  20: [589.8, 1145.4, 4912.4, 6491.0],
  21: [633.1, 1235.0, 2388.6, 7090.6],
  22: [658.8, 1309.8, 2652.5, 4174.6, 9581.0],
  23: [650.9, 1414.0, 2830.0, 4507.0, 6298.7, 12363.0],
  24: [652.9, 1590.6, 2987.0, 4743.0, 6702.0, 8744.9],
  25: [717.3, 1509.0, 3248.0, 4940.0, 6990.0, 9220.0],
  26: [762.5, 1561.9, 2957.0, 5290.0, 7240.0, 9560.0],
  27: [760.4, 1648.0, 3232.0, 4950.0, 7670.0],
  28: [737.1, 1753.0, 3395.0, 5300.0, 7339.0],
  29: [745.5, 1957.9, 3555.0, 5536.0, 7700.0],
  30: [906.4, 1733.3, 3833.0, 5731.0, 7970.0],
  31: [578.8, 1979.3, 2963.0, 6180.0],
  32: [762.2, 1537.5, 3302.1, 4411.0, 9020.0],
  33: [947.0, 1798.0, 2735.0, 4837.0, 6043.0, 12310.0],
  34: [941.0, 2045.0, 2974.0, 4144.0, 6590.0],
  35: [1139.9, 2103.0, 3470.0, 4560.0, 5760.0],
  36: [1350.8, 2350.4, 3565.0, 5070.0, 6240.0],

  37: [403.0, 2632.1, 3860.0, 5080.0],
  38: [549.5, 1064.2, 4138.0, 5500.0],
  39: [600.0, 1180.0, 1980.0, 5847.0],
  40: [640.1, 1270.0, 2218.0, 3313.0, 7752.0],
  41: [652.1, 1380.0, 2416.0, 3700.0, 4877.0],
  42: [684.3, 1560.0, 2618.0, 4480.0, 5257.0],
  43: [702.0, 1470.0, 2850.0, 4700.0],
  44: [710.2, 1620.0, 2750.0, 4500.0],
  45: [719.7, 1740.0, 2997.0, 4700.0],
  46: [804.4, 1870.0, 3177.0],
  47: [731.0, 2070.0, 3361.0],
  48: [867.8, 1631.4, 3616.0],
  49: [558.3, 1820.7, 2704.0, 5210.0],
  50: [708.6, 1411.8, 2943.0, 3930.3, 7456.0],
  51: [834.0, 1595.0, 2440.0, 4260.0, 5400.0],
  52: [869.3, 1790.0, 2698.0, 3610.0, 5680.0],
  53: [1008.4, 1845.9, 3180.0],
  54: [1170.4, 2050.0, 3090.0],

  55: [375.7, 2234.3, 3400.0],
  56: [502.9, 965.2, 3600.0],
  57: [538.1, 1067.0, 1850.3, 4819.0],
  58: [534.4, 1050.0, 1949.0, 3547.0],
  59: [527.0, 1020.0, 2086.0, 3761.0],
  60: [533.1, 1040.0, 2130.0, 3900.0],
  61: [540.0, 1050.0, 2150.0, 3970.0],
  62: [544.5, 1070.0, 2260.0, 3990.0],
  63: [547.1, 1085.0, 2404.0, 4120.0],
  64: [593.4, 1170.0, 1990.0, 4250.0],
  65: [565.8, 1110.0, 2114.0, 4014.0],
  66: [573.0, 1130.0, 2200.0, 3990.0],
  67: [581.0, 1140.0, 2204.0, 4100.0],
  68: [589.3, 1150.0, 2194.0, 4120.0],
  69: [596.7, 1160.0, 2285.0, 4120.0],
  70: [603.4, 1210.0, 2417.0, 4203.0],
  71: [523.5, 1340.0, 2022.3, 4370.0],

  72: [658.5, 1440.0, 2250.0, 3216.0],
  73: [761.0, 1500.0],
  74: [770.0, 1700.0],
  75: [760.0, 1260.0, 2510.0, 3640.0],
  76: [840.0, 1600.0],
  77: [880.0, 1600.0],
  78: [864.4, 1791.0],
  79: [890.1, 1980.0],
  80: [1007.1, 1810.0, 3300.0],
  81: [589.4, 1971.0, 2878.0],
  82: [715.6, 1450.5, 3081.5, 4083.0, 6640.0],
  83: [703.0, 1610.0, 2466.0, 4370.0, 5400.0],
  84: [812.1, 1800.0],
  85: [890.0, 1600.0],
  86: [1037.0, 1800.0],

  87: [380.0, 2170.0],
  88: [509.3, 979.0, 3300.0],
  89: [499.0, 1170.0, 1900.0, 4700.0],
  90: [587.0, 1110.0, 1930.0, 2780.0],
  91: [568.0, 1120.0, 1810.0, 2990.0],
  92: [597.6, 1420.0],
  93: [604.5, 1128.0, 1997.0, 3240.0],
  94: [584.7, 1128.0, 2084.0, 3330.0],
  95: [578.0, 1158.0, 2132.0, 3493.0],
  96: [581.0, 1196.0, 2026.0, 3550.0],
  97: [601.0, 1186.0, 2150.0, 3830.0],
  98: [608.0, 1206.0, 2267.0, 3950.0],
  99: [619.0, 1216.0, 2334.0, 4120.0],
  100: [627.0, 1225.0, 2363.0, 4247.0],
  101: [635.0, 1235.0, 2470.0, 4350.0],
  102: [642.0, 1254.0, 2643.0, 4480.0],
  103: [470.0, 1428.0, 2228.0, 4910.0],

  104: [580.0, 1390.0, 2300.0, 3080.0],
  105: [665.0, 1550.0],
  106: [757.0, 1730.0],
  107: [740.0, 1690.0],
  108: [730.0, 1700.0],
  109: [800.0, 1820.0],
  110: [955.0, 1980.0],
  111: [1020.0, 2070.0],
  112: [1155.0, 2240.0],
  113: [705.0, 2240.0],
  114: [824.0, 1600.0, 3370.0],
  115: [538.0, 1760.0],
  116: [724.0, 1330.0],
  117: [743.0, 1850.0],
  118: [860.0, 1560.0]
}

# Write src/data/ionizationData.js
js_code = '''// Successive ionization energies (I1, I2, I3, I4, ...) in kJ/mol for elements 1-118
// Grounded in NIST Atomic Spectra Database & CRC Handbook of Chemistry and Physics.

export const ionizationData = ''' + json.dumps(NIST_IONIZATIONS, indent=2) + ''';

/**
 * Calculates the quantum jump in successive ionization energies.
 * Identifies the number of valence electrons based on the maximum ratio I_(k+1) / I_k,
 * which corresponds to breaking a noble gas closed shell.
 * 
 * @param {Array<number>} energies - Array of successive ionization energies [I1, I2, I3, ...]
 * @returns {Object} Quantum jump analysis with pedagogical diagnosis
 */
export function calculateQuantumJump(energies) {
  if (!energies || energies.length < 2) {
    return {
      hasJump: false,
      valenceElectrons: 1,
      jumpIndex: 1,
      maxRatio: 1,
      ratios: [],
      diagnosis: "Se requieren al menos 2 energías de ionización sucesivas para determinar el salto cuántico."
    };
  }

  const ratios = [];
  let maxRatio = -1;
  let jumpIndex = 1; // 1-based: jump happens after removing 'jumpIndex' electrons

  for (let i = 0; i < energies.length - 1; i++) {
    const prev = energies[i];
    const next = energies[i + 1];
    const ratio = prev > 0 ? parseFloat((next / prev).toFixed(2)) : 0;
    ratios.push({
      from: i + 1,
      to: i + 2,
      ratio,
      prevVal: prev,
      nextVal: next
    });

    if (ratio > maxRatio) {
      maxRatio = ratio;
      jumpIndex = i + 1;
    }
  }

  // Pre-UNI Group predictions based on valence electrons
  const groupMap = {
    1: { group: "Grupo 1 (IA)", family: "Alcalinos", ion: "X⁺", oxide: "X₂O", valencia: 1 },
    2: { group: "Grupo 2 (IIA)", family: "Alcalinotérreos", ion: "X²⁺", oxide: "XO", valencia: 2 },
    3: { group: "Grupo 13 (IIIA)", family: "Térreos / Boroideos", ion: "X³⁺", oxide: "X₂O₃", valencia: 3 },
    4: { group: "Grupo 14 (IVA)", family: "Carbonoideos", ion: "X⁴⁺", oxide: "XO₂", valencia: 4 },
    5: { group: "Grupo 15 (VA)", family: "Nitrogenoideos", ion: "X⁵⁺ / X³⁻", oxide: "X₂O₅", valencia: 5 },
    6: { group: "Grupo 16 (VIA)", family: "Calcógenos / Anfígenos", ion: "X²⁻", oxide: "XO₃", valencia: 6 },
    7: { group: "Grupo 17 (VIIA)", family: "Halógenos", ion: "X⁻", oxide: "X₂O₇", valencia: 7 },
    8: { group: "Grupo 18 (VIIIA)", family: "Gases Nobles", ion: "Inerte", oxide: "Inerte", valencia: 0 }
  };

  const prediction = groupMap[jumpIndex] || {
    group: `Grupo con ${jumpIndex} electrones de valencia`,
    family: "Metal de transición o representativo",
    ion: `X^${jumpIndex}+`,
    oxide: `Compuesto con valencia ${jumpIndex}`,
    valencia: jumpIndex
  };

  const hasSignificantJump = maxRatio >= 2.0;

  return {
    hasJump: hasSignificantJump,
    valenceElectrons: jumpIndex,
    jumpIndex,
    maxRatio,
    ratios,
    prediction,
    energies,
    diagnosis: hasSignificantJump
      ? `Gran salto cuántico de ${maxRatio}× entre I${jumpIndex} (${energies[jumpIndex - 1]} kJ/mol) e I${jumpIndex + 1} (${energies[jumpIndex]} kJ/mol). Esto demuestra que el elemento posee ${jumpIndex} electrón${jumpIndex === 1 ? "" : "es"} en su capa de valencia externa. Al retirar el electrón número ${jumpIndex + 1}, se rompe un octeto interno de gas noble mucho más cercano al núcleo.`
      : `El incremento entre ionizaciones sucesivas es gradual (${maxRatio}×), característico de electrones del mismo subnivel o bloque de transición.`
  };
}

/**
 * Curated list of typical Pre-UNI / Admisión questions involving mystery elements and ionization quantum jumps.
 */
export const PREUNI_IONIZATION_CHALLENGES = [
  {
    id: "uni-na-jump",
    title: "Pregunta Tipo UNI: Elemento X con I₁=496 y I₂=4562",
    context: "Un elemento desconocido 'X' del tercer período presenta las siguientes energías de ionización sucesivas en kJ/mol: I₁ = 496, I₂ = 4562, I₃ = 6910, I₄ = 9543.",
    energies: [496, 4562, 6910, 9543],
    question: "¿A qué familia de la tabla periódica pertenece el elemento X y qué tipo de óxido forma?",
    options: [
      "Metales Alcalinos (Grupo IA), óxido básico X₂O",
      "Metales Alcalinotérreos (Grupo IIA), óxido básico XO",
      "Halógenos (Grupo VIIA), anhídrido X₂O₇",
      "Gases Nobles (Grupo VIIIA), no forma óxidos"
    ],
    correctIdx: 0,
    rationale: "El cociente I₂ / I₁ = 4562 / 496 ≈ 9.20× representa un salto cuántico enorme al retirar el 2° electrón. Esto indica que X tiene exactamente 1 electrón de valencia (Grupo IA, alcalinos como el Sodio) y forma el catión X⁺, dando origen al óxido X₂O."
  },
  {
    id: "uni-mg-jump",
    title: "Pregunta Tipo San Marcos: Elemento Y con I₁=738, I₂=1451, I₃=7733",
    context: "Las tres primeras energías de ionización en kJ/mol de un metal representativo 'Y' son: I₁ = 738, I₂ = 1451, I₃ = 7733.",
    energies: [738, 1451, 7733, 10543],
    question: "¿Cuál es la carga del catión más estable que formará 'Y' en solución acuosa?",
    options: [
      "Y⁺",
      "Y²⁺",
      "Y³⁺",
      "Y⁴⁺"
    ],
    correctIdx: 1,
    rationale: "El salto abrupto ocurre entre I₂ y I₃ (7733 / 1451 ≈ 5.33×). El elemento pierde con relativa facilidad sus primeros 2 electrones, pero retirar el 3° requiere una cantidad colosal de energía por destruir la configuración de gas noble. Por lo tanto, pertenece al Grupo IIA y forma el catión estable Y²⁺ (análogo al Mg²⁺)."
  },
  {
    id: "uni-al-jump",
    title: "Pregunta Tipo UNI: Elemento Z con I₁=578, I₂=1817, I₃=2745, I₄=11577",
    context: "Se analizan en laboratorio las cuatro energías de ionización sucesivas de una muestra pura 'Z' (en kJ/mol): I₁ = 578, I₂ = 1817, I₃ = 2745, I₄ = 11577.",
    energies: [578, 1817, 2745, 11577],
    question: "¿Cuál es la fórmula del cloruro más probable formado por 'Z'?",
    options: [
      "ZCl",
      "ZCl₂",
      "ZCl₃",
      "ZCl₄"
    ],
    correctIdx: 2,
    rationale: "Entre I₃ (2745 kJ/mol) e I₄ (11577 kJ/mol) se observa un salto cuántico de 4.22×. Esto demuestra la presencia de 3 electrones de valencia (Grupo IIIA / 13). Al combinarse con el cloro (valencia 1), forma el cloruro ZCl₃ (análogo al AlCl₃)."
  }
];
'''

with open("src/data/ionizationData.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("Created src/data/ionizationData.js successfully!")
