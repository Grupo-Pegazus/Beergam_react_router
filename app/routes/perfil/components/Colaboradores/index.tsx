// import ColabCard from "~/features/user/colab/components/ColabCard";
import { useReducer } from "react";
import ColabInfo from "~/features/user/colab/components/ColabInfo";
import ColabTable from "~/features/user/colab/components/ColabTable";
import { type IColab } from "~/features/user/typings/Colab";
export default function Colaboradores({ colabs }: { colabs: IColab[] | [] }) {
  const initialColabState = {
    colab: null as IColab | null,
    action: null as string | null,
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
          break;
        default:
          return state;
      }
    },
    initialColabState
  );
  return (
    <>
      <p>Quantidade de colaboradores registrados: {colabs.length}</p>
      <div className="flex flex-col gap-4">
        <ColabTable colabs={colabs} setCurrentColab={setCurrentColab} />
        {/* <p>{JSON.stringify(currentColab)}</p> */}
        {currentColab.colab && <ColabInfo {...currentColab.colab} />}
      </div>
    </>
  );
}
