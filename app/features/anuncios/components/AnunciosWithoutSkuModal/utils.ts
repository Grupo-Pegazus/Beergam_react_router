/**
 * Utilitários compartilhados para componentes de AnunciosWithoutSkuModal
 */

export function formatCurrency(price: string | number) {
  const value = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(value)) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

