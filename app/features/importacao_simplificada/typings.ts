export interface ImportacaoSimplificadaProduct {
  id: string;
  name: string;
  quantity: string;
  unitPriceUsd: string;
}

export interface ImportacaoSimplificadaFormData {
  products: ImportacaoSimplificadaProduct[];
  exchangeRate: string;
  cargoWeightKg: string;
  freightCostPerKgUsd: string;
  icmsPercentage: string;
  declarationType: "100" | "custom";
  declarationCustomPercentage: string;
}

export interface ImportacaoSimplificadaResult {
  totalQuantity: number;
  valorTotalPedidoUsd: number;
  valorTotalPedidoBrl: number;
  totalFreteUsd: number;
  totalFreteBrl: number;
  baseCalculoUsd: number;
  baseCalculoBrl: number;
  impostoImportacaoUsd: number;
  impostoImportacaoBrl: number;
  subtotalUsd: number;
  subtotalBrl: number;
  icmsUsd: number;
  icmsBrl: number;
  totalImportacaoUsd: number;
  totalImportacaoBrl: number;
  custoUnitarioUsd: number;
  custoUnitarioBrl: number;
  fatorConversao: number;
}

