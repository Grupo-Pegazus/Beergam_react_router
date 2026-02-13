import { DatePicker } from "~/src/components/ui/DatePicker";

interface FilterDatePickerProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  includeTime?: boolean;
  dateType?: "date" | "datetime-local" | "month";
  placeholder?: string;
  widthType?: "fit" | "full";
}

/**
 * Filtro de data único (um dia ou um mês).
 * Para intervalo de datas, use FilterDateRangePicker.
 */
export function FilterDatePicker({
  label,
  value,
  onChange,
  disabled = false,
  includeTime = false,
  dateType,
  placeholder,
  widthType = "fit",
}: FilterDatePickerProps) {
  const inputType = includeTime ? "datetime-local" : (dateType ?? "date");

  if (inputType === "month") {
    return (
      <DatePicker
        mode="single-month"
        label={label}
        value={value ?? null}
        onChange={(v) => onChange(v)}
        disabled={disabled}
        placeholder={placeholder}
        widthType={widthType}
      />
    );
  }

  return (
    <DatePicker
      mode="single-day"
      label={label}
      value={value ?? null}
      onChange={(v) => onChange(v)}
      disabled={disabled}
      includeTime={includeTime}
      placeholder={placeholder}
      widthType={widthType}
    />
  );
}
