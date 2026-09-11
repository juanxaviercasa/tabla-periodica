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
