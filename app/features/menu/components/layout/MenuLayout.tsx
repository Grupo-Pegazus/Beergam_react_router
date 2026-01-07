import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import AccessDenied from "~/features/auth/components/AccessDenied/AccessDenied";
import MaintenanceDenied from "~/features/maintenance/components/MaintenanceDenied";
import { useMaintenanceCheck } from "~/features/maintenance/hooks";
import { getScreenIdFromRoute } from "~/features/maintenance/utils/getScreenIdFromRoute";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollContainer = document.getElementById("system-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [location.pathname]);

  // Se for master, sempre tem acesso a tudo
  const isUserMaster = user && isMaster(user);

  // Verifica acesso apenas para colaboradores
  const hasAccess = isUserMaster
    ? true
    : checkRouteAccess(location.pathname, user?.details.allowed_views);

  // Verifica manutenção da tela atual
  const screenId = getScreenIdFromRoute(location.pathname);
  const { data: maintenanceData } = useMaintenanceCheck(screenId);

  // Se estiver em manutenção, mostra tela de manutenção
  const isMaintenance =
    screenId &&
    maintenanceData?.success &&
    maintenanceData.data?.is_maintenance;

  // Se não tem acesso, mostra acesso negado
  if (!hasAccess) {
    return (
      <MenuProvider>
        <BreadcrumbProvider>
          <div className="flex bg-beergam-blue-primary">
            <div className="hidden md:block">
              <MenuDesktop />
            </div>
            <div className="flex-1 ml-0 min-h-screen">
              <SystemLayout>
                <AccessDenied />
              </SystemLayout>
            </div>
          </div>
        </BreadcrumbProvider>
      </MenuProvider>
    );
  }

  // Se estiver em manutenção, mostra tela de manutenção (mantém layout)
  if (isMaintenance) {
    return (
      <MenuProvider>
        <BreadcrumbProvider>
          <div className="flex bg-menu-background">
            <div className="hidden md:block">
              <MenuDesktop />
            </div>
            <div className="flex-1 ml-0 min-h-screen">
              <SystemLayout>
                <MaintenanceDenied message={maintenanceData.data?.message} />
              </SystemLayout>
            </div>
          </div>
        </BreadcrumbProvider>
      </MenuProvider>
    );
  }

  // Se não está em manutenção e tem acesso, mostra conteúdo normal
  return (
    <MenuProvider>
      <BreadcrumbProvider>
        <div className="flex bg-beergam-blue-primary">
          <div className="hidden md:block">
            <MenuDesktop />
          </div>
          <div className="flex-1 ml-0 min-h-screen">
            <SystemLayout>
              <Outlet />
            </SystemLayout>
          </div>
        </div>
      </BreadcrumbProvider>
    </MenuProvider>
  );
}
