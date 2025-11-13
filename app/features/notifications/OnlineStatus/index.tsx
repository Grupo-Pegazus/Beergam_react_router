import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import type { IColab } from "~/features/user/typings/Colab";
export default function OnlineStatus({
  colab,
  online,
}: {
  colab: IColab | null;
  online: boolean;
}) {
  if (!colab) {
    return null;
  }
  const statusLabel = online ? "entrou no" : "saiu do";
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`${online ? "bg-beergam-green" : "bg-beergam-red"} size-2 rounded-full`}
        ></div>
        <ColabPhoto
          photo_id={colab.details.photo_id}
          name={colab.name}
          masterPin={colab.master_pin}
          size="medium"
        />
      </div>
      <div>
        <p>
          O colaborador <span className="font-bold">{colab.name}</span>{" "}
          <span className="font-bold">{statusLabel}</span> sistema.
        </p>
      </div>
    </div>
  );
}
