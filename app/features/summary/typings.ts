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

