import { Outlet, useLocation } from "react-router";
import AccessDenied from "~/features/auth/components/AccessDenied/AccessDenied";
import authStore from "~/features/store-zustand";
import MenuDesktop from "~/features/system/components/desktop/MenuDesktop";
import SystemLayout from "~/features/system/components/layout/SystemLayout";
import { BreadcrumbProvider } from "~/features/system/context/BreadcrumbContext";
import { isMaster } from "~/features/user/utils";
import { MenuProvider } from "../../context/MenuContext";
import { checkRouteAccess } from "../../utils/checkRouteAccess";
export default function MenuLayout() {
  const location = useLocation();
  const user = authStore.use.user();

  // Se for master, sempre tem acesso a tudo
  const isUserMaster = user && isMaster(user);

  // Verifica acesso apenas para colaboradores
  const hasAccess = isUserMaster
    ? true
    : checkRouteAccess(location.pathname, user?.details.allowed_views);

  return (
    <MenuProvider>
      <BreadcrumbProvider>
        <div className="flex bg-(--color-beergam-blue-primary)">
          <div className="hidden md:block">
            <MenuDesktop />
          </div>
          <div className="flex-1 ml-0 min-h-screen">
            <SystemLayout>
              {hasAccess ? <Outlet /> : <AccessDenied />}
            </SystemLayout>
          </div>
        </div>
      </BreadcrumbProvider>
    </MenuProvider>
  );
}
