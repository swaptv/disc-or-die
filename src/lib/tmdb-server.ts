import "server-only";
import { handleTmdb } from "./tmdb-api";

export function tmdbResponse(request: Request, operation: "search" | "providers") {
  return handleTmdb(request, operation, { token: process.env.TMDB_READ_ACCESS_TOKEN });
}
