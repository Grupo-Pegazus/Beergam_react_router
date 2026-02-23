import dayjs from "dayjs";
import { z } from "zod";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import { AD_TYPE_OPTIONS, DELIVERY_OPTIONS } from "../anuncios/components/Filters/AnunciosFilters";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
// ============================================
// Schemas reutilizáveis para transformações
// ============================================

/** Schema para strings de data - transforma em formato pt-BR (dd/mm/yyyy) */
export const dateString = z.string().transform((val) => 
  dayjs(val).format('DD/MM/YYYY, HH:mm')
).nullable().optional();

export const dateStringWithoutTime = z.string().transform((val) => 
  dayjs(val).format('DD/MM/YYYY')
).nullable().optional();

/** Schema para strings de data nullable/optional */
export const dateStringOptional = dateStringWithoutTime.nullable().optional();

/** Schema para strings de moeda - transforma em formato BRL (R$ x.xxx,xx) */
export const currencyString = z.string().transform((val) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(val))
);

export const currencyNumber = z.number().transform((val) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
);

/** Schema para strings de moeda nullable/optional */
export const currencyStringOptional = currencyString.nullable().optional();

export const currencyNumberOptional = currencyNumber.nullable().optional();

export const percentageString = z.string().transform((val) => 
  `${(parseFloat(val)).toFixed(2)}%`
);

export const percentageNumber = z.number().transform((val) => 
  `${(parseFloat(String(val))).toFixed(2)}%`
);

export const percentageStringOptional = percentageString.nullable().optional();

export const percentageNumberOptional = percentageNumber.nullable().optional();

// ============================================

// Schema para documento do cliente
export const ReceiverDocumentSchema = z.object({
  id: z.string(), // "CPF" ou "CNPJ"
  value: z.string(),
});

export type ReceiverDocument = z.infer<typeof ReceiverDocumentSchema>;

// Schema para cliente
export const ClientSchema = z.object({
  receiver_name: z.string().nullable().optional(),
  receiver_document: ReceiverDocumentSchema.nullable().optional(),
});

export type Client = z.infer<typeof ClientSchema>;

// Schema para detalhes de envio
export const ShippingDetailsSchema = z.object({
  address_line: z.string(),
  neighborhood: z.string(),
  street_name: z.string(),
  street_number: z.string(),
});

export type ShippingDetails = z.infer<typeof ShippingDetailsSchema>;



// Schema para pedido (baseado no MeliOrderSchema do backend)
export const OrderSchema = z.object({
  id: z.number().optional(),
  order_id: z.string(),
  marketplace_shop_id: z.string(),
  pack_id: z.string().nullable().optional(),
  buyer_id: z.string(),
  buyer_nickname: z.string().nullable().optional(),
  date_created: dateString,
  date_closed: dateString,
  expiration_date: dateString,
  status: z.string(),
  total_amount: currencyString,
  paid_amount: currencyString,
  currency_id: z.string(),
  shipping_id: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  payments: z.array(z.unknown()).nullable().optional(),
  sku: z.string().nullable().optional(),
  mlb: z.string(),
  title: z.string(),
  category_id: z.string(),
  quantity: z.number(),
  unit_price: currencyString,
  sale_fee: currencyString,
  listing_type_id: z.string().transform((val) => AD_TYPE_OPTIONS.find((option) => option.value === val)?.label),
  condition: z.string(),
  shipping_mode: z.string().nullable().optional().transform((val) => DELIVERY_OPTIONS.find((option) => option.value === val)?.label),
  tracking_number: z.string().nullable().optional(),
  tracking_method: z.string().nullable().optional(),
  shipment_status: z.string().nullable().optional().transform((val) => getStatusOrderMeliInfo(val)?.label),
  shipment_substatus: z.string().nullable().optional(),
  estimated_delivery: dateStringWithoutTime,
  declared_value: currencyStringOptional,
  shipping_method_name: z.string().nullable().optional(),
  shipping_paid_by: z.string().nullable().optional(),
  shipping_destination_state: z.string().nullable().optional(),
  shipping_details: ShippingDetailsSchema.nullable().optional(),
  custo_envio_base: currencyStringOptional,
  custo_envio_final: currencyStringOptional,
  custo_envio_buyer: currencyStringOptional,
  custo_envio_seller: currencyStringOptional,
  custo_envio_desconto: currencyStringOptional,
  custo_envio_compensacao: currencyStringOptional,
  custo_envio_promoted_amount: currencyStringOptional,
  frete_recebido_total: currencyStringOptional,
  valor_base: currencyStringOptional,
  valor_liquido: currencyStringOptional,
  bonus_por_envio_estorno: z.string().nullable().optional(),
  tax_percentage: percentageStringOptional,
  tax_amount: currencyStringOptional,
  price_cost: currencyStringOptional,
  packaging_cost: currencyStringOptional,
  extra_cost: currencyStringOptional,
  stock_cost: currencyStringOptional,
  shipment_costs: z.record(z.string(), z.unknown()).nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  ad_type: z.string().nullable().optional(),
  client: ClientSchema.nullable().optional(),
  isRegisteredInternally: z.boolean().optional(), // Presente apenas no endpoint de detalhes
  created_at: dateStringOptional,
  updated_at: dateStringOptional,
  // Lucro e margem calculados pelo backend
  profit: currencyNumberOptional,
  profit_margin: percentageNumberOptional,
  // Custo total (soma price_cost + packaging_cost + extra_cost)
  total_cost: currencyNumberOptional,
  margin_cost: percentageNumberOptional,
  // falta colocar tax_type aqui
  meli_flex_shipping_fee: currencyStringOptional,
});

