import type { MovieInfo, ResultId } from "./types";
export function amazonSearchUrl(title: string) {
  return `https://www.amazon.co.jp/s?${new URLSearchParams({ k: `${title} Blu-ray` })}`;
}
export function shareUrl(movie: MovieInfo, result: ResultId, lines: string[], siteUrl: string) {
  return `https://twitter.com/intent/tweet?${new URLSearchParams({ text: `DISC OR DIE says: ${result} 💀\n\n${movie.title}\n\n"${lines.join("\n")}"\n\n#DiscOrDie`, url: siteUrl })}`;
}
export const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;
