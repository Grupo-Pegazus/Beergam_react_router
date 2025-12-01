import { z } from "zod";

// Schema para produto relacionado
const RelatedProductSchema = z.object({
  product_id: z.string(),
  title: z.string(),
  sku: z.string().nullable(),
  variation_id: z.string().optional(),
});

export type RelatedProduct = z.infer<typeof RelatedProductSchema>;

// Schema para categoria
const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string().nullable(),
  related_products_count: z.number().default(0),
  related_products: z.array(RelatedProductSchema).default([]),
});

export type Category = z.infer<typeof CategorySchema>;

// Schema para atributo
const AttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  allowed_values: z.array(z.string()).nullable(),
  created_at: z.string().nullable(),
  related_products_count: z.number().default(0),
  related_products: z.array(RelatedProductSchema).default([]),
});

export type Attribute = z.infer<typeof AttributeSchema>;

// Schema para resposta de categorias
export const CategoriesResponseSchema = z.object({
  categories: z.array(CategorySchema),
  pagination: z.object({
    page: z.number(),
    per_page: z.number(),
    total_count: z.number(),
    total_pages: z.number(),
  }),
  filters_applied: z.record(z.string(), z.string()).optional(),
});

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

// Schema para resposta de atributos
export const AttributesResponseSchema = z.object({
  attributes: z.array(AttributeSchema),
  pagination: z.object({
    page: z.number(),
    per_page: z.number(),
    total_count: z.number(),
    total_pages: z.number(),
  }),
  filters_applied: z.record(z.string(), z.string()).optional(),
});

export type AttributesResponse = z.infer<typeof AttributesResponseSchema>;

// Schema para filtros de categorias
export const CategoriesFiltersSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  page: z.number().default(1),
  per_page: z.number().default(20).refine((val) => val <= 100, {
    message: "per_page deve ser no máximo 100",
  }),
  sort_by: z.enum(["created_at", "name"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type CategoriesFilters = z.infer<typeof CategoriesFiltersSchema>;

// Schema para filtros de atributos
export const AttributesFiltersSchema = z.object({
  name: z.string().optional(),
  page: z.number().default(1),
  per_page: z.number().default(20).refine((val) => val <= 100, {
    message: "per_page deve ser no máximo 100",
  }),
  sort_by: z.enum(["created_at", "name"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type AttributesFilters = z.infer<typeof AttributesFiltersSchema>;

// Schema para criação de categoria
export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;

// Schema para atualização de categoria
export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Nome não pode ser vazio").optional(),
  description: z.string().optional(),
});

export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

// Schema para criação de atributo
export const CreateAttributeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  allowed_values: z.array(z.string()).optional(),
});

export type CreateAttribute = z.infer<typeof CreateAttributeSchema>;

// Schema para atualização de atributo
export const UpdateAttributeSchema = z.object({
  name: z.string().min(1, "Nome não pode ser vazio").optional(),
  allowed_values: z.array(z.string()).optional(),
});

export type UpdateAttribute = z.infer<typeof UpdateAttributeSchema>;

