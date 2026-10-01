import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (projectToken && apiHost) {
  try {
    posthog.init(projectToken, {
      api_host: apiHost,
      defaults: "2026-05-30",
      persistence: "sessionStorage",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_performance: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_feature_flags: true,
    });
  } catch {
    // Analytics must never prevent the application from starting.
  }
}
