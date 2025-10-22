import meli from "~/src/img/Mercado-Livre-Icon-Logo-Vector.svg-.png";
import shopee from "~/src/img/shopee.png";
import {
  MarketplaceType,
  MarketplaceTypeAvailable,
  MarketplaceTypeLabel,
  type MarketplaceVisualInfo,
} from "./typings";

export function getAvailableMarketplaces(): MarketplaceVisualInfo[] {
  return Object.values(MarketplaceType).map((marketplace) => ({
    value: marketplace,
    label: MarketplaceTypeLabel[marketplace],
    image: marketplace === MarketplaceType.MELI ? meli : shopee,
    available: MarketplaceTypeAvailable[marketplace],
  }));
}