export type Order = z.infer<typeof OrderSchema>;

type OrderTranslatedAttributes = Record<keyof Order, string>;

export const OrderTranslatedAttributes: OrderTranslatedAttributes = {
  id: "ID",
  order_id: "ID do Pedido",
  marketplace_shop_id: "ID da Loja",
  pack_id: "ID do Pacote",
  buyer_id: "ID do Comprador",
  buyer_nickname: "Apelido do Comprador",
  date_created: "Data de Criação",
  date_closed: "Data de Fechamento",
  expiration_date: "Data de Expiração",
  status: "Status",
  total_amount: "Valor Total",
  paid_amount: "Valor Pago",
  currency_id: "Moeda",
  shipping_id: "ID de Envio",
  tags: "Tags",
  payments: "Pagamentos",
  sku: "SKU",
  mlb: "MLB",
  title: "Título",
  category_id: "ID da Categoria",
  quantity: "Quantidade",
  unit_price: "Preço Unitário",
  sale_fee: "Taxa de Venda",
  listing_type_id: "Tipo de Listagem",
  condition: "Condição",
  shipping_mode: "Modo de Envio",
  tracking_number: "Número de Rastreamento",
  tracking_method: "Método de Rastreamento",
  shipment_status: "Status do Envio",
  shipment_substatus: "Substatus do Envio",
  estimated_delivery: "Entrega Estimada",
  declared_value: "Valor Declarado",
  shipping_method_name: "Nome do Método de Envio",
  shipping_paid_by: "Frete Pago Por",
  shipping_destination_state: "Estado de Destino",
  shipping_details: "Detalhes de Envio",
  custo_envio_base: "Custo de Envio Base",
  custo_envio_final: "Custo de Envio Final",
  custo_envio_buyer: "Custo de Envio Comprador",
  custo_envio_seller: "Custo de Envio Vendedor",
  custo_envio_desconto: "Desconto no Envio",
  custo_envio_compensacao: "Compensação no Envio",
  custo_envio_promoted_amount: "Valor Promocional do Envio",
  frete_recebido_total: "Frete Recebido Total",
  valor_base: "Valor Base",
  valor_liquido: "Valor Líquido",
  bonus_por_envio_estorno: "Bônus por Estorno de Envio",
  tax_percentage: "Percentual de Imposto",
  tax_amount: "Valor do Imposto",
  price_cost: "Custo do Produto",
  packaging_cost: "Custo de Embalagem",
  extra_cost: "Custo Extra",
  stock_cost: "Custo de Estoque",
  shipment_costs: "Custos de Envio",
  thumbnail: "Miniatura",
  ad_type: "Tipo de Anúncio",
  client: "Cliente",
  isRegisteredInternally: "Registrado Internamente",
  created_at: "Criado Em",
  updated_at: "Atualizado Em",
  profit: "Lucro",
  profit_margin: "Margem de Lucro",
  margin_cost: "Margem sobre o Custo",
  total_cost: "Custo Total",
  meli_flex_shipping_fee: "Valor pago no flex por pedido no Mercado Livre",
} as const;
// ============================================
// SISTEMA DE SEÇÕES E CORES PARA TABELA
// ============================================

