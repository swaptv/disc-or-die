import type { MovieMatch, ProviderKind, WatchAvailability, WatchProvider } from "./types.ts";

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
const positiveId = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;

// Validate upstream JSON at the boundary; never forward the raw TMDB response.
export function parseMovies(value: unknown): MovieMatch[] {
  const results = object(value).results;
  if (!Array.isArray(results)) throw new Error("Invalid movie response");
  return results.flatMap((entry): MovieMatch[] => {
    const movie = object(entry);
    if (!positiveId(movie.id) || typeof movie.title !== "string" || !movie.title.trim()) return [];
    return [{
      id: movie.id,
      title: movie.title,
      originalTitle: typeof movie.original_title === "string" ? movie.original_title : movie.title,
      releaseYear: typeof movie.release_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date) ? movie.release_date.slice(0, 4) : null,
    }];
  }).slice(0, 20);
}

export function parseProviders(value: unknown, movieId: number, now = new Date()): WatchAvailability {
  const results = object(value).results;
  if (results === null || typeof results !== "object" || Array.isArray(results)) throw new Error("Invalid provider response");
  const japan = object(object(results).JP);
  const kinds: ProviderKind[] = ["flatrate", "free", "ads", "rent", "buy"];
  const groups = kinds.flatMap(kind => {
    const entries = japan[kind];
    if (!Array.isArray(entries)) return [];
    const unique = new Map<number, WatchProvider>();
    for (const entry of entries) {
      const provider = object(entry);
      if (positiveId(provider.provider_id) && typeof provider.provider_name === "string" && provider.provider_name.trim()) {
        unique.set(provider.provider_id, { id: provider.provider_id, name: provider.provider_name });
      }
    }
    return unique.size ? [{ kind, providers: [...unique.values()] }] : [];
  });
  // Only allow TMDB links; never turn arbitrary upstream values into hrefs.
  let link = `https://www.themoviedb.org/movie/${movieId}/watch?locale=JP`;
  if (typeof japan.link === "string") {
    try {
      const url = new URL(japan.link);
      if (url.protocol === "https:" && url.hostname === "www.themoviedb.org" && !url.username && !url.password && !url.port) link = url.href;
    } catch { /* Keep the canonical link. */ }
  }
  return { movieId, region: "JP", checkedAt: now.toISOString(), link, groups };
}
