import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const bank = JSON.parse(await readFile(new URL("../banco-preguntas-quiz.json", import.meta.url), "utf8"));
const topicIds = ["elementos-38", "valencias", "nomenclatura", "iones", "configuracion", "tendencias", "estequiometria", "enlace"];

test("contains the 38 prioritized elements", () => {
  const expectedElements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 29, 30, 34, 35, 38, 47, 50, 53, 56, 78, 79, 80, 82];
  assert.equal(expectedElements.length, 38);
  assert.equal(new Set(expectedElements).size, 38);
});

test("contains every quiz route with valid questions", () => {
  assert.deepEqual(Object.keys(bank), topicIds);
  for (const topicId of topicIds) {
    const topic = bank[topicId];
    assert.equal(topic.preguntas.length, 8, `${topicId} should contain all 8 bank questions`);
    for (const question of topic.preguntas) {
      assert.ok(question.opciones.length >= 2);
      assert.ok(["a", "b", "c", "d"].includes(question.correcta));
      assert.ok(question.explicacion.length > 0);
    }
  }
});

test("normalizes every bank answer to a valid option index", () => {
  assert.equal(topicIds.reduce((total, topicId) => total + bank[topicId].preguntas.length, 0), 64);
  for (const topicId of topicIds) {
    for (const question of bank[topicId].preguntas) {
      assert.equal(question.opciones.length, 4);
      assert.ok(["a", "b", "c", "d"].includes(question.correcta));
    }
  }
});

test("validates complete 118 IUPAC elements catalog with 38 preuni essentials", async () => {
  const { elements118, preuniZList } = await import("../src/elementsData.js");
  assert.equal(elements118.length, 118);
  const preuniElements = elements118.filter(e => e.isPreUni);
  assert.equal(preuniElements.length, 38);
  assert.deepEqual(preuniElements.map(e => e.z), preuniZList);

  for (const elem of elements118) {
    assert.ok(elem.z >= 1 && elem.z <= 118);
    assert.ok(elem.symbol && elem.symbol.length > 0);
    assert.ok(elem.name && elem.name.length > 0);
    assert.ok(elem.col >= 1 && elem.col <= 18);
    assert.ok(elem.row >= 1 && elem.row <= 9);
    assert.ok(Array.isArray(elem.shells) && elem.shells.length > 0);
    assert.ok(["s", "p", "d", "f"].includes(elem.block));

    // Unified schema assertions
    assert.equal(elem.number, elem.z);
    assert.equal(elem.atomic_mass, elem.mass);
    assert.equal(elem.electron_configuration, elem.config);
    assert.equal(elem.oxidation_states, elem.ox);
    assert.equal(elem.electronegativity, elem.en);
    assert.ok(elem.category && elem.category.length > 0);
    assert.ok(typeof elem.summary === "string");
    assert.ok(typeof elem.study_notes === "string" && elem.study_notes.length > 0);
  }
});

test("validates groupPeriodData definitions for groups, periods, and trends", async () => {
  const { groupsData, periodsData, periodicTrendsData } = await import("../src/data/groupPeriodData.js");
  assert.equal(groupsData.length, 18);
  for (let i = 1; i <= 18; i++) {
    const grp = groupsData.find(g => g.number === i);
    assert.ok(grp, `Group ${i} should be defined`);
    assert.ok(grp.name && grp.name.length > 0);
    assert.ok(Number(grp.iupac) === i);
    assert.ok(grp.cas && grp.cas.length > 0);
    assert.ok(grp.valenceTerminal && grp.valenceTerminal.length > 0);
  }

  assert.equal(periodsData.length, 7);
  for (let p = 1; p <= 7; p++) {
    const period = periodsData.find(item => item.number === p);
    assert.ok(period, `Period ${p} should be defined`);
    assert.ok(period.shellLetter && period.shellLetter.length === 1);
    assert.ok(period.subshells && period.subshells.length > 0);
  }

  assert.ok(periodicTrendsData.length >= 7);
  for (const trend of periodicTrendsData) {
    assert.ok(trend.id && trend.label);
    assert.ok(typeof trend.min === "number" && typeof trend.max === "number");
    assert.ok(trend.min < trend.max);
    assert.ok(["left", "right", "none"].includes(trend.dirH));
    assert.ok(["up", "down", "none"].includes(trend.dirV));
  }
});

