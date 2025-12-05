import { useState, type InputHTMLAttributes } from "react";
import { Tooltip } from "react-tooltip";
import Svg from "~/src/assets/svgs/_index";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
  tailWindClasses?: string;
  dataTooltipId?: string;
  label?: string;
  labelPosition?: "left" | "right";
}

export default function Checkbox({
  error,
  name,
  checked,
  onChange,
  onBlur,
  onFocus,
  disabled,
  tailWindClasses,
  dataTooltipId,
  label,
  labelPosition = "right",
  className,
  ...props
}: CheckboxProps) {
  const baseClasses =
    "appearance-none w-5 h-5 cursor-pointer border border-black/20 rounded bg-white relative outline-none checked:bg-beergam-orange checked:border-beergam-orange hover:border-beergam-orange after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:w-1.5 after:h-2.5 after:border-r-[2.5px] after:border-b-[2.5px] after:border-white after:origin-center after:transition-transform after:duration-200 after:ease-in-out after:opacity-0 checked:after:scale-100 checked:after:rotate-45 checked:after:opacity-100";

  const errorClasses =
    error && error !== ""
      ? "!border-beergam-red focus:!border-beergam-red/90"
      : "";

  const disabledClasses = disabled
    ? "bg-gray-50 cursor-not-allowed border-gray-300 opacity-50"
    : "";

  const [isInteracting, setIsInteracting] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsInteracting(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsInteracting(false);
    if (onBlur) onBlur(e);
  };

  const checkboxElement = (
    <div
      data-tooltip-id={dataTooltipId}
      className={`relative flex items-center ${tailWindClasses || ""}`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className || ""}`}
        {...props}
      />
      {error && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2">
          <Svg.x_circle
            width={20}
            height={20}
            tailWindClasses="text-beergam-red"
          />
        </div>
      )}
    </div>
  );

  if (!label) {
    return (
      <>
        {checkboxElement}
        {dataTooltipId && (
          <Tooltip
            id={dataTooltipId}
            content={error || ""}
            isOpen={!isInteracting}
            className="z-50"
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={`flex items-center gap-2 ${
          labelPosition === "left" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {labelPosition === "left" && (
          <label
            htmlFor={name}
            className="text-sm text-beergam-gray cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {checkboxElement}
        {labelPosition === "right" && (
          <label
            htmlFor={name}
            className="text-sm text-beergam-gray cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
      {dataTooltipId && (
        <Tooltip
          id={dataTooltipId}
          content={error || ""}
          isOpen={!isInteracting}
          className="z-50"
        />
      )}
      {error && (
        <p className="text-xs text-beergam-red mt-1">{error}</p>
      )}
    </>
  );
}