/** Tipos de seções disponíveis */
export type OrderSection = 
  | 'identification'
  | 'dates_status'
  | 'product'
  | 'order_values'
  | 'taxes_costs'
  | 'shipping_logistics'
  | 'shipping_costs';

/** Configuração de cor para cada seção */
export interface SectionColorConfig {
  name: string;
  headerColor: string;  // Cor mais forte para o header
  bodyColor: string;    // Cor mais clara para o body
}

/** Configuração de cores por seção - EDITE AQUI PARA MUDAR AS CORES */
export const OrderSectionColors: Record<OrderSection, SectionColorConfig> = {
  identification: {
    name: 'Identificação do Pedido',
    headerColor: '#e2e8f0',  // Cinza slate
    bodyColor: '#f8fafc',
  },
  dates_status: {
    name: 'Datas e Status',
    headerColor: '#c7d2fe',  // Indigo claro
    bodyColor: '#eef2ff',
  },
  product: {
    name: 'Produto / Anúncio',
    headerColor: '#a5f3fc',  // Cyan
    bodyColor: '#ecfeff',
  },
  order_values: {
    name: 'Valores do Pedido',
    headerColor: '#bbf7d0',  // Verde claro
    bodyColor: '#f0fdf4',
  },
  taxes_costs: {
    name: 'Taxas, Impostos e Custos',
    headerColor: '#fecaca',  // Vermelho claro
    bodyColor: '#fef2f2',
  },
  shipping_logistics: {
    name: 'Envio e Logística',
    headerColor: '#fde68a',  // Amarelo
    bodyColor: '#fefce8',
  },
  shipping_costs: {
    name: 'Custos e Receitas de Envio',
    headerColor: '#fdba74',  // Laranja
    bodyColor: '#fff7ed',
  },
} as const;

/** Mapeamento de cada atributo para sua seção (na ordem correta) */
export const OrderAttributeSection: Record<keyof Order, OrderSection> = {
  // Identificação do Pedido
  id: 'identification',
  order_id: 'identification',
  marketplace_shop_id: 'identification',
  pack_id: 'identification',
  buyer_id: 'identification',
  buyer_nickname: 'identification',
  client: 'identification',
  isRegisteredInternally: 'identification',
  
  // Datas e Status
  created_at: 'dates_status',
  updated_at: 'dates_status',
  date_created: 'dates_status',
  date_closed: 'dates_status',
  expiration_date: 'dates_status',
  status: 'dates_status',
  
  // Produto / Anúncio
  sku: 'product',
  mlb: 'product',
  title: 'product',
  category_id: 'product',
  quantity: 'product',
  unit_price: 'product',
  ad_type: 'product',
  listing_type_id: 'product',
  condition: 'product',
  thumbnail: 'product',
  
  // Valores do Pedido
  total_amount: 'order_values',
  paid_amount: 'order_values',
  currency_id: 'order_values',
  valor_base: 'order_values',
  valor_liquido: 'order_values',
  profit: 'order_values',
  profit_margin: 'order_values',
  margin_cost: 'order_values',

  // Taxas, Impostos e Custos Fixos
  tax_percentage: 'taxes_costs',
  tax_amount: 'taxes_costs',
  sale_fee: 'taxes_costs',
  price_cost: 'taxes_costs',
  packaging_cost: 'taxes_costs',
  extra_cost: 'taxes_costs',
  total_cost: 'taxes_costs',
  stock_cost: 'taxes_costs',
  // Envio e Logística
  shipping_id: 'shipping_logistics',
  shipping_method_name: 'shipping_logistics',
  shipping_mode: 'shipping_logistics',
  shipping_paid_by: 'shipping_logistics',
  shipping_destination_state: 'shipping_logistics',
  shipping_details: 'shipping_logistics',
  tracking_number: 'shipping_logistics',
  tracking_method: 'shipping_logistics',
  shipment_status: 'shipping_logistics',
  shipment_substatus: 'shipping_logistics',
  estimated_delivery: 'shipping_logistics',
  declared_value: 'shipping_logistics',
  
  // Custos e Receitas de Envio
  custo_envio_base: 'shipping_costs',
  custo_envio_final: 'shipping_costs',
  custo_envio_buyer: 'shipping_costs',
  custo_envio_seller: 'shipping_costs',
  custo_envio_desconto: 'shipping_costs',
  custo_envio_compensacao: 'shipping_costs',
  custo_envio_promoted_amount: 'shipping_costs',
  frete_recebido_total: 'shipping_costs',
  bonus_por_envio_estorno: 'shipping_costs',
  shipment_costs: 'shipping_costs',
  meli_flex_shipping_fee: 'shipping_costs',
  
  // Campos extras (não categorizados - usam identification)
  tags: 'identification',
  payments: 'order_values',
} as const;

