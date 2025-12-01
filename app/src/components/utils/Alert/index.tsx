import { Paper } from "@mui/material";
import React from "react";
import Svg from "~/src/assets/svgs/_index";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";
import { Modal, type ModalProps } from "../Modal";
import AlertButton from "./AlertButton";
function Icon({
  type,
  SvgBaseProps,
  customIcon,
}: {
  type?: AlertProps["type"];
  SvgBaseProps: SvgBaseProps;
  customIcon?: keyof typeof Svg;
}) {
  function getSvg() {
    // Tamanhos responsivos: menor em mobile, maior em desktop
    const baseSize = "40px";
    const svgProps = {
      ...SvgBaseProps,
      width: SvgBaseProps.width || baseSize,
      height: SvgBaseProps.height || baseSize,
    };
    
    if (customIcon) {
      return React.createElement(Svg[customIcon], {
        ...svgProps,
        stroke: "white",
      });
    }
    switch (type) {
      case "success":
        return <Svg.check {...svgProps} stroke="white" />;
      case "error":
        return <Svg.circle_x {...svgProps} stroke="white" />;
      case "warning":
        return <Svg.megaphone {...svgProps} fill="white" />;
      case "info":
        return <Svg.information_circle {...svgProps} stroke="white" />;
    }
  }
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full ${type === "success" ? "bg-beergam-green-primary" : type === "error" ? "bg-beergam-red-primary" : type === "warning" ? "bg-beergam-yellow" : type === "info" ? "bg-beergam-blue" : "bg-beergam-blue-primary"}`}
    >
      {getSvg()}
    </div>
  );
}

interface AlertProps extends ModalProps {
  type?: "success" | "error" | "warning" | "info" | undefined;
  customIcon?: keyof typeof Svg;
  onConfirm?: () => void;
  cancelText?: string;
  cancelClassName?: string;
  confirmText?: string;
  confirmClassName?: string;
}
export default function Alert({
  type,
  customIcon,
  onConfirm,
  cancelText,
  cancelClassName,
  confirmText,
  confirmClassName,
  children,
  ...props
}: AlertProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title={props.title}>
      <Paper className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full shadow-none! border-none! px-2 sm:px-4 py-2 sm:py-4">
        <div className="shrink-0">
          <Icon
            type={type}
            SvgBaseProps={{ width: "45px", height: "45px" }}
            customIcon={customIcon}
          />
        </div>
        <div className="flex text-center sm:text-left flex-col items-center sm:items-start justify-center gap-2 w-full">
          {children}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto">
          {onConfirm && (
            <AlertButton
              onClick={onConfirm}
              type="confirm"
              text={confirmText ?? "Confirmar"}
              className={`${confirmClassName ?? ""} w-full sm:w-auto`}
            />
          )}
          <AlertButton
            onClick={() => {
              props.onClose();
            }}
            type="cancel"
            text={cancelText ?? "Voltar"}
            className={`${cancelClassName ?? ""} w-full sm:w-auto`}
          />
        </div>
      </Paper>
    </Modal>
  );
}
