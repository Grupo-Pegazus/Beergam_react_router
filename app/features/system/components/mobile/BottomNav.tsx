import { useEffect, useMemo, useState } from "react";
import { PrefetchPageLinks, useLocation, useNavigate } from "react-router";
import mobileNav, { dynamicDefaultParentKey } from "../../config/mobileNav";
import type { BottomNavItem } from "../../types";
import MenuOverlay from "~/features/system/components/mobile/MenuOverlay";
import MobilePortal from "./Portal";
import MobileAccountOverlay from "~/features/system/components/mobile/MobileAccountOverlay";
import { useMarketplaceAccounts } from "~/features/marketplace/hooks/useMarketplaceAccounts";
import { MenuConfig, type IMenuItem } from "~/features/menu/typings";
import { DEFAULT_INTERNAL_PATH, findKeyPathByRoute, getIcon, getRelativePath } from "~/features/menu/utils";
import SubmenuOverlay from "~/features/system/components/mobile/SubmenuOverlay";
import Svg from "~/src/assets/svgs";

function NavButton({ item, active, onClick, onIntent }: { item: BottomNavItem; active: boolean; onClick: () => void; onIntent?: () => void }) {
  const Icon = item.icon;
  const base = "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs";
  const color = active ? "text-beergam-orange" : "text-white/70";
  return (
    <button type="button" onClick={onClick} onMouseEnter={onIntent} onFocus={onIntent} aria-current={active ? "page" : undefined} className={[base, color].join(" ")}
      aria-label={item.label}
    >
      <span className="grid place-items-center text-[22px] leading-none">
        <Icon tailWindClasses="w-6 h-6" />
      </span>
      <span className="text-[11px] leading-none">{item.label}</span>
    </button>
  );
}

const LAST_VISITED_PARENTS_KEY = "beergam:lastVisitedParents";

