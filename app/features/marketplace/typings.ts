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
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export const MarketplaceStatusParseLabel: Record<
  MarketplaceStatusParse,
  string
> = {
  [MarketplaceStatusParse.PENDING]: "Pendente",
  [MarketplaceStatusParse.PROCESSING]: "Processando",
  [MarketplaceStatusParse.COMPLETED]: "Completo",
  [MarketplaceStatusParse.ERROR]: "Erro",
};

export interface BaseMarketPlace {
  marketplace_shop_id: string;
  marketplace_name: string;
  marketplace_image: string;
  marketplace_type: MarketplaceType;
  status_parse: MarketplaceStatusParse;
}
export const BaseMarketPlaceSchema = z.object({
  marketplace_shop_id: z.string(),
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
}) satisfies z.ZodType<BaseMarketPlace>;

export interface IntegrationData {
  app_id: string | null;
  redirect_uri: string | null;
  integration_url: string;
  state: string;
}

export interface IntegrationStatus {
  error_code: string | null;
  error_detail: string | null;
  marketplace_shop_id: string | null;
  message: string;
  state: string;
  status: "pending" | "success" | "error";
  updated_at: string;
}

export type ImportProgressStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "error"
  | "unknown";

export type ImportPhaseStatus = "pending" | "in_progress" | "completed";

export interface ImportPhase {
  name: string;
  label: string;
  status: ImportPhaseStatus;
  detail: string | null;
  weight: number;
}

export interface ImportProgress {
  status: ImportProgressStatus;
  progress_pct: number;
  eta_seconds: number | null;
  eta_formatted: string | null;
  elapsed_seconds: number | null;
  current_phase: string | null;
  phases: ImportPhase[];
  error_message?: string | null;
}
