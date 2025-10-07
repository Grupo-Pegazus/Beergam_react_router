import z from "zod";

export enum MarketplaceType {
  MELI = "meli",
  SHOPEE = "shopee",
}

export const MarketplaceTypeAvailable: Record<MarketplaceType, boolean> = {
  //Aqui é definido se o marketplace está disponível ou não para todos os usuários e planos
  [MarketplaceType.MELI]: true,
  [MarketplaceType.SHOPEE]: false,
};

export const MarketplaceTypeLabel: Record<MarketplaceType, string> = {
  //Serve para exibir o nome do marketplace de uma forma mais amigável
  [MarketplaceType.MELI]: "Mercado Livre",
  [MarketplaceType.SHOPEE]: "Shopee",
};

export interface MarketplaceVisualInfo {
  value: MarketplaceType;
  label: string;
  image: string;
  available: boolean;
}

export enum MarketplaceStatusParse {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  ERROR = "error",
}

export enum MarketplaceOrderParseStatus {
  NONE = "none",
  FIFTEEN_DAYS = "fifteen_days",
  COMPLETED = "completed",
}

export interface BaseMarketPlace {
  marketplace_name: string;
  marketplace_image: string;
  marketplace_type: MarketplaceType;
  status_parse: MarketplaceStatusParse;
  orders_parse_status: MarketplaceOrderParseStatus;
}
export const BaseMarketPlaceSchema = z.object({
  marketplace_name: z.string(),
  marketplace_image: z.string(),
  marketplace_type: z.enum(
    Object.keys(MarketplaceType) as [MarketplaceType, ...MarketplaceType[]]
  ),
  status_parse: z.enum(
    Object.keys(MarketplaceStatusParse) as [
      MarketplaceStatusParse,
      ...MarketplaceStatusParse[],
    ]
  ),
  orders_parse_status: z.enum(
    Object.keys(MarketplaceOrderParseStatus) as [
      MarketplaceOrderParseStatus,
      ...MarketplaceOrderParseStatus[],
    ]
  ),
}) satisfies z.ZodType<BaseMarketPlace>;

export interface IntegrationData {
  app_id: string | null;
  redirect_uri: string | null;
  integration_url: string;
  state: string;
}
