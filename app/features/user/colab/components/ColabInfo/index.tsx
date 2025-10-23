import { Paper, Switch } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { z } from "zod";
import { UserStatus } from "~/features/user/typings/BaseUser";
import {
  ColabLevel,
  ColabSchema,
  type IColab,
} from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import Time from "~/src/components/utils/Time";
import type { DaysOfWeek } from "~/src/components/utils/Time/typings";
import ViewAccess from "../ViewAccess";
export default function ColabInfo(colab: IColab | null) {
  const initialColabState = colab;
  const [editedColab, setEditedColab] = useReducer(
    (state: IColab | null, action: Partial<IColab>) => {
      console.log(action);
      if (!state) return null;
      return { ...state, ...action } as IColab;
    },
    initialColabState
  );
  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
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
  useEffect(() => {
    setEditedColab({ ...colab });
  }, [colab]);
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
  const editedColabValidation = ColabSchema.safeParse(editedColab);
  const editedColabError = editedColabValidation.error
    ? z.treeifyError(editedColabValidation.error)
    : null;
  if (!editedColab)
    return (
      <div>
        <h1>Nenhum colaborador encontrado</h1>
        <p>Colab: {JSON.stringify(colab)}</p>
        <p>Edited Colab: {JSON.stringify(editedColab)}</p>
        <p>Initial Colab: {JSON.stringify(initialColabState)}</p>
      </div>
    );
  return (
    <>
      <hr className="h-[1px] mb-3.5 mt-5 border-beergam-gray-light" />
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-beergam-blue-primary !font-bold uppercase mb-4">
            Editar Colaborador
          </h3>
          <button className="opacity-90 hover:opacity-100">
            <Svg.trash
              stroke={"var(--color-beergam-red)"}
              width={28}
              height={28}
            />
          </button>
        </div>
        <div className="grid grid-cols-1 grid-rows-1 gap-4 2xl:grid-cols-[1fr_1.3fr]">
          <Paper className="grid grid-rows-2 gap-4 border-1 border-beergam-gray-light rounded-md p-4">
            <div className="grid grid-cols-[80px_1fr] gap-4 w-full">
              <div className="w-full h-full max-h-[80px] bg-beergam-orange rounded-full flex items-center justify-center">
                <h2 className="text-white uppercase">
                  {editedColab.name.charAt(0).toUpperCase()}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Fields.wrapper>
                  <Fields.label text="NOME" />
                  <Fields.input
                    onChange={(e) => setEditedColab({ name: e.target.value })}
                    value={editedColab.name}
                    dataTooltipId="name-input"
                    error={editedColabError?.properties?.name?.errors?.[0]}
                  />
                </Fields.wrapper>
                <Fields.wrapper>
                  <Fields.label text="SENHA DE ACESSO" />
                  <Fields.input value={"asdaokdokas"} type="password" />
                </Fields.wrapper>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex justify-end items-end gap-2 w-[80px]">
                <div className="flex flex-col justify-between gap-2 w-full min-h-[68px]">
                  <Fields.label
                    text="STATUS"
                    hint="Ativar/Desativar colaborador do sistema."
                  />
                  <Switch
                    title="Ativar/Desativar colaborador"
                    checked={editedColab.status == UserStatus.ACTIVE}
                    onChange={(e) => {
                      setEditedColab({
                        status: e.target.checked
                          ? UserStatus.ACTIVE
                          : UserStatus.INACTIVE,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end items-end gap-2 w-full">
                <div className="flex flex-col justify-between gap-2 w-full min-h-[68px]">
                  <Fields.label
                    text="NÍVEL"
                    hint="Nível de acesso do colaborador ao sistema."
                  />
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {Object.values(ColabLevel).map((level) => (
                      <button
                        key={level}
                        className={`text-white p-2 rounded-md hover:bg-beergam-orange ${level == editedColab.details.level ? "bg-beergam-orange" : "bg-beergam-blue-primary"}`}
                        onClick={() =>
                          setEditedColab({
                            details: {
                              level: level as ColabLevel,
                            },
                          })
                        }
                      >
                        <p>{level}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          <Paper className="flex flex-col border-1 border-beergam-gray-light rounded-md p-4">
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
          </Paper>
        </div>
        <Paper className="grid grid-cols-1 gap-4 p-4 mt-4">
          <Fields.wrapper>
            <Fields.label text="ACESSOS" />
            <ViewAccess />
          </Fields.wrapper>
        </Paper>
        <button className="sticky mt-2.5 bottom-0 left-0 right-0 bg-beergam-blue-primary text-beergam-white p-2 rounded-md hover:bg-beergam-orange">
          Salvar Informações
        </button>
      </div>
    </>
  );
}
