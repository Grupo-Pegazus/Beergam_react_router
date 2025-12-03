import { Paper } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useOverlay } from "~/features/system/hooks/useOverlay";
import OverlayFrame from "~/features/system/shared/OverlayFrame";
import Svg from "~/src/assets/svgs/_index";
import LogoutOverlay from "~/features/auth/components/LogoutOverlay/LogoutOverlay";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";

type PerfilMenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Svg;
  emBreve?: boolean;
};

const PERFIL_MENU_ITEMS: PerfilMenuItem[] = [
  { key: "minha_conta", label: "Minha Conta", icon: "profile" },
  { key: "colaboradores", label: "Colaboradores", icon: "user_plus" },
  { key: "minha_assinatura", label: "Minha Assinatura", icon: "card" },
  { key: "impostos", label: "Impostos", icon: "calculator" },
  { key: "afiliados", label: "Afiliados", icon: "user_plus", emBreve: true },
];

export default function PerfilMenuOverlay({
  onClose,
  activeButton,
  onSelect,
}: {
  onClose: () => void;
  activeButton: string;
  onSelect: (button: string) => void;
}) {
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const { isLoggingOut, logout } = useLogoutFlow({
    redirectTo: "/login",
  });
  const handleClose = useCallback(() => {
    requestClose(onClose);
  }, [requestClose, onClose]);

  useEffect(() => {
    open();
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  function handleItemClick(item: PerfilMenuItem) {
    if (item.emBreve) return;
    onSelect(item.label);
    handleClose();
  }

  return (
    <OverlayFrame
      title="Configurações de Usuário"
      isOpen={isOpen}
      shouldRender={shouldRender}
      onRequestClose={handleClose}
    >
      <div className="p-2 grid grid-cols-3 gap-2">
        {isLoggingOut && <LogoutOverlay />}
        {PERFIL_MENU_ITEMS.map((item) => {
          const Icon = Svg[item.icon];
          const maybeSolid = item.icon
            ? (Svg[(item.icon + "_solid") as keyof typeof Svg] as
                | typeof Icon
                | undefined)
            : undefined;
          const isActive = activeButton === item.label;
          const ActiveIcon = isActive && maybeSolid ? maybeSolid : Icon;
          return (
            <Paper
              key={item.key}
              onClick={() => handleItemClick(item)}
              className={`relative aspect-square rounded-xl border border-black/10 bg-white shadow-sm p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                item.emBreve
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-beergam-blue-light hover:border-beergam-blue/20 active:scale-95 cursor-pointer"
              } ${isActive ? "border-beergam-orange!" : ""}`}
              elevation={1}
            >
              <span className="leading-none grid place-items-center text-beergam-blue-primary">
                {ActiveIcon ? (
                  <ActiveIcon
                    tailWindClasses={`w-8 h-8 ${isActive ? "text-beergam-orange" : "text-beergam-blue-primary"}`}
                  />
                ) : null}
              </span>
              <span
                className={`text-xs font-medium ${isActive ? "text-beergam-orange" : "text-beergam-blue-primary"} text-center leading-tight`}
              >
                {item.label}
              </span>
              {item.emBreve && (
                <span className="absolute top-1.5 right-1.5 grid place-items-center">
                  <span className="text-[8px] py-0.5 px-1.5 rounded bg-beergam-gray text-white font-medium">
                    Em breve
                  </span>
                </span>
              )}
            </Paper>
          );
        })}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            void logout();
          }}
          className="fixed w-[90%] mx-auto bottom-6 left-0 right-0 flex items-center gap-3 p-3 rounded-xl border border-black/10 bg-beergam-red-light text-beergam-red-primary shadow-sm disabled:opacity-60"
          disabled={isLoggingOut}
        >
          <Svg.logout
            width={20}
            height={20}
            tailWindClasses="text-beergam-red-primary"
          />
          <span className="text-lg font-medium text-beergam-red-primary">
            Sair
          </span>
        </button>
      </div>
    </OverlayFrame>
  );
}
