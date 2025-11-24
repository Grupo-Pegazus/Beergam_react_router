import { z } from "zod";

// Schema para pedido (baseado no MeliOrderSchema do backend)
export const OrderSchema = z.object({
  id: z.number(),
  order_id: z.string(),
  marketplace_shop_id: z.string(),
  pack_id: z.string().nullable().optional(),
  buyer_id: z.string(),
  buyer_nickname: z.string(),
  date_created: z.string(),
  date_closed: z.string(),
  expiration_date: z.string(),
  status: z.string(),
  total_amount: z.string(),
  paid_amount: z.string(),
  currency_id: z.string(),
  shipping_id: z.string(),
  tags: z.array(z.string()).nullable().optional(),
  payments: z.array(z.unknown()).nullable().optional(),
  sku: z.string(),
  mlb: z.string(),
  title: z.string(),
  category_id: z.string(),
  quantity: z.number(),
  unit_price: z.string(),
  sale_fee: z.string(),
  listing_type_id: z.string(),
  condition: z.string(),
  shipping_mode: z.string().nullable().optional(),
  tracking_number: z.string().nullable().optional(),
  tracking_method: z.string().nullable().optional(),
  shipment_status: z.string().nullable().optional(),
  shipment_substatus: z.string().nullable().optional(),
  estimated_delivery: z.string().nullable().optional(),
  declared_value: z.string().nullable().optional(),
  shipping_method_name: z.string().nullable().optional(),
  shipping_paid_by: z.string().nullable().optional(),
  custo_envio_base: z.number().nullable().optional(),
  custo_envio_final: z.number().nullable().optional(),
  custo_envio_buyer: z.number().nullable().optional(),
  custo_envio_seller: z.number().nullable().optional(),
  custo_envio_desconto: z.number().nullable().optional(),
  custo_envio_compensacao: z.number().nullable().optional(),
  custo_envio_promoted_amount: z.number().nullable().optional(),
  frete_recebido_total: z.number().nullable().optional(),
  valor_base: z.string(),
  valor_liquido: z.string().nullable().optional(),
  bonus_por_envio_estorno: z.number().nullable().optional(),
  tax_percentage: z.number().nullable().optional(),
  tax_amount: z.number().nullable().optional(),
  price_cost: z.number().nullable().optional(),
  packaging_cost: z.number().nullable().optional(),
  extra_cost: z.number().nullable().optional(),
  shipment_costs: z.record(z.string(), z.unknown()).nullable().optional(),
  thumbnail: z.string(),
  ad_type: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

// Schema para filtros de pedidos
export const OrdersFiltersSchema = z.object({
  status: z.string().optional(),
  shipment_status: z.string().optional(),
  buyer_nickname: z.string().optional(),
  sku: z.string().optional(),
  order_id: z.string().optional(),
  mlb: z.string().optional(),
  shipping_mode: z.string().optional(),
  shipping_paid_by: z.string().optional(),
  date_created_from: z.string().optional(),
  date_created_to: z.string().optional(),
  date_closed_from: z.string().optional(),
  date_closed_to: z.string().optional(),
  total_amount_min: z.number().optional(),
  total_amount_max: z.number().optional(),
  paid_amount_min: z.number().optional(),
  paid_amount_max: z.number().optional(),
  valor_liquido_min: z.number().optional(),
  valor_liquido_max: z.number().optional(),
  quantity_min: z.number().optional(),
  quantity_max: z.number().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().default(1),
  per_page: z.number().default(20).refine((val) => val <= 100, {
    message: "per_page deve ser no máximo 100",
  }),
  sort_by: z.string().default("date_created"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type OrdersFilters = z.infer<typeof OrdersFiltersSchema>;

// Schema para paginação
export const PaginationSchema = z.object({
  has_next: z.boolean(),
  has_prev: z.boolean(),
  page: z.number(),
  per_page: z.number(),
  total_count: z.number(),
  total_pages: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// Schema para resposta de pedidos
export const OrdersResponseSchema = z.object({
  orders: z.array(OrderSchema),
  pagination: PaginationSchema,
});

export type OrdersResponse = z.infer<typeof OrdersResponseSchema>;

// Schema para métricas de pedidos
export const OrdersMetricsSchema = z.object({
  orders_by_status: z.object({
    a_preparar: z.number(),
    prontas_para_enviar: z.number(),
    em_transito: z.number(),
    concluidas: z.number(),
  }),
  faturamento_bruto_90d: z.string(),
  faturamento_liquido_90d: z.string(),
  media_faturamento_diario_90d: z.string(),
  comparacao_periodo_anterior: z.object({
    faturamento_bruto_diff: z.string(),
    faturamento_liquido_diff: z.string(),
    media_diaria_diff: z.string(),
  }),
});

export type OrdersMetrics = z.infer<typeof OrdersMetricsSchema>;

// Schema para faturamento diário
export const DailyRevenueItemSchema = z.object({
  date: z.string(),
  faturamento_bruto: z.string(),
  faturamento_liquido: z.string(),
  total_pedidos: z.number(),
});

export const DailyRevenueSchema = z.object({
  daily_revenue: z.array(DailyRevenueItemSchema),
});

export type DailyRevenue = z.infer<typeof DailyRevenueSchema>;
export type DailyRevenueItem = z.infer<typeof DailyRevenueItemSchema>;

// Schema para distribuição geográfica
export const GeographicDistributionItemSchema = z.object({
  state: z.string(),
  state_name: z.string(),
  units: z.number(),
  percentage: z.string(),
  faturamento: z.string(),
});

export const GeographicDistributionSchema = z.object({
  distribution: z.array(GeographicDistributionItemSchema),
  total_units: z.number(),
  period: z.string(),
});

export type GeographicDistribution = z.infer<typeof GeographicDistributionSchema>;
export type GeographicDistributionItem = z.infer<typeof GeographicDistributionItemSchema>;

// Schema para categorias mais vendidas
export const TopCategorySchema = z.object({
  category: z.string(),
  faturamento: z.string(),
  percentage: z.string(),
  total_orders: z.number(),
});

export const TopCategoriesSchema = z.object({
  categories: z.array(TopCategorySchema),
});

export type TopCategories = z.infer<typeof TopCategoriesSchema>;
export type TopCategory = z.infer<typeof TopCategorySchema>;

