import { useState, useEffect, useMemo } from "react";
import { useFetcher, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setMarketplace } from "~/features/marketplace/redux";
import { marketplaceService } from "~/features/marketplace/service";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import MarketplaceCard from "~/features/marketplace/components/MarketplaceDard";
import {
  MarketplaceOrderParseStatus,
  MarketplaceStatusParse,
  MarketplaceType,
  MarketplaceTypeLabel,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import Hint from "~/src/components/utils/Hint";
import Modal from "~/src/components/utils/Modal";
import CreateMarketplaceModal from "./components/CreateMarketplaceModal";
import DeleteMarketaplceAccount from "./components/DeleteMarketaplceAccount";
import toast from "react-hot-toast";
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
  const [marketplaceToDelete, setMarketplaceToDelete] = useState<BaseMarketPlace | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("");
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (fetcher.data && fetcher.data.success && fetcher.state === "idle") {
      queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
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
      formData.append("marketplaceId", marketplaceToDelete.marketplace_shop_id || "");
      formData.append("marketplaceType", marketplaceToDelete.marketplace_type);
      
      fetcher.submit(formData, { 
        method: "post"
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
    const list = marketplacesAccounts || [];
    const byText = searchTerm.trim().toLowerCase();
    return list.filter((acc) => {
      const matchText = byText
        ? acc.marketplace_name.toLowerCase().includes(byText)
        : true;
      const matchType = typeFilter && typeFilter !== ""
        ? acc.marketplace_type === (typeFilter as MarketplaceType)
        : true;
      return matchText && matchType;
    });
  }, [marketplacesAccounts, searchTerm, typeFilter]);
  const resultsCount = filteredAccounts.length;
  return (
    <PageLayout>
      <div className="justify-center items-center flex flex-col p-2">
        {/* <h1>Escolha a conta de marketplace</h1> */}
        <header className="mb-4 p-6 shadow-lg/55 rounded-2xl w-3/4 bg-beergam-white flex items-center justify-between gap-6">
          <div className="flex gap-3 items-center">
            <div className="flex gap-3 items-center">
              <h2 className="text-beergam-blue-primary text-nowrap">
                Selecione sua loja
              </h2>
              <Hint message="Aqui você pode selecionar a loja de marketplace que deseja usar para acessar o sistema." anchorSelect="info-loja" />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full max-w-[760px]">
            <div className="flex-1">
              <Fields.wrapper>
                <Fields.input
                  placeholder="Buscar loja"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Buscar loja"
                />
              </Fields.wrapper>
            </div>
            <div className="w-[220px]">
              <Fields.wrapper>
                <Fields.select
                  options={marketplaceTypeOptions}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
              </Fields.wrapper>
            </div>
            <button
              type="button"
              onClick={() => { setSearchTerm(""); setTypeFilter(""); }}
              className="px-3 py-2 rounded-[12px] border border-black/20 text-sm text-[#1e1f21] hover:bg-gray-50 transition-colors"
            >
              Limpar
            </button>
            <div className="px-3 py-2 rounded-[12px] bg-[#f6f8fb] text-[#1e1f21] text-sm border border-black/10 whitespace-nowrap">
              {resultsCount} resultado{resultsCount === 1 ? "" : "s"}
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
              <h1>Carregando...</h1>
            </div>
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
                  key={marketplace.marketplace_name}
                  marketplace={marketplace}
                  onDelete={handleDeleteMarketplace}
                  onCardClick={async () => {
                    const res = await marketplaceService.SelectMarketplaceAccount(
                      marketplace.marketplace_shop_id,
                      marketplace.marketplace_type
                    );
                    if (res.success) {
                      dispatch(setMarketplace({
                        marketplace_shop_id: res.data.marketplace_shop_id,
                        marketplace_name: res.data.marketplace_name,
                        marketplace_image: res.data.marketplace_image,
                        marketplace_type: res.data.marketplace_type as MarketplaceType,
                        status_parse: res.data.status_parse as MarketplaceStatusParse,
                        orders_parse_status: res.data.orders_parse_status as MarketplaceOrderParseStatus,
                      }));
                      toast.success("Conta de marketplace selecionada com sucesso");
                      navigate("/interno");
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
      <Modal
        abrir={abrirModal}
        onClose={() => handleAbrirModal({ abrir: false })}
      >
        <CreateMarketplaceModal
          marketplacesAccounts={marketplacesAccounts}
          modalOpen={abrirModal}
        />
      </Modal>

      {/* Modal de confirmação de deletar */}
      <Modal
        abrir={showDeleteModal}
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
