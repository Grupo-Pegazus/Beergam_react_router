import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import Menu from "~/features/menu/components/Menu/Menu";

export default function MenuLayout() {
  const rootData = useRouteLoaderData("root") as { userInfo?: any } | undefined;
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
