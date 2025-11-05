import { useEffect, useRef, useCallback, useState } from "react";
import { MenuConfig, type IMenuItem, type IMenuConfig } from "~/features/menu/typings";
import Svg from "~/src/assets/svgs";
import { PrefetchPageLinks, useNavigate } from "react-router";
import { useOverlay } from "../../hooks/useOverlay";
import OverlayFrame from "../../shared/OverlayFrame";
import { getRelativePath, DEFAULT_INTERNAL_PATH } from "~/features/menu/utils";
import SubmenuOverlay from "./SubmenuOverlay";
import { Paper } from "@mui/material";

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const [submenuState, setSubmenuState] = useState<{
    items: IMenuConfig;
    parentLabel: string;
    parentKey?: string;
  } | null>(null);

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
          {Object.entries(MenuConfig).map(([key, item]) => {
            const menuItem = item as IMenuItem;
            const Icon = menuItem.icon ? (Svg as Record<string, React.ComponentType<unknown>>)[menuItem.icon] : undefined;
            const hasDropdown = !!menuItem.dropdown;
            return (
              <Paper
                key={key}
                onClick={() => handleItemClick(menuItem, key)}
                className="relative aspect-square rounded-xl border border-black/10 bg-white shadow-sm p-3 flex flex-col items-center justify-center gap-2 hover:bg-beergam-blue-light hover:border-beergam-blue/20 active:scale-95 cursor-pointer transition-all duration-200"
                elevation={1}
              >
                <span className="text-[22px] leading-none grid place-items-center text-beergam-blue-primary">
                  {Icon ? <Icon /> : null}
                </span>
                <span className="text-xs font-medium text-beergam-blue-primary text-center leading-tight">{menuItem.label}</span>
                {hasDropdown && (
                  <span className="absolute top-1.5 left-1.5 grid place-items-center w-5 h-5">
                    <Svg.list width={20} height={20} tailWindClasses="text-beergam-blue-primary" />
                  </span>
                )}
                <span className="absolute top-1.5 right-1.5 grid place-items-center w-5 h-5">
                  {menuItem.status === "green" ? <div className="bg-beergam-green w-2 h-2 rounded-full"></div> : menuItem.status === "yellow" ? <div className="bg-beergam-yellow w-2 h-2 rounded-full"></div> : menuItem.status === "red" ? <div className="bg-beergam-red w-2 h-2 rounded-full"></div> : null}
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


