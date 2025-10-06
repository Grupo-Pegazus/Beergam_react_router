import { useState } from "react";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import MarketplaceCard from "~/features/marketplace/components/MarketplaceDard";
import {
  MarketplaceOrderParseStatus,
  MarketplaceStatusParse,
  MarketplaceType,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import Hint from "~/src/components/utils/Hint";
import Modal from "~/src/components/utils/Modal";
import CreateMarketplaceModal from "./components/CreateMarketplaceModal";
interface ChoosenAccountPageProps {
  marketplacesAccounts: BaseMarketPlace[] | null;
  isLoading?: boolean;
}
export default function ChoosenAccountPage({
  marketplacesAccounts,
  isLoading = false,
}: ChoosenAccountPageProps) {
  const [abrirModal, setAbrirModal] = useState(false);
  function handleAbrirModal({ abrir }: { abrir: boolean }) {
    setAbrirModal(abrir);
  }
  return (
    console.log("marketplacesAccounts", marketplacesAccounts),
    (
      <PageLayout>
        <div className="justify-center items-center flex flex-col p-2">
          {/* <h1>Escolha a conta de marketplace</h1> */}
          <header className="mb-4 p-8 shadow-lg/55 rounded-2xl w-3/4 bg-beergam-white flex align-center gap-4">
            <div className="flex gap-8 w-[70%] items-center">
              <div className="flex gap-4 items-center">
                <h2 className="text-beergam-blue-primary text-nowrap">
                  Selecione sua loja
                </h2>
                <Hint message="Informação importante" />
              </div>
              <div className="flex gap-4 items-center max-w-[500px] w-full">
                <Fields.wrapper>
                  <Fields.input
                    placeholder="Buscar loja"
                    value={""}
                    hasError={false}
                  />
                </Fields.wrapper>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <button className="bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white px-4 py-2 rounded-md flex items-center gap-2">
                <Svg.cog_8_tooth />
                <p>Gerenciar Perfil</p>
              </button>
            </div>
          </header>
          <div className="w-3/4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {isLoading ? (
              <div>
                <h1>Carregando... AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</h1>
              </div>
            ) : (
              marketplacesAccounts?.map((item) => {
                const marketplace: BaseMarketPlace = {
                  marketplace_name: item.marketplace_name,
                  marketplace_image: item.marketplace_image,
                  marketplace_type: item.marketplace_type as MarketplaceType,
                  status_parse: item.status_parse as MarketplaceStatusParse,
                  orders_parse_status:
                    item.orders_parse_status as MarketplaceOrderParseStatus,
                };
                return (
                  <MarketplaceCard
                    key={marketplace.marketplace_name}
                    marketplace={marketplace}
                  />
                );
              })
            )}
            <MarketplaceCard
              onCardClick={() => handleAbrirModal({ abrir: true })}
            />
          </div>
        </div>
        <Modal
          abrir={abrirModal}
          onClose={() => handleAbrirModal({ abrir: false })}
        >
          <CreateMarketplaceModal marketplacesAccounts={marketplacesAccounts} />
        </Modal>
      </PageLayout>
    )
  );
}
