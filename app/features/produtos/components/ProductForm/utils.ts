import type { FormStep, FormField, FormState } from "./types";

export function evaluateCondition(
  fieldValue: unknown,
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan",
  conditionValue: unknown
): boolean {
  switch (operator) {
    case "equals":
      return fieldValue === conditionValue;
    case "notEquals":
      return fieldValue !== conditionValue;
    case "contains":
      if (typeof fieldValue === "string" && typeof conditionValue === "string") {
        return fieldValue.includes(conditionValue);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(conditionValue);
      }
      return false;
    case "greaterThan":
      if (typeof fieldValue === "number" && typeof conditionValue === "number") {
        return fieldValue > conditionValue;
      }
      return false;
    case "lessThan":
      if (typeof fieldValue === "number" && typeof conditionValue === "number") {
        return fieldValue < conditionValue;
      }
      return false;
    default:
      return false;
  }
}

export function isStepVisible(step: FormStep, values: Record<string, unknown>): boolean {
  if (!step.conditional) {
    return true;
  }

  const { field, operator, value } = step.conditional.condition;
  const fieldValue = getNestedValue(values, field);

  return evaluateCondition(fieldValue, operator, value);
}

export function isFieldVisible(field: FormField, values: Record<string, unknown>): boolean {
  if (!field.conditional) {
    return true;
  }

  const { field: conditionField, operator, value } = field.conditional;
  const fieldValue = getNestedValue(values, conditionField);

  return evaluateCondition(fieldValue, operator, value);
}

export function getVisibleSteps(steps: FormStep[], values: Record<string, unknown>): FormStep[] {
  return steps.filter((step) => isStepVisible(step, values));
}

export function getVisibleFields(fields: FormField[], values: Record<string, unknown>): FormField[] {
  return fields.filter((field) => isFieldVisible(field, values));
}

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
}

export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".");
  const result = { ...obj };
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

export function validateField(
  field: FormField,
  value: unknown
): string | null {
  // Para campos obrigatórios, verifica se o valor está vazio ou é uma string vazia
  if (field.required) {
    if (value === undefined || value === null || value === "") {
      return `${field.label} é obrigatório`;
    }
    // Para arrays, verifica se está vazio
    if (Array.isArray(value) && value.length === 0) {
      return `${field.label} é obrigatório`;
    }
  }

  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (field.validation) {
    const { min, max, pattern, custom } = field.validation;

    if (min !== undefined && typeof value === "number" && value < min) {
      return `${field.label} deve ser no mínimo ${min}`;
    }

    if (max !== undefined && typeof value === "number" && value > max) {
      return `${field.label} deve ser no máximo ${max}`;
    }

    if (pattern && typeof value === "string" && !pattern.test(value)) {
      return `${field.label} está em formato inválido`;
    }

    if (custom) {
      const customError = custom(value);
      if (customError) {
        return customError;
      }
    }
  }

  return null;
}

export function validateStep(step: FormStep, values: Record<string, unknown>): boolean {
  const visibleFields = getVisibleFields(step.fields, values);

  for (const field of visibleFields) {
    const fieldValue = getNestedValue(values, field.name);
    const error = validateField(field, fieldValue);

    if (error && field.required) {
      return false;
    }
  }

  return true;
}

function normalizeStatus(status: unknown): string {
  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    inactive: "INACTIVE",
    draft: "DRAFT",
  };
  return statusMap[String(status)] || String(status).toUpperCase();
}

