import {
  ClickAwayListener,
  Paper,
  type ClickAwayListenerProps,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";
import AlertButton from "./AlertButton";
interface AlertProps extends Omit<ClickAwayListenerProps, "children"> {
  type?: "success" | "error" | "warning" | "info" | undefined;
  open: boolean;
  customIcon?: keyof typeof Svg;
  onConfirm?: () => void;
  cancelText?: string;
  cancelClassName?: string;
  confirmText?: string;
  confirmClassName?: string;
  children: React.ReactNode[];
}
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
export default function Alert({
  onClickAway,
  children,
  open,
  ...props
}: AlertProps) {
  const [fadeAnimation, setFadeAnimation] = useState(false);
  useEffect(() => {
    if (open) {
      console.log("open", open);
      window.setTimeout(() => {
        setFadeAnimation(true);
      }, 200);
    }
  }, [open]);
  if (!open) return null;
  function handleClickAway(e: MouseEvent | TouchEvent) {
    setFadeAnimation(false);
    window.setTimeout(() => {
      onClickAway?.(e);
    }, 500);
  }
  return (
    <div
      className={`fixed z-[99999] top-0 left-0 w-full h-full flex justify-center items-center bg-beergam-black/50 ${fadeAnimation ? "opacity-100" : "opacity-0"}`}
    >
      <ClickAwayListener
        onClickAway={(e) => {
          if (!open) return;
          handleClickAway(e);
        }}
      >
        <Paper className="flex flex-col items-center justify-center gap-4 min-w-2xl">
          <div>
            <Icon
              type={props.type}
              SvgBaseProps={{ width: "60px", height: "60px" }}
              customIcon={props.customIcon}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            {children}
          </div>

          <div className="flex items-center justify-center gap-4">
            {props.onConfirm && (
              <AlertButton
                onClick={props.onConfirm}
                type="confirm"
                text={props.confirmText ?? "Confirmar"}
                className={props.confirmClassName}
              />
            )}
            <AlertButton
              onClick={(e) => {
                handleClickAway(e);
              }}
              type="cancel"
              text={props.cancelText ?? "Voltar"}
              className={props.cancelClassName}
            />
          </div>
        </Paper>
      </ClickAwayListener>
    </div>
  );
}
