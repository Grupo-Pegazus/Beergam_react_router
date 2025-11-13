import { MarketplaceType } from "~/features/marketplace/typings";

export const CDN_IMAGES = {
  BEERGAM_FLOWER_LOGO: "https://cdn.beergam.com.br/beergam_flower_logo.webp",
  MARKETPLACE_MELI: "https://cdn.beergam.com.br/Mercado-Livre-Icon-Logo-Vector.svg-.png",
  MARKETPLACE_SHOPEE: "https://cdn.beergam.com.br/shopee.png",
  AUTH_CALENDAR: "https://cdn.beergam.com.br/calendar.webp",
  AUTH_CARD: "https://cdn.beergam.com.br/card.webp",
  AUTH_GRAPH: "https://cdn.beergam.com.br/graph.webp",
  AUTH_WORLD_BG: "https://cdn.beergam.com.br/world_bg.webp",
} as const;

const MARKETPLACE_IMAGES: Record<MarketplaceType, string> = {
  [MarketplaceType.MELI]: CDN_IMAGES.MARKETPLACE_MELI,
  [MarketplaceType.SHOPEE]: CDN_IMAGES.MARKETPLACE_SHOPEE,
};

export function getMarketplaceImageUrl(marketplaceType: MarketplaceType): string {
  return MARKETPLACE_IMAGES[marketplaceType];
}