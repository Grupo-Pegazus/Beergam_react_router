import z from "zod";
import { MarketplaceType } from "../marketplace/typings";

export const MonthKeys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const;
export const TranslatedMonthKeys: Record<MonthKey, string> = {
  "1": "Janeiro",
  "2": "Fevereiro",
  "3": "Março",
  "4": "Abril",
  "5": "Maio",
  "6": "Junho",
  "7": "Julho",
  "8": "Agosto",
  "9": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
} as const;
export type MonthKey = (typeof MonthKeys)[number];

export const TaxesMonthsSchema = z.object(
  MonthKeys.reduce(
    (shape, key) => {
      shape[key] = z.number().min(0);
      return shape;
    },
    {} as Record<MonthKey, z.ZodNumber>
  )
);

export type TaxesMonths = z.infer<typeof TaxesMonthsSchema>;

export const TaxesDataSchema = z
  .object({
    ano: z.number().int().gte(1900).lte(3000),
    impostos: TaxesMonthsSchema,
    marketplace_shop_id: z
      .union([z.string(), z.number()])
      .transform((v) => String(v)),
    marketplace_type: z
      .string()
      .transform((v) => v as MarketplaceType)
      .refine(
        (v) => Object.values(MarketplaceType).includes(v as MarketplaceType),
        {
          message: "marketplace_type inválido",
        }
      ),
  })
  .strict();

export type TaxesData = z.infer<typeof TaxesDataSchema>;

export const TaxesResponseSchema = z
  .object({
    data: TaxesDataSchema,
    message: z.string().optional(),
    success: z.boolean(),
  })
  .passthrough();

export type TaxesResponse = z.infer<typeof TaxesResponseSchema>;

export const UpsertTaxPayloadSchema = z
  .object({
    marketplace_shop_id: z.string().min(1),
    marketplace_type: z.nativeEnum(MarketplaceType),
    year: z.string().regex(/^\d{4}$/),
    month: z.string().regex(/^\d{1,2}$/),
    tax_rate: z
      .string()
      .transform((v) => v.replace(",", "."))
      .refine(
        (v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
        {
          message: "tax_rate deve ser um número entre 0 e 100",
        }
      ),
  })
  .strict();

export type UpsertTaxPayload = z.infer<typeof UpsertTaxPayloadSchema>;

export const UpsertTaxResponseSchema = z.object({
  data: z.object({ id: z.number().nullable(), tax_rate: z.number() }).strict(),
  message: z.string().optional(),
  success: z.boolean(),
});

export type UpsertTaxResponse = z.infer<typeof UpsertTaxResponseSchema>;

export const RecalcPeriodPayloadSchema = z
  .object({ year: z.number().int(), month: z.number().int().min(1).max(12) })
  .strict();

export type RecalcPeriodPayload = z.infer<typeof RecalcPeriodPayloadSchema>;

export const RecalcStatusSchema = z.object({
  data: z
    .object({
      can_recalculate: z.boolean(),
      last_recalculation: z.unknown().nullable(),
      month: z.number().int().min(1).max(12),
      monthly_limit: z.number().int().nonnegative(),
      recalculation_count: z.number().int().nonnegative(),
      remaining_recalculations: z.number().int().nonnegative(),
      user_pin: z.string(),
      year: z.number().int(),
    })
    .strict(),
  message: z.string().optional(),
  success: z.boolean(),
});

export type RecalcStatusResponse = z.infer<typeof RecalcStatusSchema>;
