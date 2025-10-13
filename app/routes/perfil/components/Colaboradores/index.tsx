// import ColabCard from "~/features/user/colab/components/ColabCard";
import { useReducer } from "react";
import ColabTable from "~/features/user/colab/components/ColabTable";
import { type IColab } from "~/features/user/typings/Colab";
export default function Colaboradores({ colabs }: { colabs: IColab[] | [] }) {
  const initialColabState = {
    colab: null as IColab | null,
    action: null as string | null,
  };
  const [currentColab, setCurrentColab] = useReducer(
    (state: typeof initialColabState, action: typeof initialColabState) => {
      return { ...state, ...action };
    },
    initialColabState
  );
  return (
    <div>
      <div>
        <p>Quantidade de colaboradores registrados: {colabs.length}</p>
        <ColabTable colabs={colabs} setCurrentColab={setCurrentColab} />
        {currentColab.colab && <p>Colaborador ativo hein</p>}
        <p>{JSON.stringify(currentColab)}</p>
      </div>
    </div>
  );
}
