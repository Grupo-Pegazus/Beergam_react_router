import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { memo, useCallback, useState } from "react";

dayjs.locale("pt-br");

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export interface DatePickerSingleMonthPopoverProps {
  value: string | null;
  onChange: (value: string) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

function DatePickerSingleMonthPopoverComponent({
  value,
  onChange,
  onClose,
}: DatePickerSingleMonthPopoverProps) {
  const parsed = value ? dayjs(value) : null;
  const [view, setView] = useState<"month" | "year">("month");
  const [selectedYear, setSelectedYear] = useState(() =>
    parsed?.year() ?? dayjs().year()
  );

  const currentYear = dayjs().year();
  const startYear = currentYear - 10;
  const endYear = currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthSelect = useCallback(
    (monthIndex: number) => {
      const d = dayjs()
        .year(selectedYear)
        .month(monthIndex)
        .startOf("month");
      onChange(d.toISOString());
      onClose();
    },
    [selectedYear, onChange, onClose]
  );

  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
    setView("month");
  }, []);

  return (
    <div
      className="date-picker-popover w-[min(320px,calc(100vw-24px))] rounded-xl border border-beergam-input-border bg-beergam-section-background p-4 shadow-xl transition-all duration-200"
      role="dialog"
      aria-label="Selecionar mês"
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setView((v) => (v === "month" ? "year" : "month"))
            }
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-beergam-typography-primary transition-colors hover:bg-white/10"
          >
            {view === "month" ? selectedYear : "Selecionar Ano"}
          </button>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() =>
                setSelectedYear((y) => (view === "year" ? y : y - 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-beergam-typography-tertiary hover:bg-white/10 hover:text-beergam-typography-primary"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedYear((y) => (view === "year" ? y : y + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-beergam-typography-tertiary hover:bg-white/10 hover:text-beergam-typography-primary"
            >
              ›
            </button>
          </div>
        </div>

        {view === "month" ? (
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected =
                parsed?.year() === selectedYear && parsed?.month() === index;
              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-white text-beergam-black"
                      : "text-beergam-typography-tertiary hover:bg-white/10 hover:text-beergam-typography-primary"
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto">
            {years.map((year) => {
              const isSelected = year === selectedYear;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-white text-beergam-black"
                      : "text-beergam-typography-tertiary hover:bg-white/10 hover:text-beergam-typography-primary"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export const DatePickerSingleMonthPopover = memo(DatePickerSingleMonthPopoverComponent);
