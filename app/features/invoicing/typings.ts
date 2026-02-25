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
    internal_cost: z.number(),
});

export type IncomingsBySkuSchemaType = z.infer<typeof IncomingsBySkuSchema>;

export const SelfServiceReturnSchema = z.record(z.enum(AVAILABLE_PERIODS.map(String)), z.object({
    total_orders: z.number(),
    valor_recebido_do_flex: z.number(),
}));

export type SelfServiceReturnSchemaType = z.infer<typeof SelfServiceReturnSchema>;

export const MonthlySeriesEntrySchema = z.object({
    month: z.string(),
    quantity: z.number(),
});

export const SkuMonthlySalesSchema = z.object({
    sku: z.string(),
    total_quantity: z.number(),
    monthly_series: z.array(MonthlySeriesEntrySchema),
});

export const SalesBySkuMonthlySchema = z.object({
    months: z.array(z.string()),
    skus: z.array(SkuMonthlySalesSchema),
    period: z.object({
        date_from: z.string(),
        date_to: z.string(),
        months_requested: z.number(),
        months_allowed: z.number(),
    }),
});

export type MonthlySeriesEntryType = z.infer<typeof MonthlySeriesEntrySchema>;
export type SkuMonthlySalesType = z.infer<typeof SkuMonthlySalesSchema>;
export type SalesBySkuMonthlyType = z.infer<typeof SalesBySkuMonthlySchema>;

