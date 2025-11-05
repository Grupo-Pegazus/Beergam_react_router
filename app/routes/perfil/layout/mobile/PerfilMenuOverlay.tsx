import { useEffect, useCallback } from "react";
import Svg from "~/src/assets/svgs";
import { useOverlay } from "~/features/system/hooks/useOverlay";
import OverlayFrame from "~/features/system/shared/OverlayFrame";
import { Paper } from "@mui/material";

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
    <OverlayFrame title="Configurações de Usuário" isOpen={isOpen} shouldRender={shouldRender} onRequestClose={handleClose}>
      <div className="p-2 grid grid-cols-3 gap-2">
        {PERFIL_MENU_ITEMS.map((item) => {
          const Icon = Svg[item.icon];
          const isActive = activeButton === item.label;
          return (
            <Paper
              key={item.key}
              onClick={() => handleItemClick(item)}
              className={`relative aspect-square rounded-xl border border-black/10 bg-white shadow-sm p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                item.emBreve
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-beergam-blue-light hover:border-beergam-blue/20 active:scale-95 cursor-pointer"
              } ${isActive ? "bg-beergam-blue-primary/20! border-beergam-blue-primary/40!" : ""}`}
              elevation={1}
            >
              <span className="text-[22px] leading-none grid place-items-center text-beergam-blue-primary">
                <Icon tailWindClasses="w-6 h-6" />
              </span>
              <span className="text-xs font-medium text-beergam-blue-primary text-center leading-tight">{item.label}</span>
              {item.emBreve && (
                <span className="absolute top-1.5 right-1.5 grid place-items-center">
                  <span className="text-[8px] py-0.5 px-1.5 rounded bg-beergam-gray text-white font-medium">Em breve</span>
                </span>
              )}
              {isActive && !item.emBreve && (
                <span className="absolute top-1.5 left-1.5 grid place-items-center w-5 h-5">
                  <div className="bg-beergam-blue-primary w-2 h-2 rounded-full"></div>
                </span>
              )}
            </Paper>
          );
        })}
      </div>
    </OverlayFrame>
  );
}

