import { Outlet } from "react-router";
// import { all_routes } from "~/routes";
import { createMenuRoutes } from "~/routes";
import Menu from "~/features/menu/components/Menu/Menu";
export default function MenuLayout() {
    createMenuRoutes();
  return <div style={{ display: "flex" }}>
  <Menu />
  <div style={{ flex: 1, marginLeft: "120px" }}>
    <Outlet />
  </div>
</div>
}