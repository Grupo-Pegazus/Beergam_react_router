import { useLocation, useNavigate } from "react-router";
import mobileNav from "../../config/mobileNav";
import type { BottomNavItem } from "../../types";
import { useState } from "react";
import MenuOverlay from "~/features/system/components/mobile/MenuOverlay";
import MobilePortal from "./Portal";
import MobileAccountOverlay from "~/features/system/components/mobile/MobileAccountOverlay";
import { useMarketplaceAccounts } from "~/features/marketplace/hooks/useMarketplaceAccounts";

function NavButton({ item, active, onClick }: { item: BottomNavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  const base = "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs";
  const color = active ? "text-beergam-orange" : "text-white/70";
  return (
    <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} className={[base, color].join(" ")}
      aria-label={item.label}
    >
      <span className="grid place-items-center text-[22px] leading-none">
        <Icon tailWindClasses="w-6 h-6" />
      </span>
      <span className="text-[11px] leading-none">{item.label}</span>
    </button>
  );
}

export default function BottomNav({ items = mobileNav.items }: { items?: ReadonlyArray<BottomNavItem> }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { current } = useMarketplaceAccounts();

  function isActive(item: BottomNavItem) {
    if (!item.destination) return false;
    return location.pathname === item.destination.pathname;
  }

  const leftItems = items.filter((i) => !i.isCenter).slice(0, 2);
  const rightItems = items.filter((i) => !i.isCenter).slice(2);
  const center = items.find((i) => i.isCenter)!;

  return (
    <MobilePortal>
      <nav className="fixed bottom-0 inset-x-0 z-1000 md:hidden">
        <div className="relative mx-auto max-w-screen-sm">
          <div className="rounded-t-2xl shadow-layout-primary bg-beergam-blue-primary/95 backdrop-blur border border-black/5 px-2">
            <div className="grid grid-cols-5 items-end">
              {/* Left two */}
              {leftItems.map((item) => (
                <NavButton
                  key={item.key}
                  item={item}
                  active={isActive(item)}
                  onClick={() => {
                    if (item.destination) navigate(item.destination.pathname);
                  }}
                />
              ))}
              {/* Spacer for center */}
              <div />
              {/* Right two including menu */}
              {rightItems.map((item) => (
                <NavButton
                  key={item.key}
                  item={item}
                  active={isActive(item)}
                  onClick={() => {
                    if (item.key === "menu") setMenuOpen(true);
                    else if (item.destination) navigate(item.destination.pathname);
                  }}
                />
              ))}
            </div>
          </div>
          {/* Center FAB */}
          <button
            type="button"
            aria-label={center.label}
            onClick={() => setAccountOpen(true)}
            className="absolute -top-6 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-beergam-white shadow-xl flex items-center justify-center"
          >
            <div className="h-15 w-15 rounded-full overflow-hidden border-2 border-beergam-blue-primary shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)]">
              <img src={current?.marketplace_image} alt={current?.marketplace_name} className="h-full w-full object-cover" />
            </div>
          </button>
        </div>
      </nav>
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      {accountOpen && <MobileAccountOverlay onClose={() => setAccountOpen(false)} />}
    </MobilePortal>
  );
}


