import { Pagination, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { type IColab } from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs/_index";
import { Fields } from "~/src/components/utils/_fields";
import ColabLevelBadge from "../Badges/ColabLevelBadge";
import ColabStatusBadge from "../Badges/ColabStatusBadge";
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
  const ROWS_PER_PAGE = 4;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredColabs = colabs.filter(
    (colab) =>
      colab.name.toLowerCase().includes(search.toLowerCase()) ||
      colab.pin?.toLowerCase().includes(search.toLowerCase())
  );

  // Resetar página quando a busca mudar
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Calcular colaboradores visíveis na página atual
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const visibleColabs = filteredColabs.slice(startIndex, endIndex);

  // Garantir que sempre temos 4 slots (preencher com null se necessário)
  const slots: (IColab | null)[] = Array.from(
    { length: ROWS_PER_PAGE },
    (_, i) => visibleColabs[i] || null
  );

  const totalPages = Math.ceil(filteredColabs.length / ROWS_PER_PAGE);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Função wrapper para fazer scroll antes de chamar onAction
  const handleAction = (params: {
    action: "Editar" | "Visualizar" | "Excluir";
    colab: IColab;
  }) => {
    // Chamar a função onAction original
    onAction(params);
  };

  return (
    <div ref={searchRef} className="flex flex-col gap-4 w-full">
      {/* Barra de pesquisa */}
      <Paper className="p-4">
        <Fields.input
          placeholder="Pesquisar colaborador por nome ou pin"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      {/* Lista de colaboradores */}
      <div ref={listRef} className="flex flex-col gap-3">
        {filteredColabs.length === 0 ? (
          <Paper className="p-6 text-center">
            <p className="text-beergam-gray">Nenhum colaborador encontrado</p>
          </Paper>
        ) : (
          slots.map((colab, index) => {
            const isEmpty = colab === null;
            return (
              <Paper
                key={colab?.pin || `empty-${index}`}
                className={`p-4 flex flex-col gap-3 border-1 border-beergam-gray-light relative ${
                  isEmpty ? "opacity-0 pointer-events-none" : ""
                } ${currentColabPin === colab?.pin ? "!bg-beergam-orange-light !border-beergam-orange" : ""}`}
              >
                {/* Botão de excluir - posicionado absolutamente no canto superior direito */}
                <div className="flex items-center justify-between">
                  <ColabPhoto
                    photo_id={colab?.details.photo_id || null}
                    tailWindClasses="w-16 h-16 min-w-16 min-h-16"
                    name={colab?.name || ""}
                  />
                  <button
                    onClick={() =>
                      colab && onAction({ action: "Excluir", colab })
                    }
                    className="p-2 rounded-full bg-beergam-red hover:bg-beergam-red/90 text-white transition-colors z-10"
                    aria-label="Excluir colaborador"
                    disabled={isEmpty}
                  >
                    <Svg.trash width={18} height={18} />
                  </button>
                </div>
                {/* Header do card - Foto e informações principais */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-bold text-lg truncate text-beergam-blue-primary">
                      {colab?.name || "Placeholder"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-beergam-blue-primary">PIN:</p>
                      <span className="text-beergam-blue-primary">
                        {colab?.pin || "---"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colab && <ColabStatusBadge status={colab.status} />}
                      {colab && <ColabLevelBadge level={colab.details.level} />}
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 pt-2 border-t border-beergam-gray-light">
                  <button
                    onClick={() =>
                      colab && handleAction({ action: "Visualizar", colab })
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-beergam-blue-primary hover:bg-beergam-blue-primary/90 text-white text-sm font-medium transition-colors"
                    disabled={isEmpty}
                  >
                    <Svg.eye width={18} height={18} />
                    <span>Visualizar</span>
                  </button>
                  <button
                    onClick={() =>
                      colab && handleAction({ action: "Editar", colab })
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-beergam-orange hover:bg-beergam-orange/90 text-white text-sm font-medium transition-colors"
                    disabled={isEmpty}
                  >
                    <Svg.pencil width={18} height={18} />
                    <span>Editar</span>
                  </button>
                </div>
              </Paper>
            );
          })
        )}
      </div>

      {/* Paginação */}
      {filteredColabs.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "var(--color-beergam-blue-primary)",
                "&.Mui-selected": {
                  backgroundColor: "var(--color-beergam-orange)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "var(--color-beergam-orange)",
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
