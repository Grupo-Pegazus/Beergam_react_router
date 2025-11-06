// import ColabCard from "~/features/user/colab/components/ColabCard";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import ColabInfo from "~/features/user/colab/components/ColabInfo";
import ColabTable from "~/features/user/colab/components/ColabTable";
import { updateColabs } from "~/features/user/redux";
import { userService } from "~/features/user/service";
import { getDefaultColab, type IColab } from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs/_index";
import type { ColabAction } from "../../typings";

export default function Colaboradores({ colabs }: { colabs: IColab[] | [] }) {
  const dispatch = useDispatch();
  const availableActions = {
    Editar: { icon: <Svg.pencil width={20} height={20} /> },
    Excluir: { icon: <Svg.trash width={20} height={20} /> },
    Visualizar: { icon: <Svg.eye width={20} height={20} /> },
    Criar: { icon: <Svg.plus_circle width={20} height={20} /> },
  };
  const initialColabState = {
    colab: null as IColab | null,
    action: null as ColabAction | null,
  };
  const [currentColab, setCurrentColab] = useReducer(
    (state: typeof initialColabState, action: typeof initialColabState) => {
      console.log("action", action);
      console.log("state", state);
      switch (action.action) {
        case "Editar":
          return { ...state, ...action };
        case "Excluir":
          if (state.colab?.pin === action.colab?.pin) {
            return { ...state, ...action, colab: null };
          } else {
            return { ...state };
          }
        case "Criar":
          return { ...state, ...action, colab: getDefaultColab() };
        case "Visualizar":
          return { ...state, ...action };
        default:
          return state;
      }
    },
    initialColabState
  );
  const { data } = useQuery({
    queryKey: ["getColabList"],
    queryFn: () => userService.getColabs(),
  });
  useEffect(() => {
    if (data?.success) {
      dispatch(updateColabs(data.data as Record<string, IColab>));
    }
  }, [data]);
  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p>Quantidade de colaboradores registrados: {colabs.length}</p>
        <button
          onClick={() => setCurrentColab({ colab: null, action: "Criar" })}
          className="flex items-center gap-2 p-2 rounded-md bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white"
        >
          <p>Adicionar colaborador</p>
          <Svg.plus_circle
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-white"
          />
        </button>
      </div>
      <div className="flex flex-col">
        <ColabTable
          availableActions={Object.fromEntries(
            Object.entries(availableActions).filter(
              ([action]) => action !== "Criar"
            )
          )}
          colabs={colabs}
          onTableAction={(params) =>
            setCurrentColab({
              colab: params.colab,
              action: params.action as ColabAction,
            })
          }
        />
        {currentColab.colab && currentColab.action && (
          <ColabInfo
            colab={currentColab.colab}
            action={currentColab.action as ColabAction}
          />
        )}
      </div>
    </>
  );
}