export function transformFormDataToProduct(
  values: Record<string, unknown>,
  mode: "simplificado" | "completo"
): Record<string, unknown> {
  const registrationType = mode === "simplificado" ? "simplified" : "complete";
  
  // Processar imagens
  const images = {
    product: (values["images.product"] as string[]) || [],
    marketplace: (values["images.marketplace"] as string[]) || [],
    shipping: (values["images.shipping"] as string[]) || [],
  };

  // Base do produto
  const product: Record<string, unknown> = {
    sku: values.sku || null,
    title: values.title || "",
    status: normalizeStatus(values.status || "active"),
    images,
    stock_handling: values.stock_handling ?? true,
    unity_type: values.unity_type || "UNITY",
    product_origin: values.product_origin || "NATIONAL",
    marketing_type: values.marketing_type || "RESALE",
  };

  // Campos específicos do modo simplificado
  if (mode === "simplificado") {
    product.price_sale = Number(values.price_sale) || 0;
    product.price_cost = Number(values.price_cost) || 0;
    product.initial_quantity = Number(values.available_quantity) || 0;
    product.category_name = values.category_name || "";
  }

  // Campos específicos do modo completo
  if (mode === "completo") {
    product.description = values.description && String(values.description).trim() ? String(values.description) : null;
    product.brand = values.brand && String(values.brand).trim() ? String(values.brand) : null;
    product.internal_code = values.internal_code && String(values.internal_code).trim() ? String(values.internal_code) : null;
    product.price_sale = Number(values.price_sale) || 0;
    product.price_cost = Number(values.price_cost) || 0;
    product.packaging_cost = values.packaging_cost !== undefined && values.packaging_cost !== null && values.packaging_cost !== "" ? Number(values.packaging_cost) : null;
    product.extra_cost = values.extra_cost !== undefined && values.extra_cost !== null && values.extra_cost !== "" ? Number(values.extra_cost) : null;
    product.available_quantity = Number(values.available_quantity) || 0;
    product.initial_quantity = values.initial_quantity !== undefined && values.initial_quantity !== null && values.initial_quantity !== "" 
      ? Number(values.initial_quantity) 
      : (Number(values.available_quantity) || 0);
    product.minimum_quantity = Number(values.minimum_quantity) || 0;
    product.maximum_quantity = values.maximum_quantity !== undefined && values.maximum_quantity !== null && values.maximum_quantity !== "" ? Number(values.maximum_quantity) : null;
    product.ncm = values.ncm && String(values.ncm).trim() ? String(values.ncm) : null;
    product.ean = values.ean && String(values.ean).trim() ? String(values.ean) : null;
    product.icms = values.icms !== undefined ? Boolean(values.icms) : null;
    product.cest = values.cest && String(values.cest).trim() ? String(values.cest) : null;
    product.tax_replacement = values.tax_replacement ?? false;
    product.brute_weight = values.brute_weight !== undefined && values.brute_weight !== null && values.brute_weight !== "" ? Number(values.brute_weight) : null;
    product.net_weight = values.net_weight !== undefined && values.net_weight !== null && values.net_weight !== "" ? Number(values.net_weight) : null;
    product.height = values.height !== undefined && values.height !== null && values.height !== "" ? Number(values.height) : null;
    product.width = values.width !== undefined && values.width !== null && values.width !== "" ? Number(values.width) : null;
    product.depth = values.depth !== undefined && values.depth !== null && values.depth !== "" ? Number(values.depth) : null;
    product.category_name = values.category_name || "";
  }

  // Processar variações se houver
  const variations: Record<string, unknown>[] = [];
  if (values.has_variations && Array.isArray(values.variations)) {
    for (const variation of values.variations as Record<string, unknown>[]) {
      const variationData: Record<string, unknown> = {
        sku: variation.sku || null,
        title: variation.title || "",
        status: normalizeStatus(variation.status || "active"),
        images: variation.images || { product: [], marketplace: [], shipping: [] },
      };

      if (variation.attributes) {
        variationData.attributes = variation.attributes;
      }

      // Campos específicos de variação no modo completo
      if (mode === "completo") {
        if (variation.description) variationData.description = variation.description;
        if (variation.price_sale) variationData.price_sale = Number(variation.price_sale);
        if (variation.price_cost) variationData.price_cost = Number(variation.price_cost);
        if (variation.packaging_cost) variationData.packaging_cost = Number(variation.packaging_cost);
        if (variation.extra_cost) variationData.extra_cost = Number(variation.extra_cost);
        if (variation.stock_handling !== undefined) variationData.stock_handling = variation.stock_handling;
        if (variation.available_quantity) variationData.available_quantity = Number(variation.available_quantity);
        if (variation.minimum_quantity !== undefined) variationData.minimum_quantity = Number(variation.minimum_quantity);
        if (variation.maximum_quantity !== undefined) variationData.maximum_quantity = Number(variation.maximum_quantity);
        if (variation.ncm) variationData.ncm = variation.ncm;
        if (variation.ean) variationData.ean = variation.ean;
        if (variation.icms !== undefined) variationData.icms = variation.icms;
        if (variation.cest) variationData.cest = variation.cest;
      }

      variations.push(variationData);
    }
  }

  return {
    registration_type: registrationType,
    product,
    variations,
  };
}

export function getStepIndexById(steps: FormStep[], stepId: string): number {
  return steps.findIndex((step) => step.id === stepId);
}

export function getStepById(steps: FormStep[], stepId: string): FormStep | undefined {
  return steps.find((step) => step.id === stepId);
}

