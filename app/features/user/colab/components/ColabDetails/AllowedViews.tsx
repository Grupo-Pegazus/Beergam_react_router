import type { ColabAction } from "~/routes/perfil/typings";
import LockAnimated from "~/src/assets/LockAnimated";
import ColabItem from "./ColabItem";
export default function AllowedViews({
  accessList,
  action = "Visualizar",
  setValue,
}: {
  accessList: { key: string; label: string; access: boolean }[];
  action: ColabAction;
  setValue: (key: string, value: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {accessList.map((v) => (
        <div key={v.key}>
          <ColabItem
            active={v.access}
            onClick={() => {
              console.log(v.key, v.access);
              setValue(v.key, !v.access);
            }}
            canInteract={action == "Criar" || action == "Editar"}
          >
            <span className="font-medium">{v.label}</span>
            <span className="text-xs font-semibold">
              {v.access ? "Ativo" : "Inativo"}
            </span>
            {(action == "Criar" || action == "Editar") && (
              <LockAnimated
                tailwindClasses={`absolute top-[50%] translate-y-[-50%] right-2 ${v.access ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                open={v.access}
              />
            )}
          </ColabItem>
        </div>
      ))}
    </div>
  );
}
