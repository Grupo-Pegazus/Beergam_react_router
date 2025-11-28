import type { FormConfig, FormField, FormStep } from "./types";
import type { InternalUploadService } from "~/src/components/utils/upload/types";

interface FormConfigOptions {
  uploadService?: InternalUploadService;
}

const createBasicInfoFields = (): FormField[] => [
  {
    id: "title",
    name: "title",
    label: "Título do Produto",
    hint: "Nome completo do produto",
    type: "text",
    required: true,
    placeholder: "Ex: Camiseta Básica Preta",
    gridCols: 12,
  },
  {
    id: "description",
    name: "description",
    label: "Descrição",
    hint: "Descrição detalhada do produto",
    type: "textarea",
    required: false,
    placeholder: "Descreva o produto...",
    gridCols: 12,
  },
  {
    id: "sku",
    name: "sku",
    label: "SKU",
    hint: "Código SKU do produto",
    type: "text",
    required: false,
    placeholder: "Ex: PROD-001",
    gridCols: 6,
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    hint: "Status do produto",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Selecione" },
      { value: "active", label: "Ativo" },
      { value: "inactive", label: "Inativo" },
      { value: "draft", label: "Rascunho" },
    ],
    gridCols: 6,
  },
  {
    id: "category_name",
    name: "category_name",
    label: "Categoria",
    hint: "Categoria do produto",
    type: "text",
    required: true,
    placeholder: "Ex: Cervejas",
    gridCols: 6,
  },
  {
    id: "unity_type",
    name: "unity_type",
    label: "Tipo de Unidade",
    hint: "Tipo de unidade de medida",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Selecione" },
      { value: "UNITY", label: "Unidade" },
      { value: "KG", label: "Quilograma" },
      { value: "L", label: "Litro" },
      { value: "M", label: "Metro" },
    ],
    defaultValue: "UNITY",
    gridCols: 4,
  },
  {
    id: "product_origin",
    name: "product_origin",
    label: "Origem do Produto",
    hint: "Origem do produto",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Selecione" },
      { value: "NATIONAL", label: "Nacional" },
      { value: "IMPORTED", label: "Importado" },
    ],
    defaultValue: "NATIONAL",
    gridCols: 4,
  },
  {
    id: "marketing_type",
    name: "marketing_type",
    label: "Tipo de Comercialização",
    hint: "Tipo de comercialização",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Selecione" },
      { value: "RESALE", label: "Revenda" },
      { value: "PRODUCTION", label: "Produção Própria" },
    ],
    defaultValue: "RESALE",
    gridCols: 4,
  },
  {
    id: "stock_handling",
    name: "stock_handling",
    label: "Controle de Estoque",
    hint: "Ativar controle de estoque",
    type: "checkbox",
    required: false,
    defaultValue: true,
    gridCols: 12,
  },
];

const createImagesFields = (uploadService?: InternalUploadService): FormField[] => {
  if (!uploadService) {
    return [];
  }

  return [
    {
      id: "images_product",
      name: "images.product",
      label: "Imagens do Produto",
      hint: "Adicione até 8 imagens principais do produto",
      type: "upload",
      required: false,
      uploadConfig: {
        typeImport: "internal",
        service: uploadService,
        maxFiles: 8,
        accept: "image/*",
        emptyStateLabel: "Arraste e solte ou clique para selecionar imagens do produto",
        uploadType: "product",
      },
      gridCols: 12,
    },
  ];
};

const createPriceStockFields = (): FormField[] => [
  {
    id: "price_cost",
    name: "price_cost",
    label: "Preço de Custo",
    hint: "Preço de compra do produto",
    type: "number",
    required: true,
    placeholder: "0.00",
    validation: {
      min: 0,
    },
    gridCols: 6,
  },
  {
    id: "price_sale",
    name: "price_sale",
    label: "Preço de Venda",
    hint: "Preço de venda do produto",
    type: "number",
    required: true,
    placeholder: "0.00",
    validation: {
      min: 0,
    },
    gridCols: 6,
  },
  {
    id: "available_quantity",
    name: "available_quantity",
    label: "Quantidade Disponível",
    hint: "Quantidade em estoque",
    type: "number",
    required: true,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
  },
  {
    id: "initial_quantity",
    name: "initial_quantity",
    label: "Quantidade Inicial",
    hint: "Quantidade inicial em estoque (modo completo)",
    type: "number",
    required: false,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
    conditional: {
      field: "registration_type",
      operator: "equals",
      value: "complete",
    },
  },
  {
    id: "minimum_quantity",
    name: "minimum_quantity",
    label: "Quantidade Mínima",
    hint: "Quantidade mínima em estoque",
    type: "number",
    required: false,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
  },
  {
    id: "maximum_quantity",
    name: "maximum_quantity",
    label: "Quantidade Máxima",
    hint: "Quantidade máxima em estoque",
    type: "number",
    required: false,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
  },
];

const createTaxFields = (): FormField[] => [
  {
    id: "ncm",
    name: "ncm",
    label: "NCM",
    hint: "Código NCM do produto",
    type: "text",
    required: false,
    placeholder: "Ex: 6109.10.00",
    gridCols: 4,
  },
  {
    id: "cest",
    name: "cest",
    label: "CEST",
    hint: "Código CEST do produto",
    type: "text",
    required: false,
    placeholder: "Ex: 01.001.00",
    gridCols: 4,
  },
  {
    id: "ean",
    name: "ean",
    label: "EAN",
    hint: "Código de barras EAN",
    type: "text",
    required: false,
    placeholder: "Ex: 7891234567890",
    gridCols: 4,
  },
  {
    id: "icms",
    name: "icms",
    label: "Isento de ICMS",
    hint: "Produto isento de ICMS",
    type: "checkbox",
    required: false,
    gridCols: 6,
  },
  {
    id: "tax_replacement",
    name: "tax_replacement",
    label: "Substituição Tributária",
    hint: "Produto com substituição tributária",
    type: "checkbox",
    required: false,
    gridCols: 6,
  },
];

