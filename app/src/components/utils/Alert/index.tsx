import React, { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";
import { Fields } from "../_fields";
import BeergamButton from "../BeergamButton";
import { useModal } from "../Modal/useModal";
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
        return <Svg.x {...svgProps} />;
      case "warning":
        return <Svg.warning_circle {...svgProps} />;
      case "info":
        return <Svg.information_circle {...svgProps} />;
    }
  }
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full ${type === "success" ? "bg-beergam-green-primary" : type === "error" ? "bg-beergam-red" : type === "warning" ? "bg-beergam-yellow" : type === "info" ? "bg-beergam-blue" : "bg-beergam-blue-primary"}`}
    >
      {getSvg()}
    </div>
  );
}
interface ConfirmInputProps {
  placeholder: string;
  valueToConfirm: string;
}

interface CloseTimerProps {
  time?: number;
  active?: boolean;
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
  confirmInput?: ConfirmInputProps | null;
  disabledConfirm?: boolean;
  closeTimer?: CloseTimerProps;
}
/**
 * Alert component
 * @param type - The type of alert: success, error, warning, info
 * @param customIcon - The custom icon to use. By default, the icon is the type of alert.
 * @param onConfirm - The function to call when the confirm button is clicked. If not provided, the confirm button is not displayed.
 * @param onClose - The function to call when the alert is closed.
 * @param children - The children to display in the alert
 * @param cancelText - The text to display on the cancel button
 * @param cancelClassName - The class name to apply to the cancel button
 * @param confirmText - The text to display on the confirm button
 * @param confirmClassName - The class name to apply to the confirm button
 * @param confirmInput - The input to display in the alert: placeholder and valueToConfirm. valueToConfirm is the value to enable the confirm button.
 * @param disabledConfirm - Whether to disable the confirm button
 * @param closeTimer - The timer to display in the alert: time in milliseconds and active to display the timer
 */

const DEFAULT_CLOSE_TIME_MS = 3500;
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
  confirmInput,
  disabledConfirm,
  closeTimer = { time: DEFAULT_CLOSE_TIME_MS, active: false },
}: AlertProps) {
  const { closeModal } = useModal();
  const [inputText, setInputText] = useState("");

  // Faz merge do closeTimer passado com os valores padrão
  const timerConfig = {
    time:
      type === "error"
        ? DEFAULT_CLOSE_TIME_MS
        : (closeTimer?.time ?? DEFAULT_CLOSE_TIME_MS),
    active: type === "error" ? true : (closeTimer?.active ?? false),
  };

  useEffect(() => {
    if (timerConfig.active) {
      const timer = setTimeout(() => {
        onClose?.();
        closeModal();
      }, timerConfig.time);

      return () => clearTimeout(timer);
    }
  }, [timerConfig.active, timerConfig.time, onClose, closeModal]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full md:min-w-2xl">
      {timerConfig.active && (
        <div className="w-full absolute left-0 right-0 bottom-0 h-1 bg-beergam-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-beergam-blue-primary rounded-full transition-all ease-linear"
            style={{
              width: "100%",
              animation: `timerProgress ${timerConfig.time}ms linear forwards`,
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes timerProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
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
        {/* {mutation && <p>Mutation:{JSON.stringify(mutation)}</p>} */}
        {children}
      </div>
      {confirmInput && (
        <Fields.wrapper className="w-full">
          <Fields.input
            placeholder={`Digite ${confirmInput.placeholder} para confirmar`}
            name={confirmInput.valueToConfirm}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </Fields.wrapper>
      )}
      <div className="flex items-center justify-center gap-4">
        {onConfirm && (
          <BeergamButton
            onClick={() => {
              console.log("cliquei no confirm");
              onConfirm();
              closeModal();
            }}
            mainColor="beergam-orange"
            title={confirmText ?? "Confirmar"}
            className={confirmClassName}
            disabled={
              confirmInput
                ? inputText !== confirmInput.valueToConfirm
                : (disabledConfirm ?? false)
            }
          />
        )}
        {type !== "error" && (
          <BeergamButton
            onClick={() => {
              onClose?.();
            }}
            mainColor="beergam-blue-primary"
            title={cancelText ?? "Voltar"}
            className={cancelClassName}
          />
        )}
      </div>
    </div>
  );
}