/** Ordem dos atributos para exibição na tabela */
export const OrderAttributeDisplayOrder: (keyof Order)[] = [
  // Identificação do Pedido
  'id', 'order_id', 'marketplace_shop_id', 'pack_id', 'buyer_id', 'buyer_nickname', 'client', 'isRegisteredInternally',
  // Datas e Status
  'created_at', 'updated_at', 'date_created', 'date_closed', 'expiration_date', 'status',
  // Produto / Anúncio
  'sku', 'mlb', 'title', 'category_id', 'quantity', 'unit_price', 'listing_type_id', 'thumbnail',
  // Valores do Pedido
  'total_amount', 'paid_amount', 'valor_liquido', 'profit', 'profit_margin', 'margin_cost',
  // Taxas, Impostos e Custos Fixos
  'tax_percentage', 'tax_amount', 'sale_fee', 'price_cost', 'packaging_cost', 'extra_cost', 'total_cost',
  // Envio e Logística
  'shipping_id', 'shipping_mode', 'shipping_paid_by', 'shipping_destination_state', 
  'shipping_details', 'tracking_number', 'tracking_method', 'shipment_status', 'shipment_substatus', 
  'estimated_delivery', 'declared_value',
  // Custos e Receitas de Envio
  'custo_envio_final', 'custo_envio_buyer', 'custo_envio_seller', 'custo_envio_desconto',
  'custo_envio_compensacao', 'custo_envio_promoted_amount', 'frete_recebido_total', 'bonus_por_envio_estorno', 
  'shipment_costs',
  // Extras
  'tags', 'payments',
];

/** Helper: Obtém as cores de um atributo */
export function getAttributeColors(key: keyof Order): { headerColor: string; bodyColor: string } {
  const section = OrderAttributeSection[key];
  return {
    headerColor: OrderSectionColors[section].headerColor,
    bodyColor: OrderSectionColors[section].bodyColor,
  };
}

/** Helper: Obtém o nome da seção de um atributo */
export function getAttributeSectionName(key: keyof Order): string {
  const section = OrderAttributeSection[key];
  return OrderSectionColors[section].name;
}

// ============================================
// CONFIGURAÇÃO DE COLUNAS COM VALORES NEGATIVOS
// ============================================

/** Cor padrão para valores negativos (custos, taxas, impostos) */
export const NEGATIVE_VALUE_COLOR = 'var(--color-beergam-red-primary)'; // Vermelho

/** 
 * Lista de colunas que representam valores negativos (custos, taxas, impostos).
 * Esses valores serão exibidos em vermelho na tabela.
 */
export const NegativeValueColumns: (keyof Order)[] = [
  // Taxas e Impostos
  'tax_percentage',
  'tax_amount',
  'sale_fee',
  
  // Custos
  'price_cost',
  'packaging_cost',
  'extra_cost',
  'total_cost',
  'stock_cost',
  // Custos de envio
  'custo_envio_base',
  'custo_envio_final',
  'custo_envio_seller',
];

