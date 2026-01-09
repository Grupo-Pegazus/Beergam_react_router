import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://d60970e1a513659438f62932021d473b@o4508965755158528.ingest.us.sentry.io/4510121563193344",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    integrations: [
      // Session Replay
      Sentry.replayIntegration(),
    ],
    replaysSessionSampleRate: 0.1, // Capture 10% of all sessions
    replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with an error
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});