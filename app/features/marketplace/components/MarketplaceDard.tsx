import Svg from "~/src/assets/svgs";
import meli from "~/src/img/Mercado-Livre-Icon-Logo-Vector.svg-.png";
import shopee from "~/src/img/shopee.png";
import { type BaseMarketPlace, MarketplaceType } from "../typings";
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
}
export default function MarketplaceCard({
  marketplace,
  onCardClick,
}: MarketplaceCardProps) {
  console.log("marketplace recebido", marketplace);
  return (
    <button
      className={`group flex justify-center items-center relative mb-4 p-8 shadow-lg/55 rounded-2xl flex-col gap-2 border-2 ${marketplace ? "bg-beergam-white border-transparent" : "bg-beergam-blue-primary/75 border-dashed border-beergam-white"} hover:opacity-75`}
      onClick={onCardClick}
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
            className="max-w-44 max-h-44 object-cover rounded-2xl"
          />
          <h3>{marketplace.marketplace_name}</h3>
        </>
      ) : (
        <>
          <h2 className="text-beergam-white">Adicionar loja</h2>
          <Svg.plus_circle width={100} tailWindClasses="stroke-beergam-white" />
        </>
      )}
    </button>
  );
}
