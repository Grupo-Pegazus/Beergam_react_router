import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import Svg from "~/src/assets/svgs/_index";
import { type InputError } from "./typings";

interface Option {
  value: string | null;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options?: Option[];
  value?: string | null | undefined | null;
  required?: boolean;
  error?: InputError;
  hasError?: boolean;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  onChange?: (params: React.ChangeEvent<HTMLSelectElement>) => void;
  backgroundColor?: string;
  textColor?: string;
  name?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  tailWindClasses?: string;
  widthType?: "fit" | "full";
  dataTooltipId?: string;
}

function Select({
  error,
  options,
  value,
  required,
  hasError = false,
  style,
  onChange,
  backgroundColor,
  name,
  textColor,
  children,
  disabled,
  tailWindClasses,
  icon,
  widthType = "fit",
  dataTooltipId,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isValid = required && value && !error;

  // Classes baseadas no Input para manter consistência visual
  const baseClasses =
    "w-full px-3 py-2.5 border border-black/20 rounded text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none appearance-none";
  const errorClasses =
    error?.error || hasError
      ? "!border-beergam-red focus:!border-beergam-red/90"
      : "";
  const successClasses = isValid
    ? "!border-beergam-green focus:!border-beergam-green/90"
    : "";
  const focusClasses = isOpen
    ? "border-[#ff8a00] outline-beergam-orange"
    : "focus:border-[#ff8a00] outline-beergam-orange";
  const disabledClasses = disabled
    ? "cursor-not-allowed! border-gray-300! text-beergam-blue-primary!"
    : "";

  // Encontrar o label da opção selecionada
  const selectedOption = options?.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Scroll para opção selecionada quando abrir
  useEffect(() => {
    if (isOpen && dropdownRef.current && value) {
      const selectedIndex =
        options?.findIndex((opt) => opt.value === value) ?? -1;
      if (selectedIndex >= 0) {
        const optionElement = dropdownRef.current.children[
          selectedIndex
        ] as HTMLElement;
        if (optionElement) {
          optionElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }
  }, [isOpen, value, options]);

  // Resetar isInteracting quando o erro desaparecer (valor foi corrigido)
  useEffect(() => {
    if (!error?.error && !hasError) {
      setIsInteracting(false);
    }
  }, [error?.error, hasError]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(null);
      setIsInteracting(true);
    }
  };

  const handleBlur = () => {
    setIsInteracting(false);
  };

  const handleFocus = () => {
    setIsInteracting(true);
  };

  const handleSelect = (optionValue: string | null) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: optionValue || "",
          name: name || "",
        },
        currentTarget: {
          value: optionValue || "",
          name: name || "",
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setFocusedIndex(null);
    setTimeout(() => {
      setIsInteracting(false);
    }, 100);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex !== null && options) {
          const option = options[focusedIndex];
          if (option && !option.disabled) {
            handleSelect(option.value);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(null);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (options) {
          const nextIndex =
            focusedIndex === null
              ? 0
              : Math.min(focusedIndex + 1, options.length - 1);
          setFocusedIndex(nextIndex);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen && options) {
          const prevIndex =
            focusedIndex === null
              ? options.length - 1
              : Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
        }
        break;
    }
  };

  return (
    <>
      <div
        ref={selectRef}
        data-tooltip-id={dataTooltipId}
        className={`relative ${widthType === "fit" ? "w-fit min-w-[150px]" : "w-full"}`}
      >
        <div className="relative w-full flex items-center">
          {icon && (
            <div className="absolute left-3 z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <button
            ref={buttonRef}
            type="button"
            className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${icon ? "pl-10" : ""} ${error?.error || hasError ? "pr-10" : ""} ${tailWindClasses} text-left flex gap-2 items-center justify-between`}
            style={{
              ...style,
              backgroundColor: backgroundColor ? backgroundColor : undefined,
              color: textColor ? textColor : "#1e1f21",
            }}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={name || "Select"}
          >
            <span
              className={`${value ? "" : "text-gray-400"} `}
              style={{
                display: "block",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={displayValue || "Selecione uma opção"}
            >
              {displayValue || "Selecione uma opção"}
            </span>
            <Svg.chevron
              tailWindClasses={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-270" : "rotate-90"
              }`}
            />
          </button>
          <div className="absolute flex items-center gap-2 justify-center right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {(error?.error || hasError) && (
              <div className="flex items-center gap-2">
                <Svg.x_circle
                  width={20}
                  height={20}
                  tailWindClasses="text-beergam-red"
                />
              </div>
            )}
          </div>

          <select
            className="sr-only"
            value={value || ""}
            required={required}
            onChange={onChange}
            name={name}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
          >
            {options &&
              options.map((opt, idx) => (
                <option
                  key={idx}
                  value={opt.value || ""}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))}
            {children}
          </select>
        </div>

        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-9999 w-full mt-1 bg-white border border-black/20 rounded shadow-lg max-h-60 overflow-auto"
            role="listbox"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
            }}
          >
            {options && options.length > 0 ? (
              options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isFocused = focusedIndex === idx;
                const isDisabled = opt.disabled;

                return (
                  <button
                    key={idx}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      w-full px-3 py-2.5 text-left text-sm text-[#1e1f21] transition-colors duration-150
                      ${isSelected ? "bg-beergam-orange/10 font-semibold" : ""}
                      ${isFocused && !isSelected ? "bg-gray-100" : ""}
                      ${isDisabled ? "opacity-50 cursor-not-allowed!" : "hover:bg-gray-50"}
                      ${idx === 0 ? "rounded-t" : ""}
                      ${idx === options.length - 1 ? "rounded-b" : ""}
                    `}
                    onClick={() => !isDisabled && handleSelect(opt.value)}
                    disabled={isDisabled}
                    onMouseEnter={() => !isDisabled && setFocusedIndex(idx)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Svg.check tailWindClasses="w-4 h-4 text-beergam-orange" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-sm text-gray-500 text-center">
                Nenhuma opção disponível
              </div>
            )}
          </div>
        )}
      </div>
      {dataTooltipId && (
        <Tooltip
          id={dataTooltipId}
          content={error?.message || ""}
          isOpen={!isInteracting && !!error?.error && !!error?.message}
          className="z-50"
        />
      )}
      {hasError && !dataTooltipId && (
        <p
          className={`text-xs text-red-500 min-h-5 mt-1 lg:min-h-[16px] 2xl:min-h-5 ${error?.error ? "opacity-100" : "opacity-0"}`}
        >
          {error?.message || ""}
        </p>
      )}
    </>
  );
}

export default Select;
