import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import type { IUsuario } from "~/features/user/typings";

export default function AuthLayout() {
  const rootData = useRouteLoaderData("root") as
    | { userInfo?: IUsuario }
    | undefined;
  const userInfo = rootData?.userInfo;

  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}
