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
    if (customIcon) {
      return React.createElement(Svg[customIcon], {
        ...SvgBaseProps,
        stroke: "white",
      });
    }
    switch (type) {
      case "success":
        return <Svg.check {...SvgBaseProps} stroke="white" />;
      case "error":
        return <Svg.circle_x {...SvgBaseProps} stroke="white" />;
      case "warning":
        return <Svg.megaphone {...SvgBaseProps} stroke="white" />;
      case "info":
        return <Svg.information_circle {...SvgBaseProps} stroke="white" />;
    }
  }
  return (
    <div
      className={`size-20 flex items-center justify-center rounded-full ${type === "success" ? "bg-beergam-green-primary" : type === "error" ? "bg-beergam-red-primary" : type === "warning" ? "bg-beergam-yellow" : type === "info" ? "bg-beergam-blue" : "bg-beergam-blue-primary"}`}
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
      <Paper className="flex flex-col items-center justify-center gap-4 w-full md:min-w-2xl">
        <div>
          <Icon
            type={type}
            SvgBaseProps={{ width: "60px", height: "60px" }}
            customIcon={customIcon}
          />
        </div>
        <div className="flex text-center md:text-left flex-col items-center justify-center gap-2">
          {children}
        </div>

        <div className="flex items-center justify-center gap-4">
          {onConfirm && (
            <AlertButton
              onClick={onConfirm}
              type="confirm"
              text={confirmText ?? "Confirmar"}
              className={confirmClassName}
            />
          )}
          <AlertButton
            onClick={() => {
              props.onClose();
            }}
            type="cancel"
            text={cancelText ?? "Voltar"}
            className={cancelClassName}
          />
        </div>
      </Paper>
    </Modal>
  );
}
