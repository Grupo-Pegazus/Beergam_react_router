import React from "react";
// import GrupoCampos from ".";

interface Option {
  value: string | null;
  label: string;
}

interface SelectProps {
  options?: Option[];
  value: string | null;
  required?: boolean;
  error?: boolean;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  onChange?: (params: React.ChangeEvent<HTMLSelectElement>) => void;
  backgroundColor?: string;
  textColor?: string;
  name?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function Select({
  error,
  options,
  value,
  required,
  style,
  onChange,
  backgroundColor,
  name,
  textColor,
  children,
  disabled,
}: SelectProps) {
  const isValid = required && value && !error;

  const wrapperBase =
    "w-full inline-block relative border border-black/20 flex items-center bg-white rounded-[20px] shadow-[0_0_10px_0_rgba(0,0,0,0.2)] overflow-hidden p-[10px] gap-2 transition-[border,box-shadow] ease-in-out";
  const wrapperState = error
    ? "border-red-500 rounded-md"
    : isValid
      ? "border-[rgb(7,255,7)]"
      : "";

  return (
    <div
      className={`${wrapperBase} ${wrapperState}`}
      style={{
        ...style,
        backgroundColor: backgroundColor ? backgroundColor : undefined,
      }}
    >
      {/* {icon && <GrupoCampos.icon icon={icon} />} */}
      <select
        className={[
          // base
          "w-full appearance-none bg-inherit text-[14px] text-[#333] cursor-pointer outline-none",
          // built-in arrow
          "bg-[right_center] bg-no-repeat bg-[length:15px]",
          // states
          "focus:outline-none disabled:bg-[#f9f9f9] disabled:cursor-not-allowed disabled:text-[#64748b]",
        ].join(" ")}
        // Tailwind arbitrary value for background-image (caret)
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='2' height='5' viewBox='0 0 16 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 1L8 8L1 1' stroke='%23182847' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          color: textColor ? textColor : "#333",
        }}
        value={value || ""}
        required={required}
        onChange={onChange}
        name={name}
        disabled={disabled}
      >
        {options &&
          options.map((opt, idx) => (
            <option
              style={{ backgroundColor: "#fff", color: "#333" }}
              key={idx}
              value={opt.value || ""}
            >
              {opt.label}
            </option>
          ))}

        {children}
      </select>
    </div>
  );
}

export default Select;
