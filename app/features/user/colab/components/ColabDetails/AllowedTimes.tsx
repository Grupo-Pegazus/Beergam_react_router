import {
  type DayTimeAccess,
  type IAllowedTimes,
  WeekDay,
  WeekDayToPortuguese,
} from "~/features/user/typings/AllowedTimes";
import type { ColabAction } from "~/routes/perfil/typings";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Time from "~/src/components/utils/Time";
import ColabItem from "./ColabItem";
export default function AllowedTimes({
  schedule,
  action = "Visualizar",
  onScheduleChange,
}: {
  schedule: IAllowedTimes;
  action: ColabAction;
  onScheduleChange?: (day: WeekDay, scheduleData: DayTimeAccess) => void;
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

  function parseTimeString(timeString: string): Date | null {
    if (!timeString || timeString === "--:--") return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  function handleTimeChange(
    day: WeekDay,
    params: { access: boolean; start_date: string; end_date: string }
  ) {
    if (!onScheduleChange) return;

    const scheduleData: DayTimeAccess = {
      access: params.access,
      start_date: parseTimeString(params.start_date),
      end_date: parseTimeString(params.end_date),
    };

    onScheduleChange(day, scheduleData);
  }

  function handleHorarioComercial() {
    if (!onScheduleChange) return;

    (Object.values(WeekDay) as WeekDay[]).forEach((day) => {
      if (day === WeekDay.SATURDAY || day === WeekDay.SUNDAY) {
        // Não alterar sábado e domingo
        return;
      }

      const scheduleData: DayTimeAccess = {
        access: true,
        start_date: parseTimeString("08:00"),
        end_date: parseTimeString("20:00"),
      };

      onScheduleChange(day, scheduleData);
    });
  }
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      {(Object.values(WeekDay) as WeekDay[]).map((day) => {
        const item = schedule[day];
        if (action === "Visualizar") {
          return (
            <ColabItem key={day} active={item.access}>
              <span className="text-sm font-medium">
                {WeekDayToPortuguese[day]}
              </span>
              <div className="text-sm">
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
        } else if (action === "Editar" || action === "Criar") {
          return (
            <Time
              key={day}
              dia={WeekDayToPortuguese[day]}
              access={item.access}
              start_date={formatTime(item.start_date)}
              end_date={formatTime(item.end_date)}
              setHorario={(params) => handleTimeChange(day, params)}
            />
          );
        }
      })}
      {action !== "Visualizar" && (
        <BeergamButton
          title="Horário Comercial"
          mainColor="beergam-blue-primary"
          animationStyle="slider"
          onClick={handleHorarioComercial}
          icon="clock"
        />
      )}
    </div>
  );
}