/** Helper: Verifica se uma coluna é de valor negativo */
export function isNegativeValueColumn(key: keyof Order): boolean {
  return NegativeValueColumns.includes(key);
}

/** Helper: Retorna a cor do texto se for coluna de valor negativo */
export function getTextColorForColumn(key: keyof Order): string | undefined {
  return isNegativeValueColumn(key) ? NEGATIVE_VALUE_COLOR : undefined;
}

// ============================================
// CONFIGURAÇÃO DE FOOTER PARA COLUNAS
// ============================================

/** Configuração de footer para uma coluna individual */
export interface ColumnFooterConfig {
  /** Valor a ser exibido no footer (pode ser string, número ou ReactNode) */
  value: string | number | React.ReactNode;
  /** Cor de fundo do footer (opcional) */
  color?: string;
}

/** 
 * Dicionário tipado para configurar footers de colunas específicas.
 * Não é obrigatório definir todas as keys de Order.
 * 
 * @example
 * const footerConfig: OrderColumnFooters = {
 *   unit_price: { value: 'R$ 1.234,56' },
 *   quantity: { value: 'Total: 150', color: '#bbf7d0' },
 *   total_amount: { value: totalAmount },
 * };
 */
export type OrderColumnFooters = Partial<Record<keyof Order, ColumnFooterConfig>>;

/** 
 * Helper: Cria o objeto de footers para as colunas.
 * Útil para ter autocomplete e validação de tipos.
 * 
 * @example
 * const footers = createColumnFooters({
 *   unit_price: { value: formatCurrency(total) },
 *   quantity: { value: `${totalQty} unidades` },
 * });
 */
export function createColumnFooters(config: OrderColumnFooters): OrderColumnFooters {
  return config;
}

/**
 * Helper: Obtém o footerValue e footerColor para uma coluna específica.
 * Retorna undefined se a coluna não tiver footer configurado.
 */
export function getColumnFooter(
  key: keyof Order, 
  footers: OrderColumnFooters
): { footerValue?: string | number | React.ReactNode; footerColor?: string } | undefined {
  const config = footers[key];
  if (!config) return undefined;
  
  return {
    footerValue: config.value,
    footerColor: config.color,
  };
}
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
  negative_margin: z.boolean().optional(),
  missing_costs: z.boolean().optional(),
  missing_taxes: z.boolean().optional(),
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

const PriceRanges = z.enum([				"Até R$ 29,99",
				"Mais de R$ 2.000,00",
  "R$ 1.000,00 a R$ 1.999,99",
  "R$ 100 a R$ 199,99",
  "R$ 200 a R$ 499,99",
  "R$ 30 a R$ 49,99",
  "R$ 50 a R$ 99,99",
  "R$ 500 a R$ 999,99"
]);
export type PriceRanges = z.infer<typeof PriceRanges>;

// Schema para métricas de pedidos
export const OrdersMetricsSchema = z.object({
  orders_by_status: z.object({
    prontas_para_enviar: z.number(),
    em_transito: z.number(),
    concluidas: z.number(),
  }),
  faturamento_bruto: z.string(),
  faturamento_liquido: z.string(),
  media_faturamento_diario: z.string(),
  comparacao_periodo_anterior: z.object({
    faturamento_bruto_diff: z.string(),
    faturamento_liquido_diff: z.string(),
    media_diaria_diff: z.string(),
  }),
  period_days: z.number().optional(),
  costs: z.object({
    comissions: z.number(),
    internal_costs: z.number(),
    package_costs: z.number(),
    extra_costs: z.number(),
    shipping: z.object({
      buyer: z.number(),
      seller: z.number(),
    }),
  }),
  price_ranges: z.record(PriceRanges, z.number()),
});

export type OrdersMetrics = z.infer<typeof OrdersMetricsSchema>;

export const DailyRevenueItemSchema = z.object({ 
  date: z.string(),
  faturamento_bruto: z.string(),
  faturamento_liquido: z.string(),
  total_pedidos: z.number(),
});

export type DailyRevenueItem = z.infer<typeof DailyRevenueItemSchema>;

