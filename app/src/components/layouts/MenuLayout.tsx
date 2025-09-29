import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import Menu from "~/features/menu/components/Menu/Menu";
import type { IUsuario } from "~/features/user/typings";

export default function MenuLayout() {
  const rootData = useRouteLoaderData("root") as
    | { userInfo?: IUsuario }
    | undefined;
  const userInfo = rootData?.userInfo;

  if (!userInfo) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ flex: 1, marginLeft: "120px" }}>
        <Outlet />
      </div>
    </div>
  );
}
