import { useNavigate } from "react-router";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import packageJson from "../../../../../package.json";
import authStore from "~/features/store-zustand";
import type { IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import Svg from "~/src/assets/svgs/_index";
import { useOverlay } from "../../hooks/useOverlay";
import OverlayFrame from "../../shared/OverlayFrame";

export default function HeaderMobile() {
  const user = authStore.use.user();
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const navigate = useNavigate();
  const { logout } = useLogoutFlow({
    redirectTo: "/login",
  });

  const userEmail =
    user && isMaster(user as unknown as IUser)
      ? (user as unknown as IUser)?.details?.email
      : null;
  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
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
                <div className="w-16 h-16 bg-beergam-menu-background rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">
                    {userInitial}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-semibold text-beergam-typography-primary truncate mb-1"
                    title={user?.name}
                  >
                    {user?.name}
                  </p>
                  {userEmail && (
                    <p className="text-sm text-beergam-typography-secondary truncate mb-2">
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
                    navigate("/interno/config");
                    requestClose();
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-beergam-primary text-beergam-white font-medium text-sm active:scale-[0.98] transition-transform"
                >
                  Minha Conta
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
          <p className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-beergam-typography-secondary">
            v{packageJson.version}
          </p>
        </div>
      </OverlayFrame>
      <div className="fixed top-0 left-0 right-0 md:hidden z-1000 bg-beergam-menu-background text-white border-b border-black/10 py-2 px-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Abrir menu do usuário"
          className="flex items-center gap-2.5 rounded-xl bg-white/15 px-3 py-2 active:bg-white/25 border border-white/20 transition-colors min-w-0"
          onClick={open}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-beergam-primary text-beergam-white text-sm font-bold">
            {userInitial}
          </div>
          <span className="text-[15px] font-semibold text-beergam-white truncate max-w-[120px]">
            {user?.name}
          </span>
          <Svg.chevron tailWindClasses="size-4 shrink-0 text-white/80 rotate-90" />
        </button>
        <div className="flex items-center justify-center gap-5">
          {/* <button
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
          </button> */}
        </div>
      </div>
    </>
  );
}
