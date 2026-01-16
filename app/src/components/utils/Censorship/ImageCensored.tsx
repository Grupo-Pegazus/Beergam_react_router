import { type ImgHTMLAttributes, type ReactNode } from "react";
import Svg from "~/src/assets/svgs/_index";
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

  if (censored) {
    return (
      <div
        {...imgProps}
        className={`relative ${className || ""}`}
        style={style}
      >
        {children}
        <div className="absolute inset-0 flex items-center justify-center bg-beergam-typography-secondary! rounded-lg">
          <Svg.eye_slash
            width={24}
            height={24}
            tailWindClasses="text-beergam-white!"
          />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
