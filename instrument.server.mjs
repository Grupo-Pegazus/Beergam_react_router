import * as Sentry from '@sentry/react-router';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const isProd = (globalThis?.process?.env?.NODE_ENV) === 'production';

if (isProd) {
  Sentry.init({
    dsn: "https://d60970e1a513659438f62932021d473b@o4508965755158528.ingest.us.sentry.io/4510121563193344",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    integrations: [
      nodeProfilingIntegration(),
      // feedbackIntegration não é necessário no servidor, apenas no cliente
    ],
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    profilesSampleRate: 1.0, // profile every transaction

    // Set up performance monitoring
    beforeSend(event) {
      // Filter out 404s from error reporting
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === "NotFoundException" || error?.value?.includes("404")) {
          return null;
        }
      }
      return event;
    },
  });
}