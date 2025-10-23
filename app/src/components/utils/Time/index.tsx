import React from "react";
import Swal from "sweetalert2";
import LockAnimated from "~/src/assets/LockAnimated";
import type { DaysOfWeek } from "./typings";
interface TimeProps {
  dia: DaysOfWeek;
  ativo: boolean;
  inicio: string;
  fim: string;
  style?: React.CSSProperties;
  setHorario: (params: { ativo: boolean; inicio: string; fim: string }) => void;
}

function Time({ dia, ativo, inicio, fim, setHorario, style }: TimeProps) {
  const clickDia = () => {
    setHorario({ ativo: !ativo, inicio, fim });
  };

  const aviso = (params: React.ChangeEvent<HTMLInputElement>) => {
    const novoFim = params.target.value;

    if (inicio && novoFim && novoFim < inicio) {
      Swal.fire({
        icon: "warning",
        title: "Horário inválido",
        text: "O horário de fim não pode ser menor que o horário de início",
      });

      setHorario({ ativo, inicio, fim: "" });
      return;
    }

    setHorario({ ativo, inicio, fim: novoFim });
  };
  return (
    <div
      className={`flex items-center justify-between relative gap-2 py-2 border-b border-gray-300`}
      style={style}
    >
      <LockAnimated
        tailwindClasses={`absolute top-[50%] translate-y-[-50%] right-0 ${ativo ? "opacity-0" : "opacity-100"}`}
        open={ativo}
        size="sm"
      />
      <button
        className="w-28 text-left font-semibold cursor-pointer text-gray-500 bg-transparent"
        onClick={clickDia}
      >
        <p>{dia}</p>
      </button>

      <div className="flex items-center gap-2">
        <input
          type="time"
          value={inicio}
          onChange={(e) => setHorario({ ativo, inicio: e.target.value, fim })}
          disabled={!ativo}
          className={`outline-none ${ativo ? "opacity-100" : "opacity-0"}`}
        />

        <input
          type="time"
          value={fim}
          onChange={aviso}
          disabled={!ativo}
          className={`outline-none ${ativo ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}

export default Time;
