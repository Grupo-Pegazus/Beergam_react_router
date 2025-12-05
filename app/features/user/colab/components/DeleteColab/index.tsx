import { Fade, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { type IColab } from "../../../typings/Colab";
import ColabPhoto from "../ColabPhoto";
type DeleteColabProps = {
  colab: IColab | null;
};

export default function DeleteColab({ colab }: DeleteColabProps) {
  const [fadeOpen, setFadeOpen] = useState<boolean>(false);
  return (
    <>
      <h3>Tem certeza que deseja excluir o colaborador?</h3>
      <p>
        O{" "}
        <button
          onMouseEnter={() => setFadeOpen(true)}
          onMouseLeave={() => setFadeOpen(false)}
          className="relative"
        >
          <span className="font-bold underline">colaborador</span>
          <Fade in={fadeOpen} timeout={500} className="absolute -top-20 left-0">
            <Paper>
              <div className="flex gap-2 items-center text-nowrap!">
                <ColabPhoto
                  photo_id={colab?.details.photo_id || null}
                  name={colab?.name || ""}
                  masterPin={colab?.master_pin || null}
                />
                <p>{colab?.name}</p>
                <p>
                  <span className="font-bold">PIN:</span> {colab?.pin}
                </p>
                <p>
                  <span className="font-bold">Registrado em:</span>{" "}
                  {dayjs(colab?.created_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </Paper>
          </Fade>
        </button>{" "}
        será removido da lista de colaboradores e não será mais possível acessar
        o sistema.
      </p>
    </>
  );
}
