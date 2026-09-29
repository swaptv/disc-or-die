import { parseMovies, parseProviders } from "./tmdb.ts";
import type { ApiResponse, TmdbErrorCode } from "./types.ts";

type Dependencies = { token?: string; fetcher?: typeof fetch };
const messages: Record<TmdbErrorCode, string> = {
  NOT_CONFIGURED: "現在、作品検索・配信情報は利用できません。手入力で診断を続けられます。",
  INVALID_INPUT: "検索語または作品IDを確認してください。",
  UNAVAILABLE: "映画情報を取得できませんでした。時間をおいて再試行するか、手動で確認してください。",
  RATE_LIMITED: "検索が混み合っています。少し待ってから再試行してください。",
  TIMEOUT: "映画情報の取得に時間がかかっています。再試行するか、手動で確認してください。",
};
function failure(code: TmdbErrorCode, status: number) {
  const body: ApiResponse<never> = { ok: false, error: { code, message: messages[code] } };
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Token injection makes the server integration testable without real credentials.
// Only tmdb-server.ts reads the environment; this module is never imported by UI.
export async function handleTmdb(request: Request, operation: "search" | "providers", { token, fetcher = fetch }: Dependencies): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  const rawId = params.get("movieId") ?? "";
  const movieId = Number(rawId);
  if (operation === "search" ? !query || query.length > 200 : !/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(movieId) || movieId > 2147483647) {
    return failure("INVALID_INPUT", 400);
  }
  if (!token?.trim()) return failure("NOT_CONFIGURED", 503);
  const url = new URL(operation === "search" ? "https://api.themoviedb.org/3/search/movie" : `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`);
  if (operation === "search") {
    url.search = new URLSearchParams({ query, language: "ja-JP", include_adult: "false", page: "1" }).toString();
  }
  try {
    const response = await fetcher(url, {
      headers: { Authorization: `Bearer ${token.trim()}`, accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
      redirect: "error",
    });
    if (response.status === 429) return failure("RATE_LIMITED", 429);
    if (!response.ok) return failure("UNAVAILABLE", 502);
    const raw: unknown = await response.json();
    const data = operation === "search" ? parseMovies(raw) : parseProviders(raw, movieId);
    return Response.json({ ok: true, data }, {
      // Cache successful public data only. checkedAt is the actual upstream fetch time.
      headers: { "Cache-Control": `public, max-age=0, s-maxage=${operation === "search" ? 300 : 3600}` },
    });
  } catch (error) {
    return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError") ? failure("TIMEOUT", 504) : failure("UNAVAILABLE", 502);
  }
}
