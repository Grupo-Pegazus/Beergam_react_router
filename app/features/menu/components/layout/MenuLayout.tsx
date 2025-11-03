import { Outlet } from "react-router";
import Menu from "~/features/menu/components/Menu/Menu";
import SystemLayout from "~/features/system/components/layout/SystemLayout";

export default function MenuLayout() {
  return (
    <div style={{ display: "flex", background: "var(--color-beergam-white)" }}>
      <Menu />
      <div style={{ flex: 1, marginLeft: "100px" }}>
        <SystemLayout>
          <Outlet />
        </SystemLayout>
      </div>
    </div>
  );
}
