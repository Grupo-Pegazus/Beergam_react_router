import { useState, useCallback, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import Svg from "~/src/assets/svgs/_index";
import {
  getNumericFormat,
  type NumericFormatType,
} from "~/src/utils/formatters/numericInputFormat";

const BASE_CLASSES =
  "w-full px-3 py-2.5 border border-beergam-input-border rounded text-sm bg-beergam-input-background text-beergam-typography-tertiary transition-colors duration-200 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export interface NumericInputProps {
  /** Valor controlado: número quando há format, string quando não há. undefined = vazio (ex.: filtro sem valor) */
  value?: number | string | undefined;
  /** Callback com valor numérico (quando format), string (sem format) ou undefined quando campo é limpo */
  onChange?: (value: number | string | undefined) => void;
  /** Label/prefixo fixo sempre visível (ex.: "R$", "ENTER AMOUNT"). Se não informado, nada é exibido */
  prefix?: string;
  /** Formatação aplicada enquanto o usuário digita: moeda, inteiro ou decimal */
  format?: NumericFormatType;
  /** Casas decimais quando format="decimal" */
  decimalScale?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  name?: string;
  required?: boolean;
  tailWindClasses?: string;
  className?: string;
  dataTooltipId?: string;
  wrapperSize?: string;
  widthType?: "fit" | "full";
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

function clamp(value: number, min?: number, max?: number): number {
  if (min != null && value < min) return min;
  if (max != null && value > max) return max;
  return value;
}

export default function NumericInput({
  value,
  onChange,
  prefix,
  format,
  decimalScale,
  min,
  max,
  placeholder,
  disabled,
  error,
  success,
  name,
  required,
  tailWindClasses = "",
  className = "",
  dataTooltipId,
  wrapperSize,
  widthType = "full",
  onBlur,
  onFocus,
  style,
}: NumericInputProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [internalDigits, setInternalDigits] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isCurrencyBankMode = format === "currency";

  const config = format ? getNumericFormat(format, decimalScale) : null;

  // Sincroniza dígitos internos quando value muda externamente (apenas para currency)
  useEffect(() => {
    if (isCurrencyBankMode) {
      if (value === undefined || value === "" || value === null) {
        setInternalDigits("");
      } else {
        const numValue = typeof value === "number" ? value : parseFloat(String(value));
        if (Number.isFinite(numValue)) {
          const cents = Math.round(numValue * 100);
          setInternalDigits(cents.toString());
        } else {
          setInternalDigits("");
        }
      }
    }
  }, [value, isCurrencyBankMode]);

  // Calcula valor numérico e display
  const numericValue =
    value === undefined || value === ""
      ? undefined
      : typeof value === "string"
        ? config && !isCurrencyBankMode
          ? config.parse(value)
          : parseFloat(value)
        : value;
  const isNumber =
    typeof numericValue === "number" && Number.isFinite(numericValue);

  let displayValue: string;
  if (isCurrencyBankMode) {
    if (internalDigits === "") {
      displayValue = "";
    } else {
      const cents = parseInt(internalDigits, 10);
      const realValue = cents / 100;
      displayValue = config ? config.format(realValue) : realValue.toString();
    }
  } else {
    displayValue = config
      ? isNumber
        ? config.format(numericValue as number)
        : ""
      : String(value ?? "");
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isCurrencyBankMode) return;

      // Intercepta dígitos numéricos antes da formatação
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        setInternalDigits((prev) => {
          const updated = prev + e.key;
          const cents = parseInt(updated, 10);
          const realValue = cents / 100;
          const clamped = clamp(realValue, min, max);
          onChange?.(clamped);
          return updated;
        });
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setInternalDigits((prev) => {
          const updated = prev.slice(0, -1);
          if (updated === "") {
            onChange?.(undefined);
            return "";
          }
          const cents = parseInt(updated, 10);
          const realValue = cents / 100;
          const clamped = clamp(realValue, min, max);
          onChange?.(clamped);
          return updated;
        });
      } else if (e.key === "Delete") {
        e.preventDefault();
        setInternalDigits((prev) => {
          const updated = prev.slice(0, -1);
          if (updated === "") {
            onChange?.(undefined);
            return "";
          }
          const cents = parseInt(updated, 10);
          const realValue = cents / 100;
          const clamped = clamp(realValue, min, max);
          onChange?.(clamped);
          return updated;
        });
      }
      // Permite outras teclas (Tab, Arrow keys, etc.)
    },
    [isCurrencyBankMode, min, max, onChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!isCurrencyBankMode) return;

      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const digitsOnly = pasted.replace(/\D/g, "");
      
      if (digitsOnly === "") {
        onChange?.(undefined);
        setInternalDigits("");
      } else {
        setInternalDigits(digitsOnly);
        const cents = parseInt(digitsOnly, 10);
        const realValue = cents / 100;
        const clamped = clamp(realValue, min, max);
        onChange?.(clamped);
      }
    },
    [isCurrencyBankMode, min, max, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // No modo banco, reseta para o valor formatado correto (tudo é controlado via onKeyDown/onPaste)
      if (isCurrencyBankMode) {
        // Força o valor de volta para o displayValue correto
        if (inputRef.current && inputRef.current.value !== displayValue) {
          inputRef.current.value = displayValue;
        }
        return;
      }

      const raw = e.target.value;

      if (config) {
        const parsed = config.parse(raw);
        if (Number.isNaN(parsed) || raw.trim() === "") {
          onChange?.(undefined);
        } else {
          onChange?.(clamp(parsed, min, max));
        }
      } else {
        const digitsOnly = raw.replace(/[^\d,.-]/g, "");
        onChange?.(digitsOnly === "" ? undefined : digitsOnly);
      }
    },
    [isCurrencyBankMode, config, min, max, onChange, displayValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsInteracting(false);
      if (config && isNumber) {
        const clamped = clamp(numericValue as number, min, max);
        if (clamped !== numericValue) onChange?.(clamped);
      }
      onBlur?.(e);
    },
    [config, isNumber, numericValue, min, max, onChange, onBlur]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsInteracting(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const isValid = value != null && value !== "" && !error && success;
  const errorClasses =
    error && error !== ""
      ? "!border-beergam-red focus:!border-beergam-red/90"
      : "";
  const successClasses = isValid
    ? "!border-beergam-green focus:!border-beergam-green/90"
    : "";
  const focusClasses = "focus:border-beergam-orange outline-beergam-orange";
  const disabledClasses = disabled ? "cursor-not-allowed text-beergam-gray!" : "";

  const inputMode = format === "integer" ? "numeric" : "decimal";

  return (
    <>
      <div
        data-tooltip-id={dataTooltipId}
        className={`relative ${widthType === "full" ? "w-full" : "w-auto"} flex justify-center flex-col ${wrapperSize ?? ""}`}
      >
        {prefix != null && prefix !== "" && (
          <span className="text-beergam-typography-tertiary! text-base absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          name={name}
          required={required}
          disabled={disabled}
          style={style}
          className={`${BASE_CLASSES} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${prefix ? "pl-9" : ""} ${tailWindClasses} ${className}`}
        />
        <div className="absolute flex items-center gap-2 justify-center right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {error && (
            <Svg.x_circle
              width={20}
              height={20}
              tailWindClasses="text-beergam-red"
            />
          )}
        </div>
      </div>
      {dataTooltipId && (
        <Tooltip
          id={dataTooltipId}
          content={error ?? ""}
          isOpen={!isInteracting}
          className="z-50"
        />
      )}
    </>
  );
}
