import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../src/lib/decision.ts";
import { getQuestionPath } from "../src/data/questions.ts";
import type { Answers, Choice } from "../src/lib/types.ts";

test("all 128 answer paths produce bounded metrics and obey priority rules", () => {
  for (let mask = 0; mask < 128; mask++) {
    const choices: Choice[] = Array.from({ length: 7 }, (_, i) => mask & (1 << i) ? "A" : "B");
    const answers: Answers = { seen: choices[0] };
    getQuestionPath(answers).forEach((id, i) => { answers[id] = choices[i]; });
    const d = evaluate(answers);
    assert.ok(["BUY IT", "WAIT", "WATCH FIRST", "PASS"].includes(d.result));
    for (const value of Object.values(d.metrics)) assert.ok(value >= 0 && value <= 100);
    if (answers.seen === "B" && answers.availability === "A" && (answers.interest === "B" || answers.desire === "B")) assert.equal(d.result, "WATCH FIRST");
    else if (answers.desire === "A" && answers.price === "A" && ((answers.seen === "A" && answers.rewatch === "B") || (answers.seen === "B" && answers.interest === "A" && answers.availability === "B"))) assert.equal(d.result, "BUY IT");
    else if (answers.price === "B" && (d.metrics.LOVE >= 50 || answers.desire === "A")) assert.equal(d.result, "WAIT");
    else if (answers.stock === "A" && answers.desire === "B") assert.equal(d.result, "WAIT");
    if (answers.price === "B") assert.notEqual(d.result, "BUY IT");
  }
});
test("incomplete answers cannot produce a verdict", () => { assert.throws(() => evaluate({})); });
test("favorite creators add support without penalizing a neutral answer", () => {
  const answers: Answers = { seen: "B", interest: "A", favorite: "B", availability: "A", stock: "A", desire: "A", price: "A" };
  const neutral = evaluate(answers);
  const favorite = evaluate({ ...answers, favorite: "A" });
  assert.equal(neutral.metrics.LOVE, 75);
  assert.equal(favorite.metrics.LOVE, 85);
  assert.equal(neutral.result, "BUY IT");
  assert.equal(favorite.result, "BUY IT");
  const incomplete = { ...answers };
  delete incomplete.favorite;
  assert.throws(() => evaluate(incomplete));
});
test("repeated viewing raises love and expensive discs still wait", () => {
  const answers: Answers = { seen: "A", rewatch: "A", favorite: "B", availability: "A", stock: "A", desire: "A", price: "B" };
  const once = evaluate(answers);
  const repeated = evaluate({ ...answers, rewatch: "B" });
  assert.ok(repeated.metrics.LOVE > once.metrics.LOVE);
  assert.equal(repeated.result, "WAIT");
  assert.equal(evaluate({ ...answers, rewatch: "B", favorite: "A" }).metrics.LOVE, 100);
});
test("inactive branch answers do not influence the verdict", () => {
  const answers: Answers = { seen: "B", interest: "A", favorite: "B", availability: "B", stock: "B", desire: "A", price: "A" };
  assert.deepEqual(evaluate(answers), evaluate({ ...answers, rewatch: "B" }));
});
