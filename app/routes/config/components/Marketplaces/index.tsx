import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthMarketplace } from "~/features/auth/context/AuthStoreContext";
import MarketplaceCard from "~/features/marketplace/components/MarketplaceCard";
import { useAccountPolling } from "~/features/marketplace/hooks/useAccountPolling";
import { marketplaceService } from "~/features/marketplace/service";
import {
  type BaseMarketPlace,
  MarketplaceType,
  MarketplaceTypeLabel,
} from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import UserFields from "~/features/user/components/UserFields";
import CreateMarketplaceModal from "~/routes/choosen_account/components/CreateMarketplaceModal";
import DeleteMarketaplceAccount from "~/routes/choosen_account/components/DeleteMarketaplceAccount";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import toast from "~/src/utils/toast";
export default function Marketplaces() {
  const { openModal, closeModal, isOpen } = useModal();
  const selectedMarketplace = useAuthMarketplace();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<MarketplaceType | null>(null);
  const queryClient = useQueryClient();
  const { data: marketplaces } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
  });
  const accounts: BaseMarketPlace[] =
    (marketplaces?.data as BaseMarketPlace[]) || [];
  useAccountPolling(accounts);
  const filteredMarketplaces = marketplaces?.data
    ?.filter((marketplace) =>
      marketplace.marketplace_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((marketplace) =>
      type ? marketplace.marketplace_type === type : true
    );
  const totalMarketplaces = marketplaces?.data?.length || 0;
  const [marketplaceToDelete, setMarketplaceToDelete] =
    useState<BaseMarketPlace | null>(null);
  const deleteAccount = useMutation({
    mutationFn: (marketplaceToDelete: BaseMarketPlace) => {
      return marketplaceService.deleteMarketplaceAccount(
        marketplaceToDelete.marketplace_shop_id,
        marketplaceToDelete.marketplace_type
      );
    },
    onSuccess: (data) => {
      // if (!data.success) {
      //   throw new Error(data.message);
      // }
      if (
        marketplaceToDelete?.marketplace_shop_id ===
        selectedMarketplace?.marketplace_shop_id
      ) {
        authStore.setState({ marketplace: null });
        setMarketplaceToDelete(null);
      }
      queryClient.invalidateQueries({
        queryKey: ["marketplacesAccounts"],
      });
    },
  });
  function handleConfirmDelete(marketplaceToDelete: BaseMarketPlace) {
    setMarketplaceToDelete(marketplaceToDelete);
    toast.promise(deleteAccount.mutateAsync(marketplaceToDelete), {
      loading: "Deletando conta...",
      success: "Conta deletada com sucesso",
      error: "Erro ao deletar conta",
    });
  }
  return (
    <>
      <Section
        title="Marketplaces"
        className="bg-beergam-white"
        actions={
          <BeergamButton
            title="Adicionar Marketplace"
            icon="plus"
            onClick={() =>
              openModal(
                <CreateMarketplaceModal
                  marketplacesAccounts={marketplaces?.data ?? []}
                  modalOpen={isOpen}
                />,
                { title: "Adicionar Marketplace" }
              )
            }
          />
        }
      >
        <div className="grid md:grid-cols-3  gap-4">
          <UserFields
            label="Pesquisar Marketplaces"
            name="Marketplace"
            placeholder="Digite o nome do Marketplace"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            canAlter={true}
          />
          <UserFields
            label="Tipo de Marketplace"
            name="Marketplace Type"
            placeholder="Selecione o tipo de Marketplace"
            options={Object.values(MarketplaceType).map((type) => ({
              value: type,
              label: MarketplaceTypeLabel[type],
            }))}
            value={type ?? undefined}
            nullable={true}
            onChange={(e) =>
              setType(
                e.target.value ? (e.target.value as MarketplaceType) : null
              )
            }
            canAlter={true}
          />
          <UserFields
            label="Contas Encontradas"
            name="Contas Encontradas"
            value={`${filteredMarketplaces?.length ?? 0} de ${totalMarketplaces}`}
            canAlter={false}
          />
        </div>
        <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
          {filteredMarketplaces && filteredMarketplaces?.length > 0 ? (
            filteredMarketplaces?.map((marketplace) => (
              <MarketplaceCard
                key={marketplace.marketplace_shop_id}
                marketplace={marketplace}
                onDelete={() => {
                  openModal(
                    <DeleteMarketaplceAccount
                      marketplaceToDelete={marketplace}
                      handleCancelDelete={() => {
                        closeModal();
                      }}
                      handleConfirmDelete={() => {
                        handleConfirmDelete(marketplace);
                      }}
                    />,
                    { title: "Deletar Marketplace" }
                  );
                }}
                selected={
                  marketplace.marketplace_shop_id ===
                  selectedMarketplace?.marketplace_shop_id
                }
                onCardClick={async () => {
                  const res = await marketplaceService.SelectMarketplaceAccount(
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
            ))
          ) : (
            <p>Nenhuma conta encontrada</p>
          )}
        </div>
      </Section>
    </>
  );
}
