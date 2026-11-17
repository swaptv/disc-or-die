"use client";
import { useLanguage } from "./language-provider";
import { amazonAffiliateUrl, rakutenAffiliateUrl, type ShopConfig } from "@/lib/affiliate";
import { amazonSearchUrl } from "@/lib/links";

const headings = { price: ["今の価格を調べる", "今の価格を調べる（広告）"], stock: ["入手状況を調べる", "入手状況を調べる（広告）"] } as const;

// Affiliate searches for the title's DVD / Blu-ray. Nothing without a title or without any link.
// amazonFallback (the out-of-print question, which needs a store to answer): without AMAZON_TAG,
// Amazon is still shown as a plain, untagged search.
export function ShopLinks({ title, shops, hint, heading = "price", amazonFallback = false }: { title: string; shops: ShopConfig; hint: string; heading?: keyof typeof headings; amazonFallback?: boolean }) {
  const { t } = useLanguage();
  const links = [
    shops.amazonTag ? { id: "amazon", href: amazonAffiliateUrl(title, shops.amazonTag), label: "Amazon", ad: true }
      : amazonFallback ? { id: "amazon", href: amazonSearchUrl(title), label: "Amazon", ad: false } : null,
    shops.rakutenId ? { id: "rakuten", href: rakutenAffiliateUrl(title, shops.rakutenId), label: t("楽天ブックス"), ad: true } : null,
  ].filter(link => link !== null);
  if (!title.trim() || !links.length) return null;
  const ad = links.some(link => link.ad);
  const [label, adLabel] = headings[heading];
  return <section className="shop-links" aria-label={t(ad ? adLabel : label)}>
    <div className="shop-links-head"><span>{t(label)}</span>{ad && <span className="ad-tag">{t("広告")} / PR</span>}</div>
    <div className="shop-links-buttons">{links.map(link => <a key={link.id} data-shop={link.id} href={link.href} target="_blank" rel={link.ad ? "sponsored noopener" : "noopener noreferrer"} aria-label={t(link.ad ? "{shop}で検索（広告・別タブで開きます）" : "{shop}で検索（別タブで開きます）").replace("{shop}", link.label)}>{link.label}<span aria-hidden="true">↗</span></a>)}</div>
    <p>{t(hint).replace("{title}", title)}</p>
  </section>;
}
