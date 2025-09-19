import { useState } from "react";
import Svg from "~/src/assets/svgs";
interface InputError {
  message: string;
  error: boolean;
}

interface InputProps {
  placeholder?: string;
  required?: boolean;
  value: string | number;
  type?: string;
  error?: InputError;
  onChange?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  disabled?: boolean | undefined;
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
}: InputProps) {
  const isValid = required && value && !error?.error;

  const baseClasses =
    "w-full px-3 py-2.5 border border-black/20 rounded text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none";
  const errorClasses = error?.error ? "border-red-500" : "";
  const successClasses = isValid ? "border-green-500" : "";
  const focusClasses = "focus:border-[#ff8a00]";
  const disabledClasses = disabled
    ? "bg-gray-50 cursor-not-allowed border-gray-300 text-slate-500"
    : "";
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative w-full">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${type === "password" ? "pr-10" : ""}`}
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
            {showPassword ? <Svg.eye /> : <Svg.eye_slash />}
          </button>
        )}
      </div>
      <p
        className={`text-xs text-red-500 h-2.5 mt-1 ${error?.error ? "opacity-100" : "opacity-0"}`}
      >
        {error?.message || ""}
      </p>
    </>
  );
}
