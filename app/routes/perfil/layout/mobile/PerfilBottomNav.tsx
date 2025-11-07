import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import Svg from "~/src/assets/svgs/_index";
import MobilePortal from "~/features/system/components/mobile/Portal";
import type { RootState } from "~/store";
import PerfilMenuOverlay from "./PerfilMenuOverlay";

const LAST_ROUTE_BEFORE_PERFIL_KEY = "beergam:lastRouteBeforePerfil";

type PerfilNavItem = {
  key: string;
  label: string;
  icon: keyof typeof Svg;
  iconSolid?: keyof typeof Svg;
  onClick: () => void;
  active: boolean;
  emBreve?: boolean;
};

function NavButton({ item, active, onClick }: { item: PerfilNavItem; active: boolean; onClick: () => void }) {
  const Icon = active && item.iconSolid ? Svg[item.iconSolid] : Svg[item.icon];
  const base = "flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs relative";
  const color = active ? "text-beergam-orange" : item.emBreve ? "text-white/40" : "text-white/70";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={item.emBreve}
      aria-current={active ? "page" : undefined}
      className={[base, color, item.emBreve ? "cursor-not-allowed" : ""].join(" ")}
      aria-label={item.label}
    >
      <span className="grid place-items-center text-[22px] leading-none">
        {Icon ? <Icon tailWindClasses="w-6 h-6" /> : null}
      </span>
      <span className="text-[10px] leading-tight text-center">{item.label}</span>
      {item.emBreve && (
        <span className="absolute top-0.5 right-0.5 text-[8px] px-1 py-0.5 rounded bg-beergam-gray/80 text-white">
          Em breve
        </span>
      )}
    </button>
  );
}

interface PerfilBottomNavProps {
  activeButton: string;
  onSelect: (button: string) => void;
}

export default function PerfilBottomNav({ activeButton, onSelect }: PerfilBottomNavProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const marketplace = useSelector((state: RootState) => state.marketplace.marketplace);
  const hasSavedRoute = useRef(false);

  // Salvar a última rota quando montar o componente (primeira vez no perfil)
  useEffect(() => {
    if (hasSavedRoute.current || typeof window === "undefined") return;
    
    // Tentar pegar do referrer ou do histórico
    const referrer = document.referrer;
    if (referrer && !referrer.includes("/perfil")) {
      try {
        const referrerUrl = new URL(referrer);
        const referrerPath = referrerUrl.pathname;
        if (referrerPath && !referrerPath.includes("/perfil")) {
          sessionStorage.setItem(LAST_ROUTE_BEFORE_PERFIL_KEY, referrerPath);
          hasSavedRoute.current = true;
          return;
        }
      } catch {
        // Ignorar erro ao criar URL
      }
    }
    
    // Fallback: usar a rota do início do sistema
    const lastRoute = sessionStorage.getItem(LAST_ROUTE_BEFORE_PERFIL_KEY);
    if (!lastRoute || lastRoute.includes("/perfil")) {
      sessionStorage.setItem(LAST_ROUTE_BEFORE_PERFIL_KEY, "/interno");
    }
    hasSavedRoute.current = true;
  }, []);

  const handleVoltar = () => {
    if (marketplace) {
      // Se tiver marketplace, volta para a última página visitada
      const lastRoute = sessionStorage.getItem(LAST_ROUTE_BEFORE_PERFIL_KEY);
      if (lastRoute && !lastRoute.includes("/perfil")) {
        navigate(lastRoute);
      } else {
        // Fallback: vai para o início do sistema
        navigate("/interno");
      }
    } else {
      // Se não tiver marketplace, vai para choosen_account
      navigate("/interno/choosen_account");
    }
  };

  const navItems: PerfilNavItem[] = [
    {
      key: "minha_conta",
      label: "Minha Conta",
      icon: "profile",
      onClick: () => onSelect("Minha Conta"),
      active: activeButton === "Minha Conta",
      iconSolid: "profile_solid",
    },
    {
      key: "colaboradores",
      label: "Colaboradores",
      icon: "user_plus",
      onClick: () => onSelect("Colaboradores"),
      active: activeButton === "Colaboradores",
      iconSolid: "user_plus_solid",
    },
    {
      key: "minha_assinatura",
      label: "Assinatura",
      icon: "card",
      onClick: () => onSelect("Minha Assinatura"),
      active: activeButton === "Minha Assinatura",
      iconSolid: "card_solid",
    },
    {
      key: "voltar",
      label: "Voltar",
      icon: "arrow_uturn_left",
      onClick: handleVoltar,
      active: false,
    },
    {
      key: "menu",
      label: "Menu",
      icon: "list",
      onClick: () => setMenuOpen(true),
      active: false,
    },
  ];

  return (
    <>
      <MobilePortal>
        <nav className="fixed bottom-0 inset-x-0 z-1000 md:hidden">
          <div className="relative mx-auto max-w-screen-sm">
            <div className="rounded-t-2xl shadow-layout-primary bg-beergam-blue-primary/95 backdrop-blur border border-black/5 px-1">
              <div className="grid grid-cols-5 items-end">
                {navItems.map((item) => (
                  <NavButton key={item.key} item={item} active={item.active} onClick={item.onClick} />
                ))}
              </div>
            </div>
          </div>
        </nav>
      </MobilePortal>
      {menuOpen && (
        <PerfilMenuOverlay
          onClose={() => setMenuOpen(false)}
          activeButton={activeButton}
          onSelect={(button) => {
            onSelect(button);
            setMenuOpen(false);
          }}
        />
      )}
    </>
  );
}

