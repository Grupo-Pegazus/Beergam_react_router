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
  value?: string | null | undefined;
  required?: boolean;
  error?: InputError;
  hasError?: boolean;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  onChange?: (params: React.ChangeEvent<HTMLSelectElement>) => void;
  backgroundColor?: string;
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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nativeSelectRef = useRef<HTMLSelectElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isValid = required && value && !error;

  useEffect(() => {
    const checkMobile = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsMobile(window.innerWidth < 768 || isIOS);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const baseClasses =
    "w-full px-3 py-2.5 border border-beergam-input-border bg-beergam-input-background text-beergam-typography-tertiary rounded text-sm transition-colors duration-200 outline-none";
  const errorClasses =
    error?.error || hasError
      ? "!border-beergam-red focus:!border-beergam-red/90"
      : "";
  const successClasses = isValid
    ? "!border-beergam-primary focus:!border-beergam-primary/90"
    : "";
  const focusClasses = isOpen
    ? "border-[#ff8a00] outline-beergam-orange"
    : "focus:border-[#ff8a00] outline-beergam-orange";
  const disabledClasses = disabled
    ? "cursor-not-allowed! border-beergam-input-disabled-border text-beergam-gray!"
    : "";

  const selectedOption = options?.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dropdownRef.current || !value) return;
    const selectedIndex = options?.findIndex((opt) => opt.value === value) ?? -1;
    if (selectedIndex < 0) return;
    const optionEl = dropdownRef.current.children[selectedIndex] as HTMLElement;
    optionEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isOpen, value, options]);

  useEffect(() => {
    if (!error?.error && !hasError) {
      setIsInteracting(false);
    }
  }, [error?.error, hasError]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setFocusedIndex(null);
    setIsInteracting(true);
  };

  const handleBlur = () => setIsInteracting(false);
  const handleFocus = () => setIsInteracting(true);

  const handleSelect = (optionValue: string | null) => {
    if (onChange) {
      if (nativeSelectRef.current) {
        nativeSelectRef.current.value = optionValue || "";
      }
      onChange({
        target: { value: optionValue || "", name: name || "" },
        currentTarget: { value: optionValue || "", name: name || "" },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
    setIsOpen(false);
    setFocusedIndex(null);
    setTimeout(() => {
      setIsInteracting(false);
      buttonRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex !== null && options) {
          const option = options[focusedIndex];
          if (option && !option.disabled) handleSelect(option.value);
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
          setFocusedIndex((prev) =>
            prev === null ? 0 : Math.min(prev + 1, options.length - 1)
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen && options) {
          setFocusedIndex((prev) =>
            prev === null ? options.length - 1 : Math.max(prev - 1, 0)
          );
        }
        break;
    }
  };

  const renderDropdown = () => {
    if (!isOpen || disabled) return null;

    return (
      <div
        ref={dropdownRef}
        id={`${name || "select"}-dropdown`}
        className="absolute top-full left-0 right-0 z-50 mt-1 bg-beergam-section-background border border-beergam-input-border rounded shadow-lg max-h-60 overflow-auto"
        role="listbox"
        aria-label={name || "Opções de seleção"}
      >
        {options && options.length > 0 ? (
          options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isDisabled = opt.disabled;
            const isFocused = idx === focusedIndex;

            return (
              <button
                key={idx}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`
                  w-full px-3 py-2.5 text-left text-sm text-beergam-typography-tertiary transition-colors duration-150
                  ${isSelected ? "bg-beergam-primary/20 font-semibold" : ""}
                  ${isFocused && !isSelected ? "bg-beergam-primary/10" : ""}
                  ${isDisabled ? "opacity-50 cursor-not-allowed!" : "hover:bg-beergam-primary/10"}
                  ${idx === 0 ? "rounded-t" : ""}
                  ${idx === (options?.length ?? 0) - 1 ? "rounded-b" : ""}
                `}
                onClick={() => !isDisabled && handleSelect(opt.value)}
                disabled={isDisabled}
                onMouseEnter={() => !isDisabled && setFocusedIndex(idx)}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Svg.check tailWindClasses="w-4 h-4 text-beergam-primary" />
                  )}
                </div>
              </button>
            );
          })
        ) : (
          <div className="px-3 py-2.5 text-sm text-beergam-typography-secondary text-center">
            Nenhuma opção disponível
          </div>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <div
          data-tooltip-id={dataTooltipId}
          className={`relative ${widthType === "fit" ? "w-fit min-w-[150px]" : "w-full"}`}
        >
          <div className="relative w-full flex items-center">
            {icon && (
              <div className="absolute left-3 z-10 pointer-events-none">{icon}</div>
            )}
            <select
              ref={nativeSelectRef}
              value={value || ""}
              required={required}
              onChange={onChange}
              name={name}
              disabled={disabled}
              className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${icon ? "pl-10" : ""} ${error?.error || hasError ? "pr-10" : ""} ${tailWindClasses} appearance-none cursor-pointer`}
              style={{
                ...style,
                backgroundColor: backgroundColor ?? undefined,
                paddingRight: "2.5rem",
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label={name || "Select"}
              aria-invalid={error?.error || hasError}
              aria-describedby={error?.error && dataTooltipId ? dataTooltipId : undefined}
            >
              {!value && (
                <option value="" disabled>
                  Selecione uma opção
                </option>
              )}
              {options?.map((opt, idx) => (
                <option key={idx} value={opt.value || ""} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
              {children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
              <Svg.chevron tailWindClasses="w-4 h-4 text-beergam-typography-tertiary" />
              {(error?.error || hasError) && (
                <Svg.x_circle width={20} height={20} tailWindClasses="text-beergam-red" />
              )}
            </div>
          </div>
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
          <p className={`text-xs text-red-500 min-h-5 mt-1 lg:min-h-[16px] 2xl:min-h-5 ${error?.error ? "opacity-100" : "opacity-0"}`}>
            {error?.message || ""}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        data-tooltip-id={dataTooltipId}
        className={`relative ${widthType === "fit" ? "w-fit min-w-[150px]" : "w-full"}`}
      >
        <div className="relative w-full flex items-center">
          {icon && (
            <div className="absolute left-3 z-10 pointer-events-none">{icon}</div>
          )}
          <select
            ref={nativeSelectRef}
            value={value || ""}
            required={required}
            onChange={(e) => {
              onChange?.(e);
              setIsOpen(false);
            }}
            name={name}
            disabled={disabled}
            className="sr-only"
            aria-label={name || "Select"}
            aria-invalid={error?.error || hasError}
            aria-describedby={error?.error && dataTooltipId ? dataTooltipId : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={-1}
            id={`${name || "select"}-native`}
          >
            {!value && (
              <option value="" disabled>
                Selecione uma opção
              </option>
            )}
            {options?.map((opt, idx) => (
              <option key={idx} value={opt.value || ""} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>

          <button
            ref={buttonRef}
            type="button"
            className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${icon ? "pl-10" : ""} ${error?.error || hasError ? "pr-10" : ""} ${tailWindClasses} text-left flex gap-2 items-center justify-between appearance-none`}
            style={{
              ...style,
              backgroundColor: backgroundColor ?? undefined,
            }}
            onClick={(e) => {
              e.preventDefault();
              handleToggle();
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={`${name || "select"}-dropdown`}
            role="combobox"
            tabIndex={0}
          >
            <span
              className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
              title={displayValue || "Selecione uma opção"}
            >
              {displayValue || "Selecione uma opção"}
            </span>
            <Svg.chevron
              tailWindClasses={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-270" : "rotate-90"
              }`}
            />
          </button>

          {(error?.error || hasError) && (
            <div className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Svg.x_circle width={20} height={20} tailWindClasses="text-beergam-red" />
            </div>
          )}
        </div>

        {renderDropdown()}
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
        <p className={`text-xs text-red-500 min-h-5 mt-1 lg:min-h-[16px] 2xl:min-h-5 ${error?.error ? "opacity-100" : "opacity-0"}`}>
          {error?.message || ""}
        </p>
      )}
    </>
  );
}

export default Select;
