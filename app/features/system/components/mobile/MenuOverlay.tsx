import { Paper } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PrefetchPageLinks, useLocation, useNavigate } from "react-router";
import {
  MenuConfig,
  type IMenuConfig,
  type IMenuItem,
  type MenuKeys,
} from "~/features/menu/typings";
import {
  DEFAULT_INTERNAL_PATH,
  findKeyPathByRoute,
  getIcon,
  getRelativePath,
} from "~/features/menu/utils";
import authStore from "~/features/store-zustand";
import { isMaster } from "~/features/user/utils";
import Svg from "~/src/assets/svgs/_index";
import { useOverlay } from "../../hooks/useOverlay";
import OverlayFrame from "../../shared/OverlayFrame";
import SubmenuOverlay from "./SubmenuOverlay";
import { isFree } from "~/features/plans/planUtils";

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const user = authStore.use.user();
  const subscription = authStore.use.subscription();
  const isFreePlan = isFree(subscription);
  const [submenuState, setSubmenuState] = useState<{
    items: IMenuConfig;
    parentLabel: string;
    parentKey?: string;
  } | null>(null);

  const allowedViews = useMemo(() => {
    return user?.details.allowed_views;
  }, [user?.details.allowed_views]);

  const isUserMaster = useMemo(() => {
    return user ? isMaster(user) : false;
  }, [user]);

  const hasAccess = useCallback(
    (key: string): boolean => {
      if (isUserMaster) return true;
      if (!allowedViews) return true;
      const directAccess = allowedViews[key as MenuKeys]?.access;
      if (directAccess !== undefined) return directAccess;
      // Chave ausente no backend: libera se freePlanLocked: false no MenuConfig
      const configItem = (MenuConfig as Record<string, { freePlanLocked?: boolean }>)[key];
      return configItem?.freePlanLocked === false;
    },
    [allowedViews, isUserMaster]
  );

  const handleClose = useCallback(() => {
    requestClose(onClose);
  }, [requestClose, onClose]);

  useEffect(() => {
    open();
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (submenuState) {
          setSubmenuState(null);
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    firstFocusable.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleClose, submenuState]);

  function handleGo(path?: string) {
    if (!path) return;
    handleClose();
    navigate(path);
  }

  function handleItemClick(item: IMenuItem, key: string) {
    if (item.dropdown) {
      setSubmenuState({ items: item.dropdown, parentLabel: item.label, parentKey: key });
      return;
    }
    if (item.href) {
      handleClose();
      window.open(item.href, item.target ?? "_blank", "noopener,noreferrer");
      return;
    }
    if (item.redirectTo) {
      handleGo(item.redirectTo);
      return;
    }
    if (item.path) {
      const fullPath = getRelativePath(key) || DEFAULT_INTERNAL_PATH + item.path;
      handleGo(fullPath);
    }
  }

  return (
    <>
      <OverlayFrame
        title="Menu"
        isOpen={isOpen}
        shouldRender={shouldRender}
        onRequestClose={handleClose}
      >
        <div className="p-2 grid grid-cols-3 gap-2">
          {Object.entries(MenuConfig)
            .filter(([key]) => hasAccess(key))
            .map(([key, item]) => {
              const menuItem = item as IMenuItem;
              const isLockedForFree = isFreePlan && menuItem.freePlanLocked === true;
              const Icon = menuItem.icon ? getIcon(menuItem.icon) : undefined;
              const maybeSolid = menuItem.icon
                ? (getIcon((menuItem.icon + "_solid") as keyof typeof Svg) as
                    | typeof Icon
                    | undefined)
                : undefined;
              const { keyChain } = findKeyPathByRoute(
                MenuConfig,
                location.pathname
              );
              const isActive = keyChain[0] === key;
              const ActiveIcon = isActive && maybeSolid && !isLockedForFree ? maybeSolid : Icon;
              const hasDropdown = !!menuItem.dropdown;
              return (
                <Paper
                  key={key}
                  onClick={() => !isLockedForFree ? handleItemClick(menuItem, key) : undefined}
                  className={[
                    "relative aspect-square rounded-xl border border-black/10 bg-beergam-menu-background! shadow-sm p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200",
                    "hover:bg-beergam-blue-light hover:border-beergam-blue/20 active:scale-95 cursor-pointer",
                    isActive && !isLockedForFree ? "border-beergam-orange!" : "",
                    isLockedForFree ? "opacity-50 cursor-not-allowed!" : "",
                  ].join(" ")}
                  elevation={1}
                >
                  {isLockedForFree && (
                    <span className="absolute top-1.5 right-1.5 grid place-items-center w-5 h-5">
                      <Svg.lock_closed tailWindClasses="w-6 h-6 text-beergam-orange" />
                    </span>
                  )}
                  <span className="leading-none grid place-items-center text-beergam-menu-mobile-button">
                    {ActiveIcon ? (
                      <ActiveIcon
                        tailWindClasses={`w-8 h-8 ${isActive ? "text-beergam-orange" : "text-beergam-menu-mobile-button"}`}
                      />
                    ) : null}
                  </span>
                  <span
                    className={`text-xs ${isActive && !isLockedForFree ? "font-bold" : "font-medium"} ${isActive && !isLockedForFree ? "text-beergam-orange" : "text-beergam-menu-mobile-button"} text-center leading-tight`}
                  >
                    {menuItem.label}
                  </span>
                  {hasDropdown && (
                    <span className="absolute top-1.5 left-1.5 grid place-items-center w-5 h-5">
                      <Svg.list tailWindClasses="w-6 h-6 text-beergam-menu-mobile-button" />
                    </span>
                  )}
                  {menuItem.status && !isLockedForFree && (
                    <span className="absolute top-1.5 right-1.5 grid place-items-center w-5 h-5">
                    {menuItem.status === "green" ? (
                      <Svg.check_circle tailWindClasses="w-6 h-6 text-beergam-green" />
                    ) : menuItem.status === "yellow" ? (
                      <Svg.warning_circle tailWindClasses="w-6 h-6 text-beergam-yellow" />
                      ) : menuItem.status === "red" ? (
                        <Svg.x_circle tailWindClasses="w-6 h-6 text-beergam-red" />
                      ) : null}
                    </span>
                  )}
                </Paper>
              );
            })}
        </div>
        <div aria-hidden>
          {Object.entries(MenuConfig).map(([key, item]) => {
            const menuItem = item as IMenuItem;
            const path = menuItem.path
              ? getRelativePath(key) || DEFAULT_INTERNAL_PATH + menuItem.path
              : undefined;
            return path ? (
              <PrefetchPageLinks key={`prefetch:${key}`} page={path} />
            ) : null;
          })}
        </div>
      </OverlayFrame>
      {submenuState && (
        <SubmenuOverlay
          items={submenuState.items}
          parentLabel={submenuState.parentLabel}
          parentKey={submenuState.parentKey}
          onClose={() => {
            setSubmenuState(null);
            handleClose();
          }}
          onDismiss={() => setSubmenuState(null)}
          onBack={
            submenuState.parentKey ? () => setSubmenuState(null) : undefined
          }
        />
      )}
    </>
  );
}