type LogisticTypeMeliInfo = ReturnType<typeof getLogisticTypeMeliInfo>;
type LogisticTypeMeliLabel = LogisticTypeMeliInfo["label"];

export const DailyRevenueByShipmentTypeSchema = z.record(z.string(), z.number());

export type DailyRevenueByShipmentType = z.infer<
  typeof DailyRevenueByShipmentTypeSchema
> &
  Record<LogisticTypeMeliLabel, number>;

export const DailyRevenueSchema = z.object({
  daily_revenue: z.array(DailyRevenueItemSchema),
  daily_revenue_by_shipment_type: DailyRevenueByShipmentTypeSchema,
});

export type DailyRevenue = z.infer<typeof DailyRevenueSchema>;

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

// Schema para evento da timeline
export const TimelineEventSchema = z.object({
  date: z.string(),
  status: z.string(),
  substatus: z.string().nullable().optional(),
});

export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

// Schema para informações do pack
export const PackInfoSchema = z.object({
  pack_id: z.string(),
  total_items: z.number(),
  total_orders: z.number(),
});

export type PackInfo = z.infer<typeof PackInfoSchema>;

// Schema para resposta de detalhes do pedido
export const OrderDetailsResponseSchema = z.object({
  filters_applied: z.record(z.string(), z.unknown()).optional(),
  orders: z.array(OrderSchema),
  pack_info: PackInfoSchema,
  pagination: PaginationSchema,
  timeline_events: z.array(TimelineEventSchema),
});

export type OrderDetailsResponse = z.infer<typeof OrderDetailsResponseSchema>;

// ===========================
// Reprocessamento (cota + ações)
// ===========================

export const ReprocessQuotaSchema = z.object({
  resource_type: z.string(),
  year_month: z.string(),
  limit: z.number(),
  used: z.number(),
  remaining: z.number(),
});

export type ReprocessQuota = z.infer<typeof ReprocessQuotaSchema>;

export const ReprocessOrderItemSchema = z.object({
  order_id: z.string(),
  success: z.boolean(),
  message: z.string().optional(),
});

export type ReprocessOrderItem = z.infer<typeof ReprocessOrderItemSchema>;

export const ReprocessOrdersResponseSchema = z.object({
  items: z.array(ReprocessOrderItemSchema),
  total_requested: z.number(),
  total_reprocessed: z.number(),
});

export type ReprocessOrdersResponse = z.infer<typeof ReprocessOrdersResponseSchema>;

// Resposta do reprocessamento interno por período
export const ReprocessOrdersInternalResponseSchema = z.object({
  total_orders: z.number(),
  costs_updated: z.number(),
  taxes_updated: z.number(),
});

export type ReprocessOrdersInternalResponse = z.infer<typeof ReprocessOrdersInternalResponseSchema>;

export const ExportJobStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export type ExportJobStatus = z.infer<typeof ExportJobStatusSchema>;

export const ExportJobSchema = z.object({
  job_id: z.string(),
  status: ExportJobStatusSchema,
  created_at: z.string(),
  completed_at: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  rows_written: z.number().optional(),
  error_message: z.string().nullable().optional(),
});

export type ExportJob = z.infer<typeof ExportJobSchema>;

export const CreateExportResponseSchema = z.object({
  job_id: z.string(),
});

export type CreateExportResponse = z.infer<typeof CreateExportResponseSchema>;

// Resposta do sync-costs-by-sku (202 Accepted)
export const SyncCostsBySkuTaskSchema = z.object({
  sku: z.string(),
  task_id: z.string().nullable().optional(),
  error: z.string().optional(),
});

export const SyncCostsBySkuResponseSchema = z.object({
  tasks: z.array(SyncCostsBySkuTaskSchema),
  total_skus: z.number(),
  tasks_enqueued: z.number(),
  status: z.string(),
  message: z.string().optional(),
});

export type SyncCostsBySkuResponse = z.infer<typeof SyncCostsBySkuResponseSchema>;

export const ExportHistoryResponseSchema = z.object({
  total: z.number(),
  jobs: z.array(ExportJobSchema),
});

export type ExportHistoryResponse = z.infer<typeof ExportHistoryResponseSchema>;

