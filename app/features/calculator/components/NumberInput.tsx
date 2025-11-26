import React, { useState } from "react";
import Svg from "~/src/assets/svgs/_index";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export default function NumberInput({
  value,
  onChange,
  placeholder = "0",
  prefix,
  suffix,
  step = 1,
  min = 0,
  max,
  className = "",
  disabled = false,
}: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleIncrement = () => {
    const currentValue = parseFloat(value) || 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue.toString());
    }
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(value) || 0;
    const newValue = Math.max(min, currentValue - step);
    onChange(newValue.toString());
  };

  const numericValue = parseFloat(value) || 0;
  const canIncrement = max === undefined || numericValue < max;
  const canDecrement = numericValue > min;

  return (
    <div
      className={`relative flex items-center border-2 rounded-lg bg-white transition-all ${
        isFocused
          ? "border-beergam-orange shadow-md"
          : "border-gray-200 hover:border-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {prefix && (
        <span className="absolute left-4 text-beergam-gray font-semibold text-base pointer-events-none z-10">
          {prefix}
        </span>
      )}

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-full ${
          prefix ? "pl-12" : "pl-4"
        } ${suffix ? "pr-20" : "pr-12"} py-3.5 text-base font-semibold text-gray-900 bg-transparent outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      {suffix && (
        <span className="absolute right-12 text-beergam-gray font-semibold text-base pointer-events-none">
          {suffix}
        </span>
      )}

      <div className="absolute right-2 flex flex-col gap-0.5">
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || !canIncrement}
          className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
            disabled || !canIncrement
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-gray-100 hover:bg-beergam-orange hover:text-white text-gray-600"
          }`}
        >
          <Svg.chevron
            width={12}
            height={12}
            tailWindClasses="stroke-current -rotate-90"
          />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || !canDecrement}
          className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
            disabled || !canDecrement
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-gray-100 hover:bg-beergam-orange hover:text-white text-gray-600"
          }`}
        >
          <Svg.chevron
            width={12}
            height={12}
            tailWindClasses="stroke-current rotate-90"
          />
        </button>
      </div>
    </div>
  );
}

