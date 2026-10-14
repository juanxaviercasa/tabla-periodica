import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { elements118 } from "../src/elementsData.js";
import { calculateQuantumJump, ionizationData } from "../src/data/ionizationData.js";
import { getShellDistribution, getNuclearStability, normalizeLabTab } from "../src/data/atomicCalculations.js";
import { getElementPhaseAtTemp } from "../src/data/thermalCalculations.js";
import { getBondGuidance } from "../src/data/bondGuidance.js";
import { updateAbundance } from "../src/data/isotopeCalculations.js";
import { saveQuizResult, getBestScore, getMistakes, getDueQuestions, getQuestionMastery, saveDiagnostic, getDiagnostic } from "../src/storage.js";

const element = symbol => elements118.find(e => e.symbol === symbol);

test("bond guidance distinguishes metals, HF and noble gases", () => {
  assert.equal(getBondGuidance(element("Na"), element("Mg")).badgeClass, "bond-metallic");
  assert.equal(getBondGuidance(element("H"), element("F")).badgeClass, "bond-polar");
  assert.equal(getBondGuidance(element("Na"), element("Cl")).badgeClass, "bond-ionic");
  assert.equal(getBondGuidance(element("He"), element("H")).type, "Se necesita un compuesto concreto");
});

test("isotope sliders preserve 100 percent for two, three or four isotopes", () => {
  for (const values of [[75, 25], [78.99, 10, 11.01], [1, 24, 22, 53], [100, 0, 0]]) {
    for (const index of values.keys()) for (const percentage of [0, 25.55, 100]) {
      const result = updateAbundance(values, index, percentage);
      assert.ok(Math.abs(result.reduce((sum, value) => sum + value, 0) - 100) < .0001);
      assert.ok(result.every(value => value >= 0 && value <= 100));
      assert.equal(result[index], percentage);
    }
  }
});

test("H handles a single ionization, and known He/Ne/Fe keep their actual groups", () => {
  const h = calculateQuantumJump(ionizationData[1], { element: element("H") });
  assert.equal(h.status, "insufficient");
  assert.equal(h.hasJump, false);
  assert.equal(h.prediction.group, "Grupo 1 (IUPAC)");
  for (const [symbol, group] of [["He", 18], ["Ne", 18], ["Fe", 8]]) {
    const e = element(symbol);
    const result = calculateQuantumJump(e.ionizations, { element: e });
    assert.equal(result.prediction.group, `Grupo ${group} (IUPAC)`);
    assert.equal(result.hasJump, false);
    assert.equal(result.prediction.ion, null);
  }
  assert.equal(calculateQuantumJump(ionizationData[2], { element: element("He") }).valenceElectrons, 2);
});

test("classification is conditional, insufficient and invalid energies never produce a group", () => {
  assert.equal(calculateQuantumJump(ionizationData[11]).prediction, null);
  assert.equal(calculateQuantumJump(ionizationData[11], { representative: true }).prediction.group, "Grupo 1 (IA)");
  for (const energies of [[], [496], [496, 700, 900]]) assert.equal(calculateQuantumJump(energies, { representative: true }).prediction, null);
  for (const energies of [[0, 100], [100, 90], [100, 100], [NaN, 100], [100, Infinity]]) {
    const result = calculateQuantumJump(energies, { representative: true });
    assert.equal(result.status, "invalid");
    assert.equal(result.prediction, null);
  }
  assert.equal(calculateQuantumJump(ionizationData[14], { representative: true }).prediction.ion, null);
});

test("neutral configurations preserve all 118 catalog distributions", () => {
  for (const e of elements118) assert.deepEqual(getShellDistribution(e, e.number), e.shells, e.symbol);
  assert.deepEqual(getShellDistribution(element("K"), 19), [2, 8, 8, 1]);
  assert.deepEqual(getShellDistribution(element("Ca"), 20), [2, 8, 8, 2]);
});

test("ions lose highest-level electrons first, including transition-metal exceptions", () => {
  for (const [symbol, electrons, expected] of [
    ["Na", 10, [2, 8]], ["Mg", 10, [2, 8]], ["Al", 10, [2, 8]],
    ["S", 18, [2, 8, 8]], ["Cl", 18, [2, 8, 8]], ["Fe", 24, [2, 8, 14]],
    ["Fe", 23, [2, 8, 13]], ["Cu", 28, [2, 8, 18]], ["Cu", 27, [2, 8, 17]],
    ["Cr", 21, [2, 8, 11]], ["He", 0, []],
  ]) assert.deepEqual(getShellDistribution(element(symbol), electrons), expected, `${symbol}: ${electrons} electrons`);
  for (const e of elements118) {
    for (const count of [0, Math.max(0, e.number - 1), Math.min(118, e.number + 1)]) {
      const distribution = getShellDistribution(e, count);
      assert.equal(distribution.reduce((a, b) => a + b, 0), count, e.symbol);
    }
  }
});

