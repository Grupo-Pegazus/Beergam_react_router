type OrderLike = {
  valor_liquido?: string | number | null;
  price_cost?: string | number | null;
  packaging_cost?: string | number | null;
  extra_cost?: string | number | null;
  tax_amount?: string | number | null;
};

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Calcula o lucro de um pedido usando a mesma fórmula dos cards.
 * Lucro = Valor Líquido - Custos (produto, embalagem, extras, impostos)
 */
export function calculateOrderProfit(order: OrderLike): number {
  return (
    toNumber(order.valor_liquido) -
    toNumber(order.price_cost) -
    toNumber(order.packaging_cost) -
    toNumber(order.extra_cost) -
    toNumber(order.tax_amount)
  );
}
