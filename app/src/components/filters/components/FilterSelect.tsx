import { useCallback, useMemo } from "react";
import { MenuItem, TextField, Typography } from "@mui/material";
import type { FilterFieldProps, FilterOption } from "../types";

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <TextField
        select
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            backgroundColor: "#fff",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

