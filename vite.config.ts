import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "beergam",
  project: "beergam-frontend",
  // An auth token is required for uploading source maps;
  // store it in an environment variable to keep it secure.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // ...
};

export default defineConfig(async (config) => {
  const plugins = [tailwindcss(), reactRouter(), tsconfigPaths()];

  if (process.env.NODE_ENV === 'production') {
    const sentryPlugins = await sentryReactRouter(sentryConfig, config);

    // sla, as vezes o sentry retornava um único plugin, outras vezes um array, entendi foi nada
    if (Array.isArray(sentryPlugins)) {
      plugins.push(...sentryPlugins);
    } else if (sentryPlugins) {
      plugins.push(sentryPlugins);
    }
  }

  return {
    plugins,
    ssr: {
      noExternal: ["gsap", "@marsidev/react-turnstile"]
    }
  };
});