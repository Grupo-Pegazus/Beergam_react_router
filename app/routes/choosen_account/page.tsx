import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useFetcher, useNavigate } from "react-router";

import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import MarketplaceCard from "~/features/marketplace/components/MarketplaceCard";
import { marketplaceService } from "~/features/marketplace/service";
import {
  MarketplaceOrderParseStatus,
  MarketplaceStatusParse,
  MarketplaceType,
  MarketplaceTypeLabel,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import Svg from "~/src/assets/svgs/_index";
import { Fields } from "~/src/components/utils/_fields";
import Hint from "~/src/components/utils/Hint";
import Modal from "~/src/components/utils/Modal";
import Loading from "~/src/assets/loading";
import ChoosenAccountSkeleton from "./components/ChoosenAccountSkeleton";
import DeleteMarketaplceAccount from "./components/DeleteMarketaplceAccount";

const CreateMarketplaceModal = lazy(
  () => import("./components/CreateMarketplaceModal")
);
interface ChoosenAccountPageProps {
  marketplacesAccounts: BaseMarketPlace[] | null;
  isLoading?: boolean;
}
export default function ChoosenAccountPage({
  marketplacesAccounts,
  isLoading = false,
}: ChoosenAccountPageProps) {
  const [abrirModal, setAbrirModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] =
    useState<BaseMarketPlace | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("");
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data && fetcher.data.success && fetcher.state === "idle") {
      queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });

      // Verifica se precisa limpar o Zustand (quando a conta deletada era a selecionada)
      const responseData = fetcher.data as { shouldCelarStore?: boolean };
      if (responseData.shouldCelarStore) {
        authStore.setState({ marketplace: null });
      }
    }
  }, [fetcher.data, fetcher.state, queryClient]);

  function handleAbrirModal({ abrir }: { abrir: boolean }) {
    setAbrirModal(abrir);
  }

  function handleDeleteMarketplace(marketplace: BaseMarketPlace) {
    setMarketplaceToDelete(marketplace);
    setShowDeleteModal(true);
  }

  function handleConfirmDelete() {
    if (marketplaceToDelete) {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append(
        "marketplaceId",
        marketplaceToDelete.marketplace_shop_id || ""
      );
      formData.append("marketplaceType", marketplaceToDelete.marketplace_type);

      fetcher.submit(formData, {
        method: "post",
      });
    }
    setShowDeleteModal(false);
    setMarketplaceToDelete(null);
  }

  function handleCancelDelete() {
    setShowDeleteModal(false);
    setMarketplaceToDelete(null);
  }

  const marketplaceTypeOptions = useMemo(() => {
    const base = [{ value: "", label: "Todos" }];
    const types = Object.values(MarketplaceType).map((t) => ({
      value: t,
      label: MarketplaceTypeLabel[t as MarketplaceType],
    }));
    return [...base, ...types];
  }, []);

  const filteredAccounts = useMemo(() => {
    const list = Array.isArray(marketplacesAccounts) ? marketplacesAccounts : [];
    const byText = searchTerm.trim().toLowerCase();
    return list.filter((acc) => {
      const matchText = byText
        ? acc.marketplace_name.toLowerCase().includes(byText)
        : true;
      const matchType =
        typeFilter && typeFilter !== ""
          ? acc.marketplace_type === (typeFilter as MarketplaceType)
          : true;
      return matchText && matchType;
    });
  }, [marketplacesAccounts, searchTerm, typeFilter]);
  const resultsCount = filteredAccounts.length;
  return (
    <PageLayout>
      <div className="flex flex-col items-center w-full p-4">
        {/* Header */}
        <div className="mb-4 w-full max-w-[80vw]">
          <div className="bg-beergam-white shadow-lg/55 rounded-2xl p-4 md:p-6">
            {/* Linha 1: Título e botão */}
            <div className="flex items-center justify-between gap-3 mb-3 lg:flex-row flex-col">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl text-beergam-blue-primary whitespace-nowrap">
                  Selecione sua loja
                </h2>
                <Hint
                  message="Aqui você pode selecionar a loja de marketplace que deseja usar para acessar o sistema."
                  anchorSelect="info-loja"
                />
              </div>
              <button
                onClick={() => {
                  navigate("/interno/config");
                }}
                className="bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white px-3 py-2 rounded-md items-center gap-2 text-sm shrink-0 flex cursor-pointer"
              >
                <Svg.cog_8_tooth tailWindClasses="size-6" />
                <span>Gerenciar conta</span>
              </button>
            </div>

            {/* Linha 2: Filtros em grid */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-end">
              <Fields.wrapper>
                <Fields.input
                  placeholder="Buscar loja"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Buscar loja"
                />
              </Fields.wrapper>

              <Fields.wrapper>
                <Fields.select
                  options={marketplaceTypeOptions}
                  value={typeFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setTypeFilter(e.target.value)
                  }
                />
              </Fields.wrapper>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("");
                  }}
                  className="px-3 py-2 rounded-[12px] border border-black/20 text-sm text-[#1e1f21] hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Limpar
                </button>
                <div className="px-3 py-2 rounded-[12px] bg-[#f6f8fb] text-[#1e1f21] text-sm border border-black/10 min-w-[60px] text-center flex items-center justify-center">
                  {resultsCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="w-full max-w-[80vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              <ChoosenAccountSkeleton count={7} />
            ) : (
              filteredAccounts.map((item) => {
                const marketplace: BaseMarketPlace = {
                  marketplace_shop_id: item.marketplace_shop_id,
                  marketplace_name: item.marketplace_name,
                  marketplace_image: item.marketplace_image,
                  marketplace_type: item.marketplace_type as MarketplaceType,
                  status_parse: item.status_parse as MarketplaceStatusParse,
                  orders_parse_status:
                    item.orders_parse_status as MarketplaceOrderParseStatus,
                };
                return (
                  <MarketplaceCard
                    key={marketplace.marketplace_shop_id}
                    marketplace={marketplace}
                    onDelete={handleDeleteMarketplace}
                    onCardClick={async () => {
                      const res =
                        await marketplaceService.SelectMarketplaceAccount(
                          marketplace.marketplace_shop_id,
                          marketplace.marketplace_type
                        );
                      if (res.success) {
                        authStore.setState({ marketplace: res.data });
                        toast.success(
                          "Conta de marketplace selecionada com sucesso"
                        );
                      } else {
                        toast.error(res.message);
                      }
                    }}
                  />
                );
              })
            )}
            <MarketplaceCard
              onCardClick={() => handleAbrirModal({ abrir: true })}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={abrirModal}
        onClose={() => handleAbrirModal({ abrir: false })}
      >
        <Suspense fallback={<Loading />}>
          <CreateMarketplaceModal
            marketplacesAccounts={marketplacesAccounts}
            modalOpen={abrirModal}
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
    </PageLayout>
  );
}
