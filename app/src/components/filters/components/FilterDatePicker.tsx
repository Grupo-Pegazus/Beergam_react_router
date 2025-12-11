import { useState, useRef } from "react";
import { Typography, Button, Popover, Box, IconButton } from "@mui/material";
import { MonthYearPicker } from "~/src/components/ui/MonthYearPicker";
import dayjs, { type Dayjs } from "dayjs";

function convertToDayjs(value?: string): Dayjs | null {
  if (!value) return null;
  const dayjsValue = dayjs(value);
  return dayjsValue.isValid() ? dayjsValue : null;
}

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function DateTimePopoverPicker({
  value,
  onChange,
  onClose,
  anchorEl,
  includeTime = false,
}: {
  value: Dayjs | null;
  onChange: (date: Dayjs) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  includeTime?: boolean;
}) {
  const [viewDate, setViewDate] = useState<Dayjs>(value || dayjs());

  const startOfMonth = viewDate.startOf("month");
  const daysInMonth = viewDate.daysInMonth();
  const startWeekday = startOfMonth.day(); // 0 (Sun) - 6 (Sat)

  const handlePrevMonth = () => setViewDate((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setViewDate((prev) => prev.add(1, "month"));

  const handleSelectDay = (dayNumber: number) => {
    const base = viewDate.date(dayNumber);
    const withTime = includeTime && value
      ? base.hour(value.hour()).minute(value.minute())
      : includeTime
        ? base.hour(0).minute(0)
        : base.startOf("day");
    onChange(withTime);
    onClose();
  };

  const handleTimeChange = (timeValue: string) => {
    const [h, m] = timeValue.split(":").map((n) => parseInt(n, 10));
    const target = (value || viewDate).hour(h || 0).minute(m || 0);
    onChange(target);
  };

  const timeValue = (() => {
    const target = value || viewDate;
    const hh = target.hour().toString().padStart(2, "0");
    const mm = target.minute().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  })();

  const daysArray = Array.from({ length: startWeekday + daysInMonth }, (_, idx) => {
    const dayNum = idx - startWeekday + 1;
    return dayNum > 0 ? dayNum : null;
  });

  const isSelected = (dayNumber: number) =>
    value &&
    value.year() === viewDate.year() &&
    value.month() === viewDate.month() &&
    value.date() === dayNumber;

  const monthLabel = viewDate.format("MMMM [de] YYYY");

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: 2,
          minWidth: 300,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <IconButton size="small" onClick={handlePrevMonth}>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>‹</Typography>
          </IconButton>
          <Typography sx={{ fontWeight: 700, textTransform: "capitalize", color: "#1f2a44" }}>
            {monthLabel}
          </Typography>
          <IconButton size="small" onClick={handleNextMonth}>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>›</Typography>
          </IconButton>
        </Box>

        {/* Weekdays */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            textAlign: "center",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          {WEEK_DAYS.map((d) => (
            <Box key={d}>{d}</Box>
          ))}
        </Box>

        {/* Days */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            textAlign: "center",
          }}
        >
          {daysArray.map((dayNumber, idx) =>
            dayNumber === null ? (
              <Box key={idx} />
            ) : (
              <Button
                key={dayNumber}
                onClick={() => handleSelectDay(dayNumber)}
                sx={{
                  minWidth: 0,
                  padding: "8px 0",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  backgroundColor: isSelected(dayNumber)
                    ? "var(--color-beergam-blue-primary)"
                    : "transparent",
                  color: isSelected(dayNumber) ? "white" : "#1f2a44",
                  "&:hover": {
                    backgroundColor: isSelected(dayNumber)
                      ? "var(--color-beergam-blue-primary)"
                      : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                {dayNumber}
              </Button>
            )
          )}
        </Box>

        {includeTime && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
            <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
              Hora
            </Typography>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "6px 10px",
                fontSize: "0.9rem",
              }}
            />
          </Box>
        )}
      </Box>
    </Popover>
  );
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
  const inputType = includeTime
    ? "datetime-local"
    : (dateType ?? "date");

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

  // Para date e datetime-local, usa popover customizado com dias (e hora opcional)
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
    const normalized = includeTime
      ? newValue.second(0).millisecond(0)
      : newValue.startOf("day");
    onChange(normalized.toISOString());
  };

  const displayValue = dayjsValue
    ? includeTime
      ? dayjsValue.format("DD/MM/YYYY HH:mm")
      : dayjsValue.format("DD/MM/YYYY")
    : placeholder || (includeTime ? "Selecione data e hora" : "Selecione a data");

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
      <DateTimePopoverPicker
        value={dayjsValue}
        onChange={handleDateChange}
        onClose={handleClose}
        anchorEl={anchorEl}
        includeTime={includeTime}
      />
    </div>
  );
}

