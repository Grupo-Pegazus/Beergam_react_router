import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Tooltip } from "react-tooltip";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import { useMarketplaceAccounts } from "~/features/marketplace/hooks/useMarketplaceAccounts";
import { marketplaceService } from "~/features/marketplace/service";
import {
  MarketplaceStatusParse,
  MarketplaceType,
  MarketplaceTypeLabel,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import { isFree } from "~/features/plans/planUtils";
import authStore from "~/features/store-zustand";
import { isMaster } from "~/features/user/utils";
import DeleteMarketaplceAccount from "~/routes/choosen_account/components/DeleteMarketaplceAccount";
import UserPhoto from "~/routes/config/components/UserPhoto";
import Svg from "~/src/assets/svgs/_index";
import Modal from "~/src/components/utils/Modal";
import toast from "~/src/utils/toast";

// Lazy loading do modal de integração para otimizar performance
const CreateMarketplaceModal = lazy(
  () => import("~/routes/choosen_account/components/CreateMarketplaceModal")
);

export default function AccountView({
  expanded = true,
  showMarketplaces = true,
}: {
  expanded?: boolean;
  showMarketplaces?: boolean;
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
    progressMap,
  } = useMarketplaceAccounts();
  const user = authStore.use.user();
  const marketplace = authStore.use.marketplace();
  const subscription = authStore.use.subscription();
  const isFreePlan = isFree(subscription);

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
    const isProcessing =
      marketplace.status_parse === MarketplaceStatusParse.PROCESSING;

    if (isProcessing) {
      toast.error("Não é possível excluir uma conta enquanto ela está sendo processada");
      return;
    }

    setMarketplaceToDelete(marketplace);
    setShowDeleteModal(true);
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
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
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMarketplaceToDelete(null);
  };

  if (showMarketplaces) {
    if (accountsLoading) {
      return <div className="p-3 text-sm opacity-70">Carregando contas...</div>;
    }

    if (!accounts) {
      return (
        <div className="p-3 text-sm opacity-70">Nenhuma conta encontrada</div>
      );
    }
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
            title={showMarketplaces ? "Trocar de conta" : "Menu do usuário"}
            aria-label={
              showMarketplaces
                ? "Trocar de conta de marketplace"
                : "Menu do usuário"
            }
          >
            {showMarketplaces && !isFreePlan ? (
              <>
                {expanded && (
                  <div className="hidden md:flex flex-col min-w-0 text-right">
                    <p
                      className="font-semibold leading-4 truncate max-w-[200px] text-beergam-white!"
                      title={current?.marketplace_name}
                    >
                      {current?.marketplace_name}
                    </p>
                    <p className="text-xs opacity-70 leading-4 text-beergam-white!">
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
              </>
            ) : (
              user && (
                <>
                  {expanded && (
                    <div className="hidden md:flex flex-col min-w-0 text-right">
                      <p
                        className="font-semibold leading-4 truncate max-w-[200px] text-beergam-white!"
                        title={user.name}
                      >
                        {user.name}
                      </p>
                      <p className="text-xs opacity-70 leading-4 text-beergam-white!">
                        {isMaster(user) && user.details?.email
                          ? user.details.email
                          : user.pin || ""}
                      </p>
                    </div>
                  )}
                  <UserPhoto
                    className={showMarketplaces ? "w-8 h-8!" : "w-12 h-12!"}
                    name={user.name}
                  />
                </>
              )
            )}
          </button>

          {showDropdown && (
            <div
              className={`absolute right-0 mt-2 ${showMarketplaces ? "w-[340px]" : "w-[280px]"
                } rounded-lg text-beergam-typography-primary bg-beergam-mui-paper shadow-xl border border-beergam-input-border overflow-hidden z-10 ${open ? "animate-slide-down" : "animate-fade-out"
                }`}
            >
              {/* User Info Section */}
              {showMarketplaces && user && (
                <div className="px-4 py-4 border-b-2 border-beergam-menu-background">
                  <div className="flex items-start gap-3">
                    <UserPhoto className="size-10!" name={user.name} />
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-semibold text-beergam-typography-primary! truncate mb-1"
                        title={user.name}
                      >
                        {user.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {isMaster(user) && user.details?.email && (
                          <>
                            <p
                              className="text-beergam-typography-secondary! truncate mb-1"
                              title={user.details.email}
                            >
                              {user.details.email}
                            </p>
                            <div className="w-1 h-1 bg-beergam-typography-tertiary! rounded-full"></div>
                          </>
                        )}
                        {user.pin && (
                          <p className="text-beergam-typography-secondary!">
                            {user.pin}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Accounts List - conta atual no topo com estilo de selecionado */}
              {showMarketplaces && allAccounts.length > 0 && (
                <div className="">
                  <div className="max-h-[240px] overflow-y-auto">
                    {allAccounts.map((acc) => {
                      const isProcessing =
                        acc.status_parse === MarketplaceStatusParse.PROCESSING;
                      const isSelected =
                        current?.marketplace_shop_id ===
                        acc.marketplace_shop_id;
                      const accProgress = progressMap.get(
                        acc.marketplace_shop_id
                      );
                      const progressPct = accProgress
                        ? Math.round(accProgress.progress_pct)
                        : null;
                      return (
                          <div
                            key={acc.marketplace_shop_id}
                            className="relative"
                          >
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
                              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group ${isSelected
                                ? "bg-beergam-primary/10 cursor-default"
                                : "hover:bg-beergam-primary/10 cursor-pointer"
                                } ${isProcessing
                                  ? "opacity-70 cursor-not-allowed pointer-events-none"
                                  : ""
                                }`}
                            >
                              <div className="relative">
                                {acc.marketplace_image ? (
                                  <img
                                    src={acc.marketplace_image}
                                    alt={acc.marketplace_name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-beergam-typography-secondary rounded-full flex items-center justify-center">
                                    <span className="text-beergam-white font-semibold text-sm">
                                      {acc.marketplace_name
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                {isProcessing && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-beergam-orange rounded-full flex items-center justify-center ring-2 ring-beergam-mui-paper">
                                    <span className="text-white text-[8px] font-bold">
                                      {progressPct ?? "…"}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate text-sm font-medium ${isSelected
                                    ? "text-beergam-primary!"
                                    : "text-beergam-typography-primary! group-hover:text-beergam-primary/80!"
                                    }`}
                                  title={acc.marketplace_name}
                                >
                                  {acc.marketplace_name}
                                </p>
                                {isProcessing && accProgress ? (
                                  <div className="flex flex-col gap-1 mt-0.5">
                                    <div className="w-full h-1.5 bg-beergam-section-border rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-beergam-orange rounded-full transition-all duration-700 ease-out"
                                        style={{
                                          width: `${progressPct ?? 0}%`,
                                        }}
                                      />
                                    </div>
                                    <p className="text-[10px] text-beergam-typography-secondary! truncate">
                                      {accProgress.current_phase ??
                                        "Importando..."}
                                      {accProgress.eta_formatted &&
                                        ` · ${accProgress.eta_formatted}`}
                                    </p>
                                  </div>
                                ) : isProcessing ? (
                                  <p className="text-[10px] text-beergam-orange! mt-0.5">
                                    Importando dados...
                                  </p>
                                ) : (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-xs text-beergam-typography-secondary!">
                                      {
                                        MarketplaceTypeLabel[
                                        acc.marketplace_type as MarketplaceType
                                        ]
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                              {!isProcessing && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMarketplace(acc);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-beergam-red/10 rounded-full"
                                  aria-label="Excluir conta"
                                  title="Excluir conta"
                                >
                                  <Svg.trash tailWindClasses="stroke-beergam-red w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div
                className={`${showMarketplaces ? "border-beergam-menu-background" : "border-transparent"} border-t-2 `}
              >
                <div className="p-2 space-y-1">
                  {showMarketplaces && !isFreePlan && (
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
                  )}
                  {!showMarketplaces && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (marketplace || isFreePlan) {
                            navigate("/interno");
                            setOpen(false);
                          }
                        }}
                        disabled={!marketplace && !isFreePlan}
                        data-tooltip-id="acessar-sistema-tooltip"
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 rounded transition-colors group ${marketplace || isFreePlan
                          ? "hover:bg-beergam-primary/10 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                          }`}
                      >
                        <div className="w-10 h-10 bg-beergam-primary/10 rounded-full flex items-center justify-center group-hover:bg-beergam-primary/20 transition-colors">
                          <Svg.arrow_uturn_right
                            width={20}
                            height={20}
                            tailWindClasses={`${marketplace || isFreePlan ? "text-beergam-primary" : "text-beergam-typography-secondary"}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${marketplace || isFreePlan ? "text-beergam-typography-secondary group-hover:text-beergam-primary/80" : "text-beergam-typography-secondary"}`}
                        >
                          Acessar Sistema
                        </span>
                      </button>
                      {!marketplace && !isFreePlan && (
                        <Tooltip
                          id="acessar-sistema-tooltip"
                          place="left"
                          positionStrategy="fixed"
                        >
                          Selecione um Marketplace
                        </Tooltip>
                      )}
                    </>
                  )}
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

      <Modal
        title="Adicionar Marketplace"
        isOpen={modalOpen}
        onClose={handleModalClose}
      >
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
