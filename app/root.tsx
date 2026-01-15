import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import { createTheme, ThemeProvider } from "@mui/material";
// Enable MUI X Date Pickers component keys in theme.components
import { ptBR } from "@mui/material/locale";
import * as Sentry from "@sentry/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
// import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import type { Route } from "./+types/root";
import "./app.css";
import GlobalLoadingSpinner from "./features/auth/components/GlobalLoadingSpinner/GlobalLoadingSpinner";
import { AuthStoreProvider } from "./features/auth/context/AuthStoreContext";
import { SocketStatusIndicator } from "./features/socket/components/SocketStatusIndicator";
import { SocketProvider } from "./features/socket/context/SocketContext";
import authStore from "./features/store-zustand";
import { getQueryClient } from "./lib/queryClient";
import Error from "./src/components/Error";
import type { TError } from "./src/components/Error/typings";
import { CensorshipProvider } from "./src/components/utils/Censorship";
import { ModalProvider } from "./src/components/utils/Modal/ModalProvider";
import { ThemeProvider as DarkModeThemeProvider } from "./src/components/utils/ThemeProvider";
import { SentryUserSync } from "./features/sentry/components/SentryUserSync";
import { FloatingActionButtons } from "./src/components/utils/FloatingActionButtons";
import "./zod";
dayjs.locale("pt-br");

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.cdnfonts.com/css/satoshi",
    integrity:
      "sha384-7FyKUExA/XXTnseV9Spiopx32IfHT00Cwbc/+JMBYo+/XMycNm9YkEsyBayFaW8P",
    crossOrigin: "anonymous",
  },
  {
    rel: "dns-prefetch",
    href: "https://fonts.cdnfonts.com",
  },
  {
    rel: "dns-prefetch",
    href: "https://cdn.beergam.com.br",
  },
  {
    rel: "dns-prefetch",
    href: "http://http2.mlstatic.com",
  },
  {
    rel: "dns-prefetch",
    href: "https://challenges.cloudflare.com",
  },
];

export function meta({}: Route.MetaArgs) {
  const siteUrl = "https://beergam.com.br";
  const siteName = "Beergam";
  const title = "Beergam | ERP Completo para E-commerce";
  const description =
    "Gerencie seu e-commerce com inteligência. Simplifique processos, automatize vendas e expanda seu negócio com a plataforma mais completa para vendedores de e-commerce.";
  const image = `https://cdn2.beergam.com.br/landing_page/Bergamota.webp`;
  const locale = "pt_BR";

  return [
    // Meta tags básicas
    { title },
    { name: "description", content: description },
    { name: "author", content: siteName },

    // Open Graph - Facebook, LinkedIn, etc.
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "449" },
    { property: "og:image:height", content: "532" },
    { property: "og:image:alt", content: title },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: locale },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: siteUrl },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: title },

    // Meta tags adicionais
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: "#ff8a00" },
  ];
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let errorType: TError = "INTERNAL_SERVER_ERROR";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "404";
      details = "The requested page could not be found.";
      errorType = "NOT_FOUND";
    } else if (error.status === 503) {
      message = "Manutenção";
      const data = error.data as { message?: string } | undefined;
      details =
        data?.message ??
        "Estamos realizando algumas atualizações nesta tela. Tente novamente mais tarde.";
      errorType = "MAINTENANCE";
    } else {
      message = "Error";
      details = error.statusText || details;
      errorType = "INTERNAL_SERVER_ERROR";
    }
  } else if (error instanceof Error) {
    // Só captura exceções com Sentry em produção
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error);
    }
    if (import.meta.env.DEV) {
      details = (error as Error).message;
      stack = (error as Error).stack;
    }
  }

  // Obter dados do authStore para o AuthStoreProvider
  const authState = authStore.getState();
  const initialError = authState.error;
  const initialUser = authState.user;
  const initialMarketplace = authState.marketplace;
  const queryClient = getQueryClient();

  if (import.meta.env.DEV) {
    return (
      <QueryClientProvider client={queryClient}>
        <main>
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre>
              <code>{stack}</code>
            </pre>
          )}
        </main>
      </QueryClientProvider>
    );
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthStoreProvider
          initialError={initialError}
          initialUser={initialUser}
          initialMarketplace={initialMarketplace}
        >
          <Error error={errorType} />
        </AuthStoreProvider>
      </QueryClientProvider>
    );
  }
}

const theme = createTheme(
  {
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid transparent",
            backgroundColor: "var(--color-beergam-mui-paper)",
            color: "var(--color-beergam-typography-tertiary)",
            borderRadius: "8px",
            padding: "16px",
            transition: "all 0.3s ease",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
          },
          switchBase: {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: "var(--color-beergam-primary)",
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "var(--color-beergam-primary)",
              border: "6px solid #fff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#f5f5f5",
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.7,
            },
          },
          thumb: {
            boxSizing: "border-box",
            width: 22,
            height: 22,
          },
          track: {
            borderRadius: 13,
            backgroundColor: "#E9E9EA",
            opacity: 1,
            transition: "background-color 500ms",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--color-beergam-input-background)",
            border: "1px solid var(--color-beergam-input-border)",
            color: "var(--color-beergam-typography-tertiary)",
            "&:hover": {
              backgroundColor: "var(--color-beergam-primary)",
              color: "var(--color-beergam-white)",
            },
            "&:disabled": {
              backgroundColor: "var(--color-beergam-input-background-disabled)",
              color: "var(--color-beergam-typography-secondary-disabled)",
            },
          },
        },
      },
      MuiStack: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "var(--color-beergam-typography-primary)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          sizeMedium: {
            "@media (max-width: 768px)": {
              display: "none",
            },
          },
          sizeSmall: {
            "@media (max-width: 768px)": {
              display: "none",
            },
          },
          head: {
            color: "var(--color-beergam-typography-primary)",
          },
          body: {
            color: "var(--color-beergam-typography-secondary)",
          },
        },
      },
    },
    typography: {
      fontFamily: "var(--default-font-family)",
    },
  },
  ptBR
);

