import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { createTheme, ThemeProvider } from "@mui/material";
import { ptBR } from "@mui/material/locale";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { login as loginAction } from "./features/auth/redux";
import { cryptoUser } from "./features/auth/utils";
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

// export async function loader({ request }: Route.LoaderArgs) {
//   const session = await getSession(request.headers.get("Cookie"));
//   const userInfo = session.get("userInfo") ?? null;
//   return { userInfo };
// }

const theme = createTheme({}, ptBR);

export async function clientLoader() {
  return { userInfo: await cryptoUser.recuperarDados<IUser>() };
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
  const { userInfo } = useLoaderData<typeof clientLoader>() ?? {};
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo) {
      dispatch(loginAction(userInfo));
    }
  }, [dispatch, userInfo]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <BootstrapAuth />
      <ErrorBoundary
        fallback={<div>Error</div>}
        onError={(error) => {
          console.log("error capturado", error);
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ErrorBoundary>
    </Provider>
  );
}
