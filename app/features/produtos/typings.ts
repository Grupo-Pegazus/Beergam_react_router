import { z } from "zod";

// Schema para categoria
const CategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

// Schema para imagens
const ProductImagesSchema = z.object({
  product: z.array(z.string()),
  marketplace: z.array(z.string()),
  shipping: z.array(z.string()),
});

// Schema para anúncio relacionado
const RelatedAdSchema = z.object({
  marketplace: z.string(),
  marketplace_shop_id: z.string(),
  sku: z.string(),
  ad_external_id: z.string(),
  ad_variation_external_id: z.string(),
});

export type RelatedAd = z.infer<typeof RelatedAdSchema>;

// Schema para variação básica (da lista)
const VariationBasicSchema = z.object({
  product_variation_id: z.string(),
  title: z.string(),
  sku: z.string().nullable(),
  status: z.string(),
  description: z.string().optional(),
  images: ProductImagesSchema.optional(),
  categories: z.array(CategorySchema).optional(),
  available_quantity: z.number().optional(),
  price_sale: z.string().optional(),
  price_cost: z.union([z.string(), z.number()]).optional(),
  packaging_cost: z.union([z.string(), z.number()]).optional(),
  extra_cost: z.union([z.string(), z.number()]).optional(),
  sales_quantity: z.number().optional(),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()),
      })
    )
    .optional(),
});
export type VariationBasic = z.infer<typeof VariationBasicSchema>;
// Schema para produto (da lista)
export const ProductSchema = z.object({
  product_id: z.string(),
  title: z.string(),
  sku: z.string().nullable(),
  status: z.string(),
  registration_type: z.enum(["Completo", "Simplificado"]),
  created_at: z.string(),
  categories: z.array(CategorySchema),
  images: ProductImagesSchema,
  variations: z.array(VariationBasicSchema),
  related_ads: z.array(RelatedAdSchema),
  available_quantity: z.number().optional(),
  price_sale: z.string().optional(),
  price_cost: z.union([z.string(), z.number()]).optional(),
  packaging_cost: z.union([z.string(), z.number()]).optional(),
  extra_cost: z.union([z.string(), z.number()]).optional(),
  sales_quantity: z.number().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Schema para variação completa (dos detalhes)
const VariationFullSchema = z.object({
  product_variation_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  sku: z.string(),
  status: z.string(),
  available_quantity: z.number(),
  minimum_quantity: z.number(),
  maximum_quantity: z.number(),
  price_cost: z.string(),
  price_sale: z.string(),
  images: ProductImagesSchema,
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()),
      })
    )
    .optional(),
  created_at: z.string(),
  updated_at: z.string(),
  cest: z.string().optional(),
  ean: z.string().optional(),
  ncm: z.string().optional(),
  icms: z.boolean().optional(),
  stock_handling: z.boolean().optional(),
  extra_cost: z.string().optional(),
  packaging_cost: z.string().optional(),
});

export type VariationFull = z.infer<typeof VariationFullSchema>;

