import { z } from "zod";
import { OrdersMetricsSchema } from "../vendas/typings";


const AVAILABLE_PERIODS = [30, 60, 90] as const;

export const InvoicingMetricsSchema = z.record(
    z.enum(AVAILABLE_PERIODS.map(String)),
    OrdersMetricsSchema
);

export type InvoicingMetricsSchemaType = z.infer<typeof InvoicingMetricsSchema>;

export const IncomingsBySkuSchema = z.object({
    avg_profit_per_unit: z.number(),
    margin_pct: z.number(),
    mlb: z.string(),
    orders_count: z.number(),
    sku: z.string(),
    thumbnail: z.string().url(),
    title: z.string(),
    total_profit: z.number(),
    total_revenue: z.number(),
    units: z.number(),
});

export type IncomingsBySkuSchemaType = z.infer<typeof IncomingsBySkuSchema>;