import {
  type IAllowedTimes,
  WeekDay,
  WeekDayToPortuguese,
} from "~/features/user/typings/AllowedTimes";
import ColabItem from "./ColabItem";

export default function AllowedTimes({
  schedule,
}: {
  schedule: IAllowedTimes;
}) {
  function formatTime(value: unknown): string {
    if (!value) return "--:--";
    if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) return value;
    const date: Date =
      typeof value === "string" ? new Date(value) : (value as Date);
    if (date instanceof Date && !isNaN(date.getTime())) {
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }
    return "--:--";
  }
  return (
    <div className="grid grid-cols-4 gap-4">
      {(Object.values(WeekDay) as WeekDay[]).map((day) => {
        const item = schedule[day];
        return (
          <ColabItem key={day} active={item.access}>
            <span className="text-sm font-medium">
              {WeekDayToPortuguese[day]}
            </span>
            <div className="text-sm">
              {/* {item.access ? (
                <span>
                  {formatTime(item.start_date)} <span className="mx-1">—</span>{" "}
                  {formatTime(item.end_date)}
                </span>
              ) : (
                <span className="opacity-60">Sem acesso</span>
              )} */}
              <span className="text-xs font-semibold">
                {item.access
                  ? formatTime(item.start_date) +
                    " - " +
                    formatTime(item.end_date)
                  : "Sem acesso"}
              </span>
            </div>
          </ColabItem>
        );
      })}
    </div>
  );
}
