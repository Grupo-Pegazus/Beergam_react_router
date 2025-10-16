import { Switch } from "@mui/material";
import { useState } from "react";
import { MenuHandler } from "~/features/menu/typings";
import { UserStatus } from "~/features/user/typings/BaseUser";
import { ColabLevel, type IColab } from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import Time from "~/src/components/utils/Time";
import type { DaysOfWeek } from "~/src/components/utils/Time/typings";
import ViewAccess from "../ViewAccess";
export default function ColabInfo(colab: IColab) {
  // Criação de um useState com datas fixas para todos os dias da semana e horários pré-definidos
  const daysOfWeek = [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo",
  ];

  const [colabDates, setColabDates] = useState([
    { day: daysOfWeek[0], startTime: "08:00", endTime: "17:00", ativo: true },
    { day: daysOfWeek[1], startTime: "08:00", endTime: "17:00", ativo: true },
    { day: daysOfWeek[2], startTime: "08:00", endTime: "17:00", ativo: true },
    { day: daysOfWeek[3], startTime: "08:00", endTime: "17:00", ativo: true },
    { day: daysOfWeek[4], startTime: "08:00", endTime: "17:00", ativo: true },
    { day: daysOfWeek[5], startTime: "08:00", endTime: "12:00", ativo: true },
    { day: daysOfWeek[6], startTime: "", endTime: "", ativo: false },
  ]);

  const handleSetHorario =
    (dayName: string) =>
    (params: { ativo: boolean; inicio: string; fim: string }) => {
      setColabDates(
        colabDates.map((date) =>
          date.day === dayName
            ? {
                ...date,
                ativo: params.ativo,
                startTime: params.inicio,
                endTime: params.fim,
              }
            : date
        )
      );
    };

  return (
    <>
      <hr className="h-[1px] mb-3.5 mt-5 border-beergam-gray-light" />
      <div>
        <h3 className="text-beergam-blue-primary !font-bold uppercase mb-4">
          Editar Colaborador
        </h3>
        <div className="grid grid-cols-[1fr_1.3fr] grid-rows-1 gap-4 2xl:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col justify-between items-start gap-4">
            <div className="flex items-stretch gap-2 w-full">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="min-w-20 min-h-20 mt-2.5 cursor-pointer group relative  rounded-full group hover:bg-beergam-orange/50 object-cover object-center bg-beergam-orange flex items-center justify-center">
                  <h2 className="text-white uppercase">
                    {colab.name.charAt(0).toUpperCase()}
                  </h2>
                  <div className="flex pointer-events-none items-center justify-center absolute opacity-0 group-hover:opacity-100 bottom-3.5 right-3.5">
                    <Svg.pencil width={22} height={22} stroke="white" />
                  </div>
                </div>
                <div className="mt-2.5 flex flex-col items-center justify-center gap-2">
                  <p className="font-medium text-sm text-beergam-gray ">
                    STATUS
                  </p>
                  <Switch
                    title="Ativar/Desativar colaborador"
                    checked={colab.status === UserStatus.ACTIVE}
                    onChange={(e) => {
                      console.log(e.target.checked);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Fields.wrapper>
                  <Fields.label text="NOME" />
                  <Fields.input value={colab.name} />
                </Fields.wrapper>
                <Fields.wrapper>
                  <Fields.label text="SENHA DE ACESSO" />
                  <Fields.input value={"asdaokdokas"} type="password" />
                </Fields.wrapper>
                <div className="grid grid-cols-2 gap-2 col-span-2 align-bottom">
                  {Object.keys(ColabLevel).map((level) => (
                    <button
                      key={level}
                      className={`text-white px-4 py-2 rounded-md h-[42px] ${
                        colab.details.level === level
                          ? "bg-beergam-orange"
                          : "bg-beergam-gray-light"
                      }`}
                    >
                      <p>
                        {
                          ColabLevel[
                            level as unknown as keyof typeof ColabLevel
                          ]
                        }
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Fields.label text="HORÁRIOS DE FUNCIONAMENTO" />
            <div className="grid grid-cols-2 gap-4">
              {colabDates.map((day) => (
                <Time
                  key={day.day}
                  dia={day.day as unknown as DaysOfWeek}
                  ativo={day.ativo}
                  inicio={day.startTime}
                  fim={day.endTime}
                  setHorario={handleSetHorario(day.day)}
                />
              ))}
              <button className="bg-beergam-blue-primary text-beergam-white p-2 rounded-md hover:bg-beergam-orange flex items-center justify-center gap-2">
                <Svg.clock />
                <p>Horário Comercial</p>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Fields.wrapper>
            <Fields.label text="ACESSOS" />
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
                width: "100%",
              }}
            >
              {Object.values(MenuHandler.getMenu())
                .filter((item) => !item.denyColabAccess)
                .map((item) => (
                  <ViewAccess key={item.label} {...item} />
                ))}
            </div>
          </Fields.wrapper>
        </div>
        <button className="sticky mt-2.5 bottom-0 left-0 right-0 bg-beergam-blue-primary text-beergam-white p-2 rounded-md hover:bg-beergam-orange">
          Salvar Informações
        </button>
      </div>
    </>
  );
}
