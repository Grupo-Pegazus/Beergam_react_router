import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import StatusTag from "~/features/marketplace/components/StatusTag";
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
import Loading from "~/src/assets/loading";
import Svg from "~/src/assets/svgs/_index";
import Modal from "~/src/components/utils/Modal";
import toast from "~/src/utils/toast";

// Lazy loading do modal de integração para otimizar performance
const CreateMarketplaceModal = lazy(
  () => import("~/routes/choosen_account/components/CreateMarketplaceModal")
);

export default function AccountView({
  expanded = true,
}: {
  expanded?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] =
    useState<BaseMarketPlace | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useLogoutFlow({
    redirectTo: "/login",
  });
  const {
    accounts,
    current,
    isLoading: accountsLoading,
    selectAccount,
  } = useMarketplaceAccounts();

  // Controla animação de abertura/fechamento do dropdown
  useEffect(() => {
    if (open) {
      setShowDropdown(true);
    } else {
      const timer = setTimeout(() => setShowDropdown(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // seleção de conta delegada à hook compartilhada

  // Invalida queries quando modal fecha para garantir dados atualizados
  const handleModalClose = () => {
    setModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
  };

  const handleDeleteMarketplace = (marketplace: BaseMarketPlace) => {
    setMarketplaceToDelete(marketplace);
    setShowDeleteModal(true);
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!marketplaceToDelete) return;

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
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMarketplaceToDelete(null);
  };

  if (accountsLoading) {
    return <div className="p-3 text-sm opacity-70">Carregando contas...</div>;
  }

  if (!accounts) {
    return (
      <div className="p-3 text-sm opacity-70">Nenhuma conta encontrada</div>
    );
  }

  // Criar lista unificada com a conta atual no topo
  const allAccounts = current
    ? [
        current,
        ...accounts.filter(
          (acc) => acc.marketplace_shop_id !== current?.marketplace_shop_id
        ),
      ]
    : accounts;

  return (
    <>
      {/* {isLoggingOut && <LogoutOverlay />} */}
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer hover:opacity-90 transition-opacity"
            title="Trocar de conta"
            aria-label="Trocar de conta de marketplace"
          >
            {expanded && (
              <div className="hidden md:flex flex-col min-w-0 text-right text-beergam-white">
                <p
                  className="font-semibold leading-4 truncate max-w-[200px]"
                  title={current?.marketplace_name}
                >
                  {current?.marketplace_name}
                </p>
                <p className="text-xs opacity-70 leading-4">
                  {
                    MarketplaceTypeLabel[
                      current?.marketplace_type as MarketplaceType
                    ]
                  }
                </p>
              </div>
            )}
            <img
              src={current?.marketplace_image}
              alt={current?.marketplace_name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
            />
          </button>

          {showDropdown && (
            <div
              className={`absolute right-0 mt-2 w-[340px] rounded-lg text-beergam-typography-primary bg-beergam-mui-paper shadow-xl border border-beergam-input-border overflow-hidden z-10 ${
                open ? "animate-slide-down" : "animate-fade-out"
              }`}
            >
              {/* Accounts List - conta atual no topo com estilo de selecionado */}
              {allAccounts.length > 0 && (
                <div className="border-b border-beergam-primary">
                  <div className="max-h-[240px] overflow-y-auto">
                    {allAccounts.map((acc) => {
                      const isProcessing =
                        acc.status_parse === MarketplaceStatusParse.PROCESSING;
                      const isSelected =
                        current?.marketplace_shop_id ===
                        acc.marketplace_shop_id;
                      return (
                        <div key={acc.marketplace_shop_id} className="relative">
                          {/* Overlay de processamento */}
                          {isProcessing && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                              <div className="text-white text-center flex flex-col items-center gap-2">
                                <Loading color="#ffffff" size="2rem" />
                                <p className="text-xs font-medium">
                                  Processando...
                                </p>
                              </div>
                            </div>
                          )}
                          <div
                            role="button"
                            tabIndex={isProcessing ? -1 : 0}
                            onClick={() => {
                              if (!isProcessing && !isSelected)
                                selectAccount(acc);
                            }}
                            onKeyDown={(e) => {
                              if (isProcessing || isSelected) return;
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                selectAccount(acc);
                              }
                            }}
                            aria-disabled={isProcessing || isSelected}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group ${
                              isSelected
                                ? "bg-beergam-primary/10 cursor-default"
                                : "hover:bg-beergam-primary/10 cursor-pointer"
                            } ${
                              isProcessing
                                ? "opacity-60 cursor-not-allowed pointer-events-none"
                                : ""
                            }`}
                          >
                            {acc.marketplace_image ? (
                              <img
                                src={acc.marketplace_image}
                                alt={acc.marketplace_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {acc.marketplace_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate text-sm font-medium ${
                                  isSelected
                                    ? "text-beergam-primary"
                                    : "text-beergam-typography-primary group-hover:text-beergam-primary/80"
                                }`}
                                title={acc.marketplace_name}
                              >
                                {acc.marketplace_name}
                              </p>
                              {/* Marketplace Type e Status de Pedidos na mesma linha */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs text-gray-500">
                                  {
                                    MarketplaceTypeLabel[
                                      acc.marketplace_type as MarketplaceType
                                    ]
                                  }
                                </p>
                                <StatusTag
                                  status={acc.orders_parse_status}
                                  type="orders"
                                  className="text-[10px] py-0.5 px-2"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isProcessing) handleDeleteMarketplace(acc);
                              }}
                              disabled={isProcessing}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-beergam-red/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Excluir conta"
                              title="Excluir conta"
                            >
                              <Svg.trash tailWindClasses="stroke-beergam-red w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-beergam-primary">
                <div className="p-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(true);
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-beergam-primary/10 flex items-center gap-3 cursor-pointer rounded transition-colors group"
                  >
                    <div className="w-10 h-10 bg-beergam-primary/10 rounded-full flex items-center justify-center group-hover:bg-beergam-primary/20 transition-colors">
                      <Svg.globe
                        width={20}
                        height={20}
                        tailWindClasses="text-beergam-primary"
                      />
                    </div>
                    <span className="text-sm font-medium text-beergam-typography-secondary group-hover:text-beergam-primary/80">
                      Adicionar Marketplace
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/interno/config");
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-beergam-primary/10 flex items-center gap-3 cursor-pointer rounded transition-colors group"
                  >
                    <div className="w-10 h-10 bg-beergam-primary/10 rounded-full flex items-center justify-center group-hover:bg-beergam-primary/20 transition-colors">
                      <Svg.cog_8_tooth
                        width={20}
                        height={20}
                        tailWindClasses="text-beergam-primary"
                      />
                    </div>
                    <span className="text-sm font-medium text-beergam-typography-secondary group-hover:text-beergam-primary/80">
                      Configurações da Conta
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      void logout();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-beergam-red/10 flex items-center gap-3 cursor-pointer rounded transition-colors group"
                  >
                    <div className="w-10 h-10 bg-beergam-red/10 rounded-full flex items-center justify-center group-hover:bg-beergam-red/20 transition-colors">
                      <Svg.logout
                        width={20}
                        height={20}
                        tailWindClasses="text-beergam-red"
                      />
                    </div>
                    <span className="text-sm font-medium text-beergam-typography-secondary group-hover:text-beergam-red/80">
                      Sair do Sistema
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ClickAwayListener>

      <Modal isOpen={modalOpen} onClose={handleModalClose}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-beergam-orange border-t-transparent"></div>
            </div>
          }
        >
          <CreateMarketplaceModal
            marketplacesAccounts={accounts}
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
    </>
  );
}
