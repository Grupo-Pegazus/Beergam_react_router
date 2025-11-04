import { Outlet } from "react-router";
import MenuDesktop from "~/features/system/components/desktop/MenuDesktop";
import SystemLayout from "~/features/system/components/layout/SystemLayout";

export default function MenuLayout() {
  return (
    <div className="flex bg-(--color-beergam-white)">
      <div className="hidden md:block">
        <MenuDesktop />
      </div>
      <div className="flex-1 md:ml-[100px] ml-0">
        <SystemLayout>
          <Outlet />
        </SystemLayout>
      </div>
    </div>
  );
}
