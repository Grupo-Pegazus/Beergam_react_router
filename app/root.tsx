import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { createTheme, ThemeProvider } from "@mui/material";
// Enable MUI X Date Pickers component keys in theme.components
import { ptBR } from "@mui/material/locale";
import { ptBR as ptBRDayjs } from "@mui/x-date-pickers/locales";
import "@mui/x-date-pickers/themeAugmentation";
import * as Sentry from "@sentry/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import { isRouteErrorResponse, useLoaderData } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { type IAuthState, updateAuthInfo } from "./features/auth/redux";
import {
  cryptoAuth,
  cryptoMarketplace,
  cryptoUser,
} from "./features/auth/utils";
import { setMarketplace } from "./features/marketplace/redux";
import type { BaseMarketPlace } from "./features/marketplace/typings";
import { updateUserInfo } from "./features/user/redux";
import type { IUser } from "./features/user/typings/User";
import type { RootState } from "./store";
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
            border: "1px solid #e6e6e6",
            borderRadius: "8px",
            padding: "16px",
            transition: "all 0.3s ease",
          },
        },
      },
      // Estilização do calendário (MUI X Date Pickers)
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: "1px solid #e6e6f2",
            padding: 12,
            backgroundColor: "#ffffff",
          },
          viewTransitionContainer: {
            marginTop: 8,
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            paddingLeft: 8,
            paddingRight: 8,
          },
          labelContainer: {
            fontWeight: 700,
            color: "#1f2a44",
          },
          switchViewButton: {
            color: "var(--color-beergam-orange)",
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          root: {
            "& .MuiIconButton-root": {
              color: "var(--color-beergam-orange)",
            },
          },
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          weekDayLabel: {
            color: "#a0a3b1",
            fontWeight: 600,
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            "&.Mui-selected": {
              backgroundColor: "var(--color-beergam-blue-primary)",
              color: "#ffffff",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "var(--color-beergam-blue-primary)",
            },
            "&:hover": {
              backgroundColor: "#eef2ff",
            },
            "&.MuiPickersDay-today": {
              border: "none",
            },
            "&.Mui-disabled": {
              opacity: 0.4,
            },
          },
          dayOutsideMonth: {
            opacity: 0.4,
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
    authInfo: await cryptoAuth.recuperarDados<IAuthState>(),
    marketplace: await cryptoMarketplace.recuperarDados<BaseMarketPlace>(),
  };
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
        <link rel="preconnect" href="https://cdn.beergam.com.br/" />{" "}
        {/* cdn de arquivos estáticos da Beergam */}
        <link rel="preconnect" href="http://http2.mlstatic.com" />{" "}
        {/* cdn de imagens do mercado livre */}
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <Toaster
          toastOptions={{
            style: { maxWidth: "500px", width: "auto", zIndex: 9999999999999 },
          }}
        >
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
  const { userInfo, authInfo } = useLoaderData<typeof clientLoader>() ?? {};
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const userFromRedux = useSelector((state: RootState) => state.user.user);

  console.log("userInfo bootstrap", userInfo);
  console.log("authInfo bootstrap", authInfo);
  console.log("authState no Redux", authState);

  useEffect(() => {
    // Só atualiza userInfo se não houver no Redux
    if (userInfo && !userFromRedux) {
      dispatch(updateUserInfo({ user: userInfo, shouldEncrypt: false }));
    }

    // Só atualiza authInfo se o Redux ainda não foi inicializado com dados válidos
    // Isso evita sobrescrever um login bem-sucedido com dados antigos do loader
    if (authInfo) {
      // Verifica se o Redux já tem um estado válido (login bem-sucedido)
      // ou se já foi inicializado com algum estado (mesmo que seja um erro)
      const isReduxInitialized =
        authState.success === true ||
        authState.error !== null ||
        authState.subscription !== null ||
        authState.loading !== false;

      // Se o Redux já foi inicializado, não sobrescreve (prioriza o estado atual do Redux)
      // Isso garante que um login bem-sucedido não seja sobrescrito por dados antigos do loader
      if (!isReduxInitialized) {
        console.log("Redux não inicializado, atualizando com dados do loader");
        dispatch(updateAuthInfo({ auth: authInfo, shouldEncrypt: false }));
      } else {
        console.log(
          "Redux já inicializado, ignorando dados do loader para evitar sobrescrever estado válido"
        );
      }
    }
  }, [
    dispatch,
    userInfo,
    authInfo,
    authState.success,
    authState.error,
    authState.subscription,
    authState.loading,
    userFromRedux,
  ]);
  return null;
}

function BootstrapMarketplace() {
  const { marketplace } = useLoaderData<typeof clientLoader>() ?? {};
  const dispatch = useDispatch();
  useEffect(() => {
    if (marketplace) {
      dispatch(setMarketplace(marketplace));
    }
  }, [dispatch, marketplace]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <Analytics />
      <BootstrapAuth />
      <BootstrapMarketplace />
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </Provider>
  );
}