test("isotope records distinguish stable C-13, radioactive C-14 and unknown nuclides", () => {
  assert.equal(getNuclearStability(6, 7).stable, true);
  assert.equal(getNuclearStability(6, 8).stable, false);
  assert.equal(getNuclearStability(6, 5).stable, false);
  assert.equal(getNuclearStability(2, 2).stable, true);
  assert.equal(getNuclearStability(11, 12).stable, true);
  assert.equal(getNuclearStability(92, 146).stable, false);
  const unknown = getNuclearStability(6, 20);
  assert.equal(unknown.stable, null);
  assert.ok(!unknown.reason.includes("emisión"));
});

test("legacy laboratory links normalize to the rendered ionization panel", () => {
  for (const tab of ["ionization", "jump", "ionizations"]) assert.equal(normalizeLabTab(tab), "ionization");
  assert.equal(normalizeLabTab("isotopes"), "isotopes");
  for (const tab of [null, "", "builder", "unknown"]) assert.equal(normalizeLabTab(tab), "builder");
});

test("thermal model respects helium and sublimation at atmospheric pressure", () => {
  assert.equal(getElementPhaseAtTemp(element("He"), 0.5), "liquid");
  assert.equal(getElementPhaseAtTemp(element("C"), 3850), "solid");
  assert.equal(getElementPhaseAtTemp(element("C"), 4100), "gas");
  assert.equal(getElementPhaseAtTemp(element("As"), 900), "gas");
  assert.equal(getElementPhaseAtTemp(element("Fe"), NaN), "unknown");
});

test("gas densities use the same g/cm3 units as liquid and solid densities", () => {
  assert.ok(Math.abs(element("He").density - .0001786) < 1e-10);
  assert.ok(Math.abs(element("H").density - .00008988) < 1e-10);
  assert.ok(element("Hg").density > 13);
  for (const gas of elements118.filter(e => e.phase === "gas")) assert.ok(gas.density < .01, gas.symbol);
});

test("partial reviews clear only answered errors, update mastery and preserve full quiz score", () => {
  const records = new Map();
  globalThis.localStorage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, value) };
  globalThis.window = new EventTarget();
  saveQuizResult("topic", 1, 3, ["a", "b"], [{ questionId: "a", correct: false }, { questionId: "b", correct: false }, { questionId: "c", correct: true }]);
  saveQuizResult("topic", 1, 1, [], [{ questionId: "a", correct: true }], { review: true });
  assert.deepEqual(getMistakes("topic"), ["b"]);
  assert.deepEqual(getBestScore("topic"), { score: 1, total: 3 });
  assert.equal(getQuestionMastery("topic", "a").attempts, 2);
  assert.equal(getQuestionMastery("topic", "a").streak, 1);
  assert.deepEqual(getDueQuestions("topic"), []);
  const progress = JSON.parse(records.get("quimica-preuni-progress"));
  progress.mastery.topic.c.nextReview = new Date(Date.now() - 1000).toISOString();
  records.set("quimica-preuni-progress", JSON.stringify(progress));
  assert.deepEqual(getDueQuestions("topic"), ["c"]);
  saveQuizResult("topic", 0, 1, ["c"], [{ questionId: "c", correct: false }], { review: true });
  assert.deepEqual(getMistakes("topic"), ["b", "c"]);
  assert.deepEqual(getDueQuestions("topic"), []);
  saveQuizResult("topic", 2, 2, [], [{ questionId: "b", correct: true }, { questionId: "c", correct: true }], { review: true });
  assert.deepEqual(getMistakes("topic"), []);
});

test("legacy scores for the corrected t8 answer do not transfer to its replacement", () => {
  const legacy = { scores: { "tendencias-periodicas": { score: 8, total: 8 }, "los-38": { score: 7, total: 8 } }, mastery: { "tendencias-periodicas": { t1: { attempts: 1 }, t8: { attempts: 1 } } }, mistakes: { "tendencias-periodicas": ["t1", "t8"] } };
  globalThis.localStorage = { getItem: () => JSON.stringify(legacy), setItem() {} };
  assert.equal(getBestScore("tendencias-periodicas"), null);
  assert.equal(getBestScore("los-38").score, 7);
  assert.equal(getQuestionMastery("tendencias-periodicas", "t8").attempts, 0);
  assert.equal(getQuestionMastery("tendencias-periodicas", "t1").attempts, 1);
  assert.deepEqual(getMistakes("tendencias-periodicas"), ["t1"]);
});


test("blocked storage keeps quiz and diagnostic usable for the current session", () => {
  globalThis.localStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("full"); } };
  globalThis.window = new EventTarget();
  assert.equal(saveQuizResult("offline", 0, 1, ["q"], [{ questionId: "q", correct: false }]), false);
  assert.deepEqual(getMistakes("offline"), ["q"]);
  assert.equal(saveDiagnostic({ score: 3, total: 6, topicScores: {}, recommendedMode: "examen" }), false);
  assert.equal(getDiagnostic().score, 3);
});


test("the zinc question explains the mnemonic group without teaching variable valence", async () => {
  const bank = JSON.parse(await readFile(new URL("../banco-preguntas-quiz.json", import.meta.url), "utf8"));
  const question = bank["elementos-38"].preguntas.find(q => q.id === "e4");
  assert.match(question.prompt, /grupo de estudio/);
  assert.match(question.explicacion, /Zn tiene estado habitual \+2/);
});
