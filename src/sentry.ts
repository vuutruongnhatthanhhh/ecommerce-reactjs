import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  // Bật log lên Sentry
  enableLogs: true,

  integrations: [
    // Gửi điều hướng trang, API call, v.v. để có performance/traces
    Sentry.browserTracingIntegration(),

    // Gửi console.log / console.warn / console.error tự động lên Sentry
    Sentry.consoleLoggingIntegration({
      levels: ["log", "warn", "error"],
    }),
  ],

  // Optional: performance sampling
  tracesSampleRate: 1.0,
});
