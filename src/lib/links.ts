import type { Decision, MovieInfo } from "./types";
import { BASE_PATH } from "./base-path.ts";
import type { Locale } from "./i18n.ts";
import { resultJapanese } from "../data/results.ts";
export function amazonSearchUrl(title: string) {
  return `https://www.amazon.co.jp/s?${new URLSearchParams({ k: `${title} Blu-ray` })}`;
}
export function shareUrl(movie: MovieInfo, decision: Decision, lines: string[], siteUrl: string, locale?: Locale) {
  const url = new URL(siteUrl);
  url.search = "";
  url.hash = "";
  url.pathname = `${BASE_PATH}/share`;
  url.searchParams.set("title", movie.title);
  url.searchParams.set("result", decision.result);
  if (movie.tmdb?.posterPath) url.searchParams.set("poster", movie.tmdb.posterPath);
  for (const [name, value] of Object.entries(decision.metrics)) url.searchParams.set(name.toLowerCase(), String(value));
  if (locale) url.searchParams.set("lang", locale);
  return `https://twitter.com/intent/tweet?${new URLSearchParams({ text: `DISC OR DIE says: ${decision.result} / ${resultJapanese[decision.result]} 💀\n\n${movie.title}\n\n"${lines.join("\n")}"\n\n#DiscOrDie`, url: url.href })}`;
}
export const formatPrice = (price: number, locale: Locale = "ja") => locale === "en" ? `JPY ¥${price.toLocaleString("en-US")}` : `¥${price.toLocaleString("ja-JP")}`;
