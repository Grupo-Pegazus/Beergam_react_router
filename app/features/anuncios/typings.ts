import { z } from "zod";

// Schema para atributos do anúncio
const AttributeValueSchema = z.object({
  id: z.string(),
  name: z.string(),
  struct: z.unknown().nullable(),
});

const AttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value_id: z.string().optional(),
  value_name: z.string().optional(),
  value_type: z.string().optional(),
  values: z.array(AttributeValueSchema).optional(),
});

// Schema para comissão
const CommissionDetailsSchema = z.object({
  fixed_fee: z.number(),
  gross_amount: z.number(),
  percentage_fee: z.number(),
});

const CommissionSchema = z.object({
  details: CommissionDetailsSchema.optional(),
  percentage: z.number(),
  value: z.number(),
});

// Schema para experiência
const ExperienceActionSchema = z.object({
  order: z.number(),
  text: z.string(),
});

const ExperienceFreezeSchema = z.object({
  text: z.string(),
});

const ExperienceMetricsDetailsSchema = z.object({
  distribution: z.object({
    from: z.string(),
    level_one: z.array(z.unknown()),
    to: z.string(),
  }).optional(),
  empty_state_title: z.string().optional(),
});

const ExperienceReputationSchema = z.object({
  color: z.string(),
  text: z.string(),
  value: z.number(),
});

const ExperienceStatusSchema = z.object({
  id: z.string(),
});

const ExperienceSubtitleSchema = z.object({
  order: z.number(),
  text: z.string(),
});

const ExperienceTitleSchema = z.object({
  text: z.string(),
});

const ExperienceSchema = z.object({
  actions: z.array(ExperienceActionSchema).optional(),
  freeze: ExperienceFreezeSchema.optional(),
  item_id: z.string(),
  metrics_details: ExperienceMetricsDetailsSchema.optional(),
  reputation: ExperienceReputationSchema.optional(),
  status: ExperienceStatusSchema.optional(),
  subtitles: z.array(ExperienceSubtitleSchema).optional(),
  title: ExperienceTitleSchema.optional(),
});

// Schema para health (saúde do anúncio)
const HealthRuleWordingSchema = z.object({
  label: z.string(),
  link: z.string(),
  title: z.string(),
});

const HealthRuleSchema = z.object({
  calculated_at: z.string(),
  key: z.string(),
  mode: z.string().optional(),
  progress: z.number(),
  status: z.string(),
  wordings: HealthRuleWordingSchema.optional(),
});

const HealthVariableSchema = z.object({
  calculated_at: z.string(),
  key: z.string(),
  rules: z.array(HealthRuleSchema).optional(),
  score: z.number(),
  status: z.string(),
  title: z.string(),
});

const HealthBucketSchema = z.object({
  calculated_at: z.string(),
  key: z.string(),
  score: z.number(),
  status: z.string(),
  title: z.string(),
  type: z.string(),
  variables: z.array(HealthVariableSchema).optional(),
});

const HealthSchema = z.object({
  buckets: z.array(HealthBucketSchema).optional(),
  calculated_at: z.string(),
  entity_id: z.string(),
  entity_type: z.string(),
  level: z.string(),
  level_wording: z.string(),
  score: z.number(),
});

// Schema para imagem
const ImageSchema = z.object({
  id: z.string(),
  max_size: z.string(),
  quality: z.string(),
  secure_url: z.string(),
  size: z.string(),
  url: z.string(),
});

// Schema para variação do anúncio
const VariationSchema = z.object({
  attributes: z.array(AttributeSchema),
  created_at: z.string(),
  images: z.array(z.string()),
  mlb: z.string(),
  price: z.string(),
  sku: z.string().nullable(),
  sold_quantity: z.number(),
  stock: z.number(),
  thumbnail: z.string(),
  updated_at: z.string(),
  variation_id: z.string(),
});

export type Variation = z.infer<typeof VariationSchema>;

// Schema para visitas mensais
export const VisitSchema = z.object({
  created_at: z.string(),
  date_visit: z.string(),
  mlb: z.string(),
  updated_at: z.string(),
  visits: z.number(),
});

const ItemRelationSchema = z.object({
  id: z.string(),
  variation_id: z.string(),
  stock_relation: z.number(),
})

// Schema principal do anúncio
export const AnuncioSchema = z.object({
  active_days: z.number(),
  ad_type: z.string(),
  attributes: z.array(AttributeSchema),
  category: z.string(),
  commission: CommissionSchema.optional(),
  conversion_rate: z.string().optional(),
  created_at: z.string(),
  date_created_ad: z.string(),
  experience: ExperienceSchema.optional(),
  free_shipping: z.boolean(),
  geral_visits: z.number(),
  health: HealthSchema.optional(),
  images: z.array(ImageSchema),
  link: z.string(),
  logistic_type: z.string(),
  mlb: z.string(),
  mlbu: z.string().optional(),
  catalog_product_id: z.string().optional(),
  is_catalog: z.boolean(),
  item_relations: z.array(ItemRelationSchema).optional(),
  name: z.string(),
  price: z.string(),
  sku: z.string().nullable(),
  sold_quantity: z.number(),
  status: z.string(),
  stock: z.number(),
  sub_status: z.array(z.string()),
  thumbnail: z.string(),
  updated_at: z.string(),
  variations_count: z.number(),
  variations: z.array(VariationSchema).optional(),
  visits: z.array(VisitSchema).optional(),
});

export type Anuncio = z.infer<typeof AnuncioSchema>;

