import test from "node:test";
import assert from "node:assert/strict";
import { elements, topics } from "../src/data.js";

const expectedTopicIds = [
  "los-38",
  "valencias-variables",
  "nomenclatura-8-pasos",
  "iones-poliatomicos",
  "configuracion-moller",
  "tendencias-periodicas",
  "estequiometria-mol",
  "enlace-quimico"
];

test("contains the 38 prioritized elements", () => {
  assert.equal(elements.length, 38);
  assert.equal(new Set(elements.map((element) => element.z)).size, 38);
});

test("contains every quiz route with valid questions", () => {
  assert.deepEqual(topics.map((topic) => topic.id), expectedTopicIds);
  for (const topic of topics) {
    assert.ok(topic.questions.length > 0, `${topic.id} has no questions`);
    for (const question of topic.questions) {
      assert.ok(question.options.length >= 2);
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
      assert.ok(question.explain.length > 0);
    }
  }
});
