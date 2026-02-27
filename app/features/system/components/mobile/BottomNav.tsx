import type { IMenuItem } from "~/features/menu/typings";
import { useEffect, useMemo, useState } from "react";
import { PrefetchPageLinks, useLocation, useNavigate } from "react-router";
import { useMarketplaceAccounts } from "~/features/marketplace/hooks/useMarketplaceAccounts";
import { MenuConfig } from "~/features/menu/typings";
import {
  DEFAULT_INTERNAL_PATH,
  findKeyPathByRoute,
  getIcon,
  getRelativePath,
} from "~/features/menu/utils";
import MenuOverlay from "~/features/system/components/mobile/MenuOverlay";
import MobileAccountOverlay from "~/features/system/components/mobile/MobileAccountOverlay";
import SubmenuOverlay from "~/features/system/components/mobile/SubmenuOverlay";
import Svg from "~/src/assets/svgs/_index";
import mobileNav, {
  freeMobileNav,
  dynamicDefaultParentKey,
} from "../../config/mobileNav";
import type { BottomNavItem } from "../../types";
import MobilePortal from "./Portal";
import { isFree } from "~/features/plans/planUtils";
import authStore from "~/features/store-zustand";

const LAST_VISITED_PARENTS_KEY = "beergam:lastVisitedParents";

function solidIconForMenuKey(menuKey: string): BottomNavItem["icon"] | undefined {
  const item = (MenuConfig as Record<string, IMenuItem>)[menuKey];
  if (!item?.icon) return undefined;
  const solidKey = (item.icon + "_solid") as keyof typeof Svg;
  return (Svg as Record<string, unknown>)[solidKey] as BottomNavItem["icon"] | undefined;
}

function buildFreeItems(
  baseItems: ReadonlyArray<BottomNavItem>
): ReadonlyArray<BottomNavItem> {
  const base = [...baseItems];

  const homeKey = "inicio";
  const homeItem = (MenuConfig as Record<string, IMenuItem>)[homeKey];
  const iconHome = getIcon(homeItem?.icon as keyof typeof Svg);
  const iconHomeSolid = solidIconForMenuKey(homeKey);

  if (iconHome) {
    base[0] = {
      ...base[0],
      icon: iconHome,
      iconSolid: iconHomeSolid ?? base[0].iconSolid,
      label: homeItem?.label ?? base[0].label,
      destination: { pathname: getRelativePath(homeKey) || DEFAULT_INTERNAL_PATH },
    } as BottomNavItem;
  }

  const conteudoKey = "conteudo";
  const conteudoItem = (MenuConfig as Record<string, IMenuItem>)[conteudoKey];
  const iconConteudo = getIcon(conteudoItem?.icon as keyof typeof Svg);
  const iconConteudoSolid = solidIconForMenuKey(conteudoKey);

  if (conteudoItem) {
    base[2] = {
      ...base[2],
      icon: iconConteudo ?? base[2].icon,
      iconSolid: iconConteudoSolid ?? base[2].iconSolid,
      label: conteudoItem.label,
    } as BottomNavItem;
  }

  return base;
}

function buildPaidItems(
  baseItems: ReadonlyArray<BottomNavItem>,
  dynamicItem: BottomNavItem
): ReadonlyArray<BottomNavItem> {
  const base = [...baseItems];
  const homeKey = "inicio";
  const salesKey = "vendas";
  const homeItem = (MenuConfig as Record<string, IMenuItem>)[homeKey];
  const salesItem = (MenuConfig as Record<string, IMenuItem>)[salesKey];
  const iconHome = getIcon(homeItem?.icon as keyof typeof Svg);
  const iconHomeSolid = solidIconForMenuKey(homeKey);
  const iconSales = getIcon(salesItem?.icon as keyof typeof Svg);
  const iconSalesSolid = solidIconForMenuKey(salesKey);
  const iconMenu = getIcon("list" as keyof typeof Svg);

  if (iconHome) {
    base[0] = {
      ...base[0],
      icon: iconHome,
      iconSolid: iconHomeSolid ?? base[0].iconSolid,
      label: homeItem?.label ?? base[0].label,
      destination: {
        pathname: getRelativePath(homeKey) || DEFAULT_INTERNAL_PATH,
      },
    } as BottomNavItem;
  }

  if (iconSales) {
    base[1] = {
      ...base[1],
      icon: iconSales,
      iconSolid: iconSalesSolid ?? base[1].iconSolid,
      label: salesItem?.label ?? base[1].label,
      destination: {
        pathname: getRelativePath(salesKey) || DEFAULT_INTERNAL_PATH + "/vendas",
      },
    } as BottomNavItem;
  }

  base[3] = dynamicItem;

  if (iconMenu) base[4] = { ...base[4], icon: iconMenu } as BottomNavItem;

  return base;
}

