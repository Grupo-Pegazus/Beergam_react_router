import type { ProductDetails } from "../typings";
import type {
  CreateProduct,
  CreateSimplifiedProduct,
  CreateCompleteProduct,
  SimplifiedVariation,
  CompleteVariation,
} from "../typings/createProduct";

/**
 * Normaliza o status do produto para o formato esperado pelo formulário
 */
function normalizeStatus(status: string): "ACTIVE" | "INACTIVE" {
  const statusMap: Record<string, "ACTIVE" | "INACTIVE"> = {
    active: "ACTIVE",
    inactive: "INACTIVE",
    ativo: "ACTIVE",
    inativo: "INACTIVE",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
  };
  return statusMap[status.toLowerCase()] || "ACTIVE";
}

/**
 * Normaliza o tipo de unidade
 */
function normalizeUnityType(unityType?: string): "UNITY" | "KIT" {
  if (!unityType) return "UNITY";
  const normalized = unityType.toUpperCase();
  return normalized === "KIT" ? "KIT" : "UNITY";
}

/**
 * Normaliza a origem do produto
 */
function normalizeProductOrigin(origin?: string): "NATIONAL" | "IMPORTED" {
  if (!origin) return "NATIONAL";
  const normalized = origin.toUpperCase();
  return normalized === "IMPORTED" ? "IMPORTED" : "NATIONAL";
}

/**
 * Normaliza o tipo de marketing
 */
function normalizeMarketingType(marketingType?: string): "RESALE" | "IMPORTED" {
  if (!marketingType) return "RESALE";
  const normalized = marketingType.toUpperCase();
  return normalized === "IMPORTED" ? "IMPORTED" : "RESALE";
}

/**
 * Converte string numérica para número
 */
function parseNumber(value: string | number | undefined | null, defaultValue = 0): number {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "number") return value;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Converte string para número opcional
 */
function parseOptionalNumber(
  value: string | number | undefined | null
): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return value;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Transforma ProductDetails em CreateProduct para edição
 */
export function transformProductDetailsToCreateProduct(
  productDetails: ProductDetails,
  targetRegistrationType?: "simplified" | "complete"
): CreateProduct {
  const registrationType =
    targetRegistrationType ||
    (productDetails.product_registration_type === "Completo" ? "complete" : "simplified");

  // Se o produto é completo, não pode ser simplificado
  if (
    productDetails.product_registration_type === "Completo" &&
    targetRegistrationType === "simplified"
  ) {
    throw new Error(
      "Não é possível converter um produto completo para simplificado"
    );
  }

  const hasVariations = productDetails.variations && productDetails.variations.length > 0;

  // Transforma variações
  const variations: SimplifiedVariation[] | CompleteVariation[] = hasVariations
    ? productDetails.variations.map((variation) => {
        const baseVariation = {
          sku: variation.sku || "",
          title: variation.title,
          status: normalizeStatus(variation.status),
          images: variation.images || {
            product: [],
            marketplace: [],
            shipping: [],
          },
          attributes: variation.attributes || [],
          unity_type: "UNITY" as const,
          stock_handling: variation.stock_handling ?? true,
          available_quantity: variation.available_quantity || 0,
        };

        if (registrationType === "complete") {
          return {
            ...baseVariation,
            description: variation.description,
            price_sale: parseNumber(variation.price_sale),
            price_cost: parseNumber(variation.price_cost),
            packaging_cost: parseOptionalNumber(variation.packaging_cost),
            extra_cost: parseOptionalNumber(variation.extra_cost),
            minimum_quantity: variation.minimum_quantity || 0,
            maximum_quantity: variation.maximum_quantity || 0,
            ncm: variation.ncm,
            ean: variation.ean,
            icms: variation.icms,
            cest: variation.cest,
          } as CompleteVariation;
        }

        return baseVariation as SimplifiedVariation;
      })
    : [];

  // Base do produto
  const baseProduct = {
    sku: productDetails.sku,
    title: productDetails.title,
    status: normalizeStatus(productDetails.status),
    images: productDetails.images || {
      product: [],
      marketplace: [],
      shipping: [],
    },
    stock_handling: productDetails.stock_handling ?? true,
    unity_type: normalizeUnityType(productDetails.unity_type),
    product_origin: normalizeProductOrigin(productDetails.product_origin),
    marketing_type: normalizeMarketingType(productDetails.marketing_type),
    category_name: productDetails.categories?.[0]?.name || "",
    available_quantity: productDetails.available_quantity || 0,
    initial_quantity: productDetails.initial_quantity || 0,
  };

  // Produto simplificado
  if (registrationType === "simplified") {
    return {
      registration_type: "simplified",
      product: {
        ...baseProduct,
        price_sale: parseNumber(productDetails.price_sale),
        price_cost: parseNumber(productDetails.price_cost),
      },
      variations: variations as SimplifiedVariation[],
    } as CreateSimplifiedProduct;
  }

  // Produto completo
  return {
    registration_type: "complete",
    product: {
      ...baseProduct,
      description: productDetails.description || "",
      brand: productDetails.brand || "",
      internal_code: productDetails.internal_code || "",
      price_sale: parseNumber(productDetails.price_sale),
      price_cost: parseNumber(productDetails.price_cost),
      packaging_cost: parseOptionalNumber(productDetails.packaging_cost),
      extra_cost: parseOptionalNumber(productDetails.extra_cost),
      minimum_quantity: productDetails.minimum_quantity || 0,
      maximum_quantity: productDetails.maximum_quantity || 0,
      ncm: productDetails.ncm || "",
      ean: productDetails.ean || "",
      icms: productDetails.icms ?? false,
      cest: productDetails.cest || "",
      tax_replacement: productDetails.tax_replacement ?? false,
      brute_weight: parseOptionalNumber(productDetails.brute_weight),
      net_weight: parseOptionalNumber(productDetails.net_weight),
      height: parseOptionalNumber(productDetails.height),
      width: parseOptionalNumber(productDetails.width),
      depth: parseOptionalNumber(productDetails.depth),
    },
    variations: variations as CompleteVariation[],
  } as CreateCompleteProduct;
}

