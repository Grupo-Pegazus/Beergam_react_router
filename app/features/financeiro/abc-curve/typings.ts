import { z } from "zod";

export const ABCCurveClassSchema = z.enum(["A", "B", "C"]);

export type ABCCurveClass = z.infer<typeof ABCCurveClassSchema>;

export const ABCCurveMarketplaceBreakdownSchema = z.object({
    marketplace: z.string(),
    marketplace_shop_id: z.string(),
    revenue: z.number(),
    units: z.number(),
});

export type ABCCurveMarketplaceBreakdown = z.infer<typeof ABCCurveMarketplaceBreakdownSchema>;

export const ABCCurveProductInfoSchema = z.object({
    product_id: z.string().nullable().optional(),
    variation_id: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
});

export type ABCCurveProductInfo = z.infer<typeof ABCCurveProductInfoSchema>;

export const ABCCurveItemSchema = z.object({
    sku: z.string(),
    title: z.string().nullable().optional(),
    abc_class: ABCCurveClassSchema,
    revenue: z.number(),
    revenue_share: z.number(),
    revenue_cumsum_share: z.number(),
    units: z.number(),
    has_product: z.boolean(),
    product: ABCCurveProductInfoSchema.nullable().optional(),
    marketplaces: z.array(ABCCurveMarketplaceBreakdownSchema),
});

export type ABCCurveItem = z.infer<typeof ABCCurveItemSchema>;

export const ABCCurveClassSummarySchema = z.object({
    count: z.number(),
    revenue: z.number(),
    share: z.number(),
});

export type ABCCurveClassSummary = z.infer<typeof ABCCurveClassSummarySchema>;

export const ABCCurveSummarySchema = z.object({
    total_skus: z.number(),
    total_revenue: z.number(),
    period_start: z.string(),
    period_end: z.string(),
    classes: z.record(ABCCurveClassSchema, ABCCurveClassSummarySchema),
});

export type ABCCurveSummary = z.infer<typeof ABCCurveSummarySchema>;

export const ABCCurveResponseSchema = z.object({
    summary: ABCCurveSummarySchema,
    items: z.array(ABCCurveItemSchema),
    pagination: z.object({
        page: z.number(),
        per_page: z.number(),
        total_count: z.number(),
        total_pages: z.number(),
        has_next: z.boolean(),
        has_prev: z.boolean(),
    }),
});

export type ABCCurveResponse = z.infer<typeof ABCCurveResponseSchema>;

export const ABCCurveFiltersSchema = z.object({
    period_alias: z.enum(["today", "yesterday", "7d", "30d", "90d", "custom"]).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort_by: z.enum(["abc_class", "revenue", "units", "sku"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
    class_in: z.array(ABCCurveClassSchema).optional(),
    has_product: z.boolean().optional(),
});

export type ABCCurveFilters = z.infer<typeof ABCCurveFiltersSchema>;

