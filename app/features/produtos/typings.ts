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
  sales_quantity: z.number().optional(),
});

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
  related_ads: z.array(z.unknown()),
  available_quantity: z.number().optional(),
  price_sale: z.string().optional(),
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
  related_ads: z.array(z.unknown()),
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
  title: z.string().optional(),
  sku: z.string().optional(),
  status: z.string().optional(),
  registration_type: z.enum(["Completo", "Simplificado"]).optional(),
  page: z.number().default(1),
  per_page: z.number().default(20).refine((val) => val <= 1000, {
    message: "per_page deve ser no máximo 1000",
  }),
  sort_by: z.string().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type ProductsFilters = z.infer<typeof ProductsFiltersSchema>;

// Schema para métricas de produtos
export const ProductsMetricsSchema = z.object({
  total_cadastrados: z.number(),
  total_ativos: z.number(),
  estoque_baixo: z.number(),
});

export type ProductsMetrics = z.infer<typeof ProductsMetricsSchema>;

