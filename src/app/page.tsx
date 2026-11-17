import DiscApp from "@/components/disc-app";
import { LanguageProvider } from "@/components/language-provider";
import { requestLocale } from "@/lib/locale-server";
import { shopConfig } from "@/lib/affiliate";
import { tmdbMovie } from "@/lib/tmdb-server";

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const locale = await requestLocale(params.lang);
  // ?tmdb=<id> (from 30 FILM CHALLENGE's movie page) starts the quiz with that movie filled in.
  const rawId = first(params.tmdb);
  const handoff = rawId ? await tmdbMovie(rawId, locale) : null;
  const shops = shopConfig({ AMAZON_TAG: process.env.AMAZON_TAG, RAKUTEN_AFFILIATE_ID: process.env.RAKUTEN_AFFILIATE_ID });
  return <LanguageProvider initialLocale={locale}>
    <DiscApp key={handoff?.id ?? (rawId ? "invalid" : "home")} shops={shops} handoff={handoff ? { movie: handoff, from30film: first(params.from) === "30film" } : rawId ? "failed" : null} />
  </LanguageProvider>;
}
