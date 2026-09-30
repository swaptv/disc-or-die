import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import ts from "typescript";
import { resolveLocale, translate } from "../src/lib/i18n.ts";
import { questions } from "../src/data/questions.ts";
import { resultCopy } from "../src/data/results.ts";
import { formatPrice } from "../src/lib/links.ts";

test("language preference honors saved choice, language tags, and quality weights", () => {
  assert.equal(resolveLocale(null, "en-US,en;q=0.9,ja;q=0.8"), "en");
  assert.equal(resolveLocale(null, "ja-JP,en;q=0.9"), "ja");
  assert.equal(resolveLocale(null, "ja;q=0.3,en-GB;q=0.9"), "en");
  assert.equal(resolveLocale("ja", "en-US"), "ja");
  assert.equal(resolveLocale("en", "ja-JP"), "en");
  assert.equal(resolveLocale("invalid", "en"), "en");
  assert.equal(resolveLocale(null, "en;q=0,ja;q=0.5"), "ja");
  assert.equal(resolveLocale(null, "fr-FR,en;q=0.5"), "en");
  assert.equal(resolveLocale(null, "en;q=invalid,ja"), "ja");
  assert.equal(resolveLocale(null, "fr-FR"), "ja");
  assert.equal(resolveLocale(), "ja");
});

test("all questions, choices, notes, and result summaries have English translations", () => {
  const copy = Object.values(questions).flatMap(question => [question.title, ...question.choices, ...(question.note ? [question.note] : [])]);
  copy.push(...Object.values(resultCopy).map(result => result.japanese));
  for (const text of copy) {
    assert.notEqual(translate("en", text), text, text);
    assert.equal(translate("ja", text), text);
  }
});

test("UI translation calls are covered, including whitespace around JSX text", () => {
  for (const file of readdirSync("src/components").filter(file => file.endsWith(".tsx"))) {
    const source = ts.createSourceFile(file, readFileSync(`src/components/${file}`, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && node.expression.getText(source) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        const text = node.arguments[0].text;
        assert.notEqual(translate("en", text), text, `${file}: ${text}`);
        assert.doesNotMatch(translate("en", text), /[\u3040-\u30ff\u4e00-\u9fff]/);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});

test("price formatting keeps Japanese yen explicit for English readers", () => {
  assert.equal(formatPrice(3800, "en"), "JPY ¥3,800");
  assert.equal(formatPrice(3800, "ja"), "¥3,800");
  assert.equal(formatPrice(0, "en"), "JPY ¥0");
});
