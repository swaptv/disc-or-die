import { test } from "node:test";
import assert from "node:assert/strict";
import { shareUrl } from "../src/lib/links.ts";
import type { ResultId } from "../src/lib/types.ts";

const metrics = { LOVE: 75, FOMO: 50, RARITY: 25, VALUE: 100 };

test("X share pairs each verdict with its Japanese phrase", () => {
  const phrases: Record<ResultId, string> = {
    "BUY IT": "棚に迎えろ。",
    WAIT: "その時を待て。",
    "WATCH FIRST": "まずは観ろ。",
    PASS: "見送る勇気を。",
  };

  for (const [result, japanese] of Object.entries(phrases) as [ResultId, string][]) {
    const intent = new URL(shareUrl({ title: "Film", price: null }, { result, metrics, reason: "test" }, ["Copy"], "https://example.com/disc-or-die"));
    assert.equal(intent.searchParams.get("text")?.split("\n")[0], `DISC OR DIE says: ${result} / ${japanese} 💀`);
  }
});

test("shared links retain the selected language with and without a poster", () => {
  for (const locale of ["en", "ja"] as const) {
    for (const tmdb of [undefined, { id: 1, title: "Film", originalTitle: "Film", releaseYear: null, posterPath: "/poster.jpg" }]) {
      const intent = new URL(shareUrl({ title: "Film", price: null, tmdb }, { result: "WAIT", metrics, reason: "test" }, ["Wait"], "https://example.com/disc-or-die", locale));
      assert.equal(new URL(intent.searchParams.get("url")!).searchParams.get("lang"), locale);
    }
  }
});

test("X share uses a movie-specific card URL when a poster exists", () => {
  const intent = new URL(shareUrl({ title: "怪談", price: null, tmdb: { id: 1, title: "怪談", originalTitle: "Kwaidan", releaseYear: "1964", posterPath: "/poster.jpg" } }, { result: "BUY IT", metrics, reason: "test" }, ["買おう"], "https://example.com/disc-or-die?old=1#result"));
  const card = new URL(intent.searchParams.get("url")!);
  assert.equal(card.pathname, "/disc-or-die/share");
  assert.equal(card.searchParams.get("title"), "怪談");
  assert.equal(card.searchParams.get("result"), "BUY IT");
  assert.equal(card.searchParams.get("poster"), "/poster.jpg");
  assert.equal(card.searchParams.get("love"), "75");
  assert.equal(card.searchParams.get("fomo"), "50");
  assert.equal(card.searchParams.get("rarity"), "25");
  assert.equal(card.searchParams.get("value"), "100");
  assert.equal(card.searchParams.has("old"), false);
});

test("X share without a poster still uses the result page", () => {
  const intent = new URL(shareUrl({ title: "手入力", price: null }, { result: "WAIT", metrics, reason: "test" }, ["待とう"], "https://example.com/disc-or-die?old=1#result"));
  const card = new URL(intent.searchParams.get("url")!);
  assert.equal(card.pathname, "/disc-or-die/share");
  assert.equal(card.searchParams.get("title"), "手入力");
  assert.equal(card.searchParams.has("poster"), false);
  assert.equal(card.searchParams.get("love"), "75");
});
