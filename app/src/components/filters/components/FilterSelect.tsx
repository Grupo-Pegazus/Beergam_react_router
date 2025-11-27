import { useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import type { FilterFieldProps, FilterOption } from "../types";
import { Fields } from "~/src/components/utils/_fields";

export interface FilterSelectProps<T extends string = string>
  extends FilterFieldProps {
  options: Array<FilterOption<T>>;
  defaultValue?: T;
}

export function FilterSelect<T extends string = string>({
  value,
  onChange,
  label,
  options,
  defaultValue,
  disabled,
}: FilterSelectProps<T>) {
  const currentValue = useMemo(
    () => (value as T) ?? defaultValue ?? options[0]?.value,
    [value, defaultValue, options],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = (event.target.value as T) ?? defaultValue;
      onChange(newValue);
    },
    [onChange, defaultValue],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Fields.select
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        options={options.map((opt) => ({ value: opt.value, label: opt.label }))}
        tailWindClasses="rounded-3xl"
      />
    </div>
  );
}

