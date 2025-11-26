import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  className?: string;
}

export default function RadioGroup({
  name,
  value,
  options,
  onChange,
  className = "",
}: RadioGroupProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border-2 transition-all ${
              isSelected
                ? "border-beergam-orange bg-beergam-orange/10"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-beergam-orange focus:ring-beergam-orange focus:ring-2 cursor-pointer accent-beergam-orange"
            />
            <span
              className={`text-sm font-medium ${
                isSelected ? "text-beergam-orange" : "text-beergam-gray"
              }`}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
