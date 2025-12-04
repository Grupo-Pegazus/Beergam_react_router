import { useNavigate } from "react-router";
import type { IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import Svg from "~/src/assets/svgs/_index";
import authStore from "~/features/store-zustand";
import LogoutOverlay from "~/features/auth/components/LogoutOverlay/LogoutOverlay";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import { useOverlay } from "../../hooks/useOverlay";
import OverlayFrame from "../../shared/OverlayFrame";

export default function HeaderMobile() {
  const user = authStore.use.user();
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const navigate = useNavigate();
  const { isLoggingOut, logout } = useLogoutFlow({
    redirectTo: "/login",
  });

  const userEmail =
    user && isMaster(user as unknown as IUser)
      ? (user as unknown as IUser)?.details?.email
      : null;
  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      {isLoggingOut && <LogoutOverlay />}
      <OverlayFrame
        title="Usuário"
        isOpen={isOpen}
        shouldRender={shouldRender}
        onRequestClose={requestClose}
      >
        <div className="p-4">
          {user && (
            <div className="flex flex-col gap-4">
              {/* Informações do Usuário */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-beergam-blue-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">
                    {userInitial}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-semibold text-[#323130] truncate mb-1"
                    title={user?.name}
                  >
                    {user?.name}
                  </p>
                  {userEmail && (
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  aria-label="Abrir minha conta"
                  onClick={() => {
                    navigate("/interno/perfil");
                    requestClose();
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-beergam-blue-light text-beergam-blue-primary font-medium text-sm active:scale-[0.98] transition-transform"
                >
                  Minha conta
                </button>
                <button
                  type="button"
                  aria-label="Sair da conta"
                  onClick={(e) => {
                    e.preventDefault();
                    void logout();
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-beergam-red-light text-beergam-red-primary font-medium text-sm active:scale-[0.98] transition-transform"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </OverlayFrame>
      <div className="fixed top-0 left-0 right-0 md:hidden z-1000 bg-beergam-blue-primary text-white border-b border-black/10 py-2 px-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Perfil"
          className="flex items-center gap-2"
          onClick={open}
        >
          <Svg.profile tailWindClasses="size-5" />
          <span className="text-[18px] font-bold text-beergam-white">
            {user?.name}
          </span>
        </button>
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Notificações"
            className="grid place-items-center"
          >
            <Svg.bell tailWindClasses="size-4.5" />
          </button>

          <button
            type="button"
            aria-label="Novidades"
            className="grid place-items-center"
          >
            <Svg.megaphone tailWindClasses="size-4.5" />
          </button>

          <button
            type="button"
            aria-label="Ajuda"
            className="grid place-items-center"
          >
            <Svg.question tailWindClasses="size-4.5" />
          </button>
        </div>
      </div>
    </>
  );
}
