import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../src/lib/decision.ts";
import { getQuestionPath } from "../src/data/questions.ts";
import type { Answers, Choice } from "../src/lib/types.ts";

test("all 64 answer paths produce bounded metrics and obey priority rules", () => {
  for (let mask = 0; mask < 64; mask++) {
    const choices: Choice[] = Array.from({ length: 6 }, (_, i) => mask & (1 << i) ? "A" : "B");
    const answers: Answers = { seen: choices[0] };
    getQuestionPath(answers).forEach((id, i) => { answers[id] = choices[i]; });
    const d = evaluate(answers);
    assert.ok(["BUY IT", "WAIT", "WATCH FIRST", "PASS"].includes(d.result));
    for (const value of Object.values(d.metrics)) assert.ok(value >= 0 && value <= 100);
    if (answers.seen === "B" && answers.availability === "A" && (answers.interest === "B" || answers.desire === "B")) assert.equal(d.result, "WATCH FIRST");
    else if (answers.seen === "A" && answers.rewatch === "B" && (answers.desire === "B" || answers.price === "B")) assert.equal(d.result, "PASS");
    else if (answers.desire === "A" && answers.price === "A" && ((answers.seen === "A" && answers.rewatch === "A") || (answers.seen === "B" && answers.interest === "A" && answers.availability === "B"))) assert.equal(d.result, "BUY IT");
    else if (answers.price === "B" && (d.metrics.LOVE >= 50 || answers.desire === "A")) assert.equal(d.result, "WAIT");
    else if (answers.stock === "A" && answers.desire === "B") assert.equal(d.result, "WAIT");
    if (answers.price === "B") assert.notEqual(d.result, "BUY IT");
  }
});
test("incomplete answers cannot produce a verdict", () => { assert.throws(() => evaluate({})); });
test("inactive branch answers do not influence the verdict", () => {
  const answers: Answers = { seen: "B", interest: "A", availability: "B", stock: "B", desire: "A", price: "A" };
  assert.deepEqual(evaluate(answers), evaluate({ ...answers, rewatch: "B" }));
});
