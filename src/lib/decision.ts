import { scoring as s } from "../data/scoring.ts";
import { getQuestionPath } from "../data/questions.ts";
import type { Answers, Decision, Metrics, ResultId } from "./types.ts";

// Ordered rules take precedence over the weighted fallback. Keep new rules here.
export const rules: { id: string; result: ResultId; matches: (a: Answers) => boolean }[] = [
  { id: "watch-before-owning", result: "WATCH FIRST", matches: a => a.seen === "B" && a.availability === "A" && (a.interest === "B" || a.desire === "B") },
  { id: "loved-and-fair", result: "BUY IT", matches: a => a.seen === "A" && a.rewatch === "B" && a.desire === "A" && a.price === "A" },
  { id: "only-way-to-watch", result: "BUY IT", matches: a => a.seen === "B" && a.interest === "A" && a.availability === "B" && a.desire === "A" && a.price === "A" },
];
export function evaluate(a: Answers): Decision {
  if (getQuestionPath(a).some(id => a[id] !== "A" && a[id] !== "B")) throw new Error("診断に必要な回答が不足しています。");
  const metrics: Metrics = {
    LOVE: Math.min(100, (a.seen === "A" ? (a.rewatch === "A" ? s.love.onceMore : s.love.manyTimes) : (a.interest === "A" ? s.love.curious : s.love.someday)) + (a.favorite === "A" ? s.love.favoriteBonus : 0)),
    FOMO: a.desire === "A" ? s.fomo.independentDesire : s.fomo.urgency,
    RARITY: a.stock === "A" ? s.rarity.available : s.rarity.scarce,
    VALUE: a.price === "A" ? s.value.fair : s.value.expensive,
  };
  const forced = rules.find(rule => rule.matches(a));
  if (forced) return { result: forced.result, metrics, reason: forced.id };
  if (a.price === "B" && (metrics.LOVE >= s.thresholds.waitLove || a.desire === "A")) return { result: "WAIT", metrics, reason: "wait-for-value" };
  if (a.stock === "A" && a.desire === "B") return { result: "WAIT", metrics, reason: "available-no-rush" };
  const score = metrics.LOVE * s.weights.love + (100 - metrics.FOMO) * s.weights.desire + metrics.VALUE * s.weights.value + metrics.RARITY * s.weights.rarity;
  const result: ResultId = score >= s.thresholds.buy && a.price === "A" ? "BUY IT" : metrics.LOVE >= s.thresholds.waitLove || a.desire === "A" ? "WAIT" : "PASS";
  return { result, metrics, reason: "weighted-score" };
}
