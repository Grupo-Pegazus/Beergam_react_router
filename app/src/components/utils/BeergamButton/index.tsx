import type { ButtonHTMLAttributes, CSSProperties } from "react";
import React, { useEffect } from "react";
import { Link } from "react-router";
import { getIcon } from "~/features/menu/utils";
import Svg from "~/src/assets/svgs/_index";
interface BeergamButtonFetcherProps {
  fecthing: boolean;
  completed: boolean;
  error: boolean;
  mutation: {
    reset: () => void;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
}
interface BeergamButtonWrapperProps {
  mainColor?: string;
  animationStyle?: "slider" | "fade" | "fetcher";
  fetcher?: BeergamButtonFetcherProps;
  link?: string | undefined;
}

interface BeergamButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BeergamButtonWrapperProps {
  icon?: keyof typeof Svg | null;
}

type CSSPropertiesWithVars = CSSProperties & {
  [key: `--${string}`]: string | number;
};

function BeergamButtonWrapper({
  mainColor,
  animationStyle,
  link,
  children,
  className,
  onClick,
  disabled,
  fetcher,
  icon,
  ...props
}: BeergamButtonProps) {
  const { style, ...buttonProps } = props;
  const isSlider = animationStyle === "slider" || animationStyle === "fetcher";
  const sliderClasses = disabled
    ? "cursor-not-allowed! opacity-50!"
    : isSlider
      ? `bg-[linear-gradient(90deg,var(--bg-slider-color)_0%,var(--bg-slider-color)_100%)] bg-[length:0%_100%] bg-no-repeat bg-left transition-[background-size,color] duration-300 ease-out ${fetcher?.fecthing ? "opacity-50!" : "hover:bg-[length:100%_100%]"}`
      : "hover:opacity-80";
  const fectherClasses = fetcher?.error
    ? "bg-[linear-gradient(90deg,var(--color-beergam-red)_0%,var(--color-beergam-red)_100%)]! bg-[length:100%_100%]! "
    : fetcher?.completed
      ? "bg-[linear-gradient(90deg,var(--color-beergam-green)_0%,var(--color-beergam-green)_100%)]! bg-[length:100%_100%]! "
      : fetcher?.fecthing
        ? "opacity-50!"
        : "";
  const wrapperClass = `${sliderClasses} ${fectherClasses} bg-beergam-white relative overflow-hidden text-${mainColor} font-semibold py-2! px-4! rounded-lg shadow-sm group ${className} flex items-center gap-2 justify-center`;
  const sliderStyle: CSSPropertiesWithVars | undefined = isSlider
    ? { "--bg-slider-color": `var(--color-${mainColor})` }
    : undefined;
  const combinedStyle =
    sliderStyle || style ? { ...sliderStyle, ...style } : undefined;

  return (
    <>
      {link ? (
        <Link
          viewTransition
          className={`${wrapperClass}`}
          to={link}
          style={combinedStyle}
        >
          {children}
        </Link>
      ) : (
        <button
          onClick={(e) => {
            if (fetcher?.fecthing || disabled) return;
            onClick?.(e);
          }}
          className={`${wrapperClass}`}
          style={combinedStyle}
          {...buttonProps}
        >
          {icon && (
            <span>
              {React.createElement(getIcon(icon as keyof typeof Svg), {
                width: "22px",
                height: "22px",
                tailWindClasses:
                  "group-hover:text-beergam-white! max-w-[unset]!",
              })}
            </span>
          )}
          {children}
        </button>
      )}
    </>
  );
}

export default function BeergamButton({
  title,
  mainColor = "beergam-blue-primary",
  animationStyle = "slider",
  className,
  link,
  onClick,
  disabled,
  fetcher,
  icon,
}: BeergamButtonProps) {
  useEffect(() => {
    if (fetcher?.completed || fetcher?.error) {
      const timeout = setTimeout(() => {
        fetcher.mutation.reset();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [fetcher?.completed, fetcher?.error, fetcher?.mutation]);
  return (
    <BeergamButtonWrapper
      link={link}
      mainColor={mainColor}
      animationStyle={animationStyle}
      className={className}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      fetcher={fetcher}
      icon={icon}
    >
      <>
        {title && (
          <span
            className={`relative ${fetcher?.completed || fetcher?.error ? "opacity-0" : "opacity-100"} z-10 ${disabled ? "" : animationStyle == "fade" ? "" : "group-hover:text-beergam-white"}`}
          >
            {title}
          </span>
        )}
        {fetcher?.error && (
          <span className="text-beergam-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Svg.x width={20} height={20} />
          </span>
        )}
        {fetcher?.completed && (
          <span className="text-beergam-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Svg.check width={20} height={20} />
          </span>
        )}
      </>
    </BeergamButtonWrapper>
  );
}
