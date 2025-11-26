import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { MenuConfig, type IMenuItem, type IMenuConfig, type MenuKeys } from "~/features/menu/typings";
import Svg from "~/src/assets/svgs/_index";
import { PrefetchPageLinks, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { type RootState } from "~/store";
import { useOverlay } from "../../hooks/useOverlay";
import OverlayFrame from "../../shared/OverlayFrame";
import { getRelativePath, DEFAULT_INTERNAL_PATH, findKeyPathByRoute, getIcon } from "~/features/menu/utils";
import SubmenuOverlay from "./SubmenuOverlay";
import { Paper } from "@mui/material";

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const user = useSelector((state: RootState) => state.user);
  const [submenuState, setSubmenuState] = useState<{
    items: IMenuConfig;
    parentLabel: string;
    parentKey?: string;
  } | null>(null);

  const allowedViews = useMemo(() => {
    return user?.user?.details.allowed_views;
  }, [user?.user?.details.allowed_views]);

  const hasAccess = useCallback((key: string): boolean => {
    return allowedViews?.[key as MenuKeys]?.access ?? false;
  }, [allowedViews]);

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
    } else if (item.path) {
      const fullPath = getRelativePath(key) || DEFAULT_INTERNAL_PATH + item.path;
      handleGo(fullPath);
    }
  }

  return (
    <>
      <OverlayFrame title="Menu" isOpen={isOpen} shouldRender={shouldRender} onRequestClose={handleClose}>
        <div className="p-2 grid grid-cols-3 gap-2">
          {Object.entries(MenuConfig)
            .filter(([key]) => hasAccess(key))
            .map(([key, item]) => {
              const menuItem = item as IMenuItem;
              const Icon = menuItem.icon ? getIcon(menuItem.icon) : undefined;
              const maybeSolid = menuItem.icon ? (getIcon((menuItem.icon + "_solid") as keyof typeof Svg) as typeof Icon | undefined) : undefined;
              const { keyChain } = findKeyPathByRoute(MenuConfig, location.pathname);
              const isActive = keyChain[0] === key;
              const ActiveIcon = isActive && maybeSolid ? maybeSolid : Icon;
              const hasDropdown = !!menuItem.dropdown;
              return (
                <Paper
                  key={key}
                  onClick={() => handleItemClick(menuItem, key)}
                  className={
                    [
                      "relative aspect-square rounded-xl border border-black/10 bg-white shadow-sm p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200",
                      "hover:bg-beergam-blue-light hover:border-beergam-blue/20 active:scale-95 cursor-pointer",
                      isActive ? "border-beergam-orange!" : "",
                    ].join(" ")
                  }
                  elevation={1}
                >
                  <span className="leading-none grid place-items-center text-beergam-blue-primary">
                    {ActiveIcon ? <ActiveIcon tailWindClasses={`w-8 h-8 ${isActive ? "text-beergam-orange" : "text-beergam-blue-primary"}`} /> : null}
                  </span>
                  <span className={`text-xs ${isActive ? "font-bold" : "font-medium"} ${isActive ? "text-beergam-orange" : "text-beergam-blue-primary"} text-center leading-tight`}>{menuItem.label}</span>
                  {hasDropdown && (
                    <span className="absolute top-1.5 left-1.5 grid place-items-center w-5 h-5">
                      <Svg.list tailWindClasses="w-6 h-6 text-beergam-blue-primary" />
                    </span>
                  )}
                  <span className="absolute top-1.5 right-1.5 grid place-items-center w-5 h-5">
                    {menuItem.status === "green" ? <Svg.check_circle tailWindClasses="w-6 h-6 text-beergam-green" /> : menuItem.status === "yellow" ? <Svg.warning_circle tailWindClasses="w-6 h-6 text-beergam-yellow" /> : menuItem.status === "red" ? <Svg.x_circle tailWindClasses="w-6 h-6 text-beergam-red" /> : null}
                  </span>
                </Paper>
              );
            })}
        </div>
        <div aria-hidden>
          {Object.entries(MenuConfig).map(([key, item]) => {
            const menuItem = item as IMenuItem;
            const path = menuItem.path ? (getRelativePath(key) || DEFAULT_INTERNAL_PATH + menuItem.path) : undefined;
            return path ? <PrefetchPageLinks key={`prefetch:${key}`} page={path} /> : null;
          })}
        </div>
      </OverlayFrame>
      {submenuState && (
        <SubmenuOverlay
          items={submenuState.items}
          parentLabel={submenuState.parentLabel}
          parentKey={submenuState.parentKey}
          onClose={() => setSubmenuState(null)}
          onBack={submenuState.parentKey ? () => setSubmenuState(null) : undefined}
        />
      )}
    </>
  );
}