function NavButton({
  item,
  active,
  onClick,
  onIntent,
}: {
  item: BottomNavItem;
  active: boolean;
  onClick: () => void;
  onIntent?: () => void;
}) {
  const Icon = active && item.iconSolid ? item.iconSolid : item.icon;
  const base = "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs";
  const color = active ? "text-beergam-orange" : "text-white/70";
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onIntent}
      onFocus={onIntent}
      aria-current={active ? "page" : undefined}
      className={[base, color].join(" ")}
      aria-label={item.label}
    >
      <span className="grid place-items-center text-[22px] leading-none">
        <Icon tailWindClasses="w-6 h-6" />
      </span>
      <span className="text-[11px] leading-none">{item.label}</span>
    </button>
  );
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const subscription = authStore.use.subscription();
  const isFreePlan = isFree(subscription);
  const baseItems = isFreePlan ? freeMobileNav.items : mobileNav.items;

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
    if (keyChain.length === 0) return;
    const topParent = keyChain[0];
    try {
      setLastVisitedParents((prev) => {
        const next = [topParent, ...prev.filter((k) => k !== topParent)].slice(0, 8);
        localStorage.setItem(LAST_VISITED_PARENTS_KEY, JSON.stringify(next));
        return next;
      });
    } catch {
      void 0;
    }
  }, [location.pathname]);

  const currentKeyChain = useMemo(() => {
    const { keyChain } = findKeyPathByRoute(MenuConfig, location.pathname);
    return keyChain;
  }, [location.pathname]);

  const excludedParents = useMemo(() => {
    const set = new Set<string>();
    for (const it of baseItems) {
      if (it.isCenter || it.key === "menu" || !it.destination) continue;
      const { keyChain } = findKeyPathByRoute(MenuConfig, it.destination.pathname);
      if (keyChain.length > 0) set.add(keyChain[0]);
    }
    return set;
  }, [baseItems]);

  const effectiveParentKey = useMemo(() => {
    const choice = lastVisitedParents.find((k) => !excludedParents.has(k));
    return choice ?? (excludedParents.has(dynamicDefaultParentKey) ? undefined : dynamicDefaultParentKey);
  }, [lastVisitedParents, excludedParents]);

  const dynamicItem: BottomNavItem = useMemo(() => {
    const parentKey = effectiveParentKey ?? lastVisitedParents[0] ?? dynamicDefaultParentKey;
    const parent = (MenuConfig as Record<string, IMenuItem>)[parentKey];
    const fallbackItem = baseItems[3];
    const icon = (parent?.icon
      ? getIcon(parent.icon)
      : fallbackItem?.icon) as BottomNavItem["icon"];
    const iconSolid = parent?.icon
      ? solidIconForMenuKey(parentKey)
      : (fallbackItem as BottomNavItem | undefined)?.iconSolid;
    const destinationPath = getRelativePath(parentKey) || DEFAULT_INTERNAL_PATH;
    return {
      key: "complaints",
      label: parent?.label ?? fallbackItem?.label ?? "Conteúdo",
      destination: { pathname: destinationPath },
      icon: icon!,
      iconSolid,
    };
  }, [baseItems, effectiveParentKey, lastVisitedParents]);

  const computedItems = useMemo(() => {
    if (isFreePlan) return buildFreeItems(baseItems);
    return buildPaidItems(baseItems, dynamicItem);
  }, [isFreePlan, baseItems, dynamicItem]);

  function isActive(item: BottomNavItem) {
    if (item.key === "complaints") {
      const parentKey = resolveComplaintsParentKey();
      return currentKeyChain[0] === parentKey;
    }
    if (!item.destination) return false;
    return location.pathname === item.destination.pathname;
  }

  const FREE_CONTENT_KEY = "conteudo" as const;

  function resolveComplaintsParentKey() {
    if (isFreePlan) return FREE_CONTENT_KEY;
    return effectiveParentKey ?? lastVisitedParents[0] ?? dynamicDefaultParentKey;
  }

  function handleNavClick(item: BottomNavItem) {
    if (item.key === "menu") {
      setMenuOpen(true);
      return;
    }
    if (item.key === "complaints") {
      const parentKey = resolveComplaintsParentKey();
      const parent = (MenuConfig as Record<string, IMenuItem>)[parentKey];
      if (parent?.dropdown) {
        setSubmenuOpen({ open: true, items: parent.dropdown, parentLabel: parent.label, parentKey });
        return;
      }
    }
    if (item.destination) navigate(item.destination.pathname);
  }

  const visibleItems = computedItems.filter((i) => !i.isCenter);
  const center = computedItems.find((i) => i.isCenter);
  const cols = isFreePlan ? 4 : 5;

  return (
    <MobilePortal>
      <nav className="fixed bottom-0 inset-x-0 z-1000 md:hidden">
        <div className="relative mx-auto max-w-screen-sm">
          <div className="rounded-t-2xl shadow-layout-primary bg-beergam-menu-background backdrop-blur border border-black/5 px-2">
            <div className={`grid grid-cols-${cols} items-end`}>
              {visibleItems.slice(0, 2).map((item) => (
                <NavButton
                  key={item.key}
                  item={item}
                  active={isActive(item)}
                  onIntent={() => {
                    if (item.destination?.pathname) setPrefetchPage(item.destination.pathname);
                  }}
                  onClick={() => handleNavClick(item)}
                />
              ))}
              {!isFreePlan && <div />}
              {visibleItems.slice(2).map((item) => (
                <NavButton
                  key={item.key}
                  item={item}
                  active={isActive(item)}
                  onIntent={() => {
                    if (item.destination?.pathname) setPrefetchPage(item.destination.pathname);
                  }}
                  onClick={() => handleNavClick(item)}
                />
              ))}
            </div>
          </div>
          {!isFreePlan && center && (
            <button
              type="button"
              aria-label={center.label}
              onClick={() => setAccountOpen(true)}
              className="absolute -top-6 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-beergam-white shadow-xl flex items-center justify-center"
            >
              <div className="h-15 w-15 rounded-full overflow-hidden border-2 border-beergam-blue-primary shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)]">
                <img
                  src={current?.marketplace_image}
                  alt={current?.marketplace_name}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          )}
        </div>
      </nav>
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      {accountOpen && !isFreePlan && (
        <MobileAccountOverlay onClose={() => setAccountOpen(false)} />
      )}
      {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
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