test("evaluates physical aggregation states and thermal phase transitions correctly", async () => {
  const { getElementPhaseAtTemp } = await import("../src/data/thermalCalculations.js");
  const { elements118 } = await import("../src/elementsData.js");

  const hg = elements118.find(e => e.symbol === "Hg");
  const br = elements118.find(e => e.symbol === "Br");
  const fe = elements118.find(e => e.symbol === "Fe");
  const he = elements118.find(e => e.symbol === "He");
  const db = elements118.find(e => e.symbol === "Db");

  // Room temperature (~293.15 K)
  assert.equal(getElementPhaseAtTemp(hg, 293.15), "liquid", "Mercury must be liquid at room temperature");
  assert.equal(getElementPhaseAtTemp(br, 293.15), "liquid", "Bromine must be liquid at room temperature");
  assert.equal(getElementPhaseAtTemp(fe, 293.15), "solid", "Iron must be solid at room temperature");
  assert.equal(getElementPhaseAtTemp(he, 293.15), "gas", "Helium must be gas at room temperature");
  assert.equal(getElementPhaseAtTemp(db, 293.15), "unknown", "Dubnium thermal phase is synthetic/unknown");

  // Temperature phase transitions
  assert.equal(getElementPhaseAtTemp(fe, 2000), "liquid", "Iron melts above 1811 K");
  assert.equal(getElementPhaseAtTemp(fe, 3500), "gas", "Iron vaporizes above 3134 K");
  assert.equal(getElementPhaseAtTemp(hg, 100), "solid", "Mercury freezes below 234.32 K");
});

test("interpolates scientific heatmap gradient colors smoothly", async () => {
  const { getHeatmapColor } = await import("../src/data/thermalCalculations.js");

  // Minimum value gives deep indigo rgb(49, 46, 129)
  const colMin = getHeatmapColor(0, 0, 100);
  assert.equal(colMin, "rgb(49, 46, 129)");

  // Maximum value gives bright crimson rgb(239, 68, 68)
  const colMax = getHeatmapColor(100, 0, 100);
  assert.equal(colMax, "rgb(239, 68, 68)");

  // Mid-scale gives emerald rgb(16, 185, 129)
  const colMid = getHeatmapColor(50, 0, 100);
  assert.equal(colMid, "rgb(16, 185, 129)");

  // Null/undefined values return null (no color)
  assert.equal(getHeatmapColor(null, 0, 100), null);
  assert.equal(getHeatmapColor(undefined, 0, 100), null);
});

test("validates grounded pedagogical dataset (pedagogyData) for all 118 elements", async () => {
  const { pedagogyData, getElementPedagogy } = await import("../src/data/pedagogyData.js");

  // Verify all 118 elements are present
  const keys = Object.keys(pedagogyData);
  assert.equal(keys.length, 118, "pedagogyData must contain all 118 elements");

  for (let z = 1; z <= 118; z++) {
    const entry = pedagogyData[String(z)];
    assert.ok(entry, `Element Z=${z} must exist in pedagogyData`);
    assert.equal(entry.z, z);
    assert.ok(entry.symbol && entry.symbol.length > 0);
    assert.ok(entry.name && entry.name.length > 0);

    const p = entry.pedagogy;
    assert.ok(p, `Element Z=${z} must contain a pedagogy object`);

    // 4 Grounded Cards assertions
    assert.ok(typeof p.everyday_context === "string" && p.everyday_context.length > 15, `Z=${z} everyday_context missing`);
    assert.ok(typeof p.exam_pitfall === "string" && p.exam_pitfall.length > 15, `Z=${z} exam_pitfall missing`);
    assert.ok(p.quantum_breakdown && typeof p.quantum_breakdown === "object", `Z=${z} quantum_breakdown missing`);
    assert.ok(typeof p.quantum_breakdown.level_explanation === "string" && p.quantum_breakdown.level_explanation.length > 10);
    assert.ok(typeof p.quantum_breakdown.anomalies_or_rules === "string" && p.quantum_breakdown.anomalies_or_rules.length > 10);
    assert.ok(typeof p.family_relationship === "string" && p.family_relationship.length > 15, `Z=${z} family_relationship missing`);

    // Self-check flashcards assertions (at least 2 questions)
    assert.ok(Array.isArray(p.self_check_quiz) && p.self_check_quiz.length >= 2, `Z=${z} must have at least 2 self-check flashcard questions`);
    for (const quiz of p.self_check_quiz) {
      assert.ok(typeof quiz.question === "string" && quiz.question.length > 5);
      assert.ok(typeof quiz.answer === "string" && quiz.answer.length > 5);
      assert.ok(typeof quiz.explanation === "string" && quiz.explanation.length > 5);
      assert.ok(typeof quiz.concept_tested === "string" && quiz.concept_tested.length > 0);
    }
  }

  // Verify getElementPedagogy helper resolution by number, string, and symbol
  const ironByZ = getElementPedagogy(26);
  const ironByStr = getElementPedagogy("26");
  const ironBySym = getElementPedagogy("Fe");
  const ironBySymLower = getElementPedagogy("fe");
  assert.ok(ironByZ && ironByZ.symbol === "Fe");
  assert.equal(ironByZ, ironByStr);
  assert.equal(ironByZ, ironBySym);
  assert.equal(ironByZ, ironBySymLower);

  // Non-existent returns null
  assert.equal(getElementPedagogy(999), null);
  assert.equal(getElementPedagogy(""), null);
});

