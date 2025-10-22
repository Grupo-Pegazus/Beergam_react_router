// import ColabCard from "~/features/user/colab/components/ColabCard";
import { type Dispatch, useReducer } from "react";
import ColabInfo from "~/features/user/colab/components/ColabInfo";
import ColabTable from "~/features/user/colab/components/ColabTable";
import { type ColabAction, type IColab } from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs";

export default function Colaboradores({ colabs }: { colabs: IColab[] | [] }) {
  // const availableActions = ["Editar", "Excluir"];
  const availableActions = {
    Editar: { icon: <Svg.pencil width={20} height={20} /> },
    Excluir: { icon: <Svg.trash width={20} height={20} /> },
    Visualizar: { icon: <Svg.eye width={20} height={20} /> },
  };
  const initialColabState = {
    colab: null as IColab | null,
    action: null as ColabAction | null,
  };
  const [currentColab, setCurrentColab] = useReducer(
    (state: typeof initialColabState, action: typeof initialColabState) => {
      switch (action.action) {
        case "Editar":
          return { ...state, ...action };
        case "Excluir":
          if (state.colab?.pin === action.colab?.pin) {
            return { ...state, ...action, colab: null };
          } else {
            return { ...state };
          }
        case "Visualizar":
          return { ...state, ...action };
        default:
          return state;
      }
    },
    initialColabState
  );
  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p>Quantidade de colaboradores registrados: {colabs.length}</p>
        <button className="flex items-center gap-2 p-2 rounded-md bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white">
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
          availableActions={availableActions}
          colabs={colabs}
          setCurrentColab={
            setCurrentColab as Dispatch<{
              colab: IColab | null;
              action: ColabAction | null;
            }>
          }
        />
        {currentColab.colab && <ColabInfo {...currentColab.colab} />}
      </div>
    </>
  );
}
