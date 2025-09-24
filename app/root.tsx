import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { login as loginAction } from "./features/auth/redux";
import type { IUsuario } from "./features/user/typings";
import store from "./store";
import "./zod";
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

export async function clientLoader() {
  if (localStorage.getItem("userInfo")) {
    return {
      userInfo: JSON.parse(
        localStorage.getItem("userInfo") as string
      ) as IUsuario,
    };
  }
  return { userInfo: null };
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
  const { userInfo } = useLoaderData<typeof clientLoader>() ?? {};
  console.log("userInfo do bootstrap", userInfo);
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
      {/* <PersistWrapper>
        <Outlet />
      </PersistWrapper> */}
      <Outlet />
    </Provider>
  );
}
