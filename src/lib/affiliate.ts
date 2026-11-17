// Affiliate shopping links (Amazon Associates / Rakuten Affiliate). Pure functions: the server
// reads the environment (see page.tsx) and passes only validated ids to the client.
export interface ShopConfig { amazonTag: string | null; rakutenId: string | null }

// DISC OR DIE's own Rakuten affiliate id and tracking link id (from the Rakuten link generator).
// RAKUTEN_AFFILIATE_ID, when set, replaces the id; an empty or invalid value turns Rakuten off.
export const RAKUTEN_ID_DEFAULT = "599f397f.8d14d22d.599f3980.99bb5002";
export const RAKUTEN_LINK_ID = "_RTLink157309";

export const amazonTagOf = (value: unknown) => {
  const tag = String(value ?? "").trim();
  return /^[A-Za-z0-9][A-Za-z0-9-]{0,60}-22$/.test(tag) ? tag : null;
};
export const rakutenIdOf = (value: unknown) => {
  const id = String(value ?? "").trim();
  return /^[0-9a-f]{8}(\.[0-9a-f]{8}){3}$/i.test(id) ? id : null;
};
export function shopConfig(env: { AMAZON_TAG?: string; RAKUTEN_AFFILIATE_ID?: string }): ShopConfig {
  return { amazonTag: amazonTagOf(env.AMAZON_TAG), rakutenId: rakutenIdOf(env.RAKUTEN_AFFILIATE_ID ?? RAKUTEN_ID_DEFAULT) };
}

// Amazon.co.jp: the title searched in DVD & Blu-ray.
export function amazonAffiliateUrl(title: string, tag: string) {
  return `https://www.amazon.co.jp/s?${new URLSearchParams({ k: title, i: "dvd", tag })}`;
}
// Rakuten Books: the title searched in DVD & Blu-ray (g=003), wrapped in the Rakuten affiliate redirect.
export function rakutenAffiliateUrl(title: string, id: string) {
  const books = `https://books.rakuten.co.jp/search?${new URLSearchParams({ sitem: title, g: "003" })}`;
  return `https://hb.afl.rakuten.co.jp/ichiba/${id}/${RAKUTEN_LINK_ID}?${new URLSearchParams({ pc: books, link_type: "text" })}`;
}
