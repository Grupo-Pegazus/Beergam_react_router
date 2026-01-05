import { type ImgHTMLAttributes } from "react";
import { useCensorship } from "./CensorshipContext";

interface ImageCensoredProps extends ImgHTMLAttributes<HTMLImageElement> {
  censorshipKey: string;
  blurIntensity?: number; // Padrão: 10px
  className?: string;
  forceCensor?: boolean; // Força a censura independentemente do estado no localStorage
}

export function ImageCensored({
  censorshipKey,
  blurIntensity = 10,
  className,
  style,
  forceCensor = false,
  ...imgProps
}: ImageCensoredProps) {
  const { isCensored } = useCensorship();
  const censored = forceCensor || isCensored(censorshipKey);

  const blurStyle: React.CSSProperties = censored
    ? {
        filter: `blur(${blurIntensity}px)`,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }
    : style;

  return (
    <img
      {...imgProps}
      className={className}
      style={blurStyle}
    />
  );
}

