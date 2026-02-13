import dayjs, { type Dayjs } from "dayjs";
import { memo, useCallback, useState } from "react";
import { CalendarGrid } from "../CalendarGrid";
import { TimeInput } from "../TimeInput";
import {
  parseToDayjs,
  toDateTimeString,
  toISOString,
  getLocalTimezone,
  formatTimezoneShort,
} from "../utils";
import type { DatePickerFullValue } from "../types";

export interface DatePickerFullPopoverProps {
  value: DatePickerFullValue | null;
  onChange: (value: DatePickerFullValue) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const DEFAULT_START = dayjs().startOf("day");
const DEFAULT_END = dayjs().endOf("day");

function DatePickerFullPopoverComponent({
  value,
  onChange,
  onClose,
  anchorEl,
}: DatePickerFullPopoverProps) {
  const startParsed = parseToDayjs(value?.start) ?? DEFAULT_START;
  const endParsed = parseToDayjs(value?.end) ?? DEFAULT_END;

  const [viewDate, setViewDate] = useState<Dayjs>(
    startParsed.isValid() ? startParsed : dayjs()
  );
  const [tempStart, setTempStart] = useState<Dayjs>(startParsed);
  const [tempEnd, setTempEnd] = useState<Dayjs>(endParsed);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);

  const handleApply = useCallback(() => {
    const [s, e] =
      tempStart.isBefore(tempEnd) || tempStart.isSame(tempEnd, "day")
        ? [tempStart, tempEnd]
        : [tempEnd, tempStart];
    onChange({
      start: toISOString(s),
      end: toISOString(e),
    });
    onClose();
  }, [tempStart, tempEnd, onChange, onClose]);

  const handleSelectDay = useCallback(
    (dayNumber: number) => {
      const d = viewDate.date(dayNumber);
      if (selecting === "start") {
        const newStart = d
          .hour(tempStart.hour())
          .minute(tempStart.minute())
          .second(0)
          .millisecond(0);
        setTempStart(newStart);
        if (tempEnd.isBefore(newStart) || tempEnd.isSame(newStart, "day")) {
          setTempEnd(newStart.endOf("day"));
        }
        setSelecting("end");
      } else {
        const newEnd = d
          .hour(tempEnd.hour())
          .minute(tempEnd.minute())
          .second(59)
          .millisecond(999);
        setTempEnd(newEnd);
        setSelecting("start");
      }
      setHoverDate(null);
    },
    [viewDate, selecting, tempStart, tempEnd]
  );

  const handlePrevMonth = useCallback(
    () => setViewDate((prev) => prev.subtract(1, "month")),
    []
  );
  const handleNextMonth = useCallback(
    () => setViewDate((prev) => prev.add(1, "month")),
    []
  );

  const timezone = getLocalTimezone();

  return (
    <div
      className="date-picker-popover w-[min(360px,calc(100vw-24px))] rounded-xl border border-beergam-input-border bg-beergam-section-background p-4 shadow-xl transition-all duration-200"
      role="dialog"
      aria-label="Selecionar intervalo de data e hora"
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
          hoverDate={hoverDate}
          isRangeMode
        />

        {/* Start / End com data e hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-beergam-typography-secondary">
              Início
            </label>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <input
                type="date"
                value={tempStart.format("YYYY-MM-DD")}
                onChange={(e) => {
                  const [y, m, d] = e.target.value.split("-").map(Number);
                  setTempStart(
                    dayjs(tempStart)
                      .year(y)
                      .month(m - 1)
                      .date(d)
                      .hour(tempStart.hour())
                      .minute(tempStart.minute())
                  );
                }}
                className="h-9 flex-1 rounded-lg border border-beergam-input-border bg-beergam-input-background px-3 py-1.5 text-sm text-beergam-typography-primary outline-none focus:border-beergam-primary"
              />
              <TimeInput
                value={tempStart}
                onChange={(d) =>
                  setTempStart(
                    tempStart
                      .hour(d.hour())
                      .minute(d.minute())
                      .second(0)
                      .millisecond(0)
                  )
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-beergam-typography-secondary">
              Fim
            </label>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <input
                type="date"
                value={tempEnd.format("YYYY-MM-DD")}
                onChange={(e) => {
                  const [y, m, d] = e.target.value.split("-").map(Number);
                  setTempEnd(
                    dayjs(tempEnd)
                      .year(y)
                      .month(m - 1)
                      .date(d)
                      .hour(tempEnd.hour())
                      .minute(tempEnd.minute())
                  );
                }}
                className="h-9 flex-1 rounded-lg border border-beergam-input-border bg-beergam-input-background px-3 py-1.5 text-sm text-beergam-typography-primary outline-none focus:border-beergam-primary"
              />
              <TimeInput
                value={tempEnd}
                onChange={(d) =>
                  setTempEnd(
                    tempEnd
                      .hour(d.hour())
                      .minute(d.minute())
                      .second(59)
                      .millisecond(999)
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Botão Apply */}
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

        {/* Timezone */}
        <div className="flex items-center gap-2 text-xs text-beergam-typography-secondary">
          <span>Fuso: {formatTimezoneShort(timezone)}</span>
        </div>
      </div>
    </div>
  );
}

export const DatePickerFullPopover = memo(DatePickerFullPopoverComponent);
