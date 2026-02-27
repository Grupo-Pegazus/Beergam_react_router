export interface CalculatorRequest {
  sale_price: number;
  cost_price: number;
  ml_fee_percentage: number;
  ml_fee_amount: number;
  weekly_sales?: number;
  shipping_cost?: number;
  fiscal_tributes?: number;
  additional_costs_amount?: number;
  additional_costs_percentage?: number;
  calculator_type?: "ml" | "shopee" | "importacao";
  typeAd?: "classico" | "premium" | "sem_frete_gratis" | "com_frete_gratis";
  seller_type?: "cnpj" | "cpf";
  payment_method?: "pix" | "outros";
  orders_last_90_days?: number;
  highlight_campaign?: boolean;
  freight_coupon_value?: number;
}

export interface CalculatorCosts {
  purchase_price: number;
  commission_ml: number;
  shipping_cost: number;
  fiscal_tributes: number;
  additional_costs: number;
}

export interface ShopeeDetails {
  gross_commission: number;
  percent_applied: number;
  fixed_fee_applied: number;
  pix_subsidy_amount: number;
  net_commission: number;
  cpf_surcharge: number;
  campaign_surcharge: number;
  freight_coupon_cost: number;
  total_commission: number;
}

export interface UnitCalculation {
  total_expenses: number;
  revenue: number;
  gross_profit: number;
  net_profit: number;
}

export interface WeeklyCalculation {
  weekly_sales: number;
  total_expenses: number;
  total_revenue: number;
  total_gross_profit: number;
  total_net_profit: number;
}

export interface CalculatorMargins {
  gross_margin_per_unit: number;
  net_margin_per_unit: number;
}

export interface CalculatorResponse {
  costs: CalculatorCosts;
  unit_calculation: UnitCalculation;
  weekly_calculation: WeeklyCalculation;
  margins: CalculatorMargins;
  shopee_details?: ShopeeDetails | null;
}

export interface CalculatorFormData {
  productLink: string;
  salePrice: string;
  costPrice: string;
  weeklySales: string;
  freeShipping: boolean;
  shippingCost: string;
  adType: "classico" | "premium" | "sem_frete_gratis" | "com_frete_gratis";
  commissionPercentage: string;
  taxRegime: string;
  annualRevenue: string;
  taxesPercentage: string;
  additionalCostsAmount: string;
  additionalCostsPercentage: string;
  calculatorType: "ml" | "shopee" | "importacao";

  classicCommission?: number;
  premiumCommission?: number;

  sellerType: "cnpj" | "cpf";
  paymentMethod: "pix" | "outros";
  ordersLast90Days: string;
  highlightCampaign: boolean;
  freightCouponValue: string;
}


export interface MeliProductPrices {
  original: number;
  current: number;
  alternative: number;
}

export interface MeliProductImages {
  main: string | null;
  thumbnail: string | null;
  zoom: string | null;
}

export interface MeliProductResponse {
  title: string;
  prices: MeliProductPrices;
  category_id: string;
  category_name: string;
  currency_id: string;
  logistics_type: string | null;
  listing_type: string | null;
  images: MeliProductImages;
  quantity: number;
}

export interface MeliSaleFeeDetails {
  percentage_fee?: number;
  gross_amount?: number;
  [key: string]: unknown;
}

export interface MeliListingPrice {
  listing_type_id: string;
  base_price?: number;
  sale_fee?: number;
  sale_fee_details?: MeliSaleFeeDetails;

  [key: string]: unknown;
}

export interface ISavedCalculation {
  id: number;
  name: string;
  type_calculator: "meli" | "shopee" | "importacao";
  photo_file_id: string | null;
  photo_url: string | null;
  input_payload: CalculatorRequest;
  output_payload: CalculatorResponse;
  created_at: string | null;
  updated_at: string | null;
}

export interface SaveCalculationPayload {
  name: string;
  type_calculator: "meli" | "shopee" | "importacao";
  input_payload: CalculatorRequest;
  output_payload: CalculatorResponse;
  photo?: File;
}

