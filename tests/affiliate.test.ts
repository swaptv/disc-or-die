import { test } from "node:test";
import assert from "node:assert/strict";
import { RAKUTEN_ID_DEFAULT, amazonAffiliateUrl, rakutenAffiliateUrl, shopConfig } from "../src/lib/affiliate.ts";

test("Rakuten is on with DISC OR DIE's own id; Amazon only with a valid AMAZON_TAG", () => {
  assert.deepEqual(shopConfig({}), { amazonTag: null, rakutenId: RAKUTEN_ID_DEFAULT });
  assert.deepEqual(shopConfig({ AMAZON_TAG: " disc-22 ", RAKUTEN_AFFILIATE_ID: "" }), { amazonTag: "disc-22", rakutenId: null });
  assert.equal(shopConfig({ AMAZON_TAG: "disc-23" }).amazonTag, null);
  assert.equal(shopConfig({ AMAZON_TAG: "a&b-22" }).amazonTag, null);
  assert.equal(shopConfig({ RAKUTEN_AFFILIATE_ID: "not-an-id" }).rakutenId, null);
  assert.equal(shopConfig({ RAKUTEN_AFFILIATE_ID: "0123abcd.0123abcd.0123abcd.0123abcd" }).rakutenId, "0123abcd.0123abcd.0123abcd.0123abcd");
});

test("Rakuten link wraps a Rakuten Books DVD/Blu-ray search in the affiliate redirect with the tracking link id", () => {
  const url = new URL(rakutenAffiliateUrl("マトリックス & 2", RAKUTEN_ID_DEFAULT));
  assert.equal(url.origin, "https://hb.afl.rakuten.co.jp");
  assert.equal(url.pathname, `/ichiba/${RAKUTEN_ID_DEFAULT}/_RTLink157309`);
  assert.equal(url.searchParams.get("link_type"), "text");
  const books = new URL(url.searchParams.get("pc")!);
  assert.equal(books.origin + books.pathname, "https://books.rakuten.co.jp/search");
  assert.equal(books.searchParams.get("sitem"), "マトリックス & 2");
  assert.equal(books.searchParams.get("g"), "003");
});

test("Amazon link searches DVD & Blu-ray with the associate tag", () => {
  const url = new URL(amazonAffiliateUrl("Film & Co", "disc-22"));
  assert.equal(url.origin + url.pathname, "https://www.amazon.co.jp/s");
  assert.equal(url.searchParams.get("k"), "Film & Co");
  assert.equal(url.searchParams.get("i"), "dvd");
  assert.equal(url.searchParams.get("tag"), "disc-22");
});
