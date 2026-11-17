"use client";
import { useLanguage } from "./language-provider";
import { amazonAffiliateUrl, rakutenAffiliateUrl, type ShopConfig } from "@/lib/affiliate";

// "今の価格を調べる": affiliate searches for the title's DVD / Blu-ray. Nothing without a title or with both shops off.
export function ShopLinks({ title, shops, hint }: { title: string; shops: ShopConfig; hint: string }) {
  const { t } = useLanguage();
  const links = [
    shops.amazonTag ? { id: "amazon", href: amazonAffiliateUrl(title, shops.amazonTag), label: "Amazon" } : null,
    shops.rakutenId ? { id: "rakuten", href: rakutenAffiliateUrl(title, shops.rakutenId), label: t("楽天ブックス") } : null,
  ].filter(link => link !== null);
  if (!title.trim() || !links.length) return null;
  return <section className="shop-links" aria-label={t("今の価格を調べる（広告）")}>
    <div className="shop-links-head"><span>{t("今の価格を調べる")}</span><span className="ad-tag">{t("広告")} / PR</span></div>
    <div className="shop-links-buttons">{links.map(link => <a key={link.id} data-shop={link.id} href={link.href} target="_blank" rel="sponsored noopener" aria-label={t("{shop}で検索（広告・別タブで開きます）").replace("{shop}", link.label)}>{link.label}<span aria-hidden="true">↗</span></a>)}</div>
    <p>{t(hint).replace("{title}", title)}</p>
  </section>;
}
