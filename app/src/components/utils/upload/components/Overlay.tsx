import type React from "react";
import { useEffect, useState } from "react";

import Svg from "~/src/assets/svgs/_index";

import Upload, { type UploadProps } from "../index";

import { ClickAwayListener, Fade, Grow } from "@mui/material";

interface UploadOverlayProps<ResponseSchema = unknown> {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  uploadProps: UploadProps<ResponseSchema>;
  className?: string;
  contentClassName?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeButtonLabel?: string;
}

export default function UploadOverlay<ResponseSchema = unknown>(
  props: UploadOverlayProps<ResponseSchema>
) {
  const {
    isOpen,
    onClose,
    title,
    description,
    uploadProps,
    className,
    contentClassName,
    bodyClassName,
    children,
    footer,
    closeButtonLabel = "Fechar",
  } = props;
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
      in={isOpen}
      timeout={transitionDuration}
      onExited={handleFadeExit}
      appear
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
            timeout={{ enter: transitionDuration + 50, exit: transitionDuration }}
          >
            <div
              className={`relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl ${contentClassName ?? ""}`.trim()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  {title && (
                    <h4 className="text-lg font-semibold text-beergam-blue-primary">
                      {title}
                    </h4>
                  )}
                  {description && (
                    <p className="text-sm text-beergam-gray-500">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="rounded-full bg-beergam-gray-100 p-2 text-beergam-gray-500 transition-colors hover:text-beergam-red"
                  aria-label={closeButtonLabel}
                  onClick={onClose}
                >
                  <Svg.circle_x tailWindClasses="w-6 h-6" />
                </button>
              </div>

              <div className={`mt-6 ${bodyClassName ?? ""}`.trim()}>
                <Upload {...uploadProps} />
              </div>

              {children && (
                <div className="mt-4 rounded-lg bg-beergam-blue-primary/5 p-3 text-sm text-beergam-blue-primary">
                  {children}
                </div>
              )}

              {footer && <div className="mt-6">{footer}</div>}
            </div>
          </Grow>
        </ClickAwayListener>
      </div>
    </Fade>
  );
}

