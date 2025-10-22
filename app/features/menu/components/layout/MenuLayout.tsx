import { Outlet } from "react-router";
import Menu from "~/features/menu/components/Menu/Menu";

export default function MenuLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ flex: 1, marginLeft: "120px" }}>
        <Outlet />
      </div>
    </div>
  );
}
