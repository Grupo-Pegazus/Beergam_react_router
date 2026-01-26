import { ClickAwayListener, Fade, Grow, Paper, type FadeProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "../BeergamButton";
export interface ModalProps extends Omit<FadeProps, "children"> {
  title?: string;
  icon?: keyof typeof Svg;
  subtitle?: string;
  isOpen: boolean;
  className?: string;
  contentClassName?: string;
  onClose: () => void;
  children?: React.ReactNode | React.ReactNode[];
  disableClickAway?: boolean;
}

export function Modal({
  title,
  icon,
  isOpen,
  onClose,
  className,
  contentClassName,
  children,
  disableClickAway = false,
  ...props
}: ModalProps) {
  const transitionDuration = 200;
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleFadeExit = () => {
    setShouldRender(false);
  };

  if (!shouldRender) {
    return null;
  }
  return (
    <Fade
      onExited={handleFadeExit}
      timeout={transitionDuration}
      appear
      in={isOpen}
      {...props}
    >
      <div
        className={`fixed inset-0 ${className?.includes("z-[") || className?.includes("z-1000") ? "" : "z-999"} flex items-center justify-center bg-beergam-black-blue/70 px-4 ${className ?? ""}`.trim()}
        role="dialog"
        aria-modal="true"
        style={className?.includes("z-[1000]") ? { zIndex: 1000 } : undefined}
        onClick={(e) => {
          if (disableClickAway) return;
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
       <>
        {disableClickAway ? (
          <Grow
            in={isOpen}
            timeout={{
              enter: transitionDuration + 50,
              exit: transitionDuration,
            }}
          >
            <div
              className={`relative w-full max-w-3xl rounded-2xl bg-beergam-mui-paper! pt-0! p-3 md:p-6 shadow-2xl overflow-y-auto h-auto md:h-auto max-h-[80vh] ${contentClassName ?? ""}`.trim()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex sticky top-0 z-10 items-start justify-between bg-beergam-mui-paper! py-4">
{title && (
                  <div className="flex items-center gap-2">
                    {icon && <><Paper className="p-2! bg-beergam-primary/20!">{React.createElement(Svg[icon], { width: "24px", height: "24px", color: "var(--color-beergam-primary)", tailWindClasses: "text-beergam-primary!" })}</Paper></>}
                    <h2 className="text-beergam-typography-primary">{title}</h2>
                  </div>
                )}
                {/* <button
                  className="rounded-full bg-beergam-gray-100 p-2 text-beergam-gray-500 transition-colors hover:text-beergam-red"
                  onClick={onClose}
                >
                  <Svg.circle_x tailWindClasses="w-6 h-6" />
                </button> */}
                <BeergamButton onClick={onClose} icon="x" />
              </div>
              {children && (
                <div className="rounded-lg p-3 text-sm text-beergam-blue-primary">
                  {children}
                </div>
              )}
            </div>
          </Grow>
        ) : (
          <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={(e) => {
              // Não fechar se houver um modal com z-index maior aberto
              const target = e.target as HTMLElement;
              if (
                target?.closest(
                  '[style*="z-index: 1000"], [class*="z-1000"], [class*="z-[1000]"]'
                )
              ) {
                return;
              }
              onClose();
            }}
          >
            <Grow
              in={isOpen}
              timeout={{
                enter: transitionDuration + 50,
                exit: transitionDuration,
              }}
            >
              <div
                className={`relative w-full max-w-3xl rounded-2xl bg-beergam-mui-paper! pt-0! p-3 md:p-6 shadow-2xl overflow-y-auto h-auto md:h-auto max-h-[80vh] ${contentClassName ?? ""}`.trim()}
              >
                <div className="flex sticky top-0 z-10 items-start justify-between bg-beergam-mui-paper! py-4">
                  {title && (
                  <div className="flex items-center gap-2">
                    {icon && <><Paper className="p-2! bg-beergam-primary/20!">{React.createElement(Svg[icon], { width: "24px", height: "24px", color: "var(--color-beergam-primary)", tailWindClasses: "text-beergam-primary!" })}</Paper></>}
                    <h2 className="text-beergam-typography-primary">{title}</h2>
                  </div>
                )}
                  <BeergamButton onClick={onClose} icon="x" />
                </div>
                {children && (
                  <div className="rounded-lg p-3 text-sm text-beergam-typography-primary">
                    {children}
                  </div>
                )}
              </div>
            </Grow>
          </ClickAwayListener>
        )}</>
      </div>
    </Fade>
  );
}

export default Modal;
