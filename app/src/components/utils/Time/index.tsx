import { Fade } from "@mui/material";
import React from "react";
import ColabItem from "~/features/user/colab/components/ColabDetails/ColabItem";
import LockAnimated from "~/src/assets/LockAnimated";
interface TimeProps {
  dia: string;
  access: boolean;
  start_date: string;
  end_date: string;
  startError?: string;
  endError?: string;
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
  startError,
  endError,
  setHorario,
}: TimeProps) {
  const clickDia = () => {
    setHorario({ access: !access, start_date, end_date });
  };
  const setStartDate = (params: React.ChangeEvent<HTMLInputElement>) => {
    setHorario({ access, start_date: params.target.value, end_date });
    if (end_date && end_date < params.target.value) {
      const [h, m] = params.target.value.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m + 1, 0, 0);
      const newEndDate = date.toTimeString().slice(0, 5);
      setHorario({
        access,
        start_date: params.target.value,
        end_date: newEndDate,
      });
    }
  };
  const setEndDate = (params: React.ChangeEvent<HTMLInputElement>) => {
    setHorario({ access, start_date, end_date: params.target.value });
    if (start_date && start_date > params.target.value) {
      const [h, m] = params.target.value.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m - 1, 0, 0);
      const newStartDate = date.toTimeString().slice(0, 5);
      setHorario({
        access,
        start_date: newStartDate,
        end_date: params.target.value,
      });
    }
  };
  return (
    <ColabItem active={access} onClick={clickDia} canInteract={true}>
      <LockAnimated
        tailwindClasses={`absolute top-[50%] translate-y-[-50%] right-0 ${access ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        open={access}
      />
      <div
        className="w-28 text-left font-semibold cursor-pointer text-beergam-typography-secondary bg-transparent"
        onClick={clickDia}
      >
        <p>{dia}</p>
      </div>

      <Fade onClick={(e) => e.stopPropagation()} in={access} timeout={200}>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={start_date || ""}
            onChange={setStartDate}
            disabled={!access}
            title={startError}
            aria-invalid={!!startError}
            className={`outline-none rounded border px-2 py-1 text-sm ${
              startError ? "border-red-500" : "border-beergam-gray-light"
            } ${access ? "opacity-100" : "opacity-0"} ${
              !access ? "pointer-events-none" : ""
            }`}
          />

          <input
            type="time"
            value={end_date || ""}
            onChange={setEndDate}
            disabled={!access}
            title={endError}
            aria-invalid={!!endError}
            className={`outline-none rounded border px-2 py-1 text-sm ${
              endError ? "border-red-500" : "border-beergam-gray-light"
            } ${access ? "opacity-100" : "opacity-0"} ${
              !access ? "pointer-events-none" : ""
            }`}
          />
        </div>
      </Fade>
    </ColabItem>
  );
}

export default Time;
