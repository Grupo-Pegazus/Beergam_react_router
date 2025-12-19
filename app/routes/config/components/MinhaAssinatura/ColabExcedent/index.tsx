import { useAuthUser } from "~/features/auth/context/AuthStoreContext";
import { isMaster } from "~/features/user/utils";
import BeergamButton from "~/src/components/utils/BeergamButton";

export default function ColabExcedent({
  colabsExcedent,
}: {
  colabsExcedent: number;
}) {
  const user = useAuthUser();

  if (!user) return null;
  if (colabsExcedent <= 0) return null;

  if (isMaster(user)) {
    return (
      <div className="flex flex-col gap-2">
        <p>Você possui {colabsExcedent} colaboradores excedentes.</p>
        {/* <p>
          Quantidade de colaboradores selecionados: {selectedItemsCount}/
          {colabsExcedent}
        </p> */}
        <BeergamButton
          link="interno/config?session=Colaboradores"
          title="Gerenciar colaboradores"
        />
        {/* <ExcedentList
          items={colabsArray}
          maxQuantityAllowed={colabsExcedent}
          onSelectionChange={handleSelectionChange}
          getItemKey={getItemKey}
        /> */}
      </div>
    );
  }

  return null;
}
