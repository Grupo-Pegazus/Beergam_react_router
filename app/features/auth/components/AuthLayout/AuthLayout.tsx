import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import type { IUser } from "~/features/user/typings/User";

export default function AuthLayout() {
  const rootData = useRouteLoaderData("root") as
    | { userInfo?: IUser }
    | undefined;
  const userInfo = rootData?.userInfo;

  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}
