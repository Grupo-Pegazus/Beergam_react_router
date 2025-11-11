import { ClickAwayListener, Fade, Grow, type FadeProps } from "@mui/material";
import { useEffect, useState } from "react";

export interface ModalProps extends FadeProps {
  title?: string;
  isOpen: boolean;
  className?: string;
  contentClassName?: string;
  onClose: () => void;
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
              className={`relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl ${contentClassName ?? ""}`.trim()}
            >
              {title && <h2 className="text-beergam-blue-primary">{title}</h2>}
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
