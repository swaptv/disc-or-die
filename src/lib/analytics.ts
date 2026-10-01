import posthog from "posthog-js";
import type { Locale } from "./i18n";
import type { QuestionId, ResultId } from "./types";

type AnalyticsEvents = {
  app_opened: { locale: Locale };
  start_clicked: { locale: Locale };
  quiz_started: { locale: Locale; input_method: "tmdb" | "manual"; has_price: boolean };
  question_viewed: { locale: Locale; question_id: QuestionId; question_number: number; question_count: number };
  diagnosis_completed: { locale: Locale; result: ResultId; question_count: number };
  provider_confirmed: { locale: Locale };
  amazon_clicked: { locale: Locale; question_id: QuestionId };
  share_clicked: { locale: Locale; result: ResultId };
  restart_clicked: { locale: Locale; result: ResultId };
};

const analyticsConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export function trackAnalytics<EventName extends keyof AnalyticsEvents>(
  event: EventName,
  properties: AnalyticsEvents[EventName],
) {
  if (!analyticsConfigured) return;

  try {
    posthog.capture(event, {
      app: "disc-or-die",
      analytics_schema_version: 1,
      ...properties,
    });
  } catch {
    // Measurement failures must not affect the diagnosis flow.
  }
}
