import * as Sentry from "@sentry/react-router";

const isProd = (globalThis?.process?.env?.NODE_ENV) === 'production';

if (isProd) {
  Sentry.init({
    dsn: "https://d60970e1a513659438f62932021d473b@o4508965755158528.ingest.us.sentry.io/4510121563193344",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
  });
}