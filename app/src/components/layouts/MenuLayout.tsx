import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Menu from "~/features/menu/components/Menu/Menu";
import { createMenuRoutes } from "~/routes";
import type { RootState } from "~/store";
export default function MenuLayout() {
  createMenuRoutes();
  const authState = useSelector((state: RootState) => state.auth);
  console.log(authState);
  if (!authState.success || !authState.user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ flex: 1, marginLeft: "120px" }}>
        <Outlet />
      </div>
    </div>
  );
}
