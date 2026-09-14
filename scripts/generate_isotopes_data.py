# generate_isotopes_data.py
import json

isotopes_data = {
  "H": {
    "symbol": "H",
    "name": "Hidrógeno",
    "z": 1,
    "standard_mass": 1.008,
    "question_addressed": "¿Por qué la masa atómica del Hidrógeno es 1.008 u si el protio tiene masa cercana a 1?",
    "explanation": "El 99.985% es Protio (¹H, sin neutrones), pero existe un 0.015% de Deuterio (²H, con 1 neutrón y masa ~2.014 u), lo que eleva ligeramente el promedio ponderado a 1.008 u.",
    "isotopes": [
      { "name": "Protio", "symbol": "¹H", "a": 1, "z": 1, "neutrons": 0, "mass_u": 1.0078, "abundance_pct": 99.985, "is_stable": True, "decay_mode": "Estable", "highlight": "El único núcleo sin neutrones" },
      { "name": "Deuterio", "symbol": "²H", "a": 2, "z": 1, "neutrons": 1, "mass_u": 2.0141, "abundance_pct": 0.015, "is_stable": True, "decay_mode": "Estable", "highlight": "Forma el agua pesada (D₂O) en reactores" },
      { "name": "Tritio", "symbol": "³H", "a": 3, "z": 1, "neutrons": 2, "mass_u": 3.0160, "abundance_pct": 0.0001, "is_stable": False, "decay_mode": "Beta negativa (β⁻)", "highlight": "Radiactivo, vida media 12.3 años" }
    ],
    "calculation_steps": [
      "1. Masa promedio ponderada: Ā = (m₁ × %₁ + m₂ × %₂) / 100",
      "2. Ā = (1.0078 × 99.985 + 2.0141 × 0.015) / 100",
      "3. Ā = (100.7649 + 0.0302) / 100 = 1.008 u"
    ]
  },
  "C": {
    "symbol": "C",
    "name": "Carbono",
    "z": 6,
    "standard_mass": 12.011,
    "question_addressed": "¿Por qué la masa atómica del Carbono es 12.011 u si el patrón estándar ¹²C tiene exactamente 12.000 u?",
    "explanation": "Porque el carbono natural contiene aproximadamente 1.07% del isótopo pesado Carbono-13 (¹³C, con 7 neutrones), el cual desplaza el promedio por encima de 12 exacto.",
    "isotopes": [
      { "name": "Carbono-12", "symbol": "¹²C", "a": 12, "z": 6, "neutrons": 6, "mass_u": 12.0000, "abundance_pct": 98.93, "is_stable": True, "decay_mode": "Estable", "highlight": "Patrón de masa atómica internacional (exactamente 12 u)" },
      { "name": "Carbono-13", "symbol": "¹³C", "a": 13, "z": 6, "neutrons": 7, "mass_u": 13.0034, "abundance_pct": 1.07, "is_stable": True, "decay_mode": "Estable", "highlight": "Usado en espectroscopía de RMN biológica" },
      { "name": "Carbono-14", "symbol": "¹⁴C", "a": 14, "z": 6, "neutrons": 8, "mass_u": 14.0032, "abundance_pct": 0.0000000001, "is_stable": False, "decay_mode": "Beta negativa (β⁻)", "highlight": "Datación de restos fósiles (vida media 5730 años)" }
    ],
    "calculation_steps": [
      "1. Ā = (m(¹²C) × % + m(¹³C) × %) / 100",
      "2. Ā = (12.0000 × 98.93 + 13.0034 × 1.07) / 100",
      "3. Ā = (1187.16 + 13.91) / 100 = 12.011 u"
    ]
  },
  "Cl": {
    "symbol": "Cl",
    "name": "Cloro",
    "z": 17,
    "standard_mass": 35.45,
    "question_addressed": "¿Por qué la masa atómica del Cloro es 35.45 u (con decimales) si ningún átomo de cloro tiene 35.45 partículas?",
    "explanation": "No existen átomos con 35.45 nucleones. En un puñado de sal, el 75.77% de los átomos son Cloro-35 (18 neutrones) y el 24.23% son Cloro-37 (20 neutrones). La masa atómica de la tabla periódica es la media ponderada estadística de esa mezcla natural.",
    "isotopes": [
      { "name": "Cloro-35", "symbol": "³⁵Cl", "a": 35, "z": 17, "neutrons": 18, "mass_u": 34.969, "abundance_pct": 75.77, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo más abundante (~3 de cada 4 átomos de cloro)" },
      { "name": "Cloro-37", "symbol": "³⁷Cl", "a": 37, "z": 17, "neutrons": 20, "mass_u": 36.966, "abundance_pct": 24.23, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo pesado (~1 de cada 4 átomos de cloro)" }
    ],
    "calculation_steps": [
      "1. Ā = (m(³⁵Cl) × 75.77% + m(³⁷Cl) × 24.23%) / 100%",
      "2. Ā = (34.969 × 75.77 + 36.966 × 24.23) / 100",
      "3. Ā = (2649.60 + 895.69) / 100 = 35.453 u ≈ 35.45 u"
    ]
  },
  "Cu": {
    "symbol": "Cu",
    "name": "Cobre",
    "z": 29,
    "standard_mass": 63.55,
    "question_addressed": "¿Cómo se calcula en el examen de admisión UNI la abundancia porcentual del Cobre conociendo su masa promedio 63.55 u?",
    "explanation": "El cobre natural tiene dos isótopos estables: ⁶³Cu (masa ~62.93 u) y ⁶⁵Cu (masa ~64.93 u). Planteando la ecuación x + y = 100 y 62.93x + 64.93y = 6355, se obtiene exactamente x = 69.15% y y = 30.85%.",
    "isotopes": [
      { "name": "Cobre-63", "symbol": "⁶³Cu", "a": 63, "z": 29, "neutrons": 34, "mass_u": 62.930, "abundance_pct": 69.15, "is_stable": True, "decay_mode": "Estable", "highlight": "El más abundante (~69.15%)" },
      { "name": "Cobre-65", "symbol": "⁶⁵Cu", "a": 65, "z": 29, "neutrons": 36, "mass_u": 64.928, "abundance_pct": 30.85, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo pesado con 36 neutrones (~30.85%)" }
    ],
    "calculation_steps": [
      "1. Ā = (62.930 × 69.15 + 64.928 × 30.85) / 100",
      "2. Ā = (4351.61 + 2003.03) / 100",
      "3. Ā = 6354.64 / 100 = 63.546 u ≈ 63.55 u"
    ]
  },
  "Mg": {
    "symbol": "Mg",
    "name": "Magnesio",
    "z": 12,
    "standard_mass": 24.305,
    "question_addressed": "¿Por qué el Magnesio tiene tres isótopos estables en la naturaleza?",
    "explanation": "El magnesio es un elemento con tres núclidos estables: ²⁴Mg (78.99%), ²⁵Mg (10.00%) y ²⁶Mg (11.01%). La contribución de los dos isótopos pesados eleva la masa a 24.305 u.",
    "isotopes": [
      { "name": "Magnesio-24", "symbol": "²⁴Mg", "a": 24, "z": 12, "neutrons": 12, "mass_u": 23.985, "abundance_pct": 78.99, "is_stable": True, "decay_mode": "Estable", "highlight": "Núcleo con N=12 y Z=12 (número par-par muy estable)" },
      { "name": "Magnesio-25", "symbol": "²⁵Mg", "a": 25, "z": 12, "neutrons": 13, "mass_u": 24.986, "abundance_pct": 10.00, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo con 13 neutrones" },
      { "name": "Magnesio-26", "symbol": "²⁶Mg", "a": 26, "z": 12, "neutrons": 14, "mass_u": 25.983, "abundance_pct": 11.01, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo con 14 neutrones" }
    ],
    "calculation_steps": [
      "1. Ā = (23.985 × 78.99 + 24.986 × 10.00 + 25.983 × 11.01) / 100",
      "2. Ā = (1894.57 + 249.86 + 286.07) / 100",
      "3. Ā = 2430.50 / 100 = 24.305 u"
    ]
  },
  "Br": {
    "symbol": "Br",
    "name": "Bromo",
    "z": 35,
    "standard_mass": 79.904,
    "question_addressed": "¿Por qué la masa atómica del Bromo es casi 80 u si sus isótopos son 79 y 81?",
    "explanation": "Porque la naturaleza dividió casi exactamente a la mitad la abundancia de sus dos isótopos: ⁷⁹Br abunda en un 50.69% y ⁸¹Br abunda en un 49.31%. El promedio cae casi en el punto medio exacto (79.904 u).",
    "isotopes": [
      { "name": "Bromo-79", "symbol": "⁷⁹Br", "a": 79, "z": 35, "neutrons": 44, "mass_u": 78.918, "abundance_pct": 50.69, "is_stable": True, "decay_mode": "Estable", "highlight": "50.69% de abundancia natural" },
      { "name": "Bromo-81", "symbol": "⁸¹Br", "a": 81, "z": 35, "neutrons": 46, "mass_u": 80.916, "abundance_pct": 49.31, "is_stable": True, "decay_mode": "Estable", "highlight": "49.31% de abundancia natural" }
    ],
    "calculation_steps": [
      "1. Ā = (78.918 × 50.69 + 80.916 × 49.31) / 100",
      "2. Ā = (4000.35 + 3990.00) / 100",
      "3. Ā = 7990.35 / 100 = 79.904 u"
    ]
  },
  "Fe": {
    "symbol": "Fe",
    "name": "Hierro",
    "z": 26,
    "standard_mass": 55.845,
    "question_addressed": "¿Cuál es el isótopo más estable de todo el universo en términos de energía de enlace nuclear?",
    "explanation": "El Hierro-56 (⁵⁶Fe) y el Níquel-62 tienen la mayor energía de enlace nuclear por nucleón de la naturaleza, siendo el punto final termodinámico de las reacciones de fusión estelar.",
    "isotopes": [
      { "name": "Hierro-54", "symbol": "⁵⁴Fe", "a": 54, "z": 26, "neutrons": 28, "mass_u": 53.940, "abundance_pct": 5.85, "is_stable": True, "decay_mode": "Estable", "highlight": "5.85% de abundancia" },
      { "name": "Hierro-56", "symbol": "⁵⁶Fe", "a": 56, "z": 26, "neutrons": 30, "mass_u": 55.935, "abundance_pct": 91.75, "is_stable": True, "decay_mode": "Estable", "highlight": "Núcleo estelar de máxima estabilidad (91.75%)" },
      { "name": "Hierro-57", "symbol": "⁵⁷Fe", "a": 57, "z": 26, "neutrons": 31, "mass_u": 56.935, "abundance_pct": 2.12, "is_stable": True, "decay_mode": "Estable", "highlight": "Espectroscopía Mössbauer" },
      { "name": "Hierro-58", "symbol": "⁵⁸Fe", "a": 58, "z": 26, "neutrons": 32, "mass_u": 57.933, "abundance_pct": 0.28, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo minoritario" }
    ],
    "calculation_steps": [
      "1. Ā = (53.940 × 5.85 + 55.935 × 91.75 + 56.935 × 2.12 + 57.933 × 0.28) / 100",
      "2. Ā = (315.55 + 5132.04 + 120.70 + 16.22) / 100",
      "3. Ā = 5584.51 / 100 = 55.845 u"
    ]
  },
  "Co": {
    "symbol": "Co",
    "name": "Cobalto",
    "z": 27,
    "standard_mass": 58.933,
    "question_addressed": "¿Por qué la masa atómica del Cobalto es 58.933 u si el cobalto natural es 100% monoisotópico de Cobalto-59?",
    "explanation": "¡Es una trampa clásica de examen! Muchos asumen que una masa con decimales siempre proviene de una mezcla de isótopos. Sin embargo, el cobalto natural es 100% Cobalto-59 (⁵⁹Co). Su masa no es exactamente 59.000 u debido al 'defecto de masa' (la masa perdida convertida en energía de enlace nuclear según la equivalencia de Einstein Δm = E/c²).",
    "isotopes": [
      { "name": "Cobalto-59", "symbol": "⁵⁹Co", "a": 59, "z": 27, "neutrons": 32, "mass_u": 58.9332, "abundance_pct": 100.0, "is_stable": True, "decay_mode": "Estable", "highlight": "Único isótopo natural (100% monoisotópico)" },
      { "name": "Cobalto-60", "symbol": "⁶⁰Co", "a": 60, "z": 27, "neutrons": 33, "mass_u": 59.9338, "abundance_pct": 0.0, "is_stable": False, "decay_mode": "Beta negativa (β⁻) y gamma (γ)", "highlight": "Radioisótopo en radioterapia y medicina nuclear (t½ = 5.27 años)" }
    ],
    "calculation_steps": [
      "1. El cobalto natural es mononuclídico: abunda en un 100% como ⁵⁹₂₇Co.",
      "2. Masa atómica = 58.9332 u (el alejamiento de 59 u se debe al defecto de masa nuclear de enlace).",
      "3. En exámenes UNI se recalca que un elemento monoisotópico puede tener masa decimal por la energía de unión nuclear (Δm = E/c²)."
    ]
  },
  "O": {
    "symbol": "O",
    "name": "Oxígeno",
    "z": 8,
    "standard_mass": 15.999,
    "question_addressed": "¿Por qué la masa atómica del Oxígeno es 15.999 u y cuál fue la disputa histórica entre químicos y físicos?",
    "explanation": "El oxígeno natural tiene 3 isótopos: ¹⁶O (99.757%), ¹⁷O (0.038%) y ¹⁸O (0.205%). Históricamente, los químicos definían la masa atómica fijando la mezcla natural de O en 16.000 u, mientras los físicos fijaban ¹⁶O exacto en 16.000 u. Esta discrepancia se resolvió en 1961 adoptando el Carbono-12 como patrón universal.",
    "isotopes": [
      { "name": "Oxígeno-16", "symbol": "¹⁶O", "a": 16, "z": 8, "neutrons": 8, "mass_u": 15.9949, "abundance_pct": 99.757, "is_stable": True, "decay_mode": "Estable", "highlight": "Núcleo doblemente mágico (Z=8, N=8), ultra estable" },
      { "name": "Oxígeno-17", "symbol": "¹⁷O", "a": 17, "z": 8, "neutrons": 9, "mass_u": 16.9991, "abundance_pct": 0.038, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo minoritario con espín nuclear" },
      { "name": "Oxígeno-18", "symbol": "¹⁸O", "a": 18, "z": 8, "neutrons": 10, "mass_u": 17.9992, "abundance_pct": 0.205, "is_stable": True, "decay_mode": "Estable", "highlight": "Trazador isotópico en paleoclimatología e hidrología" }
    ],
    "calculation_steps": [
      "1. Ā = (15.9949 × 99.757 + 16.9991 × 0.038 + 17.9992 × 0.205) / 100",
      "2. Ā = (1595.603 + 0.646 + 3.690) / 100",
      "3. Ā = 1599.939 / 100 = 15.999 u"
    ]
  },
  "N": {
    "symbol": "N",
    "name": "Nitrógeno",
    "z": 7,
    "standard_mass": 14.007,
    "question_addressed": "¿Por qué la masa del Nitrógeno supera los 14 u y cómo se aprovecha en biología molecular?",
    "explanation": "El 99.636% es Nitrógeno-14 (¹⁴N) y el 0.364% es Nitrógeno-15 (¹⁵N). El isótopo pesado ¹⁵N fue crucial en el famoso experimento de Meselson y Stahl para demostrar la replicación semiconservativa del ADN.",
    "isotopes": [
      { "name": "Nitrógeno-14", "symbol": "¹⁴N", "a": 14, "z": 7, "neutrons": 7, "mass_u": 14.0031, "abundance_pct": 99.636, "is_stable": True, "decay_mode": "Estable", "highlight": "Abundancia dominante en la atmósfera terrestre" },
      { "name": "Nitrógeno-15", "symbol": "¹⁵N", "a": 15, "z": 7, "neutrons": 8, "mass_u": 15.0001, "abundance_pct": 0.364, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo pesado utilizado como trazador biológico" }
    ],
    "calculation_steps": [
      "1. Ā = (14.0031 × 99.636 + 15.0001 × 0.364) / 100",
      "2. Ā = (1395.213 + 5.460) / 100",
      "3. Ā = 1400.673 / 100 = 14.007 u"
    ]
  },
  "Li": {
    "symbol": "Li",
    "name": "Litio",
    "z": 3,
    "standard_mass": 6.94,
    "question_addressed": "¿Por qué la masa atómica del Litio (6.94 u) está mucho más cerca de 7 que de 6?",
    "explanation": "El litio natural consiste en dos isótopos estables: Litio-6 (7.59%) y Litio-7 (92.41%). Al ser el isótopo de masa 7 doce veces más abundante, atrae fuertemente la media ponderada hacia 6.94 u.",
    "isotopes": [
      { "name": "Litio-6", "symbol": "⁶Li", "a": 6, "z": 3, "neutrons": 3, "mass_u": 6.0151, "abundance_pct": 7.59, "is_stable": True, "decay_mode": "Estable", "highlight": "Absorbedor neutrónico y precursor de tritio" },
      { "name": "Litio-7", "symbol": "⁷Li", "a": 7, "z": 3, "neutrons": 4, "mass_u": 7.0160, "abundance_pct": 92.41, "is_stable": True, "decay_mode": "Estable", "highlight": "Isótopo primordial dominante en sales de litio" }
    ],
    "calculation_steps": [
      "1. Ā = (6.0151 × 7.59 + 7.0160 × 92.41) / 100",
      "2. Ā = (45.655 + 648.349) / 100",
      "3. Ā = 694.004 / 100 = 6.94 u"
    ]
  },
  "U": {
    "symbol": "U",
    "name": "Uranio",
    "z": 92,
    "standard_mass": 238.029,
    "question_addressed": "¿Qué diferencia al Uranio-235 del Uranio-238 en la química y física nuclear UNI?",
    "explanation": "El uranio natural es 99.274% ²³⁸U y apenas 0.720% ²³⁵U (más trazas de ²³⁴U). Solo el ²³⁵U es físicamente fisionable por neutrones térmicos lentos en reactores nucleares, requiriendo complejos procesos de enriquecimiento isotópico.",
    "isotopes": [
      { "name": "Uranio-235", "symbol": "²³⁵U", "a": 235, "z": 92, "neutrons": 143, "mass_u": 235.0439, "abundance_pct": 0.720, "is_stable": False, "decay_mode": "Alfa (α), fisionable (t½ = 704 Ma)", "highlight": "Combustible nuclear fisionable indispensable" },
      { "name": "Uranio-238", "symbol": "²³⁸U", "a": 238, "z": 92, "neutrons": 146, "mass_u": 238.0508, "abundance_pct": 99.274, "is_stable": False, "decay_mode": "Alfa (α), fértil (t½ = 4468 Ma)", "highlight": "Isótopo natural predominante (no fisionable directamente)" },
      { "name": "Uranio-234", "symbol": "²³⁴U", "a": 234, "z": 92, "neutrons": 142, "mass_u": 234.0410, "abundance_pct": 0.006, "is_stable": False, "decay_mode": "Alfa (α) (t½ = 245 ka)", "highlight": "Producto de la serie radiactiva del U-238" }
    ],
    "calculation_steps": [
      "1. Ā = (235.0439 × 0.720 + 238.0508 × 99.274 + 234.0410 × 0.006) / 100",
      "2. Ā = (169.232 + 23632.255 + 1.404) / 100",
      "3. Ā = 23802.89 / 100 = 238.029 u"
    ]
  },
  "Pb": {
    "symbol": "Pb",
    "name": "Plomo",
    "z": 82,
    "standard_mass": 207.2,
    "question_addressed": "¿Por qué el Plomo tiene 4 isótopos y es el punto final de las series radiactivas naturales?",
    "explanation": "Z=82 es un número mágico de protones (capa nuclear cerrada). Sus isótopos ²⁰⁶Pb, ²⁰⁷Pb y ²⁰⁸Pb son los puntos finales estables de las tres cadenas de desintegración radiactiva natural (Uranio, Actinio y Torio).",
    "isotopes": [
      { "name": "Plomo-204", "symbol": "²⁰⁴Pb", "a": 204, "z": 82, "neutrons": 122, "mass_u": 203.9730, "abundance_pct": 1.40, "is_stable": True, "decay_mode": "Estable", "highlight": "Único isótopo de plomo no radiogénico" },
      { "name": "Plomo-206", "symbol": "²⁰⁶Pb", "a": 206, "z": 82, "neutrons": 124, "mass_u": 205.9744, "abundance_pct": 24.10, "is_stable": True, "decay_mode": "Estable", "highlight": "Producto final de la serie radiactiva del Uranio-238" },
      { "name": "Plomo-207", "symbol": "²⁰⁷Pb", "a": 207, "z": 82, "neutrons": 125, "mass_u": 206.9759, "abundance_pct": 22.10, "is_stable": True, "decay_mode": "Estable", "highlight": "Producto final de la serie del Uranio-235" },
      { "name": "Plomo-208", "symbol": "²⁰⁸Pb", "a": 208, "z": 82, "neutrons": 126, "mass_u": 207.9766, "abundance_pct": 52.40, "is_stable": True, "decay_mode": "Estable", "highlight": "Doble número mágico (Z=82, N=126); fin de la serie del Torio-232" }
    ],
    "calculation_steps": [
      "1. Ā = (203.9730 × 1.40 + 205.9744 × 24.10 + 206.9759 × 22.10 + 207.9766 × 52.40) / 100",
      "2. Ā = (285.562 + 4963.983 + 4574.167 + 10897.974) / 100",
      "3. Ā = 20721.686 / 100 = 207.217 u ≈ 207.2 u"
    ]
  }
}

js_out = "// isotopesData.js - Grounded dataset for isotopic abundance and weighted average atomic mass\n"
js_out += "// Based on IUPAC / PhET Interactive Simulations frameworks\n\n"
js_out += "export const isotopesData = " + json.dumps(isotopes_data, indent=2, ensure_ascii=False) + ";\n\n"
js_out += "export function getElementIsotopes(symbol) {\n"
js_out += "  if (!symbol) return null;\n"
js_out += "  const s = String(symbol).trim();\n"
js_out += "  const titleSym = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();\n"
js_out += "  return isotopesData[titleSym] || isotopesData[s] || null;\n"
js_out += "}\n"

with open("src/data/isotopesData.js", "w", encoding="utf-8") as f:
    f.write(js_out)

print("Generated src/data/isotopesData.js successfully!")
