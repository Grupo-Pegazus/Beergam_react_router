import { useMemo } from "react";
import { Typography } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";

const ACTIVE_TIME_OPTIONS: Array<{
  label: string;
  value: { min?: number; max?: number } | null;
}> = [
  { label: "Qualquer", value: null },
  { label: "Até 30 dias", value: { max: 30 } },
  { label: "31 a 90 dias", value: { min: 31, max: 90 } },
  { label: "91 a 180 dias", value: { min: 91, max: 180 } },
  { label: "Mais de 180 dias", value: { min: 181 } },
];

function getActiveTimeValue(
  min: number | undefined,
  max: number | undefined,
): string {
  if (min === undefined && max === undefined) return "Qualquer";
  const match = ACTIVE_TIME_OPTIONS.find((option) => {
    if (!option.value) return false;
    return option.value.min === min && option.value.max === max;
  });
  return match?.label ?? "Personalizado";
}

function resolveActiveTimeOption(label: string) {
  return ACTIVE_TIME_OPTIONS.find((option) => option.label === label);
}

interface ActiveTimeFilterProps {
  value: unknown;
  label: string;
  minKey: string;
  maxKey: string;
  onMinMaxChange: (min: number | undefined, max: number | undefined) => void;
}

export function ActiveTimeFilter({
  value,
  label,
  minKey,
  maxKey,
  onMinMaxChange,
}: ActiveTimeFilterProps) {
  const state = value as {
    [key: string]: number | undefined;
  };

  const currentValue = useMemo(
    () =>
      getActiveTimeValue(
        state[minKey] as number | undefined,
        state[maxKey] as number | undefined,
      ),
    [state, minKey, maxKey],
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const label = event.target.value;
    const option = resolveActiveTimeOption(label);
    onMinMaxChange(option?.value?.min, option?.value?.max);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Fields.select
        value={currentValue}
        onChange={handleChange}
        options={ACTIVE_TIME_OPTIONS.map((option) => ({ value: option.label, label: option.label }))}
        tailWindClasses="rounded-3xl"
      />
    </div>
  );
}

