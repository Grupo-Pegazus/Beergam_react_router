import { z } from "zod";

// Enum para tipos de registro
export const RegistrationTypeSchema = z.enum(["simplified", "complete"]);
export type RegistrationType = z.infer<typeof RegistrationTypeSchema>;

// Enum para tipos de unidade
export const UnityTypeSchema = z.enum(["UNITY", "KIT"]);
export type UnityType = z.infer<typeof UnityTypeSchema>;

// Enum para origem do produto
export const ProductOriginSchema = z.enum(["NATIONAL", "IMPORTED"]);
export type ProductOrigin = z.infer<typeof ProductOriginSchema>;

// Enum para tipo de marketing
export const MarketingTypeSchema = z.enum(["RESALE", "IMPORTED"]);
export type MarketingType = z.infer<typeof MarketingTypeSchema>;

// Enum para status
export const StatusSchema = z.enum(["ACTIVE", "INACTIVE"]);
export type Status = z.infer<typeof StatusSchema>;

// Schema para imagens
export const ProductImagesSchema = z.object({
  product: z.array(z.string()).default([]),
  marketplace: z.array(z.string()).default([]),
  shipping: z.array(z.string()).default([]),
});
export type ProductImages = z.infer<typeof ProductImagesSchema>;

// Schema para atributos de variação
export const VariationAttributeSchema = z.object({
  name: z.string().min(1, "Nome do atributo é obrigatório"),
  value: z.array(z.string()).min(1, "Pelo menos um valor é obrigatório"),
});
export type VariationAttribute = z.infer<typeof VariationAttributeSchema>;

// Schema para variação simplificada
export const SimplifiedVariationSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"),
  title: z.string().min(1, "Título da variação é obrigatório"),
  status: StatusSchema,
  images: ProductImagesSchema,
  attributes: z.array(VariationAttributeSchema).optional(),
  unity_type: UnityTypeSchema,
  stock_handling: z.boolean(),
  available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero").optional(),
});
export type SimplifiedVariation = z.infer<typeof SimplifiedVariationSchema>;

// Schema para variação completa
export const CompleteVariationSchema = SimplifiedVariationSchema.extend({
  description: z.string().optional(),
  price_sale: z.number().min(0, "Preço de venda deve ser maior ou igual a zero"),
  price_cost: z.number().min(0, "Preço de custo deve ser maior ou igual a zero"),
  packaging_cost: z.number().min(0, "Custo de embalagem deve ser maior ou igual a zero").optional(),
  extra_cost: z.number().min(0, "Custo extra deve ser maior ou igual a zero").optional(),
  stock_handling: z.boolean(),
  available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero"),
  minimum_quantity: z.number().min(0, "Quantidade mínima deve ser maior ou igual a zero"),
  maximum_quantity: z.number().min(0, "Quantidade máxima deve ser maior ou igual a zero"),
  ncm: z.string().optional(),
  ean: z.string().optional(),
  icms: z.boolean().optional(),
  cest: z.string().optional(),
});
export type CompleteVariation = z.infer<typeof CompleteVariationSchema>;

// Schema para produto simplificado
export const SimplifiedProductSchema = z.object({
  sku: z.string().nullable().optional(),
  title: z.string().min(1, "Título do produto é obrigatório"),
  price_sale: z.number().min(0, "Preço de venda deve ser maior ou igual a zero"),
  price_cost: z.number().min(0, "Preço de custo deve ser maior ou igual a zero"),
  unity_type: UnityTypeSchema,
  product_origin: ProductOriginSchema,
  marketing_type: MarketingTypeSchema,
  status: StatusSchema,
  stock_handling: z.boolean(),
  initial_quantity: z.number().min(0, "Quantidade inicial deve ser maior ou igual a zero"),
  available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero"),
  images: ProductImagesSchema,
  category_name: z.string().min(1, "Categoria é obrigatória"),
});
export type SimplifiedProduct = z.infer<typeof SimplifiedProductSchema>;

// Schema para produto completo
export const CompleteProductSchema = SimplifiedProductSchema.extend({
  description: z.string().optional(),
  brand: z.string().optional(),
  internal_code: z.string().optional(),
  packaging_cost: z.number().min(0, "Custo de embalagem deve ser maior ou igual a zero").optional(),
  extra_cost: z.number().min(0, "Custo extra deve ser maior ou igual a zero").optional(),
  available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero"),
  minimum_quantity: z.number().min(0, "Quantidade mínima deve ser maior ou igual a zero"),
  maximum_quantity: z.number().min(0, "Quantidade máxima deve ser maior ou igual a zero"),
  ncm: z.string().optional(),
  ean: z.string().optional(),
  icms: z.boolean().optional(),
  cest: z.string().optional(),
  tax_replacement: z.boolean().optional(),
  brute_weight: z.number().min(0, "Peso bruto deve ser maior ou igual a zero").optional(),
  net_weight: z.number().min(0, "Peso líquido deve ser maior ou igual a zero").optional(),
  height: z.number().min(0, "Altura deve ser maior ou igual a zero").optional(),
  width: z.number().min(0, "Largura deve ser maior ou igual a zero").optional(),
  depth: z.number().min(0, "Profundidade deve ser maior ou igual a zero").optional(),
});
export type CompleteProduct = z.infer<typeof CompleteProductSchema>;

// Schema para criação de produto simplificado
export const CreateSimplifiedProductSchema = z.object({
  registration_type: z.literal("simplified"),
  product: SimplifiedProductSchema,
  variations: z.array(SimplifiedVariationSchema).optional(),
});
export type CreateSimplifiedProduct = z.infer<typeof CreateSimplifiedProductSchema>;

// Schema para criação de produto completo
export const CreateCompleteProductSchema = z.object({
  registration_type: z.literal("complete"),
  product: CompleteProductSchema,
  variations: z.array(CompleteVariationSchema).optional(),
});
export type CreateCompleteProduct = z.infer<typeof CreateCompleteProductSchema>;

// Union type para criação de produto
export const CreateProductSchema = z.discriminatedUnion("registration_type", [
  CreateSimplifiedProductSchema,
  CreateCompleteProductSchema,
]);
export type CreateProduct = z.infer<typeof CreateProductSchema>;