const createDimensionsFields = (): FormField[] => [
  {
    id: "width",
    name: "width",
    label: "Largura (cm)",
    hint: "Largura do produto em centímetros",
    type: "number",
    required: false,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
  },
  {
    id: "height",
    name: "height",
    label: "Altura (cm)",
    hint: "Altura do produto em centímetros",
    type: "number",
    required: false,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
  },
  {
    id: "depth",
    name: "depth",
    label: "Profundidade (cm)",
    hint: "Profundidade do produto em centímetros",
    type: "number",
    required: false,
    placeholder: "0",
    validation: {
      min: 0,
    },
    gridCols: 4,
  },
  {
    id: "brute_weight",
    name: "brute_weight",
    label: "Peso Bruto (kg)",
    hint: "Peso bruto do produto",
    type: "number",
    required: false,
    placeholder: "0.00",
    validation: {
      min: 0,
    },
    gridCols: 6,
  },
  {
    id: "net_weight",
    name: "net_weight",
    label: "Peso Líquido (kg)",
    hint: "Peso líquido do produto",
    type: "number",
    required: false,
    placeholder: "0.00",
    validation: {
      min: 0,
    },
    gridCols: 6,
  },
];

const createAdditionalCostFields = (): FormField[] => [
  {
    id: "extra_cost",
    name: "extra_cost",
    label: "Custo Extra",
    hint: "Custos adicionais do produto",
    type: "number",
    required: false,
    placeholder: "0.00",
    validation: {
      min: 0,
    },
    gridCols: 6,
  },
  {
    id: "packaging_cost",
    name: "packaging_cost",
    label: "Custo de Embalagem",
    hint: "Custo de embalagem do produto",
    type: "number",
    required: false,
    placeholder: "0.00",
    validation: {
      min: 0,
    },
    gridCols: 6,
  },
];

const createVariationsFields = (): FormField[] => [
  {
    id: "has_variations",
    name: "has_variations",
    label: "Produto possui variações?",
    hint: "Marque se o produto possui variações (tamanho, cor, etc.)",
    type: "checkbox",
    required: false,
    gridCols: 12,
  },
];

const createSimplifiedSteps = (uploadService?: InternalUploadService): FormStep[] => [
  {
    id: "basic_info",
    label: "Informações Básicas",
    description: "Dados principais do produto",
    fields: createBasicInfoFields(),
    validateBeforeNext: true,
    icon: "document",
  },
  {
    id: "images",
    label: "Imagens",
    description: "Adicione as imagens do seu produto. Você pode adicionar até 8 imagens principais que serão usadas nos anúncios e na apresentação do produto.",
    fields: createImagesFields(uploadService),
    optional: true,
    icon: "eye",
  },
  {
    id: "variations_check",
    label: "Variações",
    description: "Informe se o produto possui variações",
    fields: createVariationsFields(),
    optional: true,
    icon: "list",
  },
  {
    id: "variations",
    label: "Cadastro de Variações",
    description: "Configure as variações do produto",
    fields: [],
    optional: true,
    conditional: {
      condition: {
        field: "has_variations",
        operator: "equals",
        value: true,
      },
    },
    icon: "list",
  },
  {
    id: "price_stock",
    label: "Preços e Estoque",
    description: "Defina preços e quantidade em estoque",
    fields: createPriceStockFields(),
    validateBeforeNext: true,
    icon: "currency_dollar",
  },
];

const createCompleteSteps = (uploadService?: InternalUploadService): FormStep[] => [
  {
    id: "basic_info",
    label: "Informações Básicas",
    description: "Dados principais do produto",
    fields: createBasicInfoFields(),
    validateBeforeNext: true,
    icon: "document",
  },
  {
    id: "images",
    label: "Imagens",
    description: "Adicione imagens do produto",
    fields: createImagesFields(uploadService),
    optional: true,
    icon: "eye",
  },
  {
    id: "variations_check",
    label: "Variações",
    description: "Informe se o produto possui variações",
    fields: createVariationsFields(),
    optional: true,
    icon: "list",
  },
  {
    id: "variations",
    label: "Cadastro de Variações",
    description: "Configure as variações do produto",
    fields: [],
    optional: true,
    conditional: {
      condition: {
        field: "has_variations",
        operator: "equals",
        value: true,
      },
    },
    icon: "list",
  },
  {
    id: "price_stock",
    label: "Preços e Estoque",
    description: "Defina preços e quantidade em estoque",
    fields: createPriceStockFields(),
    validateBeforeNext: true,
    icon: "currency_dollar",
  },
  {
    id: "tax_info",
    label: "Informações Fiscais",
    description: "Dados fiscais e tributários",
    fields: createTaxFields(),
    optional: true,
    icon: "calculator",
  },
  {
    id: "dimensions",
    label: "Dimensões e Peso",
    description: "Medidas e peso do produto",
    fields: createDimensionsFields(),
    optional: true,
    icon: "box",
  },
  {
    id: "additional_costs",
    label: "Custos Adicionais",
    description: "Custos extras e de embalagem",
    fields: createAdditionalCostFields(),
    optional: true,
    icon: "dolly",
  },
];

export const getFormConfig = (
  mode: "simplificado" | "completo",
  options?: FormConfigOptions
): FormConfig => {
  const uploadService = options?.uploadService;
  const steps =
    mode === "simplificado"
      ? createSimplifiedSteps(uploadService)
      : createCompleteSteps(uploadService);

  return {
    mode,
    steps,
    validateOnChange: true,
  };
};

