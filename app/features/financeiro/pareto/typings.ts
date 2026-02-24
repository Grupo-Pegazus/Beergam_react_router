import { z } from "zod";

export const ParetoMetricSchema = z.enum(["revenue", "units", "profit"]);

export type ParetoMetric = z.infer<typeof ParetoMetricSchema>;

export const ParetoSummarySchema = z.object({
    metric: z.string(),
    total_skus: z.number(),
    total_value: z.number(),
    pareto_line_skus: z.number(),
    pareto_line_pct: z.number(),
    period_start: z.string(),
    period_end: z.string(),
});

export type ParetoSummary = z.infer<typeof ParetoSummarySchema>;

export const ParetoChartItemSchema = z.object({
    sku: z.string(),
    title: z.string().nullable().optional(),
    value: z.number(),
    share: z.number(),
    cumulative_share: z.number(),
    rank: z.number(),
});

export type ParetoChartItem = z.infer<typeof ParetoChartItemSchema>;

export const ParetoChartResponseSchema = z.object({
    metric: z.string(),
    summary: ParetoSummarySchema,
    chart_data: z.array(ParetoChartItemSchema),
});

export type ParetoChartResponse = z.infer<typeof ParetoChartResponseSchema>;

export const ParetoMarketplaceBreakdownSchema = z.object({
    marketplace: z.string(),
    marketplace_shop_id: z.string(),
    revenue: z.number(),
    units: z.number(),
});

export type ParetoMarketplaceBreakdown = z.infer<typeof ParetoMarketplaceBreakdownSchema>;

export const ParetoProductInfoSchema = z.object({
    product_id: z.string().nullable().optional(),
    variation_id: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
});

export type ParetoProductInfo = z.infer<typeof ParetoProductInfoSchema>;

export const ParetoTableItemSchema = z.object({
    sku: z.string(),
    title: z.string().nullable().optional(),
    rank: z.number(),
    revenue: z.number(),
    revenue_share: z.number(),
    units: z.number(),
    units_share: z.number(),
    profit: z.number(),
    profit_share: z.number(),
    cumulative_share: z.number(),
    has_product: z.boolean(),
    product: ParetoProductInfoSchema.nullable().optional(),
    marketplaces: z.array(ParetoMarketplaceBreakdownSchema),
});

export type ParetoTableItem = z.infer<typeof ParetoTableItemSchema>;

export const ParetoTableResponseSchema = z.object({
    metric: z.string(),
    summary: ParetoSummarySchema,
    items: z.array(ParetoTableItemSchema),
    pagination: z.object({
        page: z.number(),
        per_page: z.number(),
        total_count: z.number(),
        total_pages: z.number(),
        has_next: z.boolean(),
        has_prev: z.boolean(),
    }),
});

export type ParetoTableResponse = z.infer<typeof ParetoTableResponseSchema>;

export const ParetoChartFiltersSchema = z.object({
    metric: ParetoMetricSchema.optional(),
    period_alias: z.enum(["today", "yesterday", "7d", "30d", "90d", "custom"]).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    top_n: z.number().min(1).max(50).optional(),
});

export type ParetoChartFilters = z.infer<typeof ParetoChartFiltersSchema>;

export const ParetoTableFiltersSchema = z.object({
    metric: ParetoMetricSchema.optional(),
    period_alias: z.enum(["today", "yesterday", "7d", "30d", "90d", "custom"]).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort_by: z.enum(["revenue", "units", "profit", "sku"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
});

export type ParetoTableFilters = z.infer<typeof ParetoTableFiltersSchema>;
