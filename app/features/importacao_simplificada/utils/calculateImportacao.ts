import type {
  ImportacaoSimplificadaFormData,
  ImportacaoSimplificadaResult,
} from "../typings";

const II_PERCENTAGE = 60; // Imposto de Importação fixo 60% (sites não Remessa Conforme ou acima de US$ 50)

export function calculateImportacaoSimplificada(
  formData: ImportacaoSimplificadaFormData
): ImportacaoSimplificadaResult | null {
  const exchangeRate = parseFloat(formData.exchangeRate) || 0;
  const cargoWeightKg = parseFloat(formData.cargoWeightKg) || 0;
  const freightCostPerKgUsd = parseFloat(formData.freightCostPerKgUsd) || 0;
  const icmsPercentage = parseFloat(formData.icmsPercentage) || 18;
  const declarationType = formData.declarationType || "100";
  const declarationCustomPercentage =
    declarationType === "custom"
      ? parseFloat(formData.declarationCustomPercentage) || 100
      : 100;

  const valorTotalPedidoUsd = (formData.products || []).reduce((acc, p) => {
    const qty = parseInt(p.quantity, 10) || 0;
    const price = parseFloat(p.unitPriceUsd) || 0;
    return acc + qty * price;
  }, 0);

  const totalQuantity = (formData.products || []).reduce(
    (acc, p) => acc + (parseInt(p.quantity, 10) || 0),
    0
  );

  if (exchangeRate <= 0 || totalQuantity <= 0) {
    return null;
  }
  const valorTotalPedidoBrl = valorTotalPedidoUsd * exchangeRate;

  const totalFreteUsd = cargoWeightKg * freightCostPerKgUsd;
  const totalFreteBrl = totalFreteUsd * exchangeRate;

  const valorTotalBrutoUsd = valorTotalPedidoUsd + totalFreteUsd;
  const declarationFactor =
    declarationType === "100" ? 1 : declarationCustomPercentage / 100;
  const baseCalculoUsd = valorTotalBrutoUsd * declarationFactor;
  const baseCalculoBrl = baseCalculoUsd * exchangeRate;

  const impostoImportacaoUsd = baseCalculoUsd * (II_PERCENTAGE / 100);
  const impostoImportacaoBrl = impostoImportacaoUsd * exchangeRate;

  const subtotalUsd = baseCalculoUsd + impostoImportacaoUsd;
  const subtotalBrl = subtotalUsd * exchangeRate;

  // ICMS "por fora": Total = Sub_total / (1 - icms_rate), ICMS = Total - Sub_total
  const icmsRate = icmsPercentage / 100;
  const totalImportacaoUsd = subtotalUsd / (1 - icmsRate);
  const icmsUsd = totalImportacaoUsd - subtotalUsd;
  const totalImportacaoBrl = totalImportacaoUsd * exchangeRate;
  const icmsBrl = icmsUsd * exchangeRate;

  const custoUnitarioUsd = totalImportacaoUsd / totalQuantity;
  const custoUnitarioBrl = totalImportacaoBrl / totalQuantity;

  const fatorConversao = baseCalculoUsd > 0 ? totalImportacaoBrl / baseCalculoUsd : exchangeRate;

  return {
    totalQuantity,
    valorTotalPedidoUsd,
    valorTotalPedidoBrl,
    totalFreteUsd,
    totalFreteBrl,
    baseCalculoUsd,
    baseCalculoBrl,
    impostoImportacaoUsd,
    impostoImportacaoBrl,
    subtotalUsd,
    subtotalBrl,
    icmsUsd,
    icmsBrl,
    totalImportacaoUsd,
    totalImportacaoBrl,
    custoUnitarioUsd,
    custoUnitarioBrl,
    fatorConversao,
  };
}
