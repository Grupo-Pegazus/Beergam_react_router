import { Paper } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
  MenuConfig,
  type MenuKeys,
  type MenuState,
} from "~/features/menu/typings";
import {
  WeekDay,
  WeekDayToPortuguese,
  type IAllowedTimes,
} from "~/features/user/typings/AllowedTimes";
import { FormatUserStatus, UserStatus } from "~/features/user/typings/BaseUser";
import { ColabLevel, type IColab } from "~/features/user/typings/Colab";
import { FormatColabLevel } from "~/features/user/utils";
import ActivityHistory, { type ActivityItem } from "./ActivityHistory";
import ColabStats from "./ColabStats";

type ColabDetailsProps = {
  colab: IColab | null;
};

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

export default function ColabDetails({ colab }: ColabDetailsProps) {
  if (!colab) return <div>Nenhum colaborador encontrado</div>;
  const allowedViews: MenuState | undefined = colab.details.allowed_views;
  const schedule = colab.details.allowed_times as IAllowedTimes;

  // Mock de histórico de atividades
  const activityMock: ActivityItem[] = [
    {
      id: 1,
      timestamp: new Date(),
      title: "Colaborador entrou",
      description: `${colab.name} entrou no sistema`,
      status: "success",
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      title: "Página acessada",
      description: "Acessou Vendas",
      status: "info",
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      title: "Colaborador saiu",
      description: `${colab.name} saiu do sistema`,
      status: "warning",
    },
  ];

  const accessList = useMemo(() => {
    const keys = Object.keys(MenuConfig) as MenuKeys[];
    return keys.map((key) => ({
      key,
      label: MenuConfig[key].label,
      access: allowedViews?.[key]?.access ?? false,
    }));
  }, [allowedViews]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Paper className="flex flex-col gap-4 border-1 border-beergam-gray-light rounded-md p-4">
        <div className="w-full">
          <div className="flex flex-wrap items-baseline gap-6 text-beergam-blue-primary">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-beergam-gray">NOME</label>
              <span className="text-sm font-medium">{colab.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-beergam-gray">STATUS</label>
              <span className="text-sm font-medium">
                {FormatUserStatus(colab.status as UserStatus) ===
                UserStatus.ACTIVE
                  ? "Ativo"
                  : "Inativo"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-beergam-gray">NÍVEL</label>

              <span key={colab.details.level} className="text-sm font-medium">
                {FormatColabLevel(colab.details.level as unknown as ColabLevel)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-beergam-gray">
                DATA DE REGISTRO
              </label>
              <span className="text-sm font-medium">
                {dayjs(colab.created_at).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-beergam-gray mb-2">
            HORÁRIOS DE FUNCIONAMENTO
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.values(WeekDay) as WeekDay[]).map((day) => {
              const item = schedule[day];
              return (
                <div
                  key={day}
                  className="flex items-center justify-start gap-3 border border-beergam-gray-light rounded-md px-3 py-2"
                >
                  <span className="text-sm font-medium">
                    {WeekDayToPortuguese[day]}
                  </span>
                  <div className="text-sm">
                    {item.access ? (
                      <span>
                        {formatTime(item.start_date)}{" "}
                        <span className="mx-1">—</span>{" "}
                        {formatTime(item.end_date)}
                      </span>
                    ) : (
                      <span className="opacity-60">Sem acesso</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Paper>

      <Paper className="grid grid-cols-1 gap-4 p-4">
        <span className="text-xs text-beergam-gray">ACESSOS</span>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {accessList.map((v) => (
            <div
              key={v.key}
              className={`border rounded-md px-3 py-2 text-sm flex items-center justify-between ${
                v.access
                  ? "border-beergam-blue-primary text-beergam-blue-primary"
                  : "border-beergam-gray-light opacity-70"
              }`}
            >
              <span>{v.label}</span>
              <span className="text-xs font-semibold">
                {v.access ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
        </div>
      </Paper>
      {import.meta.env.PROD ? null : (
        <div className="grid grid-cols-[1fr_2fr] gap-4 max-h-[450px]">
          <ActivityHistory items={activityMock} />
          <ColabStats colab={colab} />
        </div>
      )}
    </div>
  );
}
