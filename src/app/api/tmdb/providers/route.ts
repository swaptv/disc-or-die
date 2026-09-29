import { tmdbResponse } from "@/lib/tmdb-server";

export async function GET(request: Request) {
  return tmdbResponse(request, "providers");
}
