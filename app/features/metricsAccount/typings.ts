import z from "zod";
import { MarketplaceType } from "../marketplace/typings";

export const MeliReputationSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  seller_reputation: z.object({
    level_id: z.string().nullable(),
    power_seller_status: z.string().nullable(),
    transactions: z.object({
      period: z.string(),
      total: z.number(),
    }),
  }),
  site_id: z.string(),
  status: z.object({
    site_status: z.string(),
  }),
});

const ShopeeReputationSchema = z.object({}).passthrough();

export const MarketplaceReputationSchemas = {
  [MarketplaceType.MELI]: MeliReputationSchema,
  [MarketplaceType.SHOPEE]: ShopeeReputationSchema,
} as const;

type MarketplaceReputationPayloadMap = {
  [MarketplaceType.MELI]: z.infer<typeof MeliReputationSchema>;
  [MarketplaceType.SHOPEE]: z.infer<typeof ShopeeReputationSchema>;
};

export type MarketplaceReputationPayload<T extends MarketplaceType> =
  MarketplaceReputationPayloadMap[T];

export interface MarketplaceReputationData<T extends MarketplaceType> {
  marketplace_shop_id: string;
  marketplace_type: T;
  reputation: MarketplaceReputationPayload<T>;
}

// ================== Schedule Times (Horário de Corte) ==================

export const MeliScheduleDaySchema = z.object({
  detail: z
    .array(
      z.object({
        carrier: z.object({
          id: z.string().nullable(),
          name: z.string().nullable(),
        }),
        cutoff: z.string(), // "23:59"
        driver: z.object({
          id: z.string().nullable(),
          name: z.string().nullable(),
        }),
        facility_id: z.string().nullable(),
        from: z.string().nullable(),
        logistic_type: z.string(),
        milkrun_same_day: z.boolean().nullable(),
        sla: z.string().nullable(),
        to: z.string().nullable(),
        vehicle: z.object({
          id: z.string().nullable(),
          license_plate: z.string().nullable(),
          new_driver: z.boolean().nullable(),
          only_for_today: z.boolean().nullable(),
          vehicle_type: z.string().nullable(),
        }),
      }),
    )
    .nullable(),
  is_past: z.boolean(),
  work: z.boolean(),
});

export const MeliScheduleSchema = z.object({
  logistic_types: z.array(z.string()),
  marketplace_shop_id: z.string(),
  marketplace_type: z.literal(MarketplaceType.MELI),
  results_by_logistic_type: z.record(
    z.string(),
    z.object({
      node_id: z.string().nullable(),
      schedule: z.object({
        monday: MeliScheduleDaySchema.optional(),
        tuesday: MeliScheduleDaySchema.optional(),
        wednesday: MeliScheduleDaySchema.optional(),
        thursday: MeliScheduleDaySchema.optional(),
        friday: MeliScheduleDaySchema.optional(),
        saturday: MeliScheduleDaySchema.optional(),
        sunday: MeliScheduleDaySchema.optional(),
      }),
      seller_id: z.string().nullable(),
    }),
  ),
  schedule_mode: z.string(),
});

export const ShopeeScheduleSchema = z.object({}).passthrough();

type MarketplaceSchedulePayloadMap = {
  [MarketplaceType.MELI]: z.infer<typeof MeliScheduleSchema>;
  [MarketplaceType.SHOPEE]: z.infer<typeof ShopeeScheduleSchema>;
};

export type MarketplaceSchedulePayload<T extends MarketplaceType> =
  MarketplaceSchedulePayloadMap[T];

export interface MarketplaceScheduleData<T extends MarketplaceType> {
  marketplace_shop_id: string;
  marketplace_type: T;
  schedule: MarketplaceSchedulePayload<T>;
}

// ========== VISITAS ==========

export const MeliVisitsSchema = z.object({
  marketplace_shop_id: z.string(),
  marketplace_type: z.literal(MarketplaceType.MELI),
  series_windows: z.array(z.number()),
  timeseries: z.record(
    z.string(),
    z.record(z.string(), z.number()),
  ),
  totals: z.record(z.string(), z.number()),
  window_days: z.array(z.number()),
});

export const ShopeeVisitsSchema = z.object({}).passthrough();

export const MarketplaceVisitsSchemas = {
  [MarketplaceType.MELI]: MeliVisitsSchema,
  [MarketplaceType.SHOPEE]: ShopeeVisitsSchema,
} as const;

type MarketplaceVisitsPayloadMap = {
  [MarketplaceType.MELI]: z.infer<typeof MeliVisitsSchema>;
  [MarketplaceType.SHOPEE]: z.infer<typeof ShopeeVisitsSchema>;
};

export type MarketplaceVisitsPayload<T extends MarketplaceType> =
  MarketplaceVisitsPayloadMap[T];

export interface MarketplaceVisitsData<T extends MarketplaceType> {
  marketplace_shop_id: string;
  marketplace_type: T;
  visits: MarketplaceVisitsPayload<T>;
}


