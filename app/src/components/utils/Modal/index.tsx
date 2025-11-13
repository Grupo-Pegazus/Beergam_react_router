import { ClickAwayListener, Fade, Grow, type FadeProps } from "@mui/material";
import { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs/_index";

export interface ModalProps extends Omit<FadeProps, "children"> {
  title?: string;
  isOpen: boolean;
  className?: string;
  contentClassName?: string;
  onClose: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

export function Modal({
  title,
  isOpen,
  onClose,
  className,
  contentClassName,
  children,
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
        className={`fixed inset-0 z-999 flex items-center justify-center bg-beergam-black-blue/70 px-4 ${className ?? ""}`.trim()}
        role="dialog"
        aria-modal="true"
      >
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={onClose}
        >
          <Grow
            in={isOpen}
            timeout={{
              enter: transitionDuration + 50,
              exit: transitionDuration,
            }}
          >
            <div
              className={`relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto h-[80%] md:h-auto max-h-[80vh] ${contentClassName ?? ""}`.trim()}
            >
              <div className="flex items-start justify-between mb-4">
                {title && (
                  <h2 className="text-beergam-blue-primary">{title}</h2>
                )}
                <button
                  className="rounded-full bg-beergam-gray-100 p-2 text-beergam-gray-500 transition-colors hover:text-beergam-red"
                  onClick={onClose}
                >
                  <Svg.circle_x tailWindClasses="w-6 h-6" />
                </button>
              </div>
              {children && (
                <div className="mt-4 rounded-lg bg-beergam-blue-primary/5 p-3 text-sm text-beergam-blue-primary">
                  {children}
                </div>
              )}
            </div>
          </Grow>
        </ClickAwayListener>
      </div>
    </Fade>
  );
}

export default Modal;
