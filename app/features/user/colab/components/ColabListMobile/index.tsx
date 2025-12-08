import { Pagination, Paper } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import authStore from "~/features/store-zustand";
import UserFields from "~/features/user/components/UserFields";
import { userService } from "~/features/user/service";
import { UserStatus } from "~/features/user/typings/BaseUser";
import { type IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import type { ColabAction } from "~/routes/perfil/typings";
import Alert from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import ColabLevelBadge from "../Badges/ColabLevelBadge";
import ColabStatusBadge from "../Badges/ColabStatusBadge";
import ColabPhoto from "../ColabPhoto";
import DeleteColab from "../DeleteColab";
type ColabListMobileProps = {
  colabs: IColab[];
  currentColabPin: string | null;
  currentAction: ColabAction | null;
  onAction: (params: { action: ColabAction; colab: IColab }) => void;
};

export default function ColabListMobile({
  colabs,
  currentColabPin,
  currentAction,
  onAction,
}: ColabListMobileProps) {
  const ROWS_PER_PAGE = 3;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [colabToDelete, setColabToDelete] = useState<IColab | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModal();
  const user = authStore.use.user();
  const deleteColabMutation = useMutation({
    mutationFn: (colab: IColab) => userService.deleteColab(colab.pin ?? ""),
    onSuccess: (data, colab) => {
      if (!data.success) {
        throw new Error(data.message);
      }
      setColabToDelete(null);
      toast.success(data.message);
      setTimeout(() => {
        onAction({ action: "Excluir", colab: colab });
        closeModal();
      }, 500);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const masterPin = useMemo(() => {
    if (user && isMaster(user)) {
      return (user as IUser).pin;
    }
    return null;
  }, [user]);

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
    if (params.action === "Excluir") {
      setColabToDelete(params.colab);
    } else {
      // Chamar a função onAction original
      onAction(params);
    }
  };
  const actionColor =
    currentAction === "Visualizar"
      ? "bg-beergam-blue-primary/20! border-beergam-blue-primary!"
      : currentAction === "Editar"
        ? "bg-beergam-orange/20! border-beergam-orange!"
        : currentAction === "Excluir" && colabToDelete?.pin === currentColabPin
          ? "bg-beergam-red/20! border-beergam-red!"
          : "";
  return (
    <div ref={searchRef} className="flex flex-col gap-4 w-full">
      {/* Barra de pesquisa */}
      <div className="flex gap-2 items-center">
        <UserFields
          label="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="search"
          canAlter={true}
        />
        <UserFields
          name="status"
          value={""}
          label="Status"
          nullable
          canAlter
          options={Object.keys(UserStatus).map((status) => ({
            value: status,
            label: status,
          }))}
        />
        <UserFields
          name="level"
          value={""}
          label="Nivel"
          nullable
          canAlter
          options={Object.keys(UserStatus).map((status) => ({
            value: status,
            label: status,
          }))}
        />
      </div>

      {/* Lista de colaboradores */}
      <div
        ref={listRef}
        className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4"
      >
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
                  isEmpty ? "bg-beergam-gray/50! hidden opacity-0" : ""
                } ${currentColabPin === colab?.pin ? `${actionColor}` : ""} ${colabToDelete?.pin === colab?.pin ? "bg-beergam-red/20! border-beergam-red!" : ""}`}
              >
                {/* Botão de excluir - posicionado absolutamente no canto superior direito */}
                <div className="flex items-center justify-between">
                  <div className="size-10">
                    <ColabPhoto
                      photo_id={colab?.details.photo_id || null}
                      name={colab?.name || ""}
                      masterPin={masterPin}
                    />
                  </div>
                  {/* <button
                    onClick={() => colab && setColabToDelete(colab)}
                    className="p-2 rounded-full bg-beergam-red hover:bg-beergam-red/90 text-white transition-colors z-10"
                    aria-label="Excluir colaborador"
                    disabled={isEmpty}
                  >
                    <Svg.trash width={18} height={18} />
                  </button> */}
                  <BeergamButton
                    icon="trash"
                    mainColor="beergam-red"
                    onClick={() => {
                      if (isEmpty) return;
                      setColabToDelete(colab);
                      if (!colab) return;
                      openModal(
                        <Alert
                          type="warning"
                          confirmText="Excluir"
                          onClose={closeModal}
                          mutation={deleteColabMutation}
                          onConfirm={() => {
                            if (!colab) return;
                            deleteColabMutation.mutate(colab);
                          }}
                        >
                          <DeleteColab colab={colab} />
                        </Alert>,
                        {
                          title: "Excluir Colaborador",
                          onClose: () => setColabToDelete(null),
                        }
                      );
                    }}
                    disabled={isEmpty}
                  />
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
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-beergam-gray-light">
                  <BeergamButton
                    title="Visualizar"
                    icon="eye"
                    onClick={() => {
                      if (isEmpty) return;
                      if (!colab) return;
                      handleAction({ action: "Visualizar", colab });
                    }}
                    disabled={isEmpty}
                  />
                  <BeergamButton
                    title="Editar"
                    mainColor="beergam-orange"
                    icon="pencil_solid"
                    onClick={() => {
                      if (isEmpty) return;
                      if (!colab) return;
                      handleAction({ action: "Editar", colab });
                    }}
                    disabled={isEmpty}
                  />
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
