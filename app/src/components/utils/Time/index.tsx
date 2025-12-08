import React from "react";
import ColabItem from "~/features/user/colab/components/ColabDetails/ColabItem";
import LockAnimated from "~/src/assets/LockAnimated";
import toast from "~/src/utils/toast";
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
      toast.error(
        "O horário de fim não pode ser menor que o horário de início"
      );

      // Cria uma nova data baseada no start_date e adiciona um minuto
      if (start_date) {
        const [h, m] = start_date.split(":").map(Number);
        const date = new Date();
        date.setHours(h, m + 1, 0, 0); // adiciona 1 minuto
        const newEndDate = date.toTimeString().slice(0, 5); // formato HH:mm
        setHorario({ access, start_date, end_date: newEndDate });
      } else {
        setHorario({ access, start_date, end_date: "" });
      }
      return;
    }

    setHorario({ access, start_date, end_date: novoFim });
  };
  return (
    <ColabItem active={access} onClick={clickDia} canInteract={true}>
      <LockAnimated
        tailwindClasses={`absolute top-[50%] translate-y-[-50%] right-0 ${access ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        open={access}
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
    </ColabItem>
  );
}

export default Time;
