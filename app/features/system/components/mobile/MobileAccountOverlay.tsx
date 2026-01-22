import { useQueryClient } from "@tanstack/react-query";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { useMarketplaceAccounts } from "~/features/marketplace/hooks/useMarketplaceAccounts";
import { marketplaceService } from "~/features/marketplace/service";
import {
  MarketplaceStatusParse,
  MarketplaceType,
  MarketplaceTypeLabel,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import DeleteMarketaplceAccount from "~/routes/choosen_account/components/DeleteMarketaplceAccount";
import Svg from "~/src/assets/svgs/_index";
import Modal from "~/src/components/utils/Modal";
import toast from "~/src/utils/toast";
import { useOverlay } from "../../hooks/useOverlay";
import OverlayFrame from "../../shared/OverlayFrame";

const CreateMarketplaceModal = lazy(
  () => import("~/routes/choosen_account/components/CreateMarketplaceModal")
);

export default function MobileAccountOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  const first = useRef<HTMLButtonElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] =
    useState<BaseMarketPlace | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isOpen, shouldRender, open, requestClose } = useOverlay();

  useEffect(() => {
    open();
  }, [open]);

  const handleClose = useCallback(() => {
    requestClose(onClose);
  }, [requestClose, onClose]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
  }, [queryClient]);

  const handleDeleteMarketplace = useCallback(
    (marketplace: BaseMarketPlace) => {
      const isProcessing =
        marketplace.status_parse === MarketplaceStatusParse.PROCESSING;

      if (isProcessing) {
        toast.error("Não é possível excluir uma conta enquanto ela está sendo processada");
        return;
      }

      setMarketplaceToDelete(marketplace);
      setShowDeleteModal(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!marketplaceToDelete) return;

    const isProcessing =
      marketplaceToDelete.status_parse === MarketplaceStatusParse.PROCESSING;

    if (isProcessing) {
      toast.error("Não é possível excluir uma conta enquanto ela está sendo processada");
      setShowDeleteModal(false);
      setMarketplaceToDelete(null);
      return;
    }

    const selectedMarketplace = authStore.getState().marketplace;
    const isSelectedMarketplace =
      selectedMarketplace?.marketplace_shop_id ===
      marketplaceToDelete.marketplace_shop_id;

    try {
      const response = await marketplaceService.deleteMarketplaceAccount(
        marketplaceToDelete.marketplace_shop_id || "",
        marketplaceToDelete.marketplace_type as MarketplaceType
      );

      if (response.success) {
        toast.success(response.message || "Conta deletada com sucesso");

        // Se a conta deletada era a selecionada
        if (isSelectedMarketplace) {
          authStore.setState({ marketplace: null });
          navigate("/interno/choosen_account", { replace: true });
        }

        // Invalida queries para atualizar a lista de contas
        queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
      } else {
        toast.error(response.message || "Erro ao deletar conta");
      }
    } catch {
      toast.error("Erro ao deletar conta. Tente novamente.");
    } finally {
      setShowDeleteModal(false);
      setMarketplaceToDelete(null);
    }
  }, [marketplaceToDelete, navigate, queryClient]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setMarketplaceToDelete(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    first.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [handleClose]);

  return (
    <OverlayFrame
      title="Trocar de conta"
      isOpen={isOpen}
      shouldRender={shouldRender}
      onRequestClose={handleClose}
    >
      <AccountList
        onAdd={() => setModalOpen(true)}
        onSelected={handleClose}
        onDelete={handleDeleteMarketplace}
      />
      <Modal isOpen={modalOpen} onClose={handleModalClose}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-beergam-orange border-t-transparent"></div>
            </div>
          }
        >
          <CreateMarketplaceModal
            marketplacesAccounts={[]}
            modalOpen={modalOpen}
          />
        </Suspense>
      </Modal>

      {/* Modal de confirmação de deletar */}
      <Modal
        title="Deletar conta"
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
      >
        <DeleteMarketaplceAccount
          marketplaceToDelete={marketplaceToDelete}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Modal>
    </OverlayFrame>
  );
}

function AccountList({
  onSelected,
  onAdd,
  onDelete,
}: {
  onSelected: () => void;
  onAdd: () => void;
  onDelete: (marketplace: BaseMarketPlace) => void;
}) {
  const { accounts, current, isLoading, selectAccountAsync, isSelecting } =
    useMarketplaceAccounts();
  return (
    <div className="p-4 overflow-y-auto">
      {isLoading ? (
        <div className="text-sm opacity-70">Carregando contas...</div>
      ) : (
        <div className="grid grid-cols-1 gap-1 max-h-[80vh] overflow-y-auto pb-20">
          {accounts.map((acc) => (
            <div
              key={acc.marketplace_shop_id}
              className={[
                "w-[90%] mx-auto my-1 relative flex items-center gap-3 p-3 rounded-xl border border-black/10 bg-beergam-mui-paper shadow-sm",
                acc.marketplace_shop_id === current?.marketplace_shop_id
                  ? "ring-2 ring-beergam-primary bg-beergam-primary/10!"
                  : "",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={async () => {
                  await selectAccountAsync(acc);
                  onSelected();
                }}
                disabled={isSelecting}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <img
                  src={acc.marketplace_image}
                  alt={acc.marketplace_name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="text-left min-w-0 flex-1">
                  <p className="font-medium truncate text-beergam-typography-primary">
                    {acc.marketplace_name}
                  </p>
                  <p className="truncate text-beergam-typography-secondary">
                    {MarketplaceTypeLabel[acc.marketplace_type]}
                  </p>
                </div>
              </button>
              {acc.status_parse !== MarketplaceStatusParse.PROCESSING && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(acc);
                  }}
                  disabled={isSelecting}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Excluir conta"
                  title="Excluir conta"
                >
                  <Svg.trash tailWindClasses="stroke-beergam-red w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="fixed w-[90%] mx-auto bottom-6 left-0 right-0 mt-2 px-3 py-4 rounded-xl border border-black/10 bg-beergam-primary/10 text-center flex items-center justify-center gap-2"
          >
            <Svg.globe
              width={20}
              height={20}
              tailWindClasses="text-beergam-primary"
            />
            <span className="text-lg font-medium text-beergam-primary">
              Adicionar Marketplace
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
