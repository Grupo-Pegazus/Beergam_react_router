import { Popover } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { DatePickerDateRangePopover } from "./DatePickerPopover/DatePickerDateRange";
import { DatePickerFullPopover } from "./DatePickerPopover/DatePickerFull";
import { DatePickerSingleDayPopover } from "./DatePickerPopover/DatePickerSingleDay";
import { DatePickerSingleMonthPopover } from "./DatePickerPopover/DatePickerSingleMonth";
import { parseToDayjs } from "./utils";
import type {
  DatePickerProps,
  DatePickerFullValue,
  DatePickerDateRangeValue,
} from "./types";

function formatDisplayFull(value: DatePickerFullValue | null): string {
  if (!value?.start || !value?.end) return "";
  const s = parseToDayjs(value.start);
  const e = parseToDayjs(value.end);
  if (!s || !e) return "";
  return `${s.format("DD/MM/YYYY HH:mm")} - ${e.format("DD/MM/YYYY HH:mm")}`;
}

function formatDisplayDateRange(value: DatePickerDateRangeValue | null): string {
  if (!value?.start || !value?.end) return "";
  const s = parseToDayjs(value.start);
  const e = parseToDayjs(value.end);
  if (!s || !e) return "";
  return `${s.format("DD/MM/YYYY")} - ${e.format("DD/MM/YYYY")}`;
}

function formatDisplaySingleDay(value: string | null, includeTime?: boolean): string {
  if (!value) return "";
  const d = parseToDayjs(value);
  if (!d) return "";
  return includeTime
    ? d.format("DD/MM/YYYY HH:mm")
    : d.format("DD/MM/YYYY");
}

function formatDisplaySingleMonth(value: string | null): string {
  if (!value) return "";
  const d = parseToDayjs(value);
  if (!d) return "";
  return d.format("MMMM [de] YYYY");
}

export function DatePicker(props: DatePickerProps) {
  const { label, placeholder, disabled, widthType, className, defaultOpen } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (defaultOpen && buttonRef.current && !disabled) {
      setAnchorEl(buttonRef.current);
    }
  }, [defaultOpen, disabled]);

  const handleOpen = () => {
    if (!disabled) {
      setAnchorEl(buttonRef.current);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const displayValue = (() => {
    switch (props.mode) {
      case "full":
        return formatDisplayFull(props.value ?? null) || placeholder || "Selecione o período";
      case "date-range":
        return formatDisplayDateRange(props.value ?? null) || placeholder || "Selecione o período";
      case "single-day":
        return formatDisplaySingleDay(props.value ?? null, props.includeTime) ||
          placeholder ||
          (props.includeTime ? "Selecione data e hora" : "Selecione a data");
      case "single-month":
        return formatDisplaySingleMonth(props.value ?? null) || placeholder || "Selecione o mês";
    }
  })();

  const open = Boolean(anchorEl);

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {label && (
        <span className="text-sm font-semibold text-beergam-typography-secondary">
          {label}
        </span>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`
          flex min-h-[44px] min-w-[200px] items-center justify-between gap-2
          rounded-2xl border border-beergam-input-border bg-beergam-input-background
          px-4 py-2.5 text-left text-sm text-beergam-typography-primary
          transition-all duration-200
          hover:border-beergam-primary/50 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-beergam-primary/30
          disabled:cursor-not-allowed disabled:opacity-50
          ${widthType === "full" ? "w-full" : ""}
        `}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label || "Selecionar data"}
      >
        <span className="flex items-center gap-2 truncate">
          <Svg.calendar tailWindClasses="h-5 w-5 shrink-0 text-beergam-typography-secondary" />
          {displayValue}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-beergam-typography-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              marginTop: 1,
              overflow: "visible",
              border: "1px solid var(--color-beergam-input-border)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              backgroundColor: "var(--color-beergam-section-background)",
              p: 0,
            },
          },
        }}
        disableScrollLock
        transitionDuration={200}
      >
        {props.mode === "full" && (
          <DatePickerFullPopover
            value={props.value ?? null}
            onChange={props.onChange}
            onClose={handleClose}
            anchorEl={anchorEl}
          />
        )}
        {props.mode === "date-range" && (
          <DatePickerDateRangePopover
            value={props.value ?? null}
            onChange={props.onChange}
            onClose={handleClose}
            anchorEl={anchorEl}
          />
        )}
        {props.mode === "single-day" && (
          <DatePickerSingleDayPopover
            value={props.value ?? null}
            onChange={props.onChange}
            onClose={handleClose}
            anchorEl={anchorEl}
            includeTime={props.includeTime}
          />
        )}
        {props.mode === "single-month" && (
          <DatePickerSingleMonthPopover
            value={props.value ?? null}
            onChange={props.onChange}
            onClose={handleClose}
            anchorEl={anchorEl}
          />
        )}
      </Popover>
    </div>
  );
}
