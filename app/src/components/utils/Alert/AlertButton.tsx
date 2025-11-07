import React from "react";
import Svg from "~/src/assets/svgs";
interface AlertButtonProps {
  onClick: (e: MouseEvent | TouchEvent) => void;
  type?: "confirm" | "cancel" | undefined;
  className?: string;
  icon?: keyof typeof Svg;
  text?: string;
}
export default function AlertButton({
  onClick,
  type,
  className,
  icon,
  text,
}: AlertButtonProps) {
  return (
    <button
      onClick={(e) => onClick(e.nativeEvent)}
      className={`${className} ${type === "confirm" ? "bg-beergam-orange" : type === "cancel" ? "bg-beergam-blue" : ""} px-4 py-2 text-beergam-white rounded-md text-xl font-bold hover:opacity-80`}
    >
      {text && text}
      {icon && React.createElement(Svg[icon], { width: 20, height: 20 })}
    </button>
  );
}
