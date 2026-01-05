import { type ImgHTMLAttributes, type ReactNode } from "react";
import { useCensorship } from "./CensorshipContext";

interface ImageCensoredProps extends ImgHTMLAttributes<HTMLImageElement> {
  censorshipKey: string;
  blurIntensity?: number; // Padrão: 10px
  className?: string;
  forceCensor?: boolean; // Força a censura independentemente do estado no localStorage
  children?: ReactNode;
}

export function ImageCensored({
  censorshipKey,
  blurIntensity = 10,
  className,
  style,
  forceCensor = false,
  children,
  ...imgProps
}: ImageCensoredProps) {
  const { isCensored } = useCensorship();
  const censored = forceCensor || isCensored(censorshipKey);

  const blurStyle: React.CSSProperties = censored
    ? {
        filter: `blur(${blurIntensity}px)`,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }
    : style;

  if (censored) {
    return <div {...imgProps} className={className} style={blurStyle} />;
  }
  return <>{children}</>;
}
