import type { Dayjs } from "dayjs";
import { memo } from "react";

export interface TimeInputProps {
  value: Dayjs;
  onChange: (d: Dayjs) => void;
  disabled?: boolean;
}

function formatTime(d: Dayjs): string {
  return d.format("HH:mm");
}

function TimeInputComponent({ value, onChange, disabled }: TimeInputProps) {
  const timeStr = formatTime(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const [h, m] = v.split(":").map((n) => parseInt(n, 10) || 0);
    onChange(value.hour(h).minute(m).second(0).millisecond(0));
  };

  return (
    <input
      type="time"
      value={timeStr}
      onChange={handleChange}
      disabled={disabled}
      className="h-9 w-full rounded-lg border border-beergam-input-border bg-beergam-input-background px-3 py-1.5 text-sm text-beergam-typography-primary outline-none transition-colors focus:border-beergam-primary focus:ring-1 focus:ring-beergam-primary disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

export const TimeInput = memo(TimeInputComponent);
