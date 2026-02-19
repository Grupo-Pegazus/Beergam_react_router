import { DatePicker } from "~/src/components/ui/DatePicker";

export interface DateRangeValue {
  start: string;
  end: string;
}

interface FilterDateRangePickerProps {
  label?: string;
  value?: DateRangeValue | null;
  onChange: (value: DateRangeValue) => void;
  disabled?: boolean;
  placeholder?: string;
  widthType?: "fit" | "full";
  defaultOpen?: boolean;
}

/**
 * Filtro de intervalo de datas (início e fim em um único componente).
 * Substitui a necessidade de usar 2 FilterDatePicker separados.
 */
export function FilterDateRangePicker({
  label = "Período",
  value,
  onChange,
  disabled = false,
  placeholder = "Selecione o período",
  widthType = "full",
  defaultOpen = false,
}: FilterDateRangePickerProps) {
  return (
    <DatePicker
      mode="date-range"
      label={label}
      value={value ?? null}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      widthType={widthType}
      defaultOpen={defaultOpen}
    />
  );
}
