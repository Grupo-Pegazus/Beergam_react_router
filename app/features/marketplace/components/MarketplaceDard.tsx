import Svg from "~/src/assets/svgs";
import meli from "~/src/img/Mercado-Livre-Icon-Logo-Vector.svg-.png";
import shopee from "~/src/img/shopee.png";
import { type BaseMarketPlace, MarketplaceType, MarketplaceStatusParse } from "../typings";
import StatusTag from "./StatusTag";
function MarketplaceTypeBadge(marketplace_type: MarketplaceType) {
  switch (marketplace_type) {
    case MarketplaceType.MELI:
      return meli;
    case MarketplaceType.SHOPEE:
      return shopee;
  }
}
interface MarketplaceCardProps {
  marketplace?: BaseMarketPlace;
  onCardClick?: () => void;
  onDelete?: (marketplace: BaseMarketPlace) => void;
}
export default function MarketplaceCard({
  marketplace,
  onCardClick,
  onDelete,
}: MarketplaceCardProps) {
  const isProcessing = marketplace?.status_parse === MarketplaceStatusParse.PROCESSING;
  const isDisabled = isProcessing;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (marketplace && onDelete && !isDisabled) {
      onDelete(marketplace);
    }
  };

  const handleCardClick = () => {
    if (!isDisabled) {
      onCardClick?.();
    }
  };
  return (
    <button
      className={`group flex justify-center items-center relative mb-4 p-8 shadow-lg/55 rounded-2xl flex-col gap-2 border-2 ${
        marketplace 
          ? `bg-beergam-white border-transparent ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-75'}` 
          : "bg-beergam-blue-primary/75 border-dashed border-beergam-white hover:opacity-75"
      }`}
      onClick={handleCardClick}
      disabled={isDisabled}
    >
      {marketplace ? (
        <>
          <div className="absolute top-2 right-2 max-w-10 max-h-10">
            <img
              className="w-full h-full"
              src={MarketplaceTypeBadge(marketplace.marketplace_type)}
              alt=""
            />
          </div>
          <img
            src={marketplace.marketplace_image}
            alt={marketplace.marketplace_name}
            className="max-w-44 max-h-44 object-cover rounded-2xl shadow-2xl"
          />
          <h3 className="text-center font-semibold truncate max-w-80">{marketplace.marketplace_name}</h3>
          
          {/* Tags de Status */}
          <div className="flex flex-col gap-1 items-center">
            <StatusTag 
              status={marketplace.status_parse} 
              type="parse" 
              className="text-xs"
            />
            <StatusTag 
              status={marketplace.orders_parse_status} 
              type="orders" 
              className="text-xs"
            />
          </div>

          {/* Overlay de processamento */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-70">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm font-medium">Processando...</p>
              </div>
            </div>
          )}

          {/* Botão de deletar - só aparece se não estiver processando */}
          {!isDisabled && (
            <div className="absolute z-10 flex items-end justify-center gap-2 bottom-0 opacity-0 group-hover:opacity-100 h-full group-hover:bottom-[-50px]">
              <button 
                className="bg-beergam-red-primary opacity-75 w-10 h-10 rounded-full hover:opacity-100 flex items-center justify-center"
                onClick={handleDeleteClick}
              >
                <Svg.trash tailWindClasses="stroke-beergam-white w-6 h-6" />
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-beergam-white">Adicionar Lojas</h2>
          <Svg.plus_circle tailWindClasses="stroke-beergam-white w-14 lg:w-20" />
        </>
      )}
    </button>
  );
}
