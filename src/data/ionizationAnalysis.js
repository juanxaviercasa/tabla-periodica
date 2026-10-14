const groupMap = {
  1: { group: "Grupo 1 (IA)", family: "Alcalinos", ion: "X⁺", valencia: 1 },
  2: { group: "Grupo 2 (IIA)", family: "Alcalinotérreos", ion: "X²⁺", valencia: 2 },
  3: { group: "Grupo 13 (IIIA)", family: "Boroideos", ion: "X³⁺", valencia: 3 },
  4: { group: "Grupo 14 (IVA)", family: "Carbonoideos", ion: null, valencia: 4 },
  5: { group: "Grupo 15 (VA)", family: "Nitrogenoideos", ion: null, valencia: 5 },
  6: { group: "Grupo 16 (VIA)", family: "Calcógenos", ion: "X²⁻", valencia: 6 },
  7: { group: "Grupo 17 (VIIA)", family: "Halógenos", ion: "X⁻", valencia: 7 },
  8: { group: "Grupo 18 (VIIIA)", family: "Gases nobles", ion: null, valencia: 8 },
};

/**
 * Ratios describe measured increments. A large ratio alone does not identify
 * a family. Unknown-element inference is conditional on an exercise explicitly
 * describing a representative element; known elements use catalog metadata.
 * A threshold of 3 is a classroom heuristic, not a physical classification law.
 */
export function calculateQuantumJump(energies, { element = null, representative = false } = {}) {
  const valid = Array.isArray(energies) && energies.length > 0 && energies.every((e, i) => Number.isFinite(e) && e > 0 && (i === 0 || e > energies[i - 1]));
  const result = { status: valid ? "insufficient" : "invalid", hasJump: false, valenceElectrons: null, jumpIndex: null, maxRatio: 1, ratios: [], prediction: null, energies: valid ? energies : [], diagnosis: "Ingresa energías positivas en orden estrictamente creciente." };
  if (!valid) return result;

  if (energies.length > 1) {
    result.ratios = energies.slice(1).map((next, i) => ({ from: i + 1, to: i + 2, ratio: Number((next / energies[i]).toFixed(2)), prevVal: energies[i], nextVal: next }));
    const largest = result.ratios.reduce((a, b) => b.ratio > a.ratio ? b : a);
    result.maxRatio = largest.ratio;
    result.jumpIndex = largest.from;
  }

  const group = Number(element?.group);
  const isRepresentative = element && (group <= 2 || group >= 13) && ["s", "p"].includes(element.block);
  const valence = isRepresentative ? (element.number === 2 ? 2 : group <= 2 ? group : group - 10) : null;
  const eligible = isRepresentative && element.number > 2 && group !== 18;
  const hasStrongRatio = energies.length > 1 && result.maxRatio >= 3;
  result.hasJump = hasStrongRatio && (element ? eligible && result.jumpIndex === valence : representative && result.jumpIndex <= 8);

  if (element) {
    result.valenceElectrons = valence;
    result.prediction = { group: group ? `Grupo ${group} (IUPAC)` : "Serie del bloque f", family: element.family, ion: null, valencia: valence };
  } else if (result.hasJump) {
    result.valenceElectrons = result.jumpIndex;
    result.prediction = groupMap[result.jumpIndex];
  }

  result.status = energies.length < 2 ? "insufficient" : result.hasJump ? "supported" : "inconclusive";
  if (energies.length < 2) {
    result.diagnosis = "Se requieren al menos dos energías sucesivas para comparar incrementos. El grupo mostrado proviene del catálogo del elemento, no de un salto calculado.";
  } else if (result.hasJump) {
    result.diagnosis = `Incremento de ${result.maxRatio}× entre I${result.jumpIndex} e I${result.jumpIndex + 1}. ${element ? "Es compatible con la retirada de un electrón interno tras los electrones de valencia de este elemento representativo." : "Si el ejercicio corresponde a un elemento representativo y este incremento marca el paso a electrones internos, sugiere " + result.jumpIndex + " electrones de valencia. La clasificación es condicional."}`;
  } else if (element) {
    result.diagnosis = group === 18
      ? "Es un gas noble: estos cocientes no permiten asignarle la familia de los alcalinos. Su grupo real se muestra a partir del catálogo."
      : !isRepresentative
        ? "En el bloque d o f, los cocientes por sí solos no determinan el grupo ni un ion estable. Consulta su configuración y sus estados de oxidación."
        : "Las energías disponibles no muestran un salto suficiente para deducir su valencia. Su grupo real proviene del catálogo.";
  } else {
    result.diagnosis = representative
      ? "No hay evidencia suficiente para proponer un grupo con estos valores. Hace falta identificar el paso de electrones externos a internos."
      : "Los cocientes describen incrementos; para inferir un grupo el ejercicio debe especificar un elemento representativo y un salto hacia electrones internos.";
  }
  return result;
}
