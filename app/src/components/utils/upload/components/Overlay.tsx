import type React from "react";

import Svg from "~/src/assets/svgs/_index";

import Upload, { type UploadProps } from "../index";

import type { ModalProps } from "../../Modal";
import { Modal } from "../../Modal";
interface UploadOverlayProps<ResponseSchema = unknown>
  extends Omit<ModalProps, "children"> {
  uploadProps: UploadProps<ResponseSchema>;
  description?: string;
  closeButtonLabel?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
}

export default function UploadOverlay<ResponseSchema = unknown>(
  props: UploadOverlayProps<ResponseSchema>
) {
  const {
    isOpen,
    onClose,
    title,
    uploadProps,
    contentClassName,
    description,
    closeButtonLabel = "Fechar",
    bodyClassName,
    footer,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      contentClassName={contentClassName}
    >
      <div className="rounded-lg bg-beergam-blue-primary/5 p-3 text-sm text-beergam-blue-primary">
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

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </Modal>
  );
}