// Schema para produto completo (detalhes)
export const ProductDetailsSchema = z.object({
  product_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  sku: z.string().nullable(),
  status: z.string(),
  product_registration_type: z.enum(["Completo", "Simplificado"]),
  available_quantity: z.number(),
  initial_quantity: z.number(),
  minimum_quantity: z.number(),
  maximum_quantity: z.number(),
  price_cost: z.string(),
  price_sale: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  categories: z.array(CategorySchema),
  images: ProductImagesSchema,
  variations: z.array(VariationFullSchema),
  related_ads: z.array(RelatedAdSchema),
  brand: z.string().optional(),
  internal_code: z.string().optional(),
  unity_type: z.string().optional(),
  product_origin: z.string().optional(),
  marketing_type: z.string().optional(),
  brute_weight: z.string().optional(),
  net_weight: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  depth: z.string().optional(),
  ncm: z.string().optional(),
  cest: z.string().optional(),
  ean: z.string().optional(),
  icms: z.boolean().optional(),
  tax_replacement: z.boolean().optional(),
  stock_handling: z.boolean().optional(),
  extra_cost: z.string().optional(),
  packaging_cost: z.string().optional(),
  general_product: z
    .object({
      general_product_id: z.string(),
      sku: z.string().nullable(),
      is_variation: z.boolean(),
      average_cost: z.string().optional(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .optional(),
});

export type ProductDetails = z.infer<typeof ProductDetailsSchema>;

// Schema para resposta da lista de produtos
export const ProductsResponseSchema = z.object({
  filters_applied: z.object({
    page: z.number(),
    per_page: z.number(),
    sort_by: z.string(),
    sort_order: z.string(),
  }),
  pagination: z.object({
    has_next: z.boolean(),
    has_prev: z.boolean(),
    page: z.number(),
    per_page: z.number(),
    total_count: z.number(),
    total_pages: z.number(),
  }),
  products: z.array(ProductSchema),
});

export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;

// Schema para filtros de produtos
export const ProductsFiltersSchema = z.object({
  // Texto livre (SKU ou título) - usado pelo backend
  q: z.string().optional(),
  // Nome do produto (título)
  name: z.string().optional(),
  // Status do produto
  status: z.string().optional(),
  // Tipo de registro (aceita valores como "simplified", "simplificado", "simples", "complete", "completo", "completa")
  registration_type: z.string().optional(),
  // Tem variações
  has_variations: z.boolean().optional(),
  // Nome da categoria
  category_name: z.string().optional(),
  // Paginação
  page: z.number().default(1),
  per_page: z
    .number()
    .default(20)
    .refine((val) => val <= 100, {
      message: "per_page deve ser no máximo 100",
    }),
  // Ordenação
  sort_by: z
    .enum(["created_at", "sku", "title", "status", "registration_type"])
    .default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type ProductsFilters = z.infer<typeof ProductsFiltersSchema>;

// Schema para métricas de produtos
export const ProductsMetricsSchema = z.object({
  total_cadastrados: z.number(),
  total_ativos: z.number(),
  estoque_baixo: z.number(),
  total_desativados: z.number(),
  estoque_alto: z.number(),
});

export type ProductsMetrics = z.infer<typeof ProductsMetricsSchema>;

// Schema para valores monetários que vêm como objeto com source e parsedValue
const MonetaryValueSchema = z
  .object({
    source: z.string(),
    parsedValue: z.number(),
  })
  .nullable();

// Schema para meta que contém informações sobre variação e sincronização
const StockTrackingMetaSchema = z
  .object({
    auto_sync: z.boolean().optional(),
    cost_fallback_applied: z.boolean().optional(),
    marketplace: z.string().optional(),
    marketplace_shop_id: z.string().optional(),
    product_id: z.string().optional(),
    variation_id: z.string().nullable().optional(),
    variation_sku: z.string().nullable().optional(),
    product_variation_id: z
      .union([z.string(), z.number()])
      .nullable()
      .optional(),
    sku: z.string().nullable().optional(),
  })
  .passthrough(); // Permite campos adicionais

// Schema para entrada individual de stock tracking
export const StockTrackingEntrySchema = z.object({
  id: z.number(),
  quantity: z.number(),
  modification_type: z.enum(["Entrada", "Saída"]),
  reason: z.string(),
  unity_cost: MonetaryValueSchema,
  total_value: MonetaryValueSchema,
  description: z.string().nullable(),
  created_at: z.string(),
  meta: StockTrackingMetaSchema.nullable(),
});

export type StockTrackingEntry = z.infer<typeof StockTrackingEntrySchema>;

// Schema para informações do produto no stock tracking
const StockTrackingProductInfoSchema = z.object({
  product_id: z.string(),
  general_product_id: z.string(),
  sku: z.string().nullable(),
  title: z.string(),
  stock_handling: z.boolean(),
  available_quantity: z.number(),
});

// Schema para custo médio
const AverageCostSchema = z.object({
  calculated: z.string(),
  stored: z.string(),
  is_synced: z.boolean(),
});

// Schema para resumo de movimentações
const StockTrackingSummarySchema = z.object({
  total_movements: z.number(),
  total_entries: z.number(),
  total_entry_quantity: z.number(),
  total_exits: z.number(),
  total_exit_quantity: z.number(),
  current_stock: z.number(),
  total_stock_value: z.number(),
});

// Schema para paginação do histórico
const StockTrackingPaginationSchema = z.object({
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
  items: z.array(StockTrackingEntrySchema),
});

// Schema completo de resposta do stock tracking
export const StockTrackingResponseSchema = z.object({
  product_info: StockTrackingProductInfoSchema,
  average_cost: AverageCostSchema,
  summary: StockTrackingSummarySchema,
  stock_tracking: StockTrackingPaginationSchema,
});

export type StockTrackingResponse = z.infer<typeof StockTrackingResponseSchema>;

// Schema para filtros de stock tracking
export const StockTrackingFiltersSchema = z.object({
  page: z.number().default(1),
  page_size: z.number().default(50),
  modification_type: z.enum(["ENTRY", "EXIT"]).optional(),
  variation_id: z.union([z.number(), z.string()]).optional(),
});

export type StockTrackingFilters = z.infer<typeof StockTrackingFiltersSchema>;

// Schema para resposta do recálculo de custo médio
export const RecalculateAverageCostResponseSchema = z.object({
  product_info: z.object({
    product_id: z.string(),
    sku: z.string().nullable(),
    title: z.string(),
  }),
  recalculation: z.object({
    success: z.boolean(),
    previous_average_cost: z.string(),
    new_average_cost: z.string(),
    changed: z.boolean(),
  }),
});

export type RecalculateAverageCostResponse = z.infer<
  typeof RecalculateAverageCostResponseSchema
>;

// Schema para formulário de movimentação de estoque (formato interno)
export const StockMovementFormSchema = z.object({
  modification_type: z.enum(["ENTRY", "EXIT"]),
  quantity: z.number().positive("Quantidade deve ser maior que zero"),
  unity_cost: z
    .number()
    .nonnegative("Custo unitário não pode ser negativo")
    .optional(),
  reason: z.string().min(1, "Motivo é obrigatório"),
  description: z.string().optional(),
});

export type StockMovementForm = z.infer<typeof StockMovementFormSchema>;

// Schema para payload da API (formato do backend)
// Quando há variação, envia apenas variation_id (product_id é opcional)
// Quando não há variação, envia apenas product_id
export const StockMovementApiPayloadSchema = z.object({
  product_id: z.string(), // OBRIGATÓRIO: sempre precisa do product_id do produto pai
  quantity_change: z.number().refine((val) => val !== 0, {
    message: "A mudança de quantidade não pode ser zero",
  }),
  reason: z.string().min(1, "Motivo é obrigatório"),
  description: z.string().optional(),
  unity_cost: z
    .number()
    .nonnegative("Custo unitário não pode ser negativo")
    .optional(),
  auto_sync: z.boolean().default(true),
  variation_id: z.string().optional(), // Opcional: usado quando há variação
});

export type StockMovementApiPayload = z.infer<
  typeof StockMovementApiPayloadSchema
>;

// Schema para resposta da API
export const StockMovementResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  product_id: z.string(),
  previous_stock: z.number(),
  new_stock: z.number(),
  quantity_change: z.number(),
  modification_type: z.string(),
  stock_entry_id: z.number().optional(),
  marketplace_sync: z
    .object({
      success: z.boolean(),
      message: z.string().optional(),
    })
    .optional(),
});

export type StockMovementResponse = z.infer<typeof StockMovementResponseSchema>;

// Schema para movimentação recente no dashboard
const RecentMovementSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  modification_type: z.string(),
  reason: z.string(),
  unity_cost: z.number().nullable(),
  total_value: z.number().nullable(),
  description: z.string().nullable(),
  created_at: z.string().nullable(),
  product: z
    .object({
      product_id: z.string(),
      title: z.string(),
      sku: z.string().nullable(),
    })
    .nullable()
    .optional(),
  variation: z
    .object({
      variation_id: z.string(),
      product_id: z.string().nullable(),
      title: z.string(),
      sku: z.string().nullable(),
    })
    .nullable()
    .optional(),
});

// Schema para variação com estoque baixo
const LowStockVariationSchema = z.object({
  variation_id: z.string(),
  product_id: z.string().nullable(),
  sku: z.string().nullable(),
  title: z.string(),
  product_title: z.string().nullable(),
  available_quantity: z.number(),
  minimum_quantity: z.number(),
  average_cost: z.string(),
  stock_value: z.number(),
});

// Schema para produto com estoque baixo (inclui stock_info)
const LowStockProductSchema = ProductSchema.extend({
  stock_info: z.object({
    available_quantity: z.number(),
    minimum_quantity: z.number(),
    stock_status: z.enum(["low", "ok"]),
    average_cost: z.string(),
    stock_value: z.number(),
  }),
});

// Schema para métricas do dashboard de estoque
const StockDashboardMetricsSchema = z.object({
  total_products: z.number(),
  products_with_stock_control: z.number(),
  products_without_stock_control: z.number(),
  total_stock_quantity: z.number(),
  total_stock_value: z.number(),
});

// Schema para resumo de estoque por status
const StockSummarySchema = z.object({
  stock_ok: z.number(),
  stock_low: z.number(),
  stock_zero: z.number(),
  without_control: z.number(),
});

// Schema completo do dashboard de estoque
export const StockDashboardResponseSchema = z.object({
  metrics: StockDashboardMetricsSchema,
  low_stock_products: z.array(LowStockProductSchema),
  low_stock_variations: z.array(LowStockVariationSchema),
  recent_movements: z.array(RecentMovementSchema),
  products_without_stock_control: z.array(ProductSchema),
  stock_summary: StockSummarySchema,
});

export type StockDashboardResponse = z.infer<
  typeof StockDashboardResponseSchema
>;

// Schema para informações da conta no dashboard de sincronização
const SyncAccountInfoSchema = z.object({
  marketplace_shop_id: z.string(),
  marketplace_name: z.string(),
  account_type: z.string(),
  user_product_seller: z.boolean(),
  capabilities: z.record(z.string(), z.unknown()),
  last_detection: z.string().nullable(),
});

// Schema para estatísticas de sincronização
const SyncStatsSchema = z.object({
  total_products: z.number(),
  linked_products: z.number(),
  sync_coverage: z.number(),
});

// Schema para atividade recente de sincronização
const RecentActivitySchema = z.object({
  product_id: z.string().nullable(),
  sync_type: z.string(),
  sync_status: z.string(),
  success: z.boolean(),
  sync_duration_ms: z.number().nullable(),
  created_at: z.string(),
  error_message: z.string().nullable(),
});

// Schema completo do dashboard de sincronização
export const StockSyncDashboardResponseSchema = z.object({
  account_info: SyncAccountInfoSchema,
  sync_stats: SyncStatsSchema,
  recent_activities: z.array(RecentActivitySchema),
  recommendations: z.array(z.string()),
});

export type StockSyncDashboardResponse = z.infer<
  typeof StockSyncDashboardResponseSchema
>;
