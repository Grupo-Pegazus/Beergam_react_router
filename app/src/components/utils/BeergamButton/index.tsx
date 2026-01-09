import type { ButtonHTMLAttributes, CSSProperties } from "react";
import React, { useEffect } from "react";
import { Link } from "react-router";
import { Tooltip } from "react-tooltip";
import { getIcon } from "~/features/menu/utils";
import Spining from "~/src/assets/loading";
import Svg from "~/src/assets/svgs/_index";
import { useThemeContext } from "../ThemeProvider/ThemeProvider";
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

interface BeergamButtonTooltipProps {
  content: string;
  id: string;
}

interface BeergamButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BeergamButtonWrapperProps {
  icon?: keyof typeof Svg | null;
  loading?: boolean;
  tooltip?: BeergamButtonTooltipProps;
  isDark?: boolean;
}

type CSSPropertiesWithVars = CSSProperties & {
  [key: `--${string}`]: string | number;
};

function BeergamButtonWrapper({
  mainColor = "beergam-primary",
  animationStyle,
  link,
  children,
  className,
  onClick,
  disabled,
  fetcher,
  icon,
  type,
  loading,
  tooltip,
  ...props
}: BeergamButtonProps) {
  const { isDark } = useThemeContext();
  const { style, ...buttonProps } = props;
  const isSlider = animationStyle === "slider" || animationStyle === "fetcher";

  // Variáveis CSS para cores dinâmicas - solução universal que sempre funciona
  const mainColorVar = `var(--color-${mainColor})`;
  const hoverTextColor = isDark ? mainColorVar : "var(--color-beergam-white)";

  // Usar variáveis CSS diretamente no estilo em vez de classes Tailwind dinâmicas
  const dynamicBgColor = isDark ? mainColorVar : "var(--color-beergam-white)";
  const dynamicTextColor = isDark ? "var(--color-beergam-white)" : mainColorVar;

  const sliderClasses = disabled
    ? "cursor-not-allowed! opacity-50!"
    : isSlider
      ? `bg-[linear-gradient(90deg,var(--bg-slider-color)_0%,var(--bg-slider-color)_100%)] bg-[length:0%_100%] bg-no-repeat bg-left transition-[background-size,color] duration-300 ease-out ${fetcher?.fecthing ? "opacity-50!" : "hover:bg-[length:100%_100%]"}`
      : "hover:opacity-80";
  const fectherClasses = fetcher?.error
    ? "bg-[linear-gradient(90deg,var(--color-beergam-red)_0%,var(--color-beergam-red)_100%)]! bg-[length:100%_100%]! "
    : fetcher?.completed
      ? "bg-[linear-gradient(90deg,var(--color-beergam-green)_0%,var(--color-beergam-green)_100%)]! bg-[length:100%_100%]! "
      : fetcher?.fecthing || loading
        ? "bg-[linear-gradient(90deg,var(--color-beergam-gray-light)_0%,var(--color-beergam-gray-light)_100%)]! bg-[length:100%_100%]!"
        : "";
  const wrapperClass = `${sliderClasses} ${fectherClasses} relative overflow-hidden font-semibold py-2! px-4! rounded-lg shadow-sm group ${className} flex items-center gap-2 justify-center`;

  const combinedStyle: CSSPropertiesWithVars = {
    ...(isSlider
      ? {
          "--bg-slider-color": `${isDark ? "var(--color-beergam-white)" : mainColorVar}`,
          "--hover-text-color": hoverTextColor,
        }
      : {
          "--hover-text-color": hoverTextColor,
        }),
    backgroundColor: dynamicBgColor,
    color: dynamicTextColor,
    ...style,
  };

  return (
    <>
      {tooltip && (
        <Tooltip id={tooltip.id} content={tooltip.content} className="z-50" />
      )}
      {link ? (
        <Link
          viewTransition
          className={`${wrapperClass}`}
          to={link}
          style={combinedStyle}
          type={type}
          data-tooltip-id={tooltip?.id}
        >
          {icon && (
            <span className="beergam-button-hover-text">
              {React.createElement(getIcon(icon as keyof typeof Svg), {
                width: "22px",
                height: "22px",
                tailWindClasses: `max-w-[unset]! ${fetcher?.completed || fetcher?.error || loading ? "opacity-0!" : ""}`,
              })}
            </span>
          )}
          {children}
        </Link>
      ) : (
        <button
          onClick={(e) => {
            if (fetcher?.fecthing || disabled || loading) return;
            onClick?.(e);
          }}
          className={`${wrapperClass}`}
          style={combinedStyle}
          type={type}
          disabled={disabled || loading}
          data-tooltip-id={tooltip?.id}
          {...buttonProps}
        >
          {icon && (
            <span className="beergam-button-hover-text">
              {React.createElement(getIcon(icon as keyof typeof Svg), {
                width: "22px",
                height: "22px",
                tailWindClasses: `max-w-[unset]! ${fetcher?.completed || fetcher?.error || loading ? "opacity-0!" : ""}`,
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
  mainColor = "beergam-primary",
  animationStyle = "slider",
  className,
  link,
  onClick,
  disabled,
  fetcher,
  icon,
  type = "button",
  loading,
  tooltip,
}: BeergamButtonProps) {
  useEffect(() => {
    if (fetcher?.completed || fetcher?.error) {
      const timeout = setTimeout(() => {
        fetcher.mutation.reset();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [fetcher?.completed, fetcher?.error, fetcher?.mutation]);
  const isLoading = loading || fetcher?.fecthing;
  return (
    <BeergamButtonWrapper
      link={link}
      mainColor={mainColor}
      animationStyle={animationStyle}
      className={className}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || isLoading}
      fetcher={fetcher}
      icon={icon}
      type={type}
      loading={isLoading}
      tooltip={tooltip}
    >
      <>
        {title && (
          <span
            className={`relative beergam-button-hover-text ${fetcher?.completed || fetcher?.error || isLoading ? "opacity-0" : "opacity-100"} z-10 ${disabled ? "" : animationStyle == "fade" ? "" : ""}`}
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
        {isLoading && (
          <span className="text-beergam-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spining color="#fff" size="22px" />
          </span>
        )}
      </>
    </BeergamButtonWrapper>
  );
}
