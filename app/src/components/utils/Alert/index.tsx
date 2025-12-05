import React from "react";
import Svg from "~/src/assets/svgs/_index";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";
import BeergamButton from "../BeergamButton";
function Icon({
  type,
  customIcon,
  SvgBaseProps,
}: {
  type?: AlertProps["type"];
  customIcon?: keyof typeof Svg;
  SvgBaseProps: SvgBaseProps;
}) {
  function getSvg() {
    // Tamanhos responsivos: menor em mobile, maior em desktop
    const baseSize = "40px";
    const svgProps = {
      ...SvgBaseProps,
      width: SvgBaseProps.width || baseSize,
      height: SvgBaseProps.height || baseSize,
      tailWindClasses: `${SvgBaseProps.tailWindClasses ?? ""} text-beergam-white!`,
    };

    if (customIcon) {
      return React.createElement(Svg[customIcon], {
        stroke: "white",
        ...svgProps,
      });
    }
    switch (type) {
      case "success":
        return <Svg.check_circle {...svgProps} />;
      case "error":
        return <Svg.circle_x {...svgProps} />;
      case "warning":
        return <Svg.warning_circle {...svgProps} />;
      case "info":
        return <Svg.information_circle {...svgProps} />;
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
  mutation?: {
    reset: () => void;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  } | null;
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
  mutation,
}: AlertProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full md:min-w-2xl">
      <div>
        <Icon
          type={type}
          SvgBaseProps={{
            width: "60px",
            height: "60px",
            tailWindClasses: "text-beergam-white!",
          }}
          customIcon={customIcon}
        />
      </div>
      <div className="flex text-center md:text-left flex-col items-center justify-center gap-2">
        {children}
      </div>

      <div className="flex items-center justify-center gap-4">
        {onConfirm && (
          <BeergamButton
            onClick={() => {
              console.log("cliquei no confirm");
              onConfirm();
            }}
            mainColor="beergam-orange"
            title={confirmText ?? "Confirmar"}
            className={confirmClassName}
            fetcher={
              mutation
                ? {
                    fecthing: mutation.isPending,
                    completed: mutation.isSuccess,
                    error: mutation.isError,
                    mutation: mutation,
                  }
                : undefined
            }
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
    </div>
  );
}