export async function clientLoader() {
  const state = authStore.getState();
  const error = state.error;
  const user = state.user;
  const marketplace = state.marketplace;
  return { error, user, marketplace };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1 user-scalable=no"
        />

        {/* Preconnect para recursos críticos - inicia conexão TCP antecipadamente */}
        <link
          rel="preconnect"
          href="https://cdn.beergam.com.br"
          crossOrigin="anonymous"
        />
        {/* cdn de arquivos estáticos da Beergam */}

        <link
          rel="preconnect"
          href="http://http2.mlstatic.com"
          crossOrigin="anonymous"
        />
        {/* cdn de imagens do mercado livre */}

        <link
          rel="preconnect"
          href="https://challenges.cloudflare.com"
          crossOrigin="anonymous"
        />

        {/* Preconnect para APIs críticas */}
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />

        <Meta />
        <Links />
        {/* Script inline para evitar FOUC (Flash of Unstyled Content) no dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                const root = document.documentElement;
                let shouldBeDark = false;
                
                if (theme === 'system') {
                  shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                } else {
                  shouldBeDark = theme === 'dark';
                }
                
                root.classList.remove('light', 'dark');
                if (shouldBeDark) {
                  root.classList.add('dark');
                } else {
                  root.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <DarkModeThemeProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </DarkModeThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <Toaster
          toastOptions={{
            style: { maxWidth: "500px", width: "auto", zIndex: 9999999999999 },
          }}
        ></Toaster>
        <Toaster position="bottom-right" toasterId="notifications"></Toaster>
      </body>
    </html>
  );
}

function SocketConnectionManager() {
  const success = authStore.use.success();
  const isAuthenticated = success === true;
  const showSocketDebug = false;
  return (
    <SocketProvider isAuthenticated={isAuthenticated}>
      <Outlet />
      {showSocketDebug && <SocketStatusIndicator />}
    </SocketProvider>
  );
}

function AuthStoreMonitor() {
  const showDebug = import.meta.env.VITE_DEBUG_ZUSTAND === "true";
  // const envValue = import.meta.env.VITE_DEBUG_ZUSTAND;
  // console.log("🟦🐻 Debug Info:", {
  //   envValue,
  //   type: typeof envValue,
  //   isUndefined: envValue === undefined,
  //   isFalse: envValue === false,
  //   allEnvKeys: Object.keys(import.meta.env).filter((k) => k.includes("DEBUG")),
  //   fullEnv: import.meta.env,
  // });
  if (!showDebug) return null;
  const authState = authStore();
  const authKeys = useMemo(
    () => Object.keys(authState) as Array<keyof typeof authState>,
    [authState]
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenSections((prev) => {
      let updated = false;
      const next = { ...prev };
      for (const key of authKeys) {
        if (!(key in next)) {
          next[key] = false;
          updated = true;
        }
      }
      return updated ? next : prev;
    });
  }, [authKeys]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed bottom-4 left-4 z-9999 w-full max-w-sm rounded-xl border border-beergam-blue-primary/40 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-beergam-blue-primary">
        <span>Zustand Auth Debug</span>
        <span className="text-xs uppercase tracking-wide text-beergam-gray">
          realtime
        </span>
      </div>
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {authKeys.map((key) => {
          const isOpen = openSections[key];
          const value = authState[key];
          return (
            <div
              key={key as string}
              className="rounded-lg border border-beergam-blue-primary/20 bg-white/80"
            >
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-beergam-blue-primary hover:bg-beergam-blue-primary/5"
                onClick={() => toggleSection(String(key))}
              >
                <span>{String(key)}</span>
                <span className="text-xs text-beergam-gray">
                  {isOpen ? "ocultar" : "mostrar"}
                </span>
              </button>
              {isOpen && (
                <pre className="max-h-48 overflow-auto border-t border-beergam-blue-primary/20 px-3 py-2 text-xs text-beergam-gray">
                  {JSON.stringify(value, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const {
    error: initialError,
    user: initialUser,
    marketplace: initialMarketplace,
  } = useLoaderData<typeof clientLoader>();

  const queryClient = getQueryClient();

  return (
    <AuthStoreProvider
      initialError={initialError}
      initialUser={initialUser}
      initialMarketplace={initialMarketplace}
    >
      <CensorshipProvider>
        <Analytics />
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <SentryUserSync />
            <GlobalLoadingSpinner />
            <SocketConnectionManager />
            <AuthStoreMonitor />
            <FloatingActionButtons size="lg" />
          </ModalProvider>
        </QueryClientProvider>
      </CensorshipProvider>
    </AuthStoreProvider>
  );
}