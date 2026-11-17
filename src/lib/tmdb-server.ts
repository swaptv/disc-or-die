import "server-only";
import { fetchMovie, handleTmdb } from "./tmdb-api";

export function tmdbResponse(request: Request, operation: "search" | "providers") {
  return handleTmdb(request, operation, { token: process.env.TMDB_READ_ACCESS_TOKEN });
}

export function tmdbMovie(rawId: string, locale: "ja" | "en") {
  return fetchMovie(rawId, locale, { token: process.env.TMDB_READ_ACCESS_TOKEN });
}
