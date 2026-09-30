import { test } from "node:test";
import assert from "node:assert/strict";
import { handleTmdb } from "../src/lib/tmdb-api.ts";
import { parseMovies, parseProviders } from "../src/lib/tmdb.ts";

test("movie posters preserve valid paths and discard missing or unsafe values", () => {
  for (const poster_path of ["/poster123.jpg", "/poster_123-test.png"]) {
    assert.equal(parseMovies({ results: [{ id: 1, title: "Film", poster_path }] })[0].posterPath, poster_path);
  }
  for (const poster_path of [null, undefined, "", 123, "https://example.com/poster.jpg", "//example.com/poster.jpg", "/../poster.jpg", "/poster.svg", "/poster.jpg?redirect=1"]) {
    assert.equal(parseMovies({ results: [{ id: 1, title: "Film", poster_path }] })[0].posterPath, null);
  }
});

test("search uses encoded Japanese query, fixed endpoint and server Bearer token", async () => {
  const fetcher: typeof fetch = async (input, options) => {
    const url = new URL(String(input));
    assert.equal(url.origin, "https://api.themoviedb.org");
    assert.equal(url.pathname, "/3/search/movie");
    assert.equal(url.searchParams.get("query"), "怪談 & 幽霊");
    assert.equal(url.searchParams.get("language"), "ja-JP");
    assert.equal(url.searchParams.get("include_adult"), "false");
    assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer test-token");
    assert.ok(options?.signal);
    return Response.json({ results: [{ id: 1, title: "怪談", original_title: "Kwaidan", release_date: "1964-12-29", secret: "upstream-only" }] });
  };
  const response = await handleTmdb(new Request(`http://localhost/api/tmdb/search?${new URLSearchParams({ q: "怪談 & 幽霊" })}`), "search", { token: "test-token", fetcher });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Cache-Control")!, /s-maxage=300/);
  const body = await response.json();
  assert.deepEqual(body.data, [{ id: 1, title: "怪談", originalTitle: "Kwaidan", releaseYear: "1964", posterPath: null }]);
  assert.ok(!JSON.stringify(body).includes("test-token"));
  assert.ok(!JSON.stringify(body).includes("upstream-only"));
});

test("missing credentials and invalid input never call TMDB", async () => {
  const fetcher: typeof fetch = async () => { throw new Error("Must not fetch"); };
  const response = await handleTmdb(new Request("http://localhost/?q=Litan"), "search", { fetcher });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "NOT_CONFIGURED");
  for (const q of ["", "   ", "x".repeat(201)]) {
    const response = await handleTmdb(new Request(`http://localhost/?${new URLSearchParams({ q })}`), "search", { token: "test", fetcher });
    assert.equal(response.status, 400);
  }
  for (const id of ["", "0", "-1", "2.5", "1e3", "2147483648", "../search/movie", "1?api_key=foo"]) {
    const response = await handleTmdb(new Request(`http://localhost/?${new URLSearchParams({ movieId: id })}`), "providers", { token: "test", fetcher });
    assert.equal(response.status, 400);
  }
});

test("upstream failures are sanitized and not cached", async () => {
  for (const status of [401, 403, 404, 429, 500]) {
    const response = await handleTmdb(new Request("http://localhost/?q=Litan"), "search", { token: "test-token", fetcher: async () => new Response("secret upstream error", { status }) });
    assert.equal(response.status, status === 429 ? 429 : 502);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.ok(!JSON.stringify(body).includes("secret upstream error"));
  }
  for (const error of [new Error("network"), new DOMException("slow", "TimeoutError")]) {
    const response = await handleTmdb(new Request("http://localhost/?q=Litan"), "search", { token: "test", fetcher: async () => { throw error; } });
    assert.equal(response.status, error.name === "TimeoutError" ? 504 : 502);
  }
  for (const raw of ["not JSON", "{}", '{"results":null}']) {
    const response = await handleTmdb(new Request("http://localhost/?q=Litan"), "search", { token: "test", fetcher: async () => new Response(raw) });
    assert.equal(response.status, 502);
  }
});

test("movie candidates retain original title, missing release dates and valid identifiers", () => {
  assert.deepEqual(parseMovies({ results: [{ id: 3, title: "Film", release_date: "" }, { id: -1, title: "Invalid" }, { id: 4, title: "" }, null] }), [{ id: 3, title: "Film", originalTitle: "Film", releaseYear: null, posterPath: null }]);
  assert.deepEqual(parseMovies({ results: [] }), []);
});

test("providers use JP only, preserve viewing categories and deduplicate within a category", async () => {
  const provider = { provider_id: 8, provider_name: "Test Cinema" };
  const raw = { results: { US: { flatrate: [{ provider_id: 9, provider_name: "US only" }] }, JP: { link: "https://www.themoviedb.org/movie/123/watch?locale=JP", flatrate: [provider, provider], rent: [provider], buy: [provider], ads: [provider], free: [provider] } } };
  const data = parseProviders(raw, 123, new Date("2026-09-29T00:00:00Z"));
  assert.equal(data.region, "JP");
  assert.equal(data.checkedAt, "2026-09-29T00:00:00.000Z");
  assert.equal(data.groups.length, 5);
  assert.ok(data.groups.every(group => group.providers.length === 1));
  assert.ok(!JSON.stringify(data).includes("US only"));
  const response = await handleTmdb(new Request("http://localhost/?movieId=123"), "providers", { token: "test", fetcher: async input => {
    assert.equal(String(input), "https://api.themoviedb.org/3/movie/123/watch/providers");
    return Response.json(raw);
  } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Cache-Control")!, /s-maxage=3600/);
});

test("missing Japanese data stays unknown; unsafe upstream links are discarded", () => {
  for (const results of [{}, { US: { flatrate: [{ provider_id: 8, provider_name: "US only" }] } }, { JP: {} }]) {
    assert.deepEqual(parseProviders({ results }, 123).groups, []);
  }
  for (const link of ["javascript:alert(1)", "https://example.com", "https://www.themoviedb.org.evil.test", "https://user@www.themoviedb.org", "broken"]) {
    assert.equal(parseProviders({ results: { JP: { link } } }, 123).link, "https://www.themoviedb.org/movie/123/watch?locale=JP");
  }
  assert.throws(() => parseProviders({}, 123));
});
