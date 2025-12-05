import { Paper } from "@mui/material";
import React from "react";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "../BeergamButton";
import Modal from "../Modal";
function Icon({
  type,
  customIcon,
}: {
  type?: AlertProps["type"];
  customIcon?: keyof typeof Svg;
}) {
  function getSvg() {
    // Tamanhos responsivos: menor em mobile, maior em desktop

    if (customIcon) {
      return React.createElement(Svg[customIcon], {
        stroke: "white",
      });
    }
    switch (type) {
      case "success":
        return (
          <Svg.check
            className="text-beergam-white stroke-beergam-white"
            width={26}
            height={26}
          />
        );
      case "error":
        return (
          <Svg.circle_x
            className="text-beergam-white stroke-beergam-white"
            width={26}
            height={26}
          />
        );
      case "warning":
        return (
          <Svg.warning_circle
            className="text-beergam-white! stroke-beergam-white"
            width={26}
            height={26}
          />
        );
      case "info":
        return (
          <Svg.information_circle
            className="text-beergam-white stroke-beergam-white"
            width={26}
            height={26}
          />
        );
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

interface AlertProps {
  type?: "success" | "error" | "warning" | "info" | undefined;
  customIcon?: keyof typeof Svg;
  onConfirm?: () => void;
  onClose?: () => void;
  children?: React.ReactNode | React.ReactNode[];
  cancelText?: string;
  cancelClassName?: string;
  confirmText?: string;
  confirmClassName?: string;
  isOpen?: boolean;
  title?: string;
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
  onClose,
  isOpen = true,
  title,
}: AlertProps) {
  const content = (
    <Paper className="flex flex-col items-center justify-center gap-4 w-full md:min-w-2xl">
      <div>
        <Icon
          type={type}
          customIcon={customIcon}
        />
      </div>
      <div className="flex text-center md:text-left flex-col items-center justify-center gap-2">
        {children}
      </div>

      <div className="flex items-center justify-center gap-4">
        {onConfirm && (
          <BeergamButton
            onClick={onConfirm}
            mainColor="beergam-orange"
            title={confirmText ?? "Confirmar"}
            className={confirmClassName}
          />
        )}
        <BeergamButton
          onClick={() => {
            onClose?.();
          }}
          mainColor="beergam-blue-primary"
          title={cancelText ?? "Voltar"}
          className={cancelClassName}
        />
      </div>
    </Paper>
  );

  // Se isOpen for false, não renderiza nada
  if (isOpen === false) {
    return null;
  }

  // Se isOpen for true ou undefined, renderiza com Modal se necessário
  // Se já estiver dentro de um Modal, renderiza apenas o conteúdo
  return (
    <Modal isOpen={isOpen} onClose={onClose || (() => {})} title={title}>
      {content}
    </Modal>
  );
}
