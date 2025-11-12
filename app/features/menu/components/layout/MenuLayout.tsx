import { Outlet } from "react-router";
import MenuDesktop from "~/features/system/components/desktop/MenuDesktop";
import SystemLayout from "~/features/system/components/layout/SystemLayout";
import { MenuProvider } from "../../context/MenuContext";

export default function MenuLayout() {
  return (
    <MenuProvider>
      <div className="flex bg-(--color-beergam-blue-primary)">
        <div className="hidden md:block">
          <MenuDesktop />
        </div>
        <div className="flex-1 ml-0 min-h-screen">
          <SystemLayout>
            <Outlet />
          </SystemLayout>
        </div>
      </div>
    </MenuProvider>
  );
}
