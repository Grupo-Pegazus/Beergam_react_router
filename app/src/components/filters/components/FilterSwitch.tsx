import { Switch, Typography } from "@mui/material";
import { useMemo } from "react";
import type { FilterFieldProps } from "../types";

export interface FilterSwitchProps extends FilterFieldProps {
  defaultValue?: boolean;
}

/**
 * Componente Switch reutilizável para filtros booleanos
 * Otimizado com useMemo
 */
export function FilterSwitch({
  value,
  onChange,
  label,
  defaultValue,
  disabled,
}: FilterSwitchProps) {
  const checked = useMemo(
    () => Boolean(value ?? defaultValue ?? false),
    [value, defaultValue]
  );

  const handleChange = () => {
    onChange(!checked);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Typography
        variant="subtitle2"
        className="text-beergam-typography-secondary!"
        fontWeight={600}
      >
        {label}
      </Typography>
      <Switch
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        sx={{
          "& .MuiSwitch-thumb": {
            boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.25)",
          },
        }}
      />
    </div>
  );
}
