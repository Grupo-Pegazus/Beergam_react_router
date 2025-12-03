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
  calculator_type?: "ml" | "shopee";
  typeAd?: "classico" | "premium" | "normal" | "indicado";
}

export interface CalculatorCosts {
  purchase_price: number;
  commission_ml: number;
  shipping_cost: number;
  fiscal_tributes: number;
  additional_costs: number;
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
}

export interface CalculatorFormData {
  productLink: string;
  salePrice: string;
  costPrice: string;
  weeklySales: string;
  freeShipping: boolean;
  shippingCost: string;
  adType: "classico" | "premium" | "normal" | "indicado";
  commissionPercentage: string;
  taxRegime: string;
  annualRevenue: string;
  taxesPercentage: string;
  additionalCostsAmount: string;
  additionalCostsPercentage: string;
  calculatorType: "ml" | "shopee";
}

