import { elements118 } from "../elementsData.js";

// Fast lookup map by lowercase symbol
const symbolMap = new Map();
const numberMap = new Map();

for (const el of elements118) {
  symbolMap.set(el.symbol.toLowerCase(), el);
  numberMap.set(el.z, el);
}

/**
 * Normalizes input text: converts to lowercase, strips accents/diacritics,
 * keeps only letters and whitespace/separators.
 */
export function normalizeText(text) {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Decomposes a single word into chemical element symbols.
 * Returns an array of solutions (each solution is an array of element objects).
 * @param {string} word
 * @param {number} maxSolutions
 * @returns {Array<Array<Object>>}
 */
export function decomposeWord(word, maxSolutions = 8) {
  const clean = normalizeText(word).replace(/[^a-z]/g, "");
  if (!clean) return [];

  const solutions = [];
  const memo = new Map();

  function search(idx) {
    if (idx === clean.length) {
      return [[]];
    }
    if (memo.has(idx)) {
      return memo.get(idx);
    }

    const currentResults = [];

    // 1-letter attempt
    const one = clean.slice(idx, idx + 1);
    if (symbolMap.has(one)) {
      const elOne = symbolMap.get(one);
      const subSolutions = search(idx + 1);
      for (const sub of subSolutions) {
        currentResults.push([elOne, ...sub]);
        if (currentResults.length >= maxSolutions * 2) break;
      }
    }

    // 2-letter attempt
    if (idx + 2 <= clean.length) {
      const two = clean.slice(idx, idx + 2);
      if (symbolMap.has(two)) {
        const elTwo = symbolMap.get(two);
        const subSolutions = search(idx + 2);
        for (const sub of subSolutions) {
          currentResults.push([elTwo, ...sub]);
          if (currentResults.length >= maxSolutions * 2) break;
        }
      }
    }

    memo.set(idx, currentResults);
    return currentResults;
  }

  const all = search(0);
  return all.slice(0, maxSolutions);
}

/**
 * Calculates chemical statistics for a given sequence of elements.
 */
export function getSpellerStats(elements) {
  if (!elements || elements.length === 0) {
    return {
      totalElements: 0,
      totalProtons: 0,
      totalMass: 0,
      preuniCount: 0,
      families: [],
      symbolsText: "",
      fullDescription: ""
    };
  }

  let totalProtons = 0;
  let totalMass = 0;
  let preuniCount = 0;
  const familySet = new Set();
  const parts = [];

  for (const el of elements) {
    totalProtons += el.z;
    const m = parseFloat(el.atomic_mass || el.mass) || (el.z * 2);
    totalMass += m;
    if (el.isPreUni) preuniCount++;
    if (el.family) familySet.add(el.family);
    parts.push(`${el.symbol} (${el.name}, Z=${el.z})`);
  }

  return {
    totalElements: elements.length,
    totalProtons,
    totalMass: parseFloat(totalMass.toFixed(3)),
    preuniCount,
    preuniPercent: Math.round((preuniCount / elements.length) * 100),
    families: Array.from(familySet),
    symbolsText: elements.map((e) => e.symbol).join(" · "),
    formulaText: elements.map((e) => e.symbol).join(""),
    fullDescription: parts.join(" + ")
  };
}

/**
 * Curated list of popular, inspiring words in Spanish and science that can be spelled with elements.
 */
export const POPULAR_CHEM_WORDS = [
  { word: "GENIO", tag: "Pre-UNI", desc: "Ge · N · I · O (Germanio + Nitrógeno + Yodo + Oxígeno)" },
  { word: "CHOCOLATE", tag: "Curiosidad", desc: "C · H · O · C · O · La · Te" },
  { word: "PERU", tag: "Nacional", desc: "P · Er · U (Fósforo + Erbio + Uranio)" },
  { word: "CEREBRO", tag: "Ciencia", desc: "Ce · Re · Br · O (Cerio + Renio + Bromo + Oxígeno)" },
  { word: "UNIVERSO", tag: "Astronomía", desc: "U · N · I · V · Er · S · O" },
  { word: "ALUMNO", tag: "Academia", desc: "Al · U · Mn · O (Aluminio + Uranio + Manganeso + Oxígeno)" },
  { word: "TIERRA", tag: "Planeta", desc: "Ti · Er · Ra (Titanio + Erbio + Radio)" },
  { word: "CAFE", tag: "Vida", desc: "Ca · Fe (Calcio + Hierro)" },
  { word: "FUSION", tag: "Física", desc: "F · U · S · I · O · N" },
  { word: "FISICA", tag: "Ciencia", desc: "F · I · S · I · Ca" },
  { word: "BASE", tag: "Química", desc: "Ba · Se (Bario + Selenio)" },
  { word: "CAMPUS", tag: "Universidad", desc: "C · Am · P · U · S" },
  { word: "GENIAL", tag: "Motivación", desc: "Ge · N · I · Al" },
  { word: "CRACK", tag: "Motivación", desc: "C · Ra · C · K" },
  { word: "OPTICA", tag: "Física", desc: "O · P · Ti · Ca" },
  { word: "SAL", tag: "Química", desc: "S · Al (Azufre + Aluminio)" },
  { word: "LUNA", tag: "Astronomía", desc: "Lu · Na (Lutecio + Sodio)" },
  { word: "BACON", tag: "Gourmet", desc: "B · Ac · O · N" }
];

/**
 * Spells a complete phrase, preserving spaces between words.
 * Returns { success: boolean, words: Array<{ text: string, solutions: Array<Array<Object>>, selectedIdx: number }> }
 */
export function spellPhrase(phrase) {
  if (!phrase || !phrase.trim()) {
    return {
      success: false,
      rawText: phrase,
      words: [],
      error: "Ingresa al menos una palabra"
    };
  }

  const rawWords = phrase.trim().split(/\s+/);
  const wordsResult = [];
  let allWordsSpellable = true;

  for (const rw of rawWords) {
    const cleanAlpha = normalizeText(rw).replace(/[^a-z]/g, "");
    if (!cleanAlpha) continue;

    const solutions = decomposeWord(cleanAlpha, 6);
    if (solutions.length === 0) {
      allWordsSpellable = false;
    }
    wordsResult.push({
      original: rw,
      clean: cleanAlpha,
      spellable: solutions.length > 0,
      solutions,
      selectedIdx: 0
    });
  }

  return {
    success: allWordsSpellable && wordsResult.length > 0,
    rawText: phrase,
    words: wordsResult
  };
}
