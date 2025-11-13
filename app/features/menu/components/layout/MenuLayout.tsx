import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import type { IAuthState } from "~/features/auth/redux";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import MenuDesktop from "~/features/system/components/desktop/MenuDesktop";
import SystemLayout from "~/features/system/components/layout/SystemLayout";
import { MenuProvider } from "../../context/MenuContext";

export default function MenuLayout() {
  const rootData = useRouteLoaderData("root") as
    | { marketplace?: BaseMarketPlace; authInfo?: IAuthState }
    | undefined;
  const marketplace = rootData?.marketplace;
  if (!marketplace) {
    return <Navigate to="/interno/choosen_account" replace />;
  }

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
