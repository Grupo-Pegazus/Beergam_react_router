import { z } from "zod";

export const FullSuggestionSortBySchema = z.enum([
    "abc_class",
    "suggested_quantity",
    "sales_in_period",
    "daily_avg_sales",
    "current_full_stock",
    "estimated_investment",
    "sku",
]);

export type FullSuggestionSortBy = z.infer<typeof FullSuggestionSortBySchema>;

export const FullSuggestionPeriodAliasSchema = z.enum(["today", "yesterday", "7d", "30d", "90d", "custom"]);

export type FullSuggestionPeriodAlias = z.infer<typeof FullSuggestionPeriodAliasSchema>;

export const FullSuggestionFiltersSchema = z.object({
    coverage_days: z.number().min(1).max(365).optional(),
    period_alias: FullSuggestionPeriodAliasSchema.optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort_by: FullSuggestionSortBySchema.optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
});

export type FullSuggestionFilters = z.infer<typeof FullSuggestionFiltersSchema>;

export const FullSuggestionVariationSchema = z.object({
    variation_id: z.string(),
    sku: z.string().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    attributes: z.array(z.record(z.unknown())).nullable().optional(),
    price: z.number(),
    sales_in_period: z.number(),
    daily_avg_sales: z.number(),
    current_full_stock: z.number(),
    coverage_days_remaining: z.number().nullable().optional(),
    suggested_quantity: z.number(),
    estimated_investment: z.number().nullable().optional(),
    has_product: z.boolean(),
    investment_is_estimate: z.boolean(),
});

export type FullSuggestionVariation = z.infer<typeof FullSuggestionVariationSchema>;

export const FullSuggestionItemSchema = z.object({
    mlb: z.string(),
    sku: z.string().nullable().optional(),
    title: z.string(),
    thumbnail: z.string().nullable().optional(),
    link: z.string().nullable().optional(),
    price: z.number(),
    abc_class: z.enum(["A", "B", "C"]).nullable().optional(),
    has_product: z.boolean(),
    investment_is_estimate: z.boolean(),
    sales_in_period: z.number(),
    daily_avg_sales: z.number(),
    current_full_stock: z.number(),
    coverage_days_remaining: z.number().nullable().optional(),
    suggested_quantity: z.number(),
    estimated_investment: z.number().nullable().optional(),
    variations: z.array(FullSuggestionVariationSchema).nullable().optional(),
});

export type FullSuggestionItem = z.infer<typeof FullSuggestionItemSchema>;

export const FullSuggestionSummarySchema = z.object({
    total_items: z.number(),
    no_sales_count: z.number(),
    no_stock_count: z.number(),
    total_suggestion_units: z.number(),
    total_investment: z.number().nullable().optional(),
    investment_is_estimate: z.boolean(),
    coverage_days: z.number(),
    period_start: z.string(),
    period_end: z.string(),
});

export type FullSuggestionSummary = z.infer<typeof FullSuggestionSummarySchema>;

export const FullSuggestionPaginationSchema = z.object({
    page: z.number(),
    per_page: z.number(),
    total_count: z.number(),
    total_pages: z.number(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
});

export type FullSuggestionPagination = z.infer<typeof FullSuggestionPaginationSchema>;

export const FullSuggestionResponseSchema = z.object({
    summary: FullSuggestionSummarySchema,
    items: z.array(FullSuggestionItemSchema),
    pagination: FullSuggestionPaginationSchema,
});

export type FullSuggestionResponse = z.infer<typeof FullSuggestionResponseSchema>;
