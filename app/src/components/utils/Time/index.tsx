import React from "react";
import toast from "~/src/utils/toast";
import LockAnimated from "~/src/assets/LockAnimated";
interface TimeProps {
  dia: string;
  access: boolean;
  start_date: string;
  end_date: string;
  style?: React.CSSProperties;
  setHorario: (params: {
    access: boolean;
    start_date: string;
    end_date: string;
  }) => void;
}

function Time({
  dia,
  access,
  start_date,
  end_date,
  setHorario,
  style,
}: TimeProps) {
  const clickDia = () => {
    setHorario({ access: !access, start_date, end_date });
  };

  const aviso = (params: React.ChangeEvent<HTMLInputElement>) => {
    const novoFim = params.target.value;

    if (start_date && end_date && end_date < start_date) {
      toast.error("O horário de fim não pode ser menor que o horário de início");

      setHorario({ access, start_date, end_date: "" });
      return;
    }

    setHorario({ access, start_date, end_date: novoFim });
  };
  return (
    <div
      className={`flex items-center justify-between relative gap-2 py-2 border-b border-gray-300`}
      style={style}
    >
      <LockAnimated
        tailwindClasses={`absolute top-[50%] translate-y-[-50%] right-0 ${access ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        open={access}
        size="sm"
      />
      <button
        className="w-28 text-left font-semibold cursor-pointer text-gray-500 bg-transparent"
        onClick={clickDia}
      >
        <p>{dia}</p>
      </button>

      <div className="flex items-center gap-2 relative z-10">
        <input
          type="time"
          value={start_date || ""}
          onChange={(e) =>
            setHorario({ access, start_date: e.target.value, end_date })
          }
          disabled={!access}
          className={`outline-none ${access ? "opacity-100" : "opacity-0"} ${!access ? "pointer-events-none" : ""}`}
        />

        <input
          type="time"
          value={end_date || ""}
          onChange={aviso}
          disabled={!access}
          className={`outline-none ${access ? "opacity-100" : "opacity-0"} ${!access ? "pointer-events-none" : ""}`}
        />
      </div>
    </div>
  );
}

export default Time;
