import type { MovieInfo, ResultId } from "./types";
import { BASE_PATH } from "./base-path.ts";
export function amazonSearchUrl(title: string) {
  return `https://www.amazon.co.jp/s?${new URLSearchParams({ k: `${title} Blu-ray` })}`;
}
export function shareUrl(movie: MovieInfo, result: ResultId, lines: string[], siteUrl: string) {
  const url = new URL(siteUrl);
  url.search = "";
  url.hash = "";
  if (movie.tmdb?.posterPath) {
    url.pathname = `${BASE_PATH}/share`;
    url.searchParams.set("title", movie.title);
    url.searchParams.set("result", result);
    url.searchParams.set("poster", movie.tmdb.posterPath);
  }
  return `https://twitter.com/intent/tweet?${new URLSearchParams({ text: `DISC OR DIE says: ${result} 💀\n\n${movie.title}\n\n"${lines.join("\n")}"\n\n#DiscOrDie`, url: url.href })}`;
}
export const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;
