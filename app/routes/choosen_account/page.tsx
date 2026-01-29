import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useFetcher } from "react-router";

import { Paper } from "@mui/material";
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
import Loading from "~/src/assets/loading";
import { BeergamSlider } from "~/src/components/ui/BeergamSlider";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Hint from "~/src/components/utils/Hint";
import Modal from "~/src/components/utils/Modal";
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
    const isProcessing =
      marketplace.status_parse === MarketplaceStatusParse.PROCESSING;

    if (isProcessing) {
      toast.error("Não é possível excluir uma conta enquanto ela está sendo processada");
      return;
    }

    setMarketplaceToDelete(marketplace);
    setShowDeleteModal(true);
  }

  function handleConfirmDelete() {
    if (marketplaceToDelete) {
      const isProcessing =
        marketplaceToDelete.status_parse === MarketplaceStatusParse.PROCESSING;

      if (isProcessing) {
        toast.error("Não é possível excluir uma conta enquanto ela está sendo processada");
        setShowDeleteModal(false);
        setMarketplaceToDelete(null);
        return;
      }

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
    const list = Array.isArray(marketplacesAccounts)
      ? marketplacesAccounts
      : [];
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
          <Paper>
            {/* Linha 1: Título e botão */}
            <div className="flex items-center justify-between gap-3 mb-3 lg:flex-row flex-col">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl text-beergam-typography-primary whitespace-nowrap">
                  Selecione Sua Loja
                </h2>
                <Hint
                  message="Aqui você pode selecionar a loja de marketplace que deseja usar para acessar o sistema."
                  anchorSelect="info-loja"
                />
              </div>
            </div>

            {/* Linha 2: Filtros em grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_minmax(0,500px)] gap-2 items-end">
              <div className="grid md:grid-cols-2 items-center gap-2">
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
                    widthType="full"
                    options={marketplaceTypeOptions}
                    value={typeFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setTypeFilter(e.target.value)
                    }
                  />
                </Fields.wrapper>
              </div>

              <div className="flex items-center justify-end gap-2">
                <BeergamButton
                  className="w-[20%]"
                  title="Limpar"
                  animationStyle="slider"
                  mainColor="beergam-gray"
                  icon="trash"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("");
                  }}
                />
                <BeergamButton
                  className="w-[80%]"
                  title="Adicionar Loja"
                  animationStyle="slider"
                  icon="globe"
                  onClick={() => handleAbrirModal({ abrir: true })}
                />
              </div>
            </div>
          </Paper>
        </div>

        {/* Grid de cards */}
        <div className="w-full max-w-[80vw] relative">
          <div className="">
            {isLoading ? (
              <Loading />
            ) : (
              <BeergamSlider
                slidesPerView={1}
                mousewheel={{ enabled: true, sensitivity: 1 }}
                keyboard={{ enabled: true, pageUpDown: true }}
                breakpoints={{
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                slidesClassName="bg-transparent!"
                slides={filteredAccounts.map((item) => {
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
                      className="border! border-beergam-input-border!"
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
                })}
              />
            )}
          </div>
          {/* <div className="absolute! top-0! right-0! bottom-0! w-[27%] h-full!">
            <MarketplaceCard
              className="w-full h-[88%]!"
              onCardClick={() => handleAbrirModal({ abrir: true })}
            />
          </div> */}
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