export default function BottomNav({ items = mobileNav.items }: { items?: ReadonlyArray<BottomNavItem> }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [prefetchPage, setPrefetchPage] = useState<string | undefined>(undefined);
  const [submenuOpen, setSubmenuOpen] = useState<{
    open: boolean;
    items?: Record<string, IMenuItem>;
    parentLabel?: string;
    parentKey?: string;
  }>({ open: false });
  const { current } = useMarketplaceAccounts();
  const [lastVisitedParents, setLastVisitedParents] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LAST_VISITED_PARENTS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [dynamicDefaultParentKey];
    } catch {
      return [dynamicDefaultParentKey];
    }
  });


  useEffect(() => {
    const { keyChain } = findKeyPathByRoute(MenuConfig, location.pathname);
    if (keyChain.length > 0) {
      const topParent = keyChain[0];
      try {
        setLastVisitedParents((prev) => {
          const next = [topParent, ...prev.filter((k) => k !== topParent)].slice(0, 8);
          localStorage.setItem(LAST_VISITED_PARENTS_KEY, JSON.stringify(next));
          return next;
        });
      } catch { void 0; }
    }
  }, [location.pathname]);

  const currentKeyChain = useMemo(() => {
    const { keyChain } = findKeyPathByRoute(MenuConfig, location.pathname);
    return keyChain;
  }, [location.pathname]);

  function isActive(item: BottomNavItem) {
    if (item.key === "complaints") {
      const parentKey = effectiveParentKey ?? lastVisitedParents[0] ?? dynamicDefaultParentKey;
      return currentKeyChain[0] === parentKey;
    }
    if (!item.destination) return false;
    return location.pathname === item.destination.pathname;
  }

  const iconForMenuKey = (menuKey: string) => {
    const item = (MenuConfig as Record<string, IMenuItem>)[menuKey];
    if (!item || !item.icon) return undefined;
    return getIcon(item.icon);
  };

  const excludedParents = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) {
      if (it.isCenter || it.key === "menu") continue;
      if (!it.destination) continue;
      const { keyChain } = findKeyPathByRoute(MenuConfig, it.destination.pathname);
      if (keyChain.length > 0) set.add(keyChain[0]);
    }
    return set;
  }, [items]);

  const effectiveParentKey = useMemo(() => {
    const choice = lastVisitedParents.find((k) => !excludedParents.has(k));
    return choice ?? (excludedParents.has(dynamicDefaultParentKey) ? undefined : dynamicDefaultParentKey);
  }, [lastVisitedParents, excludedParents]);

  // Construir item dinâmico baseado no pai efetivo (fallback seguro)
  const dynamicItem: BottomNavItem = useMemo(() => {
    const parentKey = effectiveParentKey ?? lastVisitedParents[0] ?? dynamicDefaultParentKey;
    const parent = (MenuConfig as Record<string, IMenuItem>)[parentKey];
    const icon = parent?.icon ? getIcon(parent.icon) : (items[3]?.icon as BottomNavItem["icon"]);
    const destinationPath = getRelativePath(parentKey) || DEFAULT_INTERNAL_PATH;
    return {
      key: "complaints",
      label: parent?.label ?? items[3]?.label ?? "Atendimento",
      destination: { pathname: destinationPath },
      icon: icon!,
    };
  }, [items, effectiveParentKey, lastVisitedParents]);

  // Substituir ícones fixos pelos do Menu real (onde aplicável) e injetar o item dinâmico
  const computedItems: ReadonlyArray<BottomNavItem> = useMemo(() => {
    const base = [...items];
    // índices: 0 home, 1 vendas, 2 center account, 3 dinâmico, 4 menu
    const homeKey = "inicio";
    const salesKey = "vendas";
    const iconHome = iconForMenuKey(homeKey);
    const iconSales = iconForMenuKey(salesKey);
    const iconMenu = getIcon("list" as keyof typeof Svg);

    if (iconHome) base[0] = { ...base[0], icon: iconHome } as BottomNavItem;
    if (iconSales) base[1] = { ...base[1], icon: iconSales } as BottomNavItem;

    const homeItem = (MenuConfig as Record<string, IMenuItem>)[homeKey];
    const salesItem = (MenuConfig as Record<string, IMenuItem>)[salesKey];
    if (homeItem) {
      base[0] = {
        ...base[0],
        label: homeItem.label,
        destination: { pathname: getRelativePath(homeKey) || DEFAULT_INTERNAL_PATH },
      } as BottomNavItem;
    }
    if (salesItem) {
      base[1] = {
        ...base[1],
        label: salesItem.label,
        destination: { pathname: getRelativePath(salesKey) || (DEFAULT_INTERNAL_PATH + "/vendas") },
      } as BottomNavItem;
    }

    base[3] = dynamicItem;

    if (iconMenu) base[4] = { ...base[4], icon: iconMenu } as BottomNavItem;
    return base;
  }, [items, dynamicItem]);

  const leftItems = computedItems.filter((i) => !i.isCenter).slice(0, 2);
  const rightItems = computedItems.filter((i) => !i.isCenter).slice(2);
  const center = computedItems.find((i) => i.isCenter)!;

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
                  onIntent={() => {
                    const path = item.destination?.pathname;
                    if (path) setPrefetchPage(path);
                  }}
                  onClick={() => {
                    if (item.key === "complaints") {
                      const parentKey = effectiveParentKey ?? lastVisitedParents[0] ?? "atendimento";
                      const parent = (MenuConfig as Record<string, IMenuItem>)[parentKey];
                      if (parent?.dropdown) {
                        setSubmenuOpen({
                          open: true,
                          items: parent.dropdown,
                          parentLabel: parent.label,
                          parentKey,
                        });
                        return;
                      }
                    }
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
                  onIntent={() => {
                    const path = item.destination?.pathname;
                    if (path) setPrefetchPage(path);
                  }}
                  onClick={() => {
                    if (item.key === "menu") setMenuOpen(true);
                    else if (item.key === "complaints") {
                      const parentKey = effectiveParentKey ?? lastVisitedParents[0] ?? "atendimento";
                      const parent = (MenuConfig as Record<string, IMenuItem>)[parentKey];
                      if (parent?.dropdown) {
                        setSubmenuOpen({
                          open: true,
                          items: parent.dropdown,
                          parentLabel: parent.label,
                          parentKey,
                        });
                        return;
                      }
                      if (item.destination) navigate(item.destination.pathname);
                    } else if (item.destination) navigate(item.destination.pathname);
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
      {prefetchPage ? <PrefetchPageLinks page={prefetchPage} /> : null}
      {submenuOpen.open && submenuOpen.items && (
        <SubmenuOverlay
          items={submenuOpen.items}
          parentLabel={submenuOpen.parentLabel || ""}
          parentKey={submenuOpen.parentKey}
          onClose={() => setSubmenuOpen({ open: false })}
          onBack={() => setSubmenuOpen({ open: false })}
        />
      )}
    </MobilePortal>
  );
}


