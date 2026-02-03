import { z } from "zod";

export const HomeSummarySchema = z.object({
  canceladas: z.object({
    quantidade: z.number(),
    valor_total: z.number(),
  }),
  faturamento_bruto: z.number(),
  lucro_liquido: z.number(),
  lucro_medio: z.number(),
  margem_percentual: z.number(),
  period_days: z.number(),
  ticket_medio: z.number(),
  unidades: z.number(),
  vendas: z.number(),
});

export type HomeSummary = z.infer<typeof HomeSummarySchema>;

export const FlexDeliveryRangeItemSchema = z.object({
  capacity: z.number(),
  from: z.number(),
  to: z.number(),
  cutoff: z.number().optional(),
});

export type FlexDeliveryRangeItem = z.infer<typeof FlexDeliveryRangeItemSchema>;

export const FlexCutoffSchema = z.object({
  has_flex: z.boolean(),
  delivery_window: z.string().optional(),
  week: z.array(FlexDeliveryRangeItemSchema).default([]),
  saturday: z.array(FlexDeliveryRangeItemSchema).default([]),
  sunday: z.array(FlexDeliveryRangeItemSchema).default([]),
});

export type FlexCutoff = z.infer<typeof FlexCutoffSchema>;

