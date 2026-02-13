import dayjs, { type Dayjs } from "dayjs";
import { memo, useCallback, useState } from "react";
import { CalendarGrid } from "../CalendarGrid";
import { parseToDayjs, toDateString } from "../utils";
import type { DatePickerDateRangeValue } from "../types";

export interface DatePickerDateRangePopoverProps {
  value: DatePickerDateRangeValue | null;
  onChange: (value: DatePickerDateRangeValue) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const DEFAULT_START = dayjs().startOf("day");
const DEFAULT_END = dayjs().endOf("day");

function DatePickerDateRangePopoverComponent({
  value,
  onChange,
  onClose,
}: DatePickerDateRangePopoverProps) {
  const startParsed = parseToDayjs(value?.start) ?? DEFAULT_START;
  const endParsed = parseToDayjs(value?.end) ?? DEFAULT_END;

  const [viewDate, setViewDate] = useState<Dayjs>(
    startParsed.isValid() ? startParsed : dayjs()
  );
  const [tempStart, setTempStart] = useState<Dayjs>(startParsed);
  const [tempEnd, setTempEnd] = useState<Dayjs>(endParsed);
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const handleApply = useCallback(() => {
    const [s, e] =
      tempStart.isBefore(tempEnd) || tempStart.isSame(tempEnd, "day")
        ? [tempStart, tempEnd]
        : [tempEnd, tempStart];
    onChange({
      start: toDateString(s.startOf("day")),
      end: toDateString(e.endOf("day")),
    });
    onClose();
  }, [tempStart, tempEnd, onChange, onClose]);

  const handleSelectDay = useCallback(
    (dayNumber: number) => {
      const d = viewDate.date(dayNumber).startOf("day");
      if (selecting === "start") {
        setTempStart(d);
        if (tempEnd.isBefore(d)) {
          setTempEnd(d);
        }
        setSelecting("end");
      } else {
        setTempEnd(d.endOf("day"));
        setSelecting("start");
      }
    },
    [viewDate, selecting, tempEnd]
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
      className="date-picker-popover w-[min(360px,calc(100vw-24px))] rounded-xl border border-beergam-input-border bg-beergam-section-background p-4 shadow-xl transition-all duration-200"
      role="dialog"
      aria-label="Selecionar intervalo de datas"
    >
      <div className="flex flex-col gap-4">
        <CalendarGrid
          viewDate={viewDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDay={handleSelectDay}
          rangeStart={tempStart}
          rangeEnd={tempEnd}
          selectingRange={selecting}
          isRangeMode
        />

        {/* Start / End apenas datas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-beergam-typography-secondary">
              Início
            </label>
            <input
              type="date"
              value={tempStart.format("YYYY-MM-DD")}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split("-").map(Number);
                setTempStart(dayjs().year(y).month(m - 1).date(d).startOf("day"));
              }}
              className="h-9 rounded-lg border border-beergam-input-border bg-beergam-input-background px-3 py-1.5 text-sm text-beergam-typography-primary outline-none focus:border-beergam-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-beergam-typography-secondary">
              Fim
            </label>
            <input
              type="date"
              value={tempEnd.format("YYYY-MM-DD")}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split("-").map(Number);
                setTempEnd(dayjs().year(y).month(m - 1).date(d).endOf("day"));
              }}
              className="h-9 rounded-lg border border-beergam-input-border bg-beergam-input-background px-3 py-1.5 text-sm text-beergam-typography-primary outline-none focus:border-beergam-primary"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-beergam-black transition-colors hover:bg-white/90"
        >
          Aplicar
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export const DatePickerDateRangePopover = memo(DatePickerDateRangePopoverComponent);
