import { Paper } from "@mui/material";
import { useState } from "react";
import { FormatUserStatus, UserStatus } from "~/features/user/typings/BaseUser";
import {
  ColabLevel,
  FormatColabLevel,
  type IColab,
} from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import ColabPhoto from "../ColabPhoto";

type ColabListMobileProps = {
  colabs: IColab[];
  currentColabPin: string | null;
  onAction: (params: {
    action: "Editar" | "Visualizar" | "Excluir";
    colab: IColab;
  }) => void;
};

export default function ColabListMobile({
  colabs,
  currentColabPin,
  onAction,
}: ColabListMobileProps) {
  const [search, setSearch] = useState("");

  const filteredColabs = colabs.filter(
    (colab) =>
      colab.name.toLowerCase().includes(search.toLowerCase()) ||
      colab.pin?.toLowerCase().includes(search.toLowerCase())
  );

  function Badge({
    className,
    text,
    pinClassName,
  }: {
    className?: string;
    text: string;
    pinClassName: string;
  }) {
    return (
      <Paper
        className={`flex items-center gap-2 !p-2 rounded-2xl ${className || ""}`}
      >
        <div className={`w-2 h-2 rounded-full ${pinClassName}`}></div>
        <p className="text-xs">{text}</p>
      </Paper>
    );
  }

  function ColabLevelBadge({ level }: { level: ColabLevel }) {
    return (
      <Badge
        className="!w-fit"
        text={FormatColabLevel(level)}
        pinClassName={`${
          ColabLevel[level as unknown as keyof typeof ColabLevel] ===
          ColabLevel.ADMIN
            ? "bg-beergam-orange"
            : "bg-beergam-blue-primary"
        }`}
      />
    );
  }

  function ColabStatusBadge({ status }: { status: UserStatus }) {
    return (
      <Badge
        className="!w-fit"
        text={FormatUserStatus(status)}
        pinClassName={`${
          UserStatus[status as unknown as keyof typeof UserStatus] ===
          UserStatus.ACTIVE
            ? "bg-beergam-green"
            : "bg-beergam-gray"
        }`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Barra de pesquisa */}
      <Paper className="p-4">
        <Fields.input
          placeholder="Pesquisar colaborador por nome ou pin"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      {/* Lista de colaboradores */}
      <div className="flex flex-col gap-3">
        {filteredColabs.length === 0 ? (
          <Paper className="p-6 text-center">
            <p className="text-beergam-gray">Nenhum colaborador encontrado</p>
          </Paper>
        ) : (
          filteredColabs.map((colab) => (
            <Paper
              key={colab.pin}
              className={`p-4 flex flex-col gap-3 border-1 border-beergam-gray-light relative ${currentColabPin === colab.pin ? "!bg-beergam-orange-light !border-beergam-orange" : ""}`}
            >
              {/* Botão de excluir - posicionado absolutamente no canto superior direito */}

              <div className="flex items-center justify-between">
                <ColabPhoto
                  photo_id={colab.details.photo_id}
                  tailWindClasses="w-16 h-16 min-w-16 min-h-16"
                  name={colab.name}
                />
                <button
                  onClick={() => onAction({ action: "Excluir", colab })}
                  className="p-2 rounded-full bg-beergam-red hover:bg-beergam-red/90 text-white transition-colors z-10"
                  aria-label="Excluir colaborador"
                >
                  <Svg.trash width={18} height={18} />
                </button>
              </div>
              {/* Header do card - Foto e informações principais */}
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="font-bold text-lg truncate text-beergam-blue-primary">
                    {colab.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-beergam-blue-primary">PIN:</p>
                    <span className="text-beergam-blue-primary">
                      {colab.pin}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ColabStatusBadge status={colab.status} />
                    <ColabLevelBadge level={colab.details.level} />
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 pt-2 border-t border-beergam-gray-light">
                <button
                  onClick={() => onAction({ action: "Visualizar", colab })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-beergam-blue-primary hover:bg-beergam-blue-primary/90 text-white text-sm font-medium transition-colors"
                >
                  <Svg.eye width={18} height={18} />
                  <span>Visualizar</span>
                </button>
                <button
                  onClick={() => onAction({ action: "Editar", colab })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-beergam-orange hover:bg-beergam-orange/90 text-white text-sm font-medium transition-colors"
                >
                  <Svg.pencil width={18} height={18} />
                  <span>Editar</span>
                </button>
              </div>
            </Paper>
          ))
        )}
      </div>
    </div>
  );
}
