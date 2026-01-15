import { MarketplaceType } from "~/features/marketplace/typings";

export const CDN_IMAGES = {
  BEERGAM_FLOWER_LOGO: "https://cdn.beergam.com.br/beergam_flower_logo.webp",
  MARKETPLACE_MELI:
    "https://cdn.beergam.com.br/Mercado-Livre-Icon-Logo-Vector.svg-.png",
  MARKETPLACE_SHOPEE: "https://cdn.beergam.com.br/shopee.png",
  AUTH_CALENDAR: "https://cdn.beergam.com.br/calendar.webp",
  AUTH_CARD: "https://cdn.beergam.com.br/card.webp",
  AUTH_GRAPH: "https://cdn.beergam.com.br/graph.webp",
  AUTH_WORLD_BG: "https://cdn.beergam.com.br/world_bg.webp",
  BERGAMOTA_LOGO: "https://cdn2.beergam.com.br/landing_page/Bergamota.webp",
  ANUNCIOS_PREVIEW:
    "https://media.discordapp.net/attachments/1307841142527754314/1461442649109172394/image.png?ex=696a9207&is=69694087&hm=c1e536a6a510861778f6398f937a7f4f9823af375995fa49ca0afdc4e024bacd&=&format=webp&quality=lossless&width=1860&height=644",
  COLAB_PREVIEW: "https://media.discordapp.net/attachments/1307841142527754314/1461452767649333278/colabpreview-white-land.png?ex=696a9b74&is=696949f4&hm=8c3ab2024286e800e28f4f90688f1a5efac0fd4b396190f53116eb3a5f35604c&=&format=webp&quality=lossless&width=1450&height=800",
  LARA_WORKER: "https://cdn.beergam.com.br/petBeergam.png",
  LARA_CONFUSED: "https://cdn2.beergam.com.br/landing_page/confused-lara.webp",
  LARA_DOWNED: "https://cdn2.beergam.com.br/landing_page/downed-lara.png",
} as const;

const MARKETPLACE_IMAGES: Record<MarketplaceType, string> = {
  [MarketplaceType.MELI]: CDN_IMAGES.MARKETPLACE_MELI,
  [MarketplaceType.SHOPEE]: CDN_IMAGES.MARKETPLACE_SHOPEE,
};

export function getMarketplaceImageUrl(
  marketplaceType: MarketplaceType
): string {
  return MARKETPLACE_IMAGES[marketplaceType];
}
