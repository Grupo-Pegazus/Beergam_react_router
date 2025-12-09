import { Typography } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";


function formatDateForInput(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  // Retorna apenas a data no formato "YYYY-MM-DD"
  return d.toISOString().slice(0, 10);
}

function formatDateTimeForInput(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  // Retorna no formato "YYYY-MM-DDTHH:mm"
  const isoString = d.toISOString();
  return isoString.slice(0, 16);
}

interface FilterDatePickerProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  includeTime?: boolean;
  placeholder?: string;
  widthType?: "fit" | "full";
}


export function FilterDatePicker({
  label,
  value,
  onChange,
  disabled = false,
  includeTime = false,
  placeholder,
  widthType = "fit",
}: FilterDatePickerProps) {
  const inputType = includeTime ? "datetime-local" : "date";

  const inputValue = includeTime
    ? formatDateTimeForInput(value)
    : formatDateForInput(value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Fields.input
        widthType={widthType}
        type={inputType}
        value={inputValue}
        onChange={(e) => {
          if (!e.target.value) {
            onChange(undefined);
          } else if (inputType === "date") {
            const isoValue = new Date(e.target.value).toISOString();
            onChange(isoValue);
          } else {
            const local = e.target.value;
            const completed = local.length === 16 ? `${local}:00` : local;
            const dateObj = new Date(completed);
            onChange(dateObj.toISOString());
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        tailWindClasses="rounded-3xl"
      />
    </div>
  );
}

