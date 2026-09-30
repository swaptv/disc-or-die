export type Choice = "A" | "B";
export type QuestionId = "seen" | "rewatch" | "interest" | "favorite" | "timing" | "availability" | "stock" | "desire" | "price";
export type Answers = Partial<Record<QuestionId, Choice>>;
export type ResultId = "BUY IT" | "WAIT" | "WATCH FIRST" | "PASS";
export type Metric = "LOVE" | "FOMO" | "RARITY" | "VALUE";
export type Metrics = Record<Metric, number>;
export interface MovieInfo { title: string; price: number | null; tmdb?: MovieMatch }
export interface MovieMatch { id: number; title: string; originalTitle: string; releaseYear: string | null; posterPath?: string | null }
export type ProviderKind = "flatrate" | "free" | "ads" | "rent" | "buy";
export interface WatchProvider { id: number; name: string }
export interface WatchAvailability {
  movieId: number;
  region: "JP";
  checkedAt: string;
  link: string;
  groups: { kind: ProviderKind; providers: WatchProvider[] }[];
}
export type TmdbErrorCode = "NOT_CONFIGURED" | "INVALID_INPUT" | "UNAVAILABLE" | "RATE_LIMITED" | "TIMEOUT";
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: TmdbErrorCode; message: string } };
export interface Question { id: QuestionId; title: string; choices: [string, string]; note?: string; action?: "amazon"; showPrice?: boolean }
export interface Decision { result: ResultId; metrics: Metrics; reason: string }