test("validates isotopic abundance and weighted atomic mass calculations (isotopesData)", async () => {
  const { isotopesData, getElementIsotopes } = await import("../src/data/isotopesData.js");

  const symbols = Object.keys(isotopesData);
  assert.ok(symbols.length >= 13, "isotopesData should contain key elements");
  assert.ok(symbols.includes("H"));
  assert.ok(symbols.includes("Cl"));
  assert.ok(symbols.includes("Cu"));
  assert.ok(symbols.includes('Fe'));
  assert.ok(symbols.includes('Co'));
  assert.ok(symbols.includes('O'));
  assert.ok(symbols.includes('U'));

  for (const sym of symbols) {
    const data = isotopesData[sym];
    assert.ok(data.symbol && data.name);
    assert.ok(typeof data.standard_mass === "number" && data.standard_mass > 0);
    assert.ok(Array.isArray(data.isotopes) && data.isotopes.length >= 2);
    assert.ok(Array.isArray(data.calculation_steps) && data.calculation_steps.length >= 2);

    let totalAbundance = 0;
    for (const iso of data.isotopes) {
      assert.ok(iso.name && iso.symbol);
      assert.ok(typeof iso.a === "number" && iso.a > 0);
      assert.ok(typeof iso.z === "number" && iso.z > 0);
      assert.ok(typeof iso.neutrons === "number" && iso.neutrons >= 0);
      assert.equal(iso.a - iso.z, iso.neutrons, `A - Z must equal neutrons for ${iso.name}`);
      assert.ok(typeof iso.mass_u === "number" && iso.mass_u > 0);
      assert.ok(typeof iso.abundance_pct === "number" && iso.abundance_pct >= 0);
      totalAbundance += iso.abundance_pct;
    }
    // Sum of abundances should be approximately 100% (within 0.2% tolerance)
    assert.ok(
      Math.abs(totalAbundance - 100) < 0.2,
      `Abundances for ${sym} must sum to ~100%, got ${totalAbundance}`
    );
  }

  // Test helper function
  const cl = getElementIsotopes("cl");
  const cu = getElementIsotopes("Cu");
  assert.ok(cl && cl.symbol === "Cl");
  assert.ok(cu && cu.symbol === "Cu");
  assert.equal(getElementIsotopes("NonExistent"), null);
});

test("validates Royal Society of Chemistry misconceptions dataset (misconceptionsData)", async () => {
  const { misconceptionsData, getMisconception } = await import("../src/data/misconceptionsData.js");

  assert.equal(misconceptionsData.length, 6, "Must contain the 6 classic chemistry misconceptions");

  const expectedIds = [
    "radio-atomico-zeff",
    "valencia-vs-oxidacion",
    "perdida-electrones-transicion",
    "anomalias-antiserrucho",
    "bohr-vs-reempe",
    "masa-decimal-vs-numero-masa"
  ];

  for (const expectedId of expectedIds) {
    const item = misconceptionsData.find(m => m.id === expectedId);
    assert.ok(item, `Misconception with id '${expectedId}' must exist`);
    assert.ok(item.title && item.title.length > 5);
    assert.ok(item.tag && item.tag.length > 0);
    assert.ok(item.trapDescription && item.trapDescription.length > 20);
    assert.ok(item.scientificReality && item.scientificReality.length > 20);
    assert.ok(item.keyComparison && item.keyComparison.length > 10);
    assert.ok(item.admissionTip && item.admissionTip.length > 15);
    assert.ok(item.examQuestion && item.examQuestion.prompt && item.examQuestion.answer);

    // Test getMisconception helper
    const retrieved = getMisconception(expectedId);
    assert.equal(retrieved, item);
  }

  assert.equal(getMisconception("unknown-id"), null);
});
