import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { Link } from "react-router";

interface BeergamButtonWrapperProps {
  mainColor?: string;
  animationStyle?: "slider" | "fade";
  link?: string | undefined;
}

interface BeergamButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BeergamButtonWrapperProps {}

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
  ...props
}: BeergamButtonProps) {
  const { style, ...buttonProps } = props;
  const isSlider = animationStyle === "slider";
  const sliderClasses = disabled
    ? "cursor-not-allowed!"
    : isSlider
      ? "bg-[linear-gradient(90deg,var(--bg-slider-color)_0%,var(--bg-slider-color)_100%)] bg-[length:0%_100%] bg-no-repeat bg-left transition-[background-size,color] duration-300 ease-out hover:bg-[length:100%_100%]"
      : "hover:opacity-80";
  const wrapperClass = `${sliderClasses} relative overflow-hidden text-${mainColor} font-semibold py-2 px-4 rounded-lg shadow-sm group ${className}`;
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
          onClick={onClick}
          className={`${wrapperClass}`}
          style={combinedStyle}
          {...buttonProps}
        >
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
}: BeergamButtonProps) {
  return (
    <BeergamButtonWrapper
      link={link}
      mainColor={mainColor}
      animationStyle={animationStyle}
      className={className}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <span
        className={`relative z-10 ${disabled ? "" : animationStyle == "fade" ? "" : "group-hover:text-beergam-white"}`}
        style={{ fontSize: "inherit" }}
      >
        {title}
      </span>
    </BeergamButtonWrapper>
  );
}
