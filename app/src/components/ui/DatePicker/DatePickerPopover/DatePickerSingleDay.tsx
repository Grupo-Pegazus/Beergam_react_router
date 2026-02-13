import dayjs, { type Dayjs } from "dayjs";
import { memo, useCallback, useState, useEffect } from "react";
import { CalendarGrid } from "../CalendarGrid";
import { TimeInput } from "../TimeInput";
import { parseToDayjs, toDateString, toDateTimeString } from "../utils";

export interface DatePickerSingleDayPopoverProps {
  value: string | null;
  onChange: (value: string) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  includeTime?: boolean;
}

function DatePickerSingleDayPopoverComponent({
  value,
  onChange,
  onClose,
  includeTime = false,
}: DatePickerSingleDayPopoverProps) {
  const parsed = parseToDayjs(value) ?? dayjs();
  const [viewDate, setViewDate] = useState<Dayjs>(parsed.isValid() ? parsed : dayjs());
  const [tempValue, setTempValue] = useState<Dayjs>(parsed);

  useEffect(() => {
    const p = parseToDayjs(value) ?? dayjs();
    if (p.isValid()) {
      setTempValue(p);
      setViewDate(p);
    }
  }, [value]);

  const handleSelectDay = useCallback(
    (dayNumber: number) => {
      const d = viewDate.date(dayNumber);
      const withTime = includeTime
        ? d.hour(tempValue.hour()).minute(tempValue.minute())
        : d.startOf("day");
      setTempValue(withTime);
      const serialized = includeTime
        ? toDateTimeString(withTime)
        : toDateString(withTime);
      onChange(serialized);
      onClose();
    },
    [viewDate, tempValue, includeTime, onChange, onClose]
  );

  const handleTimeChange = useCallback(
    (d: Dayjs) => {
      const updated = tempValue.hour(d.hour()).minute(d.minute()).second(0).millisecond(0);
      setTempValue(updated);
      const serialized = includeTime ? toDateTimeString(updated) : toDateString(updated);
      onChange(serialized);
    },
    [tempValue, includeTime, onChange]
  );

  const handlePrevMonth = useCallback(
    () => setViewDate((prev) => prev.subtract(1, "month")),
    []
  );
  const handleNextMonth = useCallback(
    () => setViewDate((prev) => prev.add(1, "month")),
    []
  );

  return (
    <div
      className="date-picker-popover w-[min(320px,calc(100vw-24px))] rounded-xl border border-beergam-input-border bg-beergam-section-background p-4 shadow-xl transition-all duration-200"
      role="dialog"
      aria-label="Selecionar data"
    >
      <div className="flex flex-col gap-4">
        <CalendarGrid
          viewDate={viewDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDay={handleSelectDay}
          selectedDate={tempValue}
        />

        {includeTime && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-beergam-typography-secondary">
              Hora
            </label>
            <TimeInput value={tempValue} onChange={handleTimeChange} />
          </div>
        )}
      </div>
    </div>
  );
}

export const DatePickerSingleDayPopover = memo(DatePickerSingleDayPopoverComponent);
