export type Choice = "A" | "B";
export type QuestionId = "seen" | "rewatch" | "interest" | "availability" | "stock" | "desire" | "price";
export type Answers = Partial<Record<QuestionId, Choice>>;
export type ResultId = "BUY IT" | "WAIT" | "WATCH FIRST" | "PASS";
export type Metric = "LOVE" | "FOMO" | "RARITY" | "VALUE";
export type Metrics = Record<Metric, number>;
export interface MovieInfo { title: string; price: number | null }
export interface Question { id: QuestionId; label: string; title: string; choices: [string, string]; note?: string; action?: "amazon"; showPrice?: boolean }
export interface Decision { result: ResultId; metrics: Metrics; reason: string }