// Schema para filtros
export const AdsFiltersSchema = z.object({
  status: z.string().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  mlb: z.string().optional(),
  mlbu: z.string().optional(),
  catalog_product_id: z.string().optional(),
  logistic_type: z.string().optional(),
  ad_type: z.string().optional(),
  category: z.string().optional(),
  free_shipping: z.boolean().optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  stock_min: z.number().optional(),
  stock_max: z.number().optional(),
  sold_quantity_min: z.number().optional(),
  sold_quantity_max: z.number().optional(),
  active_days_min: z.number().optional(),
  active_days_max: z.number().optional(),
  date_created_ad_from: z.string().optional(),
  date_created_ad_to: z.string().optional(),
  conversion_rate_min: z.number().optional(),
  conversion_rate_max: z.number().optional(),
  geral_visits_min: z.number().optional(),
  geral_visits_max: z.number().optional(),
  health_score_min: z.number().optional(),
  health_score_max: z.number().optional(),
  experience_score_min: z.number().optional(),
  experience_score_max: z.number().optional(),
  has_variations: z.boolean().optional(),
  only_catalog: z.boolean().optional(),
  page: z.number().default(1),
  per_page: z.number().default(20).refine((val) => val <= 1000, {
    message: "per_page deve ser no máximo 1000",
  }),
  sort_by: z.string().default("date_created_ad"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type AdsFilters = z.infer<typeof AdsFiltersSchema>;

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

// Schema para resposta da API
export const AdsResponseSchema = z.object({
  ads: z.array(AnuncioSchema),
  filters_applied: AdsFiltersSchema.optional(),
  pagination: PaginationSchema,
});

export type AdsResponse = z.infer<typeof AdsResponseSchema>;

// Schema para mudança de status
export const ChangeAdStatusRequestSchema = z.object({
  status: z.enum(["paused", "active"]),
});

export type ChangeAdStatusRequest = z.infer<typeof ChangeAdStatusRequestSchema>;

// Schema para anúncio sem SKU (com variations_without_sku)
export const AdWithoutSkuSchema = AnuncioSchema.extend({
  variations_without_sku: z.array(VariationSchema).optional(),
});

export type AdWithoutSku = z.infer<typeof AdWithoutSkuSchema>;

// Schema para resposta de anúncios sem SKU
export const WithoutSkuResponseSchema = z.object({
  total_without_sku: z.number(),
  with_variations: z.array(AdWithoutSkuSchema),
  without_variations: z.array(AdWithoutSkuSchema),
});

export type WithoutSkuResponse = z.infer<typeof WithoutSkuResponseSchema>;

// Schema para atualização de SKU
const UpdateSkuVariationAttributeSchema = z.object({
  id: z.string(),
  value_name: z.string(),
});

const UpdateSkuVariationSchema = z.object({
  id: z.number(),
  attributes: z.array(UpdateSkuVariationAttributeSchema),
});

export const UpdateSkuRequestSchema = z.object({
  ad_id: z.string(),
  variations: z.array(UpdateSkuVariationSchema),
});

export type UpdateSkuRequest = z.infer<typeof UpdateSkuRequestSchema>;

// Schema para detalhes do anúncio (dados adicionais para a página de detalhe)
export const AnuncioDetailsSchema = AnuncioSchema.extend({
  // Métricas financeiras
  total_profit: z.number().optional(),
  average_profit_per_sale: z.number().optional(),
  total_revenue: z.number().optional(),
  total_expenses: z.number().optional(),

  // Métricas de performance
  visits_last_150_days: z.number().optional(),
  total_sales: z.number().optional(),
  average_weekly_sales: z.number().optional(),

  // Melhorias
  improvements: z.object({
    opportunities: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      type: z.string(),
      action: z.string(),
      label_action: z.string(),
    })).optional(),
    warnings: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      type: z.string(),
      action: z.string(),
      label_action: z.string(),
    })).optional(),
    total_count: z.number().optional(),
  }).optional(),

  // Métricas de qualidade
  quality_metrics: z.object({
    qa_score: z.number().nullable().optional(), // Qualidade do Anúncio
    ec_score: z.number().nullable().optional(), // Experiência de Compra
  }).optional(),

  // Features/Badges do anúncio
  features: z.array(z.string()).optional(), // Ex: ["FULL", "CATALOGO", "FRETE GRÁTIS", "COLETAS", "FLEX"]

  // Custos detalhados
  costs: z.object({
    purchase_price: z.number().optional(),
    commission: z.object({
      value: z.number(),
      percentage: z.number(),
    }).optional(),
    shipping: z.number().optional(),
    taxes: z.number().optional(),
    additional_costs: z.number().optional(),
  }).optional(),
});

export type AnuncioDetails = z.infer<typeof AnuncioDetailsSchema>;

// ===========================
// Reprocessamento (cota + ação)
// ===========================

export const ReprocessQuotaSchema = z.object({
  resource_type: z.string(),
  year_month: z.string(),
  limit: z.number(),
  used: z.number(),
  remaining: z.number(),
});

export type ReprocessQuota = z.infer<typeof ReprocessQuotaSchema>;

export const ReprocessAdItemSchema = z.object({
  ad_id: z.string(),
  success: z.boolean(),
  message: z.string().optional(),
});

export type ReprocessAdItem = z.infer<typeof ReprocessAdItemSchema>;

export const ReprocessAdsResponseSchema = z.object({
  items: z.array(ReprocessAdItemSchema),
  total_requested: z.number(),
  total_reprocessed: z.number(),
});

export type ReprocessAdsResponse = z.infer<typeof ReprocessAdsResponseSchema>;
