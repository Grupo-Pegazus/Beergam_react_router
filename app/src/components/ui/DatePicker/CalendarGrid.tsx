import dayjs, { type Dayjs } from "dayjs";
import { memo, useCallback, useMemo } from "react";

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export interface CalendarGridProps {
  viewDate: Dayjs;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (dayNumber: number) => void;
  /** Dia único selecionado (para single-day) */
  selectedDate?: Dayjs | null;
  /** Range selecionado (para full, date-range) */
  rangeStart?: Dayjs | null;
  rangeEnd?: Dayjs | null;
  /** Se está selecionando o início ou fim do range */
  selectingRange?: "start" | "end";
  /** Dia atualmente em hover (para preview do range) */
  hoverDate?: Dayjs | null;
  /** Se o calendário está em modo range (mostra highlight entre datas) */
  isRangeMode?: boolean;
  /** Dia atual do sistema */
  today?: Dayjs;
  disabled?: boolean;
}

function getDaysArray(viewDate: Dayjs): (number | null)[] {
  const startOfMonth = viewDate.startOf("month");
  const daysInMonth = viewDate.daysInMonth();
  const startWeekday = startOfMonth.day();

  return Array.from({ length: startWeekday + daysInMonth }, (_, idx) => {
    const dayNum = idx - startWeekday + 1;
    return dayNum > 0 ? dayNum : null;
  });
}

function isInRange(
  day: Dayjs,
  start: Dayjs | null | undefined,
  end: Dayjs | null | undefined,
  hover?: Dayjs | null
): boolean {
  if (!start) return false;
  const effectiveEnd = end ?? hover;
  if (!effectiveEnd) return false;
  const [min, max] = start.isBefore(effectiveEnd)
    ? [start, effectiveEnd]
    : [effectiveEnd, start];
  return (
    (day.isAfter(min) && day.isBefore(max)) ||
    day.isSame(min, "day") ||
    day.isSame(max, "day")
  );
}

function CalendarGridComponent({
  viewDate,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  selectedDate,
  rangeStart,
  rangeEnd,
  selectingRange,
  hoverDate,
  isRangeMode = false,
  today = dayjs(),
  disabled = false,
}: CalendarGridProps) {
  const daysArray = useMemo(() => getDaysArray(viewDate), [viewDate]);

  const isSelected = useCallback(
    (dayNumber: number) => {
      const d = viewDate.date(dayNumber);
      if (selectedDate) {
        return d.isSame(selectedDate, "day");
      }
      return false;
    },
    [viewDate, selectedDate]
  );

  const isRangeStart = useCallback(
    (dayNumber: number) => {
      if (!rangeStart) return false;
      const d = viewDate.date(dayNumber);
      return d.isSame(rangeStart, "day");
    },
    [viewDate, rangeStart]
  );

  const isRangeEnd = useCallback(
    (dayNumber: number) => {
      const end = rangeEnd ?? (selectingRange === "end" ? hoverDate : null);
      if (!end) return false;
      const d = viewDate.date(dayNumber);
      return d.isSame(end, "day");
    },
    [viewDate, rangeEnd, selectingRange, hoverDate]
  );

  const isInRangeDay = useCallback(
    (dayNumber: number) => {
      if (!isRangeMode) return false;
      const d = viewDate.date(dayNumber);
      return isInRange(
        d,
        rangeStart,
        rangeEnd ?? (selectingRange === "end" ? hoverDate : null),
        hoverDate
      );
    },
    [viewDate, isRangeMode, rangeStart, rangeEnd, selectingRange, hoverDate]
  );

  const isToday = useCallback(
    (dayNumber: number) => {
      if (!today) return false;
      const d = viewDate.date(dayNumber);
      return d.isSame(today, "day");
    },
    [viewDate, today]
  );

  const monthLabel = viewDate.format("MMMM YYYY");

  return (
    <div className="flex flex-col gap-3">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          disabled={disabled}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-beergam-typography-tertiary transition-colors hover:bg-beergam-section-background hover:text-beergam-typography-primary disabled:opacity-40"
          aria-label="Mês anterior"
        >
          <span className="text-lg font-bold">‹</span>
        </button>
        <span
          className="text-sm font-semibold capitalize text-beergam-typography-primary"
          style={{ textTransform: "capitalize" }}
        >
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={disabled}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-beergam-typography-tertiary transition-colors hover:bg-beergam-section-background hover:text-beergam-typography-primary disabled:opacity-40"
          aria-label="Próximo mês"
        >
          <span className="text-lg font-bold">›</span>
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-beergam-typography-secondary">
        {WEEK_DAYS.map((d, idx) => (
          <div key={`${d}-${idx}`}>{d}</div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysArray.map((dayNumber, idx) =>
          dayNumber === null ? (
            <div key={`empty-${idx}`} />
          ) : (
            <DayCell
              key={dayNumber}
              dayNumber={dayNumber}
              viewDate={viewDate}
              onClick={() => onSelectDay(dayNumber)}
              disabled={disabled}
              isSelected={isSelected(dayNumber)}
              isRangeStart={isRangeStart(dayNumber)}
              isRangeEnd={isRangeEnd(dayNumber)}
              isInRange={isInRangeDay(dayNumber)}
              isToday={isToday(dayNumber)}
            />
          )
        )}
      </div>
    </div>
  );
}

interface DayCellProps {
  dayNumber: number;
  viewDate: Dayjs;
  onClick: () => void;
  disabled: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isToday: boolean;
}

const DayCell = memo(function DayCell({
  dayNumber,
  viewDate,
  onClick,
  disabled,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isToday,
}: DayCellProps) {
  const isEdge = isRangeStart || isRangeEnd;
  const hasHighlight = isSelected || isEdge;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative h-9 min-w-0 rounded-lg text-sm font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-40
        ${hasHighlight ? "bg-beergam-primary text-beergam-white ring-2 ring-beergam-primary" : ""}
        ${isInRange && !hasHighlight ? "bg-beergam-primary/25 text-beergam-typography-primary" : ""}
        ${!hasHighlight && !isInRange ? "text-beergam-typography-tertiary hover:bg-beergam-primary/15" : ""}
        ${isToday && !hasHighlight ? "ring-1 ring-beergam-primary/40" : ""}
      `}
    >
      {dayNumber}
    </button>
  );
});

export const CalendarGrid = memo(CalendarGridComponent);
