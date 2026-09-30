import { test } from "node:test";
import assert from "node:assert/strict";
import { shareUrl } from "../src/lib/links.ts";

test("shared links retain the selected language with and without a poster", () => {
  for (const locale of ["en", "ja"] as const) {
    for (const tmdb of [undefined, { id: 1, title: "Film", originalTitle: "Film", releaseYear: null, posterPath: "/poster.jpg" }]) {
      const intent = new URL(shareUrl({ title: "Film", price: null, tmdb }, "WAIT", ["Wait"], "https://example.com/disc-or-die", locale));
      assert.equal(new URL(intent.searchParams.get("url")!).searchParams.get("lang"), locale);
    }
  }
});

test("X share uses a movie-specific card URL when a poster exists", () => {
  const intent = new URL(shareUrl({ title: "怪談", price: null, tmdb: { id: 1, title: "怪談", originalTitle: "Kwaidan", releaseYear: "1964", posterPath: "/poster.jpg" } }, "BUY IT", ["買おう"], "https://example.com/disc-or-die?old=1#result"));
  const card = new URL(intent.searchParams.get("url")!);
  assert.equal(card.pathname, "/disc-or-die/share");
  assert.equal(card.searchParams.get("title"), "怪談");
  assert.equal(card.searchParams.get("result"), "BUY IT");
  assert.equal(card.searchParams.get("poster"), "/poster.jpg");
  assert.equal(card.searchParams.has("old"), false);
});

test("X share without a poster keeps the app URL", () => {
  const intent = new URL(shareUrl({ title: "手入力", price: null }, "WAIT", ["待とう"], "https://example.com/disc-or-die?old=1#result"));
  assert.equal(intent.searchParams.get("url"), "https://example.com/disc-or-die");
});
