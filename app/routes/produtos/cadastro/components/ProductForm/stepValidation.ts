import { z } from "zod";
import type { RegistrationType } from "~/features/produtos/typings/createProduct";

// Schema para validação do step de Informações Básicas (sem variações - SKU obrigatório)
export const BasicFieldsSchema = z.object({
  product: z.object({
    title: z.string().min(1, "Título do produto é obrigatório"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    sku: z.string().min(1, "SKU é obrigatório quando não há variações"),
    category_name: z.string().min(1, "Categoria é obrigatória"),
  }),
});

// Schema para validação do step de Informações Básicas (com variações - SKU não obrigatório)
export const BasicFieldsWithVariationsSchema = z.object({
  product: z.object({
    title: z.string().min(1, "Título do produto é obrigatório"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    sku: z.string().nullable().optional(),
    category_name: z.string().min(1, "Categoria é obrigatória"),
  }),
});

// Schema para validação do step de Precificação
export const PricingFieldsSchema = z.object({
  product: z.object({
    price_sale: z.number().min(0, "Preço de venda deve ser maior ou igual a zero"),
    price_cost: z.number().min(0, "Preço de custo deve ser maior ou igual a zero"),
  }),
});

// Schema para validação do step de Precificação (completo)
export const PricingFieldsCompleteSchema = PricingFieldsSchema.extend({
  product: PricingFieldsSchema.shape.product.extend({
    packaging_cost: z.number().min(0, "Custo de embalagem deve ser maior ou igual a zero").optional(),
    extra_cost: z.number().min(0, "Custo extra deve ser maior ou igual a zero").optional(),
  }),
});

// Schema para validação do step de Estoque
export const StockFieldsSchema = z.object({
  product: z.object({
    stock_handling: z.boolean(),
    initial_quantity: z.number().min(0, "Quantidade inicial deve ser maior ou igual a zero"),
    available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero"),
  }),
});

// Schema para validação do step de Estoque (completo)
export const StockFieldsCompleteSchema = StockFieldsSchema.extend({
  product: StockFieldsSchema.shape.product.extend({
    available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero").optional(),
    minimum_quantity: z.number().min(0, "Quantidade mínima deve ser maior ou igual a zero").optional(),
    maximum_quantity: z.number().min(0, "Quantidade máxima deve ser maior ou igual a zero").optional(),
  }),
});

// Schema para validação do step de Imagens (não obrigatório, mas pode validar se necessário)
export const ImagesFieldsSchema = z.object({
  product: z.object({
    images: z.object({
      product: z.array(z.string()),
      marketplace: z.array(z.string()),
      shipping: z.array(z.string()),
    }),
  }),
});

// Schema para validação do step de Variações
export const VariationsFieldsSchema = z.object({
  variations: z.array(z.any()).optional(),
});

// Schema para validação do step de Extras (apenas completo)
export const ExtrasFieldsSchema = z.object({
  product: z.object({
    description: z.string().optional(),
    brand: z.string().optional(),
    internal_code: z.string().optional(),
    available_quantity: z.number().min(0, "Quantidade disponível deve ser maior ou igual a zero").optional(),
    minimum_quantity: z.number().min(0, "Quantidade mínima deve ser maior ou igual a zero").optional(),
    maximum_quantity: z.number().min(0, "Quantidade máxima deve ser maior ou igual a zero").optional(),
    ncm: z.string().optional(),
    ean: z.string().optional(),
    cest: z.string().optional(),
    icms: z.boolean().optional(),
    tax_replacement: z.boolean().optional(),
    brute_weight: z.number().min(0, "Peso bruto deve ser maior ou igual a zero").optional(),
    net_weight: z.number().min(0, "Peso líquido deve ser maior ou igual a zero").optional(),
    height: z.number().min(0, "Altura deve ser maior ou igual a zero").optional(),
    width: z.number().min(0, "Largura deve ser maior ou igual a zero").optional(),
    depth: z.number().min(0, "Profundidade deve ser maior ou igual a zero").optional(),
  }),
});

export function validateStep(
  stepId: "basic" | "pricing" | "measures" | "stock" | "extras" | "images" | "variations",
  data: any,
  registrationType: RegistrationType,
  hasVariations: boolean = false
): { isValid: boolean; errors: Record<string, string> } {
  let schema: z.ZodSchema;

  switch (stepId) {
    case "basic":
      // Se tem variações, SKU não é obrigatório. Se não tem, SKU é obrigatório
      schema = hasVariations ? BasicFieldsWithVariationsSchema : BasicFieldsSchema;
      break;
    case "pricing":
      schema = registrationType === "complete" ? PricingFieldsCompleteSchema : PricingFieldsSchema;
      break;
    case "measures":
      // Medidas são opcionais, então sempre válido
      return { isValid: true, errors: {} };
    case "stock":
      schema = registrationType === "complete" ? StockFieldsCompleteSchema : StockFieldsSchema;
      break;
    case "extras":
      // Campos extras são opcionais, então sempre válido
      return { isValid: true, errors: {} };
    case "images":
      // Imagens não são obrigatórias, então sempre válido
      return { isValid: true, errors: {} };
    case "variations":
      // Variações são opcionais, então sempre válido
      return { isValid: true, errors: {} };
    default:
      return { isValid: true, errors: {} };
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join(".");
    if (path && error.message) {
      errors[path] = error.message;
    }
  });

  return { isValid: false, errors };
}

