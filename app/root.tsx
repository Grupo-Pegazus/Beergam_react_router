import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { login as loginAction } from "./features/auth/redux";
import { getSession } from "./sessions";
import store from "./store";
import "./zod";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userInfo = session.get("userInfo") ?? null;
  return { userInfo };
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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function BootstrapAuth() {
  const { userInfo } = useLoaderData<typeof loader>() ?? {};
  const dispatch = useDispatch();
  console.log("userInfo do bootstrap", userInfo);
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
      {/* <PersistWrapper>
        <Outlet />
      </PersistWrapper> */}
      <Outlet />
    </Provider>
  );
}
