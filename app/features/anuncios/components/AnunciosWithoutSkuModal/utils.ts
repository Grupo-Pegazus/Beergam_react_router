/**
 * Utilitários compartilhados para componentes de AnunciosWithoutSkuModal
 */

export function formatCurrency(price: string | number | null | undefined) {
  if (price == null) return "R$ 0,00";
  const value = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(value) || !Number.isFinite(value)) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

