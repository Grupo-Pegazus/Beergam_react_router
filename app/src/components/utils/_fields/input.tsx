import { useState, type HTMLInputTypeAttribute } from "react";
import Svg from "~/src/assets/svgs";
import { type InputError } from "./typings";

interface InputProps {
  placeholder?: string;
  required?: boolean;
  value: string | number;
  type?: HTMLInputTypeAttribute;
  error?: InputError;
  hasError?: boolean;
  onChange?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  disabled?: boolean | undefined;
  tailWindClasses?: string;
}

export default function Input({
  error,
  placeholder,
  required,
  value,
  type,
  hasError = true,
  onChange,
  onBlur,
  name,
  style,
  onFocus,
  min,
  max,
  disabled,
  tailWindClasses,
}: InputProps) {
  const isValid = required && value && !error?.error;

  const baseClasses =
    type != "checkbox"
      ? "w-full px-3 py-2.5 border border-black/20 rounded text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none"
      : "appearance-none w-5 h-5 cursor-pointer border border-black/20 rounded bg-white relative outline-none checked:bg-beergam-orange checked:border-beergam-orange hover:border-beergam-orange after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:w-1.5 after:h-2.5 after:border-r-[2.5px] after:border-b-[2.5px] after:border-white after:origin-center after:transition-transform after:duration-200 after:ease-in-out after:opacity-0 checked:after:scale-100 checked:after:rotate-45 checked:after:opacity-100";
  const errorClasses = error?.error
    ? "border-red-500 focus:border-red-500"
    : "";
  const successClasses = isValid ? "border-green-500" : "";
  const focusClasses = "focus:border-[#ff8a00] outline-beergam-orange";
  const disabledClasses = disabled
    ? "bg-gray-50 cursor-not-allowed border-gray-300 text-slate-500"
    : "";
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative w-full flex items-center justify-center flex-col">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${type === "password" ? "pr-10" : ""} ${tailWindClasses}`}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          name={name}
          style={style}
          min={min}
          max={max}
          disabled={disabled}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <div className="flex items-center gap-2">
                <Svg.eye width={20} height={20} />
              </div>
            ) : (
              <Svg.eye_slash width={20} height={20} />
            )}
          </button>
        )}
      </div>
      {hasError && (
        <p
          className={`text-xs text-red-500 min-h-5 mt-1 lg:min-h-[16px] 2xl:min-h-5  ${error?.error ? "opacity-100" : "opacity-0"}`}
        >
          {error?.message || ""}
        </p>
      )}
    </>
  );
}
