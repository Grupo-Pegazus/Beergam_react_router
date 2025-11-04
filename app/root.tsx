import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { createTheme, ThemeProvider } from "@mui/material";
import { ptBR } from "@mui/material/locale";
import { ptBR as ptBRDayjs } from "@mui/x-date-pickers/locales";
import * as Sentry from "@sentry/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";
import { isRouteErrorResponse, useLoaderData } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { updateSubscription } from "./features/auth/redux";
import { cryptoAuth, cryptoUser } from "./features/auth/utils";
import { updateUserInfo } from "./features/user/redux";
import type { Subscription } from "./features/user/typings/BaseUser";
import type { IUser } from "./features/user/typings/User";
import store from "./store";
import "./zod";
export const queryClient = new QueryClient();
export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.cdnfonts.com/css/satoshi",
  },
];

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    // Só captura exceções com Sentry em produção
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error);
    }
    if (import.meta.env.DEV) {
      details = error.message;
      stack = error.stack;
    }
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
// export async function loader({ request }: Route.LoaderArgs) {
//   const session = await getSession(request.headers.get("Cookie"));
//   const userInfo = session.get("userInfo") ?? null;
//   return { userInfo };
// }

const theme = createTheme(
  {
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid #b2b2bf",
            borderRadius: "8px",
            padding: "16px",
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
                backgroundColor: "var(--color-beergam-green)",
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "var(--color-beergam-green)",
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
    },
  },
  ptBR,
  ptBRDayjs
);

export async function clientLoader() {
  return {
    userInfo: await cryptoUser.recuperarDados<IUser>(),
    subscriptionInfo: await cryptoAuth.recuperarDados<Subscription>(),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <Toaster toastOptions={{ style: { maxWidth: "500px", width: "auto" } }}>
          {/* {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>{message}</div>
                    {t.data?.additionalMessage && (
                      <div
                        style={{
                          fontSize: "0.85em",
                          opacity: 0.8,
                          marginTop: "4px",
                        }}
                      >
                        {t.data.additionalMessage}
                      </div>
                    )}
                  </div>
                </>
              )}
            </ToastBar>
          )} */}
        </Toaster>
      </body>
    </html>
  );
}

function BootstrapAuth() {
  const { userInfo, subscriptionInfo } =
    useLoaderData<typeof clientLoader>() ?? {};
  const dispatch = useDispatch();
  console.log("userInfo bootstrap", userInfo);
  console.log("subscriptionInfo bootstrap", subscriptionInfo);
  useEffect(() => {
    if (userInfo) {
      dispatch(updateUserInfo(userInfo));
    }
    if (subscriptionInfo) {
      dispatch(updateSubscription(subscriptionInfo));
    }
  }, [dispatch, userInfo, subscriptionInfo]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <Analytics />
      <BootstrapAuth />
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </Provider>
  );
}
