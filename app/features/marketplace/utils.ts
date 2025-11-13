import {
  MarketplaceType,
  MarketplaceTypeAvailable,
  MarketplaceTypeLabel,
  type MarketplaceVisualInfo,
} from "./typings";
import { getMarketplaceImageUrl } from "~/src/constants/cdn-images";

export function getAvailableMarketplaces(): MarketplaceVisualInfo[] {
  return Object.values(MarketplaceType).map((marketplace) => ({
    value: marketplace,
    label: MarketplaceTypeLabel[marketplace],
    image: getMarketplaceImageUrl(marketplace),
    available: MarketplaceTypeAvailable[marketplace],
  }));
}
