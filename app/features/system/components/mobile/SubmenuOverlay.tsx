import { Paper } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PrefetchPageLinks, useNavigate } from "react-router";
import type { IMenuConfig, IMenuItem } from "~/features/menu/typings";
import { DEFAULT_INTERNAL_PATH, getRelativePath } from "~/features/menu/utils";
import Svg from "~/src/assets/svgs/_index";
import { useOverlay } from "../../hooks/useOverlay";
import MobilePortal from "./Portal";

type SubmenuState = {
  items: IMenuConfig;
  parentLabel: string;
  parentKey?: string;
};

export default function SubmenuOverlay({
  items,
  parentLabel,
  parentKey,
  onClose,
  onBack,
}: {
  items: IMenuConfig;
  parentLabel: string;
  parentKey?: string;
  onClose: () => void;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  const firstRef = useRef<HTMLButtonElement | null>(null);
  const [submenuStack, setSubmenuStack] = useState<SubmenuState[]>([{ items, parentLabel, parentKey }]);
  const { isOpen, shouldRender, open, requestClose } = useOverlay();

  useEffect(() => {
    open();
    firstRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setSubmenuStack([{ items, parentLabel, parentKey }]);
  }, [items, parentLabel, parentKey]);

  const handleClose = useCallback(() => {
    requestClose(onClose);
  }, [requestClose, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (submenuStack.length > 1) {
          setSubmenuStack((prev) => prev.slice(0, -1));
        } else if (onBack) {
          onBack();
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [submenuStack.length, onBack, handleClose]);

  function handleGo(path: string) {
    handleClose();
    navigate(path);
  }

  function handleItemClick(item: IMenuItem, key: string) {
    if (item.dropdown) {
      setSubmenuStack((prev) => [...prev, { items: item.dropdown!, parentLabel: item.label, parentKey: key }]);
    } else if (item.path) {
      const isExternal =
        item.path.startsWith("http://") || item.path.startsWith("https://");
      if (isExternal) {
        handleClose();
        window.open(item.path, item.target || "_blank", "noopener,noreferrer");
        return;
      }
      const fullPath = getRelativePath(key) || DEFAULT_INTERNAL_PATH + item.path;
      handleGo(fullPath);
    }
  }

  function handleBackClick() {
    if (submenuStack.length > 1) {
      setSubmenuStack((prev) => prev.slice(0, -1));
    } else if (onBack) {
      onBack();
    } else {
      handleClose();
    }
  }

  const currentSubmenu = submenuStack[submenuStack.length - 1];
  const canGoBack = submenuStack.length > 1 || !!onBack;

  if (!shouldRender) return null;

  return (
    <MobilePortal>
      <div className="fixed inset-0 z-1100 md:hidden">
        <div
          className={[
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={handleClose}
        />
        <section
          className={[
            "absolute inset-x-0 bottom-0 bg-beergam-mui-paper flex flex-col transition-transform duration-300 ease-out will-change-transform rounded-t-2xl",
            isOpen ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
          style={{ height: "50vh", maxHeight: "50vh" }}
        >
          <header className="p-4 border-b border-black/10 flex items-center justify-between shrink-0 bg-beergam-menu-background text-white">
            <div className="flex items-center gap-2">
              {canGoBack && (
                <button
                  ref={firstRef}
                  type="button"
                  onClick={handleBackClick}
                  aria-label="Voltar"
                >
                  <Svg.chevron width={24} height={24} tailWindClasses="text-white rotate-180" />
                </button>
              )}
              <h2 className="text-base font-semibold">{currentSubmenu.parentLabel}</h2>
            </div>
            <button
              type="button"
              aria-label="Fechar"
              onClick={handleClose}
            >
              <Svg.x width={24} height={24} tailWindClasses="text-white" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 flex flex-col gap-2">
              {Object.entries(currentSubmenu.items).map(([key, item]) => {
                const Icon = item.icon ? (Svg as Record<string, React.ComponentType<unknown>>)[item.icon] : undefined;
                const hasDropdown = !!item.dropdown;
                return (
                  <Paper
                    key={key}
                    onClick={() => handleItemClick(item, key)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border text-beergam-typography-primary border-beergam-section-border bg-beergam-section-background! shadow-sm transition-colors text-left"
                    elevation={1}
                  >
                    {Icon && (
                      <span className="text-[20px] leading-none shrink-0">
                        <Icon />
                      </span>
                    )}
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {hasDropdown && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-beergam-typography-secondary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </Paper>
                );
              })}
              <div aria-hidden>
                {Object.entries(currentSubmenu.items).map(([key, item]) => {
                  if (!item.path) return null;
                  const isExternal =
                    item.path.startsWith("http://") ||
                    item.path.startsWith("https://");
                  if (isExternal) return null;
                  const path =
                    getRelativePath(key) || DEFAULT_INTERNAL_PATH + item.path;
                  return (
                    <PrefetchPageLinks key={`prefetch-sub:${key}`} page={path} />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </MobilePortal>
  );
}

