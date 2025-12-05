import type { ColabAction } from "~/routes/perfil/typings";
import Time from "~/src/components/utils/Time";
import ColabItem from "./ColabItem";
export default function AllowedViews({
  accessList,
  action = "Visualizar",
}: {
  accessList: { key: string; label: string; access: boolean }[];
  action: ColabAction;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {accessList.map((v) => (
        <>
          {action == "Visualizar" && (
            <ColabItem key={v.key} active={v.access}>
              <span className="font-medium">{v.label}</span>
              <span className="text-xs font-semibold">
                {v.access ? "Ativo" : "Inativo"}
              </span>
            </ColabItem>
          )}
          {action == "Criar" ||
            (action == "Editar" && (
              <Time
                dia={v.label}
                access={v.access}
                start_date="00:00"
                end_date="23:59"
                setHorario={() => {}}
              />
            ))}
        </>
      ))}
    </div>
  );
}
