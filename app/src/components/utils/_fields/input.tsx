import { useEffect, useState, type InputHTMLAttributes } from "react";
import { Tooltip } from "react-tooltip";
import Svg from "~/src/assets/svgs/_index";
import CopyButton from "~/src/components/ui/CopyButton";

// interface InputProps {
//   placeholder?: string;
//   required?: boolean;
//   value: string | number;
//   type?: HTMLInputTypeAttribute;
//   error?: string;
//   onChange?: (params: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur?: (params: React.ChangeEvent<HTMLInputElement>) => void;
//   onFocus?: (params: React.ChangeEvent<HTMLInputElement>) => void;
//   name?: string;
//   style?: React.CSSProperties;
//   min?: number;
//   max?: number;
//   disabled?: boolean | undefined;
//   tailWindClasses?: string;
//   dataTooltipId?: string;
// }
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  tailWindClasses?: string;
  dataTooltipId?: string;
  showVariables?: boolean;
  wrapperSize?: string | undefined;
  showPassword?: boolean;
  onEyeChange?: (showPassword: boolean) => void;
  clipboard?: boolean;
  widthType?: "fit" | "full";
  prefix?: string;
}
export default function Input({
  error,
  placeholder,
  required,
  value,
  type,
  onChange,
  onBlur,
  name,
  style,
  onFocus,
  min,
  max,
  disabled,
  tailWindClasses,
  dataTooltipId,
  success,
  showVariables,
  wrapperSize,
  onEyeChange,
  showPassword,
  clipboard,
  widthType = "full",
  prefix,
  ...props
}: InputProps) {
  const isValid = value && (!error || error != "") && success;

  const baseClasses =
    type != "checkbox"
      ? "w-full px-3 py-2.5 border border-beergam-input-border rounded text-sm bg-beergam-input-background text-beergam-typography-tertiary transition-colors duration-200 outline-none"
      : "appearance-none w-5 h-5 cursor-pointer border border-beergam-input-border rounded bg-beergam-input-background! relative outline-none checked:bg-beergam-orange checked:border-beergam-orange hover:border-beergam-orange after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:w-1.5 after:h-2.5 after:border-r-[2.5px] after:border-b-[2.5px] after:border-white after:origin-center after:transition-transform after:duration-200 after:ease-in-out after:opacity-0 checked:after:scale-100 checked:after:rotate-45 checked:after:opacity-100";
  const errorClasses =
    error && error != ""
      ? "!border-beergam-red focus:!border-beergam-red/90"
      : "";
  const successClasses = isValid
    ? "!border-beergam-green focus:!border-beergam-green/90"
    : "";
  const focusClasses = "focus:border-beergam-orange outline-beergam-orange";
  const disabledClasses = disabled
    ? "cursor-not-allowed text-beergam-gray!"
    : "";
  const [isShowPassword, setIsShowPassword] = useState(showPassword);
  // State para verificar se o usuário está focado ou interagindo com o input
  const [isInteracting, setIsInteracting] = useState(false);

  // Handlers para foco/interação
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsInteracting(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsInteracting(false);
    if (onBlur) onBlur(e);
  };
  useEffect(() => {
    setIsShowPassword(showPassword ?? false);
  }, [showPassword]);
  return (
    <>
      <div
        data-tooltip-id={dataTooltipId}
        className={`relative ${widthType === "full" ? "w-full" : "w-auto"} flex justify-center flex-col ${wrapperSize}`}
      >
        {prefix && (
          <span className="text-beergam-typography-tertiary! text-base absolute left-4 top-1/2 transform -translate-y-1/2">
            {prefix}
          </span>
        )}
        <input
          type={
            type === "password" ? (isShowPassword ? "text" : "password") : type
          }
          value={value}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${type === "password" ? "pr-10" : ""} ${tailWindClasses} ${prefix ? "pl-9" : ""}`}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          name={name}
          style={style}
          min={min}
          max={max}
          disabled={disabled}
          {...props}
        />
        <div className="absolute flex items-center gap-2 justify-center right-3 top-1/2 transform -translate-y-1/2">
          {type === "password" && (
            <button
              type="button"
              onClick={() => {
                setIsShowPassword(!isShowPassword);
                onEyeChange?.(isShowPassword ?? false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              {isShowPassword ? (
                <div className="flex items-center gap-2">
                  <Svg.eye width={20} height={20} />
                </div>
              ) : (
                <Svg.eye_slash width={20} height={20} />
              )}
            </button>
          )}
          {error && (
            <div className="flex items-center gap-2">
              <Svg.x_circle
                width={20}
                height={20}
                tailWindClasses="text-beergam-red"
              />
            </div>
          )}
          {clipboard && (
            <>
              <CopyButton
                iconSize="h-5 w-5"
                textToCopy={(value as string) ?? "N/A"}
              />
            </>
          )}
        </div>
      </div>
      {dataTooltipId && (
        <Tooltip
          id={dataTooltipId}
          content={error || ""}
          isOpen={!isInteracting}
          className="z-50"
        />
      )}
      {showVariables && (
        <div className="">
          <p>error: {JSON.stringify(error)}</p>
          <p>success: {JSON.stringify(success)}</p>
          <p>isValid: {JSON.stringify(isValid)}</p>
        </div>
      )}
    </>
  );
}
