import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form } from "react-router";
import type {
  BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import { getAvailableMarketplaces } from "~/features/marketplace/utils";
import type { IUser } from "~/features/user/typings/User";
import Svg from "~/src/assets/svgs";
import type { RootState } from "~/store";
import AvailableMarketplaceCard from "./AvailableMarketplaceCard";

export default function CreateMarketplaceModal({
  marketplacesAccounts,
  modalOpen,
}: {
  marketplacesAccounts: BaseMarketPlace[] | null;
  HandleIntegrationData?: (params: { Marketplace: MarketplaceType }) => void;
  modalOpen: boolean;
}) {
  const user = useSelector((state: RootState) => state.auth.user) as IUser;
  const availableAccounts =
    user?.details?.subscriptions?.[0]?.plan?.benefits?.ML_accounts ?? 0;
  const remainingAccounts =
    availableAccounts - (marketplacesAccounts?.length || 0);

  // Estado para armazenar o marketplace selecionado
  const [selectedMarketplace, setSelectedMarketplace] =
    useState<MarketplaceType | null>(null);
  useEffect(() => {
    setSelectedMarketplace(null);
  }, [modalOpen]);

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    if (!selectedMarketplace) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Form
      method="post"
      className="flex flex-col gap-4 items-center justify-center"
      onSubmit={handleSubmit}
    >
      <h2>Selecione o Marketplace desejado</h2>
      <p>
        Quantidade de Lojas adicionadas: {marketplacesAccounts?.length || 0}
      </p>
      <p>Contas restantes: {remainingAccounts || 0}</p>

      {/* Campo oculto para armazenar o valor do marketplace selecionado */}
      <input
        name="Marketplace"
        value={selectedMarketplace || ""}
        type="hidden"
      />

      <div className="grid grid-cols-4 gap-4 relative">
        {remainingAccounts === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-10 flex-col rounded-2xl">
            <h2 className="text-beergam-red">
              Você atingiu o limite de contas disponíveis
            </h2>
            <Svg.lock_closed
              width={100}
              height={100}
              tailWindClasses="stroke-beergam-red"
            />
          </div>
        )}
        {getAvailableMarketplaces().map((marketplace) => (
          <AvailableMarketplaceCard
            key={marketplace.value}
            marketplace={marketplace}
            isSelected={selectedMarketplace === marketplace.value}
            onCardClick={() => {
              setSelectedMarketplace(marketplace.value);
            }}
          />
        ))}
      </div>

      {selectedMarketplace && (
        <button
          type="submit"
          className="mt-4 p-2 bg-beergam-blue-primary text-white rounded-md hover:bg-beergam-orange"
        >
          Continuar
        </button>
      )}
    </Form>
  );
}
