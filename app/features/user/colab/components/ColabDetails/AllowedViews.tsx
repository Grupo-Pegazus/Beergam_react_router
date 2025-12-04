import ColabItem from "./ColabItem";

export default function AllowedViews({
  accessList,
}: {
  accessList: { key: string; label: string; access: boolean }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {accessList.map((v) => (
        <ColabItem key={v.key} active={v.access}>
          <span className="font-medium">{v.label}</span>
          <span className="text-xs font-semibold">
            {v.access ? "Ativo" : "Inativo"}
          </span>
        </ColabItem>
      ))}
    </div>
  );
}
