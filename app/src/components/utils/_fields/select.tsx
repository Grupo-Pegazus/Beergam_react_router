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
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nativeSelectRef = useRef<HTMLSelectElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isValid = required && value && !error;

  // Detectar se é dispositivo móvel/iOS
  useEffect(() => {
    const checkMobile = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobileDevice = window.innerWidth < 768 || isIOS;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Classes baseadas no Input para manter consistência visual
  const baseClasses =
    "w-full px-3 py-2.5 border border-beergam-input-border bg-beergam-input-background text-beergam-typography-tertiary rounded text-sm transition-colors duration-200 outline-none";
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
    ? "cursor-not-allowed! border-beergam-input-disabled-border text-beergam-gray!"
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
      // Atualizar o valor do select nativo se existir
      if (nativeSelectRef.current) {
        nativeSelectRef.current.value = optionValue || "";
      }

      // Disparar evento de mudança
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

  // No mobile/iOS, usar apenas o select nativo
  if (isMobile) {
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
                backgroundColor: backgroundColor ? backgroundColor : undefined,
                paddingRight: "2.5rem",
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label={name || "Select"}
              aria-invalid={error?.error || hasError}
              aria-describedby={
                error?.error && dataTooltipId ? dataTooltipId : undefined
              }
            >
              {!value && (
                <option value="" disabled>
                  Selecione uma opção
                </option>
              )}
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center gap-2">
              <Svg.chevron tailWindClasses="w-4 h-4 text-beergam-typography-tertiary" />
              {(error?.error || hasError) && (
                <Svg.x_circle
                  width={20}
                  height={20}
                  tailWindClasses="text-beergam-red"
                />
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
          <p
            className={`text-xs text-red-500 min-h-5 mt-1 lg:min-h-[16px] 2xl:min-h-5 ${error?.error ? "opacity-100" : "opacity-0"}`}
          >
            {error?.message || ""}
          </p>
        )}
      </>
    );
  }

  // No desktop, usar UI customizada mas com select nativo como fallback
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
          {/* Select nativo para acessibilidade e formulários */}
          <select
            ref={nativeSelectRef}
            value={value || ""}
            required={required}
            onChange={(e) => {
              if (onChange) {
                onChange(e);
              }
              setIsOpen(false);
            }}
            name={name}
            disabled={disabled}
            className="sr-only"
            aria-label={name || "Select"}
            aria-invalid={error?.error || hasError}
            aria-describedby={
              error?.error && dataTooltipId ? dataTooltipId : undefined
            }
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

          {/* Botão customizado para visual */}
          <button
            ref={buttonRef}
            type="button"
            className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${icon ? "pl-10" : ""} ${error?.error || hasError ? "pr-10" : ""} ${tailWindClasses} text-left flex gap-2 items-center justify-between appearance-none`}
            style={{
              ...style,
              backgroundColor: backgroundColor ? backgroundColor : undefined,
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
            aria-labelledby={name ? `${name}-label` : undefined}
            role="combobox"
            tabIndex={0}
          >
            <span
              className={`${value ?? ""} `}
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
          <div className="absolute flex items-center gap-2 justify-center right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
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
        </div>

        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            id={`${name || "select"}-dropdown`}
            className="absolute z-9999 w-full mt-1 bg-beergam-section-background border border-beergam-input-border rounded shadow-lg max-h-60 overflow-auto"
            role="listbox"
            aria-label={name || "Opções de seleção"}
            aria-labelledby={name ? `${name}-label` : undefined}
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
                const isDisabled = opt.disabled;

                return (
                  <button
                    key={idx}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      w-full px-3 py-2.5 text-left text-sm text-beergam-typography-tertiary transition-colors duration-150
                      ${isSelected ? "bg-beergam-primary/40 font-semibold" : ""}
                      ${isDisabled ? "opacity-50 cursor-not-allowed!" : "hover:bg-beergam-primary/10"}
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
