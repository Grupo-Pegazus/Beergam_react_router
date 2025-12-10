import { useState, useRef } from "react";
import { Typography, Button } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";
import { MonthYearPicker } from "~/src/components/ui/MonthYearPicker";
import dayjs, { type Dayjs } from "dayjs";

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

function convertToDayjs(value?: string): Dayjs | null {
  if (!value) return null;
  const dayjsValue = dayjs(value);
  return dayjsValue.isValid() ? dayjsValue : null;
}


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
  // Mantém retrocompatibilidade: se includeTime for true, usa datetime-local
  // Caso contrário, usa dateType se fornecido, senão usa "date"
  const inputType = includeTime 
    ? "datetime-local" 
    : (dateType ?? "date");

  // Se for tipo month, usa componente customizado
  if (inputType === "month") {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dayjsValue = convertToDayjs(value);

    const handleOpen = () => {
      if (!disabled) {
        setAnchorEl(buttonRef.current);
      }
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDateChange = (newValue: Dayjs) => {
      if (!newValue || !newValue.isValid()) {
        onChange(undefined);
        return;
      }
      // Retorna ISO string do primeiro dia do mês selecionado
      onChange(newValue.startOf("month").toISOString());
    };

    const displayValue = dayjsValue
      ? dayjsValue.format("MMMM [de] YYYY")
      : placeholder || "Selecione o mês";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Button
          ref={buttonRef}
          onClick={handleOpen}
          disabled={disabled}
          sx={{
            width: widthType === "full" ? "100%" : "auto",
            minWidth: 200,
            justifyContent: "flex-start",
            textTransform: "none",
            borderRadius: "24px",
            padding: "8px 16px",
            fontSize: "0.875rem",
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            color: dayjsValue ? "#1f2a44" : "#94a3b8",
            "&:hover": {
              backgroundColor: "#f8fafc",
              borderColor: "#cbd5e1",
            },
            "&:disabled": {
              backgroundColor: "#f1f5f9",
              color: "#94a3b8",
            },
          }}
        >
          {displayValue}
        </Button>
        <MonthYearPicker
          value={dayjsValue}
          onChange={handleDateChange}
          onClose={handleClose}
          anchorEl={anchorEl}
        />
      </div>
    );
  }

  // Para outros tipos, usa input HTML nativo
  const getFormattedValue = (): string => {
    if (includeTime) return formatDateTimeForInput(value);
    return formatDateForInput(value);
  };

  const inputValue = getFormattedValue();

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
            return;
          }

          if (inputType === "date") {
            const isoValue = new Date(e.target.value).toISOString();
            onChange(isoValue);
          } else {
            // datetime-local
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

